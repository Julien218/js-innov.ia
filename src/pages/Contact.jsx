import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import SectionHeader from '../components/shared/SectionHeader';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    budget: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const queryClient = useQueryClient();

  const createContactMutation = useMutation({
    mutationFn: (data) => base44.entities.Contact.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
        budget: ''
      });
      setTimeout(() => setSubmitted(false), 5000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createContactMutation.mutate(formData);
  };

  if (submitted) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 mb-6">
            <CheckCircle className="w-16 h-16 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Message envoyé !</h2>
          <p className="text-gray-400 text-lg">
            Merci pour votre demande. Nous vous recontacterons très prochainement.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          icon={Mail}
          title="Contactez-nous"
          subtitle="Discutons de votre projet et transformons votre vision en réalité"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Informations</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-pink-600/20 to-purple-600/20 border border-pink-500/30">
                    <Mail className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Email</div>
                    <div className="text-white font-medium">contact@js-innov.ia</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/30">
                    <Phone className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Téléphone</div>
                    <div className="text-white font-medium">+32 494 11 90 90</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-600/20 to-teal-600/20 border border-cyan-500/30">
                    <MapPin className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Localisation</div>
                    <div className="text-white font-medium">Dour, Belgique</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20">
              <h4 className="font-semibold text-white mb-3">Horaires</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Lun - Ven</span>
                  <span className="text-white">9h - 18h</span>
                </div>
                <div className="flex justify-between">
                  <span>Sam</span>
                  <span className="text-white">Sur rendez-vous</span>
                </div>
                <div className="flex justify-between">
                  <span>Dim</span>
                  <span className="text-gray-500">Fermé</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nom complet *
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-black/30 border-gray-700 text-white placeholder:text-gray-500"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-black/30 border-gray-700 text-white placeholder:text-gray-500"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Téléphone
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-black/30 border-gray-700 text-white placeholder:text-gray-500"
                    placeholder="+33 X XX XX XX XX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Entreprise
                  </label>
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="bg-black/30 border-gray-700 text-white placeholder:text-gray-500"
                    placeholder="Nom de l'entreprise"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Sujet *
                  </label>
                  <Select
                    required
                    value={formData.subject}
                    onValueChange={(value) => setFormData({ ...formData, subject: value })}
                  >
                    <SelectTrigger className="bg-black/30 border-gray-700 text-white">
                      <SelectValue placeholder="Choisir un sujet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Automatisation">Automatisation</SelectItem>
                      <SelectItem value="Template">Template</SelectItem>
                      <SelectItem value="Application">Application</SelectItem>
                      <SelectItem value="Consultation">Consultation</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Budget estimé
                  </label>
                  <Select
                    value={formData.budget}
                    onValueChange={(value) => setFormData({ ...formData, budget: value })}
                  >
                    <SelectTrigger className="bg-black/30 border-gray-700 text-white">
                      <SelectValue placeholder="Sélectionner un budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="< 1000€">{"< 1000€"}</SelectItem>
                      <SelectItem value="1000€ - 5000€">1000€ - 5000€</SelectItem>
                      <SelectItem value="5000€ - 10000€">5000€ - 10000€</SelectItem>
                      <SelectItem value="> 10000€">{"> 10000€"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <Textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-black/30 border-gray-700 text-white placeholder:text-gray-500 min-h-[150px]"
                  placeholder="Décrivez votre projet en détail..."
                />
              </div>

              <Button
                type="submit"
                disabled={createContactMutation.isPending}
                className="w-full py-6 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold hover:shadow-2xl hover:shadow-pink-500/50 transition-all text-lg"
              >
                {createContactMutation.isPending ? (
                  'Envoi en cours...'
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Envoyer le message
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}