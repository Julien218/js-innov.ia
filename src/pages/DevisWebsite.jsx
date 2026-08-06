import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle, ArrowRight, ArrowLeft, Sparkles, Globe, Zap } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function DevisWebsite() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Étape 1
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    entreprise: '',
    secteur_activite: '',
    // Étape 2
    type_projet: '',
    url_site_existant: '',
    problemes_site: '',
    ameliorations_site: '',
    // Étape 3
    objectifs: [],
    // Étape 4
    fonctionnalites: [],
    // Étape 5
    style_souhaite: '',
    liens_reference: [],
    lien_reference_input: '',
    // Étape 6
    budget_indicatif: '',
    delai: ''
  });

  const objectifsOptions = [
    'Générer des contacts',
    'Vendre en ligne',
    'Présenter une activité',
    'Automatiser les demandes clients',
    'Améliorer l\'image de marque',
    'Gagner du temps'
  ];

  const fonctionnalitesOptions = [
    'Formulaire avancé',
    'Devis automatique',
    'Paiement en ligne',
    'Prise de rendez-vous',
    'Espace client',
    'Chat / chatbot',
    'Newsletter',
    'Multilingue',
    'SEO avancé',
    'Automatisations internes',
    'Maintenance & sécurité'
  ];

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => {
      const currentArray = prev[field] || [];
      const isSelected = currentArray.includes(value);

      if (isSelected) {
        return {
          ...prev,
          [field]: currentArray.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [field]: [...currentArray, value]
        };
      }
    });
  };

  const addLienReference = () => {
    if (formData.lien_reference_input.trim()) {
      setFormData(prev => ({
        ...prev,
        liens_reference: [...prev.liens_reference, prev.lien_reference_input],
        lien_reference_input: ''
      }));
    }
  };

  const removeLienReference = (index) => {
    setFormData(prev => ({
      ...prev,
      liens_reference: prev.liens_reference.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Appel à la fonction backend
      const response = await base44.functions.invoke('submitQuoteRequest', {
        ...formData
      });

      if (response.data.success) {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert('Erreur lors de la soumission. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur soumission:', error);
      alert('Erreur lors de la soumission. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 6) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 0: return true;
      case 1:
        return formData.prenom && formData.nom && formData.email;
      case 2:
        return formData.type_projet && (
          formData.type_projet !== 'Rénovation de site existant' ||
          (formData.url_site_existant && formData.problemes_site && formData.ameliorations_site)
        );
      case 3:
        return formData.objectifs.length > 0;
      case 4:
        return formData.fonctionnalites.length > 0;
      case 5:
        return formData.style_souhaite;
      case 6:
        return formData.budget_indicatif && formData.delai;
      default:
        return false;
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-950 via-gray-900 to-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl"
        >
          <div className="inline-flex p-8 rounded-full bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-4 border-green-600/30 mb-8">
            <CheckCircle className="w-24 h-24 text-green-400" />
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Demande bien reçue !
          </h2>
          <p className="text-xl text-gray-300 mb-6 leading-relaxed">
            Merci pour votre demande. Nous analysons actuellement votre projet.
          </p>
          <div className="p-6 bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-2xl">
            <p className="text-gray-400">
              Vous recevrez votre devis personnalisé par email.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <div className="max-w-4xl mx-auto">
        {step === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-pink-600/20 to-purple-600/20 border border-pink-500/30 rounded-full">
              <Globe className="w-5 h-5 text-pink-400" />
              <span className="text-pink-400 font-semibold">Devis personnalisé</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Demande de devis personnalisé
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Cet espace est réservé aux clients souhaitant un devis pour la création, la rénovation ou l'ajout de fonctionnalités à leur site Internet.
            </p>

            <p className="text-lg text-gray-400 mb-12">
              Après analyse de votre demande, vous recevrez une estimation personnalisée par email.
            </p>

            <Button
              onClick={nextStep}
              className="px-8 py-6 text-lg rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-2xl"
            >
              Commencer ma demande
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Étape {step} sur 6</span>
                <span className="text-sm text-gray-400">{Math.round((step / 6) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-600 to-purple-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / 6) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-3xl p-8">
              <AnimatePresence mode="wait">
                {/* Étape 1 */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-3xl font-bold text-white mb-6">Vos informations</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-gray-300 mb-2">Prénom *</Label>
                        <Input
                          required
                          value={formData.prenom}
                          onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                          className="bg-black/30 border-gray-700 text-white"
                          placeholder="Votre prénom"
                        />
                      </div>

                      <div>
                        <Label className="text-gray-300 mb-2">Nom *</Label>
                        <Input
                          required
                          value={formData.nom}
                          onChange={(e) => setFormData({...formData, nom: e.target.value})}
                          className="bg-black/30 border-gray-700 text-white"
                          placeholder="Votre nom"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-300 mb-2">Email *</Label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="bg-black/30 border-gray-700 text-white"
                        placeholder="votre@email.com"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300 mb-2">Téléphone</Label>
                      <Input
                        value={formData.telephone}
                        onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                        className="bg-black/30 border-gray-700 text-white"
                        placeholder="+33 X XX XX XX XX"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300 mb-2">Entreprise</Label>
                      <Input
                        value={formData.entreprise}
                        onChange={(e) => setFormData({...formData, entreprise: e.target.value})}
                        className="bg-black/30 border-gray-700 text-white"
                        placeholder="Nom de votre entreprise"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300 mb-2">Secteur d'activité</Label>
                      <Input
                        value={formData.secteur_activite}
                        onChange={(e) => setFormData({...formData, secteur_activite: e.target.value})}
                        className="bg-black/30 border-gray-700 text-white"
                        placeholder="Ex: E-commerce, Conseil, etc."
                      />
                    </div>
                  </motion.div>
                )}

                {/* Étape 2 */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-3xl font-bold text-white mb-6">Type de projet</h2>

                    <div>
                      <Label className="text-gray-300 mb-4">Quel est votre projet ? *</Label>
                      <RadioGroup
                        value={formData.type_projet}
                        onValueChange={(value) => setFormData({...formData, type_projet: value})}
                        className="space-y-3 mt-3"
                      >
                        {['Création de site Internet', 'Rénovation de site existant', 'Ajout de fonctionnalités / innovation'].map((type) => (
                          <div
                            key={type}
                            className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all ${
                              formData.type_projet === type
                                ? 'bg-gradient-to-r from-pink-600/20 to-purple-600/20 border-pink-500'
                                : 'bg-black/20 border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <RadioGroupItem value={type} id={type} />
                            <Label htmlFor={type} className="text-gray-300 cursor-pointer flex-1">{type}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {formData.type_projet === 'Rénovation de site existant' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4 mt-6"
                      >
                        <div>
                          <Label className="text-gray-300 mb-2">URL du site existant *</Label>
                          <Input
                            value={formData.url_site_existant}
                            onChange={(e) => setFormData({...formData, url_site_existant: e.target.value})}
                            className="bg-black/30 border-gray-700 text-white"
                            placeholder="https://votre-site.com"
                          />
                        </div>

                        <div>
                          <Label className="text-gray-300 mb-2">Problèmes rencontrés *</Label>
                          <Textarea
                            value={formData.problemes_site}
                            onChange={(e) => setFormData({...formData, problemes_site: e.target.value})}
                            className="bg-black/30 border-gray-700 text-white min-h-[100px]"
                            placeholder="Décrivez les problèmes actuels..."
                          />
                        </div>

                        <div>
                          <Label className="text-gray-300 mb-2">Ce qui doit être amélioré *</Label>
                          <Textarea
                            value={formData.ameliorations_site}
                            onChange={(e) => setFormData({...formData, ameliorations_site: e.target.value})}
                            className="bg-black/30 border-gray-700 text-white min-h-[100px]"
                            placeholder="Quelles améliorations souhaitez-vous ?"
                          />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Étape 3 */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-3xl font-bold text-white mb-6">Objectifs du site</h2>
                    <p className="text-gray-400 mb-6">Sélectionnez un ou plusieurs objectifs *</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {objectifsOptions.map((objectif) => (
                        <div
                          key={objectif}
                          className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                            formData.objectifs.includes(objectif)
                              ? 'bg-gradient-to-r from-pink-600/20 to-purple-600/20 border-pink-500'
                              : 'bg-black/20 border-gray-700 hover:border-gray-600'
                          }`}
                          onClick={() => handleCheckboxChange('objectifs', objectif)}
                        >
                          <Checkbox
                            id={objectif}
                            checked={formData.objectifs.includes(objectif)}
                            onCheckedChange={() => handleCheckboxChange('objectifs', objectif)}
                          />
                          <Label htmlFor={objectif} className="text-gray-300 cursor-pointer flex-1">{objectif}</Label>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Étape 4 */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-3xl font-bold text-white mb-6">Fonctionnalités souhaitées</h2>
                    <p className="text-gray-400 mb-6">Sélectionnez les fonctionnalités dont vous avez besoin *</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {fonctionnalitesOptions.map((fonctionnalite) => (
                        <div
                          key={fonctionnalite}
                          className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                            formData.fonctionnalites.includes(fonctionnalite)
                              ? 'bg-gradient-to-r from-pink-600/20 to-purple-600/20 border-pink-500'
                              : 'bg-black/20 border-gray-700 hover:border-gray-600'
                          }`}
                          onClick={() => handleCheckboxChange('fonctionnalites', fonctionnalite)}
                        >
                          <Checkbox
                            id={fonctionnalite}
                            checked={formData.fonctionnalites.includes(fonctionnalite)}
                            onCheckedChange={() => handleCheckboxChange('fonctionnalites', fonctionnalite)}
                          />
                          <Label htmlFor={fonctionnalite} className="text-gray-300 cursor-pointer flex-1">{fonctionnalite}</Label>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Étape 5 */}
                {step === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-3xl font-bold text-white mb-6">Design & Inspiration</h2>

                    <div>
                      <Label className="text-gray-300 mb-4">Style souhaité *</Label>
                      <RadioGroup
                        value={formData.style_souhaite}
                        onValueChange={(value) => setFormData({...formData, style_souhaite: value})}
                        className="space-y-3 mt-3"
                      >
                        {['Moderne', 'Minimaliste', 'Luxe', 'Corporate', 'Créatif'].map((style) => (
                          <div
                            key={style}
                            className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all ${
                              formData.style_souhaite === style
                                ? 'bg-gradient-to-r from-pink-600/20 to-purple-600/20 border-pink-500'
                                : 'bg-black/20 border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <RadioGroupItem value={style} id={style} />
                            <Label htmlFor={style} className="text-gray-300 cursor-pointer flex-1">{style}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-gray-300 mb-2">Sites de référence (optionnel)</Label>
                      <p className="text-sm text-gray-500 mb-3">Ajoutez des liens de sites qui vous inspirent</p>

                      <div className="flex gap-2 mb-3">
                        <Input
                          value={formData.lien_reference_input}
                          onChange={(e) => setFormData({...formData, lien_reference_input: e.target.value})}
                          className="bg-black/30 border-gray-700 text-white flex-1"
                          placeholder="https://exemple.com"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addLienReference();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={addLienReference}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Ajouter
                        </Button>
                      </div>

                      {formData.liens_reference.length > 0 && (
                        <div className="space-y-2">
                          {formData.liens_reference.map((lien, index) => (
                            <div key={index} className="flex items-center gap-2 p-3 bg-black/20 rounded-lg border border-gray-700">
                              <span className="text-gray-300 text-sm flex-1 truncate">{lien}</span>
                              <Button
                                type="button"
                                onClick={() => removeLienReference(index)}
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300"
                              >
                                Retirer
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Étape 6 */}
                {step === 6 && (
                  <motion.div
                    key="step6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-3xl font-bold text-white mb-6">Budget & Délai</h2>

                    <div>
                      <Label className="text-gray-300 mb-4">Budget indicatif *</Label>
                      <RadioGroup
                        value={formData.budget_indicatif}
                        onValueChange={(value) => setFormData({...formData, budget_indicatif: value})}
                        className="space-y-3 mt-3"
                      >
                        {['Moins de 1 000 €', '1 000 – 3 000 €', '3 000 – 6 000 €', 'Plus de 6 000 €'].map((budget) => (
                          <div
                            key={budget}
                            className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all ${
                              formData.budget_indicatif === budget
                                ? 'bg-gradient-to-r from-pink-600/20 to-purple-600/20 border-pink-500'
                                : 'bg-black/20 border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <RadioGroupItem value={budget} id={budget} />
                            <Label htmlFor={budget} className="text-gray-300 cursor-pointer flex-1">{budget}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-gray-300 mb-4">Délai souhaité *</Label>
                      <RadioGroup
                        value={formData.delai}
                        onValueChange={(value) => setFormData({...formData, delai: value})}
                        className="space-y-3 mt-3"
                      >
                        {['Urgent', 'Standard', 'Flexible'].map((delai) => (
                          <div
                            key={delai}
                            className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all ${
                              formData.delai === delai
                                ? 'bg-gradient-to-r from-pink-600/20 to-purple-600/20 border-pink-500'
                                : 'bg-black/20 border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <RadioGroupItem value={delai} id={delai} />
                            <Label htmlFor={delai} className="text-gray-300 cursor-pointer flex-1">{delai}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="mt-8 p-6 bg-gradient-to-r from-pink-600/10 to-purple-600/10 border border-pink-500/30 rounded-2xl">
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-6 h-6 text-pink-400 mt-1" />
                        <div>
                          <h3 className="text-white font-semibold mb-2">Dernière étape !</h3>
                          <p className="text-gray-300 text-sm">
                            Validez votre demande pour recevoir votre devis personnalisé.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation buttons */}
              {step > 0 && (
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-700">
                  <Button
                    onClick={prevStep}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour
                  </Button>

                  {step < 6 ? (
                    <Button
                      onClick={nextStep}
                      disabled={!canProceed()}
                      className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:opacity-50"
                    >
                      Suivant
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={!canProceed() || loading}
                      className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:opacity-50"
                    >
                      {loading ? 'Envoi en cours...' : 'Envoyer ma demande'}
                      <Zap className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}