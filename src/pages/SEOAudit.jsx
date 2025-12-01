import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, AlertCircle, XCircle, TrendingUp, Loader2, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import SectionHeader from '../components/shared/SectionHeader';
import PowerWord from '../components/shared/PowerWord';
import SEOHero from '../components/seo/SEOHero';
import SEOPricingCards from '../components/seo/SEOPricingCards';

export default function SEOAudit() {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [competitors, setCompetitors] = useState(['', '', '']);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const auditFormRef = useRef(null);

  const scrollToAudit = () => {
    auditFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
      const competitorUrls = competitors.filter(c => c.trim()).map(c => c.trim());
      const response = await base44.functions.invoke('analyzeSEO', { 
        url: url.trim(),
        email: email.trim(),
        competitors: competitorUrls
      });
      
      // Validation robuste de la réponse
      let reportData = null;
      
      if (response && response.data) {
        if (typeof response.data === 'string') {
          try {
            reportData = JSON.parse(response.data);
          } catch {
            reportData = null;
          }
        } else if (typeof response.data === 'object') {
          reportData = response.data;
        }
      }
      
      if (reportData && typeof reportData.global_score === 'number') {
        setReport(reportData);
        setEmailSent(true);
      } else {
        setError('Réponse invalide du serveur. Veuillez réessayer.');
      }
    } catch (err) {
      console.error('Error analyzing:', err);
      setError(err.message || 'Impossible d\'analyser ce site. Vérifiez l\'URL et réessayez.');
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
          title="Audit SEO & Référencement"
          subtitle={
            <span>
              De l'audit <PowerWord>gratuit</PowerWord> à l'accompagnement <PowerWord>complet</PowerWord>, boostez votre visibilité en ligne
            </span>
          }
        />

        {/* Hero Visuel */}
        <SEOHero />

        {/* Section Pricing */}
        <SEOPricingCards onSelectPlan={scrollToAudit} />

        {/* Formulaire Audit Gratuit */}
        <div ref={auditFormRef} className="pt-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            🎁 Commencez par l'<span className="gradient-text">Audit Gratuit</span>
          </h2>
        </div>
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
                placeholder="votre@email.com"
                className="w-full bg-black/30 border-gray-700 text-white text-lg py-6"
                disabled={isAnalyzing}
              />
              
              <div className="pt-4 border-t border-gray-700">
                <h4 className="text-sm font-medium text-gray-300 mb-3">🔍 Analyse Comparative (optionnel)</h4>
                <p className="text-xs text-gray-500 mb-3">Ajoutez jusqu'à 3 sites concurrents pour une analyse comparative</p>
                {competitors.map((comp, index) => (
                  <Input
                    key={index}
                    type="url"
                    value={comp}
                    onChange={(e) => {
                      const newCompetitors = [...competitors];
                      newCompetitors[index] = e.target.value;
                      setCompetitors(newCompetitors);
                    }}
                    placeholder={`Concurrent ${index + 1}: https://...`}
                    className="w-full bg-black/30 border-gray-700 text-white py-3 mb-2"
                    disabled={isAnalyzing}
                  />
                ))}
              </div>
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

              {/* Analyse Comparative */}
              {report.comparison && report.comparison.length > 0 && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-xl font-bold text-white">Analyse Comparative</h3>
                  </div>
                  <div className="space-y-6">
                    {/* Tableau comparatif */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left py-3 px-4 text-gray-400">Site</th>
                            <th className="text-center py-3 px-4 text-gray-400">Score Global</th>
                            <th className="text-center py-3 px-4 text-gray-400">Technique</th>
                            <th className="text-center py-3 px-4 text-gray-400">Contenu</th>
                            <th className="text-center py-3 px-4 text-gray-400">Performance</th>
                            <th className="text-center py-3 px-4 text-gray-400">Accessibilité</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-700 bg-pink-500/10">
                            <td className="py-3 px-4 font-semibold text-pink-400">Votre site</td>
                            <td className={`text-center py-3 px-4 font-bold ${getScoreColor(report.global_score)}`}>
                              {report.global_score}
                            </td>
                            <td className={`text-center py-3 px-4 ${getScoreColor(report.scores.technique)}`}>
                              {report.scores.technique}
                            </td>
                            <td className={`text-center py-3 px-4 ${getScoreColor(report.scores.contenu)}`}>
                              {report.scores.contenu}
                            </td>
                            <td className={`text-center py-3 px-4 ${getScoreColor(report.scores.performance)}`}>
                              {report.scores.performance}
                            </td>
                            <td className={`text-center py-3 px-4 ${getScoreColor(report.scores.accessibilite)}`}>
                              {report.scores.accessibilite}
                            </td>
                          </tr>
                          {report.comparison.map((comp, idx) => (
                            <tr key={idx} className="border-b border-gray-700 hover:bg-white/5">
                              <td className="py-3 px-4 text-gray-400">{comp.url}</td>
                              <td className={`text-center py-3 px-4 font-bold ${getScoreColor(comp.global_score)}`}>
                                {comp.global_score}
                              </td>
                              <td className={`text-center py-3 px-4 ${getScoreColor(comp.scores.technique)}`}>
                                {comp.scores.technique}
                              </td>
                              <td className={`text-center py-3 px-4 ${getScoreColor(comp.scores.contenu)}`}>
                                {comp.scores.contenu}
                              </td>
                              <td className={`text-center py-3 px-4 ${getScoreColor(comp.scores.performance)}`}>
                                {comp.scores.performance}
                              </td>
                              <td className={`text-center py-3 px-4 ${getScoreColor(comp.scores.accessibilite)}`}>
                                {comp.scores.accessibilite}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Insights comparatifs */}
                    {report.competitive_insights && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-white">📊 Insights Comparatifs</h4>
                        {report.competitive_insights.map((insight, idx) => (
                          <div key={idx} className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                            <div className="flex items-start gap-3">
                              <div className="text-cyan-400 font-semibold">{insight.category}</div>
                            </div>
                            <p className="text-gray-300 text-sm mt-2">{insight.insight}</p>
                            {insight.recommendation && (
                              <p className="text-cyan-400 text-sm mt-2">💡 {insight.recommendation}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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