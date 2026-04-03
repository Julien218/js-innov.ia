import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff, Globe, FileText, X, Save, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import ReactMarkdown from 'react-markdown';

const emptyForm = { title: '', slug: '', content: '', meta_description: '', show_in_nav: false, nav_label: '', status: 'brouillon', cover_image: '' };

function slugify(str) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function PageManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null); // null = list, 'new' = new, id = edit
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState(false);

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['dynamic-pages'],
    queryFn: () => base44.entities.DynamicPage.list('-created_date'),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => editing === 'new'
      ? base44.entities.DynamicPage.create(data)
      : base44.entities.DynamicPage.update(editing, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dynamic-pages'] });
      setEditing(null);
      setForm(emptyForm);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.DynamicPage.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dynamic-pages'] })
  });

  const openNew = () => { setForm(emptyForm); setEditing('new'); setPreview(false); };
  const openEdit = (p) => { setForm({ title: p.title, slug: p.slug, content: p.content || '', meta_description: p.meta_description || '', show_in_nav: p.show_in_nav || false, nav_label: p.nav_label || '', status: p.status || 'brouillon', cover_image: p.cover_image || '' }); setEditing(p.id); setPreview(false); };

  const handleTitleChange = (val) => {
    setForm(f => ({ ...f, title: val, slug: editing === 'new' ? slugify(val) : f.slug, nav_label: f.nav_label || val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  // EDITOR VIEW
  if (editing !== null) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button onClick={() => { setEditing(null); setForm(emptyForm); }} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
              <h1 className="text-xl font-bold text-white">{editing === 'new' ? 'Nouvelle page' : 'Modifier la page'}</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${preview ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
              >
                <Eye className="w-4 h-4" />
                {preview ? 'Édition' : 'Aperçu'}
              </button>
              <Button
                onClick={handleSubmit}
                disabled={saveMutation.isPending}
                className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl"
              >
                <Save className="w-4 h-4" />
                {saveMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main editor */}
            <div className="lg:col-span-2 space-y-4">
              {!preview ? (
                <>
                  <div>
                    <Label className="text-gray-300 text-sm mb-1.5 block">Titre de la page *</Label>
                    <Input
                      required
                      value={form.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Ex: À propos de nous"
                      className="bg-white/5 border-gray-700 text-white text-lg"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 text-sm mb-1.5 block">Description courte (SEO)</Label>
                    <Input
                      value={form.meta_description}
                      onChange={(e) => setForm(f => ({ ...f, meta_description: e.target.value }))}
                      placeholder="Courte description de la page pour les moteurs de recherche"
                      className="bg-white/5 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 text-sm mb-1.5 block">Contenu (Markdown) *</Label>
                    <Textarea
                      required
                      value={form.content}
                      onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
                      placeholder={`# Titre principal\n\nVotre contenu ici...\n\n## Section 1\n\nTexte de la section...`}
                      className="bg-white/5 border-gray-700 text-white font-mono text-sm min-h-[400px] resize-y"
                    />
                    <p className="text-xs text-gray-500 mt-1">Supporte le Markdown : **gras**, *italique*, # titres, - listes, [lien](url)</p>
                  </div>
                </>
              ) : (
                <div className="p-6 rounded-2xl bg-white/5 border border-gray-700 min-h-[400px]">
                  <h1 className="text-4xl font-black text-white mb-4">{form.title || 'Titre'}</h1>
                  {form.meta_description && <p className="text-xl text-gray-400 mb-6">{form.meta_description}</p>}
                  <div className="h-1 w-20 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 mb-8" />
                  <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-300 prose-a:text-pink-400 prose-strong:text-white prose-ul:text-gray-300 prose-blockquote:border-pink-500 prose-code:text-pink-300">
                    <ReactMarkdown>{form.content || '*Aucun contenu*'}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar settings */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-gray-700 space-y-4">
                <h3 className="font-semibold text-white text-sm">Paramètres</h3>

                <div>
                  <Label className="text-gray-300 text-sm mb-1.5 block">Slug (URL)</Label>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1.5">
                    <span className="text-gray-600">/page/</span>
                    <Input
                      value={form.slug}
                      onChange={(e) => setForm(f => ({ ...f, slug: slugify(e.target.value) }))}
                      placeholder="mon-url"
                      className="bg-white/5 border-gray-700 text-white font-mono text-sm h-8"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300 text-sm mb-1.5 block">Image de couverture (URL)</Label>
                  <Input
                    value={form.cover_image}
                    onChange={(e) => setForm(f => ({ ...f, cover_image: e.target.value }))}
                    placeholder="https://..."
                    className="bg-white/5 border-gray-700 text-white text-sm"
                  />
                  {form.cover_image && (
                    <img src={form.cover_image} alt="" className="mt-2 rounded-xl w-full h-24 object-cover" />
                  )}
                </div>

                <div>
                  <Label className="text-gray-300 text-sm mb-1.5 block">Statut</Label>
                  <div className="flex gap-2">
                    {['brouillon', 'publiée'].map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, status: s }))}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${form.status === s ? (s === 'publiée' ? 'bg-green-600/30 text-green-400 border border-green-500/40' : 'bg-gray-600/30 text-gray-300 border border-gray-500/40') : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-300 text-sm">Afficher dans la nav</Label>
                    <Switch
                      checked={form.show_in_nav}
                      onCheckedChange={(v) => setForm(f => ({ ...f, show_in_nav: v }))}
                    />
                  </div>
                  {form.show_in_nav && (
                    <div className="mt-3">
                      <Input
                        value={form.nav_label}
                        onChange={(e) => setForm(f => ({ ...f, nav_label: e.target.value }))}
                        placeholder="Label du menu"
                        className="bg-white/5 border-gray-700 text-white text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>

              {editing !== 'new' && form.status === 'publiée' && (
                <a
                  href={`/#/page/${form.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-xl bg-green-600/10 border border-green-500/20 text-green-400 text-sm hover:bg-green-600/20 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Voir la page publiée
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LIST VIEW
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">Gestion des pages</h1>
            <p className="text-gray-400 text-sm">Créez et gérez vos pages personnalisées avec la mise en page du site</p>
          </div>
          <Button
            onClick={openNew}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl px-5"
          >
            <Plus className="w-4 h-4" />
            Nouvelle page
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : pages.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">Aucune page créée</p>
            <p className="text-gray-600 text-sm mb-6">Créez votre première page pour enrichir votre site</p>
            <Button onClick={openNew} className="bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl">
              <Plus className="w-4 h-4 mr-2" /> Créer une page
            </Button>
          </div>
        ) : (
          <div className="grid gap-3">
            {pages.map((page) => (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-gray-800 hover:border-gray-700 transition-all"
              >
                <div className={`w-2 h-10 rounded-full flex-shrink-0 ${page.status === 'publiée' ? 'bg-green-500' : 'bg-gray-600'}`} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white">{page.title}</span>
                    {page.show_in_nav && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center gap-1">
                        <Globe className="w-2.5 h-2.5" /> Nav
                      </span>
                    )}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full capitalize ${page.status === 'publiée' ? 'bg-green-600/20 text-green-400 border border-green-500/30' : 'bg-gray-700/50 text-gray-400 border border-gray-600/30'}`}>
                      {page.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">/page/{page.slug}</div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {page.status === 'publiée' && (
                    <a
                      href={`/#/page/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-green-400 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => openEdit(page)}
                    className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-pink-400 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { if (confirm('Supprimer cette page ?')) deleteMutation.mutate(page.id); }}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}