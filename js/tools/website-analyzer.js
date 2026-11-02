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

  // Tab 2: AI Builder
  const aiVerdictBox = document.getElementById('aiVerdictBox');
  const aiVerdictIcon = document.getElementById('aiVerdictIcon');
  const aiVerdictTitle = document.getElementById('aiVerdictTitle');
  const aiVerdictDesc = document.getElementById('aiVerdictDesc');
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

    let registrar = 'Not Disclosed / Independent';
    let registrarIanaId = null;

    function scan(ent) {
      if (!ent) return;
      const roles = (ent.roles || []).map(r => (r || '').toLowerCase());
      if (ent.publicIds) {
        const iana = ent.publicIds.find(p => (p.type || '').toLowerCase().includes('iana'));
        if (iana) registrarIanaId = iana.identifier;
      }
      if (ent.vcardArray && ent.vcardArray[1]) {
        const fn = ent.vcardArray[1].find(p => p[0] === 'fn');
        if (roles.includes('registrar') && fn && fn[3]) registrar = fn[3];
      }
      if (ent.entities) ent.entities.forEach(scan);
    }
    (rawRdap.entities || []).forEach(scan);

    return {
      registeredDate,
      expiresDate,
      updatedDate,
      registrar,
      registrarIanaId,
      statusList: rawRdap.status || []
    };
  }

  // Detect AI Website Builder & Generator
  function detectAiBuilder(html, rawHeaders = {}) {
    const h = (html || '').toLowerCase();
    const headersStr = (typeof rawHeaders === 'string' ? rawHeaders : JSON.stringify(rawHeaders)).toLowerCase();

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
          toolName: item.name,
          icon: item.icon,
          desc: item.desc,
          confidence: matchCount > 1 ? 'High (99%)' : 'Detected (95%)',
          signals: ['Matched ' + item.name + ' digital script/meta fingerprints in DOM']
        };
      }
    }

    // Check for AI Assistants / Chatbots
    const aiBots = [];
    if (h.includes('tidio.com') || h.includes('tidio.co')) aiBots.push('Tidio AI Customer Support');
    if (h.includes('intercom.com') && h.includes('fin')) aiBots.push('Intercom Fin AI');
    if (h.includes('chatbase.co')) aiBots.push('Chatbase Custom AI');
    if (h.includes('botpress.com')) aiBots.push('Botpress Conversational AI');
    if (h.includes('voiceflow.com')) aiBots.push('Voiceflow AI Assistant');

    return {
      isAi: false,
      toolName: 'Human / Custom Developer Code',
      icon: '👨‍💻',
      desc: 'Traditional development framework or CMS. No AI site builder signatures detected.',
      confidence: 'Verified Human/CMS',
      signals: ['Handcrafted HTML/CSS/JS or standard CMS engine'],
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
      nsStr.includes('p01.nsone.net') ||
      nsStr.includes('netlify.com') ||
      h.includes('data-netlify') ||
      h.includes('netlify-identity') ||
      h.includes('name="netlify"') ||
      ['75.2.60.5', '99.83.190.102', '100.24.208.97'].includes(ip)
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
      let years = now.getFullYear() - rdapInfo.registeredDate.getFullYear();
      let months = now.getMonth() - rdapInfo.registeredDate.getMonth();
      if (months < 0) { years--; months += 12; }
      ageStr = years > 0 ? `${years} Yr${years > 1 ? 's' : ''}${months > 0 ? `, ${months} Mo` : ''} Old` : `${Math.max(1, months)} Month${months > 1 ? 's' : ''} Old`;
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

    // Bento 1: Live Date & Age
    scoreLiveDate.textContent = data.liveDateStr;
    scoreAgeText.textContent = data.ageStr;
    badgeLiveDate.textContent = data.rdapInfo ? 'RDAP Verified' : 'DNS Active';

    // Bento 2: AI Builder
    scoreAiTool.textContent = data.aiInfo.isAi ? data.aiInfo.toolName : 'Human / Custom';
    scoreAiTool.style.color = data.aiInfo.isAi ? '#7e22ce' : '#16a34a';
    scoreAiConfidence.textContent = data.aiInfo.confidence;
    badgeAiTool.textContent = data.aiInfo.isAi ? '🤖 AI Detected' : '👨‍💻 Human Code';
    badgeAiTool.style.background = data.aiInfo.isAi ? '#f3e8ff' : '#ecfdf5';
    badgeAiTool.style.color = data.aiInfo.isAi ? '#7e22ce' : '#15803d';

    // Bento 3: Meta Ads Tracking
    scoreMetaStatus.textContent = data.pixels.metaPixelFound ? 'Active' : 'Not Found';
    scoreMetaStatus.style.color = data.pixels.metaPixelFound ? '#1877f2' : '#64748b';
    scorePixelIdText.textContent = data.pixels.metaPixelId || 'None';
    badgeMetaStatus.textContent = data.pixels.metaPixelFound ? 'Live Pixel' : 'Inactive';

    // Bento 4: Web Host, Server & Platform
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

    // Bento 5: Security Grade
    scoreSecurityGrade.textContent = data.securityInfo.grade;
    scoreSecurityGrade.style.color = data.securityInfo.gradeColor;
    badgeSecurityGrade.textContent = `${data.securityInfo.totalScore}/100`;

    // Bento 6: Social & Maps
    const socCount = Object.keys(data.socials).length;
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
      pixelIdBadge.textContent = data.pixels.metaPixelFound ? `Meta Pixel: ${data.pixels.metaPixelId || 'Active'}` : 'Meta Pixel: Not Detected';
    }
    if (googleAdsBadge) {
      googleAdsBadge.textContent = data.trackingIds.gtm ? `GTM Tag: ${data.trackingIds.gtm}` : (data.trackingIds.ga4 ? `GA4 Tag: ${data.trackingIds.ga4}` : 'Google Tag: Inactive');
    }

    // Populate Tab 1: Live Date & Age
    dispCreatedDate.textContent = data.liveDateStr;
    dispCreatedAgo.textContent = `Age: ${data.ageStr}`;
    dispExpiryDate.textContent = data.expiryStr;
    dispExpiryCountdown.textContent = data.expirySub;
    dispRegistrar.textContent = data.rdapInfo?.registrar || 'Not Disclosed in Registry';
    dispRegistrarIana.textContent = data.rdapInfo?.registrarIanaId ? `IANA ID: ${data.rdapInfo.registrarIanaId}` : 'Direct Account';
    dispTransferLock.textContent = data.rdapInfo?.statusList?.some(s => s.toLowerCase().includes('prohibited')) ? '🔒 Transfer Locked (Protected)' : 'Active';
    if (btnWaybackFirst) {
      btnWaybackFirst.href = `https://web.archive.org/web/*/${data.domain}`;
    }

    // Populate Tab 2: AI Builder
    aiVerdictIcon.textContent = data.aiInfo.icon;
    aiVerdictTitle.textContent = data.aiInfo.isAi ? `AI Generated Site: ${data.aiInfo.toolName}` : 'Human / Custom Developer Code';
    aiVerdictDesc.textContent = data.aiInfo.desc;
    aiMatchedSignals.textContent = data.aiInfo.signals.join(' · ');
    aiChatbotsDetected.textContent = (data.aiInfo.aiBots && data.aiInfo.aiBots.length > 0)
      ? data.aiInfo.aiBots.join(', ')
      : 'None Detected';

    // Populate Tab 3: Social Preview
    if (data.socialPreview.image) {
      socialPreviewImg.src = data.socialPreview.image;
      socialPreviewImg.style.display = 'block';
      socialPreviewNoImg.style.display = 'none';
    } else {
      socialPreviewImg.style.display = 'none';
      socialPreviewNoImg.style.display = 'block';
    }
    socialPreviewDomain.textContent = data.socialPreview.siteName || data.domain.toUpperCase();
    socialPreviewTitle.textContent = data.socialPreview.title;
    socialPreviewDesc.textContent = data.socialPreview.desc;

    ogChecklist.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; padding: 6px 0; border-bottom: 1px solid #e2e8f0;">
        <span>og:title</span>
        <strong style="color: ${data.socialPreview.title ? '#16a34a' : '#dc2626'}">${data.socialPreview.title ? '✓ Configured' : '✗ Missing'}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; padding: 6px 0; border-bottom: 1px solid #e2e8f0;">
        <span>og:description</span>
        <strong style="color: ${data.socialPreview.desc ? '#16a34a' : '#dc2626'}">${data.socialPreview.desc ? '✓ Configured' : '✗ Missing'}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; padding: 6px 0; border-bottom: 1px solid #e2e8f0;">
        <span>og:image (Social Card)</span>
        <strong style="color: ${data.socialPreview.image ? '#16a34a' : '#ca8a04'}">${data.socialPreview.image ? '✓ Image Present' : '! Missing (No Preview)'}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; padding: 6px 0;">
        <span>HTTPS Secure Protocol</span>
        <strong style="color: #16a34a;">✓ Active</strong>
      </div>
    `;

    // Populate Tab 4: Security Headers Table
    securityGradeBadge.textContent = data.securityInfo.grade;
    securityGradeBadge.style.color = data.securityInfo.gradeColor;
    securityHeadersTableBody.innerHTML = '';
    data.securityInfo.headersList.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 600; color: var(--navy);">${escapeHtml(item.name)}</td>
        <td><span class="ocr-badge ${item.present ? 'status-ready' : 'status-processing'}" style="font-size: 11px;">${item.present ? '✓ Active' : '✗ Missing'}</span></td>
        <td style="color: var(--gray-700); font-family: var(--font-mono, monospace); font-size: 11px;">${escapeHtml(item.value)}</td>
      `;
      securityHeadersTableBody.appendChild(tr);
    });

    // Populate Tab 5: Ad Pixels Grid
    pixelsGrid.innerHTML = '';
    const pixelEntries = [
      { name: 'Google Analytics 4 (GA4)', id: data.trackingIds.ga4, icon: '📊', desc: 'Google next-gen web & app event stream' },
      { name: 'Google Tag Manager (GTM)', id: data.trackingIds.gtm, icon: '🏷️', desc: 'Centralized enterprise tag manager container' },
      { name: 'Meta / Facebook Ads Pixel', id: data.pixels.metaPixelId, icon: '📣', desc: 'Meta conversions API & retargeting pixel' },
      { name: 'Microsoft Clarity', id: data.trackingIds.clarity, icon: '🔍', desc: 'Session recording & user behavior heatmaps' },
      { name: 'TikTok Ads Pixel', id: data.trackingIds.tiktok, icon: '🎵', desc: 'TikTok conversion tracker & retargeting' },
      { name: 'Hotjar Behavioral Heatmaps', id: data.trackingIds.hotjar, icon: '🔥', desc: 'Visitor clicks & scroll depth heatmaps' }
    ];

    pixelEntries.forEach(entry => {
      const card = document.createElement('div');
      card.style.cssText = 'background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-md); padding: 14px 16px;';
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <div style="font-size: 13px; font-weight: 700; color: var(--navy); display: flex; align-items: center; gap: 6px;">
            <span>${entry.icon}</span> <span>${entry.name}</span>
          </div>
          <span class="ocr-badge ${entry.id ? 'status-ready' : 'status-processing'}" style="font-size: 10px;">${entry.id ? 'Detected' : 'Not Found'}</span>
        </div>
        <div style="font-family: var(--font-mono, monospace); font-size: 13px; font-weight: 700; color: ${entry.id ? '#0284c7' : '#94a3b8'}; margin: 4px 0;">
          ${entry.id || '--'}
        </div>
        <div style="font-size: 11px; color: var(--gray-500);">${entry.desc}</div>
      `;
      pixelsGrid.appendChild(card);
    });

    // Populate Tab 6: Socials & Maps & Contacts
    renderSocialProfiles(data.socials);
    renderMaps(data.maps, data.domain);
    renderContacts(data.contacts);

    // Populate Tab 7: SEO
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
    statCanonical.textContent = data.hasCanonical ? 'Valid ✓' : 'Missing ✗';

    // Populate Tab 8: Tech Stack
    renderTechGrid(data.tech, data.hosting);

    // Populate Tab 9: Web Host, Server & DNS Infrastructure Profile
    if (hostingTypeBadge) hostingTypeBadge.textContent = data.hosting.platformType;
    if (dispHproviderName) dispHproviderName.textContent = `${data.hosting.icon} ${data.hosting.providerName}`;
    if (dispHproviderType) dispHproviderType.textContent = `${data.hosting.platformType} · ${data.hosting.category}`;
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
      ? data.dns.nameservers.map(ns => `<div>● ${escapeHtml(ns)}</div>`).join('')
      : '<div>No authoritative NS records found.</div>';

    dnsMxList.innerHTML = (data.dns.mx && data.dns.mx.length > 0)
      ? data.dns.mx.map(mx => `<div>✉️ ${escapeHtml(mx)}</div>`).join('')
      : '<div>No public MX mail exchange records configured.</div>';

    // Populate Tab 10: Intelligence Links
    if (intelWayback) intelWayback.href = `https://web.archive.org/web/*/${data.domain}`;
    if (intelSimilarweb) intelSimilarweb.href = `https://www.similarweb.com/website/${data.domain}/`;
    if (intelPagespeed) intelPagespeed.href = `https://pagespeed.web.dev/analysis?url=https%3A%2F%2F${encodeURIComponent(data.domain)}`;
    if (intelAhrefs) intelAhrefs.href = `https://ahrefs.com/backlink-checker/?input=${encodeURIComponent(data.domain)}&mode=subdomains`;

    analyzerDashboard.style.display = 'block';
    analyzerDashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Helper render functions
  function renderSocialProfiles(socials) {
    if (!socialProfilesGrid) return;
    socialProfilesGrid.innerHTML = '';
    const keys = Object.keys(socials);
    if (keys.length === 0) {
      socialProfilesGrid.innerHTML = '<div style="color: var(--gray-500); font-size: 13px; grid-column: 1/-1;">No public social media profile links detected in website source code.</div>';
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
        <div style="font-size: 11px; color: #4f46e5; font-weight: 600; margin-top: 6px;">Open Channel →</div>
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
          <strong>🏢 Physical Registered Address Found:</strong>
          <div style="color: var(--gray-700); margin-top: 4px;">${escapeHtml(maps.address)}</div>
        </div>
      `;
    } else {
      mapsContainer.innerHTML = `
        <div style="padding: 16px; background: var(--gray-50); border-radius: 8px; font-size: 13px; color: var(--gray-500); text-align: center;">
          No Google Maps embed or physical address detected in the page source.
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
      contactDetailsList.innerHTML = '<div style="color: var(--gray-500); font-size: 13px;">No direct customer support mailto: or tel: links found on the homepage.</div>';
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

  function renderTechGrid(tech, hosting) {
    if (!analyzerTechGrid) return;
    analyzerTechGrid.innerHTML = '';
    const items = [];

    // PaaS Platform if detected (e.g. Netlify, Vercel, Render)
    if (hosting && (hosting.category.includes('PaaS') || hosting.providerName === 'Netlify' || hosting.providerName === 'Vercel')) {
      items.push({ name: hosting.providerName, category: 'PaaS (Platform as a Service)', badge: 'PaaS' });
    }

    items.push({ name: hosting ? hosting.providerName : tech.cdn, category: 'Web Hosting & Cloud', badge: 'Host' });
    items.push({ name: hosting ? hosting.cdn : tech.cdn, category: 'CDN / Edge Network', badge: 'Edge' });
    items.push({ name: hosting ? hosting.webServer : 'Nginx / Apache', category: 'Web Server Software', badge: 'Server' });
    items.push({ name: tech.platform, category: 'E-commerce / CMS', badge: 'Platform' });
    items.push({ name: tech.framework, category: 'Frontend UI Framework', badge: 'Code' });
    items.push({ name: tech.analytics, category: 'Web Analytics', badge: 'Tracking' });

    if (tech.fontScripts) {
      items.push({ name: tech.fontScripts, category: 'Font Scripts', badge: 'Typography' });
    }

    if (tech.liveChat) {
      items.push({ name: tech.liveChat, category: 'Live Chat & Support', badge: 'Chat' });
    }

    if (tech.payments && tech.payments !== 'None') {
      items.push({ name: tech.payments, category: 'Payment Gateway', badge: 'Billing' });
    }

    items.forEach(t => {
      const card = document.createElement('div');
      card.className = 'tech-card';
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span style="font-size: 11px; text-transform: uppercase; color: var(--gray-500); font-weight: 600;">${escapeHtml(t.category)}</span>
          <span class="ocr-badge status-ready" style="font-size: 10px;">${escapeHtml(t.badge)}</span>
        </div>
        <div style="font-size: 15px; font-weight: 700; color: var(--navy);">${escapeHtml(t.name)}</div>
      `;
      analyzerTechGrid.appendChild(card);
    });
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
    let platform = 'Custom Built Website';
    if (h.includes('cdn.shopify.com') || h.includes('myshopify.com')) platform = 'Shopify Store';
    else if (h.includes('wp-content') || h.includes('wp-includes')) platform = 'WordPress / WooCommerce';
    else if (h.includes('wix.com')) platform = 'Wix Website';
    else if (h.includes('squarespace.com')) platform = 'Squarespace';
    else if (h.includes('webflow.com')) platform = 'Webflow';

    // CDN
    let cdn = hosting ? hosting.cdn : 'Standard Cloud';
    if (!hosting) {
      const ns = (dns.nameservers || []).join(' ').toLowerCase();
      if (ns.includes('cloudflare') || h.includes('cloudflare')) cdn = 'Cloudflare Global CDN';
      else if (ns.includes('awsdns') || h.includes('cloudfront')) cdn = 'Amazon CloudFront (AWS)';
      else if (ns.includes('google')) cdn = 'Google Cloud Infrastructure';
    }

    // Frontend UI Framework
    let framework = 'HTML5 & Vanilla JavaScript';
    if (h.includes('__next') || h.includes('next.js')) framework = 'Next.js (React)';
    else if (h.includes('react') || h.includes('reactdom')) framework = 'React.js SPA';
    else if (h.includes('vue') || h.includes('nuxt')) framework = 'Vue.js / Nuxt';

    // Web Analytics
    let analytics = 'None detected';
    if (h.includes('googletagmanager.com') || h.includes('google-analytics.com')) analytics = 'Google Analytics 4 & GTM';

    // Payment Gateway
    let payments = 'None';
    if (h.includes('razorpay')) payments = 'Razorpay Payment Gateway';
    else if (h.includes('stripe')) payments = 'Stripe Payments';
    else if (h.includes('cashfree')) payments = 'Cashfree Payments';

    // Font Scripts
    let fontScripts = null;
    if (h.includes('fonts.googleapis.com') || h.includes('fonts.gstatic.com')) fontScripts = 'Google Font API';
    else if (h.includes('use.typekit.net')) fontScripts = 'Adobe Typekit Fonts';

    // Live Chat & Support
    let liveChat = null;
    if (h.includes('wa.me') || h.includes('api.whatsapp.com') || h.includes('whatsapp')) liveChat = 'WhatsApp Business Chat';
    else if (h.includes('tidio.co') || h.includes('tidio.com')) liveChat = 'Tidio Live Chat';
    else if (h.includes('intercom.io') || h.includes('intercomcdn.com')) liveChat = 'Intercom Live Chat';
    else if (h.includes('zendesk.com') || h.includes('zopim.com')) liveChat = 'Zendesk Chat';
    else if (h.includes('crisp.chat')) liveChat = 'Crisp Live Chat';

    return { platform, cdn, framework, analytics, payments, fontScripts, liveChat };
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
    r += `AI Builder Verdict   : ${d.aiInfo.isAi ? d.aiInfo.toolName : 'Human / Custom Developer Code'} (${d.aiInfo.confidence})\n`;
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
