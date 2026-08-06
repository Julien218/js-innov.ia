import { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Send, CheckCircle, Mail, Phone, MapPin, Globe, Sparkles } from 'lucide-react';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';

function calcScore(data) {
  let score = 0;
  if (data.budget && data.budget !== '') score += 20;
  if (data.phone && data.phone.trim() !== '') score += 20;
  if (data.project_type === 'Vitrine de vente' || data.project_type === 'Boutique en ligne') score += 15;
  if (data.project_type === 'Dashboard admin') score += 10;
  if (data.company && data.company.trim() !== '') score += 10;
  if (data.message && data.message.length > 100) score += 10;
  return Math.min(score, 100);
}

function getCategory(score) {
  if (score <= 30) return 'froid';
  if (score <= 60) return 'tiède';
  if (score <= 80) return 'chaud';
  return 'très chaud';
}

const inputStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(212,175,55,0.18)',
  color: 'white',
  outline: 'none',
};

export default function WebOSContact() {
  const [formData, setFormData] = useState({
    name: '', prenom: '', email: '', phone: '', company: '',
    project_type: '', budget: '', message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const planParam = urlParams.get('plan');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const score = calcScore(formData);
    const category = getCategory(score);
    await base44.entities.ProjectRequest.create({
      ...formData,
      lead_score: score,
      lead_category: category,
      status: 'nouveau',
      email_sequence_enabled: true,
      delay_minutes: 45,
    });
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-md">
          {/* Phoenix success */}
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}
            className="flex justify-center mb-8">
            <div className="w-28 h-28 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(34,197,94,0.08)',
                border: '2px solid rgba(34,197,94,0.3)',
                boxShadow: '0 0 60px rgba(34,197,94,0.15)'
              }}>
              <CheckCircle className="w-14 h-14 text-green-400" />
            </div>
          </motion.div>
          <h2 className="text-3xl font-black text-white mb-4">Demande reçue !</h2>
          <p className="text-base leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Votre demande a bien été reçue. Une analyse personnalisée sera envoyée prochainement.
          </p>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
            style={{ background: `rgba(212,175,55,0.1)`, border: `1px solid rgba(212,175,55,0.25)`, color: GOLD }}>
            <Sparkles className="w-4 h-4" />
            Julien vous répond personnellement sous 24h
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pt-10 pb-24 relative" style={{ color: 'white' }}>
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full blur-[160px] opacity-12"
          style={{ background: `radial-gradient(circle, ${PURPLE}, transparent)` }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-[120px] opacity-08"
          style={{ background: `radial-gradient(circle, ${CYAN}, transparent)` }} />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-5 text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.28)`, color: GOLD }}>
            <Sparkles className="w-3 h-3" /> Contact
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            Parlons de{' '}
            <span style={{
              background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L}, ${PURPLE})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>votre projet</span>
          </h1>
          <p className="text-base" style={{ color: 'rgba(255,255,255,0.42)' }}>
            Décrivez votre projet en quelques lignes. Je vous réponds personnellement.
          </p>
          {planParam && (
            <div className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold"
              style={{ background: `rgba(212,175,55,0.1)`, color: GOLD, border: `1px solid rgba(212,175,55,0.3)` }}>
              <Sparkles className="w-4 h-4" /> Plan sélectionné : {planParam}
            </div>
          )}
        </motion.div>

        {/* Contact info badges */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { icon: Mail, text: 'contact@js-innov.ia', color: GOLD },
            { icon: Phone, text: '0494/11.90.90', color: PURPLE },
            { icon: Globe, text: 'www.jsinnovia.com', color: CYAN },
            { icon: MapPin, text: 'Dour, Belgique', color: GOLD },
          ].map(({ icon: Icon, text, color }) => (
            <div key={text} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs"
              style={{ background: `${color}08`, border: `1px solid ${color}20`, color: 'rgba(255,255,255,0.5)' }}>
              <Icon className="w-3.5 h-3.5" style={{ color }} /> {text}
            </div>
          ))}
        </motion.div>

        {/* Form */}
        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-4 p-7 sm:p-8 rounded-3xl relative overflow-hidden"
          style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid rgba(212,175,55,0.18)` }}>

          {/* Form top accent */}
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${PURPLE}, transparent)` }} />
          <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none"
            style={{ background: `radial-gradient(circle, ${PURPLE}12, transparent 70%)` }} />

          <div className="relative z-10 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Prénom', key: 'prenom', required: true },
                { label: 'Nom', key: 'name', required: true },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {f.label} {f.required && <span style={{ color: GOLD }}>*</span>}
                  </label>
                  <input required={f.required} value={formData[f.key]}
                    onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-sm transition-all"
                    style={{ ...inputStyle, ':focus': { borderColor: GOLD } }}
                    onFocus={e => e.target.style.borderColor = `rgba(212,175,55,0.5)`}
                    onBlur={e => e.target.style.borderColor = `rgba(212,175,55,0.18)`}
                    placeholder={f.label} />
                </div>
              ))}
            </div>

            {[
              { label: 'Email', key: 'email', type: 'email', required: true, placeholder: 'votre@email.com' },
              { label: 'Téléphone', key: 'phone', type: 'tel', placeholder: '+32 XXX XX XX XX' },
              { label: 'Entreprise', key: 'company', placeholder: 'Nom de votre entreprise' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {f.label} {f.required && <span style={{ color: GOLD }}>*</span>}
                </label>
                <input required={f.required} type={f.type || 'text'} value={formData[f.key]}
                  onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-sm"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = `rgba(212,175,55,0.5)`}
                  onBlur={e => e.target.style.borderColor = `rgba(212,175,55,0.18)`}
                  placeholder={f.placeholder} />
              </div>
            ))}

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Type de projet <span style={{ color: GOLD }}>*</span>
              </label>
              <select required value={formData.project_type}
                onChange={e => setFormData({ ...formData, project_type: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={inputStyle}>
                <option value="">Choisir un type</option>
                {['Site vitrine', 'Vitrine de vente', 'Boutique en ligne', 'Dashboard admin', 'Automatisation IA', 'Support client', 'Autre'].map(t => (
                  <option key={t} value={t} style={{ background: '#0d0d1a' }}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Budget estimé</label>
              <select value={formData.budget}
                onChange={e => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={inputStyle}>
                <option value="">Sélectionner un budget</option>
                {['< 500€', '500€ - 1500€', '1500€ - 3000€', '3000€ - 6000€', '> 6000€'].map(b => (
                  <option key={b} value={b} style={{ background: '#0d0d1a' }}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Message <span style={{ color: GOLD }}>*</span>
              </label>
              <textarea required value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = `rgba(212,175,55,0.5)`}
                onBlur={e => e.target.style.borderColor = `rgba(212,175,55,0.18)`}
                placeholder="Décrivez votre projet, vos objectifs, vos contraintes..." />
            </div>

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: 1.03, boxShadow: '0 0 50px rgba(212,175,55,0.45)' }} whileTap={{ scale: 0.97 }}
              className="w-full py-4 rounded-2xl font-black text-black flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 30px rgba(212,175,55,0.3)` }}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  Envoi en cours...
                </span>
              ) : (
                <><Send className="w-5 h-5" /> Envoyer ma demande</>
              )}
            </motion.button>

            <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.22)' }}>
              Réponse personnelle sous 24h · Données confidentielles · RGPD
            </p>
          </div>
        </motion.form>
      </div>
    </div>
  );
}