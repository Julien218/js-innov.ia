import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Send, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function CustomMusicRequestModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    business_type: '',
    music_style: '',
    atmosphere: '',
    budget: '',
    preferred_meeting: '',
    message: ''
  });

  const queryClient = useQueryClient();

  const createContactMutation = useMutation({
    mutationFn: (data) => base44.entities.Contact.create({
      ...data,
      subject: 'Demande Musique Personnalisée',
      message: `Type de commerce: ${data.business_type}
Style musical souhaité: ${data.music_style}
Ambiance recherchée: ${data.atmosphere}
Mode de rencontre préféré: ${data.preferred_meeting}

${data.message}`
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      setStep(3);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createContactMutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-gradient-to-br from-gray-900 to-black border border-purple-500/30 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>

          {/* Avatar Header */}
          <div className="p-8 text-center border-b border-purple-500/20">
            <div className="w-24 h-24 mx-auto rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-2xl mb-4 overflow-hidden border-2 border-pink-400/30">
              <img 
                src="https://drive.google.com/uc?export=view&id=1ySt1ej95d6U1gMbAZ_Hw-wdKG3hj8KuF" 
                alt="Assistant Musical"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 gradient-text">
              Création Musicale Sur Mesure
            </h2>
            <p className="text-gray-400 text-sm">
              Bonjour ! Je suis votre assistant virtuel. Ravis de créer ensemble l'ambiance parfaite pour votre commerce 🎶
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h3 className="text-lg font-semibold text-white mb-6">
                  📋 Parlez-moi de votre projet
                </h3>
                
                <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Votre nom *</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-white/5 border-gray-700 text-white"
                        placeholder="Prénom Nom"
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
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Téléphone</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-white/5 border-gray-700 text-white"
                        placeholder="+33 X XX XX XX XX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Nom du commerce *</label>
                      <Input
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="bg-white/5 border-gray-700 text-white"
                        placeholder="Mon Commerce"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Type de commerce *</label>
                    <Input
                      required
                      value={formData.business_type}
                      onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
                      className="bg-white/5 border-gray-700 text-white"
                      placeholder="Ex: Boutique de vêtements, Restaurant, Spa..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-6 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                  >
                    Continuer
                    <Sparkles className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h3 className="text-lg font-semibold text-white mb-6">
                  🎨 Définissons votre ambiance musicale
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Style musical souhaité</label>
                    <Select
                      value={formData.music_style}
                      onValueChange={(value) => setFormData({ ...formData, music_style: value })}
                    >
                      <SelectTrigger className="bg-white/5 border-gray-700 text-white">
                        <SelectValue placeholder="Choisir un style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lounge">Lounge</SelectItem>
                        <SelectItem value="Jazz">Jazz</SelectItem>
                        <SelectItem value="Pop">Pop</SelectItem>
                        <SelectItem value="Électronique">Électronique</SelectItem>
                        <SelectItem value="Classique">Classique</SelectItem>
                        <SelectItem value="Ambiance">Ambiance</SelectItem>
                        <SelectItem value="Mix personnalisé">Mix personnalisé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Ambiance recherchée</label>
                    <Textarea
                      value={formData.atmosphere}
                      onChange={(e) => setFormData({ ...formData, atmosphere: e.target.value })}
                      className="bg-white/5 border-gray-700 text-white min-h-[80px]"
                      placeholder="Ex: Chic et élégante, énergique et dynamique, relaxante..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Budget estimé</label>
                    <Select
                      value={formData.budget}
                      onValueChange={(value) => setFormData({ ...formData, budget: value })}
                    >
                      <SelectTrigger className="bg-white/5 border-gray-700 text-white">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="< 200€">{"< 200€"}</SelectItem>
                        <SelectItem value="200€ - 500€">200€ - 500€</SelectItem>
                        <SelectItem value="500€ - 1000€">500€ - 1000€</SelectItem>
                        <SelectItem value="> 1000€">{"> 1000€"}</SelectItem>
                        <SelectItem value="À définir">À définir ensemble</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Préférence pour notre rencontre</label>
                    <Select
                      value={formData.preferred_meeting}
                      onValueChange={(value) => setFormData({ ...formData, preferred_meeting: value })}
                    >
                      <SelectTrigger className="bg-white/5 border-gray-700 text-white">
                        <SelectValue placeholder="Comment souhaitez-vous échanger ?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Visio (Zoom/Meet)">Visio (Zoom/Meet)</SelectItem>
                        <SelectItem value="Téléphone">Téléphone</SelectItem>
                        <SelectItem value="Rendez-vous physique">Rendez-vous physique</SelectItem>
                        <SelectItem value="Email uniquement">Email uniquement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Message complémentaire</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-white/5 border-gray-700 text-white min-h-[100px]"
                      placeholder="Détails supplémentaires, disponibilités, questions..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={() => setStep(1)}
                      variant="outline"
                      className="flex-1 border-gray-700"
                    >
                      Retour
                    </Button>
                    <Button
                      type="submit"
                      disabled={createContactMutation.isPending}
                      className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                    >
                      {createContactMutation.isPending ? (
                        'Envoi...'
                      ) : (
                        <>
                          Envoyer ma demande
                          <Send className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mb-6">
                  <div className="text-4xl">✓</div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Demande envoyée avec succès ! 🎉
                </h3>
                <p className="text-gray-400 mb-6">
                  Merci {formData.name} ! Je reviens vers vous sous 24h pour planifier notre {formData.preferred_meeting?.toLowerCase() || 'échange'} et créer ensemble votre ambiance musicale idéale.
                </p>
                <Button
                  onClick={onClose}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                >
                  Fermer
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}