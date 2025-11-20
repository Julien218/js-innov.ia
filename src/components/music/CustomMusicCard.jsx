import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CustomMusicRequestModal from './CustomMusicRequestModal';

export default function CustomMusicCard() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="group relative"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-600/20 via-purple-600/20 to-cyan-600/20 backdrop-blur-sm border-2 border-pink-500/40 hover:border-pink-400/60 hover:shadow-2xl hover:shadow-pink-500/30 hover:-translate-y-2 transition-all duration-300">
          
          {/* Sparkle Effect */}
          <div className="absolute top-4 right-4">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>

          {/* Avatar Section */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-pink-900/40 to-purple-900/40 flex items-center justify-center">
            <div className="relative">
              {/* Cute Avatar */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <div className="text-6xl">🎵</div>
              </div>
              {/* Chat Bubble */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg"
              >
                <MessageCircle className="w-6 h-6 text-pink-600" />
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-4">
              <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-300 text-xs font-semibold mb-3">
                ✨ Service Personnalisé
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 gradient-text">
                Création Sur Mesure
              </h3>
              
              <p className="text-gray-300 text-sm">
                Besoin d'une ambiance unique pour votre commerce ? Notre assistant virtuel vous aide à créer la bande sonore parfaite !
              </p>
            </div>

            {/* Features */}
            <div className="space-y-2 mb-6 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Composition 100% personnalisée</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Consultation gratuite en visio</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Devis adapté à votre budget</span>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              onClick={() => setShowModal(true)}
              className="w-full py-6 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 hover:from-pink-500 hover:via-purple-500 hover:to-cyan-500 text-white font-semibold shadow-lg hover:shadow-2xl transition-all"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Discuter avec notre assistant
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Request Modal */}
      <CustomMusicRequestModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
}