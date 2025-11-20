import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const savedOrder = localStorage.getItem('lastOrder');
    if (savedOrder) {
      setOrderData(JSON.parse(savedOrder));
    } else {
      navigate(createPageUrl('MusicShop'));
    }
  }, [navigate]);

  if (!orderData) return null;

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-12"
        >
          <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 mb-6">
            <CheckCircle className="w-16 h-16 text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Commande confirmée ! 🎉</h1>
          <p className="text-xl text-gray-400 mb-2">
            Merci {orderData.customer.name} pour votre achat
          </p>
          <p className="text-gray-500">
            Numéro de commande: <span className="text-pink-400 font-mono">{orderData.orderId}</span>
          </p>
        </motion.div>

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Détails de la commande</h2>

          <div className="space-y-6">
            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-700">
              <div>
                <div className="text-sm text-gray-500 mb-1">Informations client</div>
                <div className="text-white">{orderData.customer.name}</div>
                <div className="text-gray-400 text-sm">{orderData.customer.email}</div>
                {orderData.customer.phone && (
                  <div className="text-gray-400 text-sm">{orderData.customer.phone}</div>
                )}
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Adresse de facturation</div>
                <div className="text-gray-400 text-sm">{orderData.customer.address}</div>
              </div>
            </div>

            {/* Items */}
            <div>
              <div className="text-sm text-gray-500 mb-4">Produits commandés</div>
              <div className="space-y-3">
                {orderData.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-4 rounded-xl bg-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-600/20 to-purple-600/20 flex items-center justify-center">
                        <span className="text-2xl">🎵</span>
                      </div>
                      <div>
                        <div className="text-white font-medium">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.license_type} • Quantité: {item.quantity}</div>
                      </div>
                    </div>
                    <div className="text-white font-bold">{(item.price * item.quantity).toFixed(2)}€</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-6 border-t border-gray-700">
              <div className="flex justify-between text-2xl font-bold">
                <span className="text-white">Total payé</span>
                <span className="text-pink-400">{orderData.total}€</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          <div className="bg-gradient-to-br from-pink-600/10 to-purple-600/10 border border-pink-500/30 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-pink-600/20">
                <Mail className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Email de confirmation</h3>
                <p className="text-sm text-gray-400">
                  Un email de confirmation avec les détails de votre commande et les fichiers musicaux vous a été envoyé à <span className="text-pink-400">{orderData.customer.email}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 border border-green-500/30 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-green-600/20">
                <Download className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Téléchargement disponible</h3>
                <p className="text-sm text-gray-400 mb-3">
                  Vos fichiers musicaux en haute qualité sont prêts à être téléchargés immédiatement.
                </p>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger mes fichiers
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to={createPageUrl('MusicShop')}>
            <Button variant="outline" className="border-gray-700">
              Retour à la boutique
            </Button>
          </Link>
          <Link to={createPageUrl('Home')}>
            <Button className="bg-gradient-to-r from-pink-600 to-purple-600">
              Retour à l'accueil
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}