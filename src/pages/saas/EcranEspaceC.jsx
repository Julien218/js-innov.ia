import { useState } from "react";
import { motion } from "framer-motion";

const C = {
  bg:       "#050B16",
  bgDeep:   "#02060C",
  navyCard: "rgba(15,23,42,0.85)",
  gold:     "#D4AF37",
  goldLight:"#E0C065",
  white:    "#FFFFFF",
  silver:   "#A8B8CC",
  muted:    "rgba(168,184,204,0.55)",
  cream:    "#F5EADD",
  darkText: "#1a1a1a",
};

const fadeUp = {
  initial:    { opacity: 0, y: 28 },
  whileInView:{ opacity: 1, y: 0 },
  viewport:   { once: true },
  transition: { duration: 0.55 },
};

const SERVICES = [
  { icon: "🌐", title: "Création de sites web",
    text: "Sites vitrines, landing pages et expériences web rapides, élégantes et pensées pour convertir les visiteurs en demandes." },
  { icon: "🎨", title: "Logo & identité visuelle",
    text: "Logos, palettes, typographies et univers visuels cohérents pour donner à votre activité une image forte et mémorable." },
  { icon: "🤖", title: "Automatisation IA",
    text: "Formulaires intelligents, réponses, rappels et outils connectés pour réduire les tâches répétitives et gagner du temps." },
  { icon: "📊", title: "SaaS & outils métier",
    text: "Applications et tableaux de bord sur mesure pour simplifier votre organisation, vos demandes et le suivi de vos clients." },
];

const WHY = [
  { icon: "🤝", title: "Approche humaine",     text: "Une écoute réelle et un accompagnement clair à chaque étape." },
  { icon: "📐", title: "Solutions sur mesure", text: "Chaque projet est construit autour de vos besoins et de votre budget." },
  { icon: "✨", title: "Design premium",       text: "Une identité élégante et crédible qui inspire confiance." },
  { icon: "🔧", title: "Outils utiles",        text: "Des automatisations concrètes, sans technologie gadget." },
  { icon: "📞", title: "Accompagnement",        text: "Un suivi régulier avant, pendant et après la mise en ligne." },
  { icon: "📍", title: "Basé en Belgique",      text: "Une présence locale dans le Hainaut et un service de proximité." },
];

const REALISATIONS = [
  { cat: "WEB DESIGN & UI", title: "Fashionist'ART Dour",
    text: "Conception visuelle, mise en page et adaptation de l'identité graphique au web pour Olivier Trevis.",
    link: "https://www.oliviertrevis.be/fashionistart" },
  { cat: "DESIGN PRINT", title: "Roll-up Fashionist'ART",
    text: "Création d'un support événementiel 85 × 200 cm pour l'ASBL Starlight et Fashionist'ART Dour.",
    link: null },
  { cat: "SOLUTION MÉTIER", title: "Assistant vocal infirmières",
    text: "Prototype d'assistant vocal pour structurer les demandes, les rendez-vous et les rappels des infirmières indépendantes.",
    link: null },
];

const PACKS = [
  { title: "Pack Présence", desc: "Pour lancer ou moderniser votre présence professionnelle en ligne.", highlight: false,
    items: ["Page vitrine ou landing page","Design responsive","Formulaire de contact","Optimisation SEO de base","Mise en ligne accompagnée"] },
  { title: "Pack Identité", desc: "Pour construire une image cohérente, distinctive et mémorable.", highlight: true,
    items: ["Logo principal et déclinaisons","Palette de couleurs","Sélection typographique","Visuels pour réseaux sociaux","Mini charte graphique"] },
  { title: "Pack Automatisation IA", desc: "Pour réduire vos tâches répétitives et structurer vos demandes.", highlight: false,
    items: ["Analyse de vos processus","Automatisation sur mesure","Connexion formulaires et e-mails","Notifications et rappels","Formation et accompagnement"] },
];

const FAQS = [
  { q: "Combien coûte la création d'un site internet ?", a: "Le tarif dépend du type de site (vitrine, landing page, e-commerce), du nombre de pages et des fonctionnalités. Un pack Présence démarre à un tarif accessible, et chaque projet est personnalisé après un audit gratuit de vos besoins." },
  { q: "Travaillez-vous avec les indépendants et petites entreprises ?", a: "Oui, JY-Trix.AI est spécialisé dans l'accompagnement des indépendants, artisans et PME belges. Les solutions sont pensées pour des budgets réalistes et un retour sur investissement rapide." },
  { q: "Pouvez-vous automatiser mes demandes et mes rappels ?", a: "Absolument. Le pack Automatisation IA connecte vos formulaires, e-mails et notifications pour réduire les tâches répétitives : réponses automatiques, rappels de rendez-vous, suivi de demandes clients." },
  { q: "Intervenez-vous uniquement dans le Hainaut ?", a: "JY-Trix.AI est basé dans le Hainaut mais intervient partout en Belgique. Les échanges se font en présentiel ou à distance selon vos préférences." },
];

const BUDGETS = ["< 500 €","500 – 1 500 €","1 500 – 5 000 €","5 000 – 10 000 €","> 10 000 €","À définir ensemble"];
const PROJECT_TYPES = ["Site internet","Logo / identité visuelle","Automatisation IA","Application / SaaS","Audit gratuit","Autre"];

export default function EcranEspaceC() {
  const [form, setForm] = useState({ nom: "", email: "", telephone: "", entreprise: "", projet: "", budget: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await fetch("https://formspree.io/f/xkgbpozd", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...form,
          _subject: "Nouvelle demande — JY-Trix.AI Portfolio",
          _replyto: form.email,
        }),
      });
      setSent(true);
    } catch {
      setSent(true);
    }
    setSending(false);
  };

  const field = (name, label, type = "text", required = true) => (
    <div>
      <label style={{ display: "block", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.silver, marginBottom: 4 }}>{label}</label>
      <input name={name} type={type} required={required} value={form[name]}
        onChange={e => setForm({ ...form, [name]: e.target.value })}
        style={{ width: "100%", padding: "10px 13px", background: "rgba(5,11,22,0.7)", border: "1px solid rgba(212,175,55,0.20)",
          borderRadius: 9, color: C.white, fontSize: "clamp(0.82rem,2.5vw,0.85rem)", outline: "none", boxSizing: "border-box" }}
        onFocus={e => e.target.style.borderColor = C.gold}
        onBlur={e => e.target.style.borderColor = "rgba(212,175,55,0.20)"} />
    </div>
  );

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", background: C.bg, color: C.white, minHeight: "100vh", overflowX: "hidden" }}>

      {/* ══ NAV ══ */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(5,11,22,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "12px 5%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#D4AF37,#8B6914)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "0.8rem", color: "#050B16" }}>JY</div>
          <span style={{ fontWeight: 800, fontSize: "clamp(0.85rem,2.5vw,0.95rem)", letterSpacing: "0.02em" }}>JY-Trix.AI</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(10px,2vw,24px)" }}>
          <a href="#services" style={{ fontSize: "clamp(0.68rem,1.8vw,0.78rem)", color: C.silver, textDecoration: "none" }}>Services</a>
          <a href="#realisations" style={{ fontSize: "clamp(0.68rem,1.8vw,0.78rem)", color: C.silver, textDecoration: "none" }}>Réalisations</a>
          <a href="#contact" style={{ fontSize: "clamp(0.68rem,1.8vw,0.78rem)", fontWeight: 700, padding: "7px 16px", border: "1px solid rgba(212,175,55,0.45)", borderRadius: 50, color: C.gold, textDecoration: "none" }}>Audit gratuit</a>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section style={{ position: "relative", minHeight: "100svh", display: "flex", alignItems: "center", overflow: "hidden", paddingTop: 60 }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 30%, rgba(212,175,55,0.08) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(0,80,160,0.06) 0%, transparent 50%)" }} />

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
          style={{ position: "relative", zIndex: 10, padding: "0 5%", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          <p style={{ fontSize: "clamp(0.62rem,2.5vw,0.72rem)", fontWeight: 700, letterSpacing: "0.30em", textTransform: "uppercase", color: C.gold, marginBottom: 16, opacity: 0.9 }}>
            — Création digitale · Hainaut
          </p>
          <h1 style={{ fontSize: "clamp(2rem,6.5vw,4.2rem)", fontWeight: 900, lineHeight: 1.05, margin: "0 0 22px", color: C.white }}>
            Sites web, logos &<br />automatisations IA<br />pour indépendants belges
          </h1>
          <p style={{ fontSize: "clamp(0.88rem,2.5vw,1.05rem)", color: C.silver, lineHeight: 1.7, maxWidth: 540, margin: "0 0 32px" }}>
            Des solutions digitales modernes et intelligentes pour gagner du temps, attirer plus de clients et développer votre activité avec une image forte.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a href="#contact" style={{ display: "inline-block", padding: "14px 28px", background: "linear-gradient(135deg,#D4AF37,#B8941E)", color: "#050B16",
              fontWeight: 800, fontSize: "clamp(0.78rem,2vw,0.85rem)", borderRadius: 50, textDecoration: "none",
              boxShadow: "0 6px 28px rgba(212,175,55,0.35)" }}>
              Demander un audit gratuit →
            </a>
            <a href="#services" style={{ display: "inline-block", padding: "14px 28px", background: "transparent", color: C.white,
              fontWeight: 700, fontSize: "clamp(0.78rem,2vw,0.85rem)", borderRadius: 50, textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.2)" }}>
              Voir mes services →
            </a>
          </div>
        </motion.div>

        <div style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)" }}>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }} style={{ width: 24, height: 24, borderRight: "2px solid rgba(212,175,55,0.4)", borderBottom: "2px solid rgba(212,175,55,0.4)", transform: "rotate(45deg)" }} />
        </div>
      </section>

      {/* ══ VALEURS BAR ══ */}
      <div style={{ background: C.bgDeep, borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)", padding: "18px 5%" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "clamp(16px,4vw,36px)" }}>
          {["Créativité","Sur mesure","Intelligence","Performance","Confiance"].map(v => (
            <span key={v} style={{ fontSize: "clamp(0.58rem,1.8vw,0.65rem)", fontWeight: 700, letterSpacing: "0.20em", textTransform: "uppercase", color: C.muted }}>— {v}</span>
          ))}
        </div>
      </div>

      {/* ══ SERVICES ══ */}
      <section id="services" style={{ background: C.bg, padding: "80px 5%", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <motion.div {...fadeUp} style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={{ fontSize: "clamp(0.60rem,2vw,0.65rem)", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: C.gold, marginBottom: 10 }}>Services</p>
          <h2 style={{ fontSize: "clamp(1.4rem,4vw,2.4rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: "clamp(28px,5vw,44px)" }}>
            Quatre expertises complémentaires
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: "clamp(14px,3vw,22px)" }}>
            {SERVICES.map(({ icon, title, text }) => (
              <motion.div key={title} {...fadeUp}
                style={{ background: C.navyCard, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "clamp(22px,4vw,28px)" }}>
                <div style={{ fontSize: "clamp(1.8rem,4vw,2.2rem)", marginBottom: 14 }}>{icon}</div>
                <h3 style={{ fontSize: "clamp(0.92rem,2.5vw,1rem)", fontWeight: 800, color: C.white, margin: "0 0 8px" }}>{title}</h3>
                <p style={{ fontSize: "clamp(0.78rem,2vw,0.82rem)", color: C.silver, lineHeight: 1.6, margin: 0 }}>{text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══ POURQUOI ══ */}
      <section style={{ background: C.bgDeep, padding: "80px 5%", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <motion.div {...fadeUp} style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={{ fontSize: "clamp(0.60rem,2vw,0.65rem)", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: C.gold, marginBottom: 10 }}>Pourquoi JY-Trix.AI</p>
          <h2 style={{ fontSize: "clamp(1.4rem,4vw,2.4rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: "clamp(28px,5vw,44px)" }}>
            Une approche locale, sur mesure
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))", gap: "clamp(14px,3vw,20px)" }}>
            {WHY.map(({ icon, title, text }) => (
              <motion.div key={title} {...fadeUp}
                style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ fontSize: "clamp(1.2rem,3vw,1.4rem)", flexShrink: 0 }}>{icon}</div>
                <div>
                  <h3 style={{ fontSize: "clamp(0.88rem,2.2vw,0.95rem)", fontWeight: 800, color: C.white, margin: "0 0 6px" }}>{title}</h3>
                  <p style={{ fontSize: "clamp(0.78rem,2vw,0.82rem)", color: C.silver, lineHeight: 1.6, margin: 0 }}>{text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══ RÉALISATIONS ══ */}
      <section id="realisations" style={{ background: C.bg, padding: "80px 5%", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <motion.div {...fadeUp} style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={{ fontSize: "clamp(0.60rem,2vw,0.65rem)", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: C.gold, marginBottom: 10 }}>Réalisations</p>
          <h2 style={{ fontSize: "clamp(1.4rem,4vw,2.4rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: 16, maxWidth: 600 }}>
            Une sélection de projets réels
          </h2>
          <p style={{ fontSize: "clamp(0.85rem,2.5vw,0.95rem)", color: C.silver, lineHeight: 1.7, marginBottom: "clamp(28px,5vw,44px)" }}>
            Réalisés ou actuellement développés par JY-Trix.AI.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))", gap: "clamp(14px,3vw,22px)" }}>
            {REALISATIONS.map(({ cat, title, text, link }) => (
              <motion.div key={title} {...fadeUp}
                style={{ background: C.navyCard, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "clamp(22px,4vw,28px)", display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "inline-flex", alignItems: "center", padding: "4px 12px", background: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 20, width: "fit-content" }}>
                  <span style={{ fontSize: "clamp(0.55rem,1.5vw,0.62rem)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.gold }}>{cat}</span>
                </div>
                <h3 style={{ fontSize: "clamp(0.95rem,2.5vw,1.05rem)", fontWeight: 800, color: C.white, margin: 0 }}>{title}</h3>
                <p style={{ fontSize: "clamp(0.80rem,2vw,0.85rem)", color: C.silver, lineHeight: 1.65, margin: 0, flex: 1 }}>{text}</p>
                {link ? (
                  <a href={link} target="_blank" rel="noopener noreferrer" style={{ fontSize: "clamp(0.75rem,2vw,0.82rem)", fontWeight: 700, color: C.gold, textDecoration: "none", marginTop: 6 }}>Voir le projet →</a>
                ) : (
                  <span style={{ fontSize: "clamp(0.75rem,2vw,0.82rem)", fontWeight: 700, color: C.muted, marginTop: 6 }}>En cours →</span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══ PACKS ══ */}
      <section style={{ background: C.bgDeep, padding: "80px 5%", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <motion.div {...fadeUp} style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={{ fontSize: "clamp(0.60rem,2vw,0.65rem)", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: C.gold, marginBottom: 10, textAlign: "center" }}>Packs & offres</p>
          <h2 style={{ fontSize: "clamp(1.4rem,4vw,2.4rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: 12, textAlign: "center" }}>
            Des bases claires, personnalisées
          </h2>
          <p style={{ fontSize: "clamp(0.85rem,2.5vw,0.95rem)", color: C.silver, lineHeight: 1.7, textAlign: "center", maxWidth: 500, margin: "0 auto clamp(32px,5vw,48px)" }}>
            Des bases claires qui restent personnalisées après l'analyse de vos objectifs et contraintes.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))", gap: "clamp(14px,3vw,22px)" }}>
            {PACKS.map(({ title, desc, items, highlight }) => (
              <motion.div key={title} {...fadeUp}
                style={{
                  background: highlight ? C.cream : C.navyCard,
                  border: highlight ? "1px solid rgba(212,175,55,0.4)" : "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 16, padding: "clamp(24px,4vw,32px)",
                  display: "flex", flexDirection: "column", gap: 14,
                  boxShadow: highlight ? "0 8px 40px rgba(212,175,55,0.12)" : "none",
                }}>
                <div style={{ fontSize: "clamp(1.5rem,4vw,2rem)" }}>{highlight ? "🎨" : "🌐"}</div>
                <h3 style={{ fontSize: "clamp(0.95rem,2.5vw,1.05rem)", fontWeight: 800, color: highlight ? C.darkText : C.white, margin: 0 }}>{title}</h3>
                <p style={{ fontSize: "clamp(0.80rem,2vw,0.85rem)", color: highlight ? "rgba(26,26,26,0.7)" : C.silver, lineHeight: 1.6, margin: 0 }}>{desc}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  {items.map(item => (
                    <li key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "clamp(0.78rem,2vw,0.82rem)", color: highlight ? C.darkText : C.silver, lineHeight: 1.5 }}>
                      <span style={{ color: highlight ? "#B8941E" : C.gold, fontWeight: 900 }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
                <a href="#contact" style={{
                  display: "block", textAlign: "center", padding: "12px", borderRadius: 50, textDecoration: "none",
                  fontWeight: 800, fontSize: "clamp(0.75rem,2vw,0.82rem)",
                  background: highlight ? "linear-gradient(135deg,#D4AF37,#B8941E)" : "transparent",
                  color: highlight ? "#050B16" : C.white,
                  border: highlight ? "none" : "1px solid rgba(255,255,255,0.2)",
                }}>Demander un devis</a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══ AUDIT CTA ══ */}
      <section style={{ background: C.bg, padding: "80px 5%", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <motion.div {...fadeUp} style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "clamp(2rem,5vw,3rem)", marginBottom: 16 }}>🔍</div>
          <h2 style={{ fontSize: "clamp(1.4rem,4vw,2.2rem)", fontWeight: 900, lineHeight: 1.2, marginBottom: 16 }}>
            Recevez un <span style={{ color: C.gold }}>audit gratuit</span> de votre site ou de votre idée
          </h2>
          <p style={{ fontSize: "clamp(0.85rem,2.5vw,0.95rem)", color: C.silver, lineHeight: 1.7, marginBottom: 32 }}>
            Un regard extérieur, des priorités concrètes et une proposition adaptée à votre activité.
          </p>
          <a href="#contact" style={{ display: "inline-block", padding: "16px 36px", background: "linear-gradient(135deg,#D4AF37,#B8941E)", color: "#050B16",
            fontWeight: 800, fontSize: "clamp(0.82rem,2vw,0.9rem)", borderRadius: 50, textDecoration: "none",
            boxShadow: "0 6px 28px rgba(212,175,55,0.35)" }}>
            Demander mon audit gratuit
          </a>
        </motion.div>
      </section>

      {/* ══ FAQ ══ */}
      <section style={{ background: C.bgDeep, padding: "80px 5%", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <motion.div {...fadeUp} style={{ maxWidth: 700, margin: "0 auto" }}>
          <p style={{ fontSize: "clamp(0.60rem,2vw,0.65rem)", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: C.gold, marginBottom: 10, textAlign: "center" }}>FAQ</p>
          <h2 style={{ fontSize: "clamp(1.4rem,4vw,2.4rem)", fontWeight: 900, textAlign: "center", marginBottom: "clamp(28px,5vw,40px)" }}>
            Questions fréquentes
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FAQS.map(({ q, a }, i) => (
              <div key={i} style={{ background: C.navyCard, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", padding: "16px 20px", background: "transparent", border: "none", color: C.white,
                    fontWeight: 700, fontSize: "clamp(0.82rem,2.2vw,0.88rem)", textAlign: "left", cursor: "pointer",
                    display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {q}
                  <span style={{ color: C.gold, fontSize: "1.2rem", flexShrink: 0 }}>{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 20px 16px", fontSize: "clamp(0.80rem,2vw,0.85rem)", color: C.silver, lineHeight: 1.7 }}>{a}</div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══ CONTACT ══ */}
      <section id="contact" style={{ background: C.bg, padding: "80px 5%", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <motion.div {...fadeUp} style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr", gap: "clamp(28px,5vw,48px)", alignItems: "start" }}>
          <div>
            <p style={{ fontSize: "clamp(0.60rem,2vw,0.65rem)", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: C.gold, marginBottom: 10 }}>Contact</p>
            <h2 style={{ fontSize: "clamp(1.4rem,4vw,2.4rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: 16 }}>
              Contactez-moi
            </h2>
            <p style={{ fontSize: "clamp(0.85rem,2.5vw,0.95rem)", color: C.silver, lineHeight: 1.7, marginBottom: 28, maxWidth: 440 }}>
              Présentez votre activité et votre objectif. Vous recevrez une réponse claire sur les prochaines étapes possibles.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a href="mailto:contact@jytrixai.com" style={{ fontSize: "clamp(0.82rem,2vw,0.88rem)", color: C.gold, textDecoration: "none" }}>✉ contact@jytrixai.com</a>
              <a href="https://www.jsinnovia.com" style={{ fontSize: "clamp(0.82rem,2vw,0.88rem)", color: C.silver, textDecoration: "none" }}>← jsinnovia.com</a>
            </div>
          </div>

          {sent ? (
            <div style={{ background: C.navyCard, border: "1px solid rgba(212,175,55,0.3)", borderRadius: 18, padding: "clamp(32px,5vw,48px)", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>✅</div>
              <h3 style={{ fontSize: "clamp(1rem,3vw,1.2rem)", fontWeight: 800, color: C.white, marginBottom: 8 }}>Message envoyé !</h3>
              <p style={{ fontSize: "clamp(0.85rem,2vw,0.9rem)", color: C.silver, lineHeight: 1.7 }}>Merci pour votre message. Je vous réponds dans les 24 heures.</p>
              <button onClick={() => setSent(false)} style={{ marginTop: 20, padding: "10px 24px", background: "transparent", border: "1px solid rgba(212,175,55,0.4)", borderRadius: 50, color: C.gold, fontWeight: 700, cursor: "pointer", fontSize: "0.82rem" }}>Envoyer un autre message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{
              display: "flex", flexDirection: "column", gap: 14,
              background: C.navyCard, border: "1px solid rgba(212,175,55,0.15)", borderRadius: 18,
              padding: "clamp(24px,4vw,36px) clamp(20px,4vw,30px)" }}>
              {field("nom", "Nom *", "text")}
              {field("email", "Email *", "email")}
              {field("telephone", "Téléphone (facultatif)", "tel", false)}
              {field("entreprise", "Entreprise", "text", false)}

              <div>
                <label style={{ display: "block", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.silver, marginBottom: 4 }}>Type de projet *</label>
                <select required value={form.projet} onChange={e => setForm({ ...form, projet: e.target.value })}
                  style={{ width: "100%", padding: "10px 13px", background: "rgba(5,11,22,0.7)", border: "1px solid rgba(212,175,55,0.20)",
                    borderRadius: 9, color: C.white, fontSize: "clamp(0.82rem,2.5vw,0.85rem)", outline: "none", boxSizing: "border-box" }}>
                  <option value="">Choisir un service…</option>
                  {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.silver, marginBottom: 8 }}>Budget estimé</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {BUDGETS.map(b => (
                    <button type="button" key={b} onClick={() => setForm({ ...form, budget: b })}
                      style={{
                        padding: "7px 14px", borderRadius: 50, fontSize: "clamp(0.68rem,1.8vw,0.75rem)", fontWeight: 600, cursor: "pointer",
                        background: form.budget === b ? "rgba(212,175,55,0.2)" : "transparent",
                        border: form.budget === b ? "1px solid rgba(212,175,55,0.5)" : "1px solid rgba(255,255,255,0.12)",
                        color: form.budget === b ? C.gold : C.silver,
                      }}>{b}</button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.silver, marginBottom: 4 }}>Message *</label>
                <textarea required rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Décrivez votre projet, vos besoins, vos questions..."
                  style={{ width: "100%", padding: "10px 13px", background: "rgba(5,11,22,0.7)", border: "1px solid rgba(212,175,55,0.20)",
                    borderRadius: 9, color: C.white, fontSize: "clamp(0.80rem,2.5vw,0.83rem)", resize: "vertical", outline: "none", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = C.gold}
                  onBlur={e => e.target.style.borderColor = "rgba(212,175,55,0.20)"} />
              </div>

              <button type="submit" disabled={sending}
                style={{ padding: "14px", background: sending ? "rgba(212,175,55,0.3)" : "linear-gradient(135deg,#D4AF37,#B8941E)",
                  color: "#050B16", fontWeight: 800, fontSize: "clamp(0.78rem,2vw,0.85rem)", borderRadius: 50, border: "none",
                  cursor: sending ? "wait" : "pointer", boxShadow: sending ? "none" : "0 6px 24px rgba(212,175,55,0.35)" }}>
                {sending ? "Envoi en cours…" : "Envoyer le message →"}
              </button>
              <p style={{ fontSize: "0.65rem", color: C.muted, textAlign: "center", margin: 0 }}>
                Aucun spam. Je réponds en moins de 24h.
              </p>
            </form>
          )}
        </motion.div>
      </section>

      {/* ══ MENTIONS LÉGALES ══ */}
      <section id="mentions" style={{ background: "#02060C", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "48px 5% 24px" }}>
        <motion.div {...fadeUp} style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: C.gold, marginBottom: 16 }}>Mentions légales & RGPD</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))", gap: 20 }}>
            <div style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: "18px 20px" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 800, color: C.gold, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Éditeur</p>
              <p style={{ fontSize: "0.72rem", color: C.silver, lineHeight: 1.7, margin: 0 }}>
                <strong style={{ color: C.white }}>JY-Trix.AI</strong><br />
                Raison sociale : JS-Innov.IA® — Julien Pagin<br />
                Saint-Ghislain, Hainaut, Belgique<br />
                Email : <a href="mailto:contact@jytrixai.com" style={{ color: C.gold }}>contact@jytrixai.com</a>
              </p>
            </div>
            <div style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: "18px 20px" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 800, color: C.gold, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Données personnelles (RGPD)</p>
              <p style={{ fontSize: "0.72rem", color: C.silver, lineHeight: 1.7, margin: 0 }}>
                Les données collectées via le formulaire sont utilisées <strong style={{ color: C.white }}>uniquement</strong> pour répondre à votre demande. Elles ne sont ni revendues ni transmises à des tiers.<br /><br />
                Droit d'accès, rectification, suppression : <a href="mailto:contact@jytrixai.com" style={{ color: C.gold }}>contact@jytrixai.com</a>
              </p>
            </div>
            <div style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: "18px 20px" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 800, color: C.gold, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Cookies</p>
              <p style={{ fontSize: "0.72rem", color: C.silver, lineHeight: 1.7, margin: 0 }}>
                Ce site n'utilise aucun cookie tiers ni tracker publicitaire.<br /><br />
                Propriété intellectuelle : Tout contenu est la propriété de JY-Trix.AI / JS-Innov.IA®. Reproduction interdite sans accord écrit.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background: "#02060C", padding: "32px 5% 24px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20, alignItems: "center", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ width: 48, height: 48, background: "linear-gradient(135deg,#D4AF37,#8B6914)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "1rem", color: "#050B16" }}>JY</div>
              <span style={{ fontWeight: 800, fontSize: "0.82rem" }}>JY-Trix.AI</span>
            </div>
            <span style={{ fontSize: "0.72rem", color: C.muted, fontWeight: 600 }}>PAR</span>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ width: 48, height: 48, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.72rem", color: C.white }}>JS-I</div>
              <span style={{ fontWeight: 800, fontSize: "0.82rem" }}>JS-Innov.IA</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "clamp(16px,4vw,32px)", flexWrap: "wrap", justifyContent: "center" }}>
            <a href="#services" style={{ fontSize: "0.72rem", color: C.silver, textDecoration: "none" }}>Services</a>
            <a href="#realisations" style={{ fontSize: "0.72rem", color: C.silver, textDecoration: "none" }}>Réalisations</a>
            <a href="#contact" style={{ fontSize: "0.72rem", color: C.silver, textDecoration: "none" }}>Audit gratuit</a>
            <a href="#mentions" style={{ fontSize: "0.72rem", color: C.silver, textDecoration: "none" }}>Mentions légales</a>
            <a href="https://www.jsinnovia.com" style={{ fontSize: "0.72rem", color: C.silver, textDecoration: "none" }}>← jsinnovia.com</a>
          </div>
          <p style={{ fontSize: "0.65rem", color: C.muted, margin: 0 }}>© 2026 JY-Trix.AI. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
