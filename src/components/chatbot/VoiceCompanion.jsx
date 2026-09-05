import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Loader2, Mic, MicOff, Radio, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import ElynaAvatar3D from './ElynaAvatar3D';

const AVATAR = '/brand/companion/companion-avatar-256.webp';
const HISTORY_KEY = 'jsinnovia-voice-navigation-history';
const MAX_HISTORY = 8;

function readHistory() {
  try {
    const value = JSON.parse(window.sessionStorage.getItem(HISTORY_KEY) || '[]');
    return Array.isArray(value) ? value.map(String).filter(Boolean).slice(-MAX_HISTORY) : [];
  } catch {
    return [];
  }
}

function writePath(path) {
  try {
    const current = readHistory();
    if (current.at(-1) !== path) current.push(path);
    window.sessionStorage.setItem(HISTORY_KEY, JSON.stringify(current.slice(-MAX_HISTORY)));
  } catch {
    // La voix reste fonctionnelle lorsque le stockage de session est indisponible.
  }
}

function waitForIceGathering(peerConnection, timeout = 2200) {
  if (peerConnection.iceGatheringState === 'complete') return Promise.resolve();
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      peerConnection.removeEventListener('icegatheringstatechange', check);
      resolve();
    };
    const check = () => {
      if (peerConnection.iceGatheringState === 'complete') finish();
    };
    const timer = window.setTimeout(finish, timeout);
    peerConnection.addEventListener('icegatheringstatechange', check);
  });
}

function statusLabel(status) {
  if (status === 'connecting') return 'Connexion sécurisée…';
  if (status === 'listening') return 'Je vous écoute';
  if (status === 'thinking') return 'Je réfléchis…';
  if (status === 'speaking') return 'Elynea vous répond';
  if (status === 'error') return 'Connexion interrompue';
  return 'Parler avec Elynea';
}

export default function VoiceCompanion() {
  const reduceMotion = useReducedMotion();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [model, setModel] = useState('');
  const visitStartedRef = useRef(Date.now());
  const peerRef = useRef(null);
  const dataChannelRef = useRef(null);
  const streamRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    writePath(`${location.pathname}${location.search || ''}`);
  }, [location.pathname, location.search]);

  useEffect(() => () => stopVoice(), []);

  function avatarState() {
    if (status === 'listening') return 'listening';
    if (status === 'connecting' || status === 'thinking') return 'thinking';
    if (status === 'speaking') return 'speaking';
    if (status === 'error') return 'error';
    return 'idle';
  }

  function stopVoice() {
    dataChannelRef.current?.close?.();
    dataChannelRef.current = null;
    peerRef.current?.close?.();
    peerRef.current = null;
    streamRef.current?.getTracks?.().forEach((track) => track.stop());
    streamRef.current = null;
    if (audioRef.current) audioRef.current.srcObject = null;
    setModel('');
    setStatus('idle');
  }

  function handleRealtimeEvent(event) {
    let payload;
    try {
      payload = JSON.parse(event.data);
    } catch {
      return;
    }

    const type = String(payload?.type || '');
    if (type === 'error') {
      setError('La conversation vocale a rencontré un problème.');
      setStatus('error');
      return;
    }
    if (type.includes('speech_started')) {
      setStatus('listening');
      return;
    }
    if (type.includes('speech_stopped') || type === 'response.created') {
      setStatus('thinking');
      return;
    }
    if (type.includes('audio') && type.endsWith('.delta')) {
      setStatus('speaking');
      return;
    }
    if (type === 'response.done' || type.includes('audio.done')) {
      setStatus('listening');
    }
  }

  async function startVoice() {
    if (status !== 'idle' && status !== 'error') return;
    setError('');
    setIsOpen(true);
    setStatus('connecting');

    try {
      if (!navigator.mediaDevices?.getUserMedia || !window.RTCPeerConnection) {
        throw new Error('unsupported-browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });
      streamRef.current = stream;

      const pc = new RTCPeerConnection();
      peerRef.current = pc;
      stream.getAudioTracks().forEach((track) => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        if (!audioRef.current) return;
        audioRef.current.srcObject = event.streams[0];
        audioRef.current.play().catch(() => {});
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'connected') setStatus((current) => current === 'connecting' ? 'listening' : current);
        if (['failed', 'disconnected'].includes(pc.connectionState)) {
          setError('La liaison vocale a été interrompue.');
          setStatus('error');
        }
      };

      const dataChannel = pc.createDataChannel('oai-events');
      dataChannelRef.current = dataChannel;
      dataChannel.onmessage = handleRealtimeEvent;
      dataChannel.onopen = () => setStatus('listening');
      dataChannel.onerror = () => {
        setError('Le canal temps réel est indisponible.');
        setStatus('error');
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await waitForIceGathering(pc);

      const response = await fetch('/api/platform/functions/realtimeCall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sdp: pc.localDescription?.sdp || offer.sdp,
          pageContext: {
            path: `${location.pathname}${location.search || ''}`,
            pageTitle: document.title,
            recentPaths: readHistory(),
            visitSeconds: Math.round((Date.now() - visitStartedRef.current) / 1000),
          },
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result?.sdp) throw new Error(result?.error || 'realtime-call-failed');

      setModel(result.model || '');
      await pc.setRemoteDescription({ type: 'answer', sdp: result.sdp });
      setStatus('listening');
    } catch (voiceError) {
      console.warn('[elynea-voice]', voiceError?.message || voiceError);
      stopVoice();
      setIsOpen(true);
      setStatus('error');
      setError(
        voiceError?.name === 'NotAllowedError'
          ? 'Le microphone n’a pas été autorisé. Vous pouvez continuer avec le chat écrit.'
          : 'La voix temps réel est momentanément indisponible. Le chat écrit reste accessible.'
      );
    }
  }

  function closePanel() {
    stopVoice();
    setError('');
    setIsOpen(false);
  }

  return (
    <>
      <audio ref={audioRef} autoPlay playsInline className="hidden" aria-hidden="true" />

      {!isOpen && (
        <motion.button
          type="button"
          onClick={startVoice}
          whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          className="fixed bottom-[7.25rem] right-5 z-[69] flex items-center gap-2.5 rounded-full border border-cyan-300/25 bg-[#080b1f]/95 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_42px_rgba(0,0,0,.45),0_0_28px_rgba(0,180,255,.12)] backdrop-blur-xl transition-colors hover:border-amber-300/40 sm:bottom-[8rem] sm:right-7"
          aria-label="Parler avec Elynea"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-cyan-400/20 via-violet-500/20 to-amber-300/20">
            <Mic className="h-4 w-4 text-amber-200" aria-hidden="true" />
          </span>
          <span>Parler à Elynea</span>
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            className="fixed bottom-4 right-4 z-[85] w-[min(370px,calc(100vw-2rem))] overflow-hidden rounded-[26px] border border-amber-300/25 bg-[#080b1f]/95 shadow-[0_28px_90px_rgba(0,0,0,.65),0_0_42px_rgba(106,0,255,.12)] backdrop-blur-2xl"
            aria-live="polite"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(212,175,55,.14),transparent_34%),radial-gradient(circle_at_100%_30%,rgba(0,180,255,.12),transparent_38%)]" />
            <div className="relative flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-200/80">
                <Radio className="h-3.5 w-3.5" aria-hidden="true" />
                Voix temps réel
              </div>
              <button type="button" onClick={closePanel} className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white" aria-label="Fermer la conversation vocale">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="relative flex flex-col items-center px-5 pb-5 pt-4 text-center">
              <div className="relative h-28 w-28 overflow-hidden rounded-full border border-amber-300/35 bg-slate-950 shadow-[0_0_36px_rgba(212,175,55,.18)]">
                <ElynaAvatar3D state={avatarState()} fallbackSrc={AVATAR} className="h-full w-full rounded-full" alt="Elynea — Compagnon vocal JS-Innov.IA" />
              </div>

              <h2 className="mt-3 text-base font-semibold text-white">Elynea · by JS-Innov.IA</h2>
              <div className="mt-1 flex min-h-6 items-center justify-center gap-2 text-sm text-slate-300">
                {status === 'connecting' && <Loader2 className="h-4 w-4 animate-spin text-amber-300" aria-hidden="true" />}
                {status === 'listening' && <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" aria-hidden="true" />}
                {status === 'speaking' && <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" aria-hidden="true" />}
                <span>{statusLabel(status)}</span>
              </div>

              {error ? (
                <p className="mt-3 rounded-xl border border-red-300/15 bg-red-400/[0.06] px-3 py-2 text-xs leading-relaxed text-red-100">{error}</p>
              ) : (
                <p className="mt-3 max-w-xs text-xs leading-relaxed text-slate-400">
                  Le micro s’active uniquement après votre clic. Vous pouvez m’interrompre naturellement pendant la conversation.
                </p>
              )}

              {model && <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-slate-500">Realtime sécurisé · session active</p>}

              <div className="mt-4 flex w-full gap-2">
                {status === 'error' ? (
                  <button type="button" onClick={startVoice} className="flex-1 rounded-xl bg-gradient-to-r from-amber-300 to-yellow-200 px-4 py-2.5 text-sm font-bold text-slate-950">Réessayer</button>
                ) : (
                  <button type="button" onClick={closePanel} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.08]">
                    <MicOff className="h-4 w-4" aria-hidden="true" />
                    Terminer
                  </button>
                )}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
