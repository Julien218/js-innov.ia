import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell
} from 'recharts';
import { Search, Hash, MessageSquare, Zap, RefreshCw, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

const GOLD = '#D4AF37';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';
const GREEN = '#22c55e';
const RED = '#ef4444';
const AMBER = '#F59E0B';

// Compute a real-time SEO score for a GeneratedContent item
function computeSEOScore(content) {
  const scores = {};

  // 1. Hook quality (length, power words)
  const hook = content.hook || '';
  const powerWords = ['secret', 'incroyable', 'urgent', 'gratuit', 'exclusif', 'découvre', 'voici', 'attention', 'alerte', '?', '!'];
  const hookHasPower = powerWords.some(w => hook.toLowerCase().includes(w));
  const hookLen = hook.length;
  scores.hook = Math.min(100, (hookLen >= 30 && hookLen <= 100 ? 40 : hookLen > 10 ? 20 : 0) + (hookHasPower ? 40 : 0) + (hook.includes('?') || hook.includes('!') ? 20 : 0));

  // 2. Script completeness
  const script = content.script || '';
  const scriptWords = script.split(/\s+/).filter(Boolean).length;
  scores.script = Math.min(100, scriptWords >= 80 ? 100 : scriptWords >= 40 ? 70 : scriptWords >= 15 ? 40 : scriptWords > 0 ? 20 : 0);

  // 3. Hashtags (6-15 ideal)
  const tags = content.hashtags || [];
  scores.hashtags = tags.length >= 6 && tags.length <= 15 ? 100 : tags.length >= 3 ? 60 : tags.length > 0 ? 30 : 0;

  // 4. CTA presence
  const cta = content.cta || '';
  const ctaKeywords = ['lien', 'clique', 'abonne', 'like', 'commente', 'partage', 'bio', 'rejoins', 'découvre'];
  const ctaScore = ctaKeywords.some(w => cta.toLowerCase().includes(w)) ? 100 : cta.length > 10 ? 60 : cta.length > 0 ? 30 : 0;
  scores.cta = ctaScore;

  // 5. Visual suggestions
  const vis = content.visualSuggestions || '';
  scores.visuals = vis.length >= 50 ? 100 : vis.length >= 20 ? 60 : vis.length > 0 ? 30 : 0;

  const total = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length);
  return { scores, total };
}

function ScoreGauge({ value, size = 88 }) {
  const color = value >= 80 ? GREEN : value >= 60 ? AMBER : value >= 40 ? GOLD : RED;
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 88 88" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
        <motion.circle
          cx="44" cy="44" r={r} fill="none"
          stroke={color} strokeWidth="7" strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${dash} ${circ - dash}` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-black" style={{ color }}>{value}</span>
        <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.35)' }}>/100</span>
      </div>
    </div>
  );
}

function ContentSEORow({ content, index }) {
  const { scores, total } = computeSEOScore(content);
  const color = total >= 80 ? GREEN : total >= 60 ? AMBER : total >= 40 ? GOLD : RED;
  const [expanded, setExpanded] = React.useState(false);

  const radarData = [
    { axis: 'Hook', value: scores.hook },
    { axis: 'Script', value: scores.script },
    { axis: 'Hashtags', value: scores.hashtags },
    { axis: 'CTA', value: scores.cta },
    { axis: 'Visuels', value: scores.visuals },
  ];

  const suggestions = [];
  if (scores.hook < 60) suggestions.push('Ajouter un mot fort ou une question dans le hook');
  if (scores.script < 60) suggestions.push('Étoffer le script (viser 60-100 mots)');
  if (scores.hashtags < 60) suggestions.push('Utiliser entre 6 et 15 hashtags ciblés');
  if (scores.cta < 60) suggestions.push('Ajouter un appel à l\'action clair (lien bio, abonnement…)');
  if (scores.visuals < 60) suggestions.push('Décrire les suggestions visuelles plus précisément');

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid ${color}22` }}>
      {/* Row header */}
      <button className="w-full flex items-center gap-4 p-4 text-left" onClick={() => setExpanded(!expanded)}>
        <span className="text-sm font-black w-5 text-center" style={{ color: 'rgba(255,255,255,0.25)' }}>#{index + 1}</span>
        <ScoreGauge value={total} size={56} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">{content.hook}</p>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(212,175,55,0.5)' }}>{content.nicheName} · {content.status}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {suggestions.length === 0
            ? <CheckCircle2 className="w-4 h-4" style={{ color: GREEN }} />
            : <AlertCircle className="w-4 h-4" style={{ color: AMBER }} />}
          <span className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ background: `${color}15`, color }}>
            {total >= 80 ? 'Excellent' : total >= 60 ? 'Bon' : total >= 40 ? 'Moyen' : 'Faible'}
          </span>
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>▼</motion.span>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
          className="border-t px-4 pb-4 pt-3 grid grid-cols-1 md:grid-cols-2 gap-4"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          {/* Radar */}
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Analyse par critère</p>
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="axis" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                <Radar dataKey="value" stroke={color} fill={color} fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Score bars + suggestions */}
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Détail des scores</p>
            <div className="space-y-2 mb-3">
              {radarData.map(d => (
                <div key={d.axis} className="flex items-center gap-2">
                  <span className="text-xs w-16 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }}>{d.axis}</span>
                  <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <motion.div className="h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${d.value}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      style={{ background: d.value >= 80 ? GREEN : d.value >= 60 ? AMBER : d.value >= 40 ? GOLD : RED }} />
                  </div>
                  <span className="text-xs w-7 text-right" style={{ color: 'rgba(255,255,255,0.35)' }}>{d.value}</span>
                </div>
              ))}
            </div>
            {suggestions.length > 0 && (
              <div>
                <p className="text-xs font-semibold mb-1" style={{ color: AMBER }}>Suggestions :</p>
                <ul className="space-y-1">
                  {suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      <span style={{ color: AMBER }}>→</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {suggestions.length === 0 && (
              <div className="flex items-center gap-2 text-xs" style={{ color: GREEN }}>
                <CheckCircle2 className="w-4 h-4" /> Tous les critères sont optimisés !
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function SEOScoreDashboard() {
  const queryClient = useQueryClient();
  const { data: contents = [], isLoading, dataUpdatedAt } = useQuery({
    queryKey: ['generated-content-seo'],
    queryFn: () => base44.entities.GeneratedContent.list('-created_date', 100),
    refetchInterval: 30000, // auto-refresh every 30s
  });

  const [filter, setFilter] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('score_desc');

  const scored = useMemo(() => {
    return contents.map(c => ({ ...c, _seo: computeSEOScore(c) }));
  }, [contents]);

  const filtered = useMemo(() => {
    let list = filter === 'all' ? scored : scored.filter(c => c.status === filter);
    if (sortBy === 'score_desc') list = [...list].sort((a, b) => b._seo.total - a._seo.total);
    if (sortBy === 'score_asc') list = [...list].sort((a, b) => a._seo.total - b._seo.total);
    if (sortBy === 'date') list = [...list].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    return list;
  }, [scored, filter, sortBy]);

  // Global averages
  const avgScore = scored.length ? Math.round(scored.reduce((s, c) => s + c._seo.total, 0) / scored.length) : 0;
  const excellent = scored.filter(c => c._seo.total >= 80).length;
  const bon = scored.filter(c => c._seo.total >= 60 && c._seo.total < 80).length;
  const moyen = scored.filter(c => c._seo.total >= 40 && c._seo.total < 60).length;
  const faible = scored.filter(c => c._seo.total < 40).length;

  // Distribution chart
  const distData = [
    { label: 'Excellent', count: excellent, color: GREEN },
    { label: 'Bon', count: bon, color: AMBER },
    { label: 'Moyen', count: moyen, color: GOLD },
    { label: 'Faible', count: faible, color: RED },
  ];

  // Avg score by criteria
  const avgCriteria = ['hook', 'script', 'hashtags', 'cta', 'visuals'].map(k => ({
    axis: { hook: 'Hook', script: 'Script', hashtags: 'Hashtags', cta: 'CTA', visuals: 'Visuels' }[k],
    avg: scored.length ? Math.round(scored.reduce((s, c) => s + c._seo.scores[k], 0) / scored.length) : 0,
  }));

  const lastUpdate = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString('fr-BE') : '—';

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
        <RefreshCw className="w-6 h-6" style={{ color: GOLD }} />
      </motion.div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black text-white mb-1">Scores SEO en temps réel</h2>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>
            {scored.length} contenus analysés · Mis à jour à {lastUpdate}
          </p>
        </div>
        <button onClick={() => queryClient.invalidateQueries(['generated-content-seo'])}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: GOLD }}>
          <RefreshCw className="w-3.5 h-3.5" /> Actualiser
        </button>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="col-span-2 md:col-span-1 flex flex-col items-center justify-center p-5 rounded-2xl"
          style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid ${GOLD}25` }}>
          <ScoreGauge value={avgScore} size={80} />
          <p className="text-xs mt-2 font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Score moyen</p>
        </div>
        {[
          { label: 'Excellent', val: excellent, color: GREEN, icon: CheckCircle2 },
          { label: 'Bon', val: bon, color: AMBER, icon: TrendingUp },
          { label: 'Moyen', val: moyen, color: GOLD, icon: Zap },
          { label: 'Faible', val: faible, color: RED, icon: AlertCircle },
        ].map(k => (
          <motion.div key={k.label} whileHover={{ scale: 1.03 }}
            className="p-4 rounded-2xl text-center cursor-pointer"
            style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid ${k.color}20` }}
            onClick={() => setFilter('all')}>
            <k.icon className="w-5 h-5 mx-auto mb-1" style={{ color: k.color }} />
            <div className="text-2xl font-black" style={{ color: k.color }}>{k.val}</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{k.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Distribution bar */}
        <div className="p-5 rounded-2xl" style={{ background: 'rgba(10,8,22,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="font-black text-white text-sm mb-4 flex items-center gap-2">
            <Search className="w-4 h-4" style={{ color: CYAN }} /> Distribution des scores
          </h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={distData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#0e0e1e', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 10, color: 'white' }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {distData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Average by criteria */}
        <div className="p-5 rounded-2xl" style={{ background: 'rgba(10,8,22,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="font-black text-white text-sm mb-4 flex items-center gap-2">
            <Hash className="w-4 h-4" style={{ color: PURPLE }} /> Moyennes par critère
          </h3>
          <div className="space-y-2.5">
            {avgCriteria.map(d => {
              const c = d.avg >= 80 ? GREEN : d.avg >= 60 ? AMBER : d.avg >= 40 ? GOLD : RED;
              return (
                <div key={d.axis} className="flex items-center gap-3">
                  <span className="text-xs w-16 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }}>{d.axis}</span>
                  <div className="flex-1 h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <motion.div className="h-2.5 rounded-full"
                      initial={{ width: 0 }} animate={{ width: `${d.avg}%` }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                      style={{ background: c }} />
                  </div>
                  <span className="text-xs w-7 text-right font-bold" style={{ color: c }}>{d.avg}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters + list */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            { val: 'all', label: 'Tous' },
            { val: 'draft', label: 'Brouillons' },
            { val: 'to_review', label: 'À valider' },
            { val: 'approved', label: 'Approuvés' },
            { val: 'published', label: 'Publiés' },
          ].map(f => (
            <button key={f.val} onClick={() => setFilter(f.val)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: filter === f.val ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${filter === f.val ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.08)'}`,
                color: filter === f.val ? GOLD : 'rgba(255,255,255,0.4)',
              }}>{f.label}</button>
          ))}
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold outline-none"
          style={{ background: 'rgba(10,8,22,0.9)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
          <option value="score_desc">Meilleur score d'abord</option>
          <option value="score_asc">Score le plus faible</option>
          <option value="date">Plus récent</option>
        </select>
      </div>

      {/* Content list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-14" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-25" />
            <p>Aucun contenu dans ce filtre.</p>
          </div>
        )}
        {filtered.map((c, i) => <ContentSEORow key={c.id} content={c} index={i} />)}
      </div>
    </div>
  );
}