import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { platform } from '@/api/platformClient';
import {
  Monitor, Zap, Calendar, Star, CheckCircle, Send, Sparkles,
  Phone, Mail, MapPin, AlertTriangle, ArrowRight, Clock,
  BarChart2, Eye, Repeat
} from 'lucide-react';

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
    label: 'Abonnement annuel',
    price: '',
    unit: '',
    tag: 'Paiement mensuel',
    highlight: false,
    desc: 'Engagement de 12 mois avec un règlement réparti en mensualités.',
    features: [
      'Diffusion 24h/7j pendant 12 mois',
      'Paiement mensuel pendant 12 mois',
      'Spot de 10 secondes en rotation',
      '+300 passages du spot par jour (+300 diffusions)',
      'Vidéo publicitaire offerte par Pixelium',
      'Activation sous 48h',
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
      'Vidéo publicitaire offerte par Pixelium',
      'Idéal : Dour Festival, Tour de Dour…',
    ],
    note: null,
  },
];

const SPECS = [
  { icon: <Monitor size={18} />,  label: 'Dimensions écran',  value: 'Grand format LED — Espace C, Dour' },
  { icon: <Repeat size={18} />,   label: 'Passages du spot',   value: '+300 diffusions publicitaires / jour' },
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
  const [form, setForm] = useState({ prenom: '', nom: '', entreprise: '', email: '', telephone: '', message: '', rgpd: false, creationVisuelle: true });
  const [sent, setSent]       = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'PIXELIUM — Publicité sur écran géant à Dour | SIGNELYA';
    return () => { document.title = previousTitle; };
  }, []);

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
    } catch (err) {
      // Fallback mailto si Supabase KO
      const subject = encodeURIComponent(`Demande écran LED — Forfait ${pack.label}`);
      const body = encodeURIComponent(
        `Forfait : ${pack.label}\n` +
        `Prénom : ${form.prenom}\nNom : ${form.nom}\n` +
        `Entreprise : ${form.entreprise || '—'}\n` +
        `Email : ${form.email}\nTél : ${form.telephone}\n` +
        `Message : ${form.message || '—'}`
      );
      window.location.href = `mailto:info@jsinnovia.com?subject=${subject}&body=${body}`;
      setSent(true);
    }
    setSending(false);
  };

  return (
    <div className="pixelium-signage-page" style={{ fontFamily: "'Inter','Segoe UI',sans-serif", background: C.bg, color: C.white, minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @keyframes brandVisualFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }
        .pixelium-signage-page img,
        .pixelium-signage-page video {
          border-radius: 20px !important;
          box-shadow:
            0 16px 38px rgba(0, 217, 255, 0.20),
            0 0 26px rgba(117, 75, 255, 0.18),
            0 0 18px rgba(241, 0, 255, 0.10);
          filter: saturate(1.18) contrast(1.04);
          animation: brandVisualFloat 6s ease-in-out infinite;
          transition: filter 240ms ease, box-shadow 240ms ease;
        }
        .pixelium-signage-page img:hover,
        .pixelium-signage-page video:hover {
          filter: saturate(1.32) contrast(1.06);
          box-shadow:
            0 20px 48px rgba(0, 217, 255, 0.28),
            0 0 34px rgba(117, 75, 255, 0.24),
            0 0 24px rgba(241, 0, 255, 0.16);
        }
        .pixelium-signage-page video {
          display: block;
          max-width: 100%;
          overflow: hidden;
          background: #03050A;
        }
        @media (prefers-reduced-motion: reduce) {
          .pixelium-signage-page img,
          .pixelium-signage-page video { animation: none; }
        }
      `}</style>

      {/* ══ IDENTITÉ PIXELIUM ══ */}
      <nav aria-label="Navigation principale" style={{
        position: 'sticky', top: 0, zIndex: 100, minHeight: 72, padding: '8px 5%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        background: 'rgba(2,5,9,0.94)', backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(0,180,216,0.18)'
      }}>
        <a href="#" aria-label="Pixelium — accueil" style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.white, textDecoration: 'none' }}>
          <img src="/pixelium-logo.png" alt="" width="52" height="52"
            style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', boxShadow: '0 0 22px rgba(80,65,255,0.22)' }} />
          <div>
            <div style={{ fontSize: 'clamp(0.92rem,2.6vw,1.08rem)', fontWeight: 900, letterSpacing: '0.16em' }}>PIXELIUM</div>
            <div style={{ fontSize: '0.58rem', color: C.muted, letterSpacing: '0.11em', textTransform: 'uppercase' }}>Diffusion digitale · Dour</div>
          </div>
        </a>
        <div style={{
          width: 'min(42vw, 260px)', padding: '8px 12px', borderRadius: 18, textAlign: 'center',
          background: 'rgba(0,180,216,0.08)', border: '1px solid rgba(117,75,255,0.28)'
        }}>
          <img src="/branding/signelya-officiel-jsinnovia.png" alt="SIGNELYA by JS-Innov.IA — Vos écrans prennent vie"
            width="1672" height="941" style={{ display: 'block', width: '100%', height: 56, objectFit: 'cover', objectPosition: 'center 63%', marginBottom: 4 }} />
          <div style={{ fontSize: '0.56rem', color: C.muted }}>Application de diffusion utilisée par Pixelium</div>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section style={{ position: 'relative', padding: 'clamp(80px,12vw,120px) 5% clamp(52px,8vw,80px)', overflow: 'hidden',
        borderBottom: '1px solid rgba(0,180,216,0.14)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 50%, rgba(0,180,216,0.12) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 20%, rgba(212,175,55,0.08) 0%, transparent 55%)', pointerEvents: 'none' }} />
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <img
            src="/pixelium-logo.png"
            alt="Pixelium — entreprise de diffusion digitale"
            width="512"
            height="512"
            style={{ display: 'block', width: 'min(78vw, 360px)', height: 'auto', objectFit: 'contain', margin: '0 auto 20px' }}
          />
          <p style={{ margin: '0 auto 24px', textAlign: 'center', color: C.muted, fontSize: '0.68rem', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
            SIGNELYA · application de diffusion digitale
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,180,216,0.10)',
            border: '1px solid rgba(0,180,216,0.28)', borderRadius: 50, padding: '6px 16px', marginBottom: 20 }}>
            <Monitor size={14} color={C.cyan} />
            <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.cyan }}>
              PIXELIUM — Écran géant · Espace C · Dour
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem,6vw,3.8rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.05, margin: '0 0 18px' }}>
            Diffusez votre pub<br /><span style={{ color: C.cyan }}>sur l'écran géant</span><br />
            <span style={{ color: C.gold }}>de Dour</span>
          </h1>
          <p style={{ fontSize: 'clamp(0.88rem,2.2vw,1.05rem)', color: C.silver, lineHeight: 1.7, maxWidth: 600, margin: '0 0 28px' }}>
            Touchez des milliers de passants chaque jour avec votre publicité diffusée en continu
            sur le grand écran LED de l'Espace C. Choisissez votre forfait : Pixelium vous offre la création de votre vidéo publicitaire.
          </p>

          {/* Création vidéo incluse */}
          <div style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 10, background: 'rgba(0,180,216,0.10)',
            border: '1px solid rgba(0,180,216,0.35)', borderRadius: 10, padding: '10px 16px', marginBottom: 28, maxWidth: 600 }}>
            <Sparkles size={16} color={C.gold} style={{ marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: '0.75rem', color: C.silver, margin: 0, lineHeight: 1.55 }}>
              <strong style={{ color: C.gold }}>Votre vidéo publicitaire est offerte par Pixelium.</strong>{' '}
              Elle est conçue par <a href="https://www.jsinnovia.com" target="_blank" rel="noopener noreferrer" style={{ color: C.cyan, fontWeight: 700, textDecoration: 'none' }}>JS-Innov.IA</a> et optimisée pour la diffusion sur l'écran géant.
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

      {/* ══ TECHNOLOGIE SIGNELYA ══ */}
      <section aria-labelledby="technologie-signelya" style={{
        padding: 'clamp(44px,7vw,68px) 5%',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'radial-gradient(ellipse at 50% 50%, rgba(94,54,255,0.12) 0%, transparent 68%)'
      }}>
        <motion.div {...fadeUp} style={{ maxWidth: 980, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.gold, marginBottom: 10 }}>
            Technologie de diffusion
          </p>
          <h2 id="technologie-signelya" style={{ fontSize: 'clamp(1.3rem,3.5vw,2rem)', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 10px' }}>
            SIGNELYA, <span style={{ color: C.cyan }}>l'application utilisée par Pixelium</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: C.silver, lineHeight: 1.65, margin: '0 auto 24px', maxWidth: 720 }}>
            La programmation et la diffusion digitale des campagnes Pixelium sont pilotées avec SIGNELYA, une application conçue par <a href="https://www.jsinnovia.com" target="_blank" rel="noopener noreferrer" style={{ color: C.cyan, fontWeight: 700, textDecoration: 'none' }}>JS-Innov.IA</a>.
          </p>
          <img
            src="/branding/signelya-officiel-jsinnovia.png"
            alt="SIGNELYA by JS-Innov.IA — Vos écrans prennent vie"
            width="1672"
            height="941"
            style={{ display: 'block', width: '100%', height: 'auto', objectFit: 'cover', borderRadius: 24 }}
          />
        </motion.div>
      </section>

      {/* ══ VIDÉO PROMOTIONNELLE ══ */}
      <section aria-labelledby="video-promotionnelle" style={{
        padding: 'clamp(48px,8vw,76px) 5%',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'radial-gradient(ellipse at 50% 10%, rgba(117,75,255,0.10) 0%, transparent 62%)'
      }}>
        <motion.div {...fadeUp} style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.gold, marginBottom: 10 }}>
            Découvrez l'offre en images
          </p>
          <h2 id="video-promotionnelle" style={{ fontSize: 'clamp(1.3rem,3.5vw,2rem)', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 10px' }}>
            Votre publicité sur <span style={{ color: C.cyan }}>l'écran géant de Dour</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: C.silver, lineHeight: 1.65, margin: '0 0 24px', maxWidth: 680 }}>
            Découvrez le dispositif Pixelium à l'Espace C et la puissance d'une campagne diffusée avec SIGNELYA.
          </p>
          <div style={{
            padding: 'clamp(10px,2vw,16px)', borderRadius: 24,
            background: 'linear-gradient(145deg,rgba(0,180,216,0.10),rgba(117,75,255,0.10))',
            border: '1px solid rgba(0,180,216,0.30)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.40), 0 0 34px rgba(0,180,216,0.12)'
          }}>
            <video
              controls
              playsInline
              preload="metadata"
              aria-label="Vidéo promotionnelle Pixelium — écran géant de l'Espace C à Dour"
              style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'contain' }}
            >
              <source src="/media/pixelium-espace-c-dour.mp4" type="video/mp4" />
              Votre navigateur ne prend pas en charge la lecture vidéo.
            </video>
          </div>
          <p style={{ fontSize: '0.66rem', color: C.muted, lineHeight: 1.5, margin: '14px 0 0', textAlign: 'center' }}>
            Vidéo promotionnelle conçue par <a href="https://www.jsinnovia.com" target="_blank" rel="noopener noreferrer" style={{ color: C.cyan, fontWeight: 700, textDecoration: 'none' }}>JS-Innov.IA</a>.
          </p>
        </motion.div>
      </section>

      {/* ══ CHIFFRE CLÉ EXPLIQUÉ ══ */}
      <section aria-labelledby="chiffres-cles" style={{ padding: 'clamp(38px,6vw,56px) 5%', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <motion.div {...fadeUp} style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.gold, marginBottom: 10 }}>
            Fréquence de diffusion
          </p>
          <h2 id="chiffres-cles" style={{ fontSize: 'clamp(1.3rem,3.5vw,2rem)', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 22px' }}>
            Plus de <span style={{ color: C.cyan }}>300 passages du spot</span> par jour
          </h2>
          <div style={{ padding: 'clamp(22px,4vw,30px)', borderRadius: 20, background: 'linear-gradient(145deg,rgba(0,217,255,0.12),rgba(117,75,255,0.07))', border: '1px solid rgba(0,217,255,0.32)', boxShadow: '0 14px 36px rgba(0,217,255,0.08)' }}>
            <div style={{ fontSize: 'clamp(2.2rem,7vw,3.6rem)', fontWeight: 900, color: C.cyan, lineHeight: 1 }}>+300</div>
            <div style={{ fontSize: '0.86rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 8 }}>
              diffusions de votre publicité par jour
            </div>
            <p style={{ fontSize: '0.78rem', color: C.silver, lineHeight: 1.65, margin: '10px 0 0', maxWidth: 680 }}>
              Un « passage » correspond à une diffusion de votre spot publicitaire sur l'écran. Ce chiffre ne représente pas le nombre de voitures ni le nombre de personnes devant l'emplacement.
            </p>
          </div>
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
          <h2 style={{ fontSize: 'clamp(1.3rem,3.5vw,2.2rem)', fontWeight: 900, textTransform: 'uppercase', marginBottom: 12 }}>
            Choisissez votre <span style={{ color: C.cyan }}>forfait</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: C.silver, lineHeight: 1.65, margin: '0 0 clamp(28px,4vw,44px)', maxWidth: 660 }}>
            L'abonnement de diffusion est conclu pour 12 mois. Le paiement est effectué mensuellement pendant toute la durée de l'abonnement.
          </p>
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
            Votre vidéo publicitaire est offerte par Pixelium et réalisée par <a href="https://www.jsinnovia.com" target="_blank" rel="noopener noreferrer" style={{ color: C.cyan, fontWeight: 700, textDecoration: 'none' }}>JS-Innov.IA</a>, puis optimisée pour une diffusion percutante sur grand écran.
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
                    Création offerte incluse dans ma demande
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
                <a href="mailto:info@jsinnovia.com" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: C.white }}>
                  <Mail size={16} color={C.cyan} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: C.cyan }}>info@jsinnovia.com</span>
                </a>
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
                    Vérifiez vos spams — info@jsinnovia.com
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

                  {/* Création vidéo incluse */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10,
                    background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.25)',
                    borderRadius: 10, padding: '10px 12px' }}>
                    <CheckCircle size={15} color={C.gold} style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.72rem', color: C.gold, lineHeight: 1.5 }}>
                      Création de votre vidéo publicitaire offerte par Pixelium et réalisée par <a href="https://www.jsinnovia.com" target="_blank" rel="noopener noreferrer" style={{ color: C.cyan, fontWeight: 700, textDecoration: 'none' }}>JS-Innov.IA</a>
                    </span>
                  </div>

                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                    <input type="checkbox" required checked={form.rgpd}
                      onChange={e => setForm({ ...form, rgpd: e.target.checked })}
                      style={{ marginTop: 3, accentColor: C.cyan, flexShrink: 0, width: 15, height: 15 }} />
                    <span style={{ fontSize: '0.62rem', color: C.muted, lineHeight: 1.5 }}>
                      J'accepte que mes données soient utilisées pour répondre à ma demande. Données non revendues ni partagées. (RGPD UE 2016/679) *
                    </span>
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
                    Devis gratuit · Abonnement annuel · Paiement mensuel
                  </p>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background: '#020509', borderTop: '1px solid rgba(255,255,255,0.06)', padding: 'clamp(30px,5vw,44px) 5%' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <img src="/pixelium-logo.png" alt="Pixelium" width="64" height="64"
              style={{ width: 64, height: 64, borderRadius: 14, objectFit: 'cover' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1rem', fontWeight: 900, letterSpacing: '0.16em', color: C.white }}>PIXELIUM</div>
              <div style={{ fontSize: '0.62rem', color: C.muted }}>Entreprise de diffusion digitale</div>
            </div>
          </div>
          <p style={{ fontSize: '0.72rem', color: C.silver, margin: 0 }}>
            <strong style={{ color: C.cyan }}>Signelya</strong> — application de diffusion digitale utilisée par Pixelium.
          </p>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="tel:+32494119090" style={{ fontSize: '0.72rem', color: C.muted, textDecoration: 'none', fontWeight: 600 }}>0494 11 90 90</a>
            <a href="mailto:info@jsinnovia.com" style={{ fontSize: '0.72rem', color: C.cyan, textDecoration: 'none', fontWeight: 600 }}>info@jsinnovia.com</a>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.28)' }}>Espace C · 7370 Dour · Belgique</span>
          </div>
          <div>{`© ${new Date().getFullYear()} Pixelium — Tous droits réservés`}</div>

          {/* Carte flottante de conception JS-Innov.IA */}
          <a href="https://www.jsinnovia.com" target="_blank" rel="noopener noreferrer" aria-label="Visiter le site JS-Innov.IA, concepteur du site et des créations visuelles"
            style={{
              width: 'min(100%, 560px)', boxSizing: 'border-box',
              display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left',
              padding: '14px 18px', borderRadius: 18, textDecoration: 'none',
              background: 'linear-gradient(145deg, rgba(19,27,43,0.98), rgba(6,13,24,0.98))',
              border: '1px solid rgba(0,180,216,0.38)',
              boxShadow: '0 16px 44px rgba(0,0,0,0.48), 0 0 30px rgba(0,180,216,0.10)',
              transform: 'translateY(-2px)'
            }}>
            <img src="https://raw.githubusercontent.com/Julien218/jsinnovia-assets-/main/logo-complet-800.png"
              alt="Logo officiel JS-Innov.IA" width="112" height="112"
              style={{
                width: 112, height: 112, flexShrink: 0, objectFit: 'cover',
                borderRadius: 16, background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(212,175,55,0.28)'
              }} />
            <div>
              <div style={{ fontSize: '0.60rem', color: C.gold, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>
                Conception & création
              </div>
              <div style={{ fontSize: '1rem', color: C.white, fontWeight: 900, letterSpacing: '0.06em', marginBottom: 4 }}>
                JS-Innov.IA
              </div>
              <div style={{ fontSize: '0.68rem', color: C.silver, lineHeight: 1.5 }}>
                Site, applications, images, vidéos et logos conçus par JS-Innov.IA
              </div>
            </div>
          </a>
        </div>
      </footer>

    </div>
  );
}
