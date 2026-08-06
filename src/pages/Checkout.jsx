import { useState } from 'react';
import { useCart } from '../components/cart/CartContext';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { CreditCard, Lock, User, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SectionHeader from '../components/shared/SectionHeader';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Belgique',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  if (cartItems.length === 0) {
    navigate(createPageUrl('MusicShop'));
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Store order data
    const orderData = {
      orderId: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      items: cartItems,
      total: (getCartTotal() * 1.21).toFixed(2),
      customer: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.postalCode} ${formData.city}, ${formData.country}`
      }
    };

    localStorage.setItem('lastOrder', JSON.stringify(orderData));
    clearCart();
    navigate(createPageUrl('OrderConfirmation'));
  };

  const total = getCartTotal();
  const tax = total * 0.21;
  const finalTotal = total + tax;

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          icon={CreditCard}
          title="Finaliser la commande"
          subtitle="Paiement sécurisé"
        />

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-pink-600/20">
                  <User className="w-5 h-5 text-pink-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Informations personnelles</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Prénom *</label>
                  <Input
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="bg-white/5 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Nom *</label>
                  <Input
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="bg-white/5 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email *</label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-white/5 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Téléphone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-white/5 border-gray-700 text-white"
                  />
                </div>
              </div>
            </motion.div>

            {/* Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-purple-600/20">
                  <MapPin className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Adresse de facturation</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Adresse *</label>
                  <Input
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="bg-white/5 border-gray-700 text-white"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Code postal *</label>
                    <Input
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="bg-white/5 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Ville *</label>
                    <Input
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="bg-white/5 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Pays *</label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) => setFormData({ ...formData, country: value })}
                    >
                      <SelectTrigger className="bg-white/5 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Belgique">Belgique</SelectItem>
                        <SelectItem value="France">France</SelectItem>
                        <SelectItem value="Luxembourg">Luxembourg</SelectItem>
                        <SelectItem value="Suisse">Suisse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-green-600/20">
                  <CreditCard className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Paiement</h3>
                <div className="ml-auto flex items-center gap-2 text-xs text-gray-400">
                  <Lock className="w-4 h-4" />
                  Sécurisé
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Numéro de carte *</label>
                  <Input
                    required
                    placeholder="4242 4242 4242 4242"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                    className="bg-white/5 border-gray-700 text-white"
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Expiration *</label>
                    <Input
                      required
                      placeholder="MM/YY"
                      value={formData.cardExpiry}
                      onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                      className="bg-white/5 border-gray-700 text-white"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">CVC *</label>
                    <Input
                      required
                      placeholder="123"
                      value={formData.cardCvc}
                      onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                      className="bg-white/5 border-gray-700 text-white"
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <p className="text-xs text-gray-400 text-center">
                  💳 Mode simulation - Utilisez n'importe quel numéro de carte pour tester
                </p>
              </div>
            </motion.div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-2xl p-6 sticky top-24"
            >
              <h3 className="text-xl font-bold text-white mb-6">Récapitulatif</h3>

              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      {item.title} ×{item.quantity}
                    </span>
                    <span className="text-white font-medium">
                      {(item.price * item.quantity).toFixed(2)}€
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-700 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Sous-total</span>
                  <span className="text-white">{total.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>TVA (21%)</span>
                  <span className="text-white">{tax.toFixed(2)}€</span>
                </div>
                <div className="border-t border-gray-700 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-pink-400">{finalTotal.toFixed(2)}€</span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full py-6 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Traitement en cours...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Payer {finalTotal.toFixed(2)}€
                  </span>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                En finalisant votre commande, vous acceptez nos conditions générales de vente
              </p>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
}