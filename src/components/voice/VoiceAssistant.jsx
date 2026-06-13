/**
 * VoiceAssistant — Widget vocal temps-réel pour JS-Innov.IA Cockpit
 * 
 * Utilise l'OpenAI Realtime API (gpt-4o-realtime-preview)
 * Architecture :
 *   1. Demande un token éphémère au backend (/realtime/session)
 *   2. Ouvre une WebSocket directe vers wss://api.openai.com/v1/realtime
 *   3. Stream audio micro → OpenAI → audio réponse
 * 
 * ⚠️ La clé OPENAI_API_KEY reste CÔTÉ SERVEUR (backend.jsinnovia.com)
 */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader2, X, PhoneCall } from 'lucide-react';

// ── Config ────────────────────────────────────────────────────────────────────
const BACKEND_URL = import.meta.env.VITE_AGENT_URL || 'https://jsinnovia-agent-production.up.railway.app';
const AGENT_KEY   = import.meta.env.VITE_AGENT_KEY  || 'jsinnovia-agent-2026';
const REALTIME_URL = 'wss://api.openai.com/v1/realtime';

// ── Styles ────────────────────────────────────────────────────────────────────
const C = {
  bg:    '#06090F',
  card:  'rgba(10,22,40,0.95)',
  cyan:  '#00B4D8',
  gold:  '#D4AF37',
  white: '#FFFFFF',
  muted: 'rgba(168,184,204,0.6)',
  red:   '#FF4D4D',
  green: '#00E676',
};

// ── Statuts ───────────────────────────────────────────────────────────────────
const STATUS = {
  IDLE:        'idle',
  CONNECTING:  'connecting',
  READY:       'ready',
  LISTENING:   'listening',
  SPEAKING:    'speaking',
  ERROR:       'error',
};

const STATUS_LABEL = {
  idle:       'Prêt',
  connecting: 'Connexion…',
  ready:      'Connecté — Parlez !',
  listening:  'Je vous écoute…',
  speaking:   'Julien AI répond…',
  error:      'Erreur de connexion',
};

const STATUS_COLOR = {
  idle:       C.muted,
  connecting: C.gold,
  ready:      C.cyan,
  listening:  C.green,
  speaking:   C.cyan,
  error:      C.red,
};

// ── Composant principal ───────────────────────────────────────────────────────
export default function VoiceAssistant({ onClose }) {
  const [status, setStatus]         = useState(STATUS.IDLE);
  const [transcript, setTranscript] = useState([]);
  const [isMuted, setIsMuted]       = useState(false);
  const [voice, setVoice]           = useState('coral');
  const [error, setError]           = useState(null);

  const wsRef        = useRef(null);
  const audioCtxRef  = useRef(null);
  const streamRef    = useRef(null);
  const processorRef = useRef(null);
  const audioQueueRef = useRef([]);
  const isPlayingRef  = useRef(false);
  const transcriptEndRef = useRef(null);

  // ── Scroll auto ──
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // ── Cleanup au démontage ──
  useEffect(() => {
    return () => disconnect();
  }, []);

  // ── Obtenir le token éphémère du backend ──
  const getEphemeralToken = async () => {
    const resp = await fetch(`${BACKEND_URL}/realtime/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-agent-key': AGENT_KEY,
      },
      body: JSON.stringify({ voice }),
    });
    if (!resp.ok) throw new Error(`Token session échoué: ${resp.status}`);
    const data = await resp.json();
    return data.client_secret?.value;
  };

  // ── Initialiser l'audio contexte ──
  const initAudio = async () => {
    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)({
      sampleRate: 24000,
    });
    streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    return streamRef.current;
  };

  // ── Encoder PCM16 pour OpenAI ──
  const encodeAudioToPCM16 = (float32Array) => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      const val = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, val < 0 ? val * 0x8000 : val * 0x7FFF, true);
    }
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  };

  // ── Jouer l'audio PCM16 reçu d'OpenAI ──
  const playAudioDelta = useCallback((base64Audio) => {
    if (isMuted || !audioCtxRef.current) return;

    const binary = atob(base64Audio);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

    const pcm = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(pcm.length);
    for (let i = 0; i < pcm.length; i++) float32[i] = pcm[i] / 32768.0;

    const buffer = audioCtxRef.current.createBuffer(1, float32.length, 24000);
    buffer.copyToChannel(float32, 0);
    audioQueueRef.current.push(buffer);

    if (!isPlayingRef.current) playNext();
  }, [isMuted]);

  const playNext = useCallback(() => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }
    isPlayingRef.current = true;
    const buf = audioQueueRef.current.shift();
    const src = audioCtxRef.current.createBufferSource();
    src.buffer = buf;
    src.connect(audioCtxRef.current.destination);
    src.onended = playNext;
    src.start();
  }, []);

  // ── Connexion WebSocket Realtime ──
  const connect = async () => {
    setStatus(STATUS.CONNECTING);
    setError(null);

    try {
      // 1. Token éphémère
      const token = await getEphemeralToken();

      // 2. Audio contexte + micro
      const stream = await initAudio();

      // 3. WebSocket vers OpenAI Realtime
      const ws = new WebSocket(
        `${REALTIME_URL}?model=gpt-4o-realtime-preview-2024-12-17`,
        ['realtime', `openai-insecure-api-key.${token}`, 'openai-beta.realtime-v1']
      );

      ws.onopen = () => {
        setStatus(STATUS.READY);
        addMessage('system', '🔗 Connexion Realtime établie — Parlez maintenant !');

        // Configurer la session
        ws.send(JSON.stringify({
          type: 'session.update',
          session: {
            turn_detection: { type: 'server_vad' },
            input_audio_transcription: { model: 'whisper-1' },
            voice: voice,
          }
        }));

        // Démarrer la capture micro
        startMicCapture(stream, ws);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          handleRealtimeEvent(msg);
        } catch (e) {
          console.warn('Parse error:', e);
        }
      };

      ws.onerror = () => {
        setStatus(STATUS.ERROR);
        setError('Erreur WebSocket — vérifiez votre connexion');
      };

      ws.onclose = () => {
        if (status !== STATUS.IDLE) {
          setStatus(STATUS.IDLE);
          addMessage('system', 'Session terminée');
        }
      };

      wsRef.current = ws;

    } catch (err) {
      console.error('Connect error:', err);
      setStatus(STATUS.ERROR);
      setError(err.message || 'Impossible de se connecter');
    }
  };

  // ── Capture micro et envoi PCM16 ──
  const startMicCapture = (stream, ws) => {
    const source = audioCtxRef.current.createMediaStreamSource(stream);
    const processor = audioCtxRef.current.createScriptProcessor(4096, 1, 1);

    processor.onaudioprocess = (e) => {
      if (ws.readyState !== WebSocket.OPEN) return;
      const pcm = encodeAudioToPCM16(e.inputBuffer.getChannelData(0));
      ws.send(JSON.stringify({
        type: 'input_audio_buffer.append',
        audio: pcm,
      }));
    };

    source.connect(processor);
    processor.connect(audioCtxRef.current.destination);
    processorRef.current = processor;
  };

  // ── Gestion des events Realtime ──
  const handleRealtimeEvent = (msg) => {
    switch (msg.type) {
      case 'input_audio_buffer.speech_started':
        setStatus(STATUS.LISTENING);
        break;

      case 'input_audio_buffer.speech_stopped':
        setStatus(STATUS.SPEAKING);
        break;

      case 'conversation.item.input_audio_transcription.completed':
        if (msg.transcript) addMessage('user', msg.transcript);
        break;

      case 'response.audio.delta':
        if (msg.delta) playAudioDelta(msg.delta);
        break;

      case 'response.audio_transcript.delta':
        // Accumuler la transcription de la réponse
        setTranscript(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant' && last.streaming) {
            return [...prev.slice(0, -1), { ...last, text: last.text + msg.delta }];
          }
          return [...prev, { id: Date.now(), role: 'assistant', text: msg.delta, streaming: true }];
        });
        break;

      case 'response.audio_transcript.done':
        // Finaliser la réponse streaming
        setTranscript(prev =>
          prev.map(m => m.streaming ? { ...m, streaming: false } : m)
        );
        setStatus(STATUS.READY);
        break;

      case 'error':
        console.error('Realtime error:', msg.error);
        setError(msg.error?.message || 'Erreur API');
        setStatus(STATUS.ERROR);
        break;
    }
  };

  // ── Déconnexion ──
  const disconnect = () => {
    wsRef.current?.close();
    wsRef.current = null;

    processorRef.current?.disconnect();
    processorRef.current = null;

    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;

    audioCtxRef.current?.close();
    audioCtxRef.current = null;

    audioQueueRef.current = [];
    isPlayingRef.current = false;

    setStatus(STATUS.IDLE);
  };

  const addMessage = (role, text) => {
    setTranscript(prev => [...prev, { id: Date.now(), role, text }]);
  };

  const isConnected = [STATUS.READY, STATUS.LISTENING, STATUS.SPEAKING].includes(status);

  // ── Rendu ──
  return (
    <div style={{
      position: 'fixed', bottom: 90, right: 20, zIndex: 9999,
      width: 'clamp(300px, 90vw, 420px)',
      background: C.card,
      border: `1.5px solid ${STATUS_COLOR[status]}55`,
      borderRadius: 20,
      boxShadow: `0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px ${STATUS_COLOR[status]}22`,
      fontFamily: "'Inter', sans-serif",
      overflow: 'hidden',
      backdropFilter: 'blur(12px)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px',
        borderBottom: `1px solid rgba(0,180,216,0.15)`,
        background: 'rgba(0,0,0,0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: STATUS_COLOR[status],
            boxShadow: `0 0 8px ${STATUS_COLOR[status]}`,
            animation: status === STATUS.LISTENING ? 'pulse 1s infinite' : 'none',
          }} />
          <span style={{ color: C.white, fontWeight: 700, fontSize: '0.85rem' }}>
            🎤 Julien AI — Voix
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? 'Réactiver le son' : 'Couper le son'}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: isMuted ? C.red : C.muted, padding: 4 }}>
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          {onClose && (
            <button
              onClick={() => { disconnect(); onClose(); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: 4 }}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div style={{
        padding: '8px 16px',
        background: `${STATUS_COLOR[status]}11`,
        borderBottom: `1px solid ${STATUS_COLOR[status]}22`,
        fontSize: '0.72rem',
        color: STATUS_COLOR[status],
        fontWeight: 700,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        textAlign: 'center',
      }}>
        {error || STATUS_LABEL[status]}
      </div>

      {/* Transcript */}
      <div style={{
        height: 220, overflowY: 'auto', padding: '12px 14px',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {transcript.length === 0 && (
          <p style={{ color: C.muted, fontSize: '0.78rem', textAlign: 'center', marginTop: 40 }}>
            Appuyez sur le bouton micro pour démarrer une session vocale
          </p>
        )}
        {transcript.map(msg => (
          <div key={msg.id} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            <div style={{
              maxWidth: '80%',
              padding: '8px 12px',
              borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
              background: msg.role === 'user'
                ? `rgba(0,180,216,0.18)`
                : msg.role === 'system'
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(212,175,55,0.12)',
              border: `1px solid ${
                msg.role === 'user' ? 'rgba(0,180,216,0.3)'
                : msg.role === 'system' ? 'rgba(255,255,255,0.08)'
                : 'rgba(212,175,55,0.25)'}`,
              color: msg.role === 'system' ? C.muted : C.white,
              fontSize: '0.78rem',
              lineHeight: 1.5,
              fontStyle: msg.role === 'system' ? 'italic' : 'normal',
            }}>
              {msg.text}
              {msg.streaming && (
                <span style={{ color: C.cyan, marginLeft: 4 }}>▋</span>
              )}
            </div>
          </div>
        ))}
        <div ref={transcriptEndRef} />
      </div>

      {/* Controls */}
      <div style={{
        padding: '14px 16px',
        borderTop: `1px solid rgba(0,180,216,0.1)`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
      }}>
        {/* Sélecteur voix */}
        {!isConnected && (
          <select
            value={voice}
            onChange={e => setVoice(e.target.value)}
            style={{
              background: 'rgba(10,22,40,0.8)', color: C.silver || C.muted,
              border: '1px solid rgba(0,180,216,0.2)', borderRadius: 8,
              padding: '6px 8px', fontSize: '0.72rem', cursor: 'pointer', flex: 1,
            }}>
            <option value="coral">Coral (recommandé)</option>
            <option value="alloy">Alloy (neutre)</option>
            <option value="echo">Echo (analytique)</option>
            <option value="shimmer">Shimmer (chaleureux)</option>
            <option value="sage">Sage (professionnel)</option>
          </select>
        )}

        {/* Bouton principal */}
        <button
          onClick={isConnected ? disconnect : connect}
          disabled={status === STATUS.CONNECTING}
          style={{
            flex: isConnected ? 1 : 'none',
            minWidth: 52, height: 52,
            borderRadius: '50%',
            border: 'none',
            cursor: status === STATUS.CONNECTING ? 'wait' : 'pointer',
            background: isConnected
              ? `radial-gradient(circle, ${C.red}33, ${C.red}66)`
              : `radial-gradient(circle, ${C.cyan}33, ${C.cyan}55)`,
            color: isConnected ? C.red : C.cyan,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: isConnected
              ? `0 0 20px ${C.red}44`
              : `0 0 20px ${C.cyan}44`,
            transition: 'all 0.2s',
          }}>
          {status === STATUS.CONNECTING
            ? <Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} />
            : isConnected
            ? <PhoneCall size={22} />
            : <Mic size={22} />}
        </button>

        {isConnected && (
          <span style={{ fontSize: '0.72rem', color: C.muted, textAlign: 'center' }}>
            Appuyez pour terminer
          </span>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.3)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}
