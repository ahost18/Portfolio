/* Private portfolio analytics client.
 * Enable owner exclusion with ?dev=true; disable with ?dev=false.
 * Set window.PORTFOLIO_TRACKING_ENDPOINT in this file after deploying the Worker.
 */
(function () {
  const params = new URLSearchParams(window.location.search);
  const STORAGE_KEY = 'lopegaworksDeveloperMode';

  if (params.get('dev') === 'true') localStorage.setItem(STORAGE_KEY, 'true');
  if (params.get('dev') === 'false') localStorage.removeItem(STORAGE_KEY);

  window.PORTFOLIO_DEVELOPER_MODE = localStorage.getItem(STORAGE_KEY) === 'true';
  window.PORTFOLIO_TRACKING_ENDPOINT = 'https://stats.lopegaworks.com/track';

  window.trackPortfolioEvent = function (eventName, details = {}) {
    if (window.PORTFOLIO_DEVELOPER_MODE) return;
    if (!['page_view', 'experience_open', 'work_file_open', 'resume_download'].includes(eventName)) return;

    const payload = {
      event: eventName,
      page: window.location.pathname || '/',
      detail: typeof details.detail === 'string' ? details.detail.slice(0, 80) : '',
      referrer: safeReferrerHost(document.referrer)
    };

    // No cookies, fingerprinting, raw IP storage, or personal form data are sent by this client.
    fetch(window.PORTFOLIO_TRACKING_ENDPOINT, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify(payload),
      keepalive: true,
      credentials: 'omit'
    }).catch(() => {}); // Analytics failure must never interrupt the portfolio.
  };

  function safeReferrerHost(value) {
    try {
      const url = new URL(value);
      return url.hostname.slice(0, 120);
    } catch (_) {
      return '';
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    window.trackPortfolioEvent('page_view');

    document.addEventListener('click', function (event) {
      const link = event.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href') || '';
      if (href.includes('work-files/processing-of-trades.html')) {
        window.trackPortfolioEvent('work_file_open', { detail: 'processing_of_trades' });
      }
      if (link.hasAttribute('download')) {
        window.trackPortfolioEvent('resume_download', { detail: (link.getAttribute('download') || 'download').slice(0, 80) });
      }
    });
  });
})();
