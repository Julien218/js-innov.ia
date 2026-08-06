import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Ticket, QrCode, Users, Plus, Calendar, MapPin, Check, Sparkles
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const AMBER = '#F59E0B';
const GREEN = '#22c55e';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';

function EventCard({ event }) {
  const [registering, setRegistering] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const [success, setSuccess] = useState(false);
  const qc = useQueryClient();

  const sold = event.tickets_sold || 0;
  const cap = event.capacity || 100;
  const pct = Math.min(100, Math.round((sold / cap) * 100));
  const isFull = sold >= cap;
  const isFree = !event.price || event.price === 0;

  const handleRegister = async () => {
    if (!form.name || !form.email) return;
    const qr = `${event.id}-${form.email}-${Date.now()}`;
    await base44.entities.EventTicket.create({
      event_id: event.id,
      event_title: event.title,
      attendee_name: form.name,
      attendee_email: form.email,
      qr_code: qr,
      amount_paid: event.price || 0,
    });
    await base44.entities.Event.update(event.id, { tickets_sold: sold + 1 });
    // Send confirmation email
    await base44.integrations.Core.SendEmail({
      to: form.email,
      subject: `🎟 Votre ticket pour "${event.title}"`,
      body: `Bonjour ${form.name},\n\nVotre inscription est confirmée !\n\nÉvénement : ${event.title}\nDate : ${new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\nLieu : ${event.location || 'À préciser'}\n\nVotre code QR de ticket : ${qr}\n\nPrésentez ce code à l'entrée.\n\nÀ bientôt,\nL'équipe JS-Innov.IA`,
    }).catch(() => {});
    setSuccess(true);
    qc.invalidateQueries({ queryKey: ['events'] });
  };

  return (
    <motion.div whileHover={{ y: -5 }} className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid rgba(245,158,11,0.2)` }}>
      {/* Cover */}
      {event.cover_image ? (
        <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${event.cover_image})` }} />
      ) : (
        <div className="h-40 flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${AMBER}15, ${PURPLE}15)` }}>
          <Ticket className="w-10 h-10" style={{ color: AMBER, opacity: 0.5 }} />
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-black text-white text-base flex-1 pr-3">{event.title}</h3>
          <div className="px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0"
            style={{ background: isFree ? 'rgba(34,197,94,0.15)' : 'rgba(212,175,55,0.12)', color: isFree ? GREEN : GOLD }}>
            {isFree ? 'Gratuit' : `${event.price}€`}
          </div>
        </div>

        {event.description && (
          <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.42)' }}>{event.description}</p>
        )}

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
            <Calendar className="w-3.5 h-3.5" />
            {new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
          {event.location && (
            <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
              <MapPin className="w-3.5 h-3.5" /> {event.location}
            </div>
          )}
          <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
            <Users className="w-3.5 h-3.5" /> {sold} / {cap} participants
          </div>
        </div>

        {/* Capacity bar */}
        <div className="mb-4">
          <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: `${pct}%`, background: pct > 80 ? '#ef4444' : pct > 60 ? AMBER : GREEN }} />
          </div>
          <div className="text-xs mt-1" style={{ color: isFull ? '#ef4444' : 'rgba(255,255,255,0.3)' }}>
            {isFull ? '🔴 Complet' : `${cap - sold} places restantes`}
          </div>
        </div>

        {/* Registration */}
        {!isFull && event.status === 'published' && (
          <>
            {!registering && !success && (
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setRegistering(true)}
                className="w-full py-3 rounded-xl font-black text-black text-sm"
                style={{ background: `linear-gradient(135deg, ${AMBER}, #FCD34D)` }}>
                <Ticket className="w-4 h-4 inline mr-2" />
                Réserver ma place
              </motion.button>
            )}

            <AnimatePresence>
              {registering && !success && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden space-y-2">
                  <input placeholder="Votre nom complet" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                  <input placeholder="Votre email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                  <div className="flex gap-2">
                    <button onClick={() => setRegistering(false)} className="px-4 py-2.5 rounded-xl text-xs"
                      style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>Annuler</button>
                    <motion.button whileHover={{ scale: 1.02 }} onClick={handleRegister}
                      disabled={!form.name || !form.email}
                      className="flex-1 py-2.5 rounded-xl font-black text-black text-xs disabled:opacity-40"
                      style={{ background: `linear-gradient(135deg, ${AMBER}, #FCD34D)` }}>
                      Confirmer →
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {success && (
              <div className="text-center py-3 rounded-xl" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <Check className="w-5 h-5 mx-auto mb-1" style={{ color: GREEN }} />
                <p className="text-xs font-bold" style={{ color: GREEN }}>Inscription confirmée ! Vérifiez vos emails.</p>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

export default function SaasEvents() {
  const [createForm, setCreateForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', location: '', price: 0, capacity: 50 });
  const [submitted, setSubmitted] = useState(false);
  const qc = useQueryClient();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.filter({ status: 'published' }, '-date', 20),
  });

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.date) return;
    // Submit as draft to admin
    await base44.entities.Event.create({ ...newEvent, status: 'draft' });
    await base44.integrations.Core.SendEmail({
      to: 'contact@js-innov.ia',
      subject: `🎟 Nouvelle demande d'événement — ${newEvent.title}`,
      body: `Titre : ${newEvent.title}\nDate : ${newEvent.date}\nLieu : ${newEvent.location}\nCapacité : ${newEvent.capacity}\nPrix : ${newEvent.price}€\nDescription : ${newEvent.description}`,
    }).catch(() => {});
    setSubmitted(true);
    qc.invalidateQueries({ queryKey: ['events'] });
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    color: 'white',
    padding: '10px 14px',
    fontSize: 13,
    width: '100%',
    outline: 'none',
  };

  return (
    <div className="min-h-screen px-4 pt-10 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(245,158,11,0.1)', border: `1px solid rgba(245,158,11,0.25)`, color: AMBER }}>
            <Ticket className="w-3 h-3" /> Module Événements
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Créez et gérez vos{' '}
            <span style={{ background: `linear-gradient(135deg, ${AMBER}, #FCD34D)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              événements
            </span>
          </h1>
          <p className="text-base max-w-2xl mx-auto mb-8" style={{ color: 'rgba(255,255,255,0.42)' }}>
            Vente de tickets en ligne, QR codes uniques, scan à l'entrée et gestion des participants en temps réel.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              onClick={() => setCreateForm(true)}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-black text-black text-sm"
              style={{ background: `linear-gradient(135deg, ${AMBER}, #FCD34D)` }}>
              <Plus className="w-4 h-4" /> Créer mon événement
            </motion.button>
          </div>
        </div>

        {/* Features strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-14">
          {[
            { icon: Ticket, label: 'Vente de tickets', color: AMBER },
            { icon: QrCode, label: 'QR codes uniques', color: PURPLE },
            { icon: Users, label: 'Gestion participants', color: CYAN },
            { icon: Check, label: 'Scan à l\'entrée', color: GREEN },
          ].map(f => (
            <div key={f.label} className="p-4 rounded-xl text-center"
              style={{ background: 'rgba(10,8,22,0.8)', border: `1px solid ${f.color}18` }}>
              <f.icon className="w-6 h-6 mx-auto mb-2" style={{ color: f.color }} />
              <div className="text-xs font-bold text-white">{f.label}</div>
            </div>
          ))}
        </div>

        {/* Create event form */}
        <AnimatePresence>
          {createForm && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="p-8 rounded-3xl mb-10 relative overflow-hidden"
              style={{ background: 'rgba(10,8,22,0.95)', border: `1px solid rgba(245,158,11,0.25)` }}>
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${AMBER}, transparent)` }} />
              {!submitted ? (
                <>
                  <h2 className="font-black text-white text-xl mb-6">Créer un événement</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <input placeholder="Titre de l'événement *" value={newEvent.title}
                      onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))} style={inputStyle} />
                    <input placeholder="Lieu (ville, adresse…)" value={newEvent.location}
                      onChange={e => setNewEvent(p => ({ ...p, location: e.target.value }))} style={inputStyle} />
                    <input type="datetime-local" value={newEvent.date}
                      onChange={e => setNewEvent(p => ({ ...p, date: e.target.value }))} style={inputStyle} />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" placeholder="Capacité" value={newEvent.capacity}
                        onChange={e => setNewEvent(p => ({ ...p, capacity: parseInt(e.target.value) }))} style={inputStyle} />
                      <input type="number" placeholder="Prix (€)" value={newEvent.price}
                        onChange={e => setNewEvent(p => ({ ...p, price: parseFloat(e.target.value) }))} style={inputStyle} />
                    </div>
                  </div>
                  <textarea placeholder="Description de l'événement" value={newEvent.description} rows={3}
                    onChange={e => setNewEvent(p => ({ ...p, description: e.target.value }))}
                    style={{ ...inputStyle, resize: 'none', marginBottom: 16 }} />
                  <div className="flex gap-3">
                    <button onClick={() => setCreateForm(false)} className="px-5 py-3 rounded-xl text-sm"
                      style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>Annuler</button>
                    <motion.button whileHover={{ scale: 1.02 }} onClick={handleCreateEvent}
                      disabled={!newEvent.title || !newEvent.date}
                      className="flex-1 py-3 rounded-xl font-black text-black text-sm flex items-center justify-center gap-2 disabled:opacity-40"
                      style={{ background: `linear-gradient(135deg, ${AMBER}, #FCD34D)` }}>
                      <Sparkles className="w-4 h-4" /> Soumettre mon événement
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-3xl mb-3">✅</div>
                  <h3 className="text-xl font-black text-white mb-2">Demande envoyée !</h3>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    Julien valide votre événement et le publie sous 24h. Vous serez notifié par email.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Events grid */}
        <div>
          <h2 className="font-black text-white text-xl mb-6">Événements à venir</h2>
          {isLoading ? (
            <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.3)' }}>Chargement…</div>
          ) : events.length === 0 ? (
            <div className="text-center py-16 rounded-2xl" style={{ background: 'rgba(10,8,22,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Ticket className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Aucun événement publié pour le moment.</p>
              <button onClick={() => setCreateForm(true)} className="px-5 py-2.5 rounded-xl text-xs font-black text-black"
                style={{ background: `linear-gradient(135deg, ${AMBER}, #FCD34D)` }}>
                Créer le premier événement →
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((e, i) => (
                <motion.div key={e.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <EventCard event={e} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}