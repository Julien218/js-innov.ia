import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Send, CheckCircle, Mail, Phone, MapPin, Globe, Sparkles, MessageCircle } from 'lucide-react';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';
const WA_LINK = 'https://wa.me/32494119090?text=Bonjour%20Julien%2C%20je%20viens%20du%20site%20Js-Innov.IA%20et%20je%20souhaite%20parler%20de%20mon%20projet.';

const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.18)', color: 'white', outline: 'none' };

export default function SaasContact() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', company: '', need: '', budget: '', message: '', consentRgpd: false });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const packParam = urlParams.get('pack');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.consentRgpd) return alert('Consentement RGPD obligatoire.');
    setLoading(true);
    await base44.entities.Lead.create({ ...form, name: `${form.firstName} ${form.lastName}`, source: 'formulaire', status: 'nouveau' });
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.3)' }}>
          <CheckCircle className="w-12 h-12 text-green-400" />
        </div>
        <h2 className="text-3xl font-black text-white mb-3">Message reçu !</h2>
        <p className="text-base mb-4" style={{ color: 'rgba(255,255,255,0.55)' }}>Julien vous répondra personnellement sous 24h.</p>
        <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold"
          style={{ background: 'rgba(37,211,102,0.15)', color: '#25D366', border: '1px solid rgba(37,211,102,0.3)' }}>
          <MessageCircle className="w-4 h-4" /> Continuer sur WhatsApp
        </a>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen px-4 pt-10 pb-24">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-5 text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.28)`, color: GOLD }}>
            <Sparkles className="w-3 h-3" /> Contact
          </div>
          <h1 className="text-4xl font-black text-white mb-3">Parlons de <span style={{ background: `linear-gradient(135deg, ${GOLD}, ${PURPLE})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>votre projet</span></h1>
          {packParam && (
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
              style={{ background: 'rgba(212,175,55,0.1)', color: GOLD, border: '1px solid rgba(212,175,55,0.3)' }}>
              <Sparkles className="w-3.5 h-3.5" /> {packParam} sélectionné
            </div>
          )}
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {[
            { icon: Mail, text: 'info@jsinnovia.com', color: GOLD },
            { icon: Phone, text: '0494/11.90.90', color: PURPLE },
            { icon: MapPin, text: 'Grand Rue 52, Dour', color: CYAN },
          ].map(({ icon: Icon, text, color }) => (
            <div key={text} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs"
              style={{ background: `${color}08`, border: `1px solid ${color}20`, color: 'rgba(255,255,255,0.5)' }}>
              <Icon className="w-3.5 h-3.5" style={{ color }} /> {text}
            </div>
          ))}
        </div>

        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          onSubmit={handleSubmit} className="p-7 rounded-3xl relative overflow-hidden space-y-4"
          style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid rgba(212,175,55,0.18)` }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${PURPLE}, transparent)` }} />

          <div className="grid grid-cols-2 gap-4">
            {[{ l: 'Prénom', k: 'firstName' }, { l: 'Nom', k: 'lastName' }].map(f => (
              <div key={f.k}>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{f.l}</label>
                <input value={form[f.k]} onChange={e => setForm({ ...form, [f.k]: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-sm" style={inputStyle} placeholder={f.l} />
              </div>
            ))}
          </div>

          {[
            { l: 'Email *', k: 'email', t: 'email', req: true },
            { l: 'Téléphone', k: 'phone', t: 'tel' },
            { l: 'Entreprise / Activité', k: 'company' },
          ].map(f => (
            <div key={f.k}>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{f.l}</label>
              <input required={f.req} type={f.t || 'text'} value={form[f.k]} onChange={e => setForm({ ...form, [f.k]: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm" style={inputStyle} placeholder={f.l} />
            </div>
          ))}

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Besoin principal</label>
            <select value={form.need} onChange={e => setForm({ ...form, need: e.target.value })} className="w-full px-4 py-3 rounded-xl text-sm" style={inputStyle}>
              <option value="">Choisir...</option>
              {['Créer un site web', 'Automatisation', 'Chatbot', 'App mobile', 'Contenus', 'Agent IA', 'Autre'].map(o => <option key={o} value={o} style={{ background: '#0a0818' }}>{o}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Message *</label>
            <textarea required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={4}
              className="w-full px-4 py-3 rounded-xl text-sm resize-none" style={inputStyle}
              placeholder="Décrivez votre projet, vos objectifs..." />
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <div onClick={() => setForm({ ...form, consentRgpd: !form.consentRgpd })}
              className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5 cursor-pointer"
              style={form.consentRgpd ? { background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` } : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.25)' }}>
              {form.consentRgpd && <span className="text-black text-xs font-black">✓</span>}
            </div>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              J'accepte que mes données soient utilisées pour être recontacté (RGPD). <span style={{ color: GOLD }}>*</span>
            </span>
          </label>

          <motion.button type="submit" disabled={loading || !form.consentRgpd}
            whileHover={{ scale: 1.03, boxShadow: '0 0 50px rgba(212,175,55,0.45)' }} whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-2xl font-black text-black flex items-center justify-center gap-2 disabled:opacity-40"
            style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 25px rgba(212,175,55,0.3)` }}>
            {loading ? '⏳ Envoi...' : <><Send className="w-5 h-5" /> Envoyer ma demande</>}
          </motion.button>

          <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.22)' }}>Réponse sous 24h · RGPD · BCE 0877926214</p>
        </motion.form>
      </div>
    </div>
  );
}