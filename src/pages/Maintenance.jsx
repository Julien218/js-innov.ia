import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Wrench, Mail, Phone, Instagram, Facebook, Zap } from 'lucide-react';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';

function NeuralBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const nodes = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.5 + 0.5,
      color: [GOLD, PURPLE, CYAN][Math.floor(Math.random() * 3)],
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach((n, i) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
        nodes.slice(i + 1).forEach(m => {
          const d = Math.hypot(n.x - m.x, n.y - m.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(212,175,55,${0.07 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
          }
        });
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.color + '44';
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.6 }} />;
}

function Countdown() {
  const target = new Date();
  target.setDate(target.getDate() + 7);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = target - new Date();
      if (diff <= 0) return;
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex gap-4 justify-center">
      {[
        { val: timeLeft.d, label: 'Jours' },
        { val: timeLeft.h, label: 'Heures' },
        { val: timeLeft.m, label: 'Min' },
        { val: timeLeft.s, label: 'Sec' },
      ].map(({ val, label }) => (
        <div key={label} className="flex flex-col items-center">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-black"
            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: GOLD }}>
            {String(val).padStart(2, '0')}
          </div>
          <span className="text-xs mt-1.5 tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Maintenance() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleNotify = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: '#060610' }}>
      <NeuralBackground />

      {/* Ambient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.12, 0.2, 0.12] }} transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 -left-40 w-[600px] h-[600px] rounded-full blur-[140px]"
          style={{ background: `radial-gradient(circle, ${PURPLE}30, transparent 70%)` }} />
        <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.1, 0.17, 0.1] }} transition={{ duration: 10, repeat: Infinity, delay: 3 }}
          className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: `radial-gradient(circle, ${GOLD}25, transparent 70%)` }} />
      </div>

      {/* Top line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${PURPLE}, ${CYAN}, transparent)` }} />

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10">
          <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68ae1c019dacc474a322f2b2/f9316a8c1_Js-innovIA.png"
            alt="JS-INNOV.IA" className="w-24 h-24 object-contain mx-auto rounded-2xl" />
        </motion.div>

        {/* Badge */}
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-bold tracking-widest uppercase"
          style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.3)`, color: GOLD }}>
          <Wrench className="w-3.5 h-3.5" />
          Site en maintenance
        </motion.div>

        {/* Title */}
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl md:text-6xl font-black mb-4 leading-tight">
          <span className="text-white">Nous revenons</span><br />
          <span style={{
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L}, ${PURPLE})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>très bientôt ✨</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          className="text-lg mb-12 leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Notre site est en cours de mise à jour pour vous offrir une expérience encore meilleure.<br />
          <span style={{ color: 'rgba(212,175,55,0.7)' }}>Merci pour votre patience !</span>
        </motion.p>

        {/* Countdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mb-14">
          <Countdown />
        </motion.div>

        {/* Notify form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="mb-12">
          {!sent ? (
            <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" required
                placeholder="Votre email pour être notifié"
                className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.2)', color: 'white' }} />
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} type="submit"
                className="px-6 py-3 rounded-xl text-sm font-black text-black"
                style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 25px rgba(212,175,55,0.3)` }}>
                <Zap className="w-4 h-4 inline mr-1" />
                Me notifier
              </motion.button>
            </form>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
              style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80' }}>
              ✓ Parfait ! On vous prévient dès le lancement.
            </motion.div>
          )}
        </motion.div>

        {/* Contact info */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
          className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
          <a href="mailto:contact@js-innov.ia" className="flex items-center gap-2 transition-colors"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => e.currentTarget.style.color = GOLD}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
            <Mail className="w-4 h-4" /> contact@js-innov.ia
          </a>
          <a href="tel:+32494119090" className="flex items-center gap-2 transition-colors"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => e.currentTarget.style.color = GOLD}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
            <Phone className="w-4 h-4" /> +32 494 11 90 90
          </a>
        </motion.div>

        {/* Social */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
          className="flex justify-center gap-4">
          {[
            { icon: Instagram, label: 'Instagram', href: '#' },
            { icon: Facebook, label: 'Facebook', href: '#' },
          ].map(({ icon: Icon, label, href }) => (
            <a key={label} href={href}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
              style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: 'rgba(212,175,55,0.6)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.15)'; e.currentTarget.style.color = GOLD; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.08)'; e.currentTarget.style.color = 'rgba(212,175,55,0.6)'; }}>
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </motion.div>

        {/* Admin access */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          className="mt-8">
          <Link to="/saas" className="text-xs underline transition-colors"
            style={{ color: 'rgba(212,175,55,0.3)' }}
            onMouseEnter={e => e.target.style.color = 'rgba(212,175,55,0.7)'}
            onMouseLeave={e => e.target.style.color = 'rgba(212,175,55,0.3)'}>
            Accéder à la plateforme →
          </Link>
        </motion.div>

        {/* Footer */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
          className="text-xs mt-4" style={{ color: 'rgba(255,255,255,0.2)' }}>
          © 2025 JS-INNOV.IA · Julien Pagin · Dour, Belgique
        </motion.p>
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${CYAN}, ${GOLD}, transparent)` }} />
    </div>
  );
}