import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export default function MusicProductForm({ product, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(product || {
    title: '',
    description: '',
    style: 'Ambiance',
    duration: '',
    bpm: '',
    preview_url: '',
    cover_image: '',
    price: '',
    license_type: 'Licence Boutique',
    features: [],
    ideal_for: [],
    popular: false
  });

  const [newFeature, setNewFeature] = useState('');
  const [newIdealFor, setNewIdealFor] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseFloat(formData.price),
      bpm: formData.bpm ? parseInt(formData.bpm) : undefined
    });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const addIdealFor = () => {
    if (newIdealFor.trim()) {
      setFormData({
        ...formData,
        ideal_for: [...(formData.ideal_for || []), newIdealFor.trim()]
      });
      setNewIdealFor('');
    }
  };

  const removeIdealFor = (index) => {
    setFormData({
      ...formData,
      ideal_for: formData.ideal_for.filter((_, i) => i !== index)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Titre *</label>
          <Input
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="bg-white/5 border-gray-700 text-white"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Prix (€) *</label>
          <Input
            required
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="bg-white/5 border-gray-700 text-white"
          />
        </div>

        {/* Style */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Style *</label>
          <Select
            value={formData.style}
            onValueChange={(value) => setFormData({ ...formData, style: value })}
          >
            <SelectTrigger className="bg-white/5 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Lounge">Lounge</SelectItem>
              <SelectItem value="Jazz">Jazz</SelectItem>
              <SelectItem value="Pop">Pop</SelectItem>
              <SelectItem value="Électronique">Électronique</SelectItem>
              <SelectItem value="Classique">Classique</SelectItem>
              <SelectItem value="Ambiance">Ambiance</SelectItem>
              <SelectItem value="Énergique">Énergique</SelectItem>
              <SelectItem value="Relaxante">Relaxante</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* License Type */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Type de licence *</label>
          <Select
            value={formData.license_type}
            onValueChange={(value) => setFormData({ ...formData, license_type: value })}
          >
            <SelectTrigger className="bg-white/5 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Licence Boutique">Licence Boutique</SelectItem>
              <SelectItem value="Licence Restaurant">Licence Restaurant</SelectItem>
              <SelectItem value="Licence Multi-sites">Licence Multi-sites</SelectItem>
              <SelectItem value="Licence Premium">Licence Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Durée (ex: 3:45)</label>
          <Input
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            className="bg-white/5 border-gray-700 text-white"
            placeholder="3:45"
          />
        </div>

        {/* BPM */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">BPM</label>
          <Input
            type="number"
            value={formData.bpm}
            onChange={(e) => setFormData({ ...formData, bpm: e.target.value })}
            className="bg-white/5 border-gray-700 text-white"
            placeholder="120"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Description *</label>
        <Textarea
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="bg-white/5 border-gray-700 text-white h-24"
        />
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">URL de l'image de couverture</label>
        <Input
          value={formData.cover_image}
          onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
          className="bg-white/5 border-gray-700 text-white"
          placeholder="https://..."
        />
      </div>

      {/* Preview URL */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">URL de prévisualisation audio</label>
        <Input
          value={formData.preview_url}
          onChange={(e) => setFormData({ ...formData, preview_url: e.target.value })}
          className="bg-white/5 border-gray-700 text-white"
          placeholder="https://..."
        />
      </div>

      {/* Features */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Avantages</label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
            className="bg-white/5 border-gray-700 text-white"
            placeholder="Ajouter un avantage..."
          />
          <Button type="button" onClick={addFeature} variant="outline">
            Ajouter
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.features?.map((feature, i) => (
            <Badge key={i} className="bg-purple-600/20 text-purple-300 border-purple-500/30">
              {feature}
              <button
                type="button"
                onClick={() => removeFeature(i)}
                className="ml-2 hover:text-red-400"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Ideal For */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Idéal pour</label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newIdealFor}
            onChange={(e) => setNewIdealFor(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIdealFor())}
            className="bg-white/5 border-gray-700 text-white"
            placeholder="Ex: Boutique de vêtements..."
          />
          <Button type="button" onClick={addIdealFor} variant="outline">
            Ajouter
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.ideal_for?.map((item, i) => (
            <Badge key={i} className="bg-pink-600/20 text-pink-300 border-pink-500/30">
              {item}
              <button
                type="button"
                onClick={() => removeIdealFor(i)}
                className="ml-2 hover:text-red-400"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Popular */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="popular"
          checked={formData.popular}
          onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
          className="w-4 h-4 rounded border-gray-700 bg-white/5"
        />
        <label htmlFor="popular" className="text-sm text-gray-400">
          Marquer comme populaire
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button type="button" onClick={onCancel} variant="outline" className="border-gray-700">
          Annuler
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-pink-600 to-purple-600">
          {product ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
}