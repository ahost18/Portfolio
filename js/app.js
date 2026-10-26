// Portfolio application logic.
// Edit this file for rendering, interactions, filters, modals, and editor behavior.


    // ACTIVE STATE HOLDER
    let currentData = JSON.parse(JSON.stringify(defaultResumeData));

    // INITIALIZATION ON DOM LOAD
    document.addEventListener('DOMContentLoaded', () => {
      renderApp();
    });

    // RENDER ALL VIEWS ACCORDING TO CURRENT DATA
    function renderApp() {
      renderDashboardHero();
      renderMetrics();
      renderSkillsAndFilters();
      renderEducationAndTrainings();
      renderWorkExperience();
      renderPrintableResume();
      lucide.createIcons();
    }

    // DASHBOARD HERO
    function renderDashboardHero() {
      const info = currentData.personal_information || {};
      const summary = currentData.professional_summary || {};

      document.getElementById('dash-hero-name').textContent = info.full_name || "Name Not Specified";
      document.getElementById('dash-hero-title').textContent = summary.title || "";
      document.getElementById('dash-hero-summary').textContent = summary.summary || "";
      
      const avatarWrapper = document.getElementById('dash-avatar-wrapper');
      const avatarEl = document.getElementById('dash-hero-avatar');

      const dashSizes = {
        'small': 'w-14 h-14 sm:w-16 sm:h-16',
        'medium': 'w-20 h-20 sm:w-24 sm:h-24',
        'large': 'w-28 h-28 sm:w-32 sm:h-32',
        'xlarge': 'w-36 h-36 sm:w-40 sm:h-40'
      };

      if (info.photo_enabled && info.photo_url) {
        avatarEl.className = `rounded-2xl object-cover border-2 border-blue-400/40 shadow-lg bg-slate-850 ${dashSizes[info.photo_size] || dashSizes['medium']}`;
        if (String(info.photo_url).startsWith('encrypted:')) {
          avatarEl.removeAttribute('src');
          loadEncryptedAvatar(avatarEl, String(info.photo_url).slice('encrypted:'.length));
        } else {
          avatarEl.src = info.photo_url;
        }
        avatarWrapper.classList.remove('hidden');
      } else {
        avatarWrapper.classList.add('hidden');
      }

      // Contact Cards
      const contactBox = document.getElementById('dash-contact-box');
      contactBox.innerHTML = `
        <a href="mailto:${info.email || ''}" class="flex items-center space-x-2.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all">
          <i data-lucide="mail" class="w-4 h-4"></i>
          <span class="truncate">${info.email || 'Email'}</span>
        </a>
        <div class="flex items-center space-x-2.5 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium">
          <i data-lucide="phone" class="w-4 h-4 text-blue-400"></i>
          <span>${info.phone || 'Phone'}</span>
        </div>
        <div class="flex items-center space-x-2.5 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium">
          <i data-lucide="map-pin" class="w-4 h-4 text-blue-400"></i>
          <span class="truncate">${info.address || 'Address'}</span>
        </div>
        <div class="flex items-center space-x-2.5 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium">
          <i data-lucide="globe" class="w-4 h-4 text-blue-400"></i>
          <span>${info.portfolio || 'Portfolio'}</span>
        </div>
        <div class="flex items-center space-x-2.5 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium">
          <i data-lucide="linkedin" class="w-4 h-4 text-blue-400"></i>
          <span class="truncate">${info.linkedin || 'LinkedIn'}</span>
        </div>
      `;

      // Target Roles
      const targetRolesContainer = document.getElementById('dash-target-roles');
      const roles = summary.target_positions || [];
      targetRolesContainer.innerHTML = roles.map(r => `
        <span class="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs text-blue-300 font-medium">${r}</span>
      `).join('');
    }

    // DASHBOARD METRICS
    function renderMetrics() {
      const grid = document.getElementById('dash-metrics-grid');
      const jobs = currentData.work_experience || [];
      const erpList = currentData.technical_skills?.enterprise_systems || ["QAD ERP", "SAP"];

      grid.innerHTML = `
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Core AP Focus</span>
            <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <i data-lucide="calculator" class="w-4 h-4"></i>
            </div>
          </div>
          <div class="mt-2 flex items-baseline">
            <span class="text-xl font-bold text-slate-900">AP & GIT</span>
          </div>
          <p class="text-xs text-slate-500 mt-1">Raw materials & freight workflows</p>
        </div>

        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">ERP Competency</span>
            <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <i data-lucide="database" class="w-4 h-4"></i>
            </div>
          </div>
          <div class="mt-2">
            <span class="text-xl font-bold text-slate-900">${erpList.slice(0, 2).join(' & ')}</span>
          </div>
          <p class="text-xs text-slate-500 mt-1">Plus GenLedger & Excel</p>
        </div>

        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Career Roles</span>
            <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <i data-lucide="briefcase" class="w-4 h-4"></i>
            </div>
          </div>
          <div class="mt-2">
            <span class="text-2xl font-bold text-slate-900">${jobs.length} Positions</span>
          </div>
          <p class="text-xs text-slate-500 mt-1">Recorded experience</p>
        </div>

        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Education Track</span>
            <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <i data-lucide="graduation-cap" class="w-4 h-4"></i>
            </div>
          </div>
          <div class="mt-2">
            <span class="text-lg font-bold text-slate-900">BSBA Financial Mgt.</span>
          </div>
          <p class="text-xs text-slate-500 mt-1">Highest Educational Attainment</p>
        </div>
      `;
    }

    // SKILLS & QUICK TAGS
    function renderSkillsAndFilters() {
      const skills = currentData.technical_skills || {};
      const tagsContainer = document.getElementById('dash-quick-tags');
      const allSkills = [
        ...(skills.enterprise_systems || []),
        "Accounts Payable", "Goods in Transit", "Excel"
      ];
      tagsContainer.innerHTML = allSkills.slice(0, 5).map(s => `
        <button onclick="applySkillFilter('${s}')" class="filter-tag px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-medium border border-slate-200 transition-colors">${s}</button>
      `).join('');

      document.getElementById('dash-skills-acct').innerHTML = (skills.accounting_and_finance || []).map(s => `
        <span class="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">${s}</span>
      `).join('');

      document.getElementById('dash-skills-erp').innerHTML = (skills.enterprise_systems || []).map(s => `
        <span class="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">${s}</span>
      `).join('');

      document.getElementById('dash-skills-office').innerHTML = (skills.office_productivity || []).map(s => `
        <span class="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">${s}</span>
      `).join('');
    }

    // EDUCATION & TRAININGS
    function renderEducationAndTrainings() {
      const eduList = currentData.education || [];
      const trainList = currentData.professional_development || [];
      const orgList = currentData.organizational_involvement || [];

      document.getElementById('dash-education-list').innerHTML = eduList.map((edu, idx) => `
        <div>
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-bold text-slate-900">${edu.institution}</h4>
            <span class="text-xs text-slate-500 font-medium">${edu.graduation_year || ''}</span>
          </div>
          <p class="text-xs text-blue-600 font-medium mt-0.5">${edu.degree || edu.qualification || ''}</p>
          ${edu.major ? `<p class="text-xs text-slate-500">Major in ${edu.major}</p>` : ''}
          ${edu.strand_or_specialization ? `<p class="text-xs text-slate-500">Strand: ${edu.strand_or_specialization}</p>` : ''}
        </div>
      `).join('');

      document.getElementById('dash-trainings-list').innerHTML = trainList.map(t => `
        <div class="flex items-center gap-2 text-xs text-slate-700">
          <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-blue-600 flex-shrink-0"></i>
          <span class="font-medium">${t.training}</span>
        </div>
      `).join('');

      document.getElementById('dash-orgs-list').innerHTML = orgList.map(o => `
        <p class="text-xs font-bold text-slate-800">${o.organization}</p>
        <p class="text-xs text-slate-500">${o.membership}</p>
      `).join('');
    }

    // EXPERIENCE OVERVIEW MODAL — interactive dashboard only; excluded from print.
    function escapeExperienceHtml(value) {
      return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      }[char]));
    }

    // Compact encrypted-asset loader. The embedded key deters casual repository browsing,
    // but cannot provide confidentiality against a determined visitor to this public website.
    async function decryptPortfolioAsset(assetPath) {
      if (!window.crypto?.subtle) throw new Error('Web Crypto unavailable');
      const response = await fetch(new URL(assetPath, document.baseURI));
      if (!response.ok) throw new Error('Encrypted asset could not be loaded');
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.length < 29) throw new Error('Encrypted asset is incomplete');
      const nonce = bytes.slice(0, 12);
      const payload = bytes.slice(12);
      const mask = 0xA7;
      const material = new Uint8Array([0x2a, 0xad, 0xe0, 0x13, 0x83, 0x45, 0x22, 0xf2, 0xa0, 0xe4, 0xec, 0x35, 0x8a, 0x84, 0xc5, 0x9d, 0x02, 0x99, 0x8e, 0x27, 0xa3, 0x7e, 0x83, 0xff, 0xd5, 0x25, 0x50, 0x39, 0x8d, 0xf2, 0xf6, 0x61].map(v => v ^ mask));
      const cryptoKey = await crypto.subtle.importKey('raw', material, { name: 'AES-GCM' }, false, ['decrypt']);
      const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: nonce }, cryptoKey, payload);
      return URL.createObjectURL(new Blob([plain], { type: 'image/jpeg' }));
    }

    async function loadEncryptedAvatar(imageEl, assetPath) {
      if (!imageEl) return;
      try {
        const blobUrl = await decryptPortfolioAsset(assetPath);
        const oldUrl = imageEl.dataset.portfolioBlobUrl;
        if (oldUrl) URL.revokeObjectURL(oldUrl);
        imageEl.dataset.portfolioBlobUrl = blobUrl;
        imageEl.src = blobUrl;
      } catch (error) {
        imageEl.removeAttribute('src');
        imageEl.alt = 'Profile photo unavailable';
        console.warn('Could not load encrypted portfolio profile image.', error);
      }
    }

    async function renderEncryptedPortfolioPhoto(assetPath, altText) {
      const holder = document.getElementById('experience-encrypted-photo');
      if (!holder) throw new Error('Photo container unavailable');
      const blobUrl = await decryptPortfolioAsset(assetPath);
      holder.className = 'relative h-44 overflow-hidden bg-slate-200 sm:h-56';
      holder.innerHTML = `<img src="${blobUrl}" alt="${escapeExperienceHtml(altText)}" class="h-full w-full object-cover"><div class="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/50 to-transparent"></div><span class="absolute bottom-3 left-4 rounded-lg border border-white/30 bg-slate-950/50 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">Workplace photo</span>`;
      const renderedImage = holder.querySelector('img');
      renderedImage.addEventListener('load', () => URL.revokeObjectURL(blobUrl), { once: true });
    }

    async function openExperienceModal(index) {
      const job = (currentData.work_experience || [])[index];
      if (!job) return;
      const details = job.portfolio_details || {};
      const title = job.position || 'Work Experience';
      const company = job.company || 'Company not specified';
      const period = `${job.employment_period?.start || ''}${job.employment_period?.end ? ` – ${job.employment_period.end}` : ''}`;
      const tools = job.systems_and_tools || [];
      const skills = job.skills_demonstrated || [];
      const responsibilities = job.responsibilities || [];
      const takeaways = details.takeaways || [];
      const photoAlt = escapeExperienceHtml(details.image_alt || `${company} workplace`);
      const photoUrl = String(details.image_url || '').trim();
      const encryptedPhoto = photoUrl.startsWith('encrypted:');
      const photoMarkup = encryptedPhoto
        ? `<div id="experience-encrypted-photo" class="flex h-44 items-center justify-center bg-gradient-to-br from-slate-200 via-blue-50 to-indigo-100 p-6 text-center sm:h-56"><div><div class="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white/75 text-blue-600 shadow-sm"><i data-lucide="image" class="h-7 w-7"></i></div><p class="text-sm font-bold text-slate-700">Loading workplace photo…</p><p class="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-slate-500">Encrypted portfolio asset</p></div></div>`
        : photoUrl
          ? `<div class="relative h-44 overflow-hidden bg-slate-200 sm:h-56"><img src="${escapeExperienceHtml(photoUrl)}" alt="${photoAlt}" class="h-full w-full object-cover" onerror="this.style.display='none';this.nextElementSibling.classList.remove('hidden');this.nextElementSibling.classList.add('flex')"><div class="hidden h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 via-blue-50 to-indigo-100 p-6 text-center"><div><div class="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-blue-600 shadow-sm"><i data-lucide="image" class="h-7 w-7"></i></div><p class="text-sm font-semibold text-slate-700">Company photo placeholder</p><p class="mt-1 text-xs text-slate-500">Set portfolio_details.image_url to a valid image path.</p></div></div><div class="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/50 to-transparent"></div><span class="absolute bottom-3 left-4 rounded-lg border border-white/30 bg-slate-950/50 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">Workplace photo</span></div>`
          : `<div class="flex h-44 items-center justify-center bg-gradient-to-br from-slate-200 via-blue-50 to-indigo-100 p-6 text-center sm:h-56"><div><div class="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white/75 text-blue-600 shadow-sm"><i data-lucide="image-plus" class="h-7 w-7"></i></div><p class="text-sm font-bold text-slate-700">Company / workplace photo</p><p class="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-slate-500">${escapeExperienceHtml(details.image_note || 'Image placeholder — add an approved company photo later.')}</p></div></div>`;

      const section = (number, heading, body) => `
        <section class="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <div class="mb-3 flex items-center gap-2.5"><span class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[11px] font-extrabold text-blue-700">${number}</span><h3 class="text-sm font-bold text-slate-900">${heading}</h3></div>
          ${body}
        </section>`;

      const responsibilitiesHtml = responsibilities.length
        ? `<ul class="space-y-2.5 text-sm leading-relaxed text-slate-600">${responsibilities.map(item => `<li class="flex gap-2.5"><i data-lucide="check-circle-2" class="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500"></i><span>${escapeExperienceHtml(item)}</span></li>`).join('')}</ul>`
        : `<p class="text-sm text-slate-500">Add responsibilities for this role in the experience data.</p>`;
      const toolsHtml = [...tools, ...skills].length
        ? `<div class="flex flex-wrap gap-2">${[...tools, ...skills].map(item => `<span class="rounded-lg border ${tools.includes(item) ? 'border-blue-100 bg-blue-50 text-blue-700' : 'border-slate-200 bg-slate-100 text-slate-700'} px-2.5 py-1.5 text-xs font-medium">${escapeExperienceHtml(item)}</span>`).join('')}</div>`
        : `<p class="text-sm text-slate-500">Add systems and skills in the experience data.</p>`;
      const takeawaysHtml = takeaways.length
        ? `<ul class="space-y-2 text-sm leading-relaxed text-slate-600">${takeaways.map(item => `<li class="flex gap-2.5"><span class="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500"></span><span>${escapeExperienceHtml(item)}</span></li>`).join('')}</ul>`
        : `<p class="text-sm text-slate-500">Add your key takeaways here.</p>`;

      document.getElementById('experience-modal-content').innerHTML = `
        ${photoMarkup}
        <div class="space-y-4 p-4 sm:p-6">
          <header class="pb-1">
            <div class="mb-2 flex flex-wrap items-center gap-2"><span class="rounded-lg bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-800">${escapeExperienceHtml(job.employment_type || 'Work Experience')}</span><span class="text-xs text-slate-500">${escapeExperienceHtml(period)}</span></div>
            <h2 id="experience-modal-title" class="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">${escapeExperienceHtml(title)}</h2>
            <p class="mt-1 font-semibold text-blue-700">${escapeExperienceHtml(company)}</p>
            ${job.work_location ? `<p class="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><i data-lucide="map-pin" class="h-3.5 w-3.5"></i>${escapeExperienceHtml(job.work_location)}</p>` : ''}
          </header>
          ${section('01', 'Role overview', `<p class="text-sm leading-7 text-slate-600">${escapeExperienceHtml(details.overview || 'Add a short explanation of this role and its place in your career.')}</p>`)}
          ${section('02', 'What I worked on', responsibilitiesHtml)}
          ${details.additional_exposure ? section('03', 'Additional exposure', `<p class="text-sm leading-7 text-slate-600">${escapeExperienceHtml(details.additional_exposure)}</p>`) : ''}
          ${section(details.additional_exposure ? '04' : '03', 'Systems & skills', toolsHtml)}
          ${section(details.additional_exposure ? '05' : '04', 'My reflection', `<p class="text-sm leading-7 text-slate-600">${escapeExperienceHtml(details.reflection || 'Placeholder')}</p><p class="mt-3 border-l-2 border-blue-300 pl-3 text-xs italic leading-relaxed text-slate-500">Placeholder</p>`)}
          ${section(details.additional_exposure ? '06' : '05', 'What I take forward', takeawaysHtml)}
          ${company === 'Alfamart Trading Philippines' && title === 'Accounting Clerk' ? section('07', 'Work file', `<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><p class="text-sm font-semibold text-slate-800">Processing of Trades</p><p class="mt-1 text-xs leading-relaxed text-slate-500">Online reference guide covering Outright and Direct-to-Store (DSA) billing procedures.</p></div><a href="work-files/processing-of-trades.html" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700">Read work file <i data-lucide="book-open" class="h-4 w-4"></i></a></div>`) : ''}
        </div>`;

      if (encryptedPhoto) {
        try {
          await renderEncryptedPortfolioPhoto(photoUrl.slice('encrypted:'.length), photoAlt);
        } catch (error) {
          const holder = document.getElementById('experience-encrypted-photo');
          if (holder) holder.innerHTML = `<div><p class="text-sm font-semibold text-slate-700">Photo unavailable</p><p class="mt-1 text-xs text-slate-500">Check that the encrypted asset was uploaded with the website.</p></div>`;
        }
      }

      const modal = document.getElementById('experience-modal');
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.classList.add('overflow-hidden');
      if (window.lucide) lucide.createIcons();
      document.getElementById('experience-modal-close').focus();
    }

    function closeExperienceModal() {
      const modal = document.getElementById('experience-modal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.classList.remove('overflow-hidden');
    }

    function handleExperienceBackdropClick(event) {
      if (event.target && event.target.id === 'experience-modal') closeExperienceModal();
    }

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !document.getElementById('experience-modal')?.classList.contains('hidden')) {
        closeExperienceModal();
      }
    });

    // WORK EXPERIENCE CARDS
    function renderWorkExperience() {
      const jobs = currentData.work_experience || [];
      const container = document.getElementById('dash-jobs-container');
      document.getElementById('dash-role-count').textContent = `${jobs.length} Roles Recorded`;

      container.innerHTML = jobs.map((job, idx) => {
        const start = job.employment_period?.start || '';
        const end = job.employment_period?.end || '';
        const periodStr = `${start} – ${end}`;
        const searchTokens = [...(job.systems_and_tools || []), ...(job.skills_demonstrated || []), job.company, job.position, job.work_location || ''].join(' ').toLowerCase();

        return `
          <div class="job-card transition-all duration-200 rounded-xl p-4 sm:p-5 border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-200 hover:shadow-md" data-skills="${searchTokens}">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
              <div>
                <h4 class="font-bold text-slate-900 text-sm sm:text-base">${job.position}</h4>
                <p class="text-xs font-semibold text-blue-600">${job.company} ${job.work_location ? `<span class="text-slate-500 font-normal">(${job.work_location})</span>` : ''}</p>
              </div>
              <div class="sm:text-right">
                <span class="inline-block px-2.5 py-1 rounded-md ${idx === 0 ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700'} font-semibold text-xs">${periodStr}</span>
                ${job.employment_type ? `<p class="text-[11px] text-slate-400 mt-0.5">${job.employment_type}</p>` : ''}
              </div>
            </div>

            <ul class="mt-3 space-y-2 text-xs text-slate-700 list-disc pl-4 leading-relaxed">
              ${(job.responsibilities || []).map(r => `<li>${r}</li>`).join('')}
            </ul>

            <div class="mt-4 pt-3 border-t border-slate-200/60 flex flex-wrap gap-1.5">
              ${(job.systems_and_tools || []).map(sys => `<span class="px-2 py-0.5 bg-blue-50 text-blue-700 text-[11px] font-semibold rounded border border-blue-100">${sys}</span>`).join('')}
              ${(job.skills_demonstrated || []).slice(0, 5).map(sk => `<span class="px-2 py-0.5 bg-slate-200 text-slate-700 text-[11px] font-medium rounded">${sk}</span>`).join('')}
            </div>
            <div class="no-print mt-4 flex items-center justify-between gap-3">
              <p class="text-[11px] text-slate-400">Want more context about this role?</p>
              <button type="button" onclick="openExperienceModal(${idx})" class="inline-flex flex-shrink-0 items-center gap-2 rounded-xl border border-blue-200 bg-white px-3.5 py-2 text-xs font-bold text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                View Experience <i data-lucide="arrow-up-right" class="h-3.5 w-3.5"></i>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    // RENDER A4 PRINTABLE RESUME VIEW
    function renderPrintableResume() {
      const info = currentData.personal_information || {};
      const summary = currentData.professional_summary || {};
      const skills = currentData.technical_skills || {};
      const jobs = currentData.work_experience || [];
      const eduList = currentData.education || [];
      const trainList = currentData.professional_development || [];
      const orgList = currentData.organizational_involvement || [];

      document.getElementById('res-name').textContent = info.full_name || '';
      document.getElementById('res-title').textContent = summary.title || '';

      const resAvatarWrapper = document.getElementById('res-avatar-wrapper');
      const resAvatarEl = document.getElementById('res-avatar');

      const resSizes = {
        'small': 'w-12 h-16 sm:w-14 sm:h-18',
        'medium': 'w-16 h-20 sm:w-20 sm:h-24',
        'large': 'w-24 h-30 sm:w-28 sm:h-36',
        'xlarge': 'w-32 h-40 sm:w-36 sm:h-48'
      };

      if (info.photo_enabled && info.photo_url) {
        resAvatarEl.className = `object-cover rounded border border-slate-400 shadow-sm bg-slate-100 ${resSizes[info.photo_size] || resSizes['medium']}`;
        if (String(info.photo_url).startsWith('encrypted:')) {
          resAvatarEl.removeAttribute('src');
          loadEncryptedAvatar(resAvatarEl, String(info.photo_url).slice('encrypted:'.length));
        } else {
          resAvatarEl.src = info.photo_url;
        }
        resAvatarWrapper.classList.remove('hidden');
      } else {
        resAvatarWrapper.classList.add('hidden');
      }

      document.getElementById('res-contact').innerHTML = `
        <span>📍 ${info.address || ''}</span>
        <span>📞 ${info.phone || ''}</span>
        <span>✉️ ${info.email || ''}</span>
        <span>🔗 ${info.linkedin || ''}</span>
        <span>🌐 ${info.portfolio || ''}</span>
      `;

      document.getElementById('res-summary').textContent = summary.summary || '';

      document.getElementById('res-skills-matrix').innerHTML = `
        <div class="col-span-3 font-semibold text-slate-800">Accounting & Finance:</div>
        <div class="col-span-9 text-slate-700">${(skills.accounting_and_finance || []).join(', ')}</div>

        <div class="col-span-3 font-semibold text-slate-800">Enterprise Systems:</div>
        <div class="col-span-9 text-slate-700">${(skills.enterprise_systems || []).join(', ')}</div>

        <div class="col-span-3 font-semibold text-slate-800">Office & Tools:</div>
        <div class="col-span-9 text-slate-700">${(skills.office_productivity || []).join(', ')}</div>
      `;

      document.getElementById('res-jobs-container').innerHTML = jobs.map(job => `
        <div class="space-y-1 page-break-inside-avoid">
          <div class="flex justify-between items-baseline font-bold text-slate-900 text-[9.5pt]">
            <span>${job.position}</span>
            <span>${job.employment_period?.start || ''} – ${job.employment_period?.end || ''}</span>
          </div>
          <div class="flex justify-between items-baseline text-blue-800 font-semibold text-[9pt]">
            <span>${job.company} ${job.work_location ? `(${job.work_location})` : ''}</span>
            <span class="text-slate-500 font-normal italic">${job.employment_type || ''}</span>
          </div>
          <ul class="list-disc pl-4 text-[9pt] text-slate-700 space-y-0.5 leading-tight">
            ${(job.responsibilities || []).map(r => `<li>${r}</li>`).join('')}
          </ul>
        </div>
      `).join('');

      document.getElementById('res-edu-container').innerHTML = eduList.map((edu, idx) => `
        <div class="flex justify-between text-[9.5pt]">
          <div>
            <span class="font-bold text-slate-900">${edu.institution}</span> — 
            <span class="text-slate-700">${edu.degree || edu.qualification || ''} ${edu.major ? `(${edu.major})` : ''} ${edu.strand_or_specialization ? `(${edu.strand_or_specialization})` : ''}</span>
          </div>
          <span class="font-semibold text-slate-800">${edu.graduation_year || ''}</span>
        </div>
      `).join('');

      document.getElementById('res-trainings-list').innerHTML = trainList.map(t => `
        <li>${t.training}</li>
      `).join('');

      document.getElementById('res-orgs-container').innerHTML = orgList.map(o => `
        <p class="text-[8.5pt] text-slate-800 font-bold">${o.organization}</p>
        <p class="text-[8.5pt] text-slate-600">${o.membership}</p>
      `).join('');
    }

    // VIEW SWITCHER
    function switchView(mode) {
      const dashboard = document.getElementById('dashboard-view');
      const resume = document.getElementById('resume-view');
      const btnDash = document.getElementById('btn-view-dashboard');
      const btnRes = document.getElementById('btn-view-resume');

      if (mode === 'dashboard') {
        dashboard.classList.remove('hidden');
        resume.classList.add('hidden');

        btnDash.className = "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all bg-blue-600 text-white shadow-sm";
        btnRes.className = "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all text-slate-300 hover:text-white";
      } else {
        dashboard.classList.add('hidden');
        resume.classList.remove('hidden');

        btnRes.className = "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all bg-blue-600 text-white shadow-sm";
        btnDash.className = "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all text-slate-300 hover:text-white";
      }
    }

    // SEARCH & FILTER LOGIC
    function applySkillFilter(keyword) {
      document.getElementById('skill-search').value = keyword;
      filterBySearch();
    }

    function filterBySearch() {
      const query = document.getElementById('skill-search').value.toLowerCase().trim();
      const jobCards = document.querySelectorAll('.job-card');
      const resetBtn = document.getElementById('btn-reset-filter');

      if (query.length > 0) {
        resetBtn.classList.remove('hidden');
      } else {
        resetBtn.classList.add('hidden');
      }

      jobCards.forEach(card => {
        const skills = card.getAttribute('data-skills').toLowerCase();
        const text = card.textContent.toLowerCase();

        if (skills.includes(query) || text.includes(query)) {
          card.style.display = 'block';
          card.classList.add('ring-2', 'ring-blue-500/50', 'bg-blue-50/30');
        } else {
          card.style.display = 'none';
          card.classList.remove('ring-2', 'ring-blue-500/50', 'bg-blue-50/30');
        }
      });
    }

    function resetSkillFilter() {
      document.getElementById('skill-search').value = '';
      filterBySearch();
    }

    // LOCAL IMAGE UPLOAD HANDLER
    function handleLocalImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        document.getElementById('form-photo-url').value = e.target.result;
        document.getElementById('upload-file-status').textContent = `Loaded: ${file.name}`;
        document.getElementById('upload-file-status').className = "text-emerald-400 font-medium";
        showToast("Image loaded from device successfully!", "success");
      };
      reader.readAsDataURL(file);
    }

    // EDITOR MODAL CONTROLLERS
    function openEditorModal() {
      populateVisualForm();
      populateJsonTextarea();
      document.getElementById('editor-modal').classList.remove('hidden');
    }

    function closeEditorModal() {
      document.getElementById('editor-modal').classList.add('hidden');
    }

    function switchEditorTab(tab) {
      const visualTab = document.getElementById('editor-tab-visual');
      const jsonTab = document.getElementById('editor-tab-json');
      const btnVisual = document.getElementById('tab-btn-visual');
      const btnJson = document.getElementById('tab-btn-json');

      if (tab === 'visual') {
        visualTab.classList.remove('hidden');
        jsonTab.classList.add('hidden');
        btnVisual.className = "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all bg-blue-600 text-white";
        btnJson.className = "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all text-slate-400 hover:text-white";
      } else {
        visualTab.classList.add('hidden');
        jsonTab.classList.remove('hidden');
        btnJson.className = "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all bg-blue-600 text-white";
        btnVisual.className = "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all text-slate-400 hover:text-white";
      }
    }

    function populateVisualForm() {
      const info = currentData.personal_information || {};
      const summary = currentData.professional_summary || {};
      const skills = currentData.technical_skills || {};

      document.getElementById('form-full-name').value = info.full_name || '';
      document.getElementById('form-title').value = summary.title || '';
      document.getElementById('form-photo-enabled').checked = !!info.photo_enabled;
      document.getElementById('form-photo-size').value = info.photo_size || 'medium';
      document.getElementById('form-photo-url').value = info.photo_url || '';
      
      if (info.photo_url && info.photo_url.startsWith('data:image')) {
        document.getElementById('upload-file-status').textContent = "Custom local image loaded";
        document.getElementById('upload-file-status').className = "text-emerald-400 font-medium";
      } else {
        document.getElementById('upload-file-status').textContent = "No custom image uploaded yet";
        document.getElementById('upload-file-status').className = "text-slate-400 italic";
      }

      document.getElementById('form-email').value = info.email || '';
      document.getElementById('form-phone').value = info.phone || '';
      document.getElementById('form-address').value = info.address || '';
      document.getElementById('form-linkedin').value = info.linkedin || '';
      document.getElementById('form-summary').value = summary.summary || '';

      document.getElementById('form-skills-acct').value = (skills.accounting_and_finance || []).join(', ');
      document.getElementById('form-skills-erp').value = (skills.enterprise_systems || []).join(', ');
    }

    function populateJsonTextarea() {
      document.getElementById('json-code-textarea').value = JSON.stringify(currentData, null, 2);
      validateJsonTextarea();
    }

    function validateJsonTextarea() {
      const code = document.getElementById('json-code-textarea').value;
      const statusTag = document.getElementById('json-status-tag');
      try {
        JSON.parse(code);
        statusTag.textContent = "Valid JSON";
        statusTag.className = "text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
        return true;
      } catch (err) {
        statusTag.textContent = "Syntax Error";
        statusTag.className = "text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30";
        return false;
      }
    }

    function saveEditorChanges() {
      const activeTabIsVisual = !document.getElementById('editor-tab-visual').classList.contains('hidden');

      if (activeTabIsVisual) {
        if (!currentData.personal_information) currentData.personal_information = {};
        if (!currentData.professional_summary) currentData.professional_summary = {};
        if (!currentData.technical_skills) currentData.technical_skills = {};

        currentData.personal_information.full_name = document.getElementById('form-full-name').value;
        currentData.professional_summary.title = document.getElementById('form-title').value;
        currentData.personal_information.photo_enabled = document.getElementById('form-photo-enabled').checked;
        currentData.personal_information.photo_size = document.getElementById('form-photo-size').value;
        
        const customPhotoUrl = document.getElementById('form-photo-url').value;
        if (customPhotoUrl) {
          currentData.personal_information.photo_url = customPhotoUrl;
        }

        currentData.personal_information.email = document.getElementById('form-email').value;
        currentData.personal_information.phone = document.getElementById('form-phone').value;
        currentData.personal_information.address = document.getElementById('form-address').value;
        currentData.personal_information.linkedin = document.getElementById('form-linkedin').value;
        currentData.professional_summary.summary = document.getElementById('form-summary').value;

        const acctSkills = document.getElementById('form-skills-acct').value.split(',').map(s => s.trim()).filter(Boolean);
        const erpSkills = document.getElementById('form-skills-erp').value.split(',').map(s => s.trim()).filter(Boolean);

        currentData.technical_skills.accounting_and_finance = acctSkills;
        currentData.technical_skills.enterprise_systems = erpSkills;

        renderApp();
        showToast("Changes updated successfully!", "success");
        closeEditorModal();
      } else {
        const code = document.getElementById('json-code-textarea').value;
        try {
          const parsed = JSON.parse(code);
          currentData = parsed;
          renderApp();
          showToast("JSON updated and re-rendered!", "success");
          closeEditorModal();
        } catch (err) {
          showToast("Cannot apply: Invalid JSON syntax.", "error");
        }
      }
    }

    // FILE UPLOAD HANDLER
    function handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const parsed = JSON.parse(e.target.result);
          currentData = parsed;
          renderApp();
          showToast(`Loaded ${file.name} successfully!`, "success");
        } catch (err) {
          showToast("Failed to parse uploaded JSON file.", "error");
        }
      };
      reader.readAsText(file);
    }

    // DOWNLOAD JSON FILE
    function downloadJsonFile() {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `${(currentData.personal_information?.full_name || 'resume').toLowerCase().replace(/\s+/g, '_')}_profile.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast("JSON file download started.", "info");
    }

    // RESET DATA
    function resetToDefaultData() {
      currentData = JSON.parse(JSON.stringify(defaultResumeData));
      renderApp();
      populateVisualForm();
      populateJsonTextarea();
      showToast("Reset to default profile data.", "info");
    }

    // TOAST NOTIFICATIONS
    function showToast(message, type = "info") {
      const container = document.getElementById('toast-container');
      const toast = document.createElement('div');

      let bgClass = "bg-slate-900 border-slate-700 text-white";
      if (type === "success") bgClass = "bg-emerald-950 border-emerald-800 text-emerald-200";
      if (type === "error") bgClass = "bg-rose-950 border-rose-800 text-rose-200";

      toast.className = `px-4 py-3 rounded-xl border shadow-xl text-xs font-semibold flex items-center space-x-2 transition-all transform translate-y-2 opacity-0 pointer-events-auto ${bgClass}`;
      toast.innerHTML = `<span>${message}</span>`;

      container.appendChild(toast);

      setTimeout(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
      }, 50);

      setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
  
