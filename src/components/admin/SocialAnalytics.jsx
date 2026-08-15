import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { platform } from '@/api/platformClient';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, Legend
} from 'recharts';
import { TrendingUp, Eye, Heart, MessageCircle, Share2, Users, Play, Image, RefreshCw } from 'lucide-react';

const GOLD = '#D4AF37';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';
const PINK = '#EC4899';
const GREEN = '#22c55e';

const TIKTOK_COLOR = '#010101';
const TIKTOK_ACCENT = '#69C9D0';
const INSTAGRAM_COLOR = '#E1306C';

function KpiCard({ label, val, icon: Icon, color, sub }) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} className="p-4 rounded-2xl flex flex-col gap-1"
      style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid ${color}22` }}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div className="text-2xl font-black" style={{ color }}>{val}</div>
      {sub && <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{sub}</div>}
    </motion.div>
  );
}

function PlatformBadge({ platform }) {
  const isTT = platform === 'tiktok';
  return (
    <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
      style={{ background: isTT ? 'rgba(105,201,208,0.15)' : 'rgba(225,48,108,0.15)', color: isTT ? TIKTOK_ACCENT : INSTAGRAM_COLOR }}>
      {isTT ? '♪ TikTok' : '◈ Instagram'}
    </span>
  );
}

export default function SocialAnalytics() {
  const [activeTab, setActiveTab] = useState('overview');

  const { data: ttData, isLoading: ttLoading, refetch: refetchTT } = useQuery({
    queryKey: ['tiktok-stats'],
    queryFn: () => platform.functions.invoke('getTikTokStats', {}).then(r => r.data),
    retry: false,
  });

  const { data: igData, isLoading: igLoading, refetch: refetchIG } = useQuery({
    queryKey: ['instagram-stats'],
    queryFn: () => platform.functions.invoke('getInstagramStats', {}).then(r => r.data),
    retry: false,
  });

  const isLoading = ttLoading || igLoading;

  // ── TikTok computed ──────────────────────────────────────────────────────
  const ttVideos = ttData?.videos || [];
  const ttProfile = ttData?.profile || {};
  const ttTotalViews = ttVideos.reduce((s, v) => s + (v.view_count || 0), 0);
  const ttTotalLikes = ttVideos.reduce((s, v) => s + (v.like_count || 0), 0);
  const ttTotalComments = ttVideos.reduce((s, v) => s + (v.comment_count || 0), 0);
  const ttTotalShares = ttVideos.reduce((s, v) => s + (v.share_count || 0), 0);
  const ttEngRate = ttTotalViews > 0 ? (((ttTotalLikes + ttTotalComments + ttTotalShares) / ttTotalViews) * 100).toFixed(2) : '0';

  // ── Instagram computed ───────────────────────────────────────────────────
  const igPosts = igData?.posts || [];
  const igProfile = igData?.profile || {};
  const igTotalLikes = igPosts.reduce((s, p) => s + (p.like_count || 0), 0);
  const igTotalComments = igPosts.reduce((s, p) => s + (p.comments_count || 0), 0);
  const igFollowers = igProfile.followers_count || 0;
  const igEngRate = igFollowers > 0 && igPosts.length > 0
    ? (((igTotalLikes + igTotalComments) / igPosts.length / igFollowers) * 100).toFixed(2) : '0';

  // ── Best content type on Instagram ──────────────────────────────────────
  const igByType = igPosts.reduce((acc, p) => {
    const t = p.media_type || 'IMAGE';
    if (!acc[t]) acc[t] = { count: 0, likes: 0, comments: 0 };
    acc[t].count++;
    acc[t].likes += p.like_count || 0;
    acc[t].comments += p.comments_count || 0;
    return acc;
  }, {});
  const igTypeData = Object.entries(igByType).map(([type, s]) => ({
    name: type === 'VIDEO' ? 'Vidéo' : type === 'CAROUSEL_ALBUM' ? 'Carousel' : 'Image',
    likes: s.count > 0 ? Math.round(s.likes / s.count) : 0,
    commentaires: s.count > 0 ? Math.round(s.comments / s.count) : 0,
    posts: s.count,
  }));

  // ── Comparison chart ─────────────────────────────────────────────────────
  const comparisonData = [
    { metric: 'Engagement %', tiktok: parseFloat(ttEngRate), instagram: parseFloat(igEngRate) },
    { metric: 'Likes moy.', tiktok: ttVideos.length > 0 ? Math.round(ttTotalLikes / ttVideos.length) : 0, instagram: igPosts.length > 0 ? Math.round(igTotalLikes / igPosts.length) : 0 },
    { metric: 'Comm. moy.', tiktok: ttVideos.length > 0 ? Math.round(ttTotalComments / ttVideos.length) : 0, instagram: igPosts.length > 0 ? Math.round(igTotalComments / igPosts.length) : 0 },
  ];

  // ── Top TikTok videos ─────────────────────────────────────────────────────
  const topTT = [...ttVideos].sort((a, b) => (b.view_count || 0) - (a.view_count || 0)).slice(0, 5);
  // ── Top IG posts ──────────────────────────────────────────────────────────
  const topIG = [...igPosts].sort((a, b) => ((b.like_count || 0) + (b.comments_count || 0)) - ((a.like_count || 0) + (a.comments_count || 0))).slice(0, 5);

  // ── Radar data ────────────────────────────────────────────────────────────
  const maxVal = (arr, key) => Math.max(...arr.map(x => x[key] || 0), 1);
  const normalize = (val, max) => max > 0 ? Math.round((val / max) * 100) : 0;
  const radarData = [
    { subject: 'Portée', tiktok: normalize(ttTotalViews, Math.max(ttTotalViews, 1)), instagram: normalize(igFollowers, Math.max(igFollowers, 1)) },
    { subject: 'Likes', tiktok: normalize(ttTotalLikes, Math.max(ttTotalLikes, igTotalLikes, 1)), instagram: normalize(igTotalLikes, Math.max(ttTotalLikes, igTotalLikes, 1)) },
    { subject: 'Commentaires', tiktok: normalize(ttTotalComments, Math.max(ttTotalComments, igTotalComments, 1)), instagram: normalize(igTotalComments, Math.max(ttTotalComments, igTotalComments, 1)) },
    { subject: 'Engagement', tiktok: parseFloat(ttEngRate), instagram: parseFloat(igEngRate) },
    { subject: 'Partages', tiktok: normalize(ttTotalShares, Math.max(ttTotalShares, 1)), instagram: 0 },
  ];

  const TABS = [
    { id: 'overview', label: 'Vue globale' },
    { id: 'tiktok', label: '♪ TikTok' },
    { id: 'instagram', label: '◈ Instagram' },
    { id: 'compare', label: '⚡ Comparaison' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4 py-8">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${GOLD} transparent ${GOLD} transparent` }} />
          <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Chargement des statistiques sociales…</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Analytics Social Media</h2>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>
            TikTok ({ttVideos.length} vidéos) · Instagram ({igPosts.length} publications)
          </p>
        </div>
        <button onClick={() => { refetchTT(); refetchIG(); }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
          <RefreshCw className="w-3.5 h-3.5" /> Actualiser
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: activeTab === t.id ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${activeTab === t.id ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.07)'}`,
              color: activeTab === t.id ? GOLD : 'rgba(255,255,255,0.45)',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ─────────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* KPI grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiCard label="Vues TikTok" val={ttTotalViews.toLocaleString()} icon={Eye} color={TIKTOK_ACCENT} sub={`${ttVideos.length} vidéos`} />
            <KpiCard label="Abonnés TikTok" val={(ttProfile.follower_count || 0).toLocaleString()} icon={Users} color={TIKTOK_ACCENT} sub="followers" />
            <KpiCard label="Abonnés Instagram" val={igFollowers.toLocaleString()} icon={Users} color={INSTAGRAM_COLOR} sub={`${igProfile.media_count || 0} posts`} />
            <KpiCard label="Engagement IG" val={`${igEngRate}%`} icon={TrendingUp} color={INSTAGRAM_COLOR} sub="par post / followers" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiCard label="Likes TikTok" val={ttTotalLikes.toLocaleString()} icon={Heart} color={PINK} sub="total" />
            <KpiCard label="Engagement TikTok" val={`${ttEngRate}%`} icon={TrendingUp} color={TIKTOK_ACCENT} />
            <KpiCard label="Likes Instagram" val={igTotalLikes.toLocaleString()} icon={Heart} color={INSTAGRAM_COLOR} sub="total" />
            <KpiCard label="Commentaires IG" val={igTotalComments.toLocaleString()} icon={MessageCircle} color={PURPLE} sub="total" />
          </div>

          {/* Radar chart */}
          <div className="p-5 rounded-2xl" style={{ background: 'rgba(10,8,22,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h3 className="font-black text-white text-sm mb-4">Comparaison globale des plateformes</h3>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                <Radar name="TikTok" dataKey="tiktok" stroke={TIKTOK_ACCENT} fill={TIKTOK_ACCENT} fillOpacity={0.18} />
                <Radar name="Instagram" dataKey="instagram" stroke={INSTAGRAM_COLOR} fill={INSTAGRAM_COLOR} fillOpacity={0.18} />
                <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#0e0e1e', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 10, color: 'white' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Instagram content type performance */}
          {igTypeData.length > 0 && (
            <div className="p-5 rounded-2xl" style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid rgba(225,48,108,0.18)` }}>
              <h3 className="font-black text-white text-sm mb-1">Quel type de contenu performe le mieux sur Instagram ?</h3>
              <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>Likes & commentaires moyens par type</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={igTypeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#0e0e1e', border: '1px solid rgba(225,48,108,0.2)', borderRadius: 10, color: 'white' }} />
                  <Bar dataKey="likes" name="Likes moy." fill={INSTAGRAM_COLOR} radius={[5,5,0,0]} />
                  <Bar dataKey="commentaires" name="Comm. moy." fill={PURPLE} radius={[5,5,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* ── TIKTOK ───────────────────────────────────────────────────────── */}
      {activeTab === 'tiktok' && (
        <div className="space-y-4">
          {ttData?.error ? (
            <div className="p-4 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
              Erreur TikTok : {ttData.error}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <KpiCard label="Followers" val={(ttProfile.follower_count || 0).toLocaleString()} icon={Users} color={TIKTOK_ACCENT} />
                <KpiCard label="Vidéos totales" val={ttProfile.video_count || 0} icon={Play} color={TIKTOK_ACCENT} />
                <KpiCard label="Vues totales" val={ttTotalViews.toLocaleString()} icon={Eye} color={TIKTOK_ACCENT} />
                <KpiCard label="Taux engagement" val={`${ttEngRate}%`} icon={TrendingUp} color={GOLD} />
              </div>

              {/* Bar chart vues */}
              {ttVideos.length > 0 && (
                <div className="p-5 rounded-2xl" style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid rgba(105,201,208,0.18)` }}>
                  <h3 className="font-black text-white text-sm mb-4">Vues par vidéo (top 10)</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={topTT.map(v => ({ name: (v.title || 'Vidéo').slice(0, 14) + '…', vues: v.view_count || 0, likes: v.like_count || 0 }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} />
                      <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} />
                      <Tooltip contentStyle={{ background: '#0e0e1e', border: '1px solid rgba(105,201,208,0.2)', borderRadius: 10, color: 'white' }} />
                      <Bar dataKey="vues" fill={TIKTOK_ACCENT} radius={[5,5,0,0]} />
                      <Bar dataKey="likes" fill={PINK} radius={[5,5,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Top videos list */}
              <div className="p-5 rounded-2xl" style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid rgba(105,201,208,0.15)` }}>
                <h3 className="font-black text-white text-sm mb-3">Top vidéos</h3>
                <div className="space-y-2">
                  {topTT.map((v, i) => {
                    const eng = v.view_count > 0 ? (((v.like_count||0)+(v.comment_count||0)+(v.share_count||0))/v.view_count*100).toFixed(1) : 0;
                    return (
                      <div key={v.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <span className="text-lg font-black w-5" style={{ color: i === 0 ? GOLD : 'rgba(255,255,255,0.25)' }}>#{i+1}</span>
                        {v.cover_image_url && <img src={v.cover_image_url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">{v.title || 'Sans titre'}</p>
                          <div className="flex gap-3 text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                            <span><Eye className="w-3 h-3 inline mr-0.5" />{(v.view_count||0).toLocaleString()}</span>
                            <span><Heart className="w-3 h-3 inline mr-0.5" />{(v.like_count||0).toLocaleString()}</span>
                            <span><Share2 className="w-3 h-3 inline mr-0.5" />{(v.share_count||0).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="text-sm font-black" style={{ color: TIKTOK_ACCENT }}>{eng}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── INSTAGRAM ────────────────────────────────────────────────────── */}
      {activeTab === 'instagram' && (
        <div className="space-y-4">
          {igData?.error ? (
            <div className="p-4 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
              Erreur Instagram : {igData.error}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <KpiCard label="Abonnés" val={igFollowers.toLocaleString()} icon={Users} color={INSTAGRAM_COLOR} />
                <KpiCard label="Publications" val={igProfile.media_count || 0} icon={Image} color={INSTAGRAM_COLOR} />
                <KpiCard label="Likes totaux" val={igTotalLikes.toLocaleString()} icon={Heart} color={PINK} sub={`${igPosts.length} posts analysés`} />
                <KpiCard label="Engagement moy." val={`${igEngRate}%`} icon={TrendingUp} color={GOLD} sub="par post / followers" />
              </div>

              {/* Type breakdown */}
              {igTypeData.length > 0 && (
                <div className="p-5 rounded-2xl" style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid rgba(225,48,108,0.18)` }}>
                  <h3 className="font-black text-white text-sm mb-4">Performance par type de contenu</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    {igTypeData.map(t => (
                      <div key={t.name} className="p-4 rounded-xl text-center"
                        style={{ background: 'rgba(225,48,108,0.06)', border: '1px solid rgba(225,48,108,0.15)' }}>
                        <div className="text-2xl mb-1">{t.name === 'Vidéo' ? '🎬' : t.name === 'Carousel' ? '🎠' : '🖼️'}</div>
                        <div className="font-black text-white text-lg">{t.likes}</div>
                        <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>likes moy. · {t.posts} posts</div>
                      </div>
                    ))}
                  </div>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={igTypeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                      <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: '#0e0e1e', border: '1px solid rgba(225,48,108,0.2)', borderRadius: 10, color: 'white' }} />
                      <Bar dataKey="likes" name="Likes moy." fill={INSTAGRAM_COLOR} radius={[5,5,0,0]} />
                      <Bar dataKey="commentaires" name="Comm. moy." fill={PURPLE} radius={[5,5,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Top posts */}
              <div className="p-5 rounded-2xl" style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid rgba(225,48,108,0.15)` }}>
                <h3 className="font-black text-white text-sm mb-3">Top publications</h3>
                <div className="space-y-2">
                  {topIG.map((p, i) => (
                    <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <span className="text-lg font-black w-5" style={{ color: i === 0 ? GOLD : 'rgba(255,255,255,0.25)' }}>#{i+1}</span>
                      {p.media_url && <img src={p.media_url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" onError={e => e.target.style.display='none'} />}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white truncate">{p.caption ? p.caption.slice(0, 60) + '…' : 'Sans légende'}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px]" style={{ color: PINK }}><Heart className="w-3 h-3 inline" /> {p.like_count}</span>
                          <span className="text-[10px]" style={{ color: PURPLE }}><MessageCircle className="w-3 h-3 inline" /> {p.comments_count}</span>
                          <PlatformBadge platform="instagram" />
                        </div>
                      </div>
                      <a href={p.permalink} target="_blank" rel="noopener noreferrer"
                        className="text-xs px-2 py-1 rounded-lg" style={{ color: INSTAGRAM_COLOR, border: '1px solid rgba(225,48,108,0.25)' }}>
                        Voir
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── COMPARAISON ──────────────────────────────────────────────────── */}
      {activeTab === 'compare' && (
        <div className="space-y-5">
          {/* Side by side KPIs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl space-y-3" style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid rgba(105,201,208,0.2)` }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-black text-base" style={{ color: TIKTOK_ACCENT }}>♪ TikTok</span>
              </div>
              {[
                { l: 'Abonnés', v: (ttProfile.follower_count||0).toLocaleString() },
                { l: 'Vues totales', v: ttTotalViews.toLocaleString() },
                { l: 'Likes totaux', v: ttTotalLikes.toLocaleString() },
                { l: 'Partages', v: ttTotalShares.toLocaleString() },
                { l: 'Engagement', v: `${ttEngRate}%` },
              ].map(r => (
                <div key={r.l} className="flex justify-between text-sm">
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>{r.l}</span>
                  <span className="font-bold" style={{ color: TIKTOK_ACCENT }}>{r.v}</span>
                </div>
              ))}
            </div>
            <div className="p-5 rounded-2xl space-y-3" style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid rgba(225,48,108,0.2)` }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-black text-base" style={{ color: INSTAGRAM_COLOR }}>◈ Instagram</span>
              </div>
              {[
                { l: 'Abonnés', v: igFollowers.toLocaleString() },
                { l: 'Publications', v: igProfile.media_count || 0 },
                { l: 'Likes totaux', v: igTotalLikes.toLocaleString() },
                { l: 'Commentaires', v: igTotalComments.toLocaleString() },
                { l: 'Engagement moy.', v: `${igEngRate}%` },
              ].map(r => (
                <div key={r.l} className="flex justify-between text-sm">
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>{r.l}</span>
                  <span className="font-bold" style={{ color: INSTAGRAM_COLOR }}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar chart comparaison */}
          <div className="p-5 rounded-2xl" style={{ background: 'rgba(10,8,22,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h3 className="font-black text-white text-sm mb-4">Engagement % & métriques moyennes</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={comparisonData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} />
                <YAxis dataKey="metric" type="category" width={90} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#0e0e1e', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 10, color: 'white' }} />
                <Bar dataKey="tiktok" name="TikTok" fill={TIKTOK_ACCENT} radius={[0,5,5,0]} />
                <Bar dataKey="instagram" name="Instagram" fill={INSTAGRAM_COLOR} radius={[0,5,5,0]} />
                <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Insight box */}
          <div className="p-5 rounded-2xl" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)' }}>
            <h3 className="font-black text-white text-sm mb-3">💡 Analyse automatique</h3>
            <div className="space-y-2 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {parseFloat(ttEngRate) > parseFloat(igEngRate) ? (
                <p>✅ <strong style={{ color: TIKTOK_ACCENT }}>TikTok</strong> génère un meilleur taux d'engagement ({ttEngRate}% vs {igEngRate}%). Priorisez la création vidéo courte.</p>
              ) : (
                <p>✅ <strong style={{ color: INSTAGRAM_COLOR }}>Instagram</strong> génère un meilleur taux d'engagement ({igEngRate}% vs {ttEngRate}%). Investissez dans le contenu Instagram.</p>
              )}
              {igTypeData.length > 0 && (() => {
                const best = [...igTypeData].sort((a,b) => b.likes - a.likes)[0];
                return best ? <p>📊 Sur Instagram, les <strong style={{ color: GOLD }}>{best.name}s</strong> performent le mieux avec {best.likes} likes moyens.</p> : null;
              })()}
              {ttVideos.length > 0 && <p>🎬 Vos {ttVideos.length} dernières vidéos TikTok totalisent <strong style={{ color: TIKTOK_ACCENT }}>{ttTotalViews.toLocaleString()} vues</strong>.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}