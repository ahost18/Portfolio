/* Portfolio diagnostics: local app/data checks plus deployment-version checks. */
(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const statusDot = $('site-health-dot'), statusLabel = $('site-health-label');
  const summary = $('site-health-summary'), checksList = $('site-health-checks');
  const details = $('site-health-details'), toggle = $('site-health-toggle');
  const timeLabel = $('site-health-time');
  if (!statusDot || !statusLabel || !summary || !checksList || !details || !toggle) return;

  toggle.addEventListener('click', () => {
    const open = details.classList.contains('hidden');
    details.classList.toggle('hidden', !open); toggle.setAttribute('aria-expanded', String(open));
  });
  $('site-health-run')?.addEventListener('click', runChecks);
  $('site-health-refresh')?.addEventListener('click', () => window.location.reload());

  function addCheck(label, result, detail) {
    const li = document.createElement('li');
    const icon = result === 'pass' ? '✓' : result === 'warn' ? '!' : result === 'fail' ? '✕' : '•';
    li.textContent = `${icon} ${label}: ${detail}`;
    li.className = result === 'pass' ? 'text-emerald-700' : result === 'warn' ? 'text-amber-700' : result === 'fail' ? 'text-rose-700' : 'text-slate-600';
    checksList.appendChild(li);
  }
  function setStatus(kind, label, message) {
    const classes = { pass:'bg-emerald-500', warn:'bg-amber-500', fail:'bg-rose-500', checking:'bg-slate-400' };
    statusDot.className = `inline-block h-2.5 w-2.5 rounded-full ${classes[kind] || classes.checking}`;
    statusLabel.textContent = label; summary.textContent = message;
  }
  function extractResumeData(source) {
    const match = source.match(/const\s+defaultResumeData\s*=\s*([\s\S]*?)\s*;\s*$/);
    if (!match) throw new Error('Could not find defaultResumeData in the fetched file.');
    return JSON.parse(match[1]);
  }
  async function fetchFresh(path) {
    const url = new URL(path, document.baseURI);
    url.searchParams.set('__healthcheck', `${Date.now()}-${Math.random().toString(36).slice(2)}`);
    const response = await fetch(url.href, { cache:'no-store', credentials:'same-origin', headers:{'Cache-Control':'no-cache'} });
    if (!response.ok) throw new Error(`${path} returned HTTP ${response.status}.`);
    return response;
  }
  async function checkDeployment() {
    let build;
    try {
      const response = await fetchFresh('build-info.json');
      build = await response.json();
      if (!build.commit) throw new Error('build-info.json has no commit field.');
      const pageCommit = document.querySelector('meta[name="portfolio-build-commit"]')?.content || '';
      if (!pageCommit || pageCommit === '__BUILD_COMMIT__') {
        addCheck('Loaded page version', 'warn', 'This page has no embedded build identifier; it may be an unprocessed or stale HTML file.');
      } else if (pageCommit.toLowerCase() === String(build.commit).toLowerCase()) {
        addCheck('Loaded page vs deployment', 'pass', `Both identify commit ${String(build.commit).slice(0,7)}.`);
      } else {
        addCheck('Loaded page vs deployment', 'warn', `Page HTML identifies ${pageCommit.slice(0,7)}, while fresh deployment metadata identifies ${String(build.commit).slice(0,7)}. The HTML may be cached.`);
      }
      const deployedAt = build.deployedAt ? new Date(build.deployedAt).toLocaleString() : 'timestamp unavailable';
      addCheck('Deployment metadata', 'pass', `Deployed commit ${String(build.commit).slice(0,7)}; ${deployedAt}.`);
    } catch (e) {
      addCheck('Deployment metadata', 'warn', `Unable to read fresh build-info.json (${e.message || 'unknown error'}).`);
      return { warning:true };
    }

    // Cache GitHub's public API response in sessionStorage for 10 minutes.
    try {
      const key = 'portfolio-health-github-main-v1';
      let latest = null;
      try { latest = JSON.parse(sessionStorage.getItem(key) || 'null'); } catch (_) {}
      if (!latest || !latest.savedAt || Date.now() - latest.savedAt > 10 * 60 * 1000) {
        const response = await fetch('https://api.github.com/repos/ahost18/Portfolio/commits/main', {
          cache:'no-store', headers:{'Accept':'application/vnd.github+json'}
        });
        if (!response.ok) throw new Error(`GitHub API returned HTTP ${response.status}${response.status === 403 || response.status === 429 ? ' (rate limit or access restriction)' : ''}.`);
        const data = await response.json();
        latest = { sha:data.sha, savedAt:Date.now() };
        try { sessionStorage.setItem(key, JSON.stringify(latest)); } catch (_) {}
      }
      if (!latest.sha) throw new Error('GitHub did not return a commit SHA.');
      const same = String(latest.sha).toLowerCase() === String(build.commit).toLowerCase();
      addCheck('GitHub main vs deployed', same ? 'pass' : 'warn', same ? `Latest main commit matches deployed commit ${String(build.commit).slice(0,7)}.` : `GitHub main is ${String(latest.sha).slice(0,7)} but the site reports ${String(build.commit).slice(0,7)}. A deployment may be pending or have failed; this alone does not prove failure.`);
      return { warning:!same };
    } catch (e) {
      addCheck('GitHub deployment comparison', 'warn', `Unable to verify latest GitHub commit (${e.message || 'network error'}). Local checks remain available; no API token is used.`);
      return { warning:true };
    }
  }
  async function runChecks() {
    setStatus('checking', 'Site status: Checking…', 'Checking application readiness, fresh resume data, deployment metadata, and GitHub main.');
    checksList.replaceChildren(); timeLabel.textContent = '';
    const started = new Date(); let warning = false;
    const appReady = typeof defaultResumeData !== 'undefined' && document.getElementById('dashboard-view') !== null;
    addCheck('Application', appReady ? 'pass' : 'warn', appReady ? 'Expected portfolio markup and resume data object are present.' : 'Expected application elements or resume data were not found.');
    if (!appReady) {
      setStatus('fail', 'Site status: Application issue', 'The page may have loaded incompletely or a required script may have failed.');
      timeLabel.textContent = `Checked ${started.toLocaleTimeString()}`; return;
    }
    try {
      const response = await fetchFresh('js/resume-data.js');
      const freshData = extractResumeData(await response.text());
      const matches = JSON.stringify(defaultResumeData) === JSON.stringify(freshData);
      addCheck('Resume data request', 'pass', `Fresh file returned HTTP ${response.status}.`);
      addCheck('Loaded vs fresh data', matches ? 'pass' : 'warn', matches ? 'The data currently loaded in this tab matches the fresh file response.' : 'The data currently loaded in this tab differs from the fresh file response; a stale tab or cached script is possible.');
      warning = !matches;
    } catch (e) {
      addCheck('Fresh resume data', 'warn', e.message || 'The request or data validation failed.'); warning = true;
    }
    const deployment = await checkDeployment(); warning = warning || deployment.warning;
    if (warning) setStatus('warn', 'Site status: Review warnings', 'One or more checks need attention. A warning can indicate caching, a pending deployment, or a network/API limitation; it does not automatically mean the website is broken.');
    else setStatus('pass', 'Site status: Checks passed', 'The app, fresh resume data, deployment metadata, and GitHub commit comparison all look consistent.');
    timeLabel.textContent = `Checked ${started.toLocaleTimeString()}`;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(runChecks, 0), { once:true });
  else setTimeout(runChecks, 0);
})();
