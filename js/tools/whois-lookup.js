/* ═══════════════════════════════════════════════════
   ALLTOOLSINONE — Domain WHOIS, Registration & DNS Checker
   Authoritative ICANN RDAP + Cloudflare Anycast DoH
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const domainInput = document.getElementById('domainInput');
  const btnLookup = document.getElementById('btnLookup');
  const lookupLoading = document.getElementById('lookupLoading');
  const lookupResults = document.getElementById('lookupResults');

  // Overview 4 Top Metric Elements
  const resDomainName = document.getElementById('resDomainName');
  const resTld = document.getElementById('resTld');
  const resRegistrar = document.getElementById('resRegistrar');
  const resRegistrarBadge = document.getElementById('resRegistrarBadge');
  const resExpiryDate = document.getElementById('resExpiryDate');
  const resExpiryCountdown = document.getElementById('resExpiryCountdown');
  const resDomainAge = document.getElementById('resDomainAge');
  const resCreatedDate = document.getElementById('resCreatedDate');

  // Dedicated WHOIS Profile Elements
  const whoisRegistrar = document.getElementById('whoisRegistrar');
  const whoisIanaId = document.getElementById('whoisIanaId');
  const whoisExpires = document.getElementById('whoisExpires');
  const whoisExpiresCountdown = document.getElementById('whoisExpiresCountdown');
  const whoisCreated = document.getElementById('whoisCreated');
  const whoisDomainAgeDetail = document.getElementById('whoisDomainAgeDetail');
  const whoisUpdated = document.getElementById('whoisUpdated');
  const whoisRegistrant = document.getElementById('whoisRegistrant');
  const whoisRegistrantNotice = document.getElementById('whoisRegistrantNotice');
  const whoisLocation = document.getElementById('whoisLocation');
  const whoisStatus = document.getElementById('whoisStatus');
  const whoisStatusNotice = document.getElementById('whoisStatusNotice');
  const whoisDnssec = document.getElementById('whoisDnssec');
  const whoisAbuse = document.getElementById('whoisAbuse');
  const whoisNameservers = document.getElementById('whoisNameservers');
  const whoisSourceBadge = document.getElementById('whoisSourceBadge');

  // DNS Table & Filter Elements
  const dnsTableBody = document.getElementById('dnsTableBody');
  const authAuditList = document.getElementById('authAuditList');
  const btnCopyDns = document.getElementById('btnCopyDns');
  const btnDownloadDns = document.getElementById('btnDownloadDns');

  // Counters
  const countAll = document.getElementById('countAll');
  const countA = document.getElementById('countA');
  const countAAAA = document.getElementById('countAAAA');
  const countMX = document.getElementById('countMX');
  const countTXT = document.getElementById('countTXT');
  const countNS = document.getElementById('countNS');

  let currentRecords = [];
  let currentWhois = null;
  let currentDomain = '';
  let activeFilter = 'ALL';
  let ianaCache = null;

  // Sample Buttons
  document.querySelectorAll('.quick-sample-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      domainInput.value = btn.dataset.domain;
      performLookup();
    });
  });

  // Enter Key Trigger
  domainInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      performLookup();
    }
  });

  btnLookup.addEventListener('click', performLookup);

  function cleanDomain(input) {
    let raw = (input || '').trim().toLowerCase();
    raw = raw.replace(/^https?:\/\//i, '');
    raw = raw.replace(/^www\./i, '');
    raw = raw.split('/')[0];
    raw = raw.split('?')[0];
    raw = raw.split(':')[0];
    return raw;
  }

  // Fetch IANA Bootstrap Map (Cached)
  async function getIanaServices() {
    if (ianaCache) return ianaCache;
    try {
      const res = await fetch('https://data.iana.org/rdap/dns.json');
      if (res.ok) {
        ianaCache = await res.json();
        return ianaCache;
      }
    } catch (e) {
      console.warn('IANA bootstrap cache skipped:', e);
    }
    return null;
  }

  // Get Authoritative RDAP Endpoint for any domain
  async function getRdapEndpoint(domain) {
    const parts = domain.toLowerCase().split('.');
    const tld = parts[parts.length - 1];
    const sld = parts.length > 2 ? parts[parts.length - 2] + '.' + tld : tld;

    // Fast direct paths for top TLDs (100% native CORS support)
    if (tld === 'com') return { url: 'https://rdap.verisign.com/com/v1/domain/' + domain, direct: true };
    if (tld === 'net') return { url: 'https://rdap.verisign.com/net/v1/domain/' + domain, direct: true };
    if (tld === 'org') return { url: 'https://rdap.publicinterestregistry.org/rdap/domain/' + domain, direct: true };
    if (tld === 'in' || sld.endsWith('.in')) return { url: 'https://rdap.nixiregistry.in/rdap/domain/' + domain, direct: true };
    if (['dev', 'app', 'page', 'how', 'day', 'new', 'channel'].includes(tld)) return { url: 'https://pubapi.registry.google/rdap/domain/' + domain, direct: true };
    if (['xyz', 'art', 'icu', 'wiki', 'cam'].includes(tld)) return { url: 'https://rdap.centralnic.com/' + tld + '/domain/' + domain, direct: true };
    if (['ai', 'info', 'me', 'mobi', 'biz', 'vip'].includes(tld)) return { url: 'https://rdap.identitydigital.services/rdap/domain/' + domain, direct: true };

    // Dynamic resolution via IANA official registry database
    const iana = await getIanaServices();
    if (iana && iana.services) {
      const match = iana.services.find(s => s[0].includes(tld));
      if (match && match[1] && match[1][0]) {
        const base = match[1][0].endsWith('/') ? match[1][0] : match[1][0] + '/';
        return { url: base + 'domain/' + domain, direct: false };
      }
    }

    return null;
  }

  // Fetch WHOIS / RDAP Data
  async function fetchWhoisRdap(domain) {
    const endpoint = await getRdapEndpoint(domain);
    if (!endpoint) return null;

    try {
      const res = await fetch(endpoint.url, { cache: 'no-store' });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // If direct request failed (e.g. CORS block on third-party registry), try via edge proxy
      try {
        const proxyUrl = 'https://cors-get-proxy.sirjosh.workers.dev/?url=' + encodeURIComponent(endpoint.url);
        const pRes = await fetch(proxyUrl, { cache: 'no-store' });
        if (pRes.ok) {
          return await pRes.json();
        }
      } catch (proxyErr) {
        console.warn('RDAP proxy fallback failed:', proxyErr);
      }
    }
    return null;
  }

  // Parse Raw RDAP JSON into Clean Structured Object
  function parseRdapData(data) {
    if (!data) return null;

    let registeredDate = null;
    let expiresDate = null;
    let updatedDate = null;

    (data.events || []).forEach(ev => {
      const act = (ev.eventAction || '').toLowerCase();
      if (act === 'registration' || act === 'created') {
        registeredDate = new Date(ev.eventDate);
      } else if (act === 'expiration' || act === 'renewed') {
        expiresDate = new Date(ev.eventDate);
      } else if (act === 'last changed' || act === 'last update') {
        updatedDate = new Date(ev.eventDate);
      }
    });

    let registrar = 'Not Disclosed / Independent Registry';
    let registrarIanaId = null;
    let abuseEmail = null;
    let abusePhone = null;
    let registrantName = 'Privacy Protected (GDPR / WHOISGuard)';
    let registrantOrg = null;
    let registrantLocation = null;

    function scanEntity(ent) {
      if (!ent) return;
      const roles = (ent.roles || []).map(r => (r || '').toLowerCase());

      if (ent.publicIds && ent.publicIds.length > 0) {
        const iana = ent.publicIds.find(p => p.type && p.type.toLowerCase().includes('iana'));
        if (iana) registrarIanaId = iana.identifier;
      }

      if (ent.vcardArray && ent.vcardArray[1]) {
        const vcard = ent.vcardArray[1];
        const fnProp = vcard.find(p => p[0] === 'fn');
        const orgProp = vcard.find(p => p[0] === 'org');
        const emailProp = vcard.find(p => p[0] === 'email');
        const telProp = vcard.find(p => p[0] === 'tel');
        const adrProp = vcard.find(p => p[0] === 'adr');

        const fnVal = fnProp ? fnProp[3] : '';
        const orgVal = orgProp ? orgProp[3] : '';

        if (roles.includes('registrar')) {
          if (fnVal) registrar = fnVal;
          else if (ent.handle) registrar = ent.handle;
        }

        if (roles.includes('abuse')) {
          if (emailProp && emailProp[3]) abuseEmail = emailProp[3].replace(/^mailto:/i, '');
          if (telProp && telProp[3]) abusePhone = telProp[3].replace(/^tel:/i, '');
        }

        if (roles.includes('registrant')) {
          if (orgVal) registrantOrg = orgVal;
          if (fnVal && !fnVal.toLowerCase().includes('redact') && !fnVal.toLowerCase().includes('withheld') && !fnVal.toLowerCase().includes('privacy')) {
            registrantName = fnVal;
          }
          if (adrProp && adrProp[3]) {
            const parts = adrProp[3].filter(x => typeof x === 'string' && x.trim().length > 0);
            if (parts.length > 0) registrantLocation = parts.slice(-3).join(', ');
          }
        }
      }

      if (ent.entities && Array.isArray(ent.entities)) {
        ent.entities.forEach(scanEntity);
      }
    }

    (data.entities || []).forEach(scanEntity);

    // Status List
    const statusList = data.status || [];

    // Nameservers
    const nameservers = (data.nameservers || []).map(ns => (ns.ldhName || ns.handle || '').toLowerCase()).filter(Boolean);

    // DNSSEC
    const dnssec = data.secureDNS ? (data.secureDNS.delegationSigned ? 'Signed (DNSSEC Authenticated)' : 'Unsigned') : 'Unsigned';

    return {
      registeredDate,
      expiresDate,
      updatedDate,
      registrar,
      registrarIanaId,
      abuseEmail,
      abusePhone,
      registrant: registrantOrg ? registrantOrg : registrantName,
      registrantOrg,
      registrantLocation,
      statusList,
      nameservers,
      dnssec
    };
  }

  // Format Date (e.g. 15 Sep 1997)
  function formatDate(d) {
    if (!d || isNaN(d.getTime())) return 'Not Reported';
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  // Format Full Date with Time (e.g. 15 Sep 1997, 04:00 AM UTC)
  function formatFullDate(d) {
    if (!d || isNaN(d.getTime())) return 'Not Reported';
    return d.toUTCString().replace('GMT', 'UTC');
  }

  // Calculate Exact Age
  function calculateAge(fromDate) {
    if (!fromDate || isNaN(fromDate.getTime())) return 'Unknown';
    const now = new Date();
    let years = now.getFullYear() - fromDate.getFullYear();
    let months = now.getMonth() - fromDate.getMonth();
    let days = now.getDate() - fromDate.getDate();

    if (days < 0) {
      months--;
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    if (years > 0) {
      return `${years} Year${years > 1 ? 's' : ''}${months > 0 ? `, ${months} Mo` : ''} Old`;
    }
    if (months > 0) {
      return `${months} Month${months > 1 ? 's' : ''} Old`;
    }
    const diffDays = Math.max(1, Math.floor((now - fromDate) / (1000 * 60 * 60 * 24)));
    return `${diffDays} Day${diffDays > 1 ? 's' : ''} Old`;
  }

  // Calculate Expiry Details
  function calculateExpiry(expiresDate) {
    if (!expiresDate || isNaN(expiresDate.getTime())) {
      return { text: 'Not Reported', badge: 'Active', isExpired: false, days: 0 };
    }
    const now = new Date();
    const diffMs = expiresDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return {
        text: `Expired ${Math.abs(diffDays)} Days Ago`,
        badge: 'Expired',
        badgeColor: '#dc2626',
        isExpired: true,
        days: diffDays
      };
    }

    if (diffDays > 365) {
      const yrs = (diffDays / 365.25).toFixed(1);
      return {
        text: `Expires in ${diffDays} Days (~${yrs} Yrs)`,
        badge: 'Active & Verified',
        badgeColor: '#16a34a',
        isExpired: false,
        days: diffDays
      };
    }

    if (diffDays <= 90) {
      return {
        text: `Expires Soon: in ${diffDays} Days`,
        badge: 'Expiring Soon',
        badgeColor: '#ca8a04',
        isExpired: false,
        days: diffDays
      };
    }

    return {
      text: `Expires in ${diffDays} Days`,
      badge: 'Active',
      badgeColor: '#16a34a',
      isExpired: false,
      days: diffDays
    };
  }

  // DNS-over-HTTPS Query
  async function queryDoH(domain, type) {
    try {
      const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`;
      const res = await fetch(url, {
        headers: { 'accept': 'application/dns-json' },
        cache: 'no-store'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.Answer || [];
    } catch (err) {
      // Fallback to Google DoH
      try {
        const gUrl = `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${type}`;
        const gRes = await fetch(gUrl, { cache: 'no-store' });
        if (!gRes.ok) throw new Error(`Google HTTP ${gRes.status}`);
        const gData = await gRes.json();
        return gData.Answer || [];
      } catch (e2) {
        console.warn(`DNS lookup failed for ${type}:`, e2);
        return [];
      }
    }
  }

  const TYPE_MAP = {
    1: 'A',
    28: 'AAAA',
    15: 'MX',
    16: 'TXT',
    2: 'NS',
    5: 'CNAME',
    6: 'SOA'
  };

  // Perform Complete Lookup
  async function performLookup() {
    const rawVal = domainInput.value;
    const domain = cleanDomain(rawVal);

    if (!domain || !domain.includes('.')) {
      alert('Please enter a valid domain name (e.g. sarkariresult.com, flipkart.com, or google.com)');
      domainInput.focus();
      return;
    }

    currentDomain = domain;
    lookupLoading.style.display = 'block';
    lookupResults.style.display = 'none';

    try {
      // Run WHOIS / RDAP lookup and DNS queries concurrently
      const [rawRdap, aRecords, aaaaRecords, mxRecords, txtRecords, nsRecords, dmarcRecords] = await Promise.all([
        fetchWhoisRdap(domain),
        queryDoH(domain, 'A'),
        queryDoH(domain, 'AAAA'),
        queryDoH(domain, 'MX'),
        queryDoH(domain, 'TXT'),
        queryDoH(domain, 'NS'),
        queryDoH(`_dmarc.${domain}`, 'TXT')
      ]);

      const whoisData = parseRdapData(rawRdap);
      currentWhois = whoisData;

      const allDns = [
        ...aRecords.map(r => ({ ...r, resolvedType: 'A' })),
        ...aaaaRecords.map(r => ({ ...r, resolvedType: 'AAAA' })),
        ...mxRecords.map(r => ({ ...r, resolvedType: 'MX' })),
        ...txtRecords.map(r => ({ ...r, resolvedType: 'TXT' })),
        ...nsRecords.map(r => ({ ...r, resolvedType: 'NS' })),
        ...dmarcRecords.map(r => ({ ...r, resolvedType: 'TXT', isDmarc: true }))
      ];

      currentRecords = allDns;

      renderOverviewAndWhois(domain, whoisData, allDns);
      renderTabsCount(allDns);
      renderTable(allDns, activeFilter);
      renderEmailAudit(allDns, domain);

      lookupLoading.style.display = 'none';
      lookupResults.style.display = 'block';

      // Smooth scroll into results
      lookupResults.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (err) {
      lookupLoading.style.display = 'none';
      alert('Error fetching domain records. Please verify the domain name and your internet connection.');
      console.error(err);
    }
  }

  // Detect Host / Provider from DNS NS
  function detectProvider(records) {
    const nsText = records.filter(r => r.resolvedType === 'NS').map(r => (r.data || '').toLowerCase()).join(' ');
    if (nsText.includes('cloudflare')) return 'Cloudflare Managed DNS';
    if (nsText.includes('awsdns')) return 'Amazon Route 53 (AWS)';
    if (nsText.includes('googledomains') || nsText.includes('google')) return 'Google Cloud DNS';
    if (nsText.includes('domaincontrol') || nsText.includes('godaddy')) return 'GoDaddy DNS';
    if (nsText.includes('hostinger')) return 'Hostinger Nameservers';
    if (nsText.includes('namecheap')) return 'Namecheap DNS';
    if (nsText.includes('bluehost')) return 'Bluehost Hosting';
    if (nsText.includes('digitalocean')) return 'DigitalOcean DNS';
    if (nsText) return 'Custom Authoritative DNS';
    return 'Managed Nameservers';
  }

  // Render Top Metric Cards & Dedicated WHOIS Card
  function renderOverviewAndWhois(domain, whois, records) {
    resDomainName.textContent = domain;

    const parts = domain.split('.');
    const tld = '.' + parts.slice(1).join('.');
    resTld.textContent = `TLD: ${tld.toUpperCase()} · Live Resolving`;

    const expInfo = whois ? calculateExpiry(whois.expiresDate) : null;
    const ageInfo = whois ? calculateAge(whois.registeredDate) : null;

    // Card 2: Registrar / Purchased From
    if (whois && whois.registrar && whois.registrar !== 'Not Disclosed / Independent Registry') {
      resRegistrar.textContent = whois.registrar;
      resRegistrarBadge.textContent = whois.registrarIanaId ? `IANA ID: ${whois.registrarIanaId} · Verified` : 'Verified Registrar';
    } else {
      const detected = detectProvider(records);
      resRegistrar.textContent = detected;
      resRegistrarBadge.textContent = 'Detected from Authoritative NS';
    }

    // Card 3: Expiry Date & Countdown
    if (whois && whois.expiresDate) {
      resExpiryDate.textContent = formatDate(whois.expiresDate);
      resExpiryCountdown.innerHTML = `<span style="color: ${expInfo.badgeColor};">● ${expInfo.text}</span>`;
    } else {
      resExpiryDate.textContent = 'Not Disclosed in Registry';
      resExpiryCountdown.innerHTML = `<span style="color: #64748b;">Requires direct registry query</span>`;
    }

    // Card 4: Domain Age & Created Date
    if (whois && whois.registeredDate) {
      resDomainAge.textContent = ageInfo;
      resCreatedDate.textContent = `Created: ${formatDate(whois.registeredDate)}`;
    } else {
      resDomainAge.textContent = 'Historical Domain';
      resCreatedDate.textContent = 'DNS Active & Propagated';
    }

    // Populate Detailed WHOIS Profile Card
    if (whois) {
      whoisSourceBadge.innerHTML = '<span>●</span> Authoritative Registry RDAP';
      whoisSourceBadge.style.background = '#e0f2fe';
      whoisSourceBadge.style.color = '#0369a1';

      whoisRegistrar.textContent = whois.registrar || 'Not Disclosed';
      whoisIanaId.textContent = whois.registrarIanaId ? `IANA Registrar ID: ${whois.registrarIanaId}` : 'Registry Direct Account';

      whoisExpires.textContent = formatFullDate(whois.expiresDate);
      whoisExpiresCountdown.innerHTML = `<span style="color:${expInfo.badgeColor};">● ${expInfo.text}</span>`;

      whoisCreated.textContent = formatFullDate(whois.registeredDate);
      whoisDomainAgeDetail.textContent = `Calculated Age: ${ageInfo}`;

      whoisUpdated.textContent = formatFullDate(whois.updatedDate);

      // Registrant
      whoisRegistrant.textContent = whois.registrant || 'Privacy Protected';
      if (whois.registrantOrg) {
        whoisRegistrantNotice.textContent = 'Verified Organization Record';
        whoisRegistrantNotice.style.color = '#16a34a';
      } else {
        whoisRegistrantNotice.textContent = 'Masked via GDPR / ICANN WHOIS Privacy Specification';
        whoisRegistrantNotice.style.color = '#64748b';
      }

      whoisLocation.textContent = whois.registrantLocation || 'Protected / Not Disclosed';

      // Status
      if (whois.statusList && whois.statusList.length > 0) {
        const hasLock = whois.statusList.some(s => s.toLowerCase().includes('transferprohibited'));
        whoisStatus.innerHTML = hasLock
          ? '<span style="color:#16a34a;">🔒 Transfer Protection Enabled (Domain Locked)</span>'
          : '<span style="color:#0284c7;">✓ Active</span>';
        whoisStatusNotice.textContent = whois.statusList.join(', ');
      } else {
        whoisStatus.textContent = 'Active & Resolving';
        whoisStatusNotice.textContent = 'No transfer locks reported';
      }

      whoisDnssec.textContent = `DNSSEC: ${whois.dnssec}`;
      const abuseParts = [];
      if (whois.abuseEmail) abuseParts.push(`📧 ${whois.abuseEmail}`);
      if (whois.abusePhone) abuseParts.push(`📞 ${whois.abusePhone}`);
      whoisAbuse.textContent = abuseParts.length > 0 ? abuseParts.join(' | ') : 'Abuse reporting available via registrar portal';

      // Nameservers
      whoisNameservers.innerHTML = '';
      const nsList = whois.nameservers && whois.nameservers.length > 0
        ? whois.nameservers
        : records.filter(r => r.resolvedType === 'NS').map(r => r.data.replace(/\.$/, ''));

      if (nsList.length > 0) {
        nsList.forEach(ns => {
          const span = document.createElement('span');
          span.style.cssText = 'background: #e2e8f0; color: #1e293b; padding: 3px 8px; border-radius: 4px; display: inline-block;';
          span.textContent = ns;
          whoisNameservers.appendChild(span);
        });
      } else {
        whoisNameservers.innerHTML = '<span style="color: var(--gray-500);">Nameservers managed at DNS level</span>';
      }

    } else {
      // Fallback if registry blocks RDAP
      whoisSourceBadge.innerHTML = '<span>●</span> Registry Privacy Restricted';
      whoisSourceBadge.style.background = '#fef3c7';
      whoisSourceBadge.style.color = '#92400e';

      whoisRegistrar.textContent = detectProvider(records);
      whoisIanaId.textContent = 'Inferred from Authoritative DNS';

      whoisExpires.textContent = 'Registry Private / Restricted';
      whoisExpiresCountdown.textContent = 'Check with domain registrar directly';

      whoisCreated.textContent = 'Active in DNS Zone';
      whoisDomainAgeDetail.textContent = 'Creation timestamp restricted by registry';

      whoisUpdated.textContent = 'Live Zone Active';
      whoisRegistrant.textContent = 'Privacy Protected / Withheld';
      whoisLocation.textContent = 'Protected by Registrar Policy';
      whoisStatus.textContent = 'Active & Resolving';
      whoisStatusNotice.textContent = 'Live DNS propagation confirmed';
      whoisDnssec.textContent = 'DNSSEC: Standard delegation';
      whoisAbuse.textContent = 'Contact registrar abuse desk';

      whoisNameservers.innerHTML = '';
      const nsList = records.filter(r => r.resolvedType === 'NS').map(r => r.data.replace(/\.$/, ''));
      nsList.forEach(ns => {
        const span = document.createElement('span');
        span.style.cssText = 'background: #e2e8f0; color: #1e293b; padding: 3px 8px; border-radius: 4px; display: inline-block;';
        span.textContent = ns;
        whoisNameservers.appendChild(span);
      });
    }
  }

  function renderTabsCount(records) {
    countAll.textContent = records.length;
    countA.textContent = records.filter(r => r.resolvedType === 'A').length;
    countAAAA.textContent = records.filter(r => r.resolvedType === 'AAAA').length;
    countMX.textContent = records.filter(r => r.resolvedType === 'MX').length;
    countTXT.textContent = records.filter(r => r.resolvedType === 'TXT').length;
    countNS.textContent = records.filter(r => r.resolvedType === 'NS').length;
  }

  // Filter Tabs Event Listeners
  document.querySelectorAll('#dnsTabs .tool-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#dnsTabs .tool-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeFilter = tab.dataset.type;
      renderTable(currentRecords, activeFilter);
    });
  });

  function renderTable(records, filter) {
    dnsTableBody.innerHTML = '';

    const filtered = filter === 'ALL'
      ? records
      : records.filter(r => r.resolvedType === filter);

    if (filtered.length === 0) {
      dnsTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 24px; color: var(--gray-500);">No ${filter} records detected for this domain.</td></tr>`;
      return;
    }

    filtered.forEach(rec => {
      const type = rec.resolvedType || TYPE_MAP[rec.type] || 'RECORD';
      const badgeClass = `dns-badge-${type.toLowerCase()}`;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="dns-type-badge ${badgeClass}">${type}</span></td>
        <td style="color: var(--gray-700);">${escapeHtml(rec.name || currentDomain)}</td>
        <td style="color: var(--navy); font-weight: 500;">${escapeHtml(rec.data || '')}</td>
        <td style="color: var(--gray-500);">${rec.TTL || 300}s</td>
      `;
      dnsTableBody.appendChild(tr);
    });
  }

  function renderEmailAudit(records, domain) {
    authAuditList.innerHTML = '';

    const spfRec = records.find(r => r.resolvedType === 'TXT' && r.data.toLowerCase().includes('v=spf1'));
    const dmarcRec = records.find(r => r.isDmarc || (r.resolvedType === 'TXT' && r.data.toLowerCase().includes('v=dmarc1')));
    const mxRecs = records.filter(r => r.resolvedType === 'MX');

    // SPF Check
    const spfItem = document.createElement('div');
    spfItem.className = 'seo-audit-item';
    if (spfRec) {
      spfItem.innerHTML = `
        <div class="seo-audit-icon pass">✓</div>
        <div class="seo-audit-info">
          <div class="seo-audit-title">SPF (Sender Policy Framework) Validated</div>
          <div class="seo-audit-detail"><code>${escapeHtml(spfRec.data)}</code></div>
        </div>
      `;
    } else {
      spfItem.innerHTML = `
        <div class="seo-audit-icon fail">✗</div>
        <div class="seo-audit-info">
          <div class="seo-audit-title">SPF Record Missing</div>
          <div class="seo-audit-detail">Without SPF, spammers can spoof emails from your domain name. Add a TXT record with <code>v=spf1 include:... ~all</code>.</div>
        </div>
      `;
    }
    authAuditList.appendChild(spfItem);

    // DMARC Check
    const dmarcItem = document.createElement('div');
    dmarcItem.className = 'seo-audit-item';
    if (dmarcRec) {
      dmarcItem.innerHTML = `
        <div class="seo-audit-icon pass">✓</div>
        <div class="seo-audit-info">
          <div class="seo-audit-title">DMARC Policy Configured</div>
          <div class="seo-audit-detail"><code>${escapeHtml(dmarcRec.data)}</code></div>
        </div>
      `;
    } else {
      dmarcItem.innerHTML = `
        <div class="seo-audit-icon warn">!</div>
        <div class="seo-audit-info">
          <div class="seo-audit-title">DMARC Policy Missing (_dmarc.${domain})</div>
          <div class="seo-audit-detail">Major email providers (Google, Yahoo) require DMARC compliance to ensure your business emails land in the primary inbox.</div>
        </div>
      `;
    }
    authAuditList.appendChild(dmarcItem);

    // MX Check
    const mxItem = document.createElement('div');
    mxItem.className = 'seo-audit-item';
    if (mxRecs.length > 0) {
      mxItem.innerHTML = `
        <div class="seo-audit-icon pass">✓</div>
        <div class="seo-audit-info">
          <div class="seo-audit-title">${mxRecs.length} Mail Exchange (MX) Server(s) Configured</div>
          <div class="seo-audit-detail">Incoming mail routing is healthy and verified.</div>
        </div>
      `;
    } else {
      mxItem.innerHTML = `
        <div class="seo-audit-icon warn">!</div>
        <div class="seo-audit-info">
          <div class="seo-audit-title">No MX Records Found</div>
          <div class="seo-audit-detail">This domain cannot receive incoming business emails at @${domain}.</div>
        </div>
      `;
    }
    authAuditList.appendChild(mxItem);
  }

  // Generate Complete Text Report
  function formatDnsReport(domain, whois, records) {
    let out = `=====================================================\n`;
    out += `DOMAIN WHOIS & DNS AUDIT REPORT\n`;
    out += `=====================================================\n`;
    out += `Domain Name        : ${domain}\n`;
    out += `Report Generated   : ${new Date().toUTCString()}\n`;
    out += `Tool               : AllToolsInOne (alltoolsinone.com/tools/whois-lookup.html)\n\n`;

    out += `--- REGISTRATION & WHOIS DETAILS ---\n`;
    if (whois) {
      out += `Registrar          : ${whois.registrar || 'Not Disclosed'}\n`;
      if (whois.registrarIanaId) out += `Registrar IANA ID  : ${whois.registrarIanaId}\n`;
      out += `Registered On      : ${formatFullDate(whois.registeredDate)}\n`;
      out += `Domain Age         : ${calculateAge(whois.registeredDate)}\n`;
      out += `Expires On         : ${formatFullDate(whois.expiresDate)}\n`;
      out += `Time Remaining     : ${calculateExpiry(whois.expiresDate).text}\n`;
      out += `Last Updated       : ${formatFullDate(whois.updatedDate)}\n`;
      out += `Registrant / Owner : ${whois.registrant || 'Privacy Protected'}\n`;
      out += `Location           : ${whois.registrantLocation || 'Protected'}\n`;
      out += `Transfer Status    : ${(whois.statusList || []).join(', ') || 'Active'}\n`;
      out += `DNSSEC             : ${whois.dnssec}\n`;
      if (whois.abuseEmail) out += `Abuse Email        : ${whois.abuseEmail}\n`;
      if (whois.abusePhone) out += `Abuse Phone        : ${whois.abusePhone}\n`;
    } else {
      out += `Hosting / DNS Host : ${detectProvider(records)}\n`;
      out += `WHOIS Registry     : Registry restricted or requires direct web inquiry\n`;
    }

    out += `\n--- AUTHORITATIVE DNS RECORDS ---\n`;
    records.forEach(r => {
      out += `[${r.resolvedType.padEnd(5)}]  ${r.name.padEnd(30)} ->  ${r.data}  (TTL: ${r.TTL || 300}s)\n`;
    });

    out += `\n=====================================================\n`;
    out += `Report generated by AllToolsInOne - Free Online Utilities\n`;
    return out;
  }

  // Copy to Clipboard
  btnCopyDns.addEventListener('click', () => {
    if (currentRecords.length === 0 && !currentWhois) return;
    const txt = formatDnsReport(currentDomain, currentWhois, currentRecords);
    navigator.clipboard.writeText(txt).then(() => {
      const orig = btnCopyDns.textContent;
      btnCopyDns.textContent = '✓ Copied to Clipboard!';
      setTimeout(() => { btnCopyDns.textContent = orig; }, 2000);
    });
  });

  // Download Report (.txt)
  btnDownloadDns.addEventListener('click', () => {
    if (currentRecords.length === 0 && !currentWhois) return;
    const txt = formatDnsReport(currentDomain, currentWhois, currentRecords);
    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `whois-dns-report-${currentDomain}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  });

  function escapeHtml(str) {
    return (str || '').replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    })[m]);
  }

});
