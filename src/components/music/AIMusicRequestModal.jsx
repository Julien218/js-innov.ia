import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music2, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { platform } from '@/api/platformClient';
import { useMutation } from '@tanstack/react-query';

export default function AIMusicRequestModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: '',
    businessName: '',
    musicStyle: '',
    withLyrics: 'non',
    needAds: 'non',
    adsContent: '',
    budget: '',
    message: ''
  });

  const submitMutation = useMutation({
    mutationFn: async (data) => {
      await platform.entities.Contact.create({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.businessName,
        subject: 'Autre',
        message: `Type de commerce: ${data.businessType}
Style musical: ${data.musicStyle}
Avec paroles: ${data.withLyrics}
Besoin de pubs: ${data.needAds}
${data.adsContent ? `Contenu pubs: ${data.adsContent}` : ''}
Budget: ${data.budget}

Message:
${data.message}`
      });
    },
    onSuccess: () => {
      setStep(4);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setFormData({
        name: '',
        email: '',
        phone: '',
        businessType: '',
        businessName: '',
        musicStyle: '',
        withLyrics: 'non',
        needAds: 'non',
        adsContent: '',
        budget: '',
        message: ''
      });
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-gradient-to-br from-gray-900 to-black border-2 border-pink-500/30 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-pink-600/20 to-purple-600/20 border border-pink-500/30 mb-4">
                  <Music2 className="w-8 h-8 text-pink-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Votre Musique Par IA
                </h2>
                <p className="text-gray-400">
                  Créons ensemble votre ambiance musicale unique
                </p>
              </div>

              {/* Progress */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`h-2 rounded-full transition-all ${
                    i <= step ? 'w-12 bg-gradient-to-r from-pink-600 to-purple-600' : 'w-8 bg-gray-700'
                  }`} />
                ))}
              </div>

              {/* Forms */}
              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-semibold text-white mb-4">Informations de contact</h3>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Nom complet *</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full bg-gradient-to-r from-pink-600 to-purple-600"
                    >
                      Suivant
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-semibold text-white mb-4">Votre commerce</h3>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Type de commerce *</label>
                      <Select
                        value={formData.businessType}
                        onValueChange={(value) => setFormData({ ...formData, businessType: value })}
                      >
                        <SelectTrigger className="bg-white/5 border-gray-700 text-white">
                          <SelectValue placeholder="Sélectionnez..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="boutique">Boutique de vêtements</SelectItem>
                          <SelectItem value="restaurant">Café/Restaurant</SelectItem>
                          <SelectItem value="salon">Salon de beauté</SelectItem>
                          <SelectItem value="alimentaire">Magasin alimentaire</SelectItem>
                          <SelectItem value="sport">Salle de sport</SelectItem>
                          <SelectItem value="medical">Cabinet médical</SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Nom du commerce</label>
                      <Input
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        className="bg-white/5 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Style musical souhaité</label>
                      <Input
                        value={formData.musicStyle}
                        onChange={(e) => setFormData({ ...formData, musicStyle: e.target.value })}
                        className="bg-white/5 border-gray-700 text-white"
                        placeholder="Ex: Lounge, Jazz, Pop..."
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        onClick={() => setStep(1)}
                        variant="outline"
                        className="flex-1 border-gray-700"
                      >
                        Retour
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setStep(3)}
                        className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600"
                      >
                        Suivant
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-semibold text-white mb-4">Options & Budget</h3>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Avec paroles ?</label>
                      <Select
                        value={formData.withLyrics}
                        onValueChange={(value) => setFormData({ ...formData, withLyrics: value })}
                      >
                        <SelectTrigger className="bg-white/5 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="non">Non - Instrumental uniquement</SelectItem>
                          <SelectItem value="oui">Oui - Avec chant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Besoin d'intégrer des pubs/promos ?</label>
                      <Select
                        value={formData.needAds}
                        onValueChange={(value) => setFormData({ ...formData, needAds: value })}
                      >
                        <SelectTrigger className="bg-white/5 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="non">Non</SelectItem>
                          <SelectItem value="oui">Oui</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {formData.needAds === 'oui' && (
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Quel type de messages ?</label>
                        <Textarea
                          value={formData.adsContent}
                          onChange={(e) => setFormData({ ...formData, adsContent: e.target.value })}
                          className="bg-white/5 border-gray-700 text-white h-24"
                          placeholder="Ex: Promotions saisonnières, nouveautés, horaires..."
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Budget estimé</label>
                      <Select
                        value={formData.budget}
                        onValueChange={(value) => setFormData({ ...formData, budget: value })}
                      >
                        <SelectTrigger className="bg-white/5 border-gray-700 text-white">
                          <SelectValue placeholder="Sélectionnez..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="< 500€">Moins de 500€</SelectItem>
                          <SelectItem value="500€ - 1000€">500€ - 1000€</SelectItem>
                          <SelectItem value="1000€ - 2000€">1000€ - 2000€</SelectItem>
                          <SelectItem value="> 2000€">Plus de 2000€</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Message complémentaire</label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="bg-white/5 border-gray-700 text-white h-24"
                        placeholder="Partagez-nous vos besoins spécifiques..."
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        onClick={() => setStep(2)}
                        variant="outline"
                        className="flex-1 border-gray-700"
                      >
                        Retour
                      </Button>
                      <Button
                        type="submit"
                        disabled={submitMutation.isPending}
                        className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600"
                      >
                        {submitMutation.isPending ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Envoi...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Envoyer ma demande
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 mb-6">
                      <CheckCircle2 className="w-16 h-16 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Demande envoyée avec succès !</h3>
                    <p className="text-gray-400 mb-8">
                      Merci pour votre confiance. Je vous contacte très bientôt pour discuter de votre projet musical personnalisé.
                    </p>
                    <Button
                      onClick={handleClose}
                      className="bg-gradient-to-r from-pink-600 to-purple-600"
                    >
                      Fermer
                    </Button>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}