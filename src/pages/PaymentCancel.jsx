import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from '@/components/ui/button';

export default function PaymentCancel() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Cancel Icon */}
          <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30 mb-8">
            <XCircle className="w-20 h-20 text-amber-400" />
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Paiement annulé
          </h1>

          <p className="text-xl text-gray-400 mb-8">
            Votre paiement a été annulé. Aucun montant n'a été débité.
          </p>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-amber-500/20 rounded-2xl p-8 mb-8 text-left"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Que s'est-il passé ?</h2>
            <p className="text-gray-400 mb-4">
              Vous avez annulé le processus de paiement ou celui-ci a été interrompu.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <p>• Aucun montant n'a été prélevé sur votre compte</p>
              <p>• Votre panier est toujours disponible</p>
              <p>• Vous pouvez réessayer à tout moment</p>
            </div>
          </motion.div>

          {/* Help Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center gap-3 mb-3">
              <MessageCircle className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Besoin d'aide ?</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Si vous rencontrez des difficultés ou avez des questions, notre équipe est là pour vous aider.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('Home')}>
              <Button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-xl hover:shadow-pink-500/50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Button>
            </Link>
            <Link to={createPageUrl('Contact')}>
              <Button variant="outline" className="border-gray-700 text-white hover:bg-white/5">
                Nous contacter
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}