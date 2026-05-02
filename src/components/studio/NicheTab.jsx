import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Lock, Sparkles, Pause, Play, Trash2, ChevronDown, ChevronUp, Palette } from 'lucide-react';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';

const JS_INNOV_IDENTITY = {
  colors: '#D4AF37 (or), #8B5CF6 (violet), #06B6D4 (cyan), #10101a (fond)',
  fonts: 'Cinzel (titres), Inter (corps)',
  style: 'Dark premium, anthracite, effets lumineux dorés, glassmorphism',
  subtitleStyle: 'Texte doré en Cinzel, fond semi-transparent noir',
  videoStyle: 'Transitions fluides, cuts dynamiques, palette anthracite/or/violet',
  tone: 'Expert, premium, inspirant, innovation IA',
  ctaStyle: 'Boutons gradient or, CTA directs et percutants',
};

export default function NicheTab({ onGenerateContent, onRegenerateIdentity }) {
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [form, setForm] = useState({ name: '', bio: '', targetAudience: '', tone: '', goal: '' });
  const [generating, setGenerating] = useState(null);
  const qc = useQueryClient();

  const { data: niches = [], isLoading } = useQuery({
    queryKey: ['niches'],
    queryFn: () => base44.entities.Niche.list('-created_date', 50),
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const isJsInnov = data.name.toLowerCase().includes('js-innov') || data.name.toLowerCase().includes('jsinnov');
      const nicheData = {
        ...data,
        visualIdentityMode: isJsInnov ? 'locked' : 'generated',
        status: 'active',
        ...(isJsInnov ? JS_INNOV_IDENTITY : {}),
      };
      return base44.entities.Niche.create(nicheData);
    },
    onSuccess: () => { qc.invalidateQueries(['niches']); setShowForm(false); setForm({ name: '', bio: '', targetAudience: '', tone: '', goal: '' }); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Niche.update(id, data),
    onSuccess: () => qc.invalidateQueries(['niches']),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Niche.delete(id),
    onSuccess: () => qc.invalidateQueries(['niches']),
  });

  const handleGenerateIdentity = async (niche) => {
    setGenerating(niche.id);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un expert en identité visuelle TikTok. Crée une identité visuelle unique et cohérente pour cette niche TikTok :
Nom : ${niche.name}
Bio : ${niche.bio || ''}
Audience : ${niche.targetAudience || ''}
Ton : ${niche.tone || ''}
Objectif : ${niche.goal || ''}

Génère une identité visuelle TikTok complète et distinctive. Sois très précis et créatif.`,
      response_json_schema: {
        type: 'object',
        properties: {
          colors: { type: 'string' },
          fonts: { type: 'string' },
          style: { type: 'string' },
          subtitleStyle: { type: 'string' },
          videoStyle: { type: 'string' },
          ctaStyle: { type: 'string' },
          rules: { type: 'string' },
        }
      }
    });
    await updateMutation.mutateAsync({ id: niche.id, data: result });
    setGenerating(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Mes niches TikTok</h2>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.38)' }}>Chaque niche a son identité visuelle et sa stratégie de contenu</p>
        </div>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-black text-sm"
          style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
          <Plus className="w-4 h-4" /> Nouvelle niche
        </motion.button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="p-6 rounded-2xl space-y-4"
            style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.25)' }}>
            <h3 className="font-black text-white text-sm">Créer une nouvelle niche</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { key: 'name', label: 'Nom de la niche *', placeholder: 'ex: Recettes véganes, JS-Innov.IA...' },
                { key: 'targetAudience', label: 'Audience cible', placeholder: 'ex: 18-35 ans, entrepreneurs...' },
                { key: 'tone', label: 'Ton', placeholder: 'ex: Fun, Sérieux, Expert...' },
                { key: 'goal', label: 'Objectif', placeholder: 'ex: Générer des leads, Notoriété...' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-bold mb-1 block" style={{ color: 'rgba(212,175,55,0.7)' }}>{f.label}</label>
                  <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none text-white"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }} />
                </div>
              ))}
            </div>
            <div>
              <label className="text-xs font-bold mb-1 block" style={{ color: 'rgba(212,175,55,0.7)' }}>Bio courte</label>
              <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                placeholder="Décrivez la niche en quelques mots..."
                rows={2}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none text-white resize-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>
            {form.name && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                style={{ background: form.name.toLowerCase().includes('js-innov') ? 'rgba(212,175,55,0.08)' : 'rgba(139,92,246,0.08)', border: `1px solid ${form.name.toLowerCase().includes('js-innov') ? 'rgba(212,175,55,0.25)' : 'rgba(139,92,246,0.25)'}` }}>
                {form.name.toLowerCase().includes('js-innov') ? (
                  <><Lock className="w-3.5 h-3.5" style={{ color: GOLD }} />
                    <span style={{ color: GOLD }}>Identité visuelle verrouillée — JS-INNOV.IA utilisera toujours ses couleurs et polices officielles.</span></>
                ) : (
                  <><Sparkles className="w-3.5 h-3.5" style={{ color: PURPLE }} />
                    <span style={{ color: PURPLE }}>L'IA va générer une identité visuelle unique pour cette niche.</span></>
                )}
              </div>
            )}
            <div className="flex gap-3">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => createMutation.mutate(form)}
                disabled={!form.name || createMutation.isPending}
                className="px-5 py-2.5 rounded-xl font-black text-black text-sm disabled:opacity-40"
                style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
                {createMutation.isPending ? 'Création...' : 'Créer la niche'}
              </motion.button>
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{ color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>Annuler</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Niches list */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-32 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />)}
        </div>
      ) : niches.length === 0 ? (
        <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Aucune niche créée. Commencez par créer votre première niche.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {niches.map(niche => (
            <motion.div key={niche.id} layout
              className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid ${niche.status === 'paused' ? 'rgba(255,255,255,0.06)' : niche.visualIdentityMode === 'locked' ? 'rgba(212,175,55,0.28)' : 'rgba(139,92,246,0.25)'}` }}>
              <div className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: niche.visualIdentityMode === 'locked' ? 'rgba(212,175,55,0.12)' : 'rgba(139,92,246,0.12)' }}>
                  {niche.visualIdentityMode === 'locked' ? <Lock className="w-5 h-5" style={{ color: GOLD }} /> : <Palette className="w-5 h-5" style={{ color: PURPLE }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-white">{niche.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                      style={{ background: niche.status === 'active' ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.06)', color: niche.status === 'active' ? '#22c55e' : 'rgba(255,255,255,0.4)' }}>
                      {niche.status === 'active' ? '● Actif' : '⏸ Pausé'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                      style={{ background: niche.visualIdentityMode === 'locked' ? 'rgba(212,175,55,0.1)' : 'rgba(139,92,246,0.1)', color: niche.visualIdentityMode === 'locked' ? GOLD : PURPLE }}>
                      {niche.visualIdentityMode === 'locked' ? '🔒 Identité verrouillée' : '✨ Identité IA'}
                    </span>
                  </div>
                  {niche.bio && <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{niche.bio}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Generate content */}
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                    onClick={() => onGenerateContent(niche)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-black"
                    style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
                    <Sparkles className="w-3.5 h-3.5" /> Générer
                  </motion.button>
                  {/* Regen identity */}
                  {niche.visualIdentityMode === 'generated' && (
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                      onClick={() => handleGenerateIdentity(niche)}
                      disabled={generating === niche.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-40"
                      style={{ background: 'rgba(139,92,246,0.15)', color: PURPLE, border: `1px solid rgba(139,92,246,0.3)` }}>
                      <Palette className="w-3.5 h-3.5" /> {generating === niche.id ? '...' : 'Identité'}
                    </motion.button>
                  )}
                  {/* Expand */}
                  <button onClick={() => setExpanded(expanded === niche.id ? null : niche.id)}
                    className="p-1.5 rounded-lg" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {expanded === niche.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {/* Pause/Resume */}
                  <button onClick={() => updateMutation.mutate({ id: niche.id, data: { status: niche.status === 'active' ? 'paused' : 'active' } })}
                    className="p-1.5 rounded-lg" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {niche.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button onClick={() => deleteMutation.mutate(niche.id)} className="p-1.5 rounded-lg" style={{ color: 'rgba(239,68,68,0.5)' }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <AnimatePresence>
                {expanded === niche.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="border-t px-5 pb-5 pt-4 grid grid-cols-1 md:grid-cols-2 gap-3"
                    style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    {[
                      { label: 'Couleurs', val: niche.colors },
                      { label: 'Polices', val: niche.fonts },
                      { label: 'Style visuel', val: niche.style },
                      { label: 'Sous-titres', val: niche.subtitleStyle },
                      { label: 'Style vidéo', val: niche.videoStyle },
                      { label: 'CTA Style', val: niche.ctaStyle },
                    ].filter(f => f.val).map(f => (
                      <div key={f.label} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <div className="text-xs font-bold mb-1" style={{ color: 'rgba(212,175,55,0.6)' }}>{f.label}</div>
                        <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{f.val}</div>
                      </div>
                    ))}
                    {!niche.colors && niche.visualIdentityMode === 'generated' && (
                      <div className="md:col-span-2 text-center py-3 text-xs" style={{ color: 'rgba(139,92,246,0.6)' }}>
                        Aucune identité générée. Cliquez sur "Identité" pour en créer une.
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}