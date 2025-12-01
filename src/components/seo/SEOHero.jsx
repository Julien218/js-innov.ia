import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Search, Globe, 
  Zap, Shield, Users, Target 
} from 'lucide-react';

export default function SEOHero() {
  return (
    <div className="relative overflow-hidden py-12 mb-8">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-cyan-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjA1Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Central Dashboard */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-2xl"
        >
          {/* Main Dashboard Card */}
          <div className="relative p-6 rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-cyan-500/30 backdrop-blur-xl shadow-2xl shadow-cyan-500/20">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/20">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">SEO Dashboard</h3>
                  <p className="text-xs text-gray-400">Analyse en temps réel</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400">Live</span>
              </div>
            </div>

            {/* Score Circle */}
            <div className="flex justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="url(#heroGradient)"
                    strokeWidth="8"
                    strokeDasharray="280 352"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">78</span>
                  <span className="text-xs text-gray-400">/100</span>
                </div>
              </div>
            </div>

            {/* Mini Stats */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Technique', value: '85%', color: 'text-green-400' },
                { label: 'Contenu', value: '72%', color: 'text-yellow-400' },
                { label: 'Perf.', value: '68%', color: 'text-orange-400' },
                { label: 'Access.', value: '91%', color: 'text-cyan-400' },
              ].map((stat, i) => (
                <div key={i} className="text-center p-2 rounded-lg bg-white/5">
                  <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Progress Bars */}
            <div className="space-y-3">
              {[
                { label: 'Mots-clés positionnés', value: 65, color: 'bg-cyan-500' },
                { label: 'Backlinks qualité', value: 45, color: 'bg-purple-500' },
                { label: 'Vitesse mobile', value: 82, color: 'bg-green-500' },
              ].map((bar, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{bar.label}</span>
                    <span className="text-white">{bar.value}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${bar.value}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                      className={`h-full rounded-full ${bar.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Plan Cards */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute -left-4 md:-left-20 top-1/4 p-3 rounded-xl bg-gray-800/90 border border-gray-600/50 backdrop-blur-sm shadow-lg"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gray-600/50 flex items-center justify-center">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-300">Gratuit</div>
                <div className="text-xs text-gray-500">Audit rapide</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute -right-4 md:-right-20 top-1/4 p-3 rounded-xl bg-blue-900/90 border border-blue-500/50 backdrop-blur-sm shadow-lg shadow-blue-500/20"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/30 flex items-center justify-center">
                <Zap className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <div className="text-xs font-medium text-blue-300">Basic</div>
                <div className="text-xs text-blue-400/70">49€</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -left-4 md:-left-16 bottom-1/4 p-3 rounded-xl bg-purple-900/90 border border-purple-500/50 backdrop-blur-sm shadow-lg shadow-purple-500/20"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/30 flex items-center justify-center">
                <Target className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <div className="text-xs font-medium text-purple-300">Standard</div>
                <div className="text-xs text-purple-400/70">149€/mois</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute -right-4 md:-right-16 bottom-1/4 p-3 rounded-xl bg-amber-900/90 border border-amber-500/50 backdrop-blur-sm shadow-lg shadow-amber-500/20"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/30 flex items-center justify-center">
                <Shield className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="text-xs font-medium text-amber-300">Pro</div>
                <div className="text-xs text-amber-400/70">349€/mois</div>
              </div>
            </div>
          </motion.div>

          {/* Competitor Windows */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2"
          >
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-16 h-10 rounded-lg bg-cyan-900/50 border border-cyan-500/30 flex items-center justify-center">
                <Users className="w-4 h-4 text-cyan-400/50" />
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-cyan-400"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    </div>
  );
}