import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const demoScenarios = {
  'Marketing': {
    title: 'Génération de Campagne Email',
    inputs: [
      { label: 'Produit/Service', key: 'product', type: 'text', placeholder: 'Ex: Logiciel CRM' },
      { label: 'Public cible', key: 'audience', type: 'text', placeholder: 'Ex: Entrepreneurs' },
      { label: 'Ton souhaité', key: 'tone', type: 'select', options: ['Professionnel', 'Décontracté', 'Inspirant'] }
    ],
    outputExample: {
      subject: '🚀 Transformez votre gestion client dès aujourd\'hui',
      preview: 'Découvrez comment notre CRM intelligent...',
      body: 'Bonjour [Prénom],\n\nVous cherchez à optimiser votre relation client? Notre logiciel CRM intelligent automatise vos tâches répétitives...'
    }
  },
  'Productivité': {
    title: 'Organisation Automatique de Documents',
    inputs: [
      { label: 'Types de fichiers', key: 'fileTypes', type: 'text', placeholder: 'Ex: PDF, DOCX, images' },
      { label: 'Critères de tri', key: 'criteria', type: 'select', options: ['Date', 'Type', 'Projet', 'Priorité'] }
    ],
    outputExample: {
      folders: ['📁 Urgent - Q1 2024', '📁 Marketing', '📁 Ressources'],
      sorted: 24,
      saved: '2.5 heures par semaine'
    }
  },
  'E-commerce': {
    title: 'Optimisation de Prix Dynamique',
    inputs: [
      { label: 'Prix actuel (€)', key: 'currentPrice', type: 'number', placeholder: '49.99' },
      { label: 'Stock disponible', key: 'stock', type: 'number', placeholder: '150' },
      { label: 'Demande', key: 'demand', type: 'select', options: ['Faible', 'Moyenne', 'Forte'] }
    ],
    outputExample: {
      recommendedPrice: '54.99€',
      increase: '+10%',
      reason: 'Demande forte + Stock limité',
      projection: '+850€ de revenus supplémentaires'
    }
  },
  'Service Client': {
    title: 'Réponse Automatique Intelligente',
    inputs: [
      { label: 'Question client', key: 'question', type: 'textarea', placeholder: 'Ex: Comment retourner un produit?' }
    ],
    outputExample: {
      response: 'Bonjour ! 😊\n\nPour retourner votre produit, c\'est très simple:\n\n1. Connectez-vous à votre compte\n2. Allez dans "Mes commandes"\n3. Cliquez sur "Retour"\n\nVous avez 30 jours pour nous retourner le produit. Les frais de retour sont offerts !\n\nBesoin d\'aide? Notre équipe est là pour vous.',
      sentiment: 'Positif',
      priority: 'Normale',
      category: 'Retours'
    }
  },
  'Gestion de données': {
    title: 'Analyse et Nettoyage de Données',
    inputs: [
      { label: 'Nombre de lignes', key: 'rows', type: 'number', placeholder: '5000' },
      { label: 'Type d\'analyse', key: 'analysisType', type: 'select', options: ['Doublons', 'Données manquantes', 'Valeurs aberrantes'] }
    ],
    outputExample: {
      analyzed: '5,000 lignes',
      duplicates: '247 doublons trouvés',
      missing: '12% de données manquantes',
      cleaned: '4,753 lignes validées',
      quality: '94% de qualité'
    }
  }
};

export default function DemoModal({ automation, isOpen, onClose }) {
  const [formData, setFormData] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const scenario = demoScenarios[automation?.category] || demoScenarios['Marketing'];

  const handleRunDemo = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setShowResults(true);
    }, 2000);
  };

  const handleClose = () => {
    setFormData({});
    setShowResults(false);
    setIsRunning(false);
    onClose();
  };

  if (!isOpen || !automation) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gray-900 border border-cyan-500/30 shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 p-6 bg-gradient-to-r from-cyan-600 to-teal-600 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{scenario.title}</h2>
              <p className="text-cyan-100 text-sm">Démo interactive - {automation.name}</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Instructions */}
            <div className="p-4 rounded-xl bg-cyan-600/10 border border-cyan-500/30">
              <p className="text-sm text-cyan-300">
                💡 <strong>Mode Démo:</strong> Testez cette automatisation avec des données d'exemple.
                Les résultats sont simulés pour vous montrer le fonctionnement.
              </p>
            </div>

            {/* Input Form */}
            {!showResults && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Paramètres d'entrée</h3>
                {scenario.inputs.map((input, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {input.label}
                    </label>
                    {input.type === 'select' ? (
                      <select
                        value={formData[input.key] || ''}
                        onChange={(e) => setFormData({ ...formData, [input.key]: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-black/30 border border-gray-700 text-white focus:border-cyan-500 focus:outline-none"
                      >
                        <option value="">Sélectionner...</option>
                        {input.options.map((opt, i) => (
                          <option key={i} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : input.type === 'textarea' ? (
                      <Textarea
                        value={formData[input.key] || ''}
                        onChange={(e) => setFormData({ ...formData, [input.key]: e.target.value })}
                        placeholder={input.placeholder}
                        className="bg-black/30 border-gray-700 text-white placeholder:text-gray-500"
                        rows={4}
                      />
                    ) : (
                      <Input
                        type={input.type}
                        value={formData[input.key] || ''}
                        onChange={(e) => setFormData({ ...formData, [input.key]: e.target.value })}
                        placeholder={input.placeholder}
                        className="bg-black/30 border-gray-700 text-white placeholder:text-gray-500"
                      />
                    )}
                  </div>
                ))}

                <Button
                  onClick={handleRunDemo}
                  disabled={isRunning}
                  className="w-full py-6 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-semibold hover:shadow-xl hover:shadow-cyan-500/50 transition-all text-lg"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Lancer la démo
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Results */}
            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-full bg-green-600/20">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Résultats de la démo</h3>
                    <p className="text-gray-400 text-sm">Traitement terminé avec succès</p>
                  </div>
                </div>

                {/* Output Display */}
                <div className="space-y-4">
                  {Object.entries(scenario.outputExample).map(([key, value], index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-cyan-500/20"
                    >
                      <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-white font-medium">
                        {typeof value === 'string' && value.includes('\n') ? (
                          <pre className="whitespace-pre-wrap text-sm leading-relaxed">{value}</pre>
                        ) : (
                          <span className="text-lg">{value}</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={() => setShowResults(false)}
                    variant="outline"
                    className="flex-1 border-gray-700 text-white hover:bg-white/5"
                  >
                    Nouvelle démo
                  </Button>
                  <Button
                    onClick={handleClose}
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-teal-600 text-white hover:shadow-lg hover:shadow-cyan-500/50"
                  >
                    Commander cette automatisation
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}