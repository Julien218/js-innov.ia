import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, ShoppingBag, CheckCircle, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';

export default function LogoSenergieDour() {
  const [formData, setFormData] = useState({
    type: '',
    quartier: '',
    valeurs: [],
    valeur_autre: '',
    image_dour: [],
    style: '',
    couleurs: [],
    couleur_autre: '',
    slogan_souhaite: '',
    suggestion_slogan: '',
    message_libre: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const valeursOptions = [
    'Proximité',
    'Commerce local',
    'Solidarité',
    'Bien-être',
    'Vivre ensemble',
    'Écologie / durabilité',
    'Dynamisme',
    'Fierté locale'
  ];

  const imageDourOptions = [
    'Ville conviviale',
    'Commerces de proximité',
    'Communauté soudée',
    'Ville en mouvement',
    'Ville humaine / verte'
  ];

  const couleursOptions = [
    'Bleu',
    'Jaune doré',
    'Blanc',
    'Vert'
  ];

  const handleCheckboxChange = (field, value, maxSelection = null) => {
    setFormData(prev => {
      const currentArray = prev[field] || [];
      const isSelected = currentArray.includes(value);
      
      if (isSelected) {
        return {
          ...prev,
          [field]: currentArray.filter(item => item !== value)
        };
      } else {
        if (maxSelection && currentArray.length >= maxSelection) {
          return prev;
        }
        return {
          ...prev,
          [field]: [...currentArray, value]
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await base44.entities.LogoSubmission.create(formData);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Erreur soumission:', error);
      alert('Erreur lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-yellow-50 to-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl"
        >
          <div className="inline-flex p-8 rounded-full bg-gradient-to-br from-blue-600/20 to-yellow-500/20 border-4 border-blue-600/30 mb-8">
            <CheckCircle className="w-24 h-24 text-blue-600" />
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-yellow-600 bg-clip-text text-transparent">
            Merci pour votre participation ! 🙏
          </h2>
          <p className="text-xl text-gray-700 mb-6 leading-relaxed">
            Votre avis contribuera à créer un logo qui représente réellement Dour et ses habitants.
          </p>
          <div className="p-6 bg-white rounded-2xl shadow-xl border border-blue-200">
            <p className="text-gray-600 italic">
              Le logo de Senergie Dour sera créé à partir des avis des habitants et des commerçants.
              <br />
              <strong className="text-blue-600">Un logo collectif, pour une énergie locale.</strong>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-blue-50 via-yellow-50 to-white">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white rounded-full shadow-lg border-2 border-blue-600">
            <Palette className="w-6 h-6 text-blue-600" />
            <span className="text-blue-600 font-semibold">Senergie Dour</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
            Construisons ensemble le logo de Senergie Dour
          </h1>
          
          <p className="text-2xl text-gray-800 mb-6 flex items-center justify-center gap-2">
            Habitants et commerçants de Dour, votre avis compte 
            <Heart className="w-6 h-6 text-blue-600 fill-blue-600" />
            <span className="text-yellow-500">💛</span>
          </p>

          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-200 text-left">
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong className="text-blue-600">Senergie Dour</strong> est une asbl qui a pour objectif de rassembler
              les habitants et les commerçants autour du <strong>commerce local</strong>, du <strong>bien-être</strong> et du <strong>vivre ensemble</strong>.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nous souhaitons créer un logo qui nous représente tous.
              Pour cela, nous avons besoin de votre avis.
            </p>
            <p className="text-blue-600 font-semibold">
              Merci de prendre 2 à 3 minutes pour participer.
            </p>
          </div>
        </motion.div>

        {/* Formulaire */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border-2 border-yellow-200 space-y-10"
        >
          {/* A. Profil */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-800">Votre profil</h3>
            </div>

            <div className="space-y-3">
              <Label className="text-gray-700 font-semibold">Vous êtes * :</Label>
              <RadioGroup required value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                  <RadioGroupItem value="Habitant de Dour" id="habitant" />
                  <Label htmlFor="habitant" className="cursor-pointer">Habitant de Dour</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                  <RadioGroupItem value="Commerçant à Dour" id="commercant" />
                  <Label htmlFor="commercant" className="cursor-pointer">Commerçant à Dour</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                  <RadioGroupItem value="Les deux" id="lesdeux" />
                  <Label htmlFor="lesdeux" className="cursor-pointer">Les deux</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="quartier" className="text-gray-700">Quartier / Village (optionnel)</Label>
              <Input
                id="quartier"
                value={formData.quartier}
                onChange={(e) => setFormData({...formData, quartier: e.target.value})}
                placeholder="Ex: Centre-ville, Wihéries..."
                className="mt-2 border-blue-200 focus:border-blue-600"
              />
            </div>
          </div>

          {/* B. Valeurs */}
          <div className="space-y-4 pt-8 border-t-2 border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-800">Valeurs à représenter</h3>
            </div>
            <p className="text-sm text-gray-600">Sélectionnez 3 ou 4 valeurs maximum *</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {valeursOptions.map((valeur) => (
                <div key={valeur} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  <Checkbox
                    id={`valeur-${valeur}`}
                    checked={formData.valeurs.includes(valeur)}
                    onCheckedChange={() => handleCheckboxChange('valeurs', valeur, 4)}
                    disabled={!formData.valeurs.includes(valeur) && formData.valeurs.length >= 4}
                  />
                  <Label htmlFor={`valeur-${valeur}`} className="cursor-pointer flex-1">{valeur}</Label>
                </div>
              ))}
            </div>

            <div>
              <Label htmlFor="valeur_autre" className="text-gray-700">Autre valeur</Label>
              <Input
                id="valeur_autre"
                value={formData.valeur_autre}
                onChange={(e) => setFormData({...formData, valeur_autre: e.target.value})}
                placeholder="Une valeur qui vous tient à cœur..."
                className="mt-2 border-blue-200 focus:border-blue-600"
              />
            </div>
          </div>

          {/* C. Image de Dour */}
          <div className="space-y-4 pt-8 border-t-2 border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-800">Dour selon vous</h3>
            </div>
            <p className="text-sm text-gray-600">Comment voyez-vous Dour ? *</p>

            <div className="space-y-3">
              {imageDourOptions.map((option) => (
                <div key={option} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  <Checkbox
                    id={`image-${option}`}
                    checked={formData.image_dour.includes(option)}
                    onCheckedChange={() => handleCheckboxChange('image_dour', option)}
                  />
                  <Label htmlFor={`image-${option}`} className="cursor-pointer flex-1">{option}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* D. Style */}
          <div className="space-y-4 pt-8 border-t-2 border-blue-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Style du logo</h3>
            <p className="text-sm text-gray-600">Quel style préférez-vous ? *</p>

            <RadioGroup required value={formData.style} onValueChange={(value) => setFormData({...formData, style: value})}>
              {['Moderne & simple', 'Chaleureux & humain', 'Associatif & citoyen', 'Institutionnel', 'Créatif / original'].map((style) => (
                <div key={style} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-yellow-50 transition-colors">
                  <RadioGroupItem value={style} id={`style-${style}`} />
                  <Label htmlFor={`style-${style}`} className="cursor-pointer">{style}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* E. Couleurs */}
          <div className="space-y-4 pt-8 border-t-2 border-blue-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Couleurs</h3>
            <p className="text-sm text-gray-600">Quelles couleurs représentent Senergie Dour ? *</p>

            <div className="grid grid-cols-2 gap-3">
              {couleursOptions.map((couleur) => (
                <div key={couleur} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  <Checkbox
                    id={`couleur-${couleur}`}
                    checked={formData.couleurs.includes(couleur)}
                    onCheckedChange={() => handleCheckboxChange('couleurs', couleur)}
                  />
                  <Label htmlFor={`couleur-${couleur}`} className="cursor-pointer flex-1">{couleur}</Label>
                </div>
              ))}
            </div>

            <div>
              <Label htmlFor="couleur_autre" className="text-gray-700">Autre couleur</Label>
              <Input
                id="couleur_autre"
                value={formData.couleur_autre}
                onChange={(e) => setFormData({...formData, couleur_autre: e.target.value})}
                placeholder="Ex: Orange, Rouge..."
                className="mt-2 border-blue-200 focus:border-blue-600"
              />
            </div>
          </div>

          {/* F. Slogan */}
          <div className="space-y-4 pt-8 border-t-2 border-blue-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Slogan</h3>
            <p className="text-sm text-gray-600">Souhaitez-vous un slogan sur le logo ? *</p>

            <RadioGroup required value={formData.slogan_souhaite} onValueChange={(value) => setFormData({...formData, slogan_souhaite: value})}>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                <RadioGroupItem value="Oui" id="slogan-oui" />
                <Label htmlFor="slogan-oui" className="cursor-pointer">Oui</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                <RadioGroupItem value="Non" id="slogan-non" />
                <Label htmlFor="slogan-non" className="cursor-pointer">Non</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                <RadioGroupItem value="Je ne sais pas" id="slogan-sais-pas" />
                <Label htmlFor="slogan-sais-pas" className="cursor-pointer">Je ne sais pas</Label>
              </div>
            </RadioGroup>

            {formData.slogan_souhaite === 'Oui' && (
              <div>
                <Label htmlFor="suggestion_slogan" className="text-gray-700">Votre suggestion de slogan</Label>
                <Textarea
                  id="suggestion_slogan"
                  value={formData.suggestion_slogan}
                  onChange={(e) => setFormData({...formData, suggestion_slogan: e.target.value})}
                  placeholder="Ex: Dour, ensemble on fait la différence"
                  className="mt-2 border-blue-200 focus:border-blue-600 min-h-[100px]"
                />
              </div>
            )}
          </div>

          {/* G. Message libre */}
          <div className="space-y-4 pt-8 border-t-2 border-blue-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Votre vision de Dour</h3>
            <Label htmlFor="message_libre" className="text-gray-700">Un mot, une idée ou un symbole qui représente Dour selon vous</Label>
            <Textarea
              id="message_libre"
              value={formData.message_libre}
              onChange={(e) => setFormData({...formData, message_libre: e.target.value})}
              placeholder="Partagez votre vision de Dour en quelques mots..."
              className="mt-2 border-blue-200 focus:border-blue-600 min-h-[120px]"
            />
          </div>

          {/* Bouton */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-6 text-lg font-bold rounded-xl bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600 text-white shadow-xl hover:shadow-2xl transition-all"
          >
            {loading ? 'Envoi en cours...' : 'Je participe au logo de Senergie Dour 🎨'}
          </Button>

          <p className="text-center text-sm text-gray-500 italic">
            * Champs obligatoires
          </p>
        </motion.form>

        {/* Message final */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center p-6 bg-gradient-to-r from-blue-600/10 to-yellow-500/10 rounded-2xl border-2 border-blue-200"
        >
          <p className="text-gray-700 italic text-lg">
            Le logo de Senergie Dour sera créé à partir des avis des habitants et des commerçants.
            <br />
            <strong className="text-blue-600">Un logo collectif, pour une énergie locale.</strong>
          </p>
        </motion.div>
      </div>
    </div>
  );
}