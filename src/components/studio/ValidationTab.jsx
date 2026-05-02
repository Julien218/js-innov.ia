import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Check, X, Clock, Eye, ChevronDown, ChevronUp, Calendar } from 'lucide-react';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';

const STATUS_CONFIG = {
  draft:     { label: 'Brouillon',   color: 'rgba(255,255,255,0.4)', bg: 'rgba(255,255,255,0.05)' },
  to_review: { label: 'À valider',   color: '#F59E0B',               bg: 'rgba(245,158,11,0.1)'  },
  approved:  { label: 'Approuvé',    color: '#22c55e',               bg: 'rgba(34,197,94,0.1)'   },
  rejected:  { label: 'Refusé',      color: '#ef4444',               bg: 'rgba(239,68,68,0.1)'   },
  scheduled: { label: 'Planifié',    color: CYAN,                    bg: 'rgba(6,182,212,0.1)'   },
  published: { label: 'Publié',      color: GOLD,                    bg: 'rgba(212,175,55,0.1)'  },
};

const WORKFLOW = ['draft', 'to_review', 'approved', 'scheduled', 'published'];

export default function ValidationTab() {
  const [filterStatus, setFilterStatus] = useState('to_review');
  const [expanded, setExpanded] = useState(null);
  const qc = useQueryClient();

  const { data: contents = [], isLoading } = useQuery({
    queryKey: ['generated-content'],
    queryFn: () => base44.entities.GeneratedContent.list('-created_date', 100),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.GeneratedContent.update(id, data),
    onSuccess: () => qc.invalidateQueries(['generated-content']),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.GeneratedContent.delete(id),
    onSuccess: () => qc.invalidateQueries(['generated-content']),
  });

  const filtered = filterStatus === 'all' ? contents : contents.filter(c => c.status === filterStatus);

  const canAdvance = (status) => {
    const idx = WORKFLOW.indexOf(status);
    return idx < WORKFLOW.length - 1 ? WORKFLOW[idx + 1] : null;
  };

  const canSchedule = (content) => content.status === 'approved';

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-white mb-1">Contenus à valider</h2>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>Workflow : draft → to_review → approved → scheduled → published</p>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2">
        {[['all', 'Tous'], ...Object.entries(STATUS_CONFIG)].map(([key, val]) => {
          const isObj = typeof val === 'object';
          const label = isObj ? val.label : 'Tous';
          const count = key === 'all' ? contents.length : contents.filter(c => c.status === key).length;
          return (
            <button key={key} onClick={() => setFilterStatus(key)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5"
              style={{
                background: filterStatus === key ? (isObj ? val.bg : 'rgba(212,175,55,0.1)') : 'rgba(255,255,255,0.03)',
                border: `1px solid ${filterStatus === key ? (isObj ? val.color : GOLD) + '55' : 'rgba(255,255,255,0.07)'}`,
                color: filterStatus === key ? (isObj ? val.color : GOLD) : 'rgba(255,255,255,0.4)',
              }}>
              {label}
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black" style={{ background: 'rgba(255,255,255,0.08)' }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Content list */}
      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Aucun contenu dans cette catégorie</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(content => {
            const sc = STATUS_CONFIG[content.status] || STATUS_CONFIG.draft;
            const next = canAdvance(content.status);
            return (
              <motion.div key={content.id} layout className="rounded-2xl overflow-hidden"
                style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid ${sc.color}25` }}>
                <div className="p-4 flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                      <span className="text-xs font-bold" style={{ color: 'rgba(212,175,55,0.6)' }}>{content.nicheName}</span>
                    </div>
                    <p className="text-sm font-bold text-white truncate">{content.hook}</p>
                    {content.cta && <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>CTA: {content.cta}</p>}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {/* Approve */}
                    {content.status === 'to_review' && (
                      <>
                        <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                          onClick={() => updateMutation.mutate({ id: content.id, data: { status: 'approved' } })}
                          className="p-2 rounded-lg" style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>
                          <Check className="w-4 h-4" />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                          onClick={() => updateMutation.mutate({ id: content.id, data: { status: 'rejected' } })}
                          className="p-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>
                          <X className="w-4 h-4" />
                        </motion.button>
                      </>
                    )}
                    {/* Schedule */}
                    {canSchedule(content) && (
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                        onClick={() => updateMutation.mutate({ id: content.id, data: { status: 'scheduled', scheduledDate: new Date().toISOString() } })}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold"
                        style={{ background: 'rgba(6,182,212,0.12)', color: CYAN }}>
                        <Calendar className="w-3.5 h-3.5" /> Planifier
                      </motion.button>
                    )}
                    {/* Publish */}
                    {content.status === 'scheduled' && (
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                        onClick={() => updateMutation.mutate({ id: content.id, data: { status: 'published', publishedDate: new Date().toISOString() } })}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-black"
                        style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
                        Publier
                      </motion.button>
                    )}
                    {/* Expand */}
                    <button onClick={() => setExpanded(expanded === content.id ? null : content.id)}
                      className="p-1.5 rounded-lg" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {expanded === content.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <button onClick={() => deleteMutation.mutate(content.id)} className="p-1.5 rounded-lg" style={{ color: 'rgba(239,68,68,0.4)' }}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {expanded === content.id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="border-t px-4 pb-4 pt-3 space-y-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      {content.script && (
                        <div>
                          <div className="text-xs font-bold mb-1" style={{ color: PURPLE }}>Script</div>
                          <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'rgba(255,255,255,0.6)' }}>{content.script}</p>
                        </div>
                      )}
                      {content.visualSuggestions && (
                        <div>
                          <div className="text-xs font-bold mb-1" style={{ color: CYAN }}>Suggestions visuelles</div>
                          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{content.visualSuggestions}</p>
                        </div>
                      )}
                      {content.hashtags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {content.hashtags.map((h, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.08)', color: GOLD }}>#{h}</span>
                          ))}
                        </div>
                      )}
                      {/* Performance input for published */}
                      {content.status === 'published' && (
                        <div className="grid grid-cols-4 gap-2 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                          {[
                            { key: 'views', label: 'Vues', icon: Eye },
                            { key: 'likes', label: 'Likes' },
                            { key: 'comments', label: 'Comm.' },
                            { key: 'shares', label: 'Partages' },
                          ].map(f => (
                            <div key={f.key}>
                              <div className="text-[10px] mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{f.label}</div>
                              <input type="number" min="0" defaultValue={content[f.key] || 0}
                                onBlur={e => updateMutation.mutate({ id: content.id, data: { [f.key]: parseInt(e.target.value) || 0 } })}
                                className="w-full px-2 py-1.5 rounded-lg text-sm text-white outline-none text-center"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}