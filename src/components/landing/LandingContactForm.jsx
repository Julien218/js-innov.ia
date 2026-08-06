import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Send, CheckCircle, Sparkles, User, Mail, Phone, Building2, MessageSquare } from 'lucide-react';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#7C3AED';

export default function LandingContactForm() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', company: '', need: '', message: '', consentRgpd: false });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.consentRgpd || !form.email) return;
    setLoading(true);
    try {
      await base44.functions.invoke('receiveLead', { ...form, source: 'landing_form' });
      setSent(true);
    } catch {
      setSent(true);
    }
    setLoading(false);
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 14, color: 'white', padding: '14px 16px 14px 44px', fontSize: 14, width: '100%', outline: 'none', boxSizing: 'border-box',
  };

  const needs = ['Site web', 'Automatisation', 'Agent IA', 'Contenus IA', 'SaaS sur mesure', 'Cockpit IA local'];

  return (
    <section id="contact" ref={ref} className="py-24 px-5 relative">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)', color: GOLD }}>
            <Sparkles size={14} /> Démarrer un projet
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Parlons de votre projet
          </h2>
          <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Décrivez votre besoin en 2 minutes. Vous recevez une réponse personnalisée sous 24h.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-8 md:p-10 rounded-3xl relative overflow-hidden"
          style={{ background: 'rgba(10,10,18,0.6)', border: '1px solid rgba(212,175,55,0.18)', backdropFilter: 'blur(10px)' }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${PURPLE}, transparent)` }} />

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8">
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.6, repeat: 2 }}
                  className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                  style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)' }}>
                  <CheckCircle size={32} style={{ color: '#22c55e' }} />
                </motion.div>
                <h3 className="text-xl font-black text-white mb-2">Demande envoyée !</h3>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Julien vous recontacte sous 24h avec une proposition personnalisée.
                </p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
                    <input placeholder="Prénom *" value={form.firstName} required
                      onChange={e => setForm({ ...form, firstName: e.target.value })}
                      style={inputStyle} onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.4)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  </div>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
                    <input placeholder="Nom *" value={form.lastName} required
                      onChange={e => setForm({ ...form, lastName: e.target.value })}
                      style={inputStyle} onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.4)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  </div>
                </div>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
                  <input type="email" placeholder="Email *" value={form.email} required
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    style={inputStyle} onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.4)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
                    <input type="tel" placeholder="Téléphone" value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      style={inputStyle} onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.4)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  </div>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
                    <input placeholder="Entreprise / Activité" value={form.company}
                      onChange={e => setForm({ ...form, company: e.target.value })}
                      style={inputStyle} onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.4)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>Votre besoin principal</p>
                  <div className="flex flex-wrap gap-2">
                    {needs.map(n => (
                      <button key={n} type="button" onClick={() => setForm({ ...form, need: n })}
                        className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                        style={form.need === n
                          ? { background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)', color: GOLD }
                          : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <MessageSquare size={16} className="absolute left-4 top-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
                  <textarea placeholder="Décrivez votre projet..." value={form.message} rows={3}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    style={{ ...inputStyle, resize: 'none', paddingTop: 14 }}
                    onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.4)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <div onClick={() => setForm({ ...form, consentRgpd: !form.consentRgpd })}
                    className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center mt-0.5 cursor-pointer transition-all"
                    style={form.consentRgpd ? { background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` } : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.25)' }}>
                    {form.consentRgpd && <span className="text-black text-xs font-black">✓</span>}
                  </div>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    J'accepte que mes données soient utilisées pour être recontacté (RGPD). <span style={{ color: GOLD }}>*</span>
                  </span>
                </label>
                <motion.button type="submit" disabled={loading || !form.consentRgpd || !form.email}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-2xl font-bold text-sm text-black flex items-center justify-center gap-2 disabled:opacity-40"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: '0 0 25px rgba(212,175,55,0.25)' }}>
                  {loading ? 'Envoi...' : <><Send size={16} /> Envoyer ma demande</>}
                </motion.button>
                <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.22)' }}>
                  Réponse sous 24h · Sans engagement · RGPD conforme
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}