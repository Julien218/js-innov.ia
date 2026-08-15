import { useMemo, useState } from 'react';
import { Monitor, Camera, Wifi, HardDrive, CalendarDays, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

const PACKS = [
  {
    id: 'signage',
    title: 'Digital Signage',
    description: 'Gestion distante de votre écran LED, playlists, programmation et Player local offline-first.',
    icon: Monitor,
    features: ['Médiathèque en ligne', 'Playlists et programmation', 'Player local + HDMI', 'Continuité hors connexion', 'Historique de diffusion'],
  },
  {
    id: 'signage-surveillance',
    title: 'Signage + Vidéosurveillance',
    description: 'Le pilotage de l’écran complété par la consultation et l’archivage sécurisé des caméras.',
    icon: Camera,
    features: ['Toutes les fonctions Digital Signage', 'Vue multi-caméras', 'Historique des enregistrements', 'Archivage Dropbox', 'Alertes de disponibilité'],
  },
];

const initialForm = {
  packageId: 'signage',
  company: '',
  vatNumber: '',
  contactName: '',
  email: '',
  phone: '',
  installationAddress: '',
  businessType: '',
  screenCount: '1',
  screenDimensions: '',
  screenResolution: '',
  controllerBrand: '',
  controllerModel: '',
  hasHdmi: true,
  hasUsb: false,
  hasEthernet: false,
  hasWifi: false,
  internetAvailable: true,
  existingPlayer: false,
  campaignFrequency: 'hebdomadaire',
  contentCreation: false,
  onsiteInstallation: true,
  supportLevel: 'standard',
  cameraCount: '0',
  cameraBrandModel: '',
  cameraRtspOnvif: 'inconnu',
  recordingRetentionDays: '30',
  dropboxRequired: true,
  notes: '',
  privacyAccepted: false,
};

function Field({ label, children, help }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      {children}
      {help && <span className="block text-xs text-slate-500">{help}</span>}
    </label>
  );
}

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15';

export default function SignageProduct() {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedPack = useMemo(() => PACKS.find((p) => p.id === form.packageId) || PACKS[0], [form.packageId]);
  const surveillance = form.packageId === 'signage-surveillance';
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const next = () => {
    setError('');
    if (step === 1 && (!form.company || !form.contactName || !form.email || !form.phone)) {
      return setError('Complétez les coordonnées obligatoires avant de continuer.');
    }
    if (step === 2 && (!form.installationAddress || !form.screenCount)) {
      return setError("Indiquez l’adresse d’installation et le nombre d’écrans.");
    }
    setStep((s) => Math.min(4, s + 1));
  };

  const submit = async () => {
    if (!form.privacyAccepted) return setError('Vous devez accepter le traitement des données nécessaires à votre demande.');
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/signage/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.url) throw new Error(data.error || 'Paiement temporairement indisponible.');
      window.location.assign(data.url);
    } catch (e) {
      setError(e.message || 'Impossible de lancer le paiement.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 px-5 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
            <Monitor className="h-4 w-4" /> JS-Innov.IA Digital Signage
          </div>
          <h1 className="max-w-4xl text-4xl font-black tracking-tight md:text-6xl">Pilotez vos écrans et vos caméras depuis un seul cockpit.</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">Une solution professionnelle pour écrans LED, commerces, vitrines, salles d’attente et sites multi-écrans : contenus à distance, programmation, Player local fiable et option vidéosurveillance sécurisée.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [Wifi, 'Pilotage à distance'],
              [HardDrive, 'Cache local offline-first'],
              [CalendarDays, 'Programmation automatique'],
              [ShieldCheck, 'Architecture sécurisée'],
            ].map(([Icon, label]) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-semibold text-slate-200"><Icon className="h-5 w-5 text-cyan-300" />{label}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-12 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">Votre solution</p>
              <h2 className="mt-2 text-2xl font-black">Choisissez le niveau de service</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">Les montants sont gérés dans Stripe et peuvent évoluer sans modifier le site. Le prix final est présenté dans le Checkout sécurisé avant paiement.</p>
            </div>
            {PACKS.map((pack) => {
              const Icon = pack.icon;
              const active = form.packageId === pack.id;
              return (
                <button key={pack.id} type="button" onClick={() => set('packageId', pack.id)} className={`w-full rounded-2xl border p-5 text-left transition ${active ? 'border-cyan-400 bg-cyan-400/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-white/10 p-3"><Icon className="h-6 w-6 text-cyan-300" /></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3"><h3 className="font-bold">{pack.title}</h3>{active && <CheckCircle2 className="h-5 w-5 text-cyan-300" />}</div>
                      <p className="mt-1 text-sm leading-6 text-slate-400">{pack.description}</p>
                      <div className="mt-3 space-y-1">{pack.features.map((f) => <div key={f} className="text-xs text-slate-300">✓ {f}</div>)}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rounded-3xl bg-white p-5 text-slate-900 shadow-2xl md:p-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-700">Configuration</p><h2 className="mt-1 text-xl font-black">Questionnaire technique — étape {step}/4</h2></div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">{selectedPack.title}</span>
            </div>

            {step === 1 && <div className="grid gap-4 md:grid-cols-2">
              <Field label="Entreprise *"><input className={inputClass} value={form.company} onChange={(e) => set('company', e.target.value)} /></Field>
              <Field label="N° TVA"><input className={inputClass} value={form.vatNumber} onChange={(e) => set('vatNumber', e.target.value)} placeholder="BE..." /></Field>
              <Field label="Personne de contact *"><input className={inputClass} value={form.contactName} onChange={(e) => set('contactName', e.target.value)} /></Field>
              <Field label="Email *"><input className={inputClass} type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></Field>
              <Field label="Téléphone *"><input className={inputClass} value={form.phone} onChange={(e) => set('phone', e.target.value)} /></Field>
              <Field label="Type d’activité"><input className={inputClass} value={form.businessType} onChange={(e) => set('businessType', e.target.value)} placeholder="Commerce, horeca, ASBL..." /></Field>
            </div>}

            {step === 2 && <div className="grid gap-4 md:grid-cols-2">
              <Field label="Adresse d’installation *"><input className={inputClass} value={form.installationAddress} onChange={(e) => set('installationAddress', e.target.value)} /></Field>
              <Field label="Nombre d’écrans *"><input className={inputClass} type="number" min="1" max="50" value={form.screenCount} onChange={(e) => set('screenCount', e.target.value)} /></Field>
              <Field label="Dimensions écran"><input className={inputClass} value={form.screenDimensions} onChange={(e) => set('screenDimensions', e.target.value)} placeholder="ex. 4 m × 2 m" /></Field>
              <Field label="Résolution / pitch"><input className={inputClass} value={form.screenResolution} onChange={(e) => set('screenResolution', e.target.value)} placeholder="ex. P2.976" /></Field>
              <Field label="Marque du contrôleur"><input className={inputClass} value={form.controllerBrand} onChange={(e) => set('controllerBrand', e.target.value)} placeholder="ex. Colorlight" /></Field>
              <Field label="Modèle du contrôleur"><input className={inputClass} value={form.controllerModel} onChange={(e) => set('controllerModel', e.target.value)} placeholder="ex. X2M" /></Field>
              <div className="md:col-span-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {['hasHdmi','hasUsb','hasEthernet','hasWifi'].map((key) => <label key={key} className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-sm"><input type="checkbox" checked={form[key]} onChange={(e) => set(key, e.target.checked)} />{key === 'hasHdmi' ? 'HDMI' : key === 'hasUsb' ? 'USB' : key === 'hasEthernet' ? 'Ethernet' : 'Wi-Fi'}</label>)}
              </div>
            </div>}

            {step === 3 && <div className="grid gap-4 md:grid-cols-2">
              <Field label="Internet disponible sur place ?"><select className={inputClass} value={String(form.internetAvailable)} onChange={(e) => set('internetAvailable', e.target.value === 'true')}><option value="true">Oui</option><option value="false">Non</option></select></Field>
              <Field label="Player déjà présent ?"><select className={inputClass} value={String(form.existingPlayer)} onChange={(e) => set('existingPlayer', e.target.value === 'true')}><option value="false">Non / à fournir</option><option value="true">Oui</option></select></Field>
              <Field label="Fréquence de changement des contenus"><select className={inputClass} value={form.campaignFrequency} onChange={(e) => set('campaignFrequency', e.target.value)}><option value="quotidienne">Quotidienne</option><option value="hebdomadaire">Hebdomadaire</option><option value="mensuelle">Mensuelle</option><option value="ponctuelle">Ponctuelle</option></select></Field>
              <Field label="Support souhaité"><select className={inputClass} value={form.supportLevel} onChange={(e) => set('supportLevel', e.target.value)}><option value="standard">Standard</option><option value="prioritaire">Prioritaire</option><option value="premium">Premium</option></select></Field>
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-sm"><input type="checkbox" checked={form.contentCreation} onChange={(e) => set('contentCreation', e.target.checked)} />Je souhaite aussi la création de contenus</label>
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-sm"><input type="checkbox" checked={form.onsiteInstallation} onChange={(e) => set('onsiteInstallation', e.target.checked)} />Installation sur site souhaitée</label>
            </div>}

            {step === 4 && <div className="space-y-4">
              {surveillance && <div className="grid gap-4 md:grid-cols-2">
                <Field label="Nombre de caméras"><input className={inputClass} type="number" min="1" max="64" value={form.cameraCount} onChange={(e) => set('cameraCount', e.target.value)} /></Field>
                <Field label="Marque / modèle"><input className={inputClass} value={form.cameraBrandModel} onChange={(e) => set('cameraBrandModel', e.target.value)} /></Field>
                <Field label="RTSP / ONVIF"><select className={inputClass} value={form.cameraRtspOnvif} onChange={(e) => set('cameraRtspOnvif', e.target.value)}><option value="inconnu">Je ne sais pas</option><option value="oui">Oui</option><option value="non">Non</option></select></Field>
                <Field label="Conservation souhaitée"><select className={inputClass} value={form.recordingRetentionDays} onChange={(e) => set('recordingRetentionDays', e.target.value)}><option value="7">7 jours</option><option value="14">14 jours</option><option value="30">30 jours</option><option value="60">60 jours</option></select></Field>
                <label className="md:col-span-2 flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-sm"><input type="checkbox" checked={form.dropboxRequired} onChange={(e) => set('dropboxRequired', e.target.checked)} />Archivage dans l’espace Dropbox du client</label>
              </div>}
              <Field label="Informations complémentaires"><textarea rows="4" className={inputClass} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Décrivez votre installation ou vos contraintes particulières." /></Field>
              <label className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-5"><input className="mt-1" type="checkbox" checked={form.privacyAccepted} onChange={(e) => set('privacyAccepted', e.target.checked)} /><span>J’accepte que JS-Innov.IA traite les informations fournies pour établir, exécuter et suivre cette commande. Pour la vidéosurveillance, l’installation et les durées de conservation seront configurées selon les obligations applicables au site concerné.</span></label>
            </div>}

            {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">{error}</div>}

            <div className="mt-7 flex items-center justify-between gap-3">
              <button type="button" disabled={step === 1 || loading} onClick={() => setStep((s) => Math.max(1, s - 1))} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold disabled:opacity-40">Retour</button>
              {step < 4 ? <button type="button" onClick={next} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white">Continuer <ArrowRight className="h-4 w-4" /></button> : <button type="button" disabled={loading} onClick={submit} className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">{loading ? 'Préparation du paiement…' : 'Continuer vers le paiement sécurisé'} <ArrowRight className="h-4 w-4" /></button>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
