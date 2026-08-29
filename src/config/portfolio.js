const GOLD = '#D4AF37';
const CYAN = '#06B6D4';
const PURPLE = '#7C3AED';

const dropboxVideo = (url) => url.replace(/([?&])dl=0(?:&|$)/, '$1raw=1&').replace(/&$/, '');

export const APPROVED_PORTFOLIO_MEDIA = Object.freeze([
  {
    id: 'nova-dc6586c6c5',
    title: 'Menuiserie Henry',
    client_name: 'Menuiserie Henry',
    category: 'Présentation client',
    description: 'Présentation vidéo conçue par JS-Innov.IA pour mettre en valeur le savoir-faire et l’univers de Menuiserie Henry.',
    media_type: 'video',
    media_url: dropboxVideo('https://www.dropbox.com/scl/fi/0d177ut8ngr0j7g0z3pup/JS-Innov.IA-Presentation-menuiserie-henry-be-js-innov-ia-2026-08-28-dc6586c6c5.mp4?rlkey=5yrwf8xyq0lgq622afm3eezb2&dl=0'),
    integrity_hash: 'dc6586c6c5',
    technologies: ['Vidéo', 'Présentation', 'NOVA'],
    portfolio_status: 'approved',
    portfolio_approved: true,
    color: GOLD,
  },
  {
    id: 'nova-7964a15b8e',
    title: 'David Mirulla',
    client_name: 'David Mirulla',
    category: 'Présentation client',
    description: 'Présentation vidéo réalisée par JS-Innov.IA pour communiquer de façon claire, moderne et professionnelle.',
    media_type: 'video',
    media_url: dropboxVideo('https://www.dropbox.com/scl/fi/sbwwwlp855wy0q97ab3km/JS-Innov.IA-Presentation-david-mirulla-js-innov-ia-2026-08-28-7964a15b8e.mp4?rlkey=fblmiz8ly8o0ematis3mulsdx&dl=0'),
    integrity_hash: '7964a15b8e',
    technologies: ['Vidéo', 'Présentation', 'NOVA'],
    portfolio_status: 'approved',
    portfolio_approved: true,
    color: CYAN,
  },
  {
    id: 'nova-11085f6421',
    title: 'SBA Chauffage',
    client_name: 'SBA Chauffage',
    category: 'Présentation client',
    description: 'Montage de présentation réunissant plusieurs séquences pour valoriser les services de SBA Chauffage.',
    media_type: 'video',
    media_url: dropboxVideo('https://www.dropbox.com/scl/fi/4vgr06udi87jvrkt97g1f/JS-Innov.IA-Presentations-sba-chauffage-js-innov-ia-3videos-2026-08-28-11085f6421.mp4?rlkey=ypv9t33nzdw9zkrfe0i3ga9e8&dl=0'),
    integrity_hash: '11085f6421',
    technologies: ['Vidéo', 'Montage', 'NOVA'],
    portfolio_status: 'approved',
    portfolio_approved: true,
    color: PURPLE,
  },
  {
    id: 'nova-0bd3b42d6f',
    title: 'Publi Design — écran Espace C',
    client_name: 'Publi Design',
    category: 'Affichage dynamique',
    description: 'Présentation d’une réalisation d’affichage sur écran, produite pour démontrer une communication visuelle en situation.',
    media_type: 'video',
    media_url: dropboxVideo('https://www.dropbox.com/scl/fi/9fjg8px0usjuu9gzvq506/JS-Innov.IA-Presentations-publi-disign-ecran-espacec-js-innov-ia-2026-08-28-0bd3b42d6f.mp4?rlkey=gyipyz5a4q57lcsmq7d3h3ifb&dl=0'),
    integrity_hash: '0bd3b42d6f',
    technologies: ['Vidéo', 'Écran', 'Affichage'],
    portfolio_status: 'approved',
    portfolio_approved: true,
    color: CYAN,
  },
  {
    id: 'nova-1b7eed25a8',
    title: 'Vanden Borre Dour — écran Espace',
    client_name: 'Vanden Borre Dour',
    category: 'Affichage dynamique',
    description: 'Présentation vidéo d’un contenu pensé pour l’affichage sur écran et la visibilité locale.',
    media_type: 'video',
    media_url: dropboxVideo('https://www.dropbox.com/scl/fi/pt9d23gb3r0lf36qhniqd/JS-Innov.IA-Vanden-borre-dour-js-innov-ia-ecran-espace-2026-08-28-1b7eed25a8.mp4?rlkey=g76iqx631lsxcp9gcxo78gc&dl=0'),
    integrity_hash: '1b7eed25a8',
    technologies: ['Vidéo', 'Écran', 'Local'],
    portfolio_status: 'approved',
    portfolio_approved: true,
    color: GOLD,
  },
  {
    id: 'nova-f079526e02',
    title: 'Rougraff — écran Espace',
    client_name: 'Rougraff',
    category: 'Affichage dynamique',
    description: 'Réalisation vidéo destinée à présenter une communication de marque sur écran.',
    media_type: 'video',
    media_url: dropboxVideo('https://www.dropbox.com/scl/fi/tm9v19gqk14clpupcn46q/JS-Innov.IA-Rougraff-js-innov-ia-espace-ecran-2026-08-28-f079526e02.mp4?rlkey=4th76j80lpvbmt3w0gbbsvjid&dl=0'),
    integrity_hash: 'f079526e02',
    technologies: ['Vidéo', 'Écran', 'Communication'],
    portfolio_status: 'approved',
    portfolio_approved: true,
    color: PURPLE,
  },
  {
    id: 'nova-74bc2bb8fe',
    title: 'Belfius — proposition JS-Innov.IA',
    client_name: 'Belfius',
    category: 'Présentation client',
    description: 'Vidéo de proposition réalisée par JS-Innov.IA pour illustrer une approche de communication visuelle sur mesure.',
    media_type: 'video',
    media_url: dropboxVideo('https://www.dropbox.com/scl/fi/zsalm3o8zx728hrtvw1wf/JS-Innov.IA-Belfius-proposition-js-innov-ia-2026-08-28-74bc2bb8fe.mp4?rlkey=4dg2js6ku9fjyd7dj4296mbjz&dl=0'),
    integrity_hash: '74bc2bb8fe',
    technologies: ['Vidéo', 'Proposition', 'NOVA'],
    portfolio_status: 'approved',
    portfolio_approved: true,
    color: GOLD,
  },
  {
    id: 'nova-959b6ba0c8',
    title: 'François Copenneaux — écran Espace Premium',
    client_name: 'François Copenneaux',
    category: 'Affichage dynamique',
    description: 'Présentation premium créée pour valoriser une réalisation destinée à l’affichage sur écran.',
    media_type: 'video',
    media_url: dropboxVideo('https://www.dropbox.com/scl/fi/xwciyhwtc3l8gyg8fc051/JS-Innov.IA-Francois-copenneaux-ecran-espace-js-innov-ia-premium-2026-08-28-959b6ba0c8.mp4?rlkey=bfgnu4zv2zjdisf3cupiv0for&dl=0'),
    integrity_hash: '959b6ba0c8',
    technologies: ['Vidéo', 'Écran', 'Premium'],
    portfolio_status: 'approved',
    portfolio_approved: true,
    color: CYAN,
  },
]);

const unsafeTitle = /\b(non[ -]?videos?|brouillon|draft|test|essai|temp(?:oraire)?)\b/i;

export function normalizeApprovedPortfolioRecord(record) {
  if (!record || typeof record !== 'object') return null;
  const portfolio = record.portfolio && typeof record.portfolio === 'object' ? record.portfolio : {};
  const approved = record.portfolio_approved === true || portfolio.approved === true;
  const status = String(record.portfolio_status || portfolio.status || '').toLowerCase();
  const title = String(record.title || record.name || '').trim();
  const mediaUrl = String(record.media_url || record.video_url || record.image_url || '').trim();
  if (!approved || status !== 'approved' || !title || !mediaUrl || unsafeTitle.test(title)) return null;

  const mediaType = record.media_type === 'image' ? 'image' : 'video';
  return {
    ...record,
    id: record.id || `nova-${record.integrity_hash || title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    title,
    client_name: record.client_name || 'Réalisation JS-Innov.IA',
    category: record.category || (mediaType === 'video' ? 'Présentation client' : 'Création visuelle'),
    description: record.description || 'Réalisation créée par JS-Innov.IA — by JS-Innov.IA.',
    media_type: mediaType,
    media_url: mediaType === 'video' ? dropboxVideo(mediaUrl) : mediaUrl,
    image_url: mediaType === 'image' ? mediaUrl : undefined,
    technologies: Array.isArray(record.technologies) ? record.technologies : ['JS-Innov.IA'],
    featured: record.featured === true,
    color: record.color || GOLD,
  };
}

export function mergePortfolioProjects(baseProjects, remoteRecords = []) {
  const unique = new Map();
  [...baseProjects, ...APPROVED_PORTFOLIO_MEDIA, ...remoteRecords]
    .map((record) => record.media_type ? normalizeApprovedPortfolioRecord(record) : record)
    .filter(Boolean)
    .forEach((record) => {
      const key = record.integrity_hash || record.id;
      if (!unique.has(key)) unique.set(key, record);
    });
  return [...unique.values()];
}
