import { useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Send, CheckCircle2, AlertCircle, X, ImageOff, Loader2 } from 'lucide-react';
import { platform } from '@/api/platformClient';

const GOLD = '#D4AF37';

export default function InstagramCarouselPublisher({ innovations, onClose }) {
  const [selected, setSelected] = useState(
    innovations.filter(i => i.image_url).slice(0, 6).map(i => i.id)
  );
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const withImages = innovations.filter(i => i.image_url);
  const selectedInnovations = withImages.filter(i => selected.includes(i.id));

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : prev.length < 10 ? [...prev, id] : prev
    );
  };

  const handlePublish = async () => {
    if (selectedInnovations.length < 2) return;
    setLoading(true);
    setResult(null);
    const res = await platform.functions.invoke('publishInstagramCarousel', {
      innovations: selectedInnovations,
      caption: caption.trim() || null,
    });
    setResult(res.data);
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
    >
      <div className="w-full max-w-2xl rounded-3xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #12121e, #1a1a2e)', border: '1px solid rgba(212,175,55,0.2)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: 'rgba(212,175,55,0.12)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #E1306C, #833AB4, #F77737)' }}>
              <Instagram className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg">Publier un carrousel</h2>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Instagram Business · {selectedInnovations.length}/10 slides</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl transition-all"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'white'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {result?.success ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4" style={{ color: '#4ade80' }} />
              <h3 className="text-xl font-bold text-white mb-2">Carrousel publié ! 🎉</h3>
              <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>{result.message}</p>
              <button onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-black"
                style={{ background: `linear-gradient(135deg, ${GOLD}, #F5CF41)` }}>
                Fermer
              </button>
            </div>
          ) : result?.error ? (
            <div className="text-center py-6">
              <AlertCircle className="w-12 h-12 mx-auto mb-3" style={{ color: '#f87171' }} />
              <p className="text-sm font-semibold text-red-400 mb-4">{result.error}</p>
              <button onClick={() => setResult(null)}
                className="px-5 py-2 rounded-xl text-sm font-semibold"
                style={{ background: 'rgba(212,175,55,0.1)', color: GOLD, border: '1px solid rgba(212,175,55,0.25)' }}>
                Réessayer
              </button>
            </div>
          ) : (
            <>
              {/* No images warning */}
              {withImages.length === 0 && (
                <div className="flex items-center gap-3 p-4 rounded-xl mb-4"
                  style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
                  <ImageOff className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <p className="text-xs text-yellow-300">Aucune innovation avec image disponible. Ajoutez des images à vos innovations d'abord.</p>
                </div>
              )}

              {/* Selection grid */}
              <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: 'rgba(212,175,55,0.7)' }}>
                Sélectionner les slides (min. 2, max. 10)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                {withImages.map(innov => {
                  const isSelected = selected.includes(innov.id);
                  return (
                    <button key={innov.id} onClick={() => toggle(innov.id)}
                      className="relative rounded-2xl overflow-hidden text-left transition-all"
                      style={{
                        border: isSelected ? `2px solid ${GOLD}` : '2px solid rgba(255,255,255,0.06)',
                        opacity: !isSelected && selected.length >= 10 ? 0.4 : 1,
                      }}>
                      <img src={innov.image_url} alt={innov.title}
                        className="w-full h-24 object-cover" />
                      <div className="absolute inset-0" style={{ background: isSelected ? 'rgba(212,175,55,0.15)' : 'rgba(0,0,0,0.4)' }} />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black text-black"
                          style={{ background: GOLD }}>
                          {selected.indexOf(innov.id) + 1}
                        </div>
                      )}
                      <p className="absolute bottom-0 left-0 right-0 px-2 py-1.5 text-[10px] font-semibold text-white truncate"
                        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}>
                        {innov.title}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Caption */}
              <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'rgba(212,175,55,0.7)' }}>
                Légende (optionnelle)
              </p>
              <textarea
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="Laissez vide pour une légende générée automatiquement avec les titres sélectionnés..."
                rows={4}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none mb-5"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.15)', color: 'white' }}
              />

              {/* Preview count */}
              {selectedInnovations.length >= 2 && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-5 text-xs"
                  style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
                  <Instagram className="w-3.5 h-3.5" style={{ color: GOLD }} />
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>
                    Carrousel de <strong style={{ color: GOLD }}>{selectedInnovations.length} slides</strong> — {selectedInnovations.map(i => i.title).join(', ')}
                  </span>
                </div>
              )}

              {/* Publish button */}
              <button
                onClick={handlePublish}
                disabled={loading || selectedInnovations.length < 2}
                className="w-full py-3.5 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                style={{
                  background: selectedInnovations.length >= 2
                    ? 'linear-gradient(135deg, #E1306C, #833AB4)'
                    : 'rgba(255,255,255,0.08)',
                  color: 'white',
                  boxShadow: selectedInnovations.length >= 2 ? '0 0 30px rgba(225,48,108,0.3)' : 'none'
                }}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {loading ? 'Publication en cours...' : `Publier le carrousel (${selectedInnovations.length} slides)`}
              </button>
              {selectedInnovations.length < 2 && (
                <p className="text-xs text-center mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Sélectionnez au moins 2 innovations avec image
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}