import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AIChatbot from './components/chatbot/AIChatbot';

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // SEO Meta Tags
  useEffect(() => {
    const pageTitles = {
      'Home': 'JS-INNOV.IA - Intelligence Artificielle & Automatisations | Solutions IA Sur Mesure',
      'Innovations': 'Innovations IA | JS-INNOV.IA - Découvrez le Futur de l\'Intelligence Artificielle',
      'Templates': 'Templates Vidéo IA | JS-INNOV.IA - Créations Professionnelles Générées par IA',
      'Automations': 'Automatisations Intelligentes | JS-INNOV.IA - Solutions Clé en Main',
      'Applications': 'Applications IA Sur Mesure | JS-INNOV.IA - Développement Innovant',
      'Contact': 'Contactez-nous | JS-INNOV.IA - Transformez Votre Vision en Réalité'
    };

    const pageDescriptions = {
      'Home': 'JS-INNOV.IA propose des solutions d\'intelligence artificielle innovantes : templates vidéo, automatisations, applications sur mesure. Transformez votre entreprise avec l\'IA.',
      'Innovations': 'Explorez nos dernières innovations en intelligence artificielle. Découvrez comment l\'IA révolutionne le business et la créativité.',
      'Templates': 'Bibliothèque de templates vidéo professionnels générés par IA. Marketing, réseaux sociaux, présentations et plus encore.',
      'Automations': 'Automatisations intelligentes clé en main pour optimiser votre productivité, marketing, e-commerce et service client.',
      'Applications': 'Créations d\'applications sur mesure propulsées par l\'IA. Assistants intelligents, analyse de données, génération de contenu.',
      'Contact': 'Contactez JS-INNOV.IA pour discuter de votre projet IA. Devis gratuit et consultation personnalisée.'
    };

    document.title = pageTitles[currentPageName] || 'JS-INNOV.IA';
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = pageDescriptions[currentPageName] || 'JS-INNOV.IA - Intelligence Artificielle et Automatisations';

    // Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = 'intelligence artificielle, IA, automatisation, templates vidéo, applications IA, innovation, machine learning, créations IA, solutions IA, France';

    // Open Graph
    const ogTags = [
      { property: 'og:title', content: pageTitles[currentPageName] || 'JS-INNOV.IA' },
      { property: 'og:description', content: pageDescriptions[currentPageName] || 'JS-INNOV.IA - Intelligence Artificielle et Automatisations' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68ae1c019dacc474a322f2b2/f9316a8c1_Js-innovIA.png' }
    ];

    ogTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', tag.property);
        document.head.appendChild(metaTag);
      }
      metaTag.content = tag.content;
    });
  }, [currentPageName]);

  const navItems = [
    { name: 'Accueil', path: 'Home' },
    { name: 'Innovations', path: 'Innovations' },
    { name: 'Templates', path: 'Templates' },
    { name: 'Automatisations', path: 'Automations' },
    { name: 'Applications', path: 'Applications' },
    { name: 'Contact', path: 'Contact' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <style>{`
        :root {
          --neon-pink: #ff006e;
          --neon-purple: #8338ec;
          --neon-cyan: #06ffa5;
          --neon-gold: #ffb703;
        }
        
        .glow-text {
          text-shadow: 0 0 20px rgba(255, 0, 110, 0.5);
        }
        
        .glow-box {
          box-shadow: 0 0 30px rgba(131, 56, 236, 0.3);
        }
        
        .gradient-border {
          background: linear-gradient(135deg, var(--neon-pink), var(--neon-purple), var(--neon-cyan));
          padding: 2px;
          border-radius: 12px;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, var(--neon-pink), var(--neon-purple), var(--neon-cyan), var(--neon-gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-purple-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="group">
              <div className="relative w-24 h-24">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68ae1c019dacc474a322f2b2/f9316a8c1_Js-innovIA.png"
                  alt="JS-INNOV.IA - Intelligence Artificielle et Automatisations"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 via-purple-600 to-cyan-500 blur-xl opacity-30 group-hover:opacity-50 transition-opacity -z-10"></div>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={createPageUrl(item.path)}
                  className={`text-sm font-medium transition-all hover:text-pink-400 ${
                    currentPageName === item.path
                      ? 'text-pink-400 glow-text'
                      : 'text-gray-300'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-purple-900/30"
            >
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={createPageUrl(item.path)}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      currentPageName === item.path
                        ? 'bg-gradient-to-r from-pink-600/20 to-purple-600/20 text-pink-400'
                        : 'text-gray-300 hover:bg-purple-900/20'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-xl border-t border-purple-900/30 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="font-bold text-lg gradient-text mb-3">JS-INNOV.IA</div>
              <p className="text-gray-400 text-sm">
                Créations artistiques et automatisations intelligentes avec l'IA.
                Innovons ensemble pour un futur digital.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Navigation</h3>
              <div className="space-y-2">
                {navItems.slice(1).map((item) => (
                  <Link
                    key={item.path}
                    to={createPageUrl(item.path)}
                    className="block text-gray-400 text-sm hover:text-pink-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Suivez-nous</h3>
              <p className="text-gray-400 text-sm mb-4">
                Restez connecté pour découvrir nos dernières innovations IA.
              </p>
              <Link
                to={createPageUrl('Contact')}
                className="inline-block px-6 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-pink-500/50 transition-all"
              >
                Nous contacter
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>© 2024 JS-INNOV.IA - Tous droits réservés</p>
          </div>
        </div>
      </footer>

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
}