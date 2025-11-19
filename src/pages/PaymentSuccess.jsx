import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Download, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';

export default function PaymentSuccess() {
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      fetchPaymentStatus(sessionId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchPaymentStatus = async (sessionId) => {
    try {
      const response = await base44.functions.invoke('getPaymentStatus', { sessionId });
      setPaymentInfo(response.data);
    } catch (error) {
      console.error('Error fetching payment status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Vérification du paiement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Success Icon */}
          <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 mb-8">
            <CheckCircle className="w-20 h-20 text-green-400" />
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Paiement réussi !
          </h1>

          <p className="text-xl text-gray-400 mb-8">
            Merci pour votre achat. Votre commande a été confirmée.
          </p>

          {/* Payment Details */}
          {paymentInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-green-500/20 rounded-2xl p-8 mb-8 text-left"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Détails de la commande</h2>
              
              <div className="space-y-3">
                {paymentInfo.metadata?.product_type && (
                  <div className="flex justify-between py-2 border-b border-gray-800">
                    <span className="text-gray-400">Type</span>
                    <span className="text-white font-medium capitalize">
                      {paymentInfo.metadata.product_type}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Email</span>
                  <span className="text-white">{paymentInfo.customerEmail}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Montant</span>
                  <span className="text-white font-bold text-xl">
                    {paymentInfo.amountTotal}€
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-gray-400">Statut</span>
                  <span className="px-3 py-1 rounded-full bg-green-600/20 text-green-400 border border-green-500/30 text-sm">
                    Payé
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-2xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Prochaines étapes</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-400 text-sm">
                  Un email de confirmation a été envoyé à votre adresse avec tous les détails
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Download className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-400 text-sm">
                  Vous recevrez vos fichiers et accès dans les prochaines 24 heures
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('Home')}>
              <Button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-xl hover:shadow-pink-500/50">
                Retour à l'accueil
                <ArrowRight className="w-4 h-4 ml-2" />
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