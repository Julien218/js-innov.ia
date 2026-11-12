import { useState } from 'react';
export default function VideoReview() {
  const [key, setKey] = useState('');
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function request(path, options = {}) {
    const r = await fetch(`/api/video/internal/${path}`, {
      ...options,
      headers: { Authorization: `Bearer ${key}`, ...options.headers },
    });
    if (!r.ok) throw new Error((await r.json()).error);
    return r;
  }
  async function load() {
    setOrders(await (await request('orders')).json());
  }
  async function run(fn) {
    setBusy(true);
    setError('');
    try {
      await fn();
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function download(path, name) {
    const r = await request(path);
    const u = URL.createObjectURL(await r.blob());
    const a = document.createElement('a');
    a.href = u;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(u), 1000);
  }
  return (
    <section className="vc-section">
      <h1>Revue du studio</h1>
      <p>
        Interface interne de test. La production automatique et la
        synchronisation Cockpit restent à raccorder. Une validation ici rend le
        film visible au client de test.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(load);
        }}
      >
        <label>
          Accès interne
          <input
            type="password"
            autoComplete="off"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            required
          />
        </label>
        <button disabled={busy} className="vc-primary">
          Charger les commandes
        </button>
        <button
          type="button"
          className="vc-outline"
          onClick={() => {
            setKey('');
            setOrders([]);
          }}
        >
          Fermer la session
        </button>
      </form>
      <p role="alert">{error}</p>
      <div className="vc-grid">
        {orders.map((o) => (
          <article className="vc-card" key={o.id}>
            <h2>{o.customer.name}</h2>
            <p>
              {o.id}
              <br />
              {o.customer.email}
              <br />
              {o.status} · {o.payment}
            </p>
            <p>{o.brief}</p>
            <p>
              {o.event} · {o.mood} · {o.format}
            </p>
            <p>{o.feedback}</p>
            {o.files.map((f) => (
              <button
                className="vc-textlink"
                disabled={busy}
                key={f.id}
                onClick={() =>
                  run(() => download(`${o.id}/files/${f.id}`, f.name))
                }
              >
                {f.name}
              </button>
            ))}
            {o.eligible && (
              <button
                disabled={busy}
                className="vc-primary"
                onClick={() =>
                  run(() => request(`${o.id}/claim`, { method: 'POST' }))
                }
              >
                Prendre en production
              </button>
            )}
            {['production', 'revision_requested', 'internal_review'].includes(
              o.status,
            ) && (
              <label>
                Déposer la version MP4 pour revue interne
                <input
                  type="file"
                  accept="video/mp4"
                  disabled={busy}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file)
                      run(() =>
                        request(`${o.id}/result`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/octet-stream',
                            'x-file-name': 'film.mp4',
                          },
                          body: file,
                        }),
                      );
                    e.target.value = '';
                  }}
                />
              </label>
            )}
            {o.status === 'internal_review' && (
              <>
                <button
                  disabled={busy}
                  className="vc-outline"
                  onClick={() =>
                    run(() => download(`${o.id}/download`, 'revue.mp4'))
                  }
                >
                  Vérifier le film
                </button>
                <button
                  disabled={busy}
                  className="vc-primary"
                  onClick={() =>
                    run(() => request(`${o.id}/approve`, { method: 'POST' }))
                  }
                >
                  Valider en interne et présenter au client
                </button>
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
