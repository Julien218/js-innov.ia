import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, AlertCircle, XCircle, TrendingUp, Loader2, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import SectionHeader from '../components/shared/SectionHeader';
import PowerWord from '../components/shared/PowerWord';

export default function SEOAudit() {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  const analyzeWebsite = async () => {
    if (!url.trim() || !email.trim()) {
      setError('Veuillez remplir l\'URL et votre email');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setReport(null);
    setEmailSent(false);

    try {
      const response = await base44.functions.invoke('analyzeSEO', { 
        url: url.trim(),
        email: email.trim()
      });
      setReport(response.data);
      setEmailSent(true);
    } catch (err) {
      setError('Impossible d\'analyser ce site. Vérifiez l\'URL et réessayez.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return 'from-green-600 to-emerald-600';
    if (score >= 50) return 'from-yellow-600 to-orange-600';
    return 'from-red-600 to-pink-600';
  };

  const downloadReport = () => {
    const reportText = JSON.stringify(report, null, 2);
    const blob = new Blob([reportText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-audit-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          icon={Search}
          title="Audit SEO Gratuit"
          subtitle={
            <span>
              Analysez votre site et obtenez des <PowerWord>recommandations</PowerWord> pour <PowerWord>améliorer</PowerWord> votre référencement
            </span>
          }
        />

        {/* Formulaire */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20">
            <div className="space-y-4">
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://votre-site-web.com"
                className="w-full bg-black/30 border-gray-700 text-white text-lg py-6"
                disabled={isAnalyzing}
              />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && analyzeWebsite()}
                placeholder="votre@email.com"
                className="w-full bg-black/30 border-gray-700 text-white text-lg py-6"
                disabled={isAnalyzing}
              />
              <Button
                onClick={analyzeWebsite}
                disabled={isAnalyzing || !url.trim() || !email.trim()}
                className="w-full py-6 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:shadow-2xl hover:shadow-pink-500/50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Analyser et recevoir le rapport
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              📧 Vous recevrez le rapport complet par email + recommandations personnalisées
            </p>
          </div>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {emailSent && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-3xl mx-auto mb-8 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>✅ Rapport envoyé à {email} ! Consultez votre boîte email.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-3xl mx-auto mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rapport */}
        <AnimatePresence>
          {report && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Score Global */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 text-center">
                <h3 className="text-xl text-gray-300 mb-4">Score SEO Global</h3>
                <div className="relative inline-block">
                  <svg className="w-48 h-48">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="12"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      strokeDasharray={`${(report.global_score / 100) * 502.4} 502.4`}
                      strokeLinecap="round"
                      transform="rotate(-90 96 96)"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ff006e" />
                        <stop offset="100%" stopColor="#8338ec" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className={`text-5xl font-bold ${getScoreColor(report.global_score)}`}>
                      {report.global_score}
                    </div>
                    <div className="text-sm text-gray-400">/ 100</div>
                  </div>
                </div>
                <div className="flex justify-center gap-4 mt-6">
                  <Button onClick={downloadReport} variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Télécharger
                  </Button>
                  <Button
                    onClick={() => {
                      const shareUrl = `${window.location.href}?url=${encodeURIComponent(url)}`;
                      navigator.clipboard.writeText(shareUrl);
                      alert('Lien copié !');
                    }}
                    variant="outline"
                    className="gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Partager
                  </Button>
                </div>
              </div>

              {/* Catégories de Score */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {Object.entries(report.scores || {}).map(([category, score]) => (
                  <div
                    key={category}
                    className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20"
                  >
                    <div className={`text-3xl font-bold mb-2 ${getScoreColor(score)}`}>
                      {score}%
                    </div>
                    <div className="text-sm text-gray-300 capitalize">
                      {category.replace('_', ' ')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Points Positifs */}
              {report.strengths && report.strengths.length > 0 && (
                <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <h3 className="text-xl font-bold text-white">Points Forts</h3>
                  </div>
                  <ul className="space-y-2">
                    {report.strengths.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Problèmes Critiques */}
              {report.critical_issues && report.critical_issues.length > 0 && (
                <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <XCircle className="w-6 h-6 text-red-400" />
                    <h3 className="text-xl font-bold text-white">Problèmes Critiques</h3>
                  </div>
                  <ul className="space-y-2">
                    {report.critical_issues.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300">
                        <XCircle className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommandations */}
              {report.recommendations && report.recommendations.length > 0 && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                    <h3 className="text-xl font-bold text-white">Recommandations d'Amélioration</h3>
                  </div>
                  <div className="space-y-4">
                    {report.recommendations.map((rec, index) => (
                      <div key={index} className="p-4 rounded-xl bg-black/30">
                        <div className="flex items-start gap-3">
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            rec.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {rec.priority === 'high' ? 'Priorité haute' :
                             rec.priority === 'medium' ? 'Priorité moyenne' : 'Priorité basse'}
                          </div>
                        </div>
                        <h4 className="text-white font-semibold mt-2 mb-1">{rec.title}</h4>
                        <p className="text-gray-400 text-sm">{rec.description}</p>
                        {rec.impact && (
                          <div className="mt-2 text-xs text-gray-500">
                            💡 Impact: {rec.impact}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-pink-600/20 via-purple-600/20 to-cyan-600/20 border border-purple-500/30 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Besoin d'aide pour optimiser votre SEO ?
                </h3>
                <p className="text-gray-300 mb-6">
                  Nos experts peuvent implémenter ces recommandations et <PowerWord>booster</PowerWord> votre référencement
                </p>
                <Button className="px-8 py-6 rounded-xl bg-white text-gray-900 hover:bg-gray-100 font-semibold">
                  Demander un devis personnalisé
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}