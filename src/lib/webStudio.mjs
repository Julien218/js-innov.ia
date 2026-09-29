/** Public catalogue and explainable recommendations. No visitor identification or LLM claims. */
export const SECTORS = [
  ['commerce', 'Commerce'], ['horeca', 'Restaurant / Horeca'], ['artisan', 'Artisan'],
  ['services', 'Entreprise / Services'], ['beaute', 'Beauté / Mode'], ['evenement', 'Événement'],
  ['immobilier', 'Immobilier / Architecture'], ['association', 'Association'], ['creation', 'Création / Portfolio'],
].map(([id, label]) => ({ id, label }));
export const GOALS = [
  { id: 'web', label: 'Créer mon site', title: 'Votre prochain site. Déjà un peu le vôtre.', description: 'Explorez des univers, essayez votre identité et choisissez une direction qui parle à vos clients.', cta: 'Trouver mon style', href: '/web-studio' },
  { id: 'automate', label: 'Gagner du temps', title: 'Moins de tâches. Plus de temps pour votre métier.', description: 'Partons de ce qui vous ralentit : demandes, suivi, documents ou rendez-vous. Construisons un parcours plus simple.', cta: 'Explorer les automatisations', href: '/Automations' },
  { id: 'assistant', label: 'Accueillir avec l’IA', title: 'Un accueil intelligent. Une relation humaine.', description: 'Un assistant pour expliquer vos services et orienter les demandes, avec une reprise humaine au bon moment.', cta: 'Découvrir les assistants', href: '/saas-agents' },
  { id: 'content', label: 'Créer du contenu', title: 'Votre univers mérite de se faire remarquer.', description: 'Donnez une direction cohérente à vos visuels, contenus et expériences, sans perdre votre singularité.', cta: 'Ouvrir le studio créatif', href: '/CreativeStudio' },
];
const rows = [
  ['aura','Aura','horeca','editorial','dark','#E8AB83','#241913','Une table. Mille histoires.','Une cuisine à découvrir, un moment à partager.',['La carte','Réservations','Notre maison']],
  ['nova','Nova','services','tech','dark','#8BDDDC','#0A2029','La clarté fait avancer.','Des solutions pensées pour votre quotidien.',['Expertises','Projets','Échangeons']],
  ['elegance','Élégance','beaute','editorial','light','#965D60','#F2E8E3','L’élégance vous ressemble.','Une attention singulière, jusque dans les détails.',['Prestations','Rendez-vous','L’équipe']],
  ['pulse','Pulse','evenement','poster','dark','#B2A0FF','#20112F','Vivez ce qui vous rassemble.','Un programme à explorer. Des instants à vivre.',['Programme','Inscriptions','Infos pratiques']],
  ['atelier','Atelier','artisan','craft','dark','#D4AF37','#201D16','Le détail change tout.','Du premier croquis à la dernière finition.',['Réalisations','Savoir-faire','Votre projet']],
  ['zenith','Zenith','immobilier','architecture','light','#486957','#E7EBE4','Des lieux à vivre. Vraiment.','Trouvons l’espace qui donne du sens à vos envies.',['Les biens','Visites','Notre approche']],
  ['grain','Grain','commerce','craft','light','#99582E','#F4EDDD','Le bon. Le frais. Le proche.','Une sélection attentive et le plaisir de vous accueillir.',['La sélection','Notre histoire','Nous trouver']],
  ['studio','Studio','creation','editorial','light','#73598D','#EEE9F1','Des idées qui prennent forme.','Un regard singulier sur vos projets.',['Portfolio','Démarche','Collaborons']],
  ['horizon','Horizon','services','architecture','light','#486685','#E8EDF2','Voyons plus loin, ensemble.','L’expertise, la proximité et une direction claire.',['Services','Méthode','Contact']],
  ['collectif','Collectif','association','community','dark','#A9DDB1','#122B23','Ensemble, faisons place aux idées.','Des personnes, des actions, un territoire qui avance.',['Nos actions','Participer','Actualités']],
  ['local','Local','commerce','community','dark','#EAC17D','#28201A','Tout commence près de chez vous.','Vos découvertes préférées ont une adresse.',['Découvrir','Nouveautés','Horaires']],
  ['origines','Origines','artisan','editorial','light','#965F49','#F1E8DC','Le geste. La matière. Le sens.','Un savoir-faire qui raconte une histoire.',['Collections','L’atelier','Sur mesure']],
  ['perspective','Perspective','immobilier','architecture','dark','#D7C6AB','#222421','Un autre regard sur l’espace.','Des projets pensés pour durer et pour être vécus.',['Projets','Vision','Rencontrons-nous']],
  ['signal','Signal','services','tech','dark','#C3BEFF','#17172E','Vos projets trouvent leur trajectoire.','Connecter les idées. Simplifier l’essentiel.',['Solutions','Approche','Parlons-en']],
  ['tempo','Tempo','evenement','poster','dark','#CEEA86','#1E2719','Le prochain rendez-vous, c’est ici.','La rencontre commence bien avant le premier instant.',['À l’affiche','Participer','Le lieu']],
  ['lumen','Lumen','beaute','craft','light','#866054','#F0E5DF','Une parenthèse à votre rythme.','Un lieu, une attention, votre moment.',['L’expérience','Prestations','Prendre contact']],
  ['botanica','Botanica','commerce','community','light','#4E714E','#E9EEE3','Cultivons les belles découvertes.','Une sélection qui respire et des conseils à partager.',['Sélection','Les conseils','La boutique']],
  ['focus','Focus','creation','poster','dark','#F5A28E','#2D191B','Le regard change la perspective.','Création, idées et projets qui ont quelque chose à dire.',['Travaux','À propos','Collaborer']],
];
export const MODELS = rows.map(([id,name,sector,layout,tone,accent,background,headline,description,sections]) => Object.freeze({id,name,sector,layout,tone,accent,background,headline,description,sections}));
export const modelById = (id) => MODELS.find(model => model.id === id);
export const sectorLabel = (id) => SECTORS.find(sector => sector.id === id)?.label || 'À préciser';
export const goalById = (id) => GOALS.find(goal => goal.id === id);
export const cleanText = (value, length = 160) => String(value ?? '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, length);
// Preserve spaces while typing in controlled inputs; normalize only for matching/export.
const editableText = (value, length) => String(value ?? '').replace(/[\u0000-\u001F\u007F]/g, ' ').slice(0,length);
export const normalizeText = value => cleanText(value, 6000).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const vocabulary = {
  horeca: ['restaurant','restauration','traiteur','brasserie','gastronomie','cuisine','menu','chef'],
  artisan: ['artisan','artisanat','menuiserie','ebeniste','renovation','plomberie','electricien','savoir faire'],
  beaute: ['coiffure','coiffeur','esthetique','institut','beaute','cosmetique','mode','couture'],
  evenement: ['festival','spectacle','concert','evenement','programmation','billetterie','scene'],
  immobilier: ['immobilier','architecture','architecte','appartement','maison a vendre','agence immobiliere','biens'],
  association: ['association','asbl','benevole','benevolat','adherer','solidarite','collectif'],
  creation: ['photographe','photographie','graphiste','designer','portfolio','illustration','creation graphique'],
  commerce: ['boutique','magasin','commerce','fleuriste','boulangerie','patisserie','epicerie','produits'],
  services: ['entreprise','conseil','consulting','expertise','logiciel','informatique','cabinet','services'],
};
/** Deliberately conservative: one generic keyword is not an identification. */
export function inferSector(value) {
  const text = ` ${normalizeText(value)} `;
  const scores = Object.entries(vocabulary).map(([sector, words]) => {
    const matches = words.filter(word => new RegExp(` ${word.replace(/ /g,' +')}(?:s)? `).test(text));
    return { sector, matches, score: matches.length };
  }).sort((a,b) => b.score-a.score);
  const best = scores[0];
  if (!best || best.score < 2 || best.score - (scores[1]?.score || 0) < 1) return null;
  return { sector: best.sector, evidence: best.matches.slice(0,4), status: 'suggestion' };
}
export const DEFAULT_PROFILE = Object.freeze({ company:'', activity:'', sector:'', goal:'', model:'', accent:'', website:'', inferredSector:'', evidence:[], previewed:[], remember:false });
export function normalizeProfile(value = {}) {
  const v = value && typeof value === 'object' ? value : {};
  const sector = SECTORS.some(s => s.id === v.sector) ? v.sector : '';
  const inferredSector = SECTORS.some(s => s.id === v.inferredSector) ? v.inferredSector : '';
  return {
    company:editableText(v.company,80), activity:editableText(v.activity,400), sector,
    goal:goalById(v.goal) ? v.goal : '', model:modelById(v.model) ? v.model : '',
    accent:/^#[0-9a-f]{6}$/i.test(v.accent || '') ? v.accent : '',
    website:editableText(v.website,300), inferredSector,
    evidence:Array.isArray(v.evidence) ? v.evidence.slice(0,4).map(x=>cleanText(x,40)) : [],
    previewed:Array.isArray(v.previewed) ? [...new Set(v.previewed.filter(id=>modelById(id)))].slice(-8) : [],
    remember:v.remember === true,
  };
}
export function rankModels(value = {}) {
  const profile = normalizeProfile(value);
  const sector = profile.sector || profile.inferredSector;
  const seenLayouts = profile.previewed.map(id=>modelById(id)?.layout);
  return MODELS.map((model,index) => {
    let score = 0;
    const reasons = [];
    if (sector && model.sector === sector) { score += profile.sector ? 50 : 30; reasons.push(`${profile.sector ? 'Activité choisie' : 'Activité suggérée'} : ${sectorLabel(sector)}`); }
    if (profile.model === model.id) { score += 60; reasons.push('Votre style sélectionné'); }
    if (seenLayouts.includes(model.layout)) { score += 4; reasons.push('Une composition proche des aperçus consultés'); }
    if (profile.goal === 'assistant' && model.layout === 'tech') { score += 6; reasons.push('Un parcours orienté présentation de services'); }
    if (profile.goal === 'content' && ['editorial','poster'].includes(model.layout)) { score += 6; reasons.push('Une composition adaptée aux contenus visuels'); }
    if (profile.goal === 'automate' && ['tech','architecture'].includes(model.layout)) { score += 6; reasons.push('Une présentation structurée des services'); }
    if (!reasons.length) reasons.push('Une autre direction à explorer');
    return { ...model, score, reasons, index };
  }).sort((a,b)=>b.score-a.score || a.index-b.index);
}
export function profileFromAudit(report) {
  if (report?.verified !== true || report.source !== 'live_server_measurement') throw new Error('Aucune lecture vérifiée du site n’a été reçue.');
  const m = report.measurements;
  if (!m || !Number.isInteger(m.status) || m.status < 200 || m.status >= 300) throw new Error('La page ne répond pas correctement. Précisez plutôt votre activité.');
  const title = cleanText(m.title,200);
  const description = cleanText(m.meta_description,500);
  const heading = Array.isArray(m.h1) ? m.h1.map(x=>cleanText(x,160)).slice(0,3).join(' ') : '';
  const detected = inferSector(`${title} ${description} ${heading}`);
  return { title, description, detected, sourceUrl:cleanText(report.final_url,300), measuredAt:cleanText(report.measured_at,50) };
}
/** Validate before sending to the existing DNS-pinned, public-only server audit. */
export function publicWebsite(value) {
  const text = cleanText(value,300);
  let url;
  try { url = new URL(/^[a-z][a-z\d+.-]*:/i.test(text) ? text : `https://${text}`); } catch { throw new Error('Indiquez une adresse de site valide.'); }
  if (!['https:','http:'].includes(url.protocol) || url.username || url.password || (url.port && !['80','443'].includes(url.port))) throw new Error('Utilisez une adresse web publique, sans identifiants ni port spécial.');
  const host = url.hostname.toLowerCase();
  if (!host.includes('.') || host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local') || /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host) || host.includes(':')) throw new Error('Indiquez un nom de domaine public, pas une adresse réseau.');
  url.hash='';
  return url.href;
}
export function campaignProfile(search='') {
  const params = new URLSearchParams(search);
  return normalizeProfile({sector:params.get('secteur'),goal:params.get('objectif'),model:params.get('modele')});
}
export function buildBrief(value) {
  const profile=normalizeProfile(value);
  const model=modelById(profile.model);
  return [
    'Projet Web Studio — JS-Innov.IA',
    profile.company && `Entreprise : ${profile.company}`,
    profile.sector && `Activité : ${sectorLabel(profile.sector)}`,
    !profile.sector && profile.inferredSector && `Activité suggérée, à confirmer : ${sectorLabel(profile.inferredSector)}`,
    profile.activity && `Description : ${profile.activity}`,
    profile.goal && `Objectif : ${goalById(profile.goal).label}`,
    model && `Direction choisie : ${model.name} (${model.layout})`,
    profile.accent && `Couleur d’accent : ${profile.accent}`,
    profile.website && `Site indiqué : ${profile.website}`,
    'Les fonctions et le budget restent à définir ensemble. Aucune commande ni publication automatique.',
  ].filter(Boolean).join('\n');
}
export function contrastInk(hex) {
  const raw=/^#[0-9a-f]{6}$/i.test(hex || '') ? hex.slice(1) : 'd4af37';
  const rgb=[0,2,4].map(i=>parseInt(raw.slice(i,i+2),16)/255).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);
  const luminance=.2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];
  return (luminance+.05)/.05 >= 1.05/(luminance+.05) ? '#000000' : '#FFFFFF';
}

export function verifiedTransmission(value) {
  if (value?.transmitted !== true || value?.verified !== true || typeof value?.request_id !== 'string' || !value.request_id.trim() || typeof value?.journal_id !== 'string' || !value.journal_id.trim()) throw new Error('Unverified transmission');
  return { request_id:cleanText(value.request_id,160), journal_id:cleanText(value.journal_id,160) };
}
