import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Download, Clock, CheckCircle, Truck, FileText, RefreshCw, AlertCircle
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';
const GREEN = '#22c55e';

const STATUS_CONFIG = {
  en_attente: { label: 'En attente', color: 'rgba(255,255,255,0.4)', icon: Clock, step: 0 },
  acompte_payé: { label: 'Acompte reçu', color: '#F59E0B', icon: CheckCircle, step: 1 },
  en_production: { label: 'En production', color: CYAN, icon: RefreshCw, step: 2 },
  livré: { label: 'Livré ✓', color: GREEN, icon: Truck, step: 3 },
};

const STEPS = ['Commande reçue', 'Acompte validé', 'En production', 'Livré'];

export default function SaasClientDashboard() {
  const [email, setEmail] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const searchOrders = async () => {
    if (!inputEmail) return;
    setLoading(true);
    setError('');
    const all = await base44.entities.ClientOrder.list('-created_date', 50);
    const mine = all.filter(o => o.client_email?.toLowerCase() === inputEmail.toLowerCase());
    if (mine.length === 0) setError('Aucune commande trouvée pour cet email.');
    setOrders(mine);
    setEmail(inputEmail);
    setLoading(false);
  };

  return (
    <div className="min-h-screen px-4 pt-10 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.25)`, color: GOLD }}>
            <Package className="w-3 h-3" /> Espace Client
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Suivi de votre commande</h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Entrez votre email pour accéder à vos livrables et suivre l'avancement.</p>
        </div>

        {/* Email search */}
        {!email && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-3xl mb-8 relative overflow-hidden"
            style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid rgba(212,175,55,0.2)` }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
            <h2 className="font-black text-white text-lg mb-5 text-center">Accéder à mes commandes</h2>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="votre@email.com"
                value={inputEmail}
                onChange={e => setInputEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && searchOrders()}
                className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
              />
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={searchOrders} disabled={loading}
                className="px-6 py-3 rounded-xl font-black text-black text-sm"
                style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
                {loading ? '...' : 'Accéder'}
              </motion.button>
            </div>
            {error && (
              <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: '#ef4444' }}>
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
          </motion.div>
        )}

        {/* Orders list */}
        {email && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-black text-white text-lg">{orders.length} commande{orders.length > 1 ? 's' : ''}</h2>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{email}</p>
              </div>
              <button onClick={() => { setEmail(''); setOrders([]); setInputEmail(''); }}
                className="text-xs px-4 py-2 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>
                Changer d'email
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.3)' }}>
                <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Aucune commande trouvée.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, i) => {
                  const st = STATUS_CONFIG[order.status] || STATUS_CONFIG.en_attente;
                  const Icon = st.icon;
                  return (
                    <motion.div key={order.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                      className="p-6 rounded-2xl cursor-pointer transition-all"
                      style={{ background: 'rgba(10,8,22,0.85)', border: `1px solid ${st.color}20` }}
                      onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}>

                      {/* Order header */}
                      <div className="flex items-start justify-between mb-5">
                        <div>
                          <div className="font-black text-white text-base">{order.pack}</div>
                          <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                            {new Date(order.created_date).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1.5 justify-end">
                            <Icon className="w-4 h-4" style={{ color: st.color }} />
                            <span className="text-xs font-bold" style={{ color: st.color }}>{st.label}</span>
                          </div>
                          {order.amount && (
                            <div className="text-base font-black mt-1" style={{ color: GOLD }}>{order.amount}€</div>
                          )}
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                          {STEPS.map((s, idx) => (
                            <span key={s} style={{ color: idx <= st.step ? GOLD : undefined }}>{s}</span>
                          ))}
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                          <div className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${(st.step / 3) * 100}%`, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_L})` }} />
                        </div>
                      </div>

                      {/* Progress % if set */}
                      {order.progress > 0 && (
                        <div className="mb-4">
                          <div className="flex justify-between text-xs mb-1">
                            <span style={{ color: 'rgba(255,255,255,0.4)' }}>Avancement production</span>
                            <span style={{ color: CYAN }}>{order.progress}%</span>
                          </div>
                          <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <div className="h-full rounded-full" style={{ width: `${order.progress}%`, background: CYAN }} />
                          </div>
                        </div>
                      )}

                      {/* Deliverables */}
                      <AnimatePresence>
                        {selectedOrder?.id === order.id && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden">
                            <div className="pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                              <p className="text-xs font-bold mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
                                LIVRABLES
                              </p>
                              {order.deliverables && order.deliverables.length > 0 ? (
                                <div className="space-y-2">
                                  {order.deliverables.map((d, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl"
                                      style={{ background: 'rgba(255,255,255,0.03)' }}>
                                      <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4" style={{ color: GOLD }} />
                                        <span className="text-xs font-semibold text-white">{d.name || `Livrable ${idx + 1}`}</span>
                                      </div>
                                      {d.url && (
                                        <a href={d.url} target="_blank" rel="noopener noreferrer"
                                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-black"
                                          style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}
                                          onClick={e => e.stopPropagation()}>
                                          <Download className="w-3 h-3" /> Télécharger
                                        </a>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-6" style={{ color: 'rgba(255,255,255,0.25)' }}>
                                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                  <p className="text-xs">Livrables disponibles dès la fin de production</p>
                                </div>
                              )}

                              {order.notes && (
                                <div className="mt-4 p-3 rounded-xl" style={{ background: 'rgba(212,175,55,0.06)', border: `1px solid rgba(212,175,55,0.15)` }}>
                                  <p className="text-xs font-bold mb-1" style={{ color: GOLD }}>Note de l'équipe</p>
                                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{order.notes}</p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Info cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '📬', title: 'Suivi en temps réel', desc: 'Consultez l\'avancement de votre projet à tout moment.' },
            { icon: '📁', title: 'Livrables sécurisés', desc: 'Téléchargez vos fichiers directement depuis votre espace.' },
            { icon: '💬', title: 'Support direct', desc: 'Julien est disponible sur WhatsApp pour toute question.' },
          ].map(c => (
            <div key={c.title} className="p-5 rounded-2xl text-center"
              style={{ background: 'rgba(10,8,22,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="font-black text-white text-sm mb-1">{c.title}</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}