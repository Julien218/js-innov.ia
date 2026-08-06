import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Send, FileText, Filter } from 'lucide-react';

export default function QuoteDashboard() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedBudget, setSelectedBudget] = useState('all');
  const [selectedDelai, setSelectedDelai] = useState('all');
  const [expandedQuote, setExpandedQuote] = useState(null);
  const [notes, setNotes] = useState({});

  const queryClient = useQueryClient();

  // Charger tous les devis
  const { data: quotes = [], isLoading } = useQuery({
    queryKey: ['quotes'],
    queryFn: async () => {
      const quotesData = await base44.entities.Quote.list('-created_date');

      // Charger les infos clients et projets associés
      const enrichedQuotes = await Promise.all(
        quotesData.map(async (quote) => {
          const customer = await base44.entities.Customer.filter({ id: quote.customer_id });
          const project = await base44.entities.Project.filter({ id: quote.project_id });

          return {
            ...quote,
            customer: customer[0] || {},
            project: project[0] || {}
          };
        })
      );

      return enrichedQuotes;
    }
  });

  // Mutation pour mettre à jour le statut
  const updateStatusMutation = useMutation({
    mutationFn: async ({ quote_id, statut, notes_internes }) => {
      const response = await base44.functions.invoke('updateQuoteStatus', {
        quote_id,
        statut,
        notes_internes
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    }
  });

  const handleStatusChange = (quoteId, newStatus) => {
    updateStatusMutation.mutate({
      quote_id: quoteId,
      statut: newStatus,
      notes_internes: notes[quoteId]
    });
  };

  const filteredQuotes = quotes.filter(quote => {
    const statusMatch = selectedStatus === 'all' || quote.statut === selectedStatus;
    const budgetMatch = selectedBudget === 'all' || quote.project?.budget_indicatif === selectedBudget;
    const delaiMatch = selectedDelai === 'all' || quote.project?.delai === selectedDelai;
    return statusMatch && budgetMatch && delaiMatch;
  });

  const getStatusBadge = (statut) => {
    const config = {
      'À valider': { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock },
      'Validé': { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle },
      'Refusé': { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle },
      'Devis envoyé': { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Send }
    };

    const { color, icon: Icon } = config[statut] || config['À valider'];

    return (
      <Badge className={`${color} border flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {statut}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard Devis</h1>
          <p className="text-gray-400">Gérez les demandes de devis et leur validation</p>
        </div>

        {/* Filtres */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-purple-400" />
            <h3 className="text-white font-semibold">Filtres</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Statut</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="bg-black/30 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="À valider">À valider</SelectItem>
                  <SelectItem value="Validé">Validé</SelectItem>
                  <SelectItem value="Refusé">Refusé</SelectItem>
                  <SelectItem value="Devis envoyé">Devis envoyé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Budget</label>
              <Select value={selectedBudget} onValueChange={setSelectedBudget}>
                <SelectTrigger className="bg-black/30 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les budgets</SelectItem>
                  <SelectItem value="Moins de 1 000 €">Moins de 1 000 €</SelectItem>
                  <SelectItem value="1 000 – 3 000 €">1 000 – 3 000 €</SelectItem>
                  <SelectItem value="3 000 – 6 000 €">3 000 – 6 000 €</SelectItem>
                  <SelectItem value="Plus de 6 000 €">Plus de 6 000 €</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Délai</label>
              <Select value={selectedDelai} onValueChange={setSelectedDelai}>
                <SelectTrigger className="bg-black/30 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les délais</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Liste des devis */}
        <div className="space-y-4">
          {filteredQuotes.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              Aucun devis trouvé
            </div>
          ) : (
            filteredQuotes.map((quote) => (
              <motion.div
                key={quote.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-2xl p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">
                        {quote.customer?.prenom} {quote.customer?.nom}
                      </h3>
                      {getStatusBadge(quote.statut)}
                    </div>
                    <p className="text-gray-400 text-sm mb-1">{quote.customer?.email}</p>
                    {quote.customer?.entreprise && (
                      <p className="text-gray-500 text-sm">{quote.customer?.entreprise}</p>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                      {quote.fourchette_basse} € – {quote.fourchette_haute} €
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(quote.date_soumission).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <p className="text-gray-300">{quote.project?.type_projet}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Budget indicatif:</span>
                    <p className="text-gray-300">{quote.project?.budget_indicatif}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Délai:</span>
                    <p className="text-gray-300">{quote.project?.delai}</p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => setExpandedQuote(expandedQuote === quote.id ? null : quote.id)}
                  className="text-purple-400 hover:text-purple-300 mb-4"
                >
                  {expandedQuote === quote.id ? 'Masquer les détails' : 'Voir les détails'}
                </Button>

                {expandedQuote === quote.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="border-t border-gray-700 pt-4 space-y-4"
                  >
                    <div>
                      <h4 className="text-white font-semibold mb-2">Résumé de la demande</h4>
                      <p className="text-gray-400 text-sm">{quote.resume_demande}</p>
                    </div>

                    {quote.project?.objectifs?.length > 0 && (
                      <div>
                        <h4 className="text-white font-semibold mb-2">Objectifs</h4>
                        <div className="flex flex-wrap gap-2">
                          {quote.project.objectifs.map((obj, i) => (
                            <Badge key={i} className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                              {obj}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {quote.project?.fonctionnalites?.length > 0 && (
                      <div>
                        <h4 className="text-white font-semibold mb-2">Fonctionnalités</h4>
                        <div className="flex flex-wrap gap-2">
                          {quote.project.fonctionnalites.map((fonc, i) => (
                            <Badge key={i} className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                              {fonc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="text-white font-semibold mb-2">Notes internes</h4>
                      <Textarea
                        value={notes[quote.id] || quote.notes_internes || ''}
                        onChange={(e) => setNotes({ ...notes, [quote.id]: e.target.value })}
                        className="bg-black/30 border-gray-700 text-white min-h-[100px]"
                        placeholder="Ajouter des notes..."
                      />
                    </div>

                    {quote.statut === 'À valider' && (
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleStatusChange(quote.id, 'Validé')}
                          disabled={updateStatusMutation.isPending}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Valider le devis
                        </Button>
                        <Button
                          onClick={() => handleStatusChange(quote.id, 'Refusé')}
                          disabled={updateStatusMutation.isPending}
                          className="flex-1 bg-red-600 hover:bg-red-700"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Refuser
                        </Button>
                      </div>
                    )}

                    {quote.statut !== 'À valider' && (
                      <Button
                        onClick={() => handleStatusChange(quote.id, quote.statut)}
                        disabled={updateStatusMutation.isPending}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Enregistrer les notes
                      </Button>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}