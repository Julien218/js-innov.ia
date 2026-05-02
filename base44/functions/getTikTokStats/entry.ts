import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('tiktok');

    // Get user info + stats
    const userRes = await fetch(
      `https://open.tiktokapis.com/v2/user/info/?fields=display_name,avatar_url,follower_count,following_count,video_count,likes_count`,
      { headers: { 'Authorization': `Bearer ${accessToken}` } }
    );
    const userData = await userRes.json();

    // Get recent videos
    const videosRes = await fetch(
      `https://open.tiktokapis.com/v2/video/list/?fields=id,title,cover_image_url,view_count,like_count,comment_count,share_count,create_time`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ max_count: 10 })
      }
    );
    const videosData = await videosRes.json();

    return Response.json({
      profile: userData?.data?.user || {},
      videos: videosData?.data?.videos || [],
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});