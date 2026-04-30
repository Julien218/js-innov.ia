import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Send, CheckCircle, Mail, Phone, MapPin } from 'lucide-react';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';

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
      <div className="min-h-screen flex items-center justify-center px-5" style={{ background: '#070710' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.3)' }}>
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4">Demande reçue !</h2>
          <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Votre demande a bien été reçue. Une analyse sera envoyée prochainement.
          </p>
          <p className="text-sm mt-4" style={{ color: 'rgba(212,175,55,0.7)' }}>
            Julien vous répondra personnellement sous peu.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pt-8 pb-20" style={{ background: '#070710', color: 'white' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: GOLD }}>Contact</p>
          <h1 className="text-4xl font-black text-white mb-3">Parlons de votre projet</h1>
          <p className="text-base" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Décrivez votre projet en quelques lignes. Je vous réponds personnellement.
          </p>
          {planParam && (
            <div className="mt-4 inline-block px-4 py-2 rounded-full text-sm font-bold"
              style={{ background: 'rgba(212,175,55,0.1)', color: GOLD, border: '1px solid rgba(212,175,55,0.3)' }}>
              Plan sélectionné : {planParam}
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="flex flex-wrap justify-center gap-5 mb-8">
          {[
            { icon: Mail, text: 'contact@js-innov.ia' },
            { icon: Phone, text: '+32 494 11 90 90' },
            { icon: MapPin, text: 'Dour, Belgique' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
              <Icon className="w-4 h-4" style={{ color: GOLD }} /> {text}
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6 sm:p-8 rounded-3xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.15)' }}>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Prénom', key: 'prenom', required: true },
              { label: 'Nom', key: 'name', required: true },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {f.label} {f.required && '*'}
                </label>
                <input required={f.required} value={formData[f.key]}
                  onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  placeholder={f.label} />
              </div>
            ))}
          </div>

          {[
            { label: 'Email *', key: 'email', type: 'email', required: true, placeholder: 'votre@email.com' },
            { label: 'Téléphone', key: 'phone', type: 'tel', placeholder: '+32 XXX XX XX XX' },
            { label: 'Entreprise', key: 'company', placeholder: 'Nom de votre entreprise' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>{f.label}</label>
              <input required={f.required} type={f.type || 'text'} value={formData[f.key]}
                onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                placeholder={f.placeholder} />
            </div>
          ))}

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>Type de projet *</label>
            <select required value={formData.project_type}
              onChange={e => setFormData({ ...formData, project_type: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
              <option value="">Choisir un type</option>
              {['Site vitrine', 'Vitrine de vente', 'Boutique en ligne', 'Dashboard admin', 'Automatisation IA', 'Support client', 'Autre'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>Budget estimé</label>
            <select value={formData.budget}
              onChange={e => setFormData({ ...formData, budget: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
              <option value="">Sélectionner un budget</option>
              {['< 500€', '500€ - 1500€', '1500€ - 3000€', '3000€ - 6000€', '> 6000€'].map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>Message *</label>
            <textarea required value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              rows={5}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
              placeholder="Décrivez votre projet, vos objectifs, vos contraintes..." />
          </div>

          <motion.button type="submit" disabled={loading}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-2xl font-black text-black flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 30px rgba(212,175,55,0.3)` }}>
            {loading ? 'Envoi en cours...' : <><Send className="w-5 h-5" /> Envoyer ma demande</>}
          </motion.button>

          <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Réponse personnelle sous 24h · Données confidentielles
          </p>
        </form>
      </div>
    </div>
  );
}