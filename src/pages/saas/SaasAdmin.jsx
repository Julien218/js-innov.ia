import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  Users, Briefcase, CheckSquare, FileText, Bell, Check, X, MessageSquare, AlertTriangle, Search, Edit
} from 'lucide-react';
import TikTokStats from '../../components/admin/TikTokStats';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';
const GREEN = '#22c55e';

const STATUS_COLORS = {
  'nouveau': CYAN, 'contacté': GOLD, 'qualifié': PURPLE,
  'devis envoyé': '#F59E0B', 'gagné': GREEN, 'perdu': '#ef4444',
  'en attente': GOLD, 'validé': GREEN, 'refusé': '#ef4444', 'modifié': PURPLE,
};

const PACK_COLORS = {
  'Pack Starter': CYAN, 'Pack Business': GOLD, 'Pack Automation': PURPLE, 'Pack IA Premium': '#EC4899',
};

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="p-5 rounded-2xl"
      style={{ background: 'rgba(10,8,22,0.8)', border: `1px solid ${color}20` }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}12`, border: `1px solid ${color}28` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {sub && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${color}12`, color }}>{sub}</span>}
      </div>
      <div className="text-2xl font-black text-white mb-1">{value}</div>
      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</div>
    </motion.div>
  );
}

const TABS = ['Dashboard', 'Leads', 'Projets', 'Validations', 'Contenus'];

export default function SaasAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [tab, setTab] = useState('Dashboard');
  const [leads, setLeads] = useState([]);
  const [projects, setProjects] = useState([]);
  const [validations, setValidations] = useState([]);
  const [contents, setContents] = useState([]);
  const [search, setSearch] = useState('');
  const [editingValidation, setEditingValidation] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    base44.auth.me().then(u => {
      setIsAdmin(u?.role === 'admin');
      setCheckingAuth(false);
    }).catch(() => setCheckingAuth(false));
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    Promise.all([
      base44.entities.Lead.list('-created_date', 100),
      base44.entities.SaasProject.list('-created_date', 100),
      base44.entities.Validation.list('-created_date', 100),
      base44.entities.SaasContent.list('-created_date', 100),
    ]).then(([l, p, v, c]) => {
      setLeads(l || []);
      setProjects(p || []);
      setValidations(v || []);
      setContents(c || []);
    });
  }, [isAdmin]);

  const updateValidationStatus = async (id, status) => {
    await base44.entities.Validation.update(id, { status, adminComment: comment });
    setValidations(prev => prev.map(v => v.id === id ? { ...v, status, adminComment: comment } : v));
    setEditingValidation(null);
    setComment('');
  };

  const updateLeadStatus = async (id, status) => {
    await base44.entities.Lead.update(id, { status });
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  if (checkingAuth) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-slate-700 border-t-amber-500 rounded-full animate-spin" />
    </div>
  );

  if (!isAdmin) return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-black text-white mb-2">Accès refusé</h2>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Cette page est réservée aux administrateurs.</p>
      </div>
    </div>
  );

  const newLeads = leads.filter(l => l.status === 'nouveau').length;
  const pendingValidations = validations.filter(v => v.status === 'en attente').length;
  const activeProjects = projects.filter(p => ['En production', 'En test', 'Analyse en cours'].includes(p.status)).length;
  const filteredLeads = leads.filter(l =>
    !search || `${l.firstName} ${l.lastName} ${l.email} ${l.company}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen px-4 pt-10 pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: GOLD }}>Administration</div>
            <h1 className="text-2xl md:text-3xl font-black text-white">Dashboard Js-Innov.IA</h1>
          </div>
          {pendingValidations > 0 && (
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold"
              style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.35)', color: GOLD }}>
              <Bell className="w-4 h-4" />
              {pendingValidations} validation{pendingValidations > 1 ? 's' : ''} en attente
            </motion.div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all"
              style={tab === t
                ? { background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, color: '#000' }
                : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {t}
            </button>
          ))}
        </div>

        {/* DASHBOARD */}
        {tab === 'Dashboard' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard icon={Users} label="Total leads" value={leads.length} color={CYAN} sub={newLeads > 0 ? `+${newLeads} nouveaux` : null} />
              <StatCard icon={Briefcase} label="Projets actifs" value={activeProjects} color={GOLD} />
              <StatCard icon={CheckSquare} label="Validations en attente" value={pendingValidations} color={pendingValidations > 0 ? '#F59E0B' : GREEN} sub={pendingValidations > 0 ? 'Urgent' : 'OK'} />
              <StatCard icon={FileText} label="Contenus créés" value={contents.length} color={PURPLE} />
            </div>

            {/* TikTok Stats */}
            <div className="mb-6">
            <TikTokStats />
            </div>

            {/* Recent leads */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl" style={{ background: 'rgba(10,8,22,0.8)', border: '1px solid rgba(212,175,55,0.15)' }}>
                <h3 className="font-black text-white mb-4 flex items-center gap-2"><Users className="w-4 h-4" style={{ color: GOLD }} /> Derniers leads</h3>
                {leads.slice(0, 5).map(lead => (
                  <div key={lead.id} className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <div>
                      <div className="text-sm font-bold text-white">{lead.firstName} {lead.lastName}</div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{lead.company || lead.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                        style={{ background: `${PACK_COLORS[lead.recommendedPack] || GOLD}15`, color: PACK_COLORS[lead.recommendedPack] || GOLD }}>
                        {lead.recommendedPack || '—'}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                        style={{ background: `${STATUS_COLORS[lead.status] || CYAN}15`, color: STATUS_COLORS[lead.status] || CYAN }}>
                        {lead.status}
                      </span>
                    </div>
                  </div>
                ))}
                {leads.length === 0 && <p className="text-sm text-center py-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Aucun lead pour le moment</p>}
              </div>

              <div className="p-6 rounded-2xl" style={{ background: 'rgba(10,8,22,0.8)', border: `1px solid ${pendingValidations > 0 ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.08)'}` }}>
                <h3 className="font-black text-white mb-4 flex items-center gap-2"><CheckSquare className="w-4 h-4" style={{ color: GOLD }} /> Validations en attente</h3>
                {validations.filter(v => v.status === 'en attente').slice(0, 5).map(v => (
                  <div key={v.id} className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <div>
                      <div className="text-sm font-bold text-white">{v.title}</div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{v.type} · {v.clientName}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${v.urgency === 'urgente' ? 'text-red-400 bg-red-400/10' : 'text-amber-400 bg-amber-400/10'}`}>
                      {v.urgency}
                    </span>
                  </div>
                ))}
                {validations.filter(v => v.status === 'en attente').length === 0 && (
                  <p className="text-sm text-center py-4" style={{ color: 'rgba(255,255,255,0.3)' }}>✅ Aucune validation en attente</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* LEADS */}
        {tab === 'Leads' && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.35)' }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un lead..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
              </div>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{filteredLeads.length} leads</span>
            </div>

            <div className="space-y-3">
              {filteredLeads.map(lead => (
                <motion.div key={lead.id} whileHover={{ y: -2 }}
                  className="p-5 rounded-2xl" style={{ background: 'rgba(10,8,22,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-black text-white">{lead.firstName} {lead.lastName}</span>
                        {lead.typeClient && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${CYAN}15`, color: CYAN }}>{lead.typeClient}</span>}
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {lead.company && <span>🏢 {lead.company}</span>}
                        {lead.email && <span>📧 {lead.email}</span>}
                        {lead.phone && <span>📞 {lead.phone}</span>}
                      </div>
                      {lead.need && <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.45)' }}>💬 {lead.need}</p>}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {lead.recommendedPack && (
                        <span className="text-xs px-2.5 py-1 rounded-full font-bold"
                          style={{ background: `${PACK_COLORS[lead.recommendedPack] || GOLD}15`, color: PACK_COLORS[lead.recommendedPack] || GOLD }}>
                          {lead.recommendedPack}
                        </span>
                      )}
                      <select value={lead.status}
                        onChange={e => updateLeadStatus(lead.id, e.target.value)}
                        className="text-xs px-3 py-1.5 rounded-xl font-bold outline-none"
                        style={{ background: `${STATUS_COLORS[lead.status] || CYAN}15`, color: STATUS_COLORS[lead.status] || CYAN, border: `1px solid ${STATUS_COLORS[lead.status] || CYAN}30` }}>
                        {['nouveau', 'contacté', 'qualifié', 'devis envoyé', 'gagné', 'perdu'].map(s => (
                          <option key={s} value={s} style={{ background: '#0a0818' }}>{s}</option>
                        ))}
                      </select>
                      <a href={`https://wa.me/${lead.phone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 rounded-lg" style={{ background: 'rgba(37,211,102,0.12)', color: '#25D366' }}>
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
              {filteredLeads.length === 0 && (
                <div className="text-center py-12" style={{ color: 'rgba(255,255,255,0.3)' }}>Aucun lead trouvé</div>
              )}
            </div>
          </div>
        )}

        {/* PROJETS */}
        {tab === 'Projets' && (
          <div className="space-y-3">
            {projects.map(p => (
              <motion.div key={p.id} whileHover={{ y: -2 }}
                className="p-5 rounded-2xl" style={{ background: 'rgba(10,8,22,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-white text-sm">{p.name}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-bold"
                        style={{ background: `${PACK_COLORS[p.pack] || GOLD}15`, color: PACK_COLORS[p.pack] || GOLD }}>
                        {p.pack}
                      </span>
                    </div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {p.clientName} · Priorité: {p.priority} {p.deadline && `· Deadline: ${p.deadline}`}
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1.5 rounded-full font-bold"
                    style={{ background: `${STATUS_COLORS[p.status?.toLowerCase()] || CYAN}15`, color: STATUS_COLORS[p.status?.toLowerCase()] || CYAN }}>
                    {p.status}
                  </span>
                </div>
              </motion.div>
            ))}
            {projects.length === 0 && <div className="text-center py-12" style={{ color: 'rgba(255,255,255,0.3)' }}>Aucun projet créé</div>}
          </div>
        )}

        {/* VALIDATIONS */}
        {tab === 'Validations' && (
          <div className="space-y-4">
            {validations.map(v => (
              <motion.div key={v.id} whileHover={{ y: -2 }}
                className="p-6 rounded-2xl relative overflow-hidden"
                style={{
                  background: 'rgba(10,8,22,0.85)',
                  border: v.status === 'en attente' ? `1px solid rgba(245,158,11,0.35)` : `1px solid rgba(255,255,255,0.06)`
                }}>
                {v.status === 'en attente' && (
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
                )}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-white text-sm">{v.title}</span>
                      {v.urgency === 'urgente' && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-400/10 text-red-400 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Urgent
                        </span>
                      )}
                    </div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      Type: {v.type} · Client: {v.clientName || '—'} · Agent: {v.agentName || '—'}
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1.5 rounded-full font-bold"
                    style={{ background: `${STATUS_COLORS[v.status] || CYAN}15`, color: STATUS_COLORS[v.status] || CYAN }}>
                    {v.status}
                  </span>
                </div>

                <div className="p-4 rounded-xl mb-4 text-sm leading-relaxed" style={{ background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.6)', maxHeight: '120px', overflowY: 'auto' }}>
                  {v.content}
                </div>

                {v.status === 'en attente' && (
                  <div>
                    {editingValidation === v.id ? (
                      <div className="space-y-3">
                        <textarea value={comment} onChange={e => setComment(e.target.value)} rows={2} placeholder="Commentaire (optionnel)..."
                          className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                        <div className="flex gap-2">
                          <motion.button whileHover={{ scale: 1.04 }} onClick={() => updateValidationStatus(v.id, 'validé')}
                            className="flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1"
                            style={{ background: 'rgba(34,197,94,0.15)', color: GREEN, border: '1px solid rgba(34,197,94,0.3)' }}>
                            <Check className="w-3.5 h-3.5" /> Valider
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.04 }} onClick={() => updateValidationStatus(v.id, 'modifié')}
                            className="flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1"
                            style={{ background: `rgba(139,92,246,0.15)`, color: PURPLE, border: `1px solid rgba(139,92,246,0.3)` }}>
                            <Edit className="w-3.5 h-3.5" /> Modifier
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.04 }} onClick={() => updateValidationStatus(v.id, 'refusé')}
                            className="flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1"
                            style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                            <X className="w-3.5 h-3.5" /> Refuser
                          </motion.button>
                        </div>
                        <button onClick={() => { setEditingValidation(null); setComment(''); }} className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Annuler</button>
                      </div>
                    ) : (
                      <button onClick={() => setEditingValidation(v.id)}
                        className="px-5 py-2.5 rounded-xl text-xs font-black transition-all"
                        style={{ background: `rgba(212,175,55,0.12)`, color: GOLD, border: '1px solid rgba(212,175,55,0.28)' }}>
                        Traiter cette validation →
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
            {validations.length === 0 && <div className="text-center py-12" style={{ color: 'rgba(255,255,255,0.3)' }}>Aucune validation pour le moment</div>}
          </div>
        )}

        {/* CONTENUS */}
        {tab === 'Contenus' && (
          <div className="space-y-3">
            {contents.map(c => (
              <motion.div key={c.id} whileHover={{ y: -2 }}
                className="p-5 rounded-2xl" style={{ background: 'rgba(10,8,22,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{ background: `${PURPLE}15`, color: PURPLE }}>{c.platform}</span>
                    <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>{c.contentType}</span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full font-bold"
                    style={{ background: `${STATUS_COLORS[c.status] || CYAN}15`, color: STATUS_COLORS[c.status] || CYAN }}>
                    {c.status}
                  </span>
                </div>
                <p className="text-sm line-clamp-2" style={{ color: 'rgba(255,255,255,0.55)' }}>{c.text || 'Aucun texte'}</p>
                {c.scheduledDate && <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>📅 {new Date(c.scheduledDate).toLocaleDateString('fr-BE')}</p>}
              </motion.div>
            ))}
            {contents.length === 0 && <div className="text-center py-12" style={{ color: 'rgba(255,255,255,0.3)' }}>Aucun contenu créé</div>}
          </div>
        )}
      </div>
    </div>
  );
}