import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users, FileText, Ticket, BarChart3, Zap, ChevronRight, Clock,
  TrendingUp, AlertTriangle, CheckCircle, Eye, MessageCircle, Settings, Mail
} from 'lucide-react';

const GOLD = '#D4AF37';

const SCORE_COLOR = (s) => {
  if (s <= 30) return '#6b7280';
  if (s <= 60) return '#F59E0B';
  if (s <= 80) return '#f97316';
  return '#22c55e';
};

const SCORE_LABEL = (s) => {
  if (s <= 30) return 'Froid';
  if (s <= 60) return 'Tiède';
  if (s <= 80) return 'Chaud';
  return 'Très chaud 🔥';
};

const SCORE_ACTION = (s) => {
  if (s <= 30) return 'Envoyer email nurturing';
  if (s <= 60) return 'Envoyer recommandation';
  if (s <= 80) return 'Contacter rapidement';
  return 'Proposer appel ou devis maintenant';
};

const STATUS_COLORS = {
  'nouveau': '#06B6D4',
  'en analyse': '#F59E0B',
  'en cours': '#8B5CF6',
  'terminé': '#22c55e',
  'refusé': '#ef4444',
};

const PRIORITY_COLORS = {
  'basse': '#6b7280',
  'normale': '#06B6D4',
  'urgente': '#ef4444',
};

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="p-5 rounded-2xl flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div>
        <div className="text-2xl font-black text-white">{value}</div>
        <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</div>
      </div>
    </div>
  );
}

function RequestRow({ req, onUpdate }) {
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState(req.notes_internes || '');
  const color = SCORE_COLOR(req.lead_score);
  const qc = useQueryClient();

  const update = useMutation({
    mutationFn: (data) => base44.entities.ProjectRequest.update(req.id, data),
    onSuccess: () => qc.invalidateQueries(['requests']),
  });

  return (
    <div className="p-5 rounded-2xl mb-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-bold text-white text-sm">{req.prenom || ''} {req.name}</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold"
              style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
              {SCORE_LABEL(req.lead_score)} — {req.lead_score}/100
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: `${STATUS_COLORS[req.status] || '#444'}18`, color: STATUS_COLORS[req.status] || '#aaa', border: `1px solid ${STATUS_COLORS[req.status] || '#444'}30` }}>
              {req.status}
            </span>
          </div>
          <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{req.email} · {req.phone || '—'} · {req.company || '—'}</p>
          <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {req.project_type} · {req.budget || '—'}
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            💡 Action suggérée : <span style={{ color: GOLD }}>{SCORE_ACTION(req.lead_score)}</span>
          </p>
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0">
          <select value={req.status}
            onChange={e => update.mutate({ status: e.target.value })}
            className="px-3 py-1.5 rounded-xl text-xs outline-none"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
            {['nouveau', 'en analyse', 'en cours', 'terminé', 'refusé'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={() => setShowNotes(!showNotes)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold"
            style={{ background: 'rgba(212,175,55,0.1)', color: GOLD, border: '1px solid rgba(212,175,55,0.2)' }}>
            Notes internes
          </button>
        </div>
      </div>

      {showNotes && (
        <div className="mt-3">
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
            className="w-full px-3 py-2 rounded-xl text-xs resize-none outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
            placeholder="Note interne (invisible du client)..." />
          <button onClick={() => update.mutate({ notes_internes: notes })}
            className="mt-2 px-4 py-1.5 rounded-xl text-xs font-bold text-black"
            style={{ background: `linear-gradient(135deg, ${GOLD}, #F5CF41)` }}>
            Sauvegarder
          </button>
        </div>
      )}
    </div>
  );
}

function TicketRow({ ticket }) {
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState(ticket.internal_notes || '');
  const qc = useQueryClient();
  const update = useMutation({
    mutationFn: (data) => base44.entities.Ticket.update(ticket.id, data),
    onSuccess: () => qc.invalidateQueries(['tickets']),
  });
  const prioColor = PRIORITY_COLORS[ticket.priority] || '#aaa';

  return (
    <div className="p-5 rounded-2xl mb-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-bold text-white text-sm">{ticket.title}</span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${prioColor}18`, color: prioColor }}>
              {ticket.priority}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: `${STATUS_COLORS[ticket.status] || '#444'}18`, color: STATUS_COLORS[ticket.status] || '#aaa' }}>
              {ticket.status}
            </span>
          </div>
          <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{ticket.client_name} · {ticket.client_email}</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{ticket.description}</p>
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0">
          <select value={ticket.status}
            onChange={e => update.mutate({ status: e.target.value })}
            className="px-3 py-1.5 rounded-xl text-xs outline-none"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
            {['ouvert', 'en analyse', 'en cours', 'résolu'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={() => setShowNotes(!showNotes)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold"
            style={{ background: 'rgba(212,175,55,0.1)', color: GOLD }}>
            Notes internes
          </button>
          <button onClick={() => update.mutate({ status: 'résolu' })}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-black"
            style={{ background: 'rgba(34,197,94,0.8)' }}>
            ✓ Résolu
          </button>
        </div>
      </div>
      {showNotes && (
        <div className="mt-3">
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
            className="w-full px-3 py-2 rounded-xl text-xs resize-none outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
            placeholder="Note interne..." />
          <button onClick={() => update.mutate({ internal_notes: notes })}
            className="mt-2 px-4 py-1.5 rounded-xl text-xs font-bold text-black"
            style={{ background: `linear-gradient(135deg, ${GOLD}, #F5CF41)` }}>
            Sauvegarder
          </button>
        </div>
      )}
    </div>
  );
}

const TABS = ['Demandes', 'Tickets', 'Email Logs', 'WhatsApp'];

export default function WebOSAdmin() {
  const [tab, setTab] = useState('Demandes');
  const [isAdmin, setIsAdmin] = useState(false);
  const qc = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(u => setIsAdmin(u?.role === 'admin')).catch(() => {});
  }, []);

  const { data: requests = [] } = useQuery({
    queryKey: ['requests'],
    queryFn: () => base44.entities.ProjectRequest.list('-created_date', 100),
    enabled: isAdmin,
  });

  const { data: tickets = [] } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => base44.entities.Ticket.list('-created_date', 100),
    enabled: isAdmin,
  });

  const { data: emailLogs = [] } = useQuery({
    queryKey: ['emailLogs'],
    queryFn: () => base44.entities.EmailLog.list('-created_date', 100),
    enabled: isAdmin,
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#070710' }}>
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-black text-white mb-2">Accès restreint</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Réservé aux administrateurs.</p>
        </div>
      </div>
    );
  }

  const newReqs = requests.filter(r => r.status === 'nouveau').length;
  const openTickets = tickets.filter(t => t.status !== 'résolu').length;
  const hotLeads = requests.filter(r => r.lead_score > 60).length;

  const whatsappTemplates = [
    { title: 'Validation création', text: 'Bonjour {{prenom}}, j\'ai préparé une première structure pour votre projet. Voulez-vous que je parte sur une version plutôt premium, moderne ou très commerciale ?' },
    { title: 'Validation post', text: 'Bonjour {{prenom}}, voici le post prévu pour cette semaine : {{post_preview}}. Répondez OK pour valider ou MODIFIER pour demander un ajustement.' },
    { title: 'Support', text: 'Bonjour {{prenom}}, j\'ai bien vu votre demande. Je la prends en charge et je vous fais un retour dès que la modification est prête.' },
    { title: 'Upsell', text: 'Bonjour {{prenom}}, votre projet peut gagner en efficacité avec une option automatisation ou SEO local. Voulez-vous que je vous prépare une proposition simple ?' },
  ];

  return (
    <div className="min-h-screen px-4 pt-6 pb-20" style={{ background: '#070710', color: 'white' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: GOLD }}>Super Admin</p>
          <h1 className="text-3xl font-black text-white">Dashboard JS-Innov.ia</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard icon={FileText} label="Demandes totales" value={requests.length} color={GOLD} />
          <StatCard icon={AlertTriangle} label="Nouvelles" value={newReqs} color="#06B6D4" />
          <StatCard icon={TrendingUp} label="Leads chauds" value={hotLeads} color="#22c55e" />
          <StatCard icon={Ticket} label="Tickets ouverts" value={openTickets} color="#ef4444" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all"
              style={tab === t
                ? { background: `linear-gradient(135deg, ${GOLD}, #F5CF41)`, color: '#000' }
                : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === 'Demandes' && (
          <div>
            <h2 className="text-lg font-black text-white mb-4">Demandes clients ({requests.length})</h2>
            {requests.length === 0 ? (
              <div className="text-center py-12" style={{ color: 'rgba(255,255,255,0.3)' }}>Aucune demande pour l'instant.</div>
            ) : (
              requests.map(req => <RequestRow key={req.id} req={req} />)
            )}
          </div>
        )}

        {tab === 'Tickets' && (
          <div>
            <h2 className="text-lg font-black text-white mb-4">Tickets support ({tickets.length})</h2>
            {tickets.length === 0 ? (
              <div className="text-center py-12" style={{ color: 'rgba(255,255,255,0.3)' }}>Aucun ticket pour l'instant.</div>
            ) : (
              tickets.map(t => <TicketRow key={t.id} ticket={t} />)
            )}
          </div>
        )}

        {tab === 'Email Logs' && (
          <div>
            <h2 className="text-lg font-black text-white mb-4">Historique emails ({emailLogs.length})</h2>
            {emailLogs.length === 0 ? (
              <div className="text-center py-12" style={{ color: 'rgba(255,255,255,0.3)' }}>Aucun email loggé.</div>
            ) : (
              emailLogs.map(log => (
                <div key={log.id} className="p-4 rounded-2xl mb-3"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                    <span className="font-bold text-white text-sm">{log.subject}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: log.status === 'envoyé' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
                        color: log.status === 'envoyé' ? '#22c55e' : '#F59E0B'
                      }}>
                      {log.status}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {log.client_email} · Étape {log.sequence_step}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'WhatsApp' && (
          <div>
            <h2 className="text-lg font-black text-white mb-4">Modèles WhatsApp</h2>
            <div className="space-y-4">
              {whatsappTemplates.map((tpl, i) => (
                <div key={i} className="p-5 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(37,211,102,0.15)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: '#25D366' }}>
                      <MessageCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="font-bold text-white text-sm">{tpl.title}</span>
                  </div>
                  <p className="text-sm leading-relaxed p-3 rounded-xl mb-3"
                    style={{ background: 'rgba(37,211,102,0.06)', color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(37,211,102,0.12)' }}>
                    {tpl.text}
                  </p>
                  <button onClick={() => navigator.clipboard?.writeText(tpl.text)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl"
                    style={{ background: 'rgba(37,211,102,0.1)', color: '#25D366' }}>
                    Copier le message
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}