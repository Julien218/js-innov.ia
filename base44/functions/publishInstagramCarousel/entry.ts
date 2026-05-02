import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Accès réservé aux administrateurs' }, { status: 403 });
  }

  const { innovations, caption } = await req.json();

  if (!innovations || innovations.length < 2 || innovations.length > 10) {
    return Response.json({ error: 'Un carrousel nécessite entre 2 et 10 images' }, { status: 400 });
  }

  const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');

  // Get Instagram user ID
  const meRes = await fetch(
    `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`
  );
  const me = await meRes.json();
  if (!me.id) {
    return Response.json({ error: 'Impossible de récupérer le compte Instagram', details: me }, { status: 400 });
  }
  const igUserId = me.id;

  // Step 1: Create individual image containers
  const itemIds = [];
  for (const innovation of innovations) {
    if (!innovation.image_url) continue;
    const itemRes = await fetch(
      `https://graph.instagram.com/${igUserId}/media?image_url=${encodeURIComponent(innovation.image_url)}&is_carousel_item=true&access_token=${accessToken}`,
      { method: 'POST' }
    );
    const item = await itemRes.json();
    if (!item.id) {
      return Response.json({ error: `Erreur création image: ${innovation.title}`, details: item }, { status: 400 });
    }
    itemIds.push(item.id);
  }

  if (itemIds.length < 2) {
    return Response.json({ error: 'Au moins 2 innovations avec une image sont requises' }, { status: 400 });
  }

  // Step 2: Create carousel container
  const finalCaption = caption || `🚀 Nos innovations technologiques\n\n${innovations.map(i => `✨ ${i.title}`).join('\n')}\n\n#Innovation #IA #Intelligence Artificielle #Tech #JsInnovIA`;

  const carouselRes = await fetch(
    `https://graph.instagram.com/${igUserId}/media?media_type=CAROUSEL&children=${itemIds.join(',')}&caption=${encodeURIComponent(finalCaption)}&access_token=${accessToken}`,
    { method: 'POST' }
  );
  const carousel = await carouselRes.json();
  if (!carousel.id) {
    return Response.json({ error: 'Erreur création carrousel', details: carousel }, { status: 400 });
  }

  // Step 3: Publish
  const publishRes = await fetch(
    `https://graph.instagram.com/${igUserId}/media_publish?creation_id=${carousel.id}&access_token=${accessToken}`,
    { method: 'POST' }
  );
  const published = await publishRes.json();

  if (!published.id) {
    return Response.json({ error: 'Erreur publication', details: published }, { status: 400 });
  }

  return Response.json({
    success: true,
    post_id: published.id,
    username: me.username,
    items_count: itemIds.length,
    message: `Carrousel publié avec succès sur @${me.username} (${itemIds.length} slides)`
  });
});