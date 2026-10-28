const ALLOWED_ORIGIN = 'https://portfolio.lopegaworks.com';
const ALLOWED_EVENTS = new Set(['page_view', 'experience_open', 'work_file_open', 'resume_download']);
const ALLOWED_PAGES = new Set(['/']);

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Vary': 'Origin'
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      if (origin !== ALLOWED_ORIGIN) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (url.pathname === '/track' && request.method === 'POST') {
      if (origin !== ALLOWED_ORIGIN) return new Response('Forbidden', { status: 403 });
      let body;
      try {
        body = await request.json();
      } catch (_) {
        return new Response('Bad Request', { status: 400, headers: corsHeaders });
      }

      if (!body || !ALLOWED_EVENTS.has(body.event)) {
        return new Response('Invalid event', { status: 400, headers: corsHeaders });
      }

      const page = typeof body.page === 'string' && body.page.startsWith('/') && body.page.length <= 200
        ? body.page : '/';
      const detail = typeof body.detail === 'string' ? body.detail.slice(0, 80) : '';
      const referrer = typeof body.referrer === 'string' ? body.referrer.slice(0, 120) : '';

      // The schema deliberately does not store IP addresses, cookies, or full referrer URLs.
      await env.DB.prepare(
        'INSERT INTO events (event, page, detail, referrer) VALUES (?, ?, ?, ?)'
      ).bind(body.event, page, detail, referrer).run();

      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (url.pathname === '/api/summary' && request.method === 'GET') {
      // IMPORTANT: protect /api/* with Cloudflare Access before publishing this Worker.
      const [totals, daily, eventRows, detailRows, referrers] = await Promise.all([
        env.DB.prepare("SELECT COUNT(*) AS total FROM events WHERE event='page_view'").first(),
        env.DB.prepare("SELECT substr(created_at,1,10) AS day, COUNT(*) AS views FROM events WHERE event='page_view' AND created_at >= datetime('now','-29 days') GROUP BY day ORDER BY day").all(),
        env.DB.prepare('SELECT event, COUNT(*) AS count FROM events GROUP BY event ORDER BY count DESC').all(),
        env.DB.prepare("SELECT detail, COUNT(*) AS count FROM events WHERE event IN ('experience_open','work_file_open','resume_download') GROUP BY detail ORDER BY count DESC LIMIT 30").all(),
        env.DB.prepare("SELECT referrer, COUNT(*) AS count FROM events WHERE event='page_view' AND referrer != '' GROUP BY referrer ORDER BY count DESC LIMIT 15").all()
      ]);
      return Response.json({
        totalPageViews: totals?.total || 0,
        daily: daily.results || [],
        events: eventRows.results || [],
        popularItems: detailRows.results || [],
        referrers: referrers.results || []
      }, { headers: { 'Cache-Control': 'no-store', ...corsHeaders } });
    }

    if (url.pathname === '/dashboard' && request.method === 'GET') {
      // IMPORTANT: protect /dashboard* with Cloudflare Access before publishing this Worker.
      return new Response(DASHBOARD_HTML, {
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
      });
    }

    return new Response('Not found', { status: 404 });
  }
};

const DASHBOARD_HTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>LopegaWorks Private Analytics</title>
<style>body{font:16px system-ui,sans-serif;max-width:1000px;margin:32px auto;padding:0 16px;color:#172033;background:#f5f7fb}h1{font-size:1.7rem}.muted{color:#64748b}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}.card{background:white;border:1px solid #e2e8f0;border-radius:14px;padding:18px;overflow:auto}.big{font-size:2rem;font-weight:750}table{border-collapse:collapse;width:100%;font-size:.92rem}td,th{text-align:left;padding:8px;border-bottom:1px solid #e2e8f0}h2{font-size:1.1rem}.error{color:#b91c1c}</style></head>
<body><h1>LopegaWorks — Private Analytics</h1><p class="muted">Custom portfolio events. Counts are estimates, not verified unique people.</p><div id="status" class="muted">Loading…</div><div class="grid"><section class="card"><div class="muted">Total page views</div><div class="big" id="total">—</div></section><section class="card"><h2>Event totals</h2><div id="events">—</div></section><section class="card"><h2>Most opened items</h2><div id="items">—</div></section><section class="card"><h2>Referring hostnames</h2><div id="refs">—</div></section><section class="card" style="grid-column:1/-1"><h2>Daily page views (last 30 days)</h2><div id="daily">—</div></section></div>
<script>
const esc=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
function table(rows, cols){if(!rows||!rows.length)return '<p class="muted">No data yet.</p>';return '<table><thead><tr>'+cols.map(c=>'<th>'+esc(c[1])+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+cols.map(c=>'<td>'+esc(r[c[0]])+'</td>').join('')+'</tr>').join('')+'</tbody></table>';}
fetch('/api/summary',{credentials:'same-origin',cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Could not load analytics ('+r.status+'). Confirm Cloudflare Access is enabled and the D1 binding is configured.');return r.json()}).then(d=>{document.getElementById('status').textContent='Updated '+new Date().toLocaleString();document.getElementById('total').textContent=d.totalPageViews;document.getElementById('events').innerHTML=table(d.events,[['event','Event'],['count','Count']]);document.getElementById('items').innerHTML=table(d.popularItems,[['detail','Item'],['count','Opens']]);document.getElementById('refs').innerHTML=table(d.referrers,[['referrer','Hostname'],['count','Visits']]);document.getElementById('daily').innerHTML=table(d.daily,[['day','Date'],['views','Views']]);}).catch(e=>{document.getElementById('status').className='error';document.getElementById('status').textContent=e.message;});
</script></body></html>`;
