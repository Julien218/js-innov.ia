import { useState } from 'react';
import { motion } from 'framer-motion';
import { Music2, Sparkles, Mic, Volume2, Store, Megaphone, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AIMusicRequestModal from '../components/music/AIMusicRequestModal';

export default function AIMusic() {
  const [showModal, setShowModal] = useState(false);

  const features = [
    {
      icon: Music2,
      title: 'Musique 100% IA',
      description: 'Compositions uniques générées par intelligence artificielle, adaptées à votre ambiance',
      gradient: 'from-pink-600 to-purple-600'
    },
    {
      icon: Mic,
      title: 'Avec ou Sans Paroles',
      description: 'Instrumentale pure ou avec chant personnalisé selon vos préférences',
      gradient: 'from-purple-600 to-indigo-600'
    },
    {
      icon: Store,
      title: 'Fini la SABAM',
      description: 'Musique libre de droits, économisez les frais de droits d\'auteur annuels',
      gradient: 'from-indigo-600 to-cyan-600'
    },
    {
      icon: Megaphone,
      title: 'Vos Pubs Intégrées',
      description: 'Incorporez vos annonces publicitaires directement dans la musique',
      gradient: 'from-cyan-600 to-teal-600'
    },
    {
      icon: TrendingUp,
      title: 'Promos & Infos',
      description: 'Communiquez vos promotions et informations générales de manière naturelle',
      gradient: 'from-teal-600 to-green-600'
    },
    {
      icon: Volume2,
      title: 'Diffusion Continue',
      description: 'Playlists personnalisées pour une diffusion toute la journée',
      gradient: 'from-green-600 to-emerald-600'
    }
  ];

  const benefits = [
    'Économie sur les frais SABAM (jusqu\'à 500€/an)',
    'Ambiance unique et personnalisée',
    'Communication directe avec vos clients',
    'Mise à jour facile de vos messages',
    'Musique adaptée à votre clientèle',
    'Support technique et accompagnement'
  ];

  const useCases = [
    { emoji: '👗', text: 'Boutiques de vêtements' },
    { emoji: '☕', text: 'Cafés & Restaurants' },
    { emoji: '💇', text: 'Salons de beauté' },
    { emoji: '🏪', text: 'Magasins alimentaires' },
    { emoji: '💪', text: 'Salles de sport' },
    { emoji: '🏥', text: 'Cabinets médicaux' },
    { emoji: '🏢', text: 'Bureaux & Espaces de travail' },
    { emoji: '🛍️', text: 'Centres commerciaux' }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-600/20 to-purple-600/20 border border-pink-500/30 text-pink-300 text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            Innovation IA
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text">Musique Par IA</span>
            <br />
            <span className="text-white">Pour Votre Commerce</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Fini la SABAM ! Créez votre ambiance musicale unique avec vos propres messages publicitaires, promotions et informations intégrés naturellement.
          </p>
          <Button
            onClick={() => setShowModal(true)}
            className="px-8 py-6 text-lg bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 hover:shadow-2xl hover:shadow-pink-500/50 transition-all"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Créer Ma Musique Personnalisée
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 hover:border-pink-500/50 p-6 hover:shadow-2xl hover:shadow-pink-500/20 transition-all"
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} bg-opacity-20 mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-pink-600/10 via-purple-600/10 to-cyan-600/10 border border-pink-500/30 rounded-3xl p-8 md:p-12 mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Pourquoi Choisir La Musique Par IA ?
            </h2>
            <p className="text-gray-400">
              Je suis ici pour faciliter chaque jour la vie de mes clients et partager mon savoir sur l'IA musicale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 bg-white/5 rounded-xl p-4"
              >
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-white">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Use Cases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Idéal Pour Tous Les Commerces
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-xl p-6 text-center hover:border-pink-500/50 transition-all"
              >
                <div className="text-4xl mb-3">{useCase.emoji}</div>
                <div className="text-sm text-gray-300">{useCase.text}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Comment Ça Marche ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Demande', desc: 'Remplissez le formulaire avec vos besoins' },
              { step: '2', title: 'Consultation', desc: 'Échange personnalisé pour affiner votre projet' },
              { step: '3', title: 'Création', desc: 'Notre IA génère votre musique unique' },
              { step: '4', title: 'Diffusion', desc: 'Recevez vos fichiers et diffusez immédiatement' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-pink-600 to-purple-600" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-pink-600/20 via-purple-600/20 to-cyan-600/20 border-2 border-pink-500/40 rounded-3xl p-12 text-center"
        >
          <Sparkles className="w-16 h-16 text-pink-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt À Révolutionner L'Ambiance De Votre Commerce ?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Laissez-moi vous accompagner dans la création de votre identité sonore unique. Consultation gratuite et devis personnalisé.
          </p>
          <Button
            onClick={() => setShowModal(true)}
            className="px-10 py-6 text-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:shadow-2xl hover:shadow-pink-500/50 transition-all"
          >
            <Music2 className="w-5 h-5 mr-2" />
            Démarrer Mon Projet Musical
          </Button>
        </motion.div>
      </div>

      {/* Request Modal */}
      <AIMusicRequestModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}