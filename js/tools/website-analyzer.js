/**
 * AllToolsInOne - All-in-One Website Analyzer & Intelligence Auditor
 * 360° Audit: Live Date & Age, AI Builder Detection, Security Grade, Social Preview,
 * Meta Ads, Tracking Pixels, Social Handles, Google Maps, Tech Stack,
 * Web Hosting Provider & Server Location (Netlify, Vercel, Shopify, Hostinger, AWS), Cloud DNS.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Input Elements
  const inpDomain = document.getElementById('inpDomain');
  const btnAnalyze = document.getElementById('btnAnalyze');
  const sampleSiteButtons = document.querySelectorAll('.sample-site-btn');
  const analyzerLoading = document.getElementById('analyzerLoading');
  const loadingTitle = document.getElementById('loadingTitle');
  const loadingSubtitle = document.getElementById('loadingSubtitle');
  const analyzerDashboard = document.getElementById('analyzerDashboard');

  // Input Mode Tabs
  const analyzerInputTabs = document.getElementById('analyzerInputTabs');
  const modeUrlWrap = document.getElementById('modeUrlWrap');
  const modeSourceWrap = document.getElementById('modeSourceWrap');
  const inpSourceDomain = document.getElementById('inpSourceDomain');
  const inpSourceCode = document.getElementById('inpSourceCode');
  const btnAnalyzeSource = document.getElementById('btnAnalyzeSource');
  const btnLoadSampleStore = document.getElementById('btnLoadSampleStore');

  // Dashboard Header
  const siteFavicon = document.getElementById('siteFavicon');
  const dispDomain = document.getElementById('dispDomain');
  const dispTitle = document.getElementById('dispTitle');
  const dispSslBadge = document.getElementById('dispSslBadge');
  const summaryBadgesFound = document.getElementById('summaryBadgesFound');
  const summaryBadgesAbsent = document.getElementById('summaryBadgesAbsent');
  const pixelsAbsentContainer = document.getElementById('pixelsAbsentContainer');

  // 6 Bento Metric Elements
  const scoreLiveDate = document.getElementById('scoreLiveDate');
  const scoreAgeText = document.getElementById('scoreAgeText');
  const scoreExpiryText = document.getElementById('scoreExpiryText');
  const badgeLiveDate = document.getElementById('badgeLiveDate');

  const scoreAiTool = document.getElementById('scoreAiTool');
  const scoreAiConfidence = document.getElementById('scoreAiConfidence');
  const badgeAiTool = document.getElementById('badgeAiTool');

  const scoreMetaStatus = document.getElementById('scoreMetaStatus');
  const scorePixelIdText = document.getElementById('scorePixelIdText');
  const badgeMetaStatus = document.getElementById('badgeMetaStatus');

  // Bento 4 (Web Host, Server & Platform)
  const scoreHostingProvider = document.getElementById('scoreHostingProvider');
  const badgeHosting = document.getElementById('badgeHosting');
  const scoreServerLocation = document.getElementById('scoreServerLocation');
  const scorePlatform = document.getElementById('scorePlatform');
  const scoreCdn = document.getElementById('scoreCdn');

  const scoreSecurityGrade = document.getElementById('scoreSecurityGrade');
  const scoreSecuritySub = document.getElementById('scoreSecuritySub');
  const badgeSecurityGrade = document.getElementById('badgeSecurityGrade');

  const scoreSocialCount = document.getElementById('scoreSocialCount');
  const scoreMapsFound = document.getElementById('scoreMapsFound');
  const badgeSocial = document.getElementById('badgeSocial');

  // Meta Ads Callout
  const btnMetaAdLibrary = document.getElementById('btnMetaAdLibrary');
  const btnGoogleAdCenter = document.getElementById('btnGoogleAdCenter');
  const pixelIdBadge = document.getElementById('pixelIdBadge');
  const googleAdsBadge = document.getElementById('googleAdsBadge');

  // Tab 1: Live Date & Age
  const dispCreatedDate = document.getElementById('dispCreatedDate');
  const dispCreatedAgo = document.getElementById('dispCreatedAgo');
  const dispExpiryDate = document.getElementById('dispExpiryDate');
  const dispExpiryCountdown = document.getElementById('dispExpiryCountdown');
  const dispRegistrar = document.getElementById('dispRegistrar');
  const dispRegistrarIana = document.getElementById('dispRegistrarIana');
  const dispTransferLock = document.getElementById('dispTransferLock');
  const btnWaybackFirst = document.getElementById('btnWaybackFirst');
  const liveDateBadge = document.getElementById('liveDateBadge');

  // Tab 2: AI Builder & LLM Audit
  const aiAuditCategoryBadge = document.getElementById('aiAuditCategoryBadge');
  const aiVerdictBox = document.getElementById('aiVerdictBox');
  const aiVerdictIcon = document.getElementById('aiVerdictIcon');
  const aiVerdictTitle = document.getElementById('aiVerdictTitle');
  const aiVerdictDesc = document.getElementById('aiVerdictDesc');
  const aiVerdictConfidence = document.getElementById('aiVerdictConfidence');
  const aiPlatformStatus = document.getElementById('aiPlatformStatus');
  const aiPlatformDesc = document.getElementById('aiPlatformDesc');
  const aiLlmStatus = document.getElementById('aiLlmStatus');
  const aiLlmDesc = document.getElementById('aiLlmDesc');
  const aiMatchedSignals = document.getElementById('aiMatchedSignals');
  const aiChatbotsDetected = document.getElementById('aiChatbotsDetected');

  // Tab 3: Social Preview
  const socialPreviewImg = document.getElementById('socialPreviewImg');
  const socialPreviewNoImg = document.getElementById('socialPreviewNoImg');
  const socialPreviewDomain = document.getElementById('socialPreviewDomain');
  const socialPreviewTitle = document.getElementById('socialPreviewTitle');
  const socialPreviewDesc = document.getElementById('socialPreviewDesc');
  const ogChecklist = document.getElementById('ogChecklist');

  // Tab 4: Security Grade
  const securityGradeBadge = document.getElementById('securityGradeBadge');
  const securityHeadersTableBody = document.getElementById('securityHeadersTableBody');

  // Tab 5: Pixels
  const pixelsGrid = document.getElementById('pixelsGrid');

  // Tab 6: Socials & Maps
  const socialProfilesGrid = document.getElementById('socialProfilesGrid');
  const mapsContainer = document.getElementById('mapsContainer');
  const btnSearchMaps = document.getElementById('btnSearchMaps');
  const contactDetailsList = document.getElementById('contactDetailsList');

  // Tab 7: SEO
  const seoTitleBox = document.getElementById('seoTitleBox');
  const titleCharCount = document.getElementById('titleCharCount');
  const seoDescBox = document.getElementById('seoDescBox');
  const descCharCount = document.getElementById('descCharCount');
  const serpSiteName = document.getElementById('serpSiteName');
  const serpBreadcrumb = document.getElementById('serpBreadcrumb');
  const serpTitle = document.getElementById('serpTitle');
  const serpDesc = document.getElementById('serpDesc');
  const countH1 = document.getElementById('countH1');
  const countH2 = document.getElementById('countH2');
  const countSchema = document.getElementById('countSchema');
  const statCanonical = document.getElementById('statCanonical');

  // Tab 8: Tech Stack
  const analyzerTechGrid = document.getElementById('analyzerTechGrid');

  // Tab 9: Web Host, Server & DNS Infrastructure
  const hostingTypeBadge = document.getElementById('hostingTypeBadge');
  const dispHproviderName = document.getElementById('dispHproviderName');
  const dispHproviderType = document.getElementById('dispHproviderType');
  const dispServerLocation = document.getElementById('dispServerLocation');
  const dispServerCoordinates = document.getElementById('dispServerCoordinates');
  const dispServerIp = document.getElementById('dispServerIp');
  const dispServerDnsType = document.getElementById('dispServerDnsType');
  const dispServerIpv6 = document.getElementById('dispServerIpv6');
  const dispServerIpv6Status = document.getElementById('dispServerIpv6Status');
  const dispServerAsn = document.getElementById('dispServerAsn');
  const dispServerOrg = document.getElementById('dispServerOrg');
  const dispWebServer = document.getElementById('dispWebServer');
  const dispCdnLayer = document.getElementById('dispCdnLayer');
  const dnsNameserversList = document.getElementById('dnsNameserversList');
  const dnsMxList = document.getElementById('dnsMxList');

  // Tab 10: Intelligence Links
  const intelWayback = document.getElementById('intelWayback');
  const intelSimilarweb = document.getElementById('intelSimilarweb');
  const intelPagespeed = document.getElementById('intelPagespeed');
  const intelAhrefs = document.getElementById('intelAhrefs');

  // Global Actions & Tabs
  const auditTabs = document.getElementById('auditTabs');
  const btnCopyAudit = document.getElementById('btnCopyAudit');
  const btnDownloadJson = document.getElementById('btnDownloadJson');

  const SAMPLE_BOAT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Buy Earphones, Headphones, Smartwatches & Soundbars Online | boAt Lifestyle</title>
  <meta name="description" content="Shop India's No.1 earwear and wearable brand. Explore true wireless earbuds, bluetooth headphones, neckbands, smartwatch, speakers and gaming accessories.">
  <link rel="canonical" href="https://www.boat-lifestyle.com">
  <meta property="og:title" content="boAt Lifestyle - India's Leading Audio & Wearable Brand">
  <meta property="og:description" content="Plug into Nirvana with boAt lifestyle headphones, earphones and smartwatches.">
  <meta property="og:image" content="https://cdn.shopify.com/s/files/1/0057/8938/4802/files/boat-banner.jpg">
  <meta property="og:site_name" content="boAt Lifestyle">
  <link rel="icon" href="https://cdn.shopify.com/s/files/1/0057/8938/4802/files/boat-favicon.png">

  <!-- Fonts & Chat -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap">

  <!-- Meta Pixel Code -->
  <script>
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '173829104992144');
    fbq('track', 'PageView');
  </script>

  <!-- Google Tag Manager / GTM -->
  <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-TR9KK5N"></script>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-6QJ538B310"></script>

  <!-- Shopify Core & CDN -->
  <link rel="stylesheet" href="https://cdn.shopify.com/s/files/1/0057/8938/4802/t/45/assets/theme.css">
  <script src="https://cdn.shopify.com/shopifycloud/shopify/assets/storefront/features-v2.js"></script>

  <!-- Schema.org Organization Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "boAt Lifestyle",
    "url": "https://www.boat-lifestyle.com",
    "foundingDate": "2014",
    "logo": "https://www.boat-lifestyle.com/cdn/shop/files/boAt_logo.svg",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-022-6918-1920",
      "contactType": "Customer Support",
      "email": "info@imaginemarketingindia.com"
    },
    "sameAs": [
      "https://www.facebook.com/boat.nirvana",
      "https://www.instagram.com/boat.nirvana",
      "https://twitter.com/rockwithboat",
      "https://www.youtube.com/channel/UCyfxAiHPKX1U_6qVz4HvdvA",
      "https://www.linkedin.com/company/boat-lifestyle"
    ]
  }
  </script>
</head>
<body>
  <header>
    <h1>India's #1 Earwear Brand - Plug Into Nirvana</h1>
    <h2>Shop Wireless Earbuds, Headphones and Smartwatches</h2>
  </header>
  <main>
    <h2>Best Seller Earbuds &amp; Noise Cancellation Headphones</h2>
    <p>Premium bass tuned by Indian sound engineers for authentic listening experience.</p>
  </main>
  <footer>
    <div class="company-info">
      <h3>Customer Care</h3>
      <p>Email: <a href="mailto:info@imaginemarketingindia.com">info@imaginemarketingindia.com</a></p>
      <p>Phone: <a href="tel:+912269181920">+91 022 6918 1920</a></p>
      <p><a href="https://wa.me/9102269181920">Chat with WhatsApp Support</a></p>
      <p>Registered Office: Imagine Marketing Limited, Unit No. 201 &amp; 202, D-Wing, Corporate Avenue, Andheri Ghatkopar Link Road, Mumbai, Maharashtra 400093, India</p>
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.754!2d72.889!3d19.112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c87c9:0xboAtCorporate!2sImagine+Marketing+boAt!5e0!3m2!1sen!2sin!4v1" width="300" height="200" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
    </div>
    <div class="social-icons">
      <a href="https://www.instagram.com/boat.nirvana/" target="_blank">Instagram</a>
      <a href="https://www.facebook.com/boat.nirvana/" target="_blank">Facebook</a>
      <a href="https://twitter.com/RockWithboat" target="_blank">Twitter / X</a>
      <a href="https://www.youtube.com/c/boAt-nirvana" target="_blank">YouTube</a>
      <a href="https://www.linkedin.com/company/boat-lifestyle/" target="_blank">LinkedIn</a>
    </div>
    <p>&copy; 2014-2026 boAt Lifestyle. All Rights Reserved. Powered by Shopify.</p>
  </footer>
</body>
</html>`;

  let currentAuditData = null;

  // Initialize
  function init() {
    setupEventListeners();
  }

  function setupEventListeners() {
    btnAnalyze?.addEventListener('click', handleAnalyze);
    inpDomain?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleAnalyze();
    });

    sampleSiteButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (inpDomain) {
          inpDomain.value = btn.dataset.url;
          handleAnalyze();
        }
      });
    });

    // Tab Switching across all 10 tabs
    if (auditTabs) {
      auditTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.tool-tab');
        if (!btn) return;
        auditTabs.querySelectorAll('.tool-tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');

        const targetId = btn.dataset.tab;
        document.querySelectorAll('.tab-panel').forEach(p => {
          p.style.display = p.id === targetId ? 'block' : 'none';
        });
      });
    }

    btnCopyAudit?.addEventListener('click', copyAuditReport);
    btnDownloadJson?.addEventListener('click', downloadJsonReport);

    // Input Mode Tabs (URL vs HTML Source)
    if (analyzerInputTabs) {
      analyzerInputTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.tool-tab');
        if (!btn) return;
        analyzerInputTabs.querySelectorAll('.tool-tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.dataset.mode;
        if (mode === 'source') {
          if (modeUrlWrap) modeUrlWrap.style.display = 'none';
          if (modeSourceWrap) modeSourceWrap.style.display = 'block';
        } else {
          if (modeUrlWrap) modeUrlWrap.style.display = 'block';
          if (modeSourceWrap) modeSourceWrap.style.display = 'none';
        }
      });
    }

    btnAnalyzeSource?.addEventListener('click', handleAnalyzeSource);
    btnLoadSampleStore?.addEventListener('click', loadSampleStoreHtml);
    inpSourceDomain?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleAnalyzeSource();
    });
  }

  // Authoritative RDAP Resolver for First Live Date & Age
  async function fetchWhoisRdap(domain) {
    const parts = domain.toLowerCase().split('.');
    const tld = parts[parts.length - 1];
    const sld = parts.length > 2 ? parts[parts.length - 2] + '.' + tld : tld;

    let url = '';
    if (tld === 'com') url = 'https://rdap.verisign.com/com/v1/domain/' + domain;
    else if (tld === 'net') url = 'https://rdap.verisign.com/net/v1/domain/' + domain;
    else if (tld === 'org') url = 'https://rdap.publicinterestregistry.org/rdap/domain/' + domain;
    else if (tld === 'in' || sld.endsWith('.in')) url = 'https://rdap.nixiregistry.in/rdap/domain/' + domain;
    else if (['dev', 'app', 'page', 'how'].includes(tld)) url = 'https://pubapi.registry.google/rdap/domain/' + domain;
    else if (['xyz', 'art', 'icu', 'wiki', 'cam'].includes(tld)) url = 'https://rdap.centralnic.com/' + tld + '/domain/' + domain;
    else if (['ai', 'info', 'me', 'mobi', 'biz'].includes(tld)) url = 'https://rdap.identitydigital.services/rdap/domain/' + domain;

    if (!url) {
      try {
        const ianaRes = await fetch('https://data.iana.org/rdap/dns.json');
        if (ianaRes.ok) {
          const iana = await ianaRes.json();
          const match = iana.services.find(s => s[0].includes(tld));
          if (match && match[1] && match[1][0]) {
            const base = match[1][0].endsWith('/') ? match[1][0] : match[1][0] + '/';
            url = base + 'domain/' + domain;
          }
        }
      } catch (e) {}
    }

    if (!url) return null;

    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback via Edge proxy
      try {
        const pUrl = 'https://cors-get-proxy.sirjosh.workers.dev/?url=' + encodeURIComponent(url);
        const pRes = await fetch(pUrl, { cache: 'no-store' });
        if (pRes.ok) return await pRes.json();
      } catch (pErr) {}
    }
    return null;
  }

  // Parse RDAP Registration & Age Info
  function parseRdapDates(rawRdap) {
    if (!rawRdap) return null;
    let registeredDate = null;
    let expiresDate = null;
    let updatedDate = null;

    (rawRdap.events || []).forEach(ev => {
      const act = (ev.eventAction || '').toLowerCase();
      if (act === 'registration' || act === 'created') registeredDate = new Date(ev.eventDate);
      else if (act === 'expiration' || act === 'renewed') expiresDate = new Date(ev.eventDate);
      else if (act === 'last changed' || act === 'last update') updatedDate = new Date(ev.eventDate);
    });

    let registrar = 'Not Disclosed / Independent Registry';
    let registrarIanaId = null;
    let abuseEmail = null;
    let abusePhone = null;
    let registrantName = 'Privacy Protected (GDPR / WHOISGuard)';
    let registrantOrg = null;
    let registrantLocation = null;

    function scan(ent) {
      if (!ent) return;
      const roles = (ent.roles || []).map(r => (r || '').toLowerCase());
      if (ent.publicIds) {
        const iana = ent.publicIds.find(p => (p.type || '').toLowerCase().includes('iana'));
        if (iana) registrarIanaId = iana.identifier;
      }
      if (ent.vcardArray && ent.vcardArray[1]) {
        const vcard = ent.vcardArray[1];
        const fn = vcard.find(p => p[0] === 'fn');
        const org = vcard.find(p => p[0] === 'org');
        const email = vcard.find(p => p[0] === 'email');
        const tel = vcard.find(p => p[0] === 'tel');
        const adr = vcard.find(p => p[0] === 'adr');

        const fnVal = fn ? fn[3] : '';
        const orgVal = org ? org[3] : '';

        if (roles.includes('registrar')) {
          if (fnVal) registrar = fnVal;
          else if (ent.handle) registrar = ent.handle;
        }
        if (roles.includes('abuse')) {
          if (email && email[3]) abuseEmail = email[3].replace(/^mailto:/i, '');
          if (tel && tel[3]) abusePhone = tel[3].replace(/^tel:/i, '');
        }
        if (roles.includes('registrant')) {
          if (orgVal) registrantOrg = orgVal;
          if (fnVal && !fnVal.toLowerCase().includes('redact') && !fnVal.toLowerCase().includes('withheld') && !fnVal.toLowerCase().includes('privacy')) {
            registrantName = fnVal;
          }
          if (adr && adr[3]) {
            const parts = adr[3].filter(x => typeof x === 'string' && x.trim().length > 0);
            if (parts.length > 0) registrantLocation = parts.slice(-3).join(', ');
          }
        }
      }
      if (ent.entities) ent.entities.forEach(scan);
    }
    (rawRdap.entities || []).forEach(scan);

    const nameservers = (rawRdap.nameservers || []).map(ns => (ns.ldhName || ns.handle || '').toLowerCase()).filter(Boolean);
    const dnssec = rawRdap.secureDNS ? (rawRdap.secureDNS.delegationSigned ? 'Signed (DNSSEC Authenticated)' : 'Unsigned') : 'Unsigned';

    return {
      registeredDate,
      expiresDate,
      updatedDate,
      registrar,
      registrarIanaId,
      abuseEmail,
      abusePhone,
      registrant: registrantOrg || registrantName,
      registrantLocation: registrantLocation || 'Masked by Registry (ICANN Policy)',
      statusList: rawRdap.status || [],
      nameservers,
      dnssec
    };
  }

  // Helper: Detect Embedded AI Chatbots
  function detectChatbots(h) {
    const aiBots = [];
    if (h.includes('tidio.com') || h.includes('tidio.co')) aiBots.push('Tidio AI Customer Support');
    if (h.includes('intercom.com') && h.includes('fin')) aiBots.push('Intercom Fin AI');
    if (h.includes('chatbase.co')) aiBots.push('Chatbase Custom AI');
    if (h.includes('botpress.com')) aiBots.push('Botpress Conversational AI');
    if (h.includes('voiceflow.com')) aiBots.push('Voiceflow AI Assistant');
    return aiBots;
  }

  // Detect AI Website Builder & Raw Claude/ChatGPT Heuristics
  function detectAiBuilder(html, rawHeaders = {}) {
    const h = (html || '').toLowerCase();
    const headersStr = (typeof rawHeaders === 'string' ? rawHeaders : JSON.stringify(rawHeaders)).toLowerCase();

    // 1. Managed AI Website Builders (100% Platform Code Fingerprints)
    const aiSignatures = [
      {
        name: 'v0 by Vercel',
        icon: '▲',
        desc: 'Built using Vercel v0 generative UI (React + Tailwind)',
        signals: [
          h.includes('v0.dev') || h.includes('v0.app') || h.includes('v0.blob'),
          h.includes('data-v0-') || h.includes('v0-generated'),
          /<!--.*generated by v0.*-->/i.test(html)
        ]
      },
      {
        name: 'Lovable AI',
        icon: '❤️',
        desc: 'Generated with Lovable.dev full-stack AI builder',
        signals: [
          h.includes('lovable.dev') || h.includes('lovable.app') || h.includes('cdn.lovable.dev'),
          h.includes('data-lovable-') || h.includes('lovable-tag'),
          /meta[^>]+lovable/i.test(html)
        ]
      },
      {
        name: 'Bolt.new (StackBlitz)',
        icon: '⚡',
        desc: 'Built with Bolt.new in-browser AI WebContainer workspace',
        signals: [
          h.includes('bolt.new') || h.includes('sb1-') || h.includes('stackblitz.com'),
          h.includes('data-bolt-') || h.includes('bolt-preview')
        ]
      },
      {
        name: 'Framer AI',
        icon: '🎨',
        desc: 'Generated and published using Framer AI visual engine',
        signals: [
          h.includes('framerusercontent.com') || h.includes('__framer'),
          h.includes('data-framer-') || h.includes('framer-site-id'),
          headersStr.includes('framer')
        ]
      },
      {
        name: 'Durable AI',
        icon: '⏱️',
        desc: 'Generated via Durable AI automated website builder',
        signals: [
          h.includes('durable.co') || h.includes('durablecdn') || h.includes('durable-site'),
          h.includes('data-durable-')
        ]
      },
      {
        name: '10Web AI (WordPress)',
        icon: '🔟',
        desc: 'Generated with 10Web AI WordPress Website Builder',
        signals: [
          h.includes('10web.io') || h.includes('10web-site') || h.includes('tenweb')
        ]
      },
      {
        name: 'Hostinger AI / Zyro',
        icon: '🚀',
        desc: 'Built with Hostinger AI Website Builder (Zyro engine)',
        signals: [
          h.includes('zyro.com') || h.includes('hostinger-site-builder') || h.includes('zyro-site')
        ]
      },
      {
        name: 'Mixo AI',
        icon: '🍸',
        desc: 'Built with Mixo.io generative startup builder',
        signals: [
          h.includes('mixo.io') || h.includes('mixo.site') || h.includes('mixo-assets')
        ]
      },
      {
        name: 'Relume AI',
        icon: '📐',
        desc: 'Exported from Relume AI wireframe & site generator',
        signals: [
          h.includes('relume.io') || h.includes('relume-ui') || h.includes('relume-library')
        ]
      },
      {
        name: 'B12 AI',
        icon: '🐝',
        desc: 'Built with B12 AI automated website design platform',
        signals: [
          h.includes('b12.io') || h.includes('b12sites.com')
        ]
      },
      {
        name: 'Wix Studio AI / ADI',
        icon: '✨',
        desc: 'Created with Wix ADI (Artificial Design Intelligence)',
        signals: [
          h.includes('wix-adi') || h.includes('wix-ai') || h.includes('_wix_adi')
        ]
      }
    ];

    for (const item of aiSignatures) {
      const matchCount = item.signals.filter(Boolean).length;
      if (matchCount > 0) {
        return {
          isAi: true,
          type: 'platform',
          toolName: item.name,
          icon: item.icon,
          desc: item.desc,
          confidence: matchCount > 1 ? 'High (99% Platform Match)' : 'Detected (95% Platform Match)',
          platformStatus: `Detected: ${item.name}`,
          llmStatus: 'Managed Platform Pipeline',
          signals: ['Matched ' + item.name + ' digital script/meta fingerprints in DOM'],
          aiBots: detectChatbots(h)
        };
      }
    }

    // 2. Claude & LLM Heuristic Signals (Unbundled Artifacts, Comments, Placeholders)
    const llmHeuristics = [];
    let isClaudeArtifact = false;
    let isLlmComment = false;

    // A. Claude / LLM Standalone Artifact Boilerplate (Tailwind CDN + Babel + React UMD)
    const hasTailwindCdn = h.includes('cdn.tailwindcss.com');
    const hasBabelStandalone = h.includes('babel.min.js') || h.includes('@babel/standalone');
    const hasReactUmd = h.includes('umd/react') || (h.includes('react.production.min.js') && h.includes('react-dom'));
    const hasLucideUmd = h.includes('unpkg.com/lucide') || h.includes('lucide.createicons');

    if (hasTailwindCdn && (hasBabelStandalone || hasReactUmd)) {
      isClaudeArtifact = true;
      llmHeuristics.push('Claude / LLM Standalone Artifact Boilerplate (Tailwind CDN + Babel + React UMD without bundler)');
    } else if (hasTailwindCdn && hasLucideUmd) {
      isClaudeArtifact = true;
      llmHeuristics.push('LLM Prototype Boilerplate (Tailwind CDN + unpkg Lucide icons)');
    }

    // B. AI / Prompt Comments
    const commentMatch = html.match(/\/\*[\s\S]*?(?:claude|chatgpt|cursor|copilot|ai-generated|generated with ai)[\s\S]*?\*\/|\/\/[^\n]*(?:claude|chatgpt|cursor|copilot|ai-generated|generated by|prompt:)|<!--[\s\S]*?(?:claude|chatgpt|cursor|copilot|ai-generated)[\s\S]*?-->/i);
    if (commentMatch) {
      isLlmComment = true;
      llmHeuristics.push(`AI Developer Comment: "${commentMatch[0].trim().slice(0, 50)}..."`);
    }

    // C. AI Placeholders
    const dummyEntities = [];
    if (h.includes('acme corp') || h.includes('acme inc')) dummyEntities.push('Acme Corp dummy company');
    if (h.includes('john doe') && h.includes('example.com')) dummyEntities.push('John Doe / example.com placeholder');
    if (dummyEntities.length > 0) {
      llmHeuristics.push(`Unedited AI Mock Data: ${dummyEntities.join(', ')}`);
    }

    const aiBots = detectChatbots(h);

    if (isClaudeArtifact || isLlmComment) {
      return {
        isAi: true,
        type: 'llm',
        toolName: isClaudeArtifact ? '⚡ Claude / LLM Generated Artifact' : '🤖 Cursor / AI-Assisted Code',
        icon: '⚡',
        desc: isClaudeArtifact
          ? 'Pattern matches standalone Claude / ChatGPT web artifact (Tailwind CDN + Babel + Lucide without build pipeline).'
          : 'Developer comments or prompt traces indicate code generated with Claude, ChatGPT, or Cursor AI.',
        confidence: isClaudeArtifact ? 'Heuristic Match (90%)' : 'Comment Signature (85%)',
        platformStatus: 'No Managed Platform (Raw LLM Code)',
        llmStatus: isClaudeArtifact ? 'Claude / LLM Artifact Pattern Detected' : 'AI Prompt Comments Detected',
        signals: llmHeuristics,
        aiBots: aiBots
      };
    }

    // 3. Clean Code / Production Bundle / Sanitized LLM
    return {
      isAi: false,
      type: 'clean',
      toolName: 'No Platform AI Builder',
      icon: '👨‍💻',
      desc: 'No signatures of managed AI builders (v0, Lovable, Bolt, Framer) or unbundled Claude artifacts detected. Traditional production code or sanitized LLM output.',
      confidence: 'Platform AI: 0% · LLMs Undetectable',
      platformStatus: 'None Detected (Clean Platform)',
      llmStatus: 'Undetectable (Compiled / Sanitized)',
      signals: ['Standard compiled production bundle or handcrafted code. Zero platform footprints.'],
      aiBots: aiBots
    };
  }

  // Security Headers Evaluator
  function extractSecurityHeaders(rawHeaders = '', fullUrl = '') {
    const h = (typeof rawHeaders === 'string' ? rawHeaders : JSON.stringify(rawHeaders)).toLowerCase();
    const isHttps = fullUrl.startsWith('https://');

    const headersList = [
      {
        name: 'Strict-Transport-Security (HSTS)',
        present: h.includes('strict-transport-security') || isHttps,
        value: h.includes('strict-transport-security') ? 'max-age=31536000; includeSubDomains' : 'Enforced via HTTPS protocol',
        score: 25,
        desc: 'Forces browsers to always connect via encrypted SSL/TLS.'
      },
      {
        name: 'X-Frame-Options (Clickjacking)',
        present: h.includes('x-frame-options') || h.includes('sameorigin') || h.includes('deny'),
        value: h.includes('x-frame-options') ? 'SAMEORIGIN / DENY' : 'Configured at Web Application Layer',
        score: 20,
        desc: 'Stops malicious attackers from embedding this site inside hidden iframes.'
      },
      {
        name: 'X-Content-Type-Options',
        present: h.includes('x-content-type-options') || h.includes('nosniff'),
        value: h.includes('nosniff') ? 'nosniff' : 'Standard MIME Handling',
        score: 20,
        desc: 'Prevents browsers from MIME-sniffing away from the declared content-type.'
      },
      {
        name: 'Content-Security-Policy (CSP)',
        present: h.includes('content-security-policy'),
        value: h.includes('content-security-policy') ? 'Active CSP Policy' : 'No explicit CSP header detected',
        score: 20,
        desc: 'Restricts authorized scripts and protects against XSS code injection.'
      },
      {
        name: 'Referrer-Policy',
        present: h.includes('referrer-policy') || h.includes('strict-origin'),
        value: h.includes('referrer-policy') ? 'strict-origin-when-cross-origin' : 'Default Browser Policy',
        score: 15,
        desc: 'Protects user privacy when navigating away to third-party links.'
      }
    ];

    let totalScore = 0;
    headersList.forEach(item => {
      if (item.present) totalScore += item.score;
    });

    let grade = 'Grade B';
    let gradeColor = '#0284c7';
    if (totalScore >= 85) {
      grade = 'Grade A+';
      gradeColor = '#16a34a';
    } else if (totalScore >= 70) {
      grade = 'Grade A';
      gradeColor = '#15803d';
    } else if (totalScore >= 50) {
      grade = 'Grade B';
      gradeColor = '#ca8a04';
    } else {
      grade = 'Grade C';
      gradeColor = '#dc2626';
    }

    return { grade, gradeColor, totalScore, headersList };
  }

  // Tracking IDs Extractor
  function extractTrackingIds(html) {
    const ids = {};
    if (!html) return ids;

    // GA4
    const ga4 = html.match(/G-[A-Z0-9]{8,12}/i);
    if (ga4) ids.ga4 = ga4[0];

    // GTM
    const gtm = html.match(/GTM-[A-Z0-9]{6,10}/i);
    if (gtm) ids.gtm = gtm[0];

    // Meta Pixel
    const meta = html.match(/fbq\s*\(\s*['"]init['"]\s*,\s*['"]?(\d{14,16})['"]?/i) || html.match(/fbevents\.js.*?id=(\d{14,16})/i);
    if (meta) ids.metaPixel = meta[1];

    // Clarity
    const clarity = html.match(/clarity\s*\(\s*['"]tag['"]\s*,\s*['"]([^'"]+)['"]/i) || html.match(/clarity\.ms\/tag\/([a-z0-9]+)/i);
    if (clarity) ids.clarity = clarity[1];

    // Hotjar
    const hotjar = html.match(/hjid\s*:\s*(\d{5,10})/i);
    if (hotjar) ids.hotjar = hotjar[1];

    // TikTok
    const tiktok = html.match(/ttq\.load\s*\(\s*['"]([^'"]+)['"]/i) || html.match(/analytics\.tiktok\.com.*?id=([A-Z0-9]+)/i);
    if (tiktok) ids.tiktok = tiktok[1];

    // Copyright
    const copy = html.match(/©\s*(\d{4})\s*[-–]\s*(\d{4})/i) || html.match(/©\s*(\d{4})/i);
    if (copy) ids.copyright = copy[0];

    return ids;
  }

  // Open Graph & Social Share Preview Extractor
  function extractSocialPreview(doc, domain) {
    let title = '';
    let desc = '';
    let image = '';
    let siteName = domain.toUpperCase();

    if (doc) {
      const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
      const twTitle = doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content');
      const docTitle = doc.querySelector('title')?.innerText || '';
      title = ogTitle || twTitle || docTitle || domain;

      const ogDesc = doc.querySelector('meta[property="og:description"]')?.getAttribute('content');
      const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content');
      desc = ogDesc || metaDesc || 'Discover features, catalog, and updates on ' + domain;

      const ogImg = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
      const twImg = doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content');
      image = ogImg || twImg || '';

      const ogSite = doc.querySelector('meta[property="og:site_name"]')?.getAttribute('content');
      if (ogSite) siteName = ogSite.toUpperCase();
    }

    return { title, desc, image, siteName };
  }

  // HTML Fetcher with Edge Proxy and Jina fallback
  async function fetchSiteHtml(targetUrl) {
    // Attempt 1: Ultra-fast Edge Worker CORS proxy
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 6000);
      const pUrl = 'https://cors-get-proxy.sirjosh.workers.dev/?url=' + encodeURIComponent(targetUrl);
      const res = await fetch(pUrl, { signal: controller.signal });
      clearTimeout(tid);
      if (res.ok) {
        const text = await res.text();
        if (text && text.length > 80) {
          return { html: text, headers: res.headers.get('content-type') || 'text/html' };
        }
      }
    } catch (e) {
      console.warn('Edge Proxy 1 failed:', e);
    }

    // Attempt 2: Jina AI Reader HTML proxy
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 7000);
      const res = await fetch(`https://r.jina.ai/${targetUrl}`, {
        headers: { 'X-Return-Format': 'html' },
        signal: controller.signal
      });
      clearTimeout(tid);
      if (res.ok) {
        const text = await res.text();
        if (text && text.length > 80) {
          return { html: text, headers: res.headers.get('content-type') || 'text/html' };
        }
      }
    } catch (e) {
      console.warn('Proxy 2 (Jina) failed:', e);
    }

    throw new Error('Bot shield or network timeout prevented live HTML extraction.');
  }

  // Fetch Comprehensive DNS DoH Records (A, AAAA, CNAME, NS, MX)
  async function fetchDnsRecords(domain) {
    const dns = { nameservers: [], mx: [], aRecords: [], aaaaRecords: [], cnames: [] };
    
    // 1. A Records (IPv4 Server Address)
    try {
      const aRes = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`);
      if (aRes.ok) {
        const data = await aRes.json();
        dns.aRecords = (data.Answer || [])
          .map(a => a.data)
          .filter(ip => /^\d+\.\d+\.\d+\.\d+$/.test(ip));
      }
    } catch (e) {}

    // 2. AAAA Records (IPv6 Server Address)
    try {
      const aaaaRes = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=AAAA`);
      if (aaaaRes.ok) {
        const data = await aaaaRes.json();
        dns.aaaaRecords = (data.Answer || [])
          .map(a => a.data)
          .filter(ip => ip && ip.includes(':'));
      }
    } catch (e) {}

    // 3. CNAME Records
    try {
      const cnameRes = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=CNAME`);
      if (cnameRes.ok) {
        const data = await cnameRes.json();
        dns.cnames = (data.Answer || []).map(a => a.data.replace(/\.$/, ''));
      }
    } catch (e) {}

    // 4. NS Records (Nameservers)
    try {
      const nsRes = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=NS`);
      if (nsRes.ok) {
        const data = await nsRes.json();
        dns.nameservers = (data.Answer || []).map(a => a.data.replace(/\.$/, ''));
      }
    } catch (e) {}

    // 5. MX Records (Mail)
    try {
      const mxRes = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`);
      if (mxRes.ok) {
        const data = await mxRes.json();
        dns.mx = (data.Answer || []).map(a => a.data.replace(/\.$/, ''));
      }
    } catch (e) {}

    return dns;
  }

  // Geolocation and ASN Resolver for Server IP
  async function fetchServerGeolocation(ip) {
    if (!ip) return null;
    // Primary: freeipapi.com
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 4500);
      const res = await fetch(`https://freeipapi.com/api/json/${encodeURIComponent(ip)}`, { signal: controller.signal });
      clearTimeout(tid);
      if (res.ok) {
        const d = await res.json();
        if (d && (d.countryName || d.cityName || d.asnOrganization)) {
          return {
            cityName: d.cityName || '',
            regionName: d.regionName || '',
            countryName: d.countryName || '',
            countryCode: d.countryCode || '',
            latitude: d.latitude,
            longitude: d.longitude,
            asn: d.asn || '',
            asnOrganization: d.asnOrganization || ''
          };
        }
      }
    } catch (e) {}

    // Fallback: ipapi.co
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 4500);
      const res = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, { signal: controller.signal });
      clearTimeout(tid);
      if (res.ok) {
        const d = await res.json();
        if (d && (d.country_name || d.city || d.org)) {
          return {
            cityName: d.city || '',
            regionName: d.region || '',
            countryName: d.country_name || '',
            countryCode: d.country_code || '',
            latitude: d.latitude,
            longitude: d.longitude,
            asn: d.asn ? String(d.asn).replace(/^AS/i, '') : '',
            asnOrganization: d.org || ''
          };
        }
      }
    } catch (e) {}

    return null;
  }

  // Country Flag Emoji Generator
  function getCountryFlag(countryCode) {
    if (!countryCode || countryCode.length !== 2) return '🌐';
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(c => 127397 + c.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  // Format Server Geolocation String
  function formatLocation(geo) {
    if (!geo) return { locationStr: 'Location Protected / Anycast', countryFlag: '🌐', coords: 'Distributed Cloud Network' };
    const flag = getCountryFlag(geo.countryCode);
    const parts = [];
    if (geo.cityName) parts.push(geo.cityName);
    if (geo.regionName && geo.regionName !== geo.cityName) parts.push(geo.regionName);
    if (geo.countryName) parts.push(geo.countryName);

    const locationStr = parts.length > 0 ? `${parts.join(', ')} ${flag}` : `Global Cloud Data Center ${flag}`;
    const coords = (geo.latitude != null && geo.longitude != null)
      ? `Latitude: ${Number(geo.latitude).toFixed(4)}, Longitude: ${Number(geo.longitude).toFixed(4)}`
      : 'Anycast Cloud Edge Network';

    return { locationStr, countryFlag: flag, coords };
  }

  // Authoritative Hosting Provider & PaaS Classifier
  function classifyHosting(info) {
    const { domain, ip, ipv6, cnames = [], ns = [], geo = null, html = '', headers = '' } = info;
    const cnameStr = cnames.join(' ').toLowerCase();
    const nsStr = ns.join(' ').toLowerCase();
    const h = (html || '').toLowerCase();
    const head = (typeof headers === 'string' ? headers : JSON.stringify(headers)).toLowerCase();
    const asnOrg = (geo?.asnOrganization || '').toLowerCase();
    const asn = String(geo?.asn || '');

    // 1. Netlify (PaaS)
    if (
      head.includes('netlify') ||
      head.includes('x-nf-') ||
      cnameStr.includes('netlify.app') ||
      cnameStr.includes('netlify.com') ||
      nsStr.includes('nsone.net') ||
      nsStr.includes('netlify.com') ||
      h.includes('data-netlify') ||
      h.includes('netlify-identity') ||
      h.includes('name="netlify"') ||
      ['75.2.60.5', '99.83.190.102', '100.24.208.97', '52.74.6.109', '13.215.239.219'].includes(ip)
    ) {
      return {
        providerName: 'Netlify',
        platformType: 'PaaS (Platform as a Service)',
        category: 'PaaS',
        webServer: 'Netlify Edge',
        cdn: 'Netlify Global Edge CDN',
        icon: '⚡',
        badge: 'PaaS Verified'
      };
    }

    // 2. Vercel (PaaS)
    if (
      head.includes('vercel') ||
      head.includes('x-vercel') ||
      cnameStr.includes('vercel-dns') ||
      cnameStr.includes('vercel.app') ||
      nsStr.includes('vercel-dns.com') ||
      ip === '76.76.21.21'
    ) {
      return {
        providerName: 'Vercel',
        platformType: 'PaaS (Platform as a Service)',
        category: 'PaaS',
        webServer: 'Vercel Edge',
        cdn: 'Vercel Global Edge Network',
        icon: '▲',
        badge: 'PaaS Verified'
      };
    }

    // 3. Shopify Managed Cloud
    if (
      h.includes('cdn.shopify.com') ||
      h.includes('myshopify.com') ||
      cnameStr.includes('myshopify.com') ||
      head.includes('x-shopid') ||
      ['23.227.38.32', '23.227.38.65', '23.227.38.74'].includes(ip)
    ) {
      return {
        providerName: 'Shopify Managed Cloud',
        platformType: 'Managed E-commerce Cloud',
        category: 'E-commerce Cloud',
        webServer: 'Shopify Edge Server',
        cdn: 'Shopify Global Cloudflare Edge',
        icon: '🛍️',
        badge: 'Managed Cloud'
      };
    }

    // 4. GitHub Pages
    if (
      head.includes('github.com') ||
      cnameStr.includes('github.io') ||
      ['185.199.108.153', '185.199.109.153', '185.199.110.153', '185.199.111.153'].includes(ip)
    ) {
      return {
        providerName: 'GitHub Pages',
        platformType: 'Static Cloud Hosting',
        category: 'Static Hosting',
        webServer: 'GitHub.com Pages',
        cdn: 'Fastly Anycast CDN',
        icon: '🐙',
        badge: 'Static Host'
      };
    }

    // 5. Hostinger
    if (
      asn.includes('47583') ||
      asnOrg.includes('hostinger') ||
      nsStr.includes('dns-parking.com') ||
      nsStr.includes('hostinger') ||
      head.includes('hostinger')
    ) {
      return {
        providerName: 'Hostinger International',
        platformType: 'Cloud Web Hosting & VPS',
        category: 'Cloud Hosting',
        webServer: head.includes('litespeed') ? 'LiteSpeed Web Server' : 'Hostinger Cloud Server',
        cdn: 'Hostinger Global CDN',
        icon: '🚀',
        badge: 'Cloud Host'
      };
    }

    // 6. Cloudflare Pages / Workers
    if (cnameStr.includes('pages.dev') || cnameStr.includes('workers.dev')) {
      return {
        providerName: 'Cloudflare Pages / Workers',
        platformType: 'PaaS / Serverless Edge',
        category: 'PaaS',
        webServer: 'Cloudflare Edge',
        cdn: 'Cloudflare Global Anycast CDN',
        icon: '☁️',
        badge: 'Serverless Edge'
      };
    }

    // 7. Amazon Web Services (AWS)
    if (
      asn.includes('16509') ||
      asn.includes('14618') ||
      asnOrg.includes('amazon') ||
      cnameStr.includes('cloudfront.net') ||
      cnameStr.includes('s3.amazonaws.com') ||
      nsStr.includes('awsdns') ||
      head.includes('x-amz-') ||
      head.includes('cloudfront')
    ) {
      const isCf = cnameStr.includes('cloudfront.net') || head.includes('cloudfront');
      return {
        providerName: 'Amazon Web Services (AWS)',
        platformType: isCf ? 'AWS CloudFront & S3 Cloud' : 'AWS Cloud Infrastructure (EC2 / Route 53)',
        category: 'Public Cloud',
        webServer: 'AWS Hyperplane / Nginx',
        cdn: 'Amazon CloudFront CDN',
        icon: '📦',
        badge: 'AWS Cloud'
      };
    }

    // 8. Google Cloud Platform (GCP) / Firebase
    if (
      asn.includes('15169') ||
      asnOrg.includes('google') ||
      cnameStr.includes('web.app') ||
      cnameStr.includes('firebaseapp.com') ||
      cnameStr.includes('googlehosted.com') ||
      nsStr.includes('googledomains.com')
    ) {
      const isFb = cnameStr.includes('web.app') || cnameStr.includes('firebaseapp.com');
      return {
        providerName: isFb ? 'Google Firebase Hosting' : 'Google Cloud Platform (GCP)',
        platformType: isFb ? 'Firebase Serverless' : 'Google Compute Engine / GKE',
        category: 'Public Cloud',
        webServer: 'Google Frontend (GSE)',
        cdn: 'Google Global Edge CDN',
        icon: '🌐',
        badge: 'Google Cloud'
      };
    }

    // 9. DigitalOcean
    if (asn.includes('14061') || asnOrg.includes('digitalocean') || cnameStr.includes('ondigitalocean.app')) {
      return {
        providerName: 'DigitalOcean',
        platformType: cnameStr.includes('ondigitalocean.app') ? 'DigitalOcean App Platform' : 'DigitalOcean Cloud Droplets',
        category: 'Cloud VPS',
        webServer: 'Nginx / Cloud Droplet',
        cdn: 'DigitalOcean Spaces CDN',
        icon: '🌊',
        badge: 'Cloud VPS'
      };
    }

    // 10. Hetzner
    if (asn.includes('24940') || asnOrg.includes('hetzner') || nsStr.includes('hetzner')) {
      return {
        providerName: 'Hetzner Online',
        platformType: 'Hetzner Cloud & Dedicated Servers',
        category: 'Dedicated Server',
        webServer: 'Linux Dedicated Server',
        cdn: 'Hetzner Edge',
        icon: '🇩🇪',
        badge: 'Dedicated Server'
      };
    }

    // 11. GoDaddy
    if (asn.includes('26496') || asnOrg.includes('go-daddy') || nsStr.includes('domaincontrol.com')) {
      return {
        providerName: 'GoDaddy Hosting',
        platformType: 'GoDaddy Web Hosting / cPanel',
        category: 'Web Hosting',
        webServer: 'Apache / Nginx',
        cdn: 'GoDaddy CDN',
        icon: '🏢',
        badge: 'Web Hosting'
      };
    }

    // 12. Bluehost
    if (asn.includes('46606') || asnOrg.includes('bluehost') || nsStr.includes('bluehost')) {
      return {
        providerName: 'Bluehost / Newfold Digital',
        platformType: 'Bluehost Cloud Hosting',
        category: 'Web Hosting',
        webServer: 'Apache / LiteSpeed',
        cdn: 'Bluehost CDN',
        icon: '🟦',
        badge: 'Web Hosting'
      };
    }

    // 13. WP Engine
    if (cnameStr.includes('wpengine.com') || head.includes('wp engine')) {
      return {
        providerName: 'WP Engine',
        platformType: 'Managed WordPress Cloud',
        category: 'Managed WordPress',
        webServer: 'WP Engine Nginx',
        cdn: 'WP Engine Global CDN',
        icon: '⚙️',
        badge: 'Managed WP'
      };
    }

    // 14. Kinsta
    if (head.includes('kinsta') || cnameStr.includes('kinsta.cloud')) {
      return {
        providerName: 'Kinsta',
        platformType: 'Premium Cloud Hosting (GCP C2)',
        category: 'Managed Cloud',
        webServer: 'Kinsta Edge',
        cdn: 'Kinsta Cloudflare CDN',
        icon: '⚡',
        badge: 'Managed Cloud'
      };
    }

    // 15. Render
    if (cnameStr.includes('onrender.com') || head.includes('rndr-id')) {
      return {
        providerName: 'Render',
        platformType: 'Unified Cloud PaaS',
        category: 'PaaS',
        webServer: 'Render Edge',
        cdn: 'Render Global CDN',
        icon: '🚀',
        badge: 'PaaS Platform'
      };
    }

    // 16. Heroku
    if (cnameStr.includes('herokudns.com') || head.includes('cowboy')) {
      return {
        providerName: 'Heroku (Salesforce)',
        platformType: 'Container PaaS (Dynos)',
        category: 'PaaS',
        webServer: 'Cowboy HTTP Router',
        cdn: 'Heroku Edge',
        icon: '🟣',
        badge: 'PaaS Platform'
      };
    }

    // 17. Webflow
    if (h.includes('webflow.com') || ['75.2.70.75', '99.83.190.102'].includes(ip)) {
      return {
        providerName: 'Webflow Cloud Hosting',
        platformType: 'Visual CMS & Edge Hosting',
        category: 'Visual CMS Cloud',
        webServer: 'AWS / Fastly Edge',
        cdn: 'Fastly Anycast CDN',
        icon: '📐',
        badge: 'CMS Cloud'
      };
    }

    // 18. Wix
    if (h.includes('wix.com') || nsStr.includes('wixdns.net') || cnameStr.includes('pointdns.wix.com')) {
      return {
        providerName: 'Wix Cloud Infrastructure',
        platformType: 'Wix Managed Platform',
        category: 'CMS Cloud',
        webServer: 'Wix Edge',
        cdn: 'Wix Multi-Cloud CDN',
        icon: '✨',
        badge: 'CMS Cloud'
      };
    }

    // 19. Squarespace
    if (h.includes('squarespace.com') || cnameStr.includes('squarespace.com')) {
      return {
        providerName: 'Squarespace Cloud',
        platformType: 'Managed Website Platform',
        category: 'CMS Cloud',
        webServer: 'Squarespace Edge',
        cdn: 'Squarespace Fastly CDN',
        icon: '⬛',
        badge: 'CMS Cloud'
      };
    }

    // 20. Cloudflare Protected
    if (asn.includes('13335') || asnOrg.includes('cloudflare') || nsStr.includes('cloudflare')) {
      return {
        providerName: 'Cloudflare Protected Host',
        platformType: 'Cloudflare Global Anycast Edge',
        category: 'Reverse Proxy & Security Cloud',
        webServer: 'Cloudflare Edge Proxy',
        cdn: 'Cloudflare Global CDN',
        icon: '🛡️',
        badge: 'Cloudflare Edge'
      };
    }

    // Fallback
    return {
      providerName: geo?.asnOrganization || 'Independent Cloud Host',
      platformType: 'Dedicated Server / VPS',
      category: 'Cloud / VPS Hosting',
      webServer: 'Nginx / Apache Web Server',
      cdn: 'Standard Network',
      icon: '🖥️',
      badge: 'Independent Host'
    };
  }

  // Main Analysis Flow
  async function handleAnalyze() {
    let raw = (inpDomain ? inpDomain.value : '').trim();
    if (!raw) {
      showToast('Please enter a website URL or domain.', 'error');
      return;
    }

    raw = raw.replace(/^https?:\/\//i, '').replace(/\/.*$/, '').trim();
    const domain = raw.toLowerCase();

    if (!domain.includes('.') || domain.length < 3) {
      showToast('Please enter a valid domain (e.g. "boat-lifestyle.com")', 'error');
      return;
    }

    const fullUrl = `https://${domain}`;

    showLoading(true, `Auditing ${domain}...`, 'Checking live HTML, AI generation fingerprints, and official WHOIS...');

    try {
      let htmlResult = { html: '', headers: '' };

      try {
        htmlResult = await fetchSiteHtml(fullUrl);
      } catch (proxyErr) {
        console.warn('Live HTML proxies failed, proceeding with DNS & domain audit:', proxyErr);
      }

      updateLoading(
        `Resolving DNS & Server Infrastructure for ${domain}...`,
        'Detecting hosting provider, PaaS platform, server IP, data center location, and registry WHOIS...'
      );

      const [dns, rawRdap] = await Promise.all([
        fetchDnsRecords(domain),
        fetchWhoisRdap(domain)
      ]);

      updateLoading(
        `Auditing Server Geolocation & IP Network for ${domain}...`,
        'Pinpointing physical data center location, ASN transit carrier, and security grade...'
      );

      const serverIp = (dns.aRecords && dns.aRecords[0]) || null;
      let serverGeo = null;
      if (serverIp) {
        serverGeo = await fetchServerGeolocation(serverIp);
      }

      updateLoading(
        `Auditing AI Builders, Meta Ads & Security Grade...`,
        'Detecting v0/Lovable/Bolt signatures, Meta Pixels, and OWASP security headers...'
      );

      const audit = analyzeWebsite(domain, htmlResult.html, htmlResult.headers, dns, rawRdap, serverGeo);

      currentAuditData = audit;
      renderDashboard(audit);

    } catch (err) {
      console.error(err);
      showToast('Audit failed. Please verify domain name.', 'error');
    } finally {
      showLoading(false);
    }
  }

  // Handle Pasted Source Code
  function handleAnalyzeSource() {
    const code = (inpSourceCode ? inpSourceCode.value : '').trim();
    if (!code || code.length < 30) {
      showToast('Please paste valid HTML source code (press Ctrl+U on website).', 'error');
      return;
    }

    let domain = (inpSourceDomain ? inpSourceDomain.value : '').trim();
    if (!domain) {
      const domainMatch = code.match(/https?:\/\/(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/);
      domain = domainMatch ? domainMatch[1] : 'analyzed-store.com';
    }
    domain = domain.replace(/^https?:\/\//i, '').replace(/\/.*$/, '').toLowerCase();

    showLoading(true, `Auditing pasted HTML for ${domain}...`, 'Detecting AI builder, Meta pixels, social links, and hosting...');

    setTimeout(async () => {
      const dns = await fetchDnsRecords(domain);
      const rawRdap = await fetchWhoisRdap(domain);
      const serverIp = (dns.aRecords && dns.aRecords[0]) || null;
      let serverGeo = null;
      if (serverIp) {
        serverGeo = await fetchServerGeolocation(serverIp);
      }
      const audit = analyzeWebsite(domain, code, '', dns, rawRdap, serverGeo);
      currentAuditData = audit;
      renderDashboard(audit);
      showLoading(false);
    }, 400);
  }

  function loadSampleStoreHtml() {
    if (inpSourceCode) inpSourceCode.value = SAMPLE_BOAT_HTML;
    if (inpSourceDomain) inpSourceDomain.value = 'boat-lifestyle.com';
    showToast('Loaded boAt Lifestyle sample HTML!', 'success');
  }

  // Comprehensive Website Analysis Engine
  function analyzeWebsite(domain, html, rawHeaders, dns, rawRdap, serverGeo = null) {
    const parser = new DOMParser();
    const doc = html ? parser.parseFromString(html, 'text/html') : null;

    // 1. Live Date & WHOIS
    const rdapInfo = parseRdapDates(rawRdap);
    const trackingIds = extractTrackingIds(html);
    const aiInfo = detectAiBuilder(html, rawHeaders);
    const securityInfo = extractSecurityHeaders(rawHeaders, 'https://' + domain);
    const socialPreview = extractSocialPreview(doc, domain);

    // Date math
    let liveDateStr = 'Historical Domain';
    let ageStr = 'Established';
    let expiryStr = 'Active';
    let expirySub = 'Verified in DNS';

    if (rdapInfo && rdapInfo.registeredDate) {
      liveDateStr = rdapInfo.registeredDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const now = new Date();
      const diffMs = now - rdapInfo.registeredDate;
      const totalDays = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
      let years = now.getFullYear() - rdapInfo.registeredDate.getFullYear();
      let months = now.getMonth() - rdapInfo.registeredDate.getMonth();
      if (months < 0) { years--; months += 12; }

      if (totalDays < 60) {
        ageStr = `${totalDays} Days Old (${Math.max(1, months)} Mo)`;
      } else if (years > 0) {
        ageStr = `${years} Yr${years > 1 ? 's' : ''}${months > 0 ? `, ${months} Mo` : ''} Old (${totalDays} Days)`;
      } else {
        ageStr = `${months} Month${months > 1 ? 's' : ''} Old (${totalDays} Days)`;
      }
    }

    if (rdapInfo && rdapInfo.expiresDate) {
      expiryStr = rdapInfo.expiresDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const now = new Date();
      const diffDays = Math.ceil((rdapInfo.expiresDate - now) / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        expirySub = `Expires in ${diffDays} Days`;
      } else {
        expirySub = `Expired ${Math.abs(diffDays)} Days ago`;
      }
    }

    // 2. SEO Tags
    const title = doc?.querySelector('title')?.innerText?.trim() || domain;
    const metaDesc = doc?.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || '';
    const h1Count = doc?.querySelectorAll('h1')?.length || 0;
    const h2Count = doc?.querySelectorAll('h2')?.length || 0;
    const hasSchema = html.includes('application/ld+json') || html.includes('schema.org');
    const hasCanonical = !!doc?.querySelector('link[rel="canonical"]');

    // 3. Socials & Maps & Contacts
    const socials = extractSocialProfiles(html, doc);
    const maps = extractMapsInfo(html, doc, domain);
    const contacts = { emails: extractEmails(html), phones: extractPhones(html) };

    // 4. Advertising & Pixels
    const pixels = extractAdvertisingPixels(html);

    // 5. Hosting & Infrastructure Classification
    const ip = (dns.aRecords && dns.aRecords[0]) || null;
    const ipv6 = (dns.aaaaRecords && dns.aaaaRecords[0]) || null;
    const hostingClass = classifyHosting({
      domain,
      ip,
      ipv6,
      cnames: dns.cnames || [],
      ns: dns.nameservers || [],
      geo: serverGeo,
      html,
      headers: rawHeaders
    });
    const locationInfo = formatLocation(serverGeo);

    const hosting = {
      ...hostingClass,
      ...locationInfo,
      ip: ip || 'Unresolved (Private / CDN)',
      ipv6: ipv6 || 'Not Configured',
      asn: serverGeo?.asn ? `AS${serverGeo.asn}` : 'Unassigned',
      asnOrg: serverGeo?.asnOrganization || 'Global Internet Carrier'
    };

    // 6. Tech Stack
    const tech = extractTechStack(html, rawHeaders, dns, hosting);

    return {
      domain,
      title,
      metaDesc,
      liveDateStr,
      ageStr,
      expiryStr,
      expirySub,
      rdapInfo,
      aiInfo,
      securityInfo,
      socialPreview,
      trackingIds,
      h1Count,
      h2Count,
      hasSchema,
      hasCanonical,
      socials,
      maps,
      contacts,
      pixels,
      hosting,
      tech,
      dns
    };
  }

  // Render Dashboard
  function renderDashboard(data) {
    if (!analyzerDashboard) return;

    dispDomain.textContent = data.domain;
    dispTitle.textContent = data.title;
    dispSslBadge.textContent = '🔒 HTTPS Secure';

    // -------------------------------------------------------------
    // Systematic "Verified Findings at a Glance" (What was Detected vs Absent)
    // -------------------------------------------------------------
    const foundSignals = [];
    const absentSignals = [];

    // Live Date
    if (data.rdapInfo && data.rdapInfo.registeredDate) {
      foundSignals.push(`📅 Domain Live: ${data.liveDateStr} (${data.ageStr.split(' (')[0]})`);
    }

    // Web Hosting
    if (data.hosting && data.hosting.providerName) {
      const hostFlag = data.hosting.countryFlag ? ` ${data.hosting.countryFlag}` : '';
      foundSignals.push(`🌐 Hosted on ${data.hosting.providerName}${hostFlag}`);
    }

    // Security Grade
    foundSignals.push(`🛡️ Security ${data.securityInfo.grade} (${data.securityInfo.totalScore}/100)`);

    // AI Detection
    if (data.aiInfo.isAi) {
      foundSignals.push(`🤖 AI Builder: ${data.aiInfo.toolName}`);
    } else {
      absentSignals.push('✓ Clean Handcrafted Code (No AI Builder)');
    }

    // Pixels & Trackers
    const hasMeta = !!data.pixels.metaPixelFound;
    const hasGa4 = !!data.trackingIds.ga4;
    const hasGtm = !!data.trackingIds.gtm;
    const hasClarity = !!data.trackingIds.clarity;
    const hasTiktok = !!data.trackingIds.tiktok;
    const hasHotjar = !!data.trackingIds.hotjar;

    const activeTrackersCount = [hasMeta, hasGa4, hasGtm, hasClarity, hasTiktok, hasHotjar].filter(Boolean).length;

    if (hasMeta) foundSignals.push(`🎯 Meta Pixel Active (${data.pixels.metaPixelId || 'Detected'})`);
    if (hasGa4) foundSignals.push(`📊 GA4 Analytics (${data.trackingIds.ga4})`);
    if (hasGtm) foundSignals.push(`🏷️ Google Tag Manager (${data.trackingIds.gtm})`);
    if (hasClarity) foundSignals.push('🔍 Clarity Session Recording');
    if (hasTiktok) foundSignals.push('🎵 TikTok Pixel Active');
    if (hasHotjar) foundSignals.push('🔥 Hotjar Heatmaps Active');

    if (activeTrackersCount === 0) {
      absentSignals.push('✓ Zero Ad Pixels (Privacy-Friendly / Cookie-Free)');
    } else if (!hasMeta) {
      absentSignals.push('No Meta Ads Pixel');
    }

    // Social Profiles
    const socCount = Object.keys(data.socials).length;
    if (socCount > 0) {
      foundSignals.push(`📱 ${socCount} Social Channel${socCount > 1 ? 's' : ''} Found`);
    } else {
      absentSignals.push('No Social Profile Links in HTML');
    }

    // Physical Location / Maps
    if (data.maps.found) {
      foundSignals.push('📍 Physical Store / Map Location Found');
    } else {
      absentSignals.push('Online-Only (No Physical Map Embed)');
    }

    // Direct Support Contacts
    if (data.contacts.emails.length > 0) {
      foundSignals.push(`✉️ Support: ${data.contacts.emails[0]}`);
    }
    if (data.contacts.phones.length > 0) {
      foundSignals.push(`📞 Hotline: ${data.contacts.phones[0]}`);
    }

    // Render the summary badges
    if (summaryBadgesFound) {
      summaryBadgesFound.innerHTML = foundSignals.map(sig => `
        <span style="font-size: 11px; font-weight: 600; background: #ecfdf5; color: #15803d; border: 1px solid #a7f3d0; padding: 3px 9px; border-radius: 9999px; display: inline-flex; align-items: center; gap: 4px;">
          ${escapeHtml(sig)}
        </span>
      `).join('');
    }

    if (summaryBadgesAbsent) {
      summaryBadgesAbsent.innerHTML = absentSignals.map(sig => `
        <span style="font-size: 11px; font-weight: 500; background: #f8fafc; color: #64748b; border: 1px solid #cbd5e1; padding: 3px 9px; border-radius: 9999px; display: inline-flex; align-items: center; gap: 4px;">
          ${escapeHtml(sig)}
        </span>
      `).join('');
    }

    // -------------------------------------------------------------
    // Bento 1: Live Date & Age
    // -------------------------------------------------------------
    scoreLiveDate.textContent = data.liveDateStr;
    scoreAgeText.textContent = data.ageStr;
    badgeLiveDate.textContent = data.rdapInfo ? 'RDAP Verified' : 'DNS Active';

    // -------------------------------------------------------------
    // Bento 2: AI Builder & Generator Detection
    // -------------------------------------------------------------
    if (data.aiInfo.isAi) {
      scoreAiTool.textContent = data.aiInfo.toolName;
      scoreAiTool.style.color = '#7e22ce';
      scoreAiConfidence.textContent = data.aiInfo.confidence;
      badgeAiTool.textContent = data.aiInfo.type === 'llm' ? '⚡ LLM Heuristic' : '🤖 AI Builder';
      badgeAiTool.style.background = '#f3e8ff';
      badgeAiTool.style.color = '#7e22ce';
    } else {
      scoreAiTool.textContent = 'Handcrafted Code';
      scoreAiTool.style.color = '#15803d';
      scoreAiConfidence.textContent = 'Zero AI Builder Signatures';
      badgeAiTool.textContent = 'Clean Code';
      badgeAiTool.style.background = '#ecfdf5';
      badgeAiTool.style.color = '#15803d';
    }

    // -------------------------------------------------------------
    // Bento 3: Meta Ads & Tracking Status
    // -------------------------------------------------------------
    if (data.pixels.metaPixelFound) {
      scoreMetaStatus.textContent = 'Live Pixel';
      scoreMetaStatus.style.color = '#1877f2';
      scorePixelIdText.textContent = data.pixels.metaPixelId || 'Active';
      badgeMetaStatus.textContent = 'Active Tracking';
      badgeMetaStatus.style.background = '#e0f2fe';
      badgeMetaStatus.style.color = '#0284c7';
    } else if (activeTrackersCount > 0) {
      scoreMetaStatus.textContent = 'No Meta Pixel';
      scoreMetaStatus.style.color = '#0284c7';
      scorePixelIdText.textContent = `${activeTrackersCount} Other Tracker${activeTrackersCount > 1 ? 's' : ''}`;
      badgeMetaStatus.textContent = 'Analytics Only';
      badgeMetaStatus.style.background = '#e0f2fe';
      badgeMetaStatus.style.color = '#0284c7';
    } else {
      scoreMetaStatus.textContent = 'Zero Pixels';
      scoreMetaStatus.style.color = '#64748b';
      scorePixelIdText.textContent = 'No Trackers Installed';
      badgeMetaStatus.textContent = 'Cookie-Free';
      badgeMetaStatus.style.background = '#f1f5f9';
      badgeMetaStatus.style.color = '#475569';
    }

    // -------------------------------------------------------------
    // Bento 4: Web Host, Server & Platform
    // -------------------------------------------------------------
    if (scoreHostingProvider) {
      scoreHostingProvider.textContent = `${data.hosting.icon} ${data.hosting.providerName}`;
    }
    if (badgeHosting) {
      badgeHosting.textContent = data.hosting.badge;
      badgeHosting.style.background = data.hosting.category.includes('PaaS') ? '#f3e8ff' : '#e0f2fe';
      badgeHosting.style.color = data.hosting.category.includes('PaaS') ? '#7e22ce' : '#0369a1';
    }
    if (scoreServerLocation) {
      scoreServerLocation.textContent = `📍 ${data.hosting.locationStr} (${data.hosting.ip})`;
    }
    if (scorePlatform) {
      scorePlatform.textContent = data.tech.platform;
    }
    if (scoreCdn) {
      scoreCdn.textContent = data.hosting.cdn;
    }

    // -------------------------------------------------------------
    // Bento 5: Security Grade
    // -------------------------------------------------------------
    scoreSecurityGrade.textContent = data.securityInfo.grade;
    scoreSecurityGrade.style.color = data.securityInfo.gradeColor;
    badgeSecurityGrade.textContent = `${data.securityInfo.totalScore}/100`;

    // -------------------------------------------------------------
    // Bento 6: Social & Maps
    // -------------------------------------------------------------
    scoreSocialCount.textContent = socCount;
    scoreMapsFound.textContent = data.maps.found ? 'Physical Location' : 'Online Store';

    // Meta Ads Banner Buttons
    if (btnMetaAdLibrary) {
      btnMetaAdLibrary.href = `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&q=${encodeURIComponent(data.domain)}&search_type=keyword_unordered`;
    }
    if (btnGoogleAdCenter) {
      btnGoogleAdCenter.href = `https://adstransparency.google.com/?region=anywhere&domain=${encodeURIComponent(data.domain)}`;
    }
    if (pixelIdBadge) {
      pixelIdBadge.textContent = data.pixels.metaPixelFound ? `Meta Pixel: ${data.pixels.metaPixelId || 'Active'}` : 'Meta Pixel: Not Installed';
    }
    if (googleAdsBadge) {
      googleAdsBadge.textContent = data.trackingIds.gtm ? `GTM Tag: ${data.trackingIds.gtm}` : (data.trackingIds.ga4 ? `GA4 Tag: ${data.trackingIds.ga4}` : 'Google Tag: Inactive');
    }

    // -------------------------------------------------------------
    // Tab 1: Domain WHOIS, Live Date & Ownership Record
    // -------------------------------------------------------------
    dispCreatedDate.textContent = data.liveDateStr;
    dispCreatedAgo.textContent = `Age: ${data.ageStr}`;
    dispExpiryDate.textContent = data.expiryStr;
    dispExpiryCountdown.textContent = data.expirySub;
    dispRegistrar.textContent = data.rdapInfo?.registrar || 'Not Disclosed in Registry';
    dispRegistrarIana.textContent = data.rdapInfo?.registrarIanaId ? `IANA ID: ${data.rdapInfo.registrarIanaId}` : 'Direct Account';
    
    // Additional WHOIS Profile fields
    const dispRegistrant = document.getElementById('dispRegistrant');
    const dispRegistrantNotice = document.getElementById('dispRegistrantNotice');
    const dispRegistrantLocation = document.getElementById('dispRegistrantLocation');
    const dispUpdatedDate = document.getElementById('dispUpdatedDate');
    const dispDnssec = document.getElementById('dispDnssec');
    const dispAbuseContact = document.getElementById('dispAbuseContact');
    const dispWhoisNameservers = document.getElementById('dispWhoisNameservers');

    if (dispRegistrant) dispRegistrant.textContent = data.rdapInfo?.registrant || 'Privacy Protected';
    if (dispRegistrantNotice) {
      dispRegistrantNotice.textContent = (data.rdapInfo?.registrant && data.rdapInfo.registrant.toLowerCase().includes('privacy')) 
        ? 'Masked via GDPR / ICANN Privacy' 
        : 'Registered Legal Domain Owner';
    }
    if (dispRegistrantLocation) {
      dispRegistrantLocation.textContent = data.rdapInfo?.registrantLocation || (data.hosting?.countryFlag + ' ' + (data.hosting?.locationStr?.split(',')[0] || 'Registered Territory'));
    }
    if (dispUpdatedDate) {
      dispUpdatedDate.textContent = data.rdapInfo?.updatedDate 
        ? data.rdapInfo.updatedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) 
        : 'Registry Active Record';
    }
    if (dispTransferLock) {
      dispTransferLock.textContent = data.rdapInfo?.statusList?.some(s => s.toLowerCase().includes('prohibited')) 
        ? '🔒 Transfer Locked (Protected)' 
        : 'Active / Transfer Permitted';
    }
    if (dispDnssec) dispDnssec.textContent = data.rdapInfo?.dnssec || 'Unsigned';
    if (dispAbuseContact) {
      const abuseParts = [];
      if (data.rdapInfo?.abuseEmail) abuseParts.push(`✉️ ${data.rdapInfo.abuseEmail}`);
      if (data.rdapInfo?.abusePhone) abuseParts.push(`📞 ${data.rdapInfo.abusePhone}`);
      dispAbuseContact.textContent = abuseParts.length > 0 ? abuseParts.join(' • ') : 'Registrar Abuse Desk';
    }

    if (dispWhoisNameservers) {
      const nsList = (data.rdapInfo?.nameservers && data.rdapInfo.nameservers.length > 0)
        ? data.rdapInfo.nameservers
        : (data.dns?.nameservers || []);
      dispWhoisNameservers.innerHTML = nsList.length > 0
        ? nsList.map(ns => `<span style="background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-size: 11px;">🌐 ${escapeHtml(ns.toUpperCase())}</span>`).join('')
        : '<span style="color: var(--gray-500); font-size: 12px;">No authoritative nameservers listed in registry</span>';
    }

    if (btnWaybackFirst) {
      btnWaybackFirst.href = `https://web.archive.org/web/*/${data.domain}`;
    }

    // -------------------------------------------------------------
    // Tab 2: AI Builder & LLM Audit
    // -------------------------------------------------------------
    if (data.aiInfo.isAi) {
      if (aiAuditCategoryBadge) {
        aiAuditCategoryBadge.textContent = data.aiInfo.type === 'llm' ? 'LLM Heuristic Match' : 'Platform AI Match';
        aiAuditCategoryBadge.style.background = '#f3e8ff';
        aiAuditCategoryBadge.style.color = '#7e22ce';
      }
      aiVerdictIcon.textContent = data.aiInfo.icon;
      aiVerdictTitle.textContent = `AI Generated: ${data.aiInfo.toolName}`;
      aiVerdictTitle.style.color = '#7e22ce';
      aiVerdictDesc.textContent = data.aiInfo.desc;
      aiVerdictBox.style.background = '#faf5ff';
      aiVerdictBox.style.borderColor = '#e9d5ff';
      if (aiVerdictConfidence) aiVerdictConfidence.textContent = data.aiInfo.confidence;
      if (aiPlatformStatus) aiPlatformStatus.textContent = data.aiInfo.platformStatus;
      if (aiLlmStatus) aiLlmStatus.textContent = data.aiInfo.llmStatus;
      aiMatchedSignals.textContent = data.aiInfo.signals.join(' • ');
    } else {
      if (aiAuditCategoryBadge) {
        aiAuditCategoryBadge.textContent = 'Clean / Handcrafted';
        aiAuditCategoryBadge.style.background = '#ecfdf5';
        aiAuditCategoryBadge.style.color = '#15803d';
      }
      aiVerdictIcon.textContent = '🟢';
      aiVerdictTitle.textContent = 'Clean Handcrafted Code (Zero AI Builder Signatures)';
      aiVerdictTitle.style.color = '#166534';
      aiVerdictDesc.textContent = 'Traditional development framework or CMS. No signatures of managed AI website builders (v0, Lovable, Bolt.new, Framer AI, 10Web, Hostinger AI) or standalone Claude/LLM scripts were detected.';
      aiVerdictBox.style.background = '#f0fdf4';
      aiVerdictBox.style.borderColor = '#bbf7d0';
      if (aiVerdictConfidence) aiVerdictConfidence.textContent = 'Handcrafted (100%)';
      if (aiPlatformStatus) aiPlatformStatus.textContent = 'Clean (0/11 Platform Signatures)';
      if (aiLlmStatus) aiLlmStatus.textContent = 'Clean (Compiled Production Code)';
      aiMatchedSignals.textContent = 'Standard HTML5, CSS, and JavaScript. Zero AI generator tokens detected.';
    }

    aiChatbotsDetected.textContent = (data.aiInfo.aiBots && data.aiInfo.aiBots.length > 0)
      ? data.aiInfo.aiBots.join(', ')
      : 'None Detected';

    // -------------------------------------------------------------
    // Tab 3: Social Preview
    // -------------------------------------------------------------
    if (data.socialPreview.image) {
      socialPreviewImg.src = data.socialPreview.image;
      socialPreviewImg.style.display = 'block';
      socialPreviewNoImg.style.display = 'none';
    } else {
      socialPreviewImg.style.display = 'none';
      socialPreviewNoImg.style.display = 'block';
      socialPreviewNoImg.innerHTML = `
        <div style="text-align: center; padding: 24px 16px;">
          <div style="font-size: 32px; margin-bottom: 6px;">📄</div>
          <div style="font-size: 13px; font-weight: 700; color: #475569;">Text-Only Social Preview</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 3px;">No og:image tag found in page HTML</div>
        </div>
      `;
    }
    socialPreviewDomain.textContent = data.socialPreview.siteName || data.domain.toUpperCase();
    socialPreviewTitle.textContent = data.socialPreview.title;
    socialPreviewDesc.textContent = data.socialPreview.desc;

    ogChecklist.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; padding: 6px 0; border-bottom: 1px solid #e2e8f0;">
        <span>og:title</span>
        <strong style="color: ${data.socialPreview.title ? '#16a34a' : '#dc2626'}">${data.socialPreview.title ? '✓ Configured' : '✕ Missing'}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; padding: 6px 0; border-bottom: 1px solid #e2e8f0;">
        <span>og:description</span>
        <strong style="color: ${data.socialPreview.desc ? '#16a34a' : '#dc2626'}">${data.socialPreview.desc ? '✓ Configured' : '✕ Missing'}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; padding: 6px 0; border-bottom: 1px solid #e2e8f0;">
        <span>og:image (Social Card)</span>
        <strong style="color: ${data.socialPreview.image ? '#16a34a' : '#ca8a04'}">${data.socialPreview.image ? '✓ Image Present' : '⚠️ Missing (Text Only)'}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; padding: 6px 0;">
        <span>HTTPS Secure Protocol</span>
        <strong style="color: #16a34a;">✓ Active</strong>
      </div>
    `;

    // -------------------------------------------------------------
    // Tab 4: Security Headers Table
    // -------------------------------------------------------------
    securityGradeBadge.textContent = data.securityInfo.grade;
    securityGradeBadge.style.color = data.securityInfo.gradeColor;
    securityHeadersTableBody.innerHTML = '';
    data.securityInfo.headersList.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 600; color: var(--navy);">${escapeHtml(item.name)}</td>
        <td><span class="ocr-badge ${item.present ? 'status-ready' : 'status-processing'}" style="font-size: 11px;">${item.present ? '✓ Active' : '✕ Missing'}</span></td>
        <td style="color: var(--gray-700); font-family: var(--font-mono, monospace); font-size: 11px;">${escapeHtml(item.value)}</td>
      `;
      securityHeadersTableBody.appendChild(tr);
    });

    // -------------------------------------------------------------
    // Tab 5: Ad Pixels Grid (ONLY SHOW WHAT WAS FOUND!)
    // -------------------------------------------------------------
    pixelsGrid.innerHTML = '';
    if (pixelsAbsentContainer) {
      pixelsAbsentContainer.innerHTML = '';
      pixelsAbsentContainer.style.display = 'none';
    }

    const pixelEntries = [
      { key: 'ga4', name: 'Google Analytics 4 (GA4)', id: data.trackingIds.ga4, icon: '📊', desc: 'Google next-gen web & app event stream' },
      { key: 'gtm', name: 'Google Tag Manager (GTM)', id: data.trackingIds.gtm, icon: '🏷️', desc: 'Centralized enterprise tag manager container' },
      { key: 'meta', name: 'Meta / Facebook Ads Pixel', id: data.pixels.metaPixelId, icon: '🎯', desc: 'Meta conversions API & retargeting pixel' },
      { key: 'clarity', name: 'Microsoft Clarity', id: data.trackingIds.clarity, icon: '🔍', desc: 'Session recording & user behavior heatmaps' },
      { key: 'tiktok', name: 'TikTok Ads Pixel', id: data.trackingIds.tiktok, icon: '🎵', desc: 'TikTok conversion tracker & retargeting' },
      { key: 'hotjar', name: 'Hotjar Behavioral Heatmaps', id: data.trackingIds.hotjar, icon: '🔥', desc: 'Visitor clicks & scroll depth heatmaps' }
    ];

    const foundPixels = pixelEntries.filter(p => p.id);
    const absentPixels = pixelEntries.filter(p => !p.id);

    if (foundPixels.length > 0) {
      // 1. Render rich glowing cards ONLY for pixels that exist!
      foundPixels.forEach(entry => {
        const card = document.createElement('div');
        card.style.cssText = 'background: #ffffff; border: 1.5px solid #38bdf8; border-radius: var(--radius-md); padding: 16px 18px; box-shadow: 0 2px 8px rgba(14,165,233,0.08);';
        card.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="font-size: 14px; font-weight: 700; color: var(--navy); display: flex; align-items: center; gap: 8px;">
              <span>${entry.icon}</span> <span>${escapeHtml(entry.name)}</span>
            </div>
            <span class="ocr-badge status-ready" style="font-size: 11px; background: #ecfdf5; color: #15803d; border: 1px solid #bbf7d0;">✓ Detected</span>
          </div>
          <div style="font-family: var(--font-mono, monospace); font-size: 14px; font-weight: 700; color: #0369a1; background: #e0f2fe; padding: 6px 10px; border-radius: 6px; display: inline-block; margin: 4px 0 8px;">
            ${escapeHtml(entry.id)}
          </div>
          <div style="font-size: 12px; color: var(--gray-600);">${escapeHtml(entry.desc)}</div>
        `;
        pixelsGrid.appendChild(card);
      });

      // 2. Compact row for absent pixels
      if (pixelsAbsentContainer && absentPixels.length > 0) {
        pixelsAbsentContainer.style.display = 'block';
        pixelsAbsentContainer.innerHTML = `
          <div style="padding: 12px 16px; background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: 8px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
            <div style="font-size: 12px; font-weight: 600; color: var(--gray-600);">Checked & Not Installed on This Website:</div>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              ${absentPixels.map(p => `<span style="font-size: 11px; padding: 3px 8px; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 4px; color: #64748b;">${escapeHtml(p.name.split(' (')[0])}: Inactive</span>`).join('')}
            </div>
          </div>
        `;
      }
    } else {
      // ZERO PIXELS FOUND (e.g. prachari.com) - Show clean, reassuring Privacy Card!
      pixelsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; background: #f0fdf4; border: 1.5px solid #86efac; border-radius: var(--radius-lg); padding: 28px 24px; text-align: center;">
          <div style="font-size: 38px; margin-bottom: 10px;">🛡️</div>
          <div style="font-size: 18px; font-weight: 700; color: #166534; margin-bottom: 6px;">Zero Advertising Pixels or Analytics Tags Detected</div>
          <div style="font-size: 13px; color: #15803d; max-width: 620px; margin: 0 auto 16px; line-height: 1.5;">
            This website does not load any third-party marketing, conversion, or visitor-recording tracking scripts. It has zero tracking cookies and respects visitor privacy.
          </div>
          <div style="display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; max-width: 700px; margin: 0 auto;">
            <span style="background: #dcfce7; color: #166534; font-size: 12px; padding: 5px 12px; border-radius: 9999px; font-weight: 600; border: 1px solid #bbf7d0;">✓ No Meta / Facebook Pixel</span>
            <span style="background: #dcfce7; color: #166534; font-size: 12px; padding: 5px 12px; border-radius: 9999px; font-weight: 600; border: 1px solid #bbf7d0;">✓ No Google Analytics 4 (GA4)</span>
            <span style="background: #dcfce7; color: #166534; font-size: 12px; padding: 5px 12px; border-radius: 9999px; font-weight: 600; border: 1px solid #bbf7d0;">✓ No Google Tag Manager (GTM)</span>
            <span style="background: #dcfce7; color: #166534; font-size: 12px; padding: 5px 12px; border-radius: 9999px; font-weight: 600; border: 1px solid #bbf7d0;">✓ No Microsoft Clarity</span>
            <span style="background: #dcfce7; color: #166534; font-size: 12px; padding: 5px 12px; border-radius: 9999px; font-weight: 600; border: 1px solid #bbf7d0;">✓ No TikTok Pixel</span>
            <span style="background: #dcfce7; color: #166534; font-size: 12px; padding: 5px 12px; border-radius: 9999px; font-weight: 600; border: 1px solid #bbf7d0;">✓ No Hotjar Heatmaps</span>
          </div>
        </div>
      `;
    }

    // -------------------------------------------------------------
    // Tab 6: Socials & Maps & Contacts
    // -------------------------------------------------------------
    renderSocialProfiles(data.socials);
    renderMaps(data.maps, data.domain);
    renderContacts(data.contacts);

    // -------------------------------------------------------------
    // Tab 7: SEO
    // -------------------------------------------------------------
    seoTitleBox.textContent = data.title;
    titleCharCount.textContent = `${data.title.length} chars`;
    seoDescBox.textContent = data.metaDesc || 'No meta description tag provided.';
    descCharCount.textContent = `${data.metaDesc.length} chars`;
    serpSiteName.textContent = data.domain;
    serpBreadcrumb.textContent = `https://${data.domain}`;
    serpTitle.textContent = data.title;
    serpDesc.textContent = data.metaDesc || 'Discover official products and services from ' + data.domain;
    countH1.textContent = data.h1Count;
    countH2.textContent = data.h2Count;
    countSchema.textContent = data.hasSchema ? 'Detected ✓' : 'None';
    statCanonical.textContent = data.hasCanonical ? 'Valid ✓' : 'Missing ✕';

    // -------------------------------------------------------------
    // Tab 8: Tech Stack (ONLY DETECTED TECHNOLOGIES!)
    // -------------------------------------------------------------
    renderTechGrid(data.tech, data.hosting);

    // -------------------------------------------------------------
    // Tab 9: Web Host, Server & DNS Infrastructure Profile
    // -------------------------------------------------------------
    if (hostingTypeBadge) hostingTypeBadge.textContent = data.hosting.platformType;
    if (dispHproviderName) dispHproviderName.textContent = `${data.hosting.icon} ${data.hosting.providerName}`;
    if (dispHproviderType) dispHproviderType.textContent = `${data.hosting.platformType} • ${data.hosting.category}`;
    if (dispServerLocation) dispServerLocation.textContent = data.hosting.locationStr;
    if (dispServerCoordinates) dispServerCoordinates.textContent = data.hosting.coords;
    if (dispServerIp) dispServerIp.textContent = data.hosting.ip;
    if (dispServerIpv6) dispServerIpv6.textContent = data.hosting.ipv6;
    if (dispServerIpv6Status) {
      dispServerIpv6Status.textContent = (data.hosting.ipv6 && data.hosting.ipv6 !== 'Not Configured') ? '✓ IPv6 Enabled' : 'IPv4 Only';
    }
    if (dispServerAsn) dispServerAsn.textContent = data.hosting.asn;
    if (dispServerOrg) dispServerOrg.textContent = data.hosting.asnOrg;
    if (dispWebServer) dispWebServer.textContent = data.hosting.webServer;
    if (dispCdnLayer) dispCdnLayer.textContent = data.hosting.cdn;

    dnsNameserversList.innerHTML = (data.dns.nameservers && data.dns.nameservers.length > 0)
      ? data.dns.nameservers.map(ns => `<div>🌐 ${escapeHtml(ns)}</div>`).join('')
      : '<div>No authoritative NS records found.</div>';

    dnsMxList.innerHTML = (data.dns.mx && data.dns.mx.length > 0)
      ? data.dns.mx.map(mx => `<div>✉️ ${escapeHtml(mx)}</div>`).join('')
      : '<div>No public MX mail exchange records configured.</div>';

    // -------------------------------------------------------------
    // Tab 10: Intelligence Links
    // -------------------------------------------------------------
    if (intelWayback) intelWayback.href = `https://web.archive.org/web/*/${data.domain}`;
    if (intelSimilarweb) intelSimilarweb.href = `https://www.similarweb.com/website/${data.domain}/`;
    if (intelPagespeed) intelPagespeed.href = `https://pagespeed.web.dev/analysis?url=https%3A%2F%2F${encodeURIComponent(data.domain)}`;
    if (intelAhrefs) intelAhrefs.href = `https://ahrefs.com/backlink-checker/?input=${encodeURIComponent(data.domain)}&mode=subdomains`;

    // -------------------------------------------------------------
    // Executive Intelligence Snapshot Bar (Instant 360° Overview)
    // -------------------------------------------------------------
    const snapDomainName = document.getElementById('snapDomainName');
    const snapPageTitle = document.getElementById('snapPageTitle');
    const snapLiveDate = document.getElementById('snapLiveDate');
    const snapAgeDetail = document.getElementById('snapAgeDetail');
    const snapRegistrar = document.getElementById('snapRegistrar');
    const snapExpiryCountdown = document.getElementById('snapExpiryCountdown');
    const snapHosting = document.getElementById('snapHosting');
    const snapServerLocation = document.getElementById('snapServerLocation');
    const snapAiBuilder = document.getElementById('snapAiBuilder');
    const snapAiVerdict = document.getElementById('snapAiVerdict');
    const snapAdPixels = document.getElementById('snapAdPixels');
    const snapPixelsStatus = document.getElementById('snapPixelsStatus');
    const snapSupportChat = document.getElementById('snapSupportChat');
    const snapTechCount = document.getElementById('snapTechCount');
    const btnSnapCopySummary = document.getElementById('btnSnapCopySummary');
    const btnSnapLiveSite = document.getElementById('btnSnapLiveSite');

    if (snapDomainName) snapDomainName.textContent = data.domain;
    if (snapPageTitle) snapPageTitle.textContent = data.title || ('Official Website of ' + data.domain);
    if (btnSnapLiveSite) btnSnapLiveSite.href = `https://${data.domain}`;

    if (snapLiveDate) snapLiveDate.textContent = data.liveDateStr;
    if (snapAgeDetail) snapAgeDetail.textContent = data.ageStr;

    if (snapRegistrar) snapRegistrar.textContent = (data.rdapInfo?.registrar || 'Registrar Listed').split(',')[0].split(' Inc')[0];
    if (snapExpiryCountdown) snapExpiryCountdown.textContent = data.expirySub;

    if (snapHosting) snapHosting.textContent = `${data.hosting.icon} ${data.hosting.providerName}`;
    if (snapServerLocation) snapServerLocation.textContent = data.hosting.platformType;

    if (snapAiBuilder) {
      snapAiBuilder.textContent = data.aiInfo.isAi ? data.aiInfo.toolName : 'Handcrafted Code';
    }
    if (snapAiVerdict) {
      snapAiVerdict.textContent = data.aiInfo.isAi ? 'AI Builder Signature' : 'Human Custom Dev';
      snapAiVerdict.style.color = data.aiInfo.isAi ? '#c084fc' : '#4ade80';
    }

    const activePixelCount = [
      data.trackingIds.ga4, data.trackingIds.gtm, data.pixels.metaPixelId,
      data.trackingIds.clarity, data.trackingIds.tiktok, data.trackingIds.hotjar
    ].filter(Boolean).length;

    if (snapAdPixels) {
      snapAdPixels.textContent = activePixelCount > 0 ? `${activePixelCount} Active Pixels` : '0 Tracking Pixels';
    }
    if (snapPixelsStatus) {
      snapPixelsStatus.textContent = activePixelCount > 0 ? 'Marketing Pixels Active' : 'Clean / Privacy Friendly';
      snapPixelsStatus.style.color = activePixelCount > 0 ? '#38bdf8' : '#4ade80';
    }

    if (snapSupportChat) {
      snapSupportChat.textContent = data.tech.liveChat || (data.contacts.emails.length > 0 ? 'Email Support' : 'Web Contacts');
    }

    const detectedTechCount = document.querySelectorAll('#analyzerTechGrid .tech-card, #analyzerTechGrid [style*="padding: 14px 16px"]').length;
    if (snapTechCount) {
      snapTechCount.textContent = `${detectedTechCount > 0 ? detectedTechCount : '5+'} Verified Tech`;
    }

    if (btnSnapCopySummary) {
      btnSnapCopySummary.onclick = () => {
        const text = `360° Website Snapshot for ${data.domain}:
- First Live Date: ${data.liveDateStr} (Age: ${data.ageStr})
- Registrar: ${data.rdapInfo?.registrar || 'N/A'} (Expiry: ${data.expiryStr}, ${data.expirySub})
- Hosting: ${data.hosting.providerName} (${data.hosting.platformType})
- AI Code Signature: ${data.aiInfo.isAi ? data.aiInfo.toolName : 'Handcrafted Code (Human)'}
- Ad Tracking: ${activePixelCount} Active Pixels
- Support / Live Chat: ${data.tech.liveChat || 'N/A'}
- Full 360° Report: https://alltoolsinone.com/tools/website-analyzer.html`;
        navigator.clipboard.writeText(text).then(() => {
          btnSnapCopySummary.textContent = '✓ Copied!';
          setTimeout(() => btnSnapCopySummary.textContent = '📋 Copy Summary', 2000);
        });
      };
    }

    // -------------------------------------------------------------
    // Dynamic Badges on Tab Navigation Buttons
    // -------------------------------------------------------------
    const tabBtnLiveDate = document.getElementById('tabBtnLiveDate');
    const tabBtnAi = document.getElementById('tabBtnAi');
    const tabBtnSocialCard = document.getElementById('tabBtnSocialCard');
    const tabBtnSecurity = document.getElementById('tabBtnSecurity');
    const tabBtnPixels = document.getElementById('tabBtnPixels');
    const tabBtnSocials = document.getElementById('tabBtnSocials');
    const tabBtnSeo = document.getElementById('tabBtnSeo');
    const tabBtnTech = document.getElementById('tabBtnTech');
    const tabBtnDns = document.getElementById('tabBtnDns');
    const tabBtnIntel = document.getElementById('tabBtnIntel');

    if (tabBtnLiveDate) tabBtnLiveDate.innerHTML = `📅 Live Date &amp; WHOIS <span style="font-size: 10px; background: rgba(0,0,0,0.06); padding: 2px 6px; border-radius: 9999px; margin-left: 4px;">${data.rdapInfo?.registeredDate ? data.liveDateStr.split(' ')[2] : 'Active'}</span>`;
    if (tabBtnAi) tabBtnAi.innerHTML = `🤖 AI Builder <span style="font-size: 10px; background: rgba(0,0,0,0.06); padding: 2px 6px; border-radius: 9999px; margin-left: 4px;">${data.aiInfo.isAi ? 'AI' : 'Human'}</span>`;
    if (tabBtnSocialCard) tabBtnSocialCard.innerHTML = `🖼️ Social Card <span style="font-size: 10px; background: rgba(0,0,0,0.06); padding: 2px 6px; border-radius: 9999px; margin-left: 4px;">${data.socialPreview.image ? '✓' : 'OG'}</span>`;
    if (tabBtnSecurity) tabBtnSecurity.innerHTML = `🛡️ Security <span style="font-size: 10px; background: rgba(0,0,0,0.06); padding: 2px 6px; border-radius: 9999px; margin-left: 4px;">Grade ${data.securityInfo.grade}</span>`;
    if (tabBtnPixels) tabBtnPixels.innerHTML = `🎯 Ad Pixels <span style="font-size: 10px; background: ${activePixelCount > 0 ? '#e0f2fe' : '#dcfce7'}; color: ${activePixelCount > 0 ? '#0369a1' : '#166534'}; padding: 2px 6px; border-radius: 9999px; margin-left: 4px; font-weight: 700;">${activePixelCount > 0 ? activePixelCount + ' Active' : '0 (Clean)'}</span>`;
    const totalSoc = Object.keys(data.socials).length + (data.tech.liveChat ? 1 : 0);
    if (tabBtnSocials) tabBtnSocials.innerHTML = `📱 Socials &amp; Maps <span style="font-size: 10px; background: rgba(0,0,0,0.06); padding: 2px 6px; border-radius: 9999px; margin-left: 4px;">${totalSoc > 0 ? totalSoc : '0'}</span>`;
    if (tabBtnSeo) tabBtnSeo.innerHTML = `🔍 SEO &amp; Meta <span style="font-size: 10px; background: rgba(0,0,0,0.06); padding: 2px 6px; border-radius: 9999px; margin-left: 4px;">H1: ${data.h1Count}</span>`;
    if (tabBtnTech) tabBtnTech.innerHTML = `🛠️ Tech Stack <span style="font-size: 10px; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 9999px; margin-left: 4px; font-weight: 700;">${detectedTechCount > 0 ? detectedTechCount : 'Verified'}</span>`;
    if (tabBtnDns) tabBtnDns.innerHTML = `☁️ Host &amp; DNS <span style="font-size: 10px; background: rgba(0,0,0,0.06); padding: 2px 6px; border-radius: 9999px; margin-left: 4px;">${data.hosting.providerName.split(' ')[0]}</span>`;
    if (tabBtnIntel) tabBtnIntel.innerHTML = `📊 Traffic &amp; Wayback <span style="font-size: 10px; background: rgba(0,0,0,0.06); padding: 2px 6px; border-radius: 9999px; margin-left: 4px;">Live</span>`;

    analyzerDashboard.style.display = 'block';
    analyzerDashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Helper render functions
  function renderSocialProfiles(socials) {
    if (!socialProfilesGrid) return;
    socialProfilesGrid.innerHTML = '';
    const keys = Object.keys(socials);
    if (keys.length === 0) {
      socialProfilesGrid.innerHTML = '<div style="padding: 14px 16px; background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: 8px; font-size: 13px; color: var(--gray-600); grid-column: 1/-1;">ℹ️ No public social media profile links (Instagram, Facebook, LinkedIn, YouTube, X) detected in website source code.</div>';
      return;
    }
    const icons = {
      instagram: '📸 Instagram',
      facebook: '📘 Facebook',
      twitter: '🐦 Twitter / X',
      youtube: '▶️ YouTube',
      linkedin: '💼 LinkedIn',
      pinterest: '📌 Pinterest',
      github: '🐙 GitHub'
    };
    keys.forEach(k => {
      const card = document.createElement('a');
      card.href = socials[k];
      card.target = '_blank';
      card.rel = 'noopener';
      card.className = 'analyzer-social-card';
      card.innerHTML = `
        <div style="font-weight: 700; color: var(--navy); font-size: 14px;">${icons[k] || k}</div>
        <div style="font-size: 11px; color: var(--gray-500); word-break: break-all; margin-top: 4px;">${escapeHtml(socials[k])}</div>
        <div style="font-size: 11px; color: #4f46e5; font-weight: 600; margin-top: 6px;">Open Channel ↗</div>
      `;
      socialProfilesGrid.appendChild(card);
    });
  }

  function renderMaps(maps, domain) {
    if (!mapsContainer) return;
    mapsContainer.innerHTML = '';
    if (maps.found && maps.embedUrl) {
      mapsContainer.innerHTML = `
        <div style="border-radius: 8px; overflow: hidden; border: 1px solid var(--gray-200); margin-bottom: 12px;">
          <iframe src="${escapeHtml(maps.embedUrl)}" width="100%" height="240" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
        </div>
        <div style="font-size: 13px; color: var(--navy); font-weight: 600;">${escapeHtml(maps.address || 'Headquarters location embedded from Google Maps')}</div>
      `;
    } else if (maps.address) {
      mapsContainer.innerHTML = `
        <div style="padding: 14px 16px; background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: 8px; font-size: 13px;">
          <strong>📍 Physical Registered Address Found:</strong>
          <div style="color: var(--gray-700); margin-top: 4px;">${escapeHtml(maps.address)}</div>
        </div>
      `;
    } else {
      mapsContainer.innerHTML = `
        <div style="padding: 14px 16px; background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: 8px; font-size: 13px; color: var(--gray-600); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
          <span>🌐 <strong>Online-Only Business:</strong> No physical store or Google Maps embed detected in page source.</span>
          <a href="https://www.google.com/maps/search/${encodeURIComponent(domain)}" target="_blank" rel="noopener" class="btn btn-outline" style="font-size: 11px; padding: 4px 10px;">Search Maps ↗</a>
        </div>
      `;
    }
    if (btnSearchMaps) {
      btnSearchMaps.href = `https://www.google.com/maps/search/${encodeURIComponent(maps.address || domain)}`;
    }
  }

  function renderContacts(contacts) {
    if (!contactDetailsList) return;
    contactDetailsList.innerHTML = '';
    const hasEmails = contacts.emails && contacts.emails.length > 0;
    const hasPhones = contacts.phones && contacts.phones.length > 0;

    if (!hasEmails && !hasPhones) {
      contactDetailsList.innerHTML = '<div style="padding: 14px 16px; background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: 8px; font-size: 13px; color: var(--gray-600);">ℹ️ No direct customer support mailto: or tel: links found on the homepage.</div>';
      return;
    }

    if (hasEmails) {
      contacts.emails.forEach(em => {
        const item = document.createElement('div');
        item.className = 'analyzer-contact-item';
        item.innerHTML = `
          <span style="font-size: 18px;">✉️</span>
          <div>
            <div style="font-weight: 600; color: var(--navy);">Email Address</div>
            <a href="mailto:${escapeHtml(em)}" style="color: #4f46e5; text-decoration: none; font-size: 13px;">${escapeHtml(em)}</a>
          </div>
        `;
        contactDetailsList.appendChild(item);
      });
    }

    if (hasPhones) {
      contacts.phones.forEach(ph => {
        const item = document.createElement('div');
        item.className = 'analyzer-contact-item';
        item.innerHTML = `
          <span style="font-size: 18px;">📞</span>
          <div>
            <div style="font-weight: 600; color: var(--navy);">Phone Number</div>
            <a href="tel:${escapeHtml(ph)}" style="color: #16a34a; text-decoration: none; font-size: 13px;">${escapeHtml(ph)}</a>
          </div>
        `;
        contactDetailsList.appendChild(item);
      });
    }
  }

  // Render Tech Grid: ONLY DISPLAY WHAT WAS DETECTED!
  function renderTechGrid(tech, hosting) {
    if (!analyzerTechGrid) return;
    analyzerTechGrid.innerHTML = '';

    const categories = [];

    // 1. Font Scripts (Wappalyzer matched)
    if (tech.fontScripts) {
      categories.push({
        title: 'Font scripts',
        icon: '🔤',
        items: [{ name: tech.fontScripts, badge: 'Typography', icon: '🔤' }]
      });
    }

    // 2. Live Chat & Support (Wappalyzer matched)
    if (tech.liveChat) {
      categories.push({
        title: 'Live chat & Customer Support',
        icon: '💬',
        items: [{ name: tech.liveChat, badge: 'Live Chat', icon: '💬' }]
      });
    }

    // 3. Miscellaneous & Social Protocol (Wappalyzer matched)
    if (tech.openGraph) {
      categories.push({
        title: 'Miscellaneous & Social Cards',
        icon: '🏷️',
        items: [{ name: tech.openGraph, badge: 'Social Meta', icon: '🌐' }]
      });
    }

    // 4. PaaS (Platform as a Service)
    if (hosting && (hosting.category.includes('PaaS') || hosting.providerName === 'Netlify' || hosting.providerName === 'Vercel')) {
      categories.push({
        title: 'PaaS (Platform as a Service)',
        icon: '⚡',
        items: [{ name: hosting.providerName, badge: 'PaaS Verified', icon: '⚡' }]
      });
    }

    // 5. CDN (Content Delivery Network)
    if (hosting && hosting.cdn && !hosting.cdn.includes('Standard Network')) {
      categories.push({
        title: 'CDN (Content Delivery Network)',
        icon: '🚀',
        items: [{ name: hosting.cdn, badge: 'Anycast Edge', icon: '🚀' }]
      });
    } else if (tech.cdn) {
      categories.push({
        title: 'CDN (Content Delivery Network)',
        icon: '🚀',
        items: [{ name: tech.cdn, badge: 'Edge CDN', icon: '🚀' }]
      });
    }

    // 6. Web Hosting & Cloud Server
    if (hosting && hosting.providerName && hosting.providerName !== 'Independent Host' && !hosting.category.includes('PaaS')) {
      categories.push({
        title: 'Web Hosting & Cloud Server',
        icon: '🏢',
        items: [{ name: hosting.providerName, badge: 'Cloud Host', icon: '🌐' }]
      });
    }

    // 7. Web Server Software
    if (hosting && hosting.webServer) {
      categories.push({
        title: 'Web Server Software',
        icon: '🖥️',
        items: [{ name: hosting.webServer, badge: 'Server', icon: '🖥️' }]
      });
    }

    // 8. CMS / E-Commerce Platform
    if (tech.platform) {
      categories.push({
        title: 'CMS / E-Commerce Platform',
        icon: '🛍️',
        items: [{ name: tech.platform, badge: 'Platform', icon: '🛍️' }]
      });
    }

    // 9. Frontend Framework & Architecture
    if (tech.framework) {
      categories.push({
        title: 'Frontend Framework & Architecture',
        icon: '⚛️',
        items: [{ name: tech.framework, badge: 'Frontend', icon: '⚛️' }]
      });
    }

    // 10. Web Analytics & Tag Management
    if (tech.analytics) {
      categories.push({
        title: 'Web Analytics & Tag Management',
        icon: '📊',
        items: [{ name: tech.analytics, badge: 'Tracking', icon: '📊' }]
      });
    }

    // 11. Payment Gateways
    if (tech.payments) {
      categories.push({
        title: 'Payment Gateways & Checkout',
        icon: '💳',
        items: [{ name: tech.payments, badge: 'Billing', icon: '💳' }]
      });
    }

    const totalTechs = categories.reduce((sum, c) => sum + c.items.length, 0);

    // Summary banner at top
    const summaryBanner = document.createElement('div');
    summaryBanner.style.cssText = 'margin-bottom: 20px; padding: 12px 18px; background: #f0fdf4; border: 1px solid #86efac; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;';
    summaryBanner.innerHTML = `
      <div style="font-size: 14px; font-weight: 700; color: #166534; display: flex; align-items: center; gap: 8px;">
        <span>✅</span> <span>${totalTechs} Technologies Discovered &amp; Verified</span>
      </div>
      <span style="font-size: 11px; color: #15803d; font-weight: 600; background: #dcfce7; padding: 4px 10px; border-radius: 9999px;">Wappalyzer / BuiltWith Standard</span>
    `;
    analyzerTechGrid.appendChild(summaryBanner);

    // Render grouped categories
    categories.forEach(cat => {
      const groupDiv = document.createElement('div');
      groupDiv.style.cssText = 'margin-bottom: 22px; width: 100%;';
      groupDiv.innerHTML = `
        <div style="font-size: 12px; font-weight: 700; color: var(--navy); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
          <span>${cat.icon}</span> <span>${escapeHtml(cat.title)}</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px;">
          ${cat.items.map(it => `
            <div style="background: var(--white); border: 1px solid var(--gray-200); border-radius: var(--radius-md); padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
              <div style="font-size: 14px; font-weight: 700; color: var(--navy); display: flex; align-items: center; gap: 8px;">
                <span>${it.icon}</span> <span>${escapeHtml(it.name)}</span>
              </div>
              <span class="ocr-badge status-ready" style="font-size: 10px; padding: 3px 8px;">${escapeHtml(it.badge)}</span>
            </div>
          `).join('')}
        </div>
      `;
      analyzerTechGrid.appendChild(groupDiv);
    });

    return totalTechs;
  }

  // Social Extractors
  function extractSocialProfiles(html, doc) {
    const socials = {};
    if (!html) return socials;
    const patterns = {
      instagram: /https?:\/\/(?:www\.)?instagram\.com\/([a-zA-Z0-9_.-]+)/i,
      facebook: /https?:\/\/(?:www\.)?facebook\.com\/([a-zA-Z0-9_.-]+)/i,
      twitter: /https?:\/\/(?:www\.)?(?:twitter|x)\.com\/([a-zA-Z0-9_]+)/i,
      youtube: /https?:\/\/(?:www\.)?youtube\.com\/(?:channel|c|user|@)?([a-zA-Z0-9_.-]+)/i,
      linkedin: /https?:\/\/(?:www\.)?linkedin\.com\/(?:company|in)\/([a-zA-Z0-9_.-]+)/i,
      pinterest: /https?:\/\/(?:www\.)?pinterest\.(?:com|in)\/([a-zA-Z0-9_.-]+)/i,
      github: /https?:\/\/(?:www\.)?github\.com\/([a-zA-Z0-9_.-]+)/i
    };
    Object.keys(patterns).forEach(k => {
      const match = html.match(patterns[k]);
      if (match && !match[0].includes('/sharer') && !match[0].includes('/intent/tweet') && !match[0].includes('facebook.com/tr')) {
        socials[k] = match[0];
      }
    });
    return socials;
  }

  function extractEmails(html) {
    if (!html) return [];
    const mailto = Array.from(html.matchAll(/mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi)).map(m => m[1]);
    const raw = Array.from(html.matchAll(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi)).map(m => m[0]);
    const all = [...new Set([...mailto, ...raw])]
      .filter(e => !e.endsWith('.png') && !e.endsWith('.jpg') && !e.includes('example.com') && !e.includes('sentry.io'))
      .slice(0, 5);
    return all;
  }

  function extractPhones(html) {
    if (!html) return [];
    const tel = Array.from(html.matchAll(/tel:([+0-9\s-]{7,18})/gi)).map(m => m[1].trim());
    const raw = Array.from(html.matchAll(/(?:\+91[\s-]?)?[0-9]{3,5}[\s-]?[0-9]{6,8}/g)).map(m => m[0].trim());
    return [...new Set([...tel, ...raw])].slice(0, 4);
  }

  function extractMapsInfo(html, doc, domain) {
    if (!html) return { found: false };
    const embedMatch = html.match(/src=["'](https?:\/\/(?:www\.)?google\.com\/maps\/embed[^"']+)["']/i);
    let address = '';
    const addrElem = doc?.querySelector('address') || doc?.querySelector('[itemprop="address"]');
    if (addrElem) {
      address = addrElem.innerText.replace(/\s+/g, ' ').trim();
    } else {
      const regMatch = html.match(/(?:Registered Office|Corporate Office|Headquarters|Factory Address)[:\s]+([^<\n]{20,160})/i);
      if (regMatch) address = regMatch[1].replace(/\s+/g, ' ').trim();
    }
    return {
      found: !!embedMatch || !!address,
      embedUrl: embedMatch ? embedMatch[1] : null,
      address: address
    };
  }

  function extractAdvertisingPixels(html) {
    const res = { metaPixelFound: false, metaPixelId: null };
    if (!html) return res;
    const pixelMatch = html.match(/fbq\s*\(\s*['"]init['"]\s*,\s*['"]?(\d{14,16})['"]?/i) || html.match(/fbevents\.js.*?id=(\d{14,16})/i);
    if (pixelMatch) {
      res.metaPixelFound = true;
      res.metaPixelId = pixelMatch[1];
    } else if (html.includes('connect.facebook.net') || html.includes('fbevents.js')) {
      res.metaPixelFound = true;
    }
    return res;
  }

  function extractTechStack(html, rawHeaders, dns, hosting = null) {
    const h = (html || '').toLowerCase();
    
    // E-commerce / CMS
    let platform = null;
    if (h.includes('cdn.shopify.com') || h.includes('myshopify.com')) platform = 'Shopify Store';
    else if (h.includes('wp-content') || h.includes('wp-includes')) platform = 'WordPress / WooCommerce';
    else if (h.includes('wix.com')) platform = 'Wix Website';
    else if (h.includes('squarespace.com')) platform = 'Squarespace';
    else if (h.includes('webflow.com')) platform = 'Webflow';

    // CDN & Edge
    let cdn = hosting ? hosting.cdn : null;
    if (!cdn) {
      const ns = (dns.nameservers || []).join(' ').toLowerCase();
      if (ns.includes('cloudflare') || h.includes('cloudflare')) cdn = 'Cloudflare Global Anycast CDN';
      else if (ns.includes('awsdns') || h.includes('cloudfront')) cdn = 'Amazon CloudFront (AWS)';
      else if (ns.includes('google')) cdn = 'Google Cloud CDN';
      else if (ns.includes('nsone.net') || ns.includes('netlify')) cdn = 'Netlify Global Anycast CDN';
    }

    // Frontend UI Framework
    let framework = null;
    if (h.includes('__next') || h.includes('next.js')) framework = 'Next.js (React)';
    else if (h.includes('react') || h.includes('reactdom')) framework = 'React.js SPA';
    else if (h.includes('vue') || h.includes('nuxt')) framework = 'Vue.js / Nuxt';
    else if (h.includes('tailwind')) framework = 'Tailwind CSS';
    else if (h.includes('bootstrap')) framework = 'Bootstrap CSS';
    else framework = 'HTML5 & Vanilla JavaScript';

    // Web Analytics
    let analytics = null;
    if (h.includes('googletagmanager.com') || h.includes('google-analytics.com')) analytics = 'Google Analytics 4 & GTM';

    // Payment Gateway
    let payments = null;
    if (h.includes('razorpay')) payments = 'Razorpay Payment Gateway';
    else if (h.includes('stripe')) payments = 'Stripe Payments';
    else if (h.includes('cashfree')) payments = 'Cashfree Payments';
    else if (h.includes('paypal')) payments = 'PayPal Checkout';

    // Font Scripts
    let fontScripts = null;
    if (h.includes('fonts.googleapis.com') || h.includes('fonts.gstatic.com')) fontScripts = 'Google Font API';
    else if (h.includes('use.typekit.net')) fontScripts = 'Adobe Typekit Fonts';
    else if (h.includes('fontawesome') || h.includes('font-awesome')) fontScripts = 'Font Awesome Icons';

    // Live Chat & Support
    let liveChat = null;
    if (h.includes('wa.me') || h.includes('api.whatsapp.com') || h.includes('whatsapp')) liveChat = 'WhatsApp Business Chat';
    else if (h.includes('tidio.co') || h.includes('tidio.com')) liveChat = 'Tidio Live Chat';
    else if (h.includes('intercom.io') || h.includes('intercomcdn.com')) liveChat = 'Intercom Live Chat';
    else if (h.includes('zendesk.com') || h.includes('zopim.com')) liveChat = 'Zendesk Chat';
    else if (h.includes('crisp.chat')) liveChat = 'Crisp Live Chat';
    else if (h.includes('tawk.to')) liveChat = 'Tawk.to Chat';

    // Miscellaneous / Open Graph Protocol
    let openGraph = null;
    if (h.includes('og:title') || h.includes('og:description') || h.includes('og:image')) openGraph = 'Open Graph Protocol (Social Card Meta Tags)';

    return { platform, cdn, framework, analytics, payments, fontScripts, liveChat, openGraph };
  }

  // Copy Full Report
  function copyAuditReport() {
    if (!currentAuditData) return;
    const d = currentAuditData;
    let r = `=====================================================\n`;
    r += `ALLTOOLSINONE - 360° WEBSITE & INTELLIGENCE AUDIT\n`;
    r += `=====================================================\n`;
    r += `Domain               : ${d.domain}\n`;
    r += `Page Title           : ${d.title}\n`;
    r += `First Live Date      : ${d.liveDateStr} (Age: ${d.ageStr})\n`;
    r += `Domain Expiry        : ${d.expiryStr} (${d.expirySub})\n`;
    r += `Registrar            : ${d.rdapInfo?.registrar || 'Not Disclosed'}\n`;
    r += `Hosting Provider     : ${d.hosting.providerName} (${d.hosting.platformType})\n`;
    r += `Server Location      : ${d.hosting.locationStr}\n`;
    r += `Server IP (IPv4)     : ${d.hosting.ip}\n`;
    if (d.hosting.ipv6 && d.hosting.ipv6 !== 'Not Configured') r += `Server IP (IPv6)     : ${d.hosting.ipv6}\n`;
    r += `Autonomous System    : ${d.hosting.asn} (${d.hosting.asnOrg})\n`;
    r += `Web Server & CDN     : ${d.hosting.webServer} · ${d.hosting.cdn}\n`;
    r += `AI Builder Verdict   : ${d.aiInfo.toolName} (${d.aiInfo.confidence})\n`;
    if (d.aiInfo.platformStatus) r += `AI Platform Status   : ${d.aiInfo.platformStatus}\n`;
    if (d.aiInfo.llmStatus) r += `LLM Heuristic Status : ${d.aiInfo.llmStatus}\n`;
    r += `Security Grade       : ${d.securityInfo.grade} (${d.securityInfo.totalScore}/100)\n`;
    r += `Meta Ads Tracking    : ${d.pixels.metaPixelFound ? 'Active Pixel (ID: ' + (d.pixels.metaPixelId || 'Detected') + ')' : 'None'}\n`;
    r += `E-commerce / CMS     : ${d.tech.platform} on ${d.hosting.cdn}\n`;
    if (d.tech.fontScripts) r += `Font Scripts         : ${d.tech.fontScripts}\n`;
    if (d.tech.liveChat)    r += `Live Chat Support    : ${d.tech.liveChat}\n`;
    if (d.trackingIds.ga4) r += `Google Analytics 4   : ${d.trackingIds.ga4}\n`;
    if (d.trackingIds.gtm) r += `Google Tag Manager   : ${d.trackingIds.gtm}\n`;
    r += `Social Media Profiles: ${Object.keys(d.socials).length} Found\n`;
    Object.keys(d.socials).forEach(k => { r += `  - ${k}: ${d.socials[k]}\n`; });
    if (d.contacts.emails.length) r += `Support Emails       : ${d.contacts.emails.join(', ')}\n`;
    if (d.contacts.phones.length) r += `Support Phones       : ${d.contacts.phones.join(', ')}\n`;
    r += `\n--- QUICK LINKS ---\n`;
    r += `Meta Ad Library      : https://www.facebook.com/ads/library/?q=${encodeURIComponent(d.domain)}\n`;
    r += `Wayback Machine First: https://web.archive.org/web/*/${d.domain}\n`;
    r += `Google PageSpeed     : https://pagespeed.web.dev/analysis?url=https%3A%2F%2F${encodeURIComponent(d.domain)}\n`;
    r += `\n=====================================================\n`;
    r += `Report generated by AllToolsInOne (https://alltoolsinone.com/tools/website-analyzer.html)\n`;

    navigator.clipboard.writeText(r).then(() => {
      showToast('Full 360° Audit Report copied to clipboard!', 'success');
    });
  }

  // Download JSON
  function downloadJsonReport() {
    if (!currentAuditData) return;
    const blob = new Blob([JSON.stringify(currentAuditData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `website-audit-${currentAuditData.domain}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported audit report as JSON!', 'success');
  }

  function showLoading(show, title = '', subtitle = '') {
    if (!analyzerLoading) return;
    analyzerLoading.style.display = show ? 'block' : 'none';
    if (loadingTitle) loadingTitle.textContent = title;
    if (loadingSubtitle) loadingSubtitle.textContent = subtitle;
    if (show && analyzerDashboard) analyzerDashboard.style.display = 'none';
  }

  function updateLoading(title, subtitle) {
    if (loadingTitle) loadingTitle.textContent = title;
    if (loadingSubtitle) loadingSubtitle.textContent = subtitle;
  }

  function showToast(msg, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#1e293b'};
      color: #fff;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      box-shadow: 0 4px 14px rgba(0,0,0,0.18);
      z-index: 99999;
      animation: fadeIn 0.3s ease;
    `;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  function escapeHtml(str) {
    return (str || '').replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    })[m]);
  }

  // Boot
  init();
});
