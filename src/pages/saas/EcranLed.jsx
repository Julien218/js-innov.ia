import { useState } from 'react';
import { motion } from 'framer-motion';
import { platform } from '@/api/platformClient';
import {
  Monitor, Zap, Calendar, Star, CheckCircle, Send, Sparkles,
  Phone, Mail, MapPin, AlertTriangle, ArrowRight, Clock,
  BarChart2, Eye, Repeat
} from 'lucide-react';
import PrivacyConsentNotice from '@/components/legal/PrivacyConsentNotice';

const C = {
  bg:     '#06090F',
  card:   'rgba(10,22,40,0.85)',
  cyan:   '#00B4D8',
  gold:   '#D4AF37',
  white:  '#FFFFFF',
  silver: '#A8B8CC',
  muted:  'rgba(168,184,204,0.55)',
  red:    '#FF4D4D',
};

const PACKS = [
  {
    id: 'mensuel',
    icon: <Calendar size={28} />,
    label: 'Mensuel',
    price: '',
    unit: '',
    tag: 'Flexibilité',
    highlight: false,
    desc: 'Idéal pour tester ou lancer une campagne courte. Renouvelable chaque mois.',
    features: [
      'Diffusion 24h/7j pendant 30 jours',
      'Spot de 10 secondes en rotation',
      '+300 passages/jour — Espace C, Dour',
      'Visuel fourni par le client (JPEG/MP4)',
      'Activation sous 48h',
    ],
    note: null,
  },
  {
    id: 'annuel',
    icon: <Star size={28} />,
    label: 'Annuel',
    price: '',
    unit: '',
    tag: 'Meilleur tarif',
    highlight: true,
    desc: 'Le meilleur rapport qualité-prix. Visibilité continue toute l\'année.',
    features: [
      'Diffusion 24h/7j pendant 12 mois',
      'Spot de 10 secondes en rotation',
      '+300 passages/jour — Espace C, Dour',
      'Visuel fourni par le client (JPEG/MP4)',
      'Priorité de programmation',
    ],
    note: null,
  },
  {
    id: 'festival',
    icon: <Zap size={28} />,
    label: 'Semaine Festival',
    price: '',
    unit: '',
    tag: 'Événementiel',
    highlight: false,
    desc: 'Visibilité maximale lors des grands événements à Dour (festivals, marchés, salons).',
    features: [
      'Diffusion intensive 7 jours consécutifs',
      'Fréquence de diffusion augmentée',
      'Trafic exceptionnel pendant les événements',
      'Visuel fourni par le client (JPEG/MP4)',
      'Idéal : Dour Festival, Tour de Dour…',
    ],
    note: null,
  },
];

const SPECS = [
  { icon: <Monitor size={18} />,  label: 'Dimensions écran',  value: 'Grand format LED — Espace C, Dour' },
  { icon: <Eye size={18} />,      label: 'Trafic estimé',     value: '+300 passages / jour' },
  { icon: <Clock size={18} />,    label: 'Diffusion',         value: '24h / 7j / 365j' },
  { icon: <Repeat size={18} />,   label: 'Format spot',       value: '10 secondes en rotation' },
  { icon: <BarChart2 size={18} />,label: 'Formats acceptés',  value: 'JPEG, PNG, MP4 (fourni par le client)' },
  { icon: <MapPin size={18} />,   label: 'Localisation',      value: 'Espace C — 7370 Dour, Belgique' },
];

const fadeUp = {
  initial:    { opacity: 0, y: 24 },
  whileInView:{ opacity: 1, y: 0 },
  viewport:   { once: true },
  transition: { duration: 0.5 },
};

export default function EcranLed() {
  const [selected, setSelected] = useState('mensuel');
  const [form, setForm] = useState({ prenom: '', nom: '', entreprise: '', email: '', telephone: '', message: '', rgpd: false, creationVisuelle: false });
  const [sent, setSent]       = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.rgpd) return setError('Le consentement RGPD est obligatoire.');
    setError('');
    setSending(true);

    const pack = PACKS.find(p => p.id === selected);

    try {
      await platform.functions.invoke('receiveLead', {
        firstName: form.prenom,
        lastName:  form.nom,
        email:     form.email,
        phone:     form.telephone,
        company:   form.entreprise,
        need:      pack.label,
        message:   `[ÉCRAN LED — ${pack.label}]${form.creationVisuelle ? '\n\n✅ Création Visuelle Animée demandée' : ''}\n\n${form.message}`,
        source:    'ecran-led',
        consentRgpd: true,
      });
      setSent(true);
    } catch (_error) {
      setError('La demande n’a pas pu être enregistrée avec sa preuve de consentement. Merci de réessayer ou de nous écrire à info@jsinnovia.store.');
    }
    setSending(false);
  };

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", background: C.bg, color: C.white, minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ══ HERO ══ */}
      <section style={{ position: 'relative', padding: 'clamp(80px,12vw,120px) 5% clamp(52px,8vw,80px)', overflow: 'hidden',
        borderBottom: '1px solid rgba(0,180,216,0.14)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 50%, rgba(0,180,216,0.12) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 20%, rgba(212,175,55,0.08) 0%, transparent 55%)', pointerEvents: 'none' }} />
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,180,216,0.10)',
            border: '1px solid rgba(0,180,216,0.28)', borderRadius: 50, padding: '6px 16px', marginBottom: 20 }}>
            <Monitor size={14} color={C.cyan} />
            <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.cyan }}>
              Écran LED — Espace C · Dour
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem,6vw,3.8rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.05, margin: '0 0 18px' }}>
            Diffusez votre pub<br /><span style={{ color: C.cyan }}>sur l'écran géant</span><br />
            <span style={{ color: C.gold }}>de Dour</span>
          </h1>
          <p style={{ fontSize: 'clamp(0.88rem,2.2vw,1.05rem)', color: C.silver, lineHeight: 1.7, maxWidth: 600, margin: '0 0 28px' }}>
            Touchez des milliers de passants chaque jour avec votre publicité diffusée en continu
            sur le grand écran LED de l'Espace C. Choisissez votre forfait, fournissez votre visuel — c'est tout.
          </p>

          {/* Bandeau avertissement visuel */}
          <div style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 10, background: 'rgba(255,77,77,0.10)',
            border: '1px solid rgba(255,77,77,0.35)', borderRadius: 10, padding: '10px 16px', marginBottom: 28, maxWidth: 560 }}>
            <AlertTriangle size={16} color={C.red} style={{ marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,180,180,0.85)', margin: 0, lineHeight: 1.55 }}>
              <strong style={{ color: '#FF7070' }}>Visuel non fourni.</strong> La création graphique ou vidéo de votre spot publicitaire est à votre charge.
              Nous acceptons les formats JPEG, PNG et MP4.{' '}
              <a href="mailto:info@jsinnovia.store" style={{ color: C.cyan, textDecoration: 'underline' }}>Besoin d'aide pour créer votre visuel ?</a>
            </p>
          </div>

          <a href="#devis" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 30px',
            background: 'linear-gradient(135deg,#007FA0,#00B4D8)', color: '#fff',
            fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.10em', fontSize: '0.82rem',
            borderRadius: 50, textDecoration: 'none', boxShadow: '0 6px 24px rgba(0,180,216,0.45)' }}>
            Demander un devis <ArrowRight size={16} />
          </a>
        </motion.div>
      </section>

      {/* ══ SPECS TECHNIQUES ══ */}
      <section style={{ padding: 'clamp(40px,6vw,60px) 5%', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <motion.div {...fadeUp} style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.gold, marginBottom: 18 }}>
            Caractéristiques techniques
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))', gap: 12 }}>
            {SPECS.map(({ icon, label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: C.card,
                border: '1px solid rgba(0,180,216,0.14)', borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ color: C.cyan, marginTop: 2, flexShrink: 0 }}>{icon}</div>
                <div>
                  <div style={{ fontSize: '0.60rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: C.muted, marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: C.white }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══ FORFAITS ══ */}
      <section style={{ padding: 'clamp(52px,8vw,80px) 5%', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <motion.div {...fadeUp} style={{ maxWidth: 920, margin: '0 auto' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.gold, marginBottom: 10 }}>Tarifs</p>
          <h2 style={{ fontSize: 'clamp(1.3rem,3.5vw,2.2rem)', fontWeight: 900, textTransform: 'uppercase', marginBottom: 'clamp(28px,4vw,44px)' }}>
            Choisissez votre <span style={{ color: C.cyan }}>forfait</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,270px),1fr))', gap: 'clamp(14px,2.5vw,22px)' }}>
            {PACKS.map((pack) => (
              <motion.div key={pack.id} {...fadeUp}
                onClick={() => { setSelected(pack.id); document.getElementById('devis')?.scrollIntoView({ behavior: 'smooth' }); }}
                style={{
                  background: pack.highlight
                    ? 'linear-gradient(145deg,rgba(0,180,216,0.12),rgba(212,175,55,0.06))'
                    : C.card,
                  border: pack.id === selected
                    ? `2px solid ${C.cyan}`
                    : pack.highlight
                      ? '1.5px solid rgba(0,180,216,0.40)'
                      : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 18,
                  padding: 'clamp(22px,3.5vw,32px)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'border 0.2s, box-shadow 0.2s',
                  boxShadow: pack.highlight ? '0 0 40px rgba(0,180,216,0.12)' : 'none',
                }}>
                {pack.highlight && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg,#D4AF37,#F5CF41)', color: '#06090F',
                    fontSize: '0.58rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.16em',
                    padding: '4px 14px', borderRadius: 20 }}>
                    TOP
                  </div>
                )}
                <div style={{ display: 'inline-flex', padding: '8px 12px', background: 'rgba(0,180,216,0.10)',
                  border: '1px solid rgba(0,180,216,0.22)', borderRadius: 10, color: C.cyan, marginBottom: 14 }}>
                  {pack.icon}
                </div>

                <h3 style={{ fontSize: 'clamp(0.95rem,2.5vw,1.05rem)', fontWeight: 900, textTransform: 'uppercase', color: C.white, margin: '0 0 6px' }}>{pack.label}</h3>
                <p style={{ fontSize: '0.78rem', color: C.silver, lineHeight: 1.6, margin: '0 0 16px' }}>{pack.desc}</p>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '0 0 14px' }} />
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {pack.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <CheckCircle size={13} color={C.cyan} style={{ marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: '0.75rem', color: C.silver, lineHeight: 1.5 }}>{f}</span>
                    </li>
                  ))}
                </ul>
                {/* CTA button */}
                <a
                  href="#devis"
                  onClick={(e) => { e.preventDefault(); setSelected(pack.id); document.getElementById('devis')?.scrollIntoView({ behavior: 'smooth' }); }}
                  style={{
                    marginTop: 18,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '12px 16px', textAlign: 'center',
                    background: pack.id === selected
                      ? 'linear-gradient(135deg, #007FA0, #00B4D8)'
                      : 'rgba(0,180,216,0.25)',
                    border: `1px solid ${pack.id === selected ? C.cyan : 'rgba(0,180,216,0.35)'}`,
                    borderRadius: 50,
                    fontSize: '0.78rem', fontWeight: 800,
                    color: '#fff',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    textDecoration: 'none',
                    transition: 'all 0.3s',
                    boxShadow: pack.id === selected ? '0 6px 22px rgba(0,180,216,0.50)' : 'none',
                    cursor: 'pointer',
                  }}>
                  <ArrowRight size={14} />
                  {pack.id === selected ? 'Devis pour ce forfait' : 'Je choisis ce forfait'}
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══ CREATION VISUELLE ══ */}
      <section style={{ padding: 'clamp(52px,8vw,80px) 5%', borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'linear-gradient(180deg, rgba(0,180,216,0.04) 0%, rgba(212,175,55,0.02) 40%, rgba(6,9,15,0) 100%)' }}>
        <motion.div {...fadeUp} style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.gold, marginBottom: 10 }}>
            Pour aller plus loin
          </p>
          <h2 style={{ fontSize: 'clamp(1.3rem,3.5vw,2rem)', fontWeight: 900, textTransform: 'uppercase', marginBottom: 8 }}>
            Apportez un véritable <span style={{ color: C.cyan }}>impact visuel</span> à votre campagne
          </h2>
          <p style={{ fontSize: 'clamp(0.82rem,2vw,0.95rem)', color: C.silver, lineHeight: 1.7, marginBottom: 'clamp(24px,4vw,36px)', maxWidth: 620 }}>
            Nos créatifs conçoivent votre animation optimisée pour grand écran — qualité 4K, Full HD, percutante et mémorable.
          </p>

          {/* Bloc premium */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(0,180,216,0.08), rgba(212,175,55,0.05))',
            border: '1px solid rgba(0,180,216,0.22)',
            borderRadius: 20,
            padding: 'clamp(24px,4vw,36px) clamp(22px,3.5vw,32px)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Ambiance top line */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: 'linear-gradient(90deg, transparent, #D4AF37, #00B4D8, #D4AF37, transparent)',
            }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, flexWrap: 'wrap' }}>
              {/* Icône */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                background: 'linear-gradient(135deg, rgba(212,175,55,0.18), rgba(0,180,216,0.18))',
                border: '1px solid rgba(212,175,55,0.30)',
              }}>
                <Sparkles size={26} color={C.gold} />
              </div>

              {/* Texte */}
              <div style={{ flex: 1, minWidth: 260 }}>
                <h3 style={{ fontSize: 'clamp(1rem,2.5vw,1.15rem)', fontWeight: 900, textTransform: 'uppercase', color: C.white, margin: '0 0 4px' }}>
                  Création Visuelle Animée — Impact 4K
                </h3>
                <p style={{ fontSize: '0.82rem', color: C.silver, lineHeight: 1.65, margin: '0 0 16px' }}>
                  Motion design professionnel pensé pour l'écran LED 4m × 2m. Formats optimisés grand écran, rendu Full HD / 4K, animation fluide et percutante. Votre marque sous son meilleur jour.
                </p>

                {/* Bullets */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '6px 16px', marginBottom: 18 }}>
                  {[
                    'Motion design sur mesure',
                    'Optimisé écran LED grand format',
                    'Rendu Full HD / 4K',
                    'Livraison sous 5 jours ouvrables',
                  ].map(b => (
                    <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.cyan, flexShrink: 0 }} />
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.62)', lineHeight: 1.5 }}>{b}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
                  <a
                    href="#devis"
                    onClick={(e) => { e.preventDefault(); setForm(f => ({ ...f, creationVisuelle: true })); document.getElementById('devis')?.scrollIntoView({ behavior: 'smooth' }); }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '12px 22px', background: 'rgba(212,175,55,0.12)',
                      border: '1px solid rgba(212,175,55,0.35)',
                      borderRadius: 50, textDecoration: 'none',
                      fontSize: '0.78rem', fontWeight: 800, color: C.gold,
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                      transition: 'all 0.3s',
                    }}>
                    <Sparkles size={14} />
                    Ajouter la création visuelle à ma demande
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══ DEVIS ══ */}
      <section id="devis" style={{ padding: 'clamp(52px,8vw,80px) 5%' }}>
        <motion.div {...fadeUp} style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.gold, marginBottom: 10 }}>Contact</p>
          <h2 style={{ fontSize: 'clamp(1.3rem,3.5vw,2rem)', fontWeight: 900, textTransform: 'uppercase', marginBottom: 'clamp(24px,4vw,40px)' }}>
            Demandez votre <span style={{ color: C.cyan }}>devis gratuit</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))', gap: 'clamp(28px,5vw,52px)', alignItems: 'start' }}>

            {/* Récap forfait sélectionné */}
            <div>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.silver, marginBottom: 14 }}>Forfait sélectionné</p>
              {PACKS.map(p => p.id === selected && (
                <div key={p.id} style={{ background: C.card, border: `1.5px solid ${C.cyan}`, borderRadius: 14, padding: '20px 22px', marginBottom: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{ color: C.cyan }}>{p.icon}</div>
                    <div>
                      <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: C.gold }}>{p.tag}</div>
                      <div style={{ fontSize: '1rem', fontWeight: 900, color: C.white }}>{p.label}</div>
                    </div>

                  </div>
                  <p style={{ fontSize: '0.75rem', color: C.silver, margin: 0, lineHeight: 1.6 }}>{p.desc}</p>
                </div>
              ))}

              {/* Contact direct */}
              <div style={{ background: C.card, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 18px', marginBottom: 10 }}>
                <a href="tel:+32494119090" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: C.white }}>
                  <Phone size={16} color={C.cyan} />
                  <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>0494 11 90 90</span>
                </a>
              </div>
              <div style={{ background: C.card, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 18px', marginBottom: 18 }}>
                <a href="mailto:info@jsinnovia.store" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: C.white }}>
                  <Mail size={16} color={C.cyan} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: C.cyan }}>info@jsinnovia.store</span>
                </a>
              </div>

              {/* Rappel visuel client */}
              <div style={{ background: 'rgba(255,77,77,0.07)', border: '1px solid rgba(255,77,77,0.30)', borderRadius: 10, padding: '12px 16px' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <AlertTriangle size={14} color="#FF7070" style={{ marginTop: 2, flexShrink: 0 }} />
                  <p style={{ fontSize: '0.70rem', color: 'rgba(255,180,180,0.80)', margin: 0, lineHeight: 1.55 }}>
                    <strong style={{ color: '#FF8080' }}>Rappel :</strong> vous devez fournir votre propre visuel (JPEG, PNG ou MP4). La création n'est pas incluse dans le forfait.
                  </p>
                </div>
              </div>
            </div>

            {/* Formulaire */}
            <div>
              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ padding: 'clamp(32px,6vw,48px) clamp(20px,4vw,28px)', textAlign: 'center',
                    background: C.card, border: '1.5px solid rgba(0,180,216,0.35)', borderRadius: 18 }}>
                  <CheckCircle size={48} color={C.cyan} style={{ margin: '0 auto 16px' }} />
                  <h3 style={{ fontSize: 'clamp(1rem,3vw,1.2rem)', fontWeight: 900, color: C.cyan, textTransform: 'uppercase', marginBottom: 10 }}>
                    Demande envoyée !
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: C.white, fontWeight: 700, marginBottom: 14 }}>
                    Vous recevrez votre devis par email
                  </p>
                  <p style={{ fontSize: '0.68rem', color: C.muted, margin: 0 }}>
                    Vérifiez vos spams — info@jsinnovia.store
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12,
                  background: C.card, border: '1px solid rgba(0,180,216,0.22)', borderRadius: 18,
                  padding: 'clamp(22px,4vw,32px) clamp(18px,3.5vw,28px)' }}>
                  <h3 style={{ fontSize: '0.80rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.cyan, margin: '0 0 4px' }}>
                    Formulaire de demande
                  </h3>

                  {/* Sélecteur forfait inline */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.60rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.silver, marginBottom: 6 }}>Forfait *</label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {PACKS.map(p => (
                        <button key={p.id} type="button" onClick={() => setSelected(p.id)}
                          style={{ flex: 1, minWidth: 80, padding: '8px 10px', textAlign: 'center',
                            background: selected === p.id ? 'rgba(0,180,216,0.18)' : 'rgba(10,22,40,0.6)',
                            border: `1px solid ${selected === p.id ? C.cyan : 'rgba(0,180,216,0.18)'}`,
                            borderRadius: 8, color: selected === p.id ? C.cyan : C.muted,
                            fontSize: '0.68rem', fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {[
                    { name: 'prenom',     label: 'Prénom *',          type: 'text'  },
                    { name: 'nom',        label: 'Nom *',              type: 'text'  },
                    { name: 'entreprise', label: 'Entreprise / Asso.', type: 'text'  },
                    { name: 'email',      label: 'Email *',            type: 'email' },
                    { name: 'telephone',  label: 'Téléphone *',        type: 'tel'   },
                  ].map(({ name, label, type }) => (
                    <div key={name}>
                      <label style={{ display: 'block', fontSize: '0.60rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.silver, marginBottom: 4 }}>{label}</label>
                      <input name={name} type={type} required={label.includes('*')} value={form[name]}
                        onChange={e => setForm({ ...form, [name]: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', background: 'rgba(6,9,15,0.7)',
                          border: '1px solid rgba(0,180,216,0.18)', borderRadius: 8,
                          color: C.white, fontSize: '0.84rem', outline: 'none', boxSizing: 'border-box' }}
                        onFocus={e => e.target.style.borderColor = C.cyan}
                        onBlur={e => e.target.style.borderColor  = 'rgba(0,180,216,0.18)'} />
                    </div>
                  ))}

                  <div>
                    <label style={{ display: 'block', fontSize: '0.60rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.silver, marginBottom: 4 }}>Message (optionnel)</label>
                    <textarea name="message" rows={3} value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Décrivez brièvement votre activité ou votre campagne..."
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(6,9,15,0.7)',
                        border: '1px solid rgba(0,180,216,0.18)', borderRadius: 8,
                        color: C.white, fontSize: '0.82rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = C.cyan}
                      onBlur={e => e.target.style.borderColor  = 'rgba(0,180,216,0.18)'} />
                  </div>

                  {/* Checkbox création visuelle */}
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer',
                    background: form.creationVisuelle ? 'rgba(212,175,55,0.07)' : 'transparent',
                    border: form.creationVisuelle ? '1px solid rgba(212,175,55,0.25)' : '1px solid transparent',
                    borderRadius: 10, padding: '10px 12px', transition: 'all 0.3s' }}>
                    <input type="checkbox" checked={form.creationVisuelle}
                      onChange={e => setForm({ ...form, creationVisuelle: e.target.checked })}
                      style={{ marginTop: 2, accentColor: C.gold, flexShrink: 0, width: 15, height: 15 }} />
                    <span style={{ fontSize: '0.72rem', color: form.creationVisuelle ? C.gold : C.muted, lineHeight: 1.5, transition: 'color 0.3s' }}>
                      Je souhaite également une création visuelle animée
                    </span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                    <input type="checkbox" required checked={form.rgpd}
                      onChange={e => setForm({ ...form, rgpd: e.target.checked })}
                      style={{ marginTop: 3, accentColor: C.cyan, flexShrink: 0, width: 15, height: 15 }} />
                    <PrivacyConsentNotice style={{ fontSize: '0.62rem', color: C.muted, lineHeight: 1.5 }} />
                  </label>

                  {error && (
                    <p style={{ fontSize: '0.70rem', color: C.red, margin: 0 }}>{error}</p>
                  )}

                  <button type="submit" disabled={sending}
                    style={{ padding: '13px', background: sending ? 'rgba(0,180,216,0.25)' : 'linear-gradient(135deg,#007FA0,#00B4D8)',
                      color: '#fff', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.80rem',
                      borderRadius: 50, border: 'none', cursor: sending ? 'wait' : 'pointer',
                      boxShadow: sending ? 'none' : '0 6px 24px rgba(0,180,216,0.50)' }}>
                    {sending ? 'Envoi en cours…' : <><Send size={14} style={{ display: 'inline', marginRight: 8 }} />Recevoir mon devis</>}
                  </button>
                  <p style={{ fontSize: '0.60rem', color: C.muted, textAlign: 'center', margin: 0 }}>
                    Gratuit · Sans engagement
                  </p>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background: '#020509', borderTop: '1px solid rgba(255,255,255,0.06)', padding: 'clamp(28px,5vw,40px) 5%' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <a href="tel:+32494119090" style={{ fontSize: '0.72rem', color: C.muted, textDecoration: 'none', fontWeight: 600 }}>0494 11 90 90</a>
            <a href="mailto:info@jsinnovia.store" style={{ fontSize: '0.72rem', color: C.cyan, textDecoration: 'none', fontWeight: 600 }}>info@jsinnovia.store</a>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.20)' }}>Espace C · 7370 Dour · Belgique</span>
          </div>
          <p style={{ fontSize: '0.60rem', color: 'rgba(255,255,255,0.18)', margin: 0 }}>
            {`© ${new Date().getFullYear()} JS-Innov.IA® — JY-Trix.AI — Tous droits réservés`}
          </p>
        </div>
      </footer>

    </div>
  );
}
