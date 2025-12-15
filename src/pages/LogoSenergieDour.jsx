import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Users, ShoppingBag, CheckCircle, Palette, Sparkles, Target, Lightbulb } from 'lucide-react';
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

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.3 }
    })
  };

  return (
    <div className="min-h-screen py-6 sm:py-12 px-3 sm:px-4 bg-gradient-to-br from-blue-100 via-yellow-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white rounded-full shadow-xl border-2 border-blue-500 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Palette className="w-6 h-6 text-blue-600" />
            </motion.div>
            <span className="text-blue-600 font-bold text-lg">Senergie Dour</span>
            <Sparkles className="w-4 h-4 text-yellow-500" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl sm:text-3xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-yellow-500 bg-clip-text text-transparent px-2"
          >
            Construisons ensemble le logo de Senergie Dour
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base sm:text-xl lg:text-2xl text-gray-700 font-medium mb-6 sm:mb-8 flex items-center justify-center gap-2 sm:gap-3 flex-wrap px-2"
          >
            Habitants et commerçants de Dour, votre avis compte 
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart className="w-7 h-7 text-red-500 fill-red-500" />
            </motion.div>
            <span className="text-2xl">💛</span>
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border-2 border-blue-300 text-left hover:shadow-3xl transition-shadow duration-300"
          >
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
          </motion.div>
        </motion.div>

        {/* Formulaire */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-12 border-2 border-purple-200 space-y-8 sm:space-y-12 relative overflow-hidden"
        >
          {/* Progress indicator */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-500" />
          
          {/* A. Profil */}
          <motion.div 
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg"
              >
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Votre profil</h3>
                <p className="text-xs sm:text-sm text-gray-500">Étape 1/7</p>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-gray-700 font-semibold text-lg">Vous êtes * :</Label>
              <RadioGroup required value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                {['Habitant de Dour', 'Commerçant à Dour', 'Les deux'].map((option, i) => (
                  <motion.div 
                    key={option}
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                      formData.type === option 
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-500 shadow-lg' 
                        : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                    }`}
                  >
                    <RadioGroupItem value={option} id={option.toLowerCase().replace(/ /g, '-')} />
                    <Label htmlFor={option.toLowerCase().replace(/ /g, '-')} className="cursor-pointer text-gray-900 font-medium flex-1">{option}</Label>
                  </motion.div>
                ))}
              </RadioGroup>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Label htmlFor="quartier" className="text-gray-700 font-medium">Quartier / Village (optionnel)</Label>
              <Input
                id="quartier"
                value={formData.quartier}
                onChange={(e) => setFormData({...formData, quartier: e.target.value})}
                placeholder="Ex: Centre-ville, Wihéries..."
                className="mt-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all rounded-xl"
              />
            </motion.div>
          </motion.div>

          {/* B. Valeurs */}
          <motion.div 
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4 pt-8 border-t-2 border-gradient-to-r from-blue-200 to-purple-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                whileHover={{ scale: 1.1 }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-lg"
              >
                <Heart className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent">Valeurs à représenter</h3>
                <p className="text-sm text-gray-500">Étape 2/7</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Target className="w-4 h-4 text-blue-600" />
              <p className="text-sm text-blue-700 font-medium">Sélectionnez 3 ou 4 valeurs maximum *</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {valeursOptions.map((valeur, i) => (
                <motion.div 
                  key={valeur}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                    formData.valeurs.includes(valeur)
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-500 shadow-lg'
                      : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                  } ${!formData.valeurs.includes(valeur) && formData.valeurs.length >= 4 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Checkbox
                    id={`valeur-${valeur}`}
                    checked={formData.valeurs.includes(valeur)}
                    onCheckedChange={() => handleCheckboxChange('valeurs', valeur, 4)}
                    disabled={!formData.valeurs.includes(valeur) && formData.valeurs.length >= 4}
                  />
                  <Label htmlFor={`valeur-${valeur}`} className="cursor-pointer flex-1 text-gray-900 font-medium">{valeur}</Label>
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              {formData.valeurs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Label htmlFor="valeur_autre" className="text-gray-700 font-medium">Autre valeur</Label>
                  <Input
                    id="valeur_autre"
                    value={formData.valeur_autre}
                    onChange={(e) => setFormData({...formData, valeur_autre: e.target.value})}
                    placeholder="Une valeur qui vous tient à cœur..."
                    className="mt-2 border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all rounded-xl"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* C. Image de Dour */}
          <motion.div 
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4 pt-8 border-t-2 border-gradient-to-r from-purple-200 to-yellow-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl shadow-lg"
              >
                <ShoppingBag className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">Dour selon vous</h3>
                <p className="text-sm text-gray-500">Étape 3/7</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <Sparkles className="w-4 h-4 text-yellow-600" />
              <p className="text-sm text-yellow-700 font-medium">Comment voyez-vous Dour ? *</p>
            </div>

            <div className="space-y-3">
              {imageDourOptions.map((option, i) => (
                <motion.div 
                  key={option}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                    formData.image_dour.includes(option)
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-500 shadow-lg'
                      : 'bg-white border-gray-200 hover:border-yellow-300 hover:shadow-md'
                  }`}
                >
                  <Checkbox
                    id={`image-${option}`}
                    checked={formData.image_dour.includes(option)}
                    onCheckedChange={() => handleCheckboxChange('image_dour', option)}
                  />
                  <Label htmlFor={`image-${option}`} className="cursor-pointer flex-1 text-gray-900 font-medium">{option}</Label>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* D. Style */}
          <motion.div 
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4 pt-8 border-t-2 border-gradient-to-r from-green-200 to-blue-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="p-3 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl shadow-lg"
              >
                <Palette className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">Style du logo</h3>
                <p className="text-sm text-gray-500">Étape 4/7</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <Lightbulb className="w-4 h-4 text-green-600" />
              <p className="text-sm text-green-700 font-medium">Quel style préférez-vous ? *</p>
            </div>

            <RadioGroup required value={formData.style} onValueChange={(value) => setFormData({...formData, style: value})}>
              {['Moderne & simple', 'Chaleureux & humain', 'Associatif & citoyen', 'Institutionnel', 'Créatif / original'].map((style, i) => (
                <motion.div 
                  key={style}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                    formData.style === style
                      ? 'bg-gradient-to-r from-green-50 to-teal-50 border-green-500 shadow-lg'
                      : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-md'
                  }`}
                >
                  <RadioGroupItem value={style} id={`style-${style}`} />
                  <Label htmlFor={`style-${style}`} className="cursor-pointer text-gray-900 font-medium flex-1">{style}</Label>
                </motion.div>
              ))}
            </RadioGroup>
          </motion.div>

          {/* E. Couleurs */}
          <motion.div 
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4 pt-8 border-t-2 border-gradient-to-r from-pink-200 to-purple-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="p-3 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 rounded-2xl shadow-lg"
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Couleurs</h3>
                <p className="text-sm text-gray-500">Étape 5/7</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <Palette className="w-4 h-4 text-purple-600" />
              <p className="text-sm text-purple-700 font-medium">Quelles couleurs représentent Senergie Dour ? *</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {couleursOptions.map((couleur, i) => (
                <motion.div 
                  key={couleur}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                    formData.couleurs.includes(couleur)
                      ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-500 shadow-lg'
                      : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <Checkbox
                    id={`couleur-${couleur}`}
                    checked={formData.couleurs.includes(couleur)}
                    onCheckedChange={() => handleCheckboxChange('couleurs', couleur)}
                  />
                  <Label htmlFor={`couleur-${couleur}`} className="cursor-pointer flex-1 text-gray-900 font-medium">{couleur}</Label>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Label htmlFor="couleur_autre" className="text-gray-700 font-medium">Autre couleur</Label>
              <Input
                id="couleur_autre"
                value={formData.couleur_autre}
                onChange={(e) => setFormData({...formData, couleur_autre: e.target.value})}
                placeholder="Ex: Orange, Rouge..."
                className="mt-2 border-2 border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all rounded-xl"
              />
            </motion.div>
          </motion.div>

          {/* F. Slogan */}
          <motion.div 
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4 pt-8 border-t-2 border-gradient-to-r from-orange-200 to-red-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg"
              >
                <Lightbulb className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Slogan</h3>
                <p className="text-sm text-gray-500">Étape 6/7</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <Target className="w-4 h-4 text-orange-600" />
              <p className="text-sm text-orange-700 font-medium">Souhaitez-vous un slogan sur le logo ? *</p>
            </div>

            <RadioGroup required value={formData.slogan_souhaite} onValueChange={(value) => setFormData({...formData, slogan_souhaite: value})}>
              {['Oui', 'Non', 'Je ne sais pas'].map((option, i) => (
                <motion.div 
                  key={option}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                    formData.slogan_souhaite === option
                      ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-500 shadow-lg'
                      : 'bg-white border-gray-200 hover:border-orange-300 hover:shadow-md'
                  }`}
                >
                  <RadioGroupItem value={option} id={`slogan-${option.toLowerCase().replace(/ /g, '-')}`} />
                  <Label htmlFor={`slogan-${option.toLowerCase().replace(/ /g, '-')}`} className="cursor-pointer text-gray-900 font-medium flex-1">{option}</Label>
                </motion.div>
              ))}
            </RadioGroup>

            <AnimatePresence>
              {formData.slogan_souhaite === 'Oui' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Label htmlFor="suggestion_slogan" className="text-gray-700 font-medium">Votre suggestion de slogan</Label>
                  <Textarea
                    id="suggestion_slogan"
                    value={formData.suggestion_slogan}
                    onChange={(e) => setFormData({...formData, suggestion_slogan: e.target.value})}
                    placeholder="Ex: Dour, ensemble on fait la différence"
                    className="mt-2 border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all rounded-xl min-h-[100px]"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* G. Message libre */}
          <motion.div 
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4 pt-8 border-t-2 border-gradient-to-r from-indigo-200 to-blue-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl shadow-lg"
              >
                <Heart className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Votre vision de Dour</h3>
                <p className="text-sm text-gray-500">Étape 7/7</p>
              </div>
            </div>
            <Label htmlFor="message_libre" className="text-gray-700 font-medium">Un mot, une idée ou un symbole qui représente Dour selon vous</Label>
            <Textarea
              id="message_libre"
              value={formData.message_libre}
              onChange={(e) => setFormData({...formData, message_libre: e.target.value})}
              placeholder="Partagez votre vision de Dour en quelques mots..."
              className="mt-2 border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all rounded-xl min-h-[120px]"
            />
          </motion.div>

          {/* Bouton */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-7 text-xl font-bold rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-2xl hover:shadow-3xl transition-all relative overflow-hidden group"
            >
              <motion.span
                className="relative z-10 flex items-center justify-center gap-3"
                animate={loading ? { opacity: [1, 0.5, 1] } : {}}
                transition={{ duration: 1, repeat: loading ? Infinity : 0 }}
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      ⏳
                    </motion.div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    Je participe au logo de Senergie Dour 
                    <motion.span
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                    >
                      🎨
                    </motion.span>
                  </>
                )}
              </motion.span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-0 group-hover:opacity-30 transition-opacity"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </Button>
          </motion.div>

          <p className="text-center text-sm text-gray-500 italic">
            * Champs obligatoires
          </p>
        </motion.form>

        {/* Message final */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          className="mt-12 text-center p-8 bg-gradient-to-br from-blue-100/50 via-purple-100/50 to-yellow-100/50 backdrop-blur-sm rounded-3xl border-2 border-blue-300 shadow-xl"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Heart className="w-12 h-12 text-red-500 fill-red-500" />
          </motion.div>
          <p className="text-gray-800 italic text-lg leading-relaxed">
            Le logo de Senergie Dour sera créé à partir des avis des habitants et des commerçants.
            <br />
            <strong className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl">
              Un logo collectif, pour une énergie locale.
            </strong>
          </p>
        </motion.div>
      </div>
    </div>
  );
}