import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const TARGET_FOLDER_NAME = 'dossier contenus JS-innov.IA';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/avi', 'video/webm', 'video/mov'];

function detectCategory(mimeType, fileName) {
  if (IMAGE_TYPES.includes(mimeType)) return 'Création artistique';
  if (VIDEO_TYPES.includes(mimeType)) return 'Template vidéo';
  return 'Autre';
}

function detectTags(fileName, mimeType) {
  const tags = [];
  const lower = fileName.toLowerCase();
  if (IMAGE_TYPES.includes(mimeType)) tags.push('image', 'visuel');
  if (VIDEO_TYPES.includes(mimeType)) tags.push('vidéo', 'motion');
  if (lower.includes('tiktok')) tags.push('TikTok');
  if (lower.includes('instagram') || lower.includes('insta')) tags.push('Instagram');
  if (lower.includes('logo')) tags.push('logo', 'branding');
  if (lower.includes('banner') || lower.includes('banniere')) tags.push('bannière');
  if (lower.includes('seo')) tags.push('SEO');
  if (lower.includes('ia') || lower.includes('ai')) tags.push('IA', 'intelligence artificielle');
  return tags;
}

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const base44 = createClientFromRequest(req);

    // Google Drive webhook — body is empty, state is in _provider_meta
    const state = body?.data?._provider_meta?.['x-goog-resource-state'];

    // Acknowledge sync ping
    if (state === 'sync') {
      return Response.json({ status: 'sync_ack' });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const authHeader = { Authorization: `Bearer ${accessToken}` };

    // Load or initialize SyncState
    const existing = await base44.asServiceRole.entities.SyncState.list();
    let syncRecord = existing.length > 0 ? existing[0] : null;

    if (!syncRecord) {
      const tokenRes = await fetch(
        'https://www.googleapis.com/drive/v3/changes/startPageToken',
        { headers: authHeader }
      );
      const { startPageToken } = await tokenRes.json();
      await base44.asServiceRole.entities.SyncState.create({
        page_token: startPageToken,
        folder_name: TARGET_FOLDER_NAME,
        last_sync: new Date().toISOString(),
      });
      return Response.json({ status: 'initialized' });
    }

    // Fetch incremental changes
    const baseUrl = `https://www.googleapis.com/drive/v3/changes?fields=changes(file(id,name,mimeType,webViewLink,webContentLink,thumbnailLink,parents,createdTime)),newStartPageToken,nextPageToken&includeRemoved=false`;
    let changesUrl = baseUrl + `&pageToken=${syncRecord.page_token}`;
    const allChanges = [];
    let newPageToken = null;

    while (changesUrl) {
      const res = await fetch(changesUrl, { headers: authHeader });
      if (!res.ok) {
        const err = await res.text();
        console.error('Drive API error:', err);
        return Response.json({ status: 'api_error', detail: err }, { status: 500 });
      }
      const page = await res.json();
      allChanges.push(...(page.changes || []));
      if (page.newStartPageToken) newPageToken = page.newStartPageToken;
      changesUrl = page.nextPageToken ? baseUrl + `&pageToken=${page.nextPageToken}` : null;
    }

    console.log(`Found ${allChanges.length} change(s)`);

    // Filter: only files (not folders), only media types or documents
    const ALLOWED_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES,
      'application/pdf', 'application/zip',
      'application/vnd.google-apps.document',
    ];

    const newFiles = allChanges
      .filter(c => c.file && !c.removed)
      .map(c => c.file)
      .filter(f => f.mimeType && (
        IMAGE_TYPES.includes(f.mimeType) ||
        VIDEO_TYPES.includes(f.mimeType) ||
        ALLOWED_TYPES.includes(f.mimeType)
      ));

    console.log(`Processing ${newFiles.length} new media file(s)`);

    for (const file of newFiles) {
      // Check if already in portfolio (avoid duplicates)
      const existing = await base44.asServiceRole.entities.Showcase.filter({ demo_url: file.webViewLink });
      if (existing.length > 0) {
        console.log(`File already in portfolio: ${file.name}`);
        continue;
      }

      // Generate SEO-optimized title and description with AI
      const seoResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `Tu es un expert SEO pour JS-INNOV.IA, agence d'intelligence artificielle à Dour, Belgique.
Un nouveau fichier vient d'être ajouté au portfolio depuis Google Drive.

Nom du fichier : "${file.name}"
Type : ${file.mimeType}
Date d'ajout : ${file.createdTime || new Date().toISOString()}

Génère :
1. Un titre de portfolio court et accrocheur (max 60 caractères), optimisé SEO local
2. Une description de portfolio professionnelle (120-160 caractères), riche en mots-clés IA & Belgique
3. Des tags SEO pertinents (5-8 tags maximum)
4. Une technique IA associée si applicable

Ton : professionnel, premium, JS-INNOV.IA style.
Contexte JS-INNOV.IA : création IA, automatisation, TikTok, sites vitrines, SEO local, Dour Belgique.`,
        response_json_schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            ai_technique: { type: 'string' },
          }
        }
      });

      const category = detectCategory(file.mimeType, file.name);
      const autoTags = detectTags(file.name, file.mimeType);
      const allTags = [...new Set([...(seoResult.tags || []), ...autoTags])];

      // Use thumbnail as image if available (for images/videos)
      const imageUrl = file.thumbnailLink
        ? file.thumbnailLink.replace('=s220', '=s800')
        : null;

      await base44.asServiceRole.entities.Showcase.create({
        title: seoResult.title || file.name.replace(/\.[^/.]+$/, ''),
        description: seoResult.description || `Réalisation JS-INNOV.IA — ${file.name}`,
        category,
        tags: allTags,
        ai_techniques: seoResult.ai_technique ? [seoResult.ai_technique] : [],
        image_url: imageUrl,
        demo_url: file.webViewLink || '',
        featured: false,
        client: 'JS-INNOV.IA',
        results: `Fichier intégré automatiquement depuis Google Drive le ${new Date().toLocaleDateString('fr-FR')}`,
      });

      console.log(`Portfolio entry created: ${seoResult.title || file.name}`);
    }

    // Save the new page token
    if (newPageToken) {
      await base44.asServiceRole.entities.SyncState.update(syncRecord.id, {
        page_token: newPageToken,
        last_sync: new Date().toISOString(),
      });
    }

    return Response.json({ status: 'ok', processed: newFiles.length });

  } catch (error) {
    console.error('drivePortfolioSync error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});