import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Send, CheckCircle, Mail, Phone, MapPin, Sparkles, MessageCircle, ArrowLeft, Settings } from 'lucide-react';
import PackConfigurator from '../../components/saas/PackConfigurator';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';
const WA_LINK = 'https://wa.me/32494119090?text=Bonjour%20Julien%2C%20je%20viens%20du%20site%20Js-Innov.IA%20et%20je%20souhaite%20parler%20de%20mon%20projet.';
const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.18)', color: 'white', outline: 'none' };

export default function SaasContact() {
  const [step, setStep] = useState('configure'); // 'configure' | 'form'
  const [packSummary, setPackSummary] = useState(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', company: '', message: '', consentRgpd: false });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const packParam = urlParams.get('pack');

  const handleConfiguratorComplete = (summary) => {
    setPackSummary(summary);
    setStep('form');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.consentRgpd) return alert('Consentement RGPD obligatoire.');
    setLoading(true);
    await base44.entities.Lead.create({
      ...form,
      name: `${form.firstName} ${form.lastName}`,
      recommendedPack: packSummary?.pack || packParam || '',
      need: packSummary?.options?.join(', ') || '',
      budget: packSummary?.estimatedPrice || '',
      message: `${form.message}\n\n--- Configuration choisie ---\nPack : ${packSummary?.pack || '—'}\nOptions : ${packSummary?.options?.join(', ') || 'Aucune'}\nEstimation : ${packSummary?.estimatedPrice || '—'}`,
      source: 'formulaire',
      status: 'nouveau',
      consentRgpd: true,
    });
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.3)', boxShadow: '0 0 60px rgba(34,197,94,0.12)' }}>
          <CheckCircle className="w-12 h-12 text-green-400" />
        </motion.div>
        <h2 className="text-3xl font-black text-white mb-3">Demande envoyée !</h2>
        {packSummary && (
          <div className="inline-block mb-4 px-5 py-2 rounded-full text-sm font-bold"
            style={{ background: 'rgba(212,175,55,0.1)', color: GOLD, border: '1px solid rgba(212,175,55,0.25)' }}>
            {packSummary.pack} · {packSummary.estimatedPrice}
          </div>
        )}
        <p className="text-base mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Julien vous répondra personnellement sous 24h avec une proposition adaptée à votre configuration.
        </p>
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

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-5 text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.28)`, color: GOLD }}>
            <Sparkles className="w-3 h-3" /> Configurer mon projet
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            {step === 'configure' ? (
              <>Construisez <span style={{ background: `linear-gradient(135deg, ${GOLD}, ${PURPLE})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>votre pack</span></>
            ) : (
              <>Vos <span style={{ background: `linear-gradient(135deg, ${GOLD}, ${PURPLE})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>coordonnées</span></>
            )}
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.42)' }}>
            {step === 'configure'
              ? 'Sélectionnez votre pack de base et personnalisez avec les options souhaitées.'
              : 'Votre configuration est prête. Renseignez vos infos pour recevoir votre proposition.'}
          </p>
        </motion.div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[
            { id: 'configure', label: 'Configuration', icon: Settings },
            { id: 'form', label: 'Contact', icon: Send },
          ].map((s, i) => (
            <React.Fragment key={s.id}>
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${step === s.id || (s.id === 'configure' && step === 'form') ? 'text-black' : 'text-white/40'}`}
                  style={{
                    background: step === s.id ? `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` :
                      (s.id === 'configure' && step === 'form') ? '#22c55e' : 'rgba(255,255,255,0.08)'
                  }}>
                  {s.id === 'configure' && step === 'form' ? '✓' : i + 1}
                </div>
                <span className="text-xs font-semibold hidden sm:block"
                  style={{ color: step === s.id ? GOLD : 'rgba(255,255,255,0.35)' }}>{s.label}</span>
              </div>
              {i === 0 && (
                <div className="w-12 h-px" style={{ background: step === 'form' ? GOLD : 'rgba(255,255,255,0.12)' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Contact info chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {[
            { icon: Mail, text: 'info@jsinnovia.com', color: GOLD },
            { icon: Phone, text: '0494/11.90.90', color: PURPLE },
            { icon: MapPin, text: 'Grand Rue 52, Dour', color: CYAN },
          ].map(({ icon: Icon, text, color }) => (
            <div key={text} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
              style={{ background: `${color}08`, border: `1px solid ${color}18`, color: 'rgba(255,255,255,0.45)' }}>
              <Icon className="w-3 h-3" style={{ color }} /> {text}
            </div>
          ))}
        </div>

        {/* Main card */}
        <AnimatePresence mode="wait">
          {step === 'configure' && (
            <motion.div key="configure"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="p-7 rounded-3xl relative overflow-hidden"
              style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid rgba(212,175,55,0.18)` }}>
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${PURPLE}, transparent)` }} />
              <PackConfigurator onComplete={handleConfiguratorComplete} />
            </motion.div>
          )}

          {step === 'form' && (
            <motion.div key="form"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>

              {/* Pack summary recap */}
              {packSummary && (
                <div className="flex items-center justify-between p-4 rounded-2xl mb-4"
                  style={{ background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.25)' }}>
                  <div>
                    <div className="text-xs font-bold tracking-wider uppercase mb-0.5" style={{ color: 'rgba(212,175,55,0.6)' }}>Configuration choisie</div>
                    <div className="font-black text-white text-sm">{packSummary.pack}</div>
                    {packSummary.options.length > 0 && (
                      <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>+ {packSummary.options.slice(0, 2).join(', ')}{packSummary.options.length > 2 ? ` +${packSummary.options.length - 2}` : ''}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-black text-lg" style={{ color: GOLD }}>{packSummary.estimatedPrice}</div>
                    <button onClick={() => setStep('configure')} className="text-xs mt-1 flex items-center gap-1 transition-colors" style={{ color: 'rgba(255,255,255,0.35)' }}
                      onMouseEnter={e => e.currentTarget.style.color = GOLD} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}>
                      <ArrowLeft className="w-3 h-3" /> Modifier
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="p-7 rounded-3xl relative overflow-hidden space-y-4"
                style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid rgba(212,175,55,0.18)` }}>
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${PURPLE}, ${GOLD}, transparent)` }} />

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
                      className="w-full px-4 py-3 rounded-xl text-sm" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.5)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(212,175,55,0.18)'}
                      placeholder={f.l} />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Message complémentaire</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={3}
                    className="w-full px-4 py-3 rounded-xl text-sm resize-none" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(212,175,55,0.18)'}
                    placeholder="Précisions sur votre projet, contraintes, délai souhaité..." />
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <div onClick={() => setForm({ ...form, consentRgpd: !form.consentRgpd })}
                    className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5 cursor-pointer transition-all"
                    style={form.consentRgpd ? { background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` } : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.25)' }}>
                    {form.consentRgpd && <span className="text-black text-xs font-black">✓</span>}
                  </div>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    J'accepte que mes données soient utilisées pour être recontacté (RGPD). <span style={{ color: GOLD }}>*</span>
                  </span>
                </label>

                <motion.button type="submit" disabled={loading || !form.consentRgpd || !form.email}
                  whileHover={{ scale: 1.03, boxShadow: '0 0 50px rgba(212,175,55,0.45)' }} whileTap={{ scale: 0.97 }}
                  className="w-full py-4 rounded-2xl font-black text-black flex items-center justify-center gap-2 disabled:opacity-40 text-sm"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 25px rgba(212,175,55,0.3)` }}>
                  {loading
                    ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}><Sparkles className="w-5 h-5" /></motion.div> Envoi...</>
                    : <><Send className="w-5 h-5" /> Envoyer ma demande</>}
                </motion.button>

                <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.22)' }}>
                  Réponse sous 24h · RGPD · BCE 0877926214
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}