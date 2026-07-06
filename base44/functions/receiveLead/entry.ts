import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const {
      firstName, lastName, email, phone, company,
      need, message, source = "site_web"
    } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: "email requis" }), { status: 400 });
    }

    // 1. Sauvegarde locale (fallback garanti — ne dépend jamais du cockpit)
    let localLead;
    try {
      localLead = await base44.entities.Lead.create({
        firstName, lastName, email, phone, company,
        need, message, source, status: "nouveau",
      });
    } catch (e) {
      console.error("Erreur sauvegarde locale Lead:", e);
    }

    // 2. Forward temps réel vers le Cockpit (best-effort, ne bloque jamais la réponse au visiteur)
    const agentUrl = Deno.env.get("JSINNOVIA_AGENT_URL");
    const agentKey = Deno.env.get("JSINNOVIA_AGENT_KEY");
    let cockpitSynced = false;

    if (agentUrl && agentKey) {
      try {
        const res = await fetch(`${agentUrl}/data/Lead`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-agent-key": agentKey,
          },
          body: JSON.stringify({
            nom: lastName || "",
            prenom: firstName || "",
            email,
            telephone: phone || "",
            entreprise: company || "",
            source: source || "site_web",
            statut: "nouveau",
            notes: [need, message].filter(Boolean).join(" — "),
          }),
        });
        cockpitSynced = res.ok;
        if (!res.ok) console.error("Cockpit sync failed:", await res.text());
      } catch (e) {
        console.error("Erreur sync cockpit:", e);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      lead_id: localLead?.id || null,
      cockpit_synced: cockpitSynced,
    }), { headers: { "Content-Type": "application/json" } });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
});