import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, Eye, MessageSquare, Filter, TrendingUp, Clock, CheckCircle2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SectionHeader from '../components/shared/SectionHeader';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Badge } from '@/components/ui/badge';

export default function CRM() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await base44.auth.me();
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

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['formSubmissions'],
    queryFn: () => base44.entities.FormSubmission.list('-created_date'),
    enabled: !!user
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.FormSubmission.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formSubmissions'] });
    }
  });

  const filteredSubmissions = statusFilter === 'all' 
    ? submissions 
    : submissions.filter(s => s.status === statusFilter);

  const statusColors = {
    'Nouveau': 'bg-blue-600/20 text-blue-300 border-blue-500/30',
    'En cours': 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30',
    'Traité': 'bg-green-600/20 text-green-300 border-green-500/30',
    'Fermé': 'bg-gray-600/20 text-gray-300 border-gray-500/30'
  };

  const stats = [
    { 
      icon: TrendingUp, 
      label: 'Total Leads', 
      value: submissions.length,
      color: 'from-pink-600 to-purple-600'
    },
    { 
      icon: Clock, 
      label: 'En attente', 
      value: submissions.filter(s => s.status === 'Nouveau').length,
      color: 'from-blue-600 to-cyan-600'
    },
    { 
      icon: Zap, 
      label: 'En cours', 
      value: submissions.filter(s => s.status === 'En cours').length,
      color: 'from-yellow-600 to-orange-600'
    },
    { 
      icon: CheckCircle2, 
      label: 'Traités', 
      value: submissions.filter(s => s.status === 'Traité').length,
      color: 'from-green-600 to-emerald-600'
    }
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          icon={Users}
          title="CRM - Suivi des Soumissions"
          subtitle="Gérez vos leads et demandes clients"
        />

        {/* Stats Cards with Halo Effect */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <style jsx>{`
                @keyframes halo-pulse {
                  0%, 100% {
                    box-shadow: 0 0 20px rgba(255, 0, 110, 0.3),
                                0 0 40px rgba(131, 56, 236, 0.2),
                                0 0 60px rgba(255, 0, 110, 0.1);
                  }
                  50% {
                    box-shadow: 0 0 30px rgba(255, 0, 110, 0.5),
                                0 0 60px rgba(131, 56, 236, 0.3),
                                0 0 80px rgba(255, 0, 110, 0.2);
                  }
                }
                .halo-card {
                  animation: halo-pulse 3s ease-in-out infinite;
                }
              `}</style>
              <div className="halo-card relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 hover:border-pink-500/50 p-6 transition-all duration-300 hover:scale-105">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-20 mb-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center gap-4"
        >
          <Filter className="w-5 h-5 text-gray-400" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 bg-white/5 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="Nouveau">Nouveau</SelectItem>
              <SelectItem value="En cours">En cours</SelectItem>
              <SelectItem value="Traité">Traité</SelectItem>
              <SelectItem value="Fermé">Fermé</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Submissions List */}
            <div className="space-y-4">
              {filteredSubmissions.map((submission, index) => (
                <motion.div
                  key={submission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedSubmission(submission)}
                  className={`bg-gradient-to-br from-white/5 to-white/[0.02] border rounded-2xl p-6 cursor-pointer transition-all ${
                    selectedSubmission?.id === submission.id 
                      ? 'border-pink-500/50 shadow-lg shadow-pink-500/20' 
                      : 'border-purple-500/20 hover:border-purple-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{submission.form_name}</h3>
                      <p className="text-xs text-gray-500">
                        {new Date(submission.created_date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <Badge className={statusColors[submission.status]}>
                      {submission.status}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-sm">
                    {Object.entries(submission.data).slice(0, 2).map(([key, value]) => (
                      <div key={key} className="flex gap-2">
                        <span className="text-gray-500">{key}:</span>
                        <span className="text-gray-300">{String(value).substring(0, 50)}</span>
                      </div>
                    ))}
                  </div>

                  {submission.notes && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                      <MessageSquare className="w-3 h-3" />
                      <span>Note ajoutée</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Details Panel */}
            <div className="lg:sticky lg:top-24 h-fit">
              {selectedSubmission ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Eye className="w-6 h-6 text-pink-400" />
                    <h3 className="text-xl font-bold text-white">Détails</h3>
                  </div>

                  <div className="space-y-6">
                    {/* Status Selector */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Statut</label>
                      <Select
                        value={selectedSubmission.status}
                        onValueChange={(value) => {
                          updateMutation.mutate({
                            id: selectedSubmission.id,
                            data: { ...selectedSubmission, status: value }
                          });
                          setSelectedSubmission({ ...selectedSubmission, status: value });
                        }}
                      >
                        <SelectTrigger className="bg-white/5 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Nouveau">Nouveau</SelectItem>
                          <SelectItem value="En cours">En cours</SelectItem>
                          <SelectItem value="Traité">Traité</SelectItem>
                          <SelectItem value="Fermé">Fermé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Data */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-3">Informations soumises</h4>
                      <div className="space-y-3">
                        {Object.entries(selectedSubmission.data).map(([key, value]) => (
                          <div key={key} className="bg-white/5 rounded-lg p-3">
                            <div className="text-xs text-gray-500 mb-1">{key}</div>
                            <div className="text-white">{String(value)}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Notes internes</label>
                      <Textarea
                        value={selectedSubmission.notes || ''}
                        onChange={(e) => setSelectedSubmission({ ...selectedSubmission, notes: e.target.value })}
                        className="bg-white/5 border-gray-700 text-white h-32"
                        placeholder="Ajoutez des notes..."
                      />
                      <Button
                        onClick={() => updateMutation.mutate({
                          id: selectedSubmission.id,
                          data: { notes: selectedSubmission.notes }
                        })}
                        className="mt-3 bg-gradient-to-r from-pink-600 to-purple-600"
                      >
                        Enregistrer les notes
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-2xl p-12 text-center">
                  <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Sélectionnez une soumission pour voir les détails</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}