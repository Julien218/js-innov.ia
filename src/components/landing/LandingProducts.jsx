import { motion } from 'framer-motion';
import { ArrowUpRight, MonitorPlay, ReceiptText } from 'lucide-react';

const products = [
  {
    name: 'HainoFlow',
    signature: 'HainoFlow — by JS‑Innov.IA',
    description: 'Centralisez devis, factures, relances et indicateurs dans une solution pensée pour les indépendants et PME belges.',
    url: 'https://hainoflow.jsinnovia.com',
    action: 'Découvrir HainoFlow',
    icon: ReceiptText,
    color: '#16D5FF',
  },
  {
    name: 'Signelya',
    signature: 'Signelya — by JS‑Innov.IA',
    description: 'Pilotez vos clients, écrans, médias, playlists et programmations depuis une application dédiée.',
    url: 'https://signelya.jsinnovia.com',
    action: 'Découvrir Signelya',
    icon: MonitorPlay,
    color: '#E7B14A',
    image: '/signelya-brand.png',
  },
];

export default function LandingProducts() {
  return (
    <section id="produits" className="relative px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">Applications produits</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white md:text-5xl">Des solutions JS‑Innov.IA prêtes à travailler</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/45">
            Chaque produit possède son espace dédié et peut évoluer avec les besoins de votre entreprise.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {products.map(({ icon: Icon, ...product }, index) => (
            <motion.a
              key={product.name}
              href={product.url}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-3xl border border-white/8 bg-white/[0.025] p-7 md:p-9"
            >
              <div className="absolute inset-x-0 top-0 h-px opacity-60" style={{ background: `linear-gradient(90deg, transparent, ${product.color}, transparent)` }} />
              <div className="flex items-start justify-between gap-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ color: product.color, background: `${product.color}12`, border: `1px solid ${product.color}28` }}>
                  <Icon className="h-7 w-7" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-white/30 transition group-hover:text-white" />
              </div>
              {product.image && (
                <div className="mt-6 overflow-hidden rounded-2xl border border-white/8 bg-black">
                  <img src={product.image} alt="Identité visuelle Signelya — Vos écrans prennent vie" className="aspect-[3/2] w-full object-contain" loading="lazy" />
                </div>
              )}
              <p className="mt-7 text-xs font-black uppercase tracking-[0.16em]" style={{ color: product.color }}>{product.signature}</p>
              <h3 className="mt-2 text-2xl font-black text-white">{product.name}</h3>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/48">{product.description}</p>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-black" style={{ color: product.color }}>
                {product.action} <ArrowUpRight className="h-4 w-4" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
