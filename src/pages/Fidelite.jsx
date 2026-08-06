import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Gift, Star, TrendingUp, Zap, Share2, Check, Copy, Crown, Rocket, Building2, ChevronRight, Sparkles,
  ArrowUpRight, Lock, RefreshCw, Award, Users
} from 'lucide-react';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const CYAN = '#06B6D4';
const PURPLE = '#7C3AED';
const GREEN = '#10B981';

// ── DONNÉES MOCK CLIENT ──────────────────────────────────────────────────
const MOCK_CLIENT = {
  prenom: 'Julien',
  entreprise: 'JS-Innov.IA',
  pack: 'business',
  points: 680,
  points_total: 1180,
  referral_code: 'JS-K7X2PQ',
  referrals_count: 2,
  member_since: 'Mars 2025',
  next_reward_at: '2026-08-01',
  rewards_claimed: ['audit_seo'],
  transactions: [
    { date: '12 Jul 2026', label: 'Commande Pack Business', points: +500, type: 'earn' },
    { date: '10 Jun 2026', label: 'Parrainage — Sophie M.', points: +200, type: 'earn' },
    { date: '05 Jun 2026', label: 'Parrainage — Marc D.', points: +200, type: 'earn' },
    { date: '01 Mai 2026', label: 'Audit SEO utilisé', points: -200, type: 'spend' },
    { date: '15 Mar 2026', label: 'Commande Pack Starter', points: +150, type: 'earn' },
    { date: '15 Mar 2026', label: 'Bonus bienvenue', points: +130, type: 'bonus' },
  ],
};

// ── PALIERS ──────────────────────────────────────────────────────────────
const TIERS = [
  { id: 'bronze', label: 'Bronze', min: 0, max: 499, color: '#CD7F32', icon: '🥉',
    perks: ['5% sur prochain pack', 'Support prioritaire', 'Newsletter exclusive'] },
  { id: 'silver', label: 'Silver', min: 500, max: 1199, color: '#C0C0C0', icon: '🥈',
    perks: ['10% sur prochain pack', 'Audit SEO gratuit', '1 publication bonus/mois', 'Rapport mensuel'] },
  { id: 'gold', label: 'Gold', min: 1200, max: 9999, color: GOLD, icon: '🥇',
    perks: ['15% sur prochain pack', 'Chatbot IA offert', 'Support 7j/7', 'Vidéo promo offerte', 'Accès bêta nouveautés'] },
];

// ── RÉCOMPENSES ──────────────────────────────────────────────────────────
const REWARDS = [
  { id: 'audit_seo', label: 'Audit SEO complet', points: 200, icon: TrendingUp, color: CYAN, desc: 'Analyse complète de votre référencement Google' },
  { id: 'post_bonus', label: '1 mois de posts offert', points: 300, icon: Zap, color: PURPLE, desc: '8 publications réseaux supplémentaires' },
  { id: 'chatbot', label: 'Chatbot IA basique', points: 600, icon: Sparkles, color: GOLD, desc: 'Widget IA intégré sur votre site' },
  { id: 'reduction_10', label: '-10% prochain pack', points: 800, icon: Gift, color: GREEN, desc: 'Réduction applicable sur tout renouvellement' },
  { id: 'video_promo', label: 'Vidéo promo 30s', points: 1000, icon: Star, color: '#EC4899', desc: 'Vidéo promotionnelle IA de votre commerce' },
];

const TABS = ['Vue globale', 'Récompenses', 'Parrainage', 'Historique'];

function getTier(pts) {
  return TIERS.find(t => pts >= t.min && pts <= t.max) || TIERS[0];
}
function getNextTier(tier) {
  return TIERS[TIERS.findIndex(t => t.id === tier.id) + 1];
}

// ── CARTE STATISTIQUE ────────────────────────────────────────────────────
function StatTile({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="rounded-2xl p-4" style={{
      background: 'linear-gradient(145deg,rgba(15,23,42,0.97),rgba(11,11,15,0.99))',
      border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-lg" style={{ background: `${color}18` }}>
          <Icon className="w-3.5 h-3.5" style={{ color }} />
        </div>
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
      {sub && <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{sub}</p>}
    </div>
  );
}

export default function Fidelite() {
  const client = MOCK_CLIENT;
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [claimedReward, setClaimedReward] = useState(null);

  const tier = getTier(client.points);
  const nextTier = getNextTier(tier);
  const pctToNext = nextTier ? Math.min((client.points / nextTier.min) * 100, 100) : 100;

  const copyCode = () => {
    navigator.clipboard.writeText(client.referral_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const claimReward = (reward) => {
    if (client.points >= reward.points && !client.rewards_claimed.includes(reward.id)) {
      setClaimedReward(reward.id);
      setTimeout(() => setClaimedReward(null), 2500);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4" style={{ color: '#fff' }}>
      <div className="max-w-2xl mx-auto">

        {/* ── HEADER ── */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
            style={{ background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.22)', color: GOLD }}>
            <Trophy className="w-3 h-3" /> Programme Fidélité
          </span>
          <h1 className="text-3xl font-black mb-1"
            style={{ background: `linear-gradient(135deg,#fff,${GOLD_L},${GOLD})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Bonjour, {client.prenom} 👋
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>{client.entreprise} · Membre depuis {client.member_since}</p>
        </motion.div>

        {/* ── CARTE PALIER PRINCIPAL ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-3xl p-6 mb-6"
          style={{
            background: `linear-gradient(135deg, ${tier.color}12, rgba(11,11,15,0.98))`,
            border: `1px solid ${tier.color}30`,
            boxShadow: `0 0 50px ${tier.color}12`,
          }}>
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{tier.icon}</span>
                <span className="text-lg font-black" style={{ color: tier.color }}>{tier.label}</span>
              </div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Votre statut actuel</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-white">{client.points.toLocaleString()}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>points disponibles</p>
            </div>
          </div>

          {/* Barre progression */}
          {nextTier && (
            <div>
              <div className="flex justify-between text-xs mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                <span style={{ color: tier.color }}>{tier.icon} {tier.label}</span>
                <span>{nextTier.min - client.points} pts pour {nextTier.icon} {nextTier.label}</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div className="h-full rounded-full"
                  initial={{ width: 0 }} animate={{ width: `${pctToNext}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  style={{ background: `linear-gradient(90deg, ${tier.color}, ${nextTier.color})` }} />
              </div>
              <p className="text-xs mt-1.5 text-right" style={{ color: 'rgba(255,255,255,0.25)' }}>
                {client.points_total.toLocaleString()} pts cumulés au total
              </p>
            </div>
          )}

          {/* Avantages tier */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tier.perks.map(perk => (
              <span key={perk} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                style={{ background: `${tier.color}12`, color: 'rgba(255,255,255,0.6)', border: `1px solid ${tier.color}20` }}>
                <Check className="w-3 h-3" style={{ color: tier.color }} />{perk}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ── STATS RAPIDES ── */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatTile icon={Trophy} label="Points dispo" value={client.points} color={GOLD} sub="utilisables" />
          <StatTile icon={Users} label="Filleuls" value={client.referrals_count} color={CYAN} sub="+200 pts chacun" />
          <StatTile icon={Award} label="Récompenses" value={client.rewards_claimed.length} color={PURPLE} sub="utilisées" />
        </div>

        {/* ── TABS ── */}
        <div className="flex gap-1 p-1 rounded-2xl mb-6"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {TABS.map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all"
              style={{
                background: activeTab === i ? `linear-gradient(135deg,${GOLD}22,${GOLD}11)` : 'transparent',
                color: activeTab === i ? GOLD : 'rgba(255,255,255,0.35)',
                border: activeTab === i ? `1px solid ${GOLD}33` : '1px solid transparent',
              }}>{tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── TAB 0 : VUE GLOBALE ── */}
          {activeTab === 0 && (
            <motion.div key="tab0" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="flex flex-col gap-4">

              {/* Comment gagner des points */}
              <div className="rounded-3xl p-5"
                style={{ background: 'linear-gradient(145deg,rgba(15,23,42,0.97),rgba(11,11,15,0.99))', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 className="text-sm font-black text-white mb-4">Comment gagner des points ?</h3>
                <div className="flex flex-col gap-3">
                  {[
                    { icon: Rocket, label: 'Pack Starter', pts: '+150 pts', color: CYAN },
                    { icon: Building2, label: 'Pack Business', pts: '+500 pts', color: GOLD },
                    { icon: Crown, label: 'Pack InnovIA Premium', pts: '+1 200 pts', color: PURPLE },
                    { icon: Users, label: 'Parrainage réussi', pts: '+200 pts', color: GREEN },
                    { icon: RefreshCw, label: 'Renouvellement annuel', pts: '+100 pts bonus', color: '#EC4899' },
                    { icon: Star, label: 'Avis Google laissé', pts: '+50 pts', color: CYAN },
                  ].map(({ icon: Icon, label, pts, color }) => (
                    <div key={label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg" style={{ background: `${color}15` }}>
                          <Icon className="w-3.5 h-3.5" style={{ color }} />
                        </div>
                        <span className="text-xs text-white">{label}</span>
                      </div>
                      <span className="text-xs font-black" style={{ color }}>{pts}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prochain palier CTA */}
              {nextTier && (
                <div className="rounded-3xl p-5 flex items-center justify-between gap-4"
                  style={{ background: `${nextTier.color}08`, border: `1px solid ${nextTier.color}20` }}>
                  <div>
                    <p className="text-xs font-bold text-white mb-1">Plus que {nextTier.min - client.points} pts pour {nextTier.icon} {nextTier.label}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Parrainez 1 ami ou renouvelez pour y accéder</p>
                  </div>
                  <button onClick={() => setActiveTab(2)}
                    className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                    style={{ background: `${nextTier.color}18`, color: nextTier.color, border: `1px solid ${nextTier.color}30` }}>
                    Parrainer <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ── TAB 1 : RÉCOMPENSES ── */}
          {activeTab === 1 && (
            <motion.div key="tab1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="flex flex-col gap-3">
              <p className="text-xs text-center mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Vous avez <strong style={{ color: GOLD }}>{client.points} pts</strong> disponibles
              </p>
              {REWARDS.map(reward => {
                const Icon = reward.icon;
                const canAfford = client.points >= reward.points;
                const alreadyClaimed = client.rewards_claimed.includes(reward.id);
                const justClaimed = claimedReward === reward.id;
                return (
                  <motion.div key={reward.id} layout
                    className="rounded-2xl p-4"
                    style={{
                      background: canAfford && !alreadyClaimed ? `${reward.color}08` : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${canAfford && !alreadyClaimed ? reward.color + '25' : 'rgba(255,255,255,0.05)'}`,
                      opacity: alreadyClaimed ? 0.6 : 1,
                    }}>
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl flex-shrink-0"
                        style={{ background: canAfford ? `${reward.color}18` : 'rgba(255,255,255,0.05)' }}>
                        {canAfford && !alreadyClaimed ? (
                          <Icon className="w-5 h-5" style={{ color: reward.color }} />
                        ) : (
                          <Lock className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.2)' }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-white truncate">{reward.label}</p>
                        <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{reward.desc}</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <div className="h-1.5 rounded-full overflow-hidden flex-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <div className="h-full rounded-full transition-all" style={{
                              width: `${Math.min((client.points / reward.points) * 100, 100)}%`,
                              background: canAfford ? reward.color : 'rgba(255,255,255,0.15)'
                            }} />
                          </div>
                          <span className="text-xs font-bold flex-shrink-0" style={{ color: canAfford ? reward.color : 'rgba(255,255,255,0.3)' }}>
                            {reward.points} pts
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {alreadyClaimed ? (
                          <span className="text-xs px-3 py-1.5 rounded-full font-bold"
                            style={{ background: 'rgba(16,185,129,0.1)', color: GREEN, border: `1px solid ${GREEN}25` }}>✓ Utilisé</span>
                        ) : justClaimed ? (
                          <motion.span initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                            className="text-xs px-3 py-1.5 rounded-full font-bold"
                            style={{ background: `${GREEN}18`, color: GREEN, border: `1px solid ${GREEN}40` }}>🎉 Réclamé !</motion.span>
                        ) : (
                          <button onClick={() => claimReward(reward)}
                            disabled={!canAfford}
                            className="text-xs px-3 py-1.5 rounded-full font-bold transition-all"
                            style={{
                              background: canAfford ? `${reward.color}18` : 'rgba(255,255,255,0.04)',
                              color: canAfford ? reward.color : 'rgba(255,255,255,0.2)',
                              border: `1px solid ${canAfford ? reward.color + '30' : 'rgba(255,255,255,0.06)'}`,
                              cursor: canAfford ? 'pointer' : 'not-allowed',
                            }}>
                            {canAfford ? 'Utiliser' : `+${reward.points - client.points} pts`}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* ── TAB 2 : PARRAINAGE ── */}
          {activeTab === 2 && (
            <motion.div key="tab2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="flex flex-col gap-4">

              {/* Code parrainage */}
              <div className="rounded-3xl p-6"
                style={{ background: 'linear-gradient(145deg,rgba(6,182,212,0.08),rgba(11,11,15,0.99))', border: `1px solid ${CYAN}20` }}>
                <div className="text-center mb-5">
                  <Share2 className="w-8 h-8 mx-auto mb-3" style={{ color: CYAN }} />
                  <h3 className="text-base font-black text-white mb-1">Votre code de parrainage</h3>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    Chaque ami qui commande avec votre code vous rapporte <strong style={{ color: CYAN }}>+200 pts</strong> et lui offre <strong style={{ color: GREEN }}>50€ de remise</strong>
                  </p>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl mb-4"
                  style={{ background: 'rgba(255,255,255,0.04)', border: `1px dashed ${CYAN}40` }}>
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Code unique</p>
                    <p className="text-2xl font-black tracking-widest" style={{ color: CYAN }}>{client.referral_code}</p>
                  </div>
                  <motion.button whileTap={{ scale: 0.93 }} onClick={copyCode}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
                    style={{
                      background: copied ? `${GREEN}18` : `${CYAN}15`,
                      color: copied ? GREEN : CYAN,
                      border: `1px solid ${copied ? GREEN : CYAN}30`,
                    }}>
                    {copied ? <><Check className="w-3.5 h-3.5" /> Copié !</> : <><Copy className="w-3.5 h-3.5" /> Copier</>}
                  </motion.button>
                </div>
                {/* Partage */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'WhatsApp', color: '#25D366', emoji: '💬' },
                    { label: 'Email', color: CYAN, emoji: '📧' },
                    { label: 'Copier lien', color: PURPLE, emoji: '🔗' },
                  ].map(({ label, color, emoji }) => (
                    <button key={label} className="py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                      style={{ background: `${color}10`, color, border: `1px solid ${color}20` }}>
                      <span>{emoji}</span> {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats parrainage */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl p-4 text-center"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-3xl font-black mb-1" style={{ color: CYAN }}>{client.referrals_count}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Amis parrainés</p>
                </div>
                <div className="rounded-2xl p-4 text-center"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-3xl font-black mb-1" style={{ color: GOLD }}>{client.referrals_count * 200}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>pts gagnés via parrainage</p>
                </div>
              </div>

              {/* Paliers parrainage */}
              <div className="rounded-3xl p-5"
                style={{ background: 'linear-gradient(145deg,rgba(15,23,42,0.97),rgba(11,11,15,0.99))', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 className="text-sm font-black text-white mb-4">Bonus parrainage</h3>
                {[
                  { nb: 1, bonus: '+200 pts', unlocked: client.referrals_count >= 1 },
                  { nb: 3, bonus: '+100 pts bonus', unlocked: client.referrals_count >= 3 },
                  { nb: 5, bonus: '1 mois offert', unlocked: client.referrals_count >= 5 },
                  { nb: 10, bonus: 'Statut Gold garanti', unlocked: client.referrals_count >= 10 },
                ].map(({ nb, bonus, unlocked }) => (
                  <div key={nb} className="flex items-center justify-between py-2.5 border-b last:border-0"
                    style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                        style={{ background: unlocked ? `${GREEN}20` : 'rgba(255,255,255,0.05)', color: unlocked ? GREEN : 'rgba(255,255,255,0.25)' }}>
                        {nb}
                      </div>
                      <span className="text-xs text-white">{nb} ami{nb > 1 ? 's' : ''} parrainé{nb > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold" style={{ color: unlocked ? GREEN : 'rgba(255,255,255,0.35)' }}>{bonus}</span>
                      {unlocked && <Check className="w-3.5 h-3.5" style={{ color: GREEN }} />}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── TAB 3 : HISTORIQUE ── */}
          {activeTab === 3 && (
            <motion.div key="tab3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <div className="rounded-3xl overflow-hidden"
                style={{ background: 'linear-gradient(145deg,rgba(15,23,42,0.97),rgba(11,11,15,0.99))', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-white">Historique des points</h3>
                    <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: `${GOLD}12`, color: GOLD, border: `1px solid ${GOLD}25` }}>
                      {client.transactions.length} transactions
                    </span>
                  </div>
                </div>
                <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                  {client.transactions.map((tx, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ background: tx.type === 'earn' || tx.type === 'bonus' ? `${GREEN}15` : 'rgba(239,68,68,0.1)' }}>
                          {tx.type === 'earn' ? <TrendingUp className="w-3.5 h-3.5" style={{ color: GREEN }} /> :
                           tx.type === 'bonus' ? <Sparkles className="w-3.5 h-3.5" style={{ color: GOLD }} /> :
                           <Gift className="w-3.5 h-3.5" style={{ color: '#f87171' }} />}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">{tx.label}</p>
                          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{tx.date}</p>
                        </div>
                      </div>
                      <span className="text-sm font-black"
                        style={{ color: tx.points > 0 ? GREEN : '#f87171' }}>
                        {tx.points > 0 ? '+' : ''}{tx.points} pts
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* ── CTA BAS DE PAGE ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="mt-8 rounded-3xl p-5 flex items-center justify-between gap-4"
          style={{
            background: `linear-gradient(135deg, ${GOLD}10, ${PURPLE}08)`,
            border: `1px solid ${GOLD}20`,
          }}>
          <div>
            <p className="text-sm font-black text-white mb-0.5">Passez au pack supérieur</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Multipliez vos points et débloquez Gold 🥇</p>
          </div>
          <a href="/Commande" className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black flex-shrink-0 transition-all"
            style={{ background: `linear-gradient(135deg,#B8960C,${GOLD})`, color: '#000' }}>
            Upgrader <ChevronRight className="w-4 h-4" />
          </a>
        </motion.div>

      </div>
    </div>
  );
}
