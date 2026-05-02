import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Package, Download, Globe, FileText, Clock, CheckCircle, AlertCircle,
  Loader2, LogIn, User, BarChart3, MessageCircle, ChevronRight,
  Folder, Image, Palette, Zap, Star, Bell
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';
const GREEN = '#22c55e';

const STATUS_CONFIG = {
  nouveau: { label: 'Nouveau', color: CYAN, icon: Clock },
  'en analyse': { label: 'En analyse', color: '#F59E0B', icon: Loader2 },
  'en cours': { label: 'En production', color: PURPLE, icon: Zap },
  terminé: { label: 'Livré', color: GREEN, icon: CheckCircle },
  refusé: { label: 'En attente', color: '#ef4444', icon: AlertCircle },
};

const DELIVERABLES = [
  { icon: Palette, label: 'Kit branding', desc: 'Logo + charte graphique', color: GOLD, available: true },
  { icon: Globe, label: 'Site web', desc: 'Lien vers votre site', color: CYAN, available: false },
  { icon: Image, label: 'Visuels réseaux', desc: '10 posts personnalisés', color: '#EC4899', available: false },
  { icon: FileText, label: 'Carte de visite', desc: 'Fichiers print HD', color: PURPLE, available: false },
];

export default function SaasClientDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const init = async () => {
      const authed = await base44.auth.isAuthenticated();
      if (!authed) { setLoading(false); return; }
      const me = await base44.auth.me();
      setUser(me);
      // Fetch leads/projects for this user
      const leads = await base44.entities.Lead.filter({ email: me.email }).catch(() => []);
      setProjects(leads);
      setLoading(false);
    };
    init();
  }, []);

  const handleLogin = () => base44.auth.redirectToLogin(window.location.pathname);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: GOLD }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 py-24">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center p-12 rounded-3xl relative overflow-hidden"
          style={{ background: 'rgba(10,8,22,0.95)', border: `1px solid rgba(212,175,55,0.25)` }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'rgba(212,175,55,0.1)', border: `2px solid rgba(212,175,55,0.3)` }}>
            <User className="w-10 h-10" style={{ color: GOLD }} />
          </div>
          <h2 className="text-2xl font-black text-white mb-3">Espace client</h2>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Connectez-vous pour accéder à vos projets, télécharger vos livrables et suivre l'avancement en temps réel.
          </p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-black text-sm"
            style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
            <LogIn className="w-4 h-4" /> Se connecter
          </motion.button>
          <div className="mt-6 pt-5 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Pas encore client ?{' '}
              <Link to="/saas-projet" className="underline" style={{ color: GOLD }}>Créer votre projet →</Link>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  const TABS = [
    { id: 'overview', label: 'Aperçu', icon: BarChart3 },
    { id: 'projects', label: 'Mes projets', icon: Folder },
    { id: 'livrables', label: 'Livrables', icon: Download },
    { id: 'historique', label: 'Historique', icon: Clock },
  ];

  return (
    <div className="min-h-screen px-5 py-16">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-white">Bonjour, {user.full_name?.split(' ')[0] || 'Client'} 👋</h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Votre espace client JS-Innov.IA</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(212,175,55,0.1)', border: `1px solid rgba(212,175,55,0.25)` }}>
              <Bell className="w-5 h-5" style={{ color: GOLD }} />
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${PURPLE})`, color: '#000' }}>
              {user.full_name?.[0] || 'C'}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: activeTab === t.id ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${activeTab === t.id ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.07)'}`,
                color: activeTab === t.id ? GOLD : 'rgba(255,255,255,0.5)',
              }}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}>

            {activeTab === 'overview' && (
              <div className="space-y-5">
                {/* KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: Folder, label: 'Projets actifs', val: projects.length, color: CYAN },
                    { icon: CheckCircle, label: 'Livrés', val: projects.filter(p => p.status === 'gagné').length, color: GREEN },
                    { icon: Download, label: 'Fichiers disponibles', val: projects.length > 0 ? 3 : 0, color: PURPLE },
                    { icon: Star, label: 'Satisfaction', val: '5/5', color: GOLD },
                  ].map(k => (
                    <div key={k.label} className="p-5 rounded-2xl text-center"
                      style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid ${k.color}20` }}>
                      <k.icon className="w-5 h-5 mx-auto mb-2" style={{ color: k.color }} />
                      <div className="text-xl font-black" style={{ color: k.color }}>{k.val}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{k.label}</div>
                    </div>
                  ))}
                </div>

                {/* Contact */}
                <div className="p-5 rounded-2xl flex items-center justify-between"
                  style={{ background: 'rgba(10,8,22,0.8)', border: `1px solid rgba(212,175,55,0.15)` }}>
                  <div>
                    <div className="font-black text-white text-sm mb-0.5">Besoin d'aide ou d'une modification ?</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Julien répond généralement sous 2h ouvrées.</div>
                  </div>
                  <a href="https://wa.me/32494119090" target="_blank" rel="noopener noreferrer">
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold"
                      style={{ background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.25)', color: '#25D366' }}>
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </button>
                  </a>
                </div>

                {projects.length === 0 && (
                  <div className="text-center py-12 rounded-2xl" style={{ background: 'rgba(10,8,22,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: GOLD }} />
                    <p className="text-white font-bold mb-1">Aucun projet pour le moment</p>
                    <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>Créez votre premier projet et recevez votre offre personnalisée.</p>
                    <Link to="/saas-projet">
                      <button className="px-6 py-3 rounded-2xl font-black text-black text-sm"
                        style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
                        Créer mon projet →
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-4">
                {projects.length === 0 ? (
                  <div className="text-center py-16 rounded-2xl" style={{ background: 'rgba(10,8,22,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Folder className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: GOLD }} />
                    <p className="text-white font-bold mb-4">Aucun projet trouvé</p>
                    <Link to="/saas-projet">
                      <button className="px-6 py-3 rounded-2xl font-black text-black text-sm"
                        style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
                        + Nouveau projet
                      </button>
                    </Link>
                  </div>
                ) : (
                  projects.map(p => {
                    const cfg = STATUS_CONFIG[p.status] || STATUS_CONFIG['nouveau'];
                    return (
                      <motion.div key={p.id} whileHover={{ y: -3 }}
                        className="p-5 rounded-2xl"
                        style={{ background: 'rgba(10,8,22,0.85)', border: `1px solid ${cfg.color}20` }}>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-black text-white text-base">{p.need || 'Projet digital'}</div>
                            <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                              Soumis le {new Date(p.created_date).toLocaleDateString('fr-BE')}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                            style={{ background: `${cfg.color}12`, color: cfg.color, border: `1px solid ${cfg.color}25` }}>
                            <cfg.icon className="w-3 h-3" /> {cfg.label}
                          </div>
                        </div>
                        {p.message && (
                          <p className="text-xs mt-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.45)' }}>
                            {p.message.slice(0, 150)}{p.message.length > 150 ? '...' : ''}
                          </p>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>
            )}

            {activeTab === 'livrables' && (
              <div className="space-y-4">
                <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Vos fichiers seront disponibles ici une fois votre projet livré.
                </p>
                {DELIVERABLES.map((d, i) => (
                  <motion.div key={d.label} whileHover={{ x: 4 }}
                    className="flex items-center gap-4 p-4 rounded-2xl"
                    style={{ background: 'rgba(10,8,22,0.8)', border: `1px solid ${d.color}${d.available ? '35' : '12'}`, opacity: d.available ? 1 : 0.5 }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${d.color}12`, border: `1px solid ${d.color}25` }}>
                      <d.icon className="w-5 h-5" style={{ color: d.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="font-black text-white text-sm">{d.label}</div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{d.desc}</div>
                    </div>
                    {d.available ? (
                      <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold"
                        style={{ background: `${d.color}15`, color: d.color, border: `1px solid ${d.color}25` }}>
                        <Download className="w-3.5 h-3.5" /> Télécharger
                      </button>
                    ) : (
                      <span className="text-xs px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}>
                        En cours...
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'historique' && (
              <div className="space-y-3">
                {[
                  { date: 'Aujourd\'hui', event: 'Projet soumis', detail: 'Votre projet a été reçu et transmis à Julien.', color: CYAN },
                  { date: 'Sous 2h', event: 'Analyse en cours', detail: 'Votre projet sera analysé et une offre préparée.', color: GOLD },
                  { date: 'Sous 48h', event: 'Offre envoyée', detail: 'Vous recevrez votre offre personnalisée par email.', color: PURPLE },
                  { date: 'Après acompte', event: 'Production démarrée', detail: 'L\'équipe commence la création de votre projet.', color: GREEN },
                ].map((h, i) => (
                  <div key={h.event} className="flex gap-4 p-4 rounded-2xl"
                    style={{ background: 'rgba(10,8,22,0.7)', border: `1px solid ${h.color}15` }}>
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-3 h-3 rounded-full" style={{ background: i === 0 ? h.color : 'rgba(255,255,255,0.15)' }} />
                      {i < 3 && <div className="w-px h-full mt-1" style={{ background: 'rgba(255,255,255,0.08)' }} />}
                    </div>
                    <div>
                      <div className="text-xs font-bold mb-0.5" style={{ color: h.color }}>{h.date}</div>
                      <div className="font-bold text-white text-sm">{h.event}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{h.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}