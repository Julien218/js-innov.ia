import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');

    // Get user ID first
    const meRes = await fetch(
      `https://graph.instagram.com/me?fields=id,username,followers_count,media_count,profile_picture_url&access_token=${accessToken}`
    );
    const meData = await meRes.json();

    if (!meData.id) {
      return Response.json({ error: 'Impossible de récupérer le profil Instagram', details: meData }, { status: 400 });
    }

    // Get recent media with insights
    const mediaRes = await fetch(
      `https://graph.instagram.com/${meData.id}/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count,permalink&limit=20&access_token=${accessToken}`
    );
    const mediaData = await mediaRes.json();

    const posts = (mediaData.data || []).map(p => ({
      id: p.id,
      caption: p.caption || '',
      media_type: p.media_type, // IMAGE, VIDEO, CAROUSEL_ALBUM
      media_url: p.media_url || p.thumbnail_url || '',
      timestamp: p.timestamp,
      like_count: p.like_count || 0,
      comments_count: p.comments_count || 0,
      permalink: p.permalink,
    }));

    return Response.json({
      profile: {
        username: meData.username,
        followers_count: meData.followers_count || 0,
        media_count: meData.media_count || 0,
        profile_picture_url: meData.profile_picture_url || '',
      },
      posts,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});