import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { TrendingUp, Users, Heart, Video, Eye, MessageCircle, Share2, Loader2, AlertCircle } from 'lucide-react';

const TIKTOK_BLACK = '#010101';
const TIKTOK_PINK = '#EE1D52';
const TIKTOK_CYAN = '#69C9D0';

function StatPill({ icon: Icon, value, label, color }) {
  return (
    <div className="flex flex-col items-center p-4 rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}20` }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2"
        style={{ background: `${color}15`, border: `1px solid ${color}28` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div className="text-lg font-black text-white">{(value || 0).toLocaleString('fr-FR')}</div>
      <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</div>
    </div>
  );
}

function VideoCard({ video }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
      {video.cover_image_url && (
        <img src={video.cover_image_url} alt={video.title}
          className="w-12 h-16 object-cover rounded-lg flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-white truncate mb-1">{video.title || 'Vidéo sans titre'}</p>
        <div className="flex flex-wrap gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{(video.view_count || 0).toLocaleString('fr-FR')}</span>
          <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{(video.like_count || 0).toLocaleString('fr-FR')}</span>
          <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{(video.comment_count || 0).toLocaleString('fr-FR')}</span>
          <span className="flex items-center gap-1"><Share2 className="w-3 h-3" />{(video.share_count || 0).toLocaleString('fr-FR')}</span>
        </div>
      </div>
    </div>
  );
}

export default function TikTokStats() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    base44.functions.invoke('getTikTokStats', {})
      .then(res => setData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-6 rounded-2xl flex items-center justify-center gap-3"
      style={{ background: 'rgba(10,8,22,0.8)', border: `1px solid ${TIKTOK_PINK}20` }}>
      <Loader2 className="w-5 h-5 animate-spin" style={{ color: TIKTOK_PINK }} />
      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Chargement TikTok...</span>
    </div>
  );

  if (error) return (
    <div className="p-6 rounded-2xl flex items-center gap-3"
      style={{ background: 'rgba(10,8,22,0.8)', border: '1px solid rgba(239,68,68,0.2)' }}>
      <AlertCircle className="w-5 h-5 text-red-400" />
      <span className="text-sm text-red-400">Erreur TikTok : {error}</span>
    </div>
  );

  const { profile, videos } = data || {};

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl" style={{ background: 'rgba(10,8,22,0.8)', border: `1px solid ${TIKTOK_PINK}25` }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          {/* TikTok logo */}
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: TIKTOK_BLACK, border: `1px solid ${TIKTOK_PINK}40` }}>
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.8a8.18 8.18 0 004.78 1.52V6.87a4.85 4.85 0 01-1.01-.18z" fill={TIKTOK_PINK}/>
            </svg>
          </div>
          <div>
            <div className="font-black text-white text-sm">TikTok</div>
            {profile?.display_name && (
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>@{profile.display_name}</div>
            )}
          </div>
        </div>
        {profile?.avatar_url && (
          <img src={profile.avatar_url} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        <StatPill icon={Users} value={profile?.follower_count} label="Abonnés" color={TIKTOK_PINK} />
        <StatPill icon={TrendingUp} value={profile?.following_count} label="Suivis" color={TIKTOK_CYAN} />
        <StatPill icon={Video} value={profile?.video_count} label="Vidéos" color="#A855F7" />
        <StatPill icon={Heart} value={profile?.likes_count} label="J'aime" color="#F97316" />
      </div>

      {/* Recent videos */}
      {videos && videos.length > 0 && (
        <div>
          <h4 className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Dernières vidéos
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {videos.map(v => <VideoCard key={v.id} video={v} />)}
          </div>
        </div>
      )}
    </motion.div>
  );
}