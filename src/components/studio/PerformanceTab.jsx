import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { platform } from '@/api/platformClient';
import { TrendingUp, Eye, Heart, MessageCircle, Share2, Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const GOLD = '#D4AF37';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';

export default function PerformanceTab() {
  const { data: contents = [] } = useQuery({
    queryKey: ['generated-content'],
    queryFn: () => platform.entities.GeneratedContent.list('-created_date', 200),
  });

  const { data: niches = [] } = useQuery({
    queryKey: ['niches'],
    queryFn: () => platform.entities.Niche.list('-created_date', 50),
  });

  const published = contents.filter(c => c.status === 'published');
  const totalViews = published.reduce((s, c) => s + (c.views || 0), 0);
  const totalLikes = published.reduce((s, c) => s + (c.likes || 0), 0);
  const totalComments = published.reduce((s, c) => s + (c.comments || 0), 0);
  const totalShares = published.reduce((s, c) => s + (c.shares || 0), 0);
  const avgEngagement = totalViews > 0
    ? (((totalLikes + totalComments + totalShares) / totalViews) * 100).toFixed(1)
    : 0;

  // Per niche stats
  const nicheStats = niches.map(n => {
    const nContent = published.filter(c => c.nicheId === n.id);
    const views = nContent.reduce((s, c) => s + (c.views || 0), 0);
    const likes = nContent.reduce((s, c) => s + (c.likes || 0), 0);
    const eng = views > 0 ? (((likes + nContent.reduce((s,c)=>s+(c.comments||0),0) + nContent.reduce((s,c)=>s+(c.shares||0),0)) / views) * 100).toFixed(1) : 0;
    return { name: n.name.length > 12 ? n.name.slice(0, 12) + '…' : n.name, views, likes, engagement: parseFloat(eng), count: nContent.length };
  }).filter(n => n.count > 0);

  // Top content
  const topContent = [...published].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  // Content pipeline
  const pipeline = ['draft', 'to_review', 'approved', 'scheduled', 'published'].map(s => ({
    status: s,
    count: contents.filter(c => c.status === s).length,
  }));

  const STATUS_LABELS = { draft: 'Brouillon', to_review: 'À valider', approved: 'Approuvé', scheduled: 'Planifié', published: 'Publié' };
  const STATUS_COLORS = { draft: 'rgba(255,255,255,0.3)', to_review: '#F59E0B', approved: '#22c55e', scheduled: CYAN, published: GOLD };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-white mb-1">Performances & Analyses</h2>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>{published.length} contenus publiés analysés — données utilisées pour améliorer les prochaines générations</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { icon: Eye, label: 'Total vues', val: totalViews.toLocaleString(), color: CYAN },
          { icon: Heart, label: 'Total likes', val: totalLikes.toLocaleString(), color: '#EC4899' },
          { icon: MessageCircle, label: 'Commentaires', val: totalComments.toLocaleString(), color: PURPLE },
          { icon: Share2, label: 'Partages', val: totalShares.toLocaleString(), color: '#22c55e' },
          { icon: TrendingUp, label: 'Taux engagement', val: `${avgEngagement}%`, color: GOLD },
        ].map(kpi => (
          <motion.div key={kpi.label} whileHover={{ scale: 1.03 }}
            className="p-4 rounded-2xl text-center"
            style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid ${kpi.color}20` }}>
            <kpi.icon className="w-5 h-5 mx-auto mb-2" style={{ color: kpi.color }} />
            <div className="text-xl font-black" style={{ color: kpi.color }}>{kpi.val}</div>
            <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{kpi.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Pipeline */}
      <div className="p-5 rounded-2xl" style={{ background: 'rgba(10,8,22,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <h3 className="font-black text-white text-sm mb-4">Pipeline de contenu</h3>
        <div className="flex flex-wrap gap-3">
          {pipeline.map(p => (
            <div key={p.status} className="flex-1 min-w-[80px] text-center p-3 rounded-xl"
              style={{ background: `${STATUS_COLORS[p.status]}10`, border: `1px solid ${STATUS_COLORS[p.status]}25` }}>
              <div className="text-2xl font-black" style={{ color: STATUS_COLORS[p.status] }}>{p.count}</div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{STATUS_LABELS[p.status]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart by niche */}
      {nicheStats.length > 0 && (
        <div className="p-5 rounded-2xl" style={{ background: 'rgba(10,8,22,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="font-black text-white text-sm mb-4">Vues par niche</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={nicheStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#0e0e1e', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 12, color: 'white' }} />
              <Bar dataKey="views" fill={GOLD} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top content */}
      {topContent.length > 0 && (
        <div className="p-5 rounded-2xl" style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid rgba(212,175,55,0.18)` }}>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5" style={{ color: GOLD }} />
            <h3 className="font-black text-white text-sm">Top 5 contenus</h3>
          </div>
          <div className="space-y-3">
            {topContent.map((c, i) => {
              const eng = c.views > 0 ? (((c.likes || 0) + (c.comments || 0) + (c.shares || 0)) / c.views * 100).toFixed(1) : 0;
              return (
                <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <span className="text-lg font-black w-6 text-center" style={{ color: i === 0 ? GOLD : 'rgba(255,255,255,0.3)' }}>#{i+1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{c.hook}</p>
                    <p className="text-xs" style={{ color: 'rgba(212,175,55,0.5)' }}>{c.nicheName}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-black" style={{ color: CYAN }}>{(c.views || 0).toLocaleString()} vues</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{eng}% eng.</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {published.length === 0 && (
        <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Aucune donnée de performance. Publiez du contenu pour voir les analyses.</p>
        </div>
      )}
    </div>
  );
}