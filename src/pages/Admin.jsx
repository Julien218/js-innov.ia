import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Plus, Edit, Trash2, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeader from '../components/shared/SectionHeader';
import MusicProductForm from '../components/admin/MusicProductForm';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function Admin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Check admin access
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await base44.auth.me();
        if (!currentUser || currentUser.role !== 'admin') {
          navigate(createPageUrl('Home'));
          return;
        }
        setUser(currentUser);
      } catch (error) {
        navigate(createPageUrl('Home'));
      }
    };
    checkAuth();
  }, [navigate]);

  // Fetch products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['musicProducts'],
    queryFn: () => base44.entities.MusicProduct.list(),
    enabled: !!user
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.MusicProduct.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['musicProducts'] });
      setShowForm(false);
      setEditingProduct(null);
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.MusicProduct.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['musicProducts'] });
      setShowForm(false);
      setEditingProduct(null);
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.MusicProduct.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['musicProducts'] });
    }
  });

  const handleSubmit = (data) => {
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          icon={Shield}
          title="Administration"
          subtitle="Gestion des produits musicaux"
        />

        {/* Add Button */}
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
              Ajouter un produit
            </Button>
          </motion.div>
        )}

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">
                {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
              </h3>
              <MusicProductForm
                product={editingProduct}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products List */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 mt-4">Chargement...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {products.length === 0 ? (
              <div className="text-center py-20">
                <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Aucun produit pour le moment</p>
              </div>
            ) : (
              products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-2xl p-6"
                >
                  <div className="flex gap-6">
                    {/* Image */}
                    <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-pink-600/20 to-purple-600/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {product.cover_image ? (
                        <img src={product.cover_image} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <Music className="w-10 h-10 text-pink-400/50" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{product.title}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-400">
                            <span>{product.style}</span>
                            <span>•</span>
                            <span>{product.license_type}</span>
                            {product.popular && (
                              <>
                                <span>•</span>
                                <span className="text-amber-400">⭐ Populaire</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">{product.price}€</div>
                        </div>
                      </div>

                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>

                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                        {product.duration && <span>⏱ {product.duration}</span>}
                        {product.bpm && <span>🎵 {product.bpm} BPM</span>}
                        {product.features?.length > 0 && <span>✓ {product.features.length} avantages</span>}
                        {product.ideal_for?.length > 0 && <span>🎯 {product.ideal_for.length} usages</span>}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(product)}
                          size="sm"
                          variant="outline"
                          className="border-gray-700"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier
                        </Button>
                        <Button
                          onClick={() => handleDelete(product.id)}
                          size="sm"
                          variant="outline"
                          className="border-red-900 text-red-400 hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}