import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { platform } from '@/api/platformClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageCircle, Send, Search, Clock, Mail, Phone, Building2, CheckCircle, AlertCircle } from 'lucide-react';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';
const GREEN = '#25D366';

const statusMap = {
  'nouveau': { color: '#EC4899', label: 'Nouveau' },
  'contacté': { color: CYAN, label: 'Contacté' },
  'qualifié': { color: GOLD, label: 'Qualifié' },
  'devis envoyé': { color: PURPLE, label: 'Devis envoyé' },
  'gagné': { color: GREEN, label: 'Gagné' },
  'perdu': { color: '#F59E0B', label: 'Perdu' }
};

export default function SaasChatbotAdmin() {
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('tous');
  const [manualReply, setManualReply] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);

  // Fetch all leads with chatbot source
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['chatbot_leads'],
    queryFn: () => platform.entities.Lead.filter({ source: 'chatbot' }, '-created_date', 100),
    refetchInterval: 5000, // Auto-refresh every 5s
  });

  // Update lead status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ leadId, newStatus }) =>
      platform.entities.Lead.update(leadId, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatbot_leads'] });
    }
  });

  // Send manual reply mutation
  const sendReplyMutation = useMutation({
    mutationFn: async ({ leadId, email, message }) => {
      await platform.integrations.Core.SendEmail({
        to: email,
        subject: `Re: Votre demande Js-Innov.IA`,
        body: message
      });
      return platform.entities.Lead.update(leadId, { status: 'contacté' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatbot_leads'] });
      setManualReply('');
      setSendingReply(false);
    }
  });

  const filteredLeads = leads.filter(lead => {
    const matchSearch = !searchTerm ||
      lead.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = filterStatus === 'tous' || lead.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleSendReply = async () => {
    if (!selectedLead || !manualReply.trim()) return;
    setSendingReply(true);
    await sendReplyMutation.mutateAsync({
      leadId: selectedLead.id,
      email: selectedLead.email,
      message: manualReply
    });
    setSelectedLead(prev => ({ ...prev, status: 'contacté' }));
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedLead]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
        <MessageCircle className="w-8 h-8" style={{ color: GOLD }} />
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${PURPLE})` }}>
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Gestion des Conversations</h1>
              <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Gérez tous les échanges du chatbot et répondez manuellement aux clients</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <CheckCircle className="w-4 h-4" style={{ color: GREEN }} /> {leads.length} demandes · {leads.filter(l => l.status === 'nouveau').length} nouvelles
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Leads List */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <div className="rounded-2xl p-4 border overflow-hidden"
              style={{ background: 'rgba(10,8,22,0.8)', borderColor: 'rgba(212,175,55,0.18)' }}>

              {/* Search & Filter */}
              <div className="space-y-3 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
                  <input
                    placeholder="Chercher..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.2)', color: 'white' }}
                  />
                </div>
                <div className="flex items-center gap-1 overflow-x-auto pb-2">
                  {['tous', ...Object.keys(statusMap)].map(s => (
                    <button
                      key={s}
                      onClick={() => setFilterStatus(s)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0"
                      style={{
                        background: filterStatus === s ? `${statusMap[s]?.color || 'rgba(212,175,55,0.12)'}25` : 'rgba(255,255,255,0.04)',
                        color: filterStatus === s ? (statusMap[s]?.color || GOLD) : 'rgba(255,255,255,0.4)',
                        border: `1px solid ${filterStatus === s ? `${statusMap[s]?.color || GOLD}40` : 'rgba(255,255,255,0.08)'}`
                      }}>
                      {s === 'tous' ? 'Tous' : statusMap[s].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Leads List */}
              <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto">
                {filteredLeads.length === 0 ? (
                  <p className="text-center text-xs py-6" style={{ color: 'rgba(255,255,255,0.3)' }}>Aucune demande</p>
                ) : (
                  filteredLeads.map(lead => (
                    <motion.button
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full text-left p-3 rounded-xl transition-all"
                      style={{
                        background: selectedLead?.id === lead.id ? `${statusMap[lead.status]?.color || GOLD}15` : 'rgba(255,255,255,0.03)',
                        border: selectedLead?.id === lead.id ? `1px solid ${statusMap[lead.status]?.color || GOLD}40` : '1px solid rgba(255,255,255,0.08)',
                      }}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="font-black text-white text-sm truncate">
                            {lead.firstName} {lead.lastName}
                          </div>
                          <div className="text-xs truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                            {lead.email}
                          </div>
                          <div className="text-[10px] mt-1.5 flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            <Clock className="w-3 h-3" />
                            {new Date(lead.created_date).toLocaleDateString('fr-BE')}
                          </div>
                        </div>
                        <div className="flex-shrink-0 w-2 h-8 rounded-full" style={{ background: statusMap[lead.status]?.color }} />
                      </div>
                    </motion.button>
                  ))
                )}
              </div>
            </div>
          </motion.div>

          {/* Right: Conversation & Reply */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
            {selectedLead ? (
              <div className="rounded-2xl overflow-hidden border flex flex-col h-[calc(100vh-200px)]"
                style={{ background: 'rgba(10,8,22,0.8)', borderColor: 'rgba(212,175,55,0.18)' }}>

                {/* Lead Header */}
                <div className="p-4 border-b" style={{ borderColor: 'rgba(212,175,55,0.15)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h2 className="text-lg font-black text-white">
                        {selectedLead.firstName} {selectedLead.lastName}
                      </h2>
                      <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {selectedLead.company}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateStatusMutation.mutate({ leadId: selectedLead.id, newStatus: 'contacté' })}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={{ background: `${statusMap[selectedLead.status]?.color}15`, color: statusMap[selectedLead.status]?.color }}>
                        {statusMap[selectedLead.status]?.label}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { icon: Mail, text: selectedLead.email },
                      { icon: Phone, text: selectedLead.phone || '—' },
                      { icon: Building2, text: selectedLead.typeClient || '—' },
                      { icon: AlertCircle, text: `Pack: ${selectedLead.recommendedPack}` }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        <item.icon className="w-3.5 h-3.5" />
                        <span className="truncate">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat Summary */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <div className="text-xs font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>INFOS CAPTURÉES</div>
                  {[
                    { label: 'Type client', value: selectedLead.typeClient },
                    { label: 'Besoin', value: selectedLead.need },
                    { label: 'Problème', value: selectedLead.problem },
                    { label: 'Setup actuel', value: selectedLead.currentSetup },
                    { label: 'Objectif', value: selectedLead.goal },
                    { label: 'Délai', value: selectedLead.deadline },
                    { label: 'Budget', value: selectedLead.budget },
                    { label: 'Message', value: selectedLead.message },
                  ].map((item, i) => (
                    item.value && (
                      <div key={i} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="text-[10px] font-bold mb-1" style={{ color: GOLD }}>
                          {item.label.toUpperCase()}
                        </div>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
                          {item.value}
                        </p>
                      </div>
                    )
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Manual Reply Box */}
                <div className="p-4 border-t" style={{ borderColor: 'rgba(212,175,55,0.15)' }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Répondre manuellement
                  </p>
                  <div className="flex gap-2">
                    <textarea
                      value={manualReply}
                      onChange={e => setManualReply(e.target.value)}
                      placeholder="Écrivez votre message..."
                      rows={3}
                      className="flex-1 px-4 py-2.5 rounded-xl text-xs outline-none resize-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.2)', color: 'white' }}
                    />
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendReply}
                      disabled={!manualReply.trim() || sendingReply}
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40 self-end"
                      style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
                      {sendingReply ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                          <Send className="w-4 h-4 text-black" />
                        </motion.div>
                      ) : (
                        <Send className="w-4 h-4 text-black" />
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl p-12 border text-center flex items-center justify-center h-[calc(100vh-200px)]"
                style={{ background: 'rgba(10,8,22,0.8)', borderColor: 'rgba(212,175,55,0.18)' }}>
                <div>
                  <MessageCircle className="w-12 h-12 mx-auto mb-3" style={{ color: 'rgba(212,175,55,0.3)' }} />
                  <p className="text-sm font-semibold text-white">Sélectionnez une demande</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    Cliquez sur une demande pour voir les détails et répondre au client
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}