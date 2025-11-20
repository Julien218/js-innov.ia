import React from 'react';
import { useCart } from '../components/cart/CartContext';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeader from '../components/shared/SectionHeader';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            icon={ShoppingCart}
            title="Votre Panier"
            subtitle="Gérez vos achats musicaux"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-flex p-8 rounded-full bg-gradient-to-br from-pink-600/20 to-purple-600/20 border border-pink-500/30 mb-8">
              <ShoppingCart className="w-16 h-16 text-pink-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Votre panier est vide</h3>
            <p className="text-gray-400 mb-8">Découvrez notre collection de musiques pour commerces</p>
            <Link to={createPageUrl('MusicShop')}>
              <Button className="bg-gradient-to-r from-pink-600 to-purple-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voir les produits
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          icon={ShoppingCart}
          title="Votre Panier"
          subtitle={`${getCartCount()} article${getCartCount() > 1 ? 's' : ''} dans votre panier`}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-2xl p-6"
              >
                <div className="flex gap-6">
                  {/* Image */}
                  <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-pink-600/20 to-purple-600/20 flex items-center justify-center overflow-hidden">
                    {item.cover_image ? (
                      <img src={item.cover_image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl">🎵</span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">{item.license_type}</p>
                    
                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <Minus className="w-4 h-4 text-gray-400" />
                        </button>
                        <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>

                      {/* Price & Remove */}
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">{(item.price * item.quantity).toFixed(2)}€</div>
                          {item.quantity > 1 && (
                            <div className="text-xs text-gray-500">{item.price}€ × {item.quantity}</div>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-2xl p-6 sticky top-24"
            >
              <h3 className="text-xl font-bold text-white mb-6">Récapitulatif</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Sous-total</span>
                  <span className="text-white font-medium">{getCartTotal().toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>TVA (21%)</span>
                  <span className="text-white font-medium">{(getCartTotal() * 0.21).toFixed(2)}€</span>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-pink-400">{(getCartTotal() * 1.21).toFixed(2)}€</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link to={createPageUrl('Checkout')} className="block">
                  <Button className="w-full py-6 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
                    Passer la commande
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to={createPageUrl('MusicShop')} className="block">
                  <Button variant="outline" className="w-full border-gray-700">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Continuer mes achats
                  </Button>
                </Link>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💰</div>
                  <div>
                    <div className="text-sm font-medium text-green-400 mb-1">Économie SABAM</div>
                    <div className="text-xs text-gray-400">
                      Vous économisez les frais de droits d'auteur annuels en utilisant nos musiques libres de droits.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}