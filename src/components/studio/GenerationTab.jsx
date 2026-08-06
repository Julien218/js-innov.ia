import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Sparkles, Zap, Copy, Check } from 'lucide-react';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';

export default function GenerationTab({ preselectedNiche }) {
  const [selectedNicheId, setSelectedNicheId] = useState(preselectedNiche?.id || '');
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const qc = useQueryClient();

  const { data: niches = [] } = useQuery({
    queryKey: ['niches'],
    queryFn: () => base44.entities.Niche.list('-created_date', 50),
  });

  const { data: allContent = [] } = useQuery({
    queryKey: ['generated-content'],
    queryFn: () => base44.entities.GeneratedContent.list('-created_date', 20),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => base44.entities.GeneratedContent.create(data),
    onSuccess: () => qc.invalidateQueries(['generated-content']),
  });

  const selectedNiche = niches.find(n => n.id === selectedNicheId) || preselectedNiche;

  // Get last published content for this niche to improve
  const lastPerf = allContent.filter(c => c.nicheId === selectedNicheId && c.status === 'published' && c.views > 0).slice(0, 3);

  const handleGenerate = async () => {
    if (!selectedNiche) return;
    setGenerating(true);
    setResults(null);

    const perfContext = lastPerf.length > 0
      ? `\n\nPerformances des derniers contenus publiés pour améliorer ta génération:\n${lastPerf.map(c => `Hook: "${c.hook}" → ${c.views} vues, ${c.likes} likes, ${c.comments} commentaires, ${c.shares} partages`).join('\n')}`
      : '';

    const identityContext = selectedNiche.visualIdentityMode === 'locked'
      ? `\nIdentité visuelle OBLIGATOIRE (verrouillée) :\n- Couleurs : #D4AF37 (or), #8B5CF6 (violet), #06B6D4 (cyan), fond #10101a\n- Polices : Cinzel (titres), Inter (corps)\n- Style : Dark premium, anthracite, effets lumineux\n- Ton : Expert, premium, innovant`
      : selectedNiche.colors ? `\nIdentité visuelle de la niche :\n- Couleurs : ${selectedNiche.colors}\n- Polices : ${selectedNiche.fonts || 'Non défini'}\n- Style : ${selectedNiche.style || 'Non défini'}\n- CTA : ${selectedNiche.ctaStyle || 'Non défini'}` : '';

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un expert créateur de contenu TikTok viral. Génère du contenu optimisé pour cette niche.

Niche : ${selectedNiche.name}
Bio : ${selectedNiche.bio || ''}
Audience : ${selectedNiche.targetAudience || ''}
Ton : ${selectedNiche.tone || ''}
Objectif : ${selectedNiche.goal || ''}
Mots-clés : ${selectedNiche.keywords?.join(', ') || ''}
Mots interdits : ${selectedNiche.bannedWords?.join(', ') || 'aucun'}
Règles : ${selectedNiche.rules || ''}
${identityContext}
${perfContext}

Génère 5 hooks percutants, 3 scripts courts (15-30 secondes), 3 CTA, des hashtags performants, des suggestions visuelles et des recommandations de montage.
Les hooks doivent accrocher dans les 2 premières secondes. Les scripts doivent être concis et engageants.`,
      response_json_schema: {
        type: 'object',
        properties: {
          hooks: { type: 'array', items: { type: 'string' } },
          scripts: { type: 'array', items: { type: 'object', properties: { title: { type: 'string' }, content: { type: 'string' }, duration: { type: 'string' } } } },
          ctas: { type: 'array', items: { type: 'string' } },
          hashtags: { type: 'array', items: { type: 'string' } },
          visualSuggestions: { type: 'string' },
          editingTips: { type: 'string' },
        }
      }
    });

    setResults(result);
    setGenerating(false);
  };

  const handleSaveContent = async (hook, script, cta) => {
    await saveMutation.mutateAsync({
      nicheId: selectedNicheId,
      nicheName: selectedNiche?.name,
      hook,
      script: script?.content || script,
      cta,
      visualSuggestions: results?.visualSuggestions + '\n' + (results?.editingTips || ''),
      hashtags: results?.hashtags || [],
      status: 'to_review',
    });
  };

  const copy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-white mb-1">Génération IA de contenu TikTok</h2>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>Sélectionnez une niche et générez hooks, scripts, CTA et suggestions visuelles</p>
      </div>

      {/* Niche selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold mb-2 block" style={{ color: 'rgba(212,175,55,0.7)' }}>Niche active</label>
          <select value={selectedNicheId} onChange={e => setSelectedNicheId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none text-white"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.2)' }}>
            <option value="">-- Choisir une niche --</option>
            {niches.filter(n => n.status === 'active').map(n => (
              <option key={n.id} value={n.id}>{n.name}</option>
            ))}
          </select>
        </div>
        {selectedNiche && (
          <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-xs font-bold mb-1" style={{ color: GOLD }}>{selectedNiche.name}</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{selectedNiche.bio || 'Pas de bio'}</div>
            <div className="text-xs mt-1.5 flex items-center gap-1.5" style={{ color: selectedNiche.visualIdentityMode === 'locked' ? GOLD : PURPLE }}>
              {selectedNiche.visualIdentityMode === 'locked' ? '🔒' : '✨'}
              Identité {selectedNiche.visualIdentityMode === 'locked' ? 'verrouillée (JS-Innov.IA)' : 'générée par IA'}
            </div>
            {lastPerf.length > 0 && (
              <div className="text-xs mt-1.5" style={{ color: CYAN }}>⚡ {lastPerf.length} publication(s) analysée(s) pour améliorer la génération</div>
            )}
          </div>
        )}
      </div>

      <motion.button whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(212,175,55,0.4)' }} whileTap={{ scale: 0.97 }}
        onClick={handleGenerate}
        disabled={!selectedNicheId || generating}
        className="w-full py-4 rounded-2xl font-black text-black flex items-center justify-center gap-2 disabled:opacity-40"
        style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 25px rgba(212,175,55,0.25)` }}>
        {generating ? (
          <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Zap className="w-5 h-5" /></motion.div> Génération en cours...</>
        ) : (
          <><Sparkles className="w-5 h-5" /> Générer du contenu pour cette niche</>
        )}
      </motion.button>

      {/* Results */}
      <AnimatePresence>
        {results && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            {/* Hooks */}
            <div className="p-5 rounded-2xl" style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid rgba(212,175,55,0.2)` }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, color: '#000' }}>H</div>
                <h3 className="font-black text-white text-sm">5 Hooks TikTok</h3>
              </div>
              <div className="space-y-2">
                {results.hooks?.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-xl group" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
                    <span className="text-xs font-black mt-0.5 flex-shrink-0" style={{ color: GOLD }}>#{i+1}</span>
                    <span className="text-sm flex-1" style={{ color: 'rgba(255,255,255,0.75)' }}>{h}</span>
                    <button onClick={() => copy(h, `h${i}`)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded flex-shrink-0">
                      {copiedIdx === `h${i}` ? <Check className="w-4 h-4" style={{ color: '#22c55e' }} /> : <Copy className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.4)' }} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Scripts */}
            <div className="p-5 rounded-2xl" style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid rgba(139,92,246,0.2)` }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black" style={{ background: PURPLE, color: '#fff' }}>S</div>
                <h3 className="font-black text-white text-sm">3 Scripts (15-30s)</h3>
              </div>
              <div className="space-y-3">
                {results.scripts?.map((s, i) => (
                  <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black" style={{ color: PURPLE }}>{s.title} · {s.duration}</span>
                      <button onClick={() => copy(s.content, `s${i}`)} className="p-1 rounded">
                        {copiedIdx === `s${i}` ? <Check className="w-4 h-4" style={{ color: '#22c55e' }} /> : <Copy className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />}
                      </button>
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'rgba(255,255,255,0.65)' }}>{s.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs + Hashtags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl" style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid rgba(6,182,212,0.2)` }}>
                <h3 className="font-black text-white text-sm mb-3">3 CTA</h3>
                <div className="space-y-2">
                  {results.ctas?.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg group" style={{ background: 'rgba(6,182,212,0.05)' }}>
                      <span className="text-sm" style={{ color: CYAN }}>{c}</span>
                      <button onClick={() => copy(c, `c${i}`)} className="opacity-0 group-hover:opacity-100">
                        {copiedIdx === `c${i}` ? <Check className="w-3.5 h-3.5" style={{ color: '#22c55e' }} /> : <Copy className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.3)' }} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-5 rounded-2xl" style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid rgba(255,255,255,0.08)` }}>
                <h3 className="font-black text-white text-sm mb-3">Hashtags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {results.hashtags?.map((h, i) => (
                    <span key={i} onClick={() => copy(h, `ht${i}`)} className="cursor-pointer text-xs px-2 py-1 rounded-full transition-all hover:opacity-80"
                      style={{ background: 'rgba(212,175,55,0.1)', color: GOLD, border: '1px solid rgba(212,175,55,0.2)' }}>#{h}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual + editing */}
            <div className="p-5 rounded-2xl" style={{ background: 'rgba(10,8,22,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h3 className="font-black text-white text-sm mb-3">Suggestions visuelles & montage</h3>
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'rgba(255,255,255,0.55)' }}>{results.visualSuggestions}</p>
              {results.editingTips && (
                <div className="mt-3 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <p className="text-xs font-bold mb-1" style={{ color: PURPLE }}>Recommandations de montage</p>
                  <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'rgba(255,255,255,0.5)' }}>{results.editingTips}</p>
                </div>
              )}
            </div>

            {/* Save all to review */}
            {results.hooks?.length > 0 && results.scripts?.length > 0 && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={async () => {
                  for (let i = 0; i < Math.min(results.hooks.length, 5); i++) {
                    await handleSaveContent(results.hooks[i], results.scripts[i % results.scripts.length], results.ctas?.[i % (results.ctas?.length || 1)]);
                  }
                }}
                disabled={saveMutation.isPending}
                className="w-full py-3 rounded-xl font-black text-sm"
                style={{ background: 'rgba(212,175,55,0.1)', color: GOLD, border: '1px solid rgba(212,175,55,0.3)' }}>
                {saveMutation.isPending ? 'Enregistrement...' : '📋 Envoyer tout en révision (to_review)'}
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}