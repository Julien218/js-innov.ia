import { useState, useEffect } from 'react';
import { platform } from '@/api/platformClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FileText, Plus, Edit, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SectionHeader from '../components/shared/SectionHeader';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function FormBuilder() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingForm, setEditingForm] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    fields: [],
    branding: {
      primaryColor: '#ff006e',
      logo: ''
    },
    notification_email: '',
    success_message: 'Merci ! Votre demande a été envoyée avec succès.',
    active: true
  });

  const [newField, setNewField] = useState({
    label: '',
    type: 'text',
    required: false,
    placeholder: ''
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await platform.auth.me();
        if (!currentUser || currentUser.role !== 'admin') {
          navigate(createPageUrl('Home'));
          return;
        }
        setUser(currentUser);
      } catch {
        navigate(createPageUrl('Home'));
      }
    };
    checkAuth();
  }, [navigate]);

  const { data: forms = [], isLoading } = useQuery({
    queryKey: ['customForms'],
    queryFn: () => platform.entities.CustomForm.list(),
    enabled: !!user
  });

  const createMutation = useMutation({
    mutationFn: (data) => platform.entities.CustomForm.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customForms'] });
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => platform.entities.CustomForm.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customForms'] });
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => platform.entities.CustomForm.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customForms'] });
    }
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingForm(null);
    setFormData({
      name: '',
      description: '',
      slug: '',
      fields: [],
      branding: { primaryColor: '#ff006e', logo: '' },
      notification_email: '',
      success_message: 'Merci ! Votre demande a été envoyée avec succès.',
      active: true
    });
  };

  const addField = () => {
    if (newField.label) {
      setFormData({
        ...formData,
        fields: [...formData.fields, { ...newField, id: Date.now() }]
      });
      setNewField({ label: '', type: 'text', required: false, placeholder: '' });
    }
  };

  const removeField = (id) => {
    setFormData({
      ...formData,
      fields: formData.fields.filter(f => f.id !== id)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingForm) {
      updateMutation.mutate({ id: editingForm.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (form) => {
    setEditingForm(form);
    setFormData(form);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Supprimer ce formulaire ?')) {
      deleteMutation.mutate(id);
    }
  };

  const copyFormUrl = (slug) => {
    const url = `${window.location.origin}/#${createPageUrl('PublicForm')}?slug=${slug}`;
    navigator.clipboard.writeText(url);
    alert('Lien copié !');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          icon={FileText}
          title="Créateur de Formulaires"
          subtitle="Formulaires personnalisés avec suivi CRM"
        />

        {!showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex justify-end"
          >
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-pink-600 to-purple-600"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouveau formulaire
            </Button>
          </motion.div>
        )}

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              {editingForm ? 'Modifier' : 'Créer'} un formulaire
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Nom du formulaire *</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white/5 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">URL unique (slug) *</label>
                  <Input
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="bg-white/5 border-gray-700 text-white"
                    placeholder="mon-formulaire"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-white/5 border-gray-700 text-white h-20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email de notification</label>
                  <Input
                    type="email"
                    value={formData.notification_email}
                    onChange={(e) => setFormData({ ...formData, notification_email: e.target.value })}
                    className="bg-white/5 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Couleur principale</label>
                  <Input
                    type="color"
                    value={formData.branding.primaryColor}
                    onChange={(e) => setFormData({ ...formData, branding: { ...formData.branding, primaryColor: e.target.value } })}
                    className="bg-white/5 border-gray-700 h-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Message de succès</label>
                <Input
                  value={formData.success_message}
                  onChange={(e) => setFormData({ ...formData, success_message: e.target.value })}
                  className="bg-white/5 border-gray-700 text-white"
                />
              </div>

              {/* Field Builder */}
              <div className="border-t border-gray-700 pt-6">
                <h4 className="text-lg font-semibold text-white mb-4">Champs du formulaire</h4>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                  <Input
                    placeholder="Label du champ"
                    value={newField.label}
                    onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                    className="bg-white/5 border-gray-700 text-white"
                  />
                  <Select value={newField.type} onValueChange={(value) => setNewField({ ...newField, type: value })}>
                    <SelectTrigger className="bg-white/5 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texte</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Téléphone</SelectItem>
                      <SelectItem value="textarea">Texte long</SelectItem>
                      <SelectItem value="number">Nombre</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Placeholder"
                    value={newField.placeholder}
                    onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                    className="bg-white/5 border-gray-700 text-white"
                  />
                  <div className="flex gap-2">
                    <label className="flex items-center gap-2 text-sm text-gray-400">
                      <input
                        type="checkbox"
                        checked={newField.required}
                        onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                        className="rounded"
                      />
                      Requis
                    </label>
                    <Button type="button" onClick={addField} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {formData.fields.map((field) => (
                    <div key={field.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <span className="text-white flex-1">{field.label}</span>
                      <span className="text-xs text-gray-500">{field.type}</span>
                      {field.required && <span className="text-xs text-pink-400">Requis</span>}
                      <Button
                        type="button"
                        onClick={() => removeField(field.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button type="button" onClick={resetForm} variant="outline" className="border-gray-700">
                  Annuler
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-pink-600 to-purple-600">
                  {editingForm ? 'Mettre à jour' : 'Créer'}
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Forms List */}
        <div className="grid grid-cols-1 gap-4">
          {forms.map((form, index) => (
            <motion.div
              key={form.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{form.name}</h3>
                  <p className="text-gray-400 text-sm mb-3">{form.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>🔗 /{form.slug}</span>
                    <span>📋 {form.fields.length} champs</span>
                    <span className={form.active ? 'text-green-400' : 'text-red-400'}>
                      {form.active ? '✓ Actif' : '✗ Inactif'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => copyFormUrl(form.slug)} size="sm" variant="outline" className="border-gray-700">
                    <Copy className="w-4 h-4 mr-2" />
                    Copier lien
                  </Button>
                  <Button onClick={() => handleEdit(form)} size="sm" variant="outline" className="border-gray-700">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button onClick={() => handleDelete(form.id)} size="sm" variant="outline" className="border-red-900 text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}