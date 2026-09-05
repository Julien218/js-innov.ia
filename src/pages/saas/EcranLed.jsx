import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { platform } from '@/api/platformClient';
import {
  Monitor, Zap, Calendar, CheckCircle, Send, Sparkles,
  Phone, Mail, MapPin, ArrowRight, Clock,
  BarChart2, Repeat
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
      'Visuel JPEG, PNG ou MP4 fourni par le client',
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
      'Visuel JPEG, PNG ou MP4 fourni par le client',
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
  initial:    { opacity: 1, y: 18 },
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
  const [quoteStep, setQuoteStep] = useState(1);
  const [showMobileCta, setShowMobileCta] = useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'PIXELIUM — Publicité sur écran géant à Dour | SIGNELYA';
    return () => { document.title = previousTitle; };
  }, []);

  useEffect(() => {
    const updateMobileCta = () => setShowMobileCta(window.scrollY > 560);
    updateMobileCta();
    window.addEventListener('scroll', updateMobileCta, { passive: true });
    return () => window.removeEventListener('scroll', updateMobileCta);
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
      setError("Votre demande n'a pas pu être enregistrée. Merci de réessayer.");
    }
    setSending(false);
  };

  const goToSummary = () => {
    if (!form.prenom.trim() || !form.nom.trim() || !form.email.trim() || !form.telephone.trim()) {
      setError('Complétez les champs obligatoires avant de continuer.');
      return;
    }
    setError('');
    setQuoteStep(3);
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
        @keyframes statusPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(67, 255, 177, 0.40); }
          50% { box-shadow: 0 0 0 7px rgba(67, 255, 177, 0); }
        }
        @keyframes dataSweep {
          0% { transform: translateX(-105%); }
          100% { transform: translateX(340%); }
        }
        @keyframes gridDrift {
          from { background-position: 0 0, 0 0; }
          to { background-position: 42px 42px, 42px 42px; }
        }
        .brand-zigzag {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          align-items: center;
          gap: clamp(32px, 6vw, 88px);
        }
        .brand-zigzag-copy,
        .brand-zigzag-media {
          min-width: 0;
        }
        .brand-zigzag-media {
          width: 100%;
        }
        .hero-tech-surface {
          background-image:
            linear-gradient(rgba(0,217,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,217,255,0.035) 1px, transparent 1px);
          background-size: 42px 42px;
          animation: gridDrift 18s linear infinite;
        }
        .tech-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #43FFB1;
          animation: statusPulse 2.2s ease-in-out infinite;
        }
        .tech-data-line {
          position: relative;
          height: 3px;
          overflow: hidden;
          border-radius: 10px;
          background: linear-gradient(90deg, rgba(0,217,255,0.12), rgba(128,73,255,0.30));
        }
        .tech-data-line::after {
          content: '';
          position: absolute;
          inset: 0 auto 0 0;
          width: 32%;
          background: linear-gradient(90deg, transparent, #61E6FF, #F251FF, transparent);
          animation: dataSweep 3.4s linear infinite;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: clamp(12px,2vw,26px);
        }
        .nav-links a {
          color: rgba(255,255,255,0.62);
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.10em;
          font-size: 0.60rem;
          font-weight: 800;
        }
        .nav-links a:hover { color: #61E6FF; }
        .mobile-tech-cta { display: none; }
        .brand-video-grid .brand-zigzag-media {
          grid-column: 1;
          grid-row: 1;
        }
        .brand-video-grid .brand-zigzag-copy {
          grid-column: 2;
          grid-row: 1;
        }
        .jsinnovia-footer-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
          align-items: center;
          gap: clamp(32px, 6vw, 88px);
        }
        .jsinnovia-services-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        @media (max-width: 760px) {
          .brand-zigzag {
            grid-template-columns: minmax(0, 1fr);
            gap: 24px;
          }
          .brand-video-grid .brand-zigzag-copy { grid-column: 1; grid-row: auto; order: 1; }
          .brand-video-grid .brand-zigzag-media { grid-column: 1; grid-row: auto; order: 2; }
          .brand-zigzag-media img,
          .brand-zigzag-media video { width: 100% !important; }
          .hero-pixelium-logo { width: min(64vw, 270px) !important; }
          .jsinnovia-footer-grid { grid-template-columns: minmax(0, 1fr); gap: 30px; }
          .nav-links { display: none; }
          .mobile-tech-cta.is-visible {
            position: fixed;
            display: flex;
            left: 14px;
            right: 14px;
            bottom: 12px;
            z-index: 120;
            justify-content: center;
            align-items: center;
            gap: 8px;
            padding: 13px 18px;
            border-radius: 999px;
            color: #fff;
            text-decoration: none;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            font-size: 0.74rem;
            font-weight: 900;
            background: linear-gradient(135deg,#007FA0,#7353FF,#C535FF);
            box-shadow: 0 14px 38px rgba(36,72,255,0.42);
          }
        }
        @media (max-width: 420px) {
          .pixelium-main-nav {
            position: relative !important;
            flex-direction: column;
            align-items: stretch !important;
          }
          .pixelium-main-nav > div { width: 100% !important; box-sizing: border-box; justify-content: center !important; }
          .jsinnovia-services-grid { grid-template-columns: minmax(0, 1fr); }
        }
        @media (prefers-reduced-motion: reduce) {
          .pixelium-signage-page img,
          .pixelium-signage-page video,
          .hero-tech-surface,
          .tech-status-dot,
          .tech-data-line::after { animation: none; }
        }
      `}</style>

      {/* ══ IDENTITÉ PIXELIUM ══ */}
      <nav className="pixelium-main-nav" aria-label="Navigation principale" style={{
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
        <div className="nav-links" aria-label="Accès rapides">
          <a href="#experience">Expérience</a>
          <a href="#technologie">Technologie</a>
          <a href="#forfaits">Forfaits</a>
          <a href="#devis">Devis</a>
        </div>
        <div style={{
          width: 'min(44vw, 270px)', padding: '7px 10px', borderRadius: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10,
          background: 'rgba(0,180,216,0.08)', border: '1px solid rgba(117,75,255,0.28)'
        }}>
          <img src="/branding/signelya-logo-carre.png" alt="Logo SIGNELYA"
            width="1536" height="1536" style={{ display: 'block', width: 58, height: 58, flexShrink: 0, objectFit: 'contain', borderRadius: 14 }} />
          <div style={{ maxWidth: 150, textAlign: 'left' }}>
            <div style={{ fontSize: '0.68rem', color: C.white, fontWeight: 900, letterSpacing: '0.08em' }}>SIGNELYA</div>
            <div style={{ fontSize: '0.54rem', color: C.muted, lineHeight: 1.35 }}>Application de diffusion utilisée par Pixelium</div>
          </div>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section id="experience" className="hero-tech-surface" style={{ position: 'relative', padding: 'clamp(72px,10vw,112px) 5% clamp(52px,8vw,80px)', overflow: 'hidden',
        borderBottom: '1px solid rgba(0,180,216,0.14)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 50%, rgba(0,180,216,0.12) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 20%, rgba(212,175,55,0.08) 0%, transparent 55%)', pointerEvents: 'none' }} />
        <motion.div className="brand-zigzag brand-hero-grid" initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ position: 'relative', zIndex: 2 }}>
          <div className="brand-zigzag-copy">
          <img
            className="hero-pixelium-logo"
            src="/pixelium-logo.png"
            alt="Pixelium — entreprise de diffusion digitale"
            width="512"
            height="512"
            style={{ display: 'block', width: 'min(78vw, 360px)', height: 'auto', objectFit: 'contain', margin: '0 0 20px' }}
          />
          <p style={{ margin: '0 0 24px', textAlign: 'left', color: C.muted, fontSize: '0.68rem', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
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
            sur le grand écran LED de l'Espace C. Choisissez votre forfait et fournissez votre visuel prêt à diffuser.
          </p>

          {/* Information sur le visuel */}
          <div style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 10, background: 'rgba(0,180,216,0.10)',
            border: '1px solid rgba(0,180,216,0.35)', borderRadius: 10, padding: '10px 16px', marginBottom: 28, maxWidth: 600 }}>
            <Sparkles size={16} color={C.gold} style={{ marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: '0.75rem', color: C.silver, margin: 0, lineHeight: 1.55 }}>
              <strong style={{ color: C.gold }}>Visuel non fourni.</strong>{' '}
              La création graphique ou vidéo de votre spot publicitaire est à votre charge. Formats acceptés : JPEG, PNG et MP4. Besoin d'aide ? <a href="https://www.jsinnovia.com" target="_blank" rel="noopener noreferrer" style={{ color: C.cyan, fontWeight: 700, textDecoration: 'none' }}>JS-Innov.IA</a> peut vous accompagner sur devis.
            </p>
          </div>

          <a href="#devis" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 30px',
            background: 'linear-gradient(135deg,#007FA0,#00B4D8)', color: '#fff',
            fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.10em', fontSize: '0.82rem',
            borderRadius: 50, textDecoration: 'none', boxShadow: '0 6px 24px rgba(0,180,216,0.45)' }}>
            Demander un devis <ArrowRight size={16} />
          </a>
          </div>
          <div className="brand-zigzag-media" style={{
            padding: 'clamp(10px,2vw,18px)', borderRadius: 28,
            background: 'linear-gradient(145deg,rgba(8,21,38,0.96),rgba(15,9,38,0.96))',
            border: '1px solid rgba(0,217,255,0.30)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.44), 0 0 40px rgba(117,75,255,0.14)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '4px 4px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <img src="/branding/signelya-logo-carre.png" alt="" width="40" height="40" style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 11 }} />
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 900, letterSpacing: '0.10em' }}>SIGNELYA</div>
                  <div style={{ fontSize: '0.54rem', color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Console de démonstration</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 50, background: 'rgba(67,255,177,0.08)', border: '1px solid rgba(67,255,177,0.24)' }}>
                <span className="tech-status-dot" />
                <span style={{ color: '#71FFC0', fontSize: '0.56rem', fontWeight: 900, letterSpacing: '0.10em', textTransform: 'uppercase' }}>Écran en ligne</span>
              </div>
            </div>
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 22, border: '1px solid rgba(97,230,255,0.22)' }}>
              <img
                src="/branding/signelya-officiel-jsinnovia.png"
                alt="Aperçu SIGNELYA — pilotage de la diffusion digitale"
                width="1672"
                height="941"
                style={{ display: 'block', width: '100%', height: 'auto', objectFit: 'cover', borderRadius: 22 }}
              />
              <div style={{ position: 'absolute', left: 12, right: 12, bottom: 12, display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ padding: '7px 10px', borderRadius: 50, background: 'rgba(2,7,15,0.86)', border: '1px solid rgba(0,217,255,0.30)', backdropFilter: 'blur(10px)', fontSize: '0.56rem', fontWeight: 800 }}>Espace C · Dour</span>
                <span style={{ padding: '7px 10px', borderRadius: 50, background: 'rgba(2,7,15,0.86)', border: '1px solid rgba(197,53,255,0.30)', backdropFilter: 'blur(10px)', fontSize: '0.56rem', fontWeight: 800 }}>Pilotage à distance</span>
              </div>
            </div>
            <div style={{ padding: '16px 4px 4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 9, fontSize: '0.58rem', color: C.silver }}>
                <span>Flux de programmation</span><span style={{ color: C.cyan }}>Synchronisé</span>
              </div>
              <div className="tech-data-line" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 8, marginTop: 14 }}>
                {[
                  ['+300', 'diffusions / jour'],
                  ['10 s', 'spot en rotation'],
                  ['24/7', 'diffusion continue'],
                ].map(([value, label]) => (
                  <div key={label} style={{ padding: '11px 8px', textAlign: 'center', borderRadius: 13, background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ color: C.cyan, fontSize: 'clamp(0.86rem,2vw,1.08rem)', fontWeight: 950 }}>{value}</div>
                    <div style={{ color: C.muted, fontSize: '0.50rem', lineHeight: 1.35 }}>{label}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.56rem', color: C.muted, lineHeight: 1.5, margin: '12px 2px 0', textAlign: 'center' }}>
                Aperçu de démonstration — SIGNELYA est conçue par <a href="https://www.jsinnovia.com" target="_blank" rel="noopener noreferrer" style={{ color: C.cyan, fontWeight: 700, textDecoration: 'none' }}>JS-Innov.IA</a> et utilisée par Pixelium.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══ VIDÉO PROMOTIONNELLE ══ */}
      <section id="technologie" aria-labelledby="video-promotionnelle" style={{
        padding: 'clamp(48px,8vw,76px) 5%',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'radial-gradient(ellipse at 50% 10%, rgba(117,75,255,0.10) 0%, transparent 62%)'
      }}>
        <motion.div className="brand-zigzag brand-video-grid" {...fadeUp}>
          <div className="brand-zigzag-copy">
          <p style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.gold, marginBottom: 10 }}>
            Découvrez l'offre en images
          </p>
          <h2 id="video-promotionnelle" style={{ fontSize: 'clamp(1.3rem,3.5vw,2rem)', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 10px' }}>
            Votre publicité sur <span style={{ color: C.cyan }}>l'écran géant de Dour</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: C.silver, lineHeight: 1.65, margin: '0 0 24px', maxWidth: 680 }}>
            Découvrez le dispositif Pixelium à l'Espace C et la puissance d'une campagne diffusée avec SIGNELYA.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['Programmation distante', 'Surveillance de diffusion', 'Calendrier automatisé'].map(item => (
              <span key={item} style={{ padding: '8px 10px', borderRadius: 50, border: '1px solid rgba(0,217,255,0.22)', background: 'rgba(0,217,255,0.06)', color: C.silver, fontSize: '0.60rem', fontWeight: 750 }}>
                {item}
              </span>
            ))}
          </div>
          </div>
          <div className="brand-zigzag-media">
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
              poster="/branding/signelya-officiel-jsinnovia.png"
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
          </div>
        </motion.div>
      </section>

      {/* ══ CHIFFRE CLÉ EXPLIQUÉ ══ */}
      <section aria-labelledby="chiffres-cles" style={{ padding: 'clamp(38px,6vw,56px) 5%', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <motion.div className="brand-zigzag" {...fadeUp}>
          <div className="brand-zigzag-copy">
          <p style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.gold, marginBottom: 10 }}>
            Fréquence de diffusion
          </p>
          <h2 id="chiffres-cles" style={{ fontSize: 'clamp(1.3rem,3.5vw,2rem)', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 22px' }}>
            Plus de <span style={{ color: C.cyan }}>300 passages du spot</span> par jour
          </h2>
          <p style={{ fontSize: '0.82rem', color: C.silver, lineHeight: 1.65, margin: 0 }}>
            Une fréquence élevée et régulière pour donner à votre campagne une présence continue sur l'écran géant de l'Espace C.
          </p>
          </div>
          <div className="brand-zigzag-media" style={{ padding: 'clamp(22px,4vw,30px)', borderRadius: 20, background: 'linear-gradient(145deg,rgba(0,217,255,0.12),rgba(117,75,255,0.07))', border: '1px solid rgba(0,217,255,0.32)', boxShadow: '0 14px 36px rgba(0,217,255,0.08)' }}>
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
      <section id="forfaits" style={{ padding: 'clamp(52px,8vw,80px) 5%', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
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
                <div style={{ display: 'inline-flex', padding: '6px 10px', marginBottom: 14, borderRadius: 50, background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.22)', color: C.gold, fontSize: '0.58rem', fontWeight: 850, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Tarif communiqué dans le devis
                </div>
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
            Le visuel n'est pas inclus dans l'abonnement. Vous pouvez fournir votre fichier JPEG, PNG ou MP4, ou demander à <a href="https://www.jsinnovia.com" target="_blank" rel="noopener noreferrer" style={{ color: C.cyan, fontWeight: 700, textDecoration: 'none' }}>JS-Innov.IA</a> un accompagnement créatif distinct, établi sur devis.
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
                  Accompagnement créatif — Impact 4K
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
                    Demander une aide créative
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
                    Votre devis en 3 étapes
                  </h3>
                  <div role="progressbar" aria-label={`Étape ${quoteStep} sur 3`} aria-valuemin="1" aria-valuemax="3" aria-valuenow={quoteStep}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginBottom: 8 }}>
                    {[1, 2, 3].map(step => (
                      <div key={step} style={{ height: 4, borderRadius: 10, background: step <= quoteStep ? 'linear-gradient(90deg,#00B4D8,#8C55FF)' : 'rgba(255,255,255,0.08)' }} />
                    ))}
                  </div>

                  {quoteStep === 1 && (
                    <motion.div initial={{ opacity: 0.7, x: 8 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div style={{ fontSize: '0.64rem', color: C.silver, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.10em' }}>1 · Choisissez votre formule</div>
                      <div style={{ display: 'grid', gap: 9 }}>
                        {PACKS.map(p => (
                          <button key={p.id} type="button" onClick={() => setSelected(p.id)}
                            style={{ padding: '14px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
                              background: selected === p.id ? 'rgba(0,180,216,0.14)' : 'rgba(6,9,15,0.55)',
                              border: `1px solid ${selected === p.id ? C.cyan : 'rgba(255,255,255,0.09)'}`,
                              borderRadius: 12, color: selected === p.id ? C.white : C.silver, cursor: 'pointer' }}>
                            <span><strong style={{ display: 'block', fontSize: '0.76rem' }}>{p.label}</strong><small style={{ color: C.muted }}>{p.tag}</small></span>
                            {selected === p.id && <CheckCircle size={18} color={C.cyan} />}
                          </button>
                        ))}
                      </div>
                      <p style={{ margin: 0, color: C.muted, fontSize: '0.64rem', lineHeight: 1.55 }}>Le prix exact et les conditions détaillées seront indiqués dans votre devis.</p>
                      <button type="button" onClick={() => { setError(''); setQuoteStep(2); }} style={{ padding: 13, borderRadius: 50, border: 'none', color: '#fff', fontWeight: 900, cursor: 'pointer', background: 'linear-gradient(135deg,#007FA0,#7353FF)' }}>
                        Continuer <ArrowRight size={15} style={{ display: 'inline', marginLeft: 7 }} />
                      </button>
                    </motion.div>
                  )}

                  {quoteStep === 2 && (
                    <motion.div initial={{ opacity: 0.7, x: 8 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                      <div style={{ fontSize: '0.64rem', color: C.silver, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.10em' }}>2 · Vos coordonnées</div>
                      {[
                        { name: 'prenom', label: 'Prénom *', type: 'text' },
                        { name: 'nom', label: 'Nom *', type: 'text' },
                        { name: 'entreprise', label: 'Entreprise / Asso.', type: 'text' },
                        { name: 'email', label: 'Email *', type: 'email' },
                        { name: 'telephone', label: 'Téléphone *', type: 'tel' },
                      ].map(({ name, label, type }) => (
                        <div key={name}>
                          <label htmlFor={`quote-${name}`} style={{ display: 'block', fontSize: '0.60rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.silver, marginBottom: 4 }}>{label}</label>
                          <input id={`quote-${name}`} name={name} type={type} value={form[name]} onChange={e => setForm({ ...form, [name]: e.target.value })}
                            style={{ width: '100%', padding: '11px 12px', background: 'rgba(6,9,15,0.7)', border: '1px solid rgba(0,180,216,0.18)', borderRadius: 9, color: C.white, fontSize: '0.84rem', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                      ))}
                      <div>
                        <label htmlFor="quote-message" style={{ display: 'block', fontSize: '0.60rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.silver, marginBottom: 4 }}>Message (optionnel)</label>
                        <textarea id="quote-message" name="message" rows={3} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Décrivez votre campagne..."
                          style={{ width: '100%', padding: '11px 12px', background: 'rgba(6,9,15,0.7)', border: '1px solid rgba(0,180,216,0.18)', borderRadius: 9, color: C.white, fontSize: '0.82rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                      </div>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 10, padding: '10px 12px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={form.creationVisuelle} onChange={e => setForm({ ...form, creationVisuelle: e.target.checked })} style={{ marginTop: 3, accentColor: C.gold }} />
                        <span style={{ fontSize: '0.70rem', color: C.gold, lineHeight: 1.5 }}>Je souhaite aussi recevoir une proposition distincte de <a href="https://www.jsinnovia.com" target="_blank" rel="noopener noreferrer" style={{ color: C.cyan, fontWeight: 700, textDecoration: 'none' }}>JS-Innov.IA</a> pour créer mon visuel.</span>
                      </label>
                      {error && <p style={{ fontSize: '0.70rem', color: C.red, margin: 0 }}>{error}</p>}
                      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 9 }}>
                        <button type="button" onClick={() => { setError(''); setQuoteStep(1); }} style={{ padding: '12px 15px', borderRadius: 50, border: '1px solid rgba(255,255,255,0.14)', color: C.silver, background: 'transparent', cursor: 'pointer' }}>Retour</button>
                        <button type="button" onClick={goToSummary} style={{ padding: 12, borderRadius: 50, border: 'none', color: '#fff', fontWeight: 900, cursor: 'pointer', background: 'linear-gradient(135deg,#007FA0,#7353FF)' }}>Voir le récapitulatif</button>
                      </div>
                    </motion.div>
                  )}

                  {quoteStep === 3 && (
                    <motion.div initial={{ opacity: 0.7, x: 8 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                      <div style={{ fontSize: '0.64rem', color: C.silver, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.10em' }}>3 · Vérifiez votre demande</div>
                      <div style={{ padding: 16, borderRadius: 13, background: 'linear-gradient(145deg,rgba(0,180,216,0.09),rgba(117,75,255,0.07))', border: '1px solid rgba(0,180,216,0.22)' }}>
                        <div style={{ color: C.cyan, fontSize: '0.72rem', fontWeight: 900, marginBottom: 8 }}>{PACKS.find(p => p.id === selected)?.label}</div>
                        <div style={{ color: C.silver, fontSize: '0.70rem', lineHeight: 1.65 }}>{form.prenom} {form.nom}<br />{form.entreprise || 'Sans entreprise renseignée'}<br />{form.email}<br />{form.telephone}</div>
                        <div style={{ marginTop: 10, color: form.creationVisuelle ? C.gold : C.muted, fontSize: '0.64rem' }}>{form.creationVisuelle ? 'Aide créative demandée sur devis distinct' : 'Visuel fourni par le client'}</div>
                      </div>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                        <input type="checkbox" required checked={form.rgpd} onChange={e => setForm({ ...form, rgpd: e.target.checked })} style={{ marginTop: 3, accentColor: C.cyan, width: 15, height: 15 }} />
                        <span style={{ fontSize: '0.64rem', color: C.muted, lineHeight: 1.5 }}>J'accepte que mes données soient utilisées pour répondre à ma demande. Données non revendues ni partagées. (RGPD UE 2016/679) *</span>
                      </label>
                      {error && <p style={{ fontSize: '0.70rem', color: C.red, margin: 0 }}>{error}</p>}
                      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 9 }}>
                        <button type="button" onClick={() => { setError(''); setQuoteStep(2); }} style={{ padding: '12px 15px', borderRadius: 50, border: '1px solid rgba(255,255,255,0.14)', color: C.silver, background: 'transparent', cursor: 'pointer' }}>Modifier</button>
                        <button type="submit" disabled={sending} style={{ padding: 13, borderRadius: 50, border: 'none', color: '#fff', fontWeight: 900, cursor: sending ? 'wait' : 'pointer', background: sending ? 'rgba(0,180,216,0.25)' : 'linear-gradient(135deg,#007FA0,#00B4D8,#7353FF)', boxShadow: sending ? 'none' : '0 8px 28px rgba(0,180,216,0.38)' }}>
                          {sending ? 'Envoi en cours…' : <><Send size={14} style={{ display: 'inline', marginRight: 7 }} />Envoyer ma demande</>}
                        </button>
                      </div>
                      <p style={{ fontSize: '0.60rem', color: C.muted, textAlign: 'center', margin: 0 }}>Devis gratuit · Abonnement annuel · Paiement mensuel</p>
                    </motion.div>
                  )}
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══ FOOTER PREMIUM JS-INNOV.IA ══ */}
      <footer style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(145deg,#02040A 0%,#07101F 42%,#09051A 100%)',
        borderTop: '1px solid rgba(0,217,255,0.28)',
        padding: 'clamp(64px,9vw,112px) 5% clamp(30px,5vw,48px)'
      }}>
        <div aria-hidden="true" style={{ position: 'absolute', width: '52vw', height: '52vw', minWidth: 360, minHeight: 360, left: '-18vw', top: '-24vw', borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,217,255,0.16),transparent 68%)', filter: 'blur(8px)' }} />
        <div aria-hidden="true" style={{ position: 'absolute', width: '48vw', height: '48vw', minWidth: 340, minHeight: 340, right: '-16vw', bottom: '-25vw', borderRadius: '50%', background: 'radial-gradient(circle,rgba(197,53,255,0.16),transparent 68%)', filter: 'blur(8px)' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto' }}>
          <div className="jsinnovia-footer-grid">
            <div>
              <p style={{ margin: '0 0 14px', color: C.gold, fontSize: '0.64rem', fontWeight: 900, letterSpacing: '0.28em', textTransform: 'uppercase' }}>
                Agence digitale premium · Belgique
              </p>
              <a href="https://www.jsinnovia.com" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 16, color: C.white, textDecoration: 'none', marginBottom: 22 }}>
                <span aria-hidden="true" style={{
                  width: 72, height: 72, borderRadius: 22, display: 'grid', placeItems: 'center',
                  background: 'linear-gradient(145deg,rgba(0,217,255,0.18),rgba(151,55,255,0.24))',
                  border: '1px solid rgba(0,217,255,0.46)',
                  boxShadow: '0 18px 48px rgba(0,0,0,0.46),0 0 34px rgba(0,217,255,0.18)',
                  fontSize: '1.55rem', fontWeight: 950, letterSpacing: '-0.08em'
                }}>JS</span>
                <span style={{
                  fontSize: 'clamp(1.8rem,5vw,3.4rem)', fontWeight: 950, letterSpacing: '-0.04em', lineHeight: 1,
                  background: 'linear-gradient(90deg,#FFFFFF 0%,#61E6FF 42%,#8E6BFF 72%,#F251FF 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                }}>JS-Innov.IA</span>
              </a>
              <h2 style={{ margin: '0 0 18px', maxWidth: 720, fontSize: 'clamp(1.5rem,3.4vw,2.65rem)', lineHeight: 1.12, fontWeight: 900 }}>
                Nous transformons les idées ambitieuses en expériences digitales remarquables.
              </h2>
              <p style={{ margin: '0 0 28px', maxWidth: 660, color: C.silver, fontSize: 'clamp(0.84rem,1.7vw,1rem)', lineHeight: 1.75 }}>
                Stratégie, identité, sites, applications, intelligence artificielle et contenus visuels : une réalisation sur mesure, pensée pour conjuguer impact, élégance et performance.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <a href="https://www.jsinnovia.com" target="_blank" rel="noopener noreferrer" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 9, padding: '13px 22px', borderRadius: 50,
                  color: '#fff', textDecoration: 'none', fontSize: '0.76rem', fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase',
                  background: 'linear-gradient(135deg,#007FA0,#7353FF,#C535FF)',
                  boxShadow: '0 12px 34px rgba(85,70,255,0.34)'
                }}>
                  Découvrir JS-Innov.IA <ArrowRight size={15} />
                </a>
                <a href="mailto:info@jsinnovia.com" style={{ color: C.cyan, textDecoration: 'none', fontSize: '0.78rem', fontWeight: 750 }}>
                  info@jsinnovia.com
                </a>
              </div>
            </div>

            <div className="jsinnovia-services-grid">
              {[
                ['01', 'Sites haut de gamme', 'Design, développement et conversion.'],
                ['02', 'Applications & IA', 'Outils intelligents et automatisations.'],
                ['03', 'Identités visuelles', 'Marques fortes, cohérentes et mémorables.'],
                ['04', 'Images & vidéos', 'Créations premium pensées pour la diffusion.'],
              ].map(([number, title, description]) => (
                <div key={number} style={{
                  minHeight: 145, padding: '20px 18px', borderRadius: 20,
                  background: 'linear-gradient(145deg,rgba(255,255,255,0.055),rgba(255,255,255,0.018))',
                  border: '1px solid rgba(255,255,255,0.10)',
                  boxShadow: '0 18px 42px rgba(0,0,0,0.24)', backdropFilter: 'blur(14px)'
                }}>
                  <div style={{ color: C.gold, fontSize: '0.58rem', fontWeight: 900, letterSpacing: '0.18em', marginBottom: 18 }}>{number}</div>
                  <div style={{ color: C.white, fontSize: '0.88rem', fontWeight: 900, marginBottom: 7 }}>{title}</div>
                  <div style={{ color: C.muted, fontSize: '0.68rem', lineHeight: 1.55 }}>{description}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            marginTop: 'clamp(48px,7vw,76px)', paddingTop: 24,
            borderTop: '1px solid rgba(255,255,255,0.09)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <img src="/pixelium-logo.png" alt="Pixelium" width="42" height="42" style={{ width: 42, height: 42, objectFit: 'cover', borderRadius: 11 }} />
              <div style={{ fontSize: '0.66rem', color: C.silver, lineHeight: 1.55 }}>
                <strong style={{ color: C.white }}>PIXELIUM</strong> — entreprise de diffusion digitale<br />
                <strong style={{ color: C.cyan }}>SIGNELYA</strong> — application de diffusion utilisée par Pixelium
              </div>
            </div>
            <div style={{ fontSize: '0.64rem', color: C.muted, textAlign: 'right', lineHeight: 1.6 }}>
              Conception de cette expérience par <a href="https://www.jsinnovia.com" target="_blank" rel="noopener noreferrer" style={{ color: C.cyan, fontWeight: 800, textDecoration: 'none' }}>JS-Innov.IA</a><br />
              {`© ${new Date().getFullYear()} Pixelium — Tous droits réservés`}
            </div>
          </div>
        </div>
      </footer>

      <a className={`mobile-tech-cta${showMobileCta ? ' is-visible' : ''}`} href="#devis" aria-label="Accéder au devis gratuit">
        Devis gratuit <ArrowRight size={15} />
      </a>

    </div>
  );
}
