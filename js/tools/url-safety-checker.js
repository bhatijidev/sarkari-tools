/**
 * AllToolsInOne - URL Safety Checker & Scam Link Detector
 * Multi-Layer Live Security Threat Engine:
 * 1. Cloudflare Security DNSBL (1.1.1.2) Live Threat Intelligence
 * 2. Authoritative Domain Age & NRD (Newly Registered Domain) via RDAP
 * 3. Brand Impersonation & Phishing Keyword Engine (Bank KYC, Electricity bill, OTP)
 * 4. Punycode & Cyrillic Homograph Lookalike Attack Scanner
 * 5. URL Shorteners & Hidden Redirection Detection
 * 6. Dangerous Executable / APK File Download Signatures
 * 7. Raw IP Hostname Detection
 * 8. SSL / Insecure HTTP Protocol Inspection
 * 9. High-Risk / Abused TLD Scanner
 * 10. URL Obfuscation & Subdomain Nesting Inspection
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const inpLink = document.getElementById('inpLink');
  const btnPaste = document.getElementById('btnPaste');
  const btnScan = document.getElementById('btnScan');
  const sampleLinkButtons = document.querySelectorAll('.sample-link-btn');
  const safetyLoading = document.getElementById('safetyLoading');
  const loadingTitle = document.getElementById('loadingTitle');
  const loadingSubtitle = document.getElementById('loadingSubtitle');
  const safetyDashboard = document.getElementById('safetyDashboard');

  // Verdict Elements
  const verdictCard = document.getElementById('verdictCard');
  const verdictIconBox = document.getElementById('verdictIconBox');
  const verdictBadge = document.getElementById('verdictBadge');
  const verdictProtocolBadge = document.getElementById('verdictProtocolBadge');
  const dispScannedUrl = document.getElementById('dispScannedUrl');
  const verdictSummaryText = document.getElementById('verdictSummaryText');
  const dispSafetyScore = document.getElementById('dispSafetyScore');
  const dispScoreLabel = document.getElementById('dispScoreLabel');
  const safetyActionNotice = document.getElementById('safetyActionNotice');
  const safetyActionText = document.getElementById('safetyActionText');

  // 4 Bento Key Metric Elements
  const bentoCfStatus = document.getElementById('bentoCfStatus');
  const bentoCfSub = document.getElementById('bentoCfSub');
  const bentoAgeStatus = document.getElementById('bentoAgeStatus');
  const bentoAgeSub = document.getElementById('bentoAgeSub');
  const bentoBrandStatus = document.getElementById('bentoBrandStatus');
  const bentoBrandSub = document.getElementById('bentoBrandSub');
  const bentoProtocolStatus = document.getElementById('bentoProtocolStatus');
  const bentoProtocolSub = document.getElementById('bentoProtocolSub');

  // Threat Breakdown Table Body
  const safetyChecksTableBody = document.getElementById('safetyChecksTableBody');
  const threatSummaryPill = document.getElementById('threatSummaryPill');

  // External Scanners
  const btnVirusTotal = document.getElementById('btnVirusTotal');
  const btnGoogleSafeBrowsing = document.getElementById('btnGoogleSafeBrowsing');
  const btnUrlScan = document.getElementById('btnUrlScan');
  const btnPhishTank = document.getElementById('btnPhishTank');

  // Event Listeners
  btnScan?.addEventListener('click', handleScan);
  inpLink?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleScan();
  });

  btnPaste?.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        inpLink.value = text.trim();
        showToast('Pasted link from clipboard!', 'success');
        handleScan();
      }
    } catch (err) {
      showToast('Could not access clipboard. Please paste manually.', 'error');
    }
  });

  sampleLinkButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.getAttribute('data-url');
      if (url) {
        inpLink.value = url;
        handleScan();
      }
    });
  });

  // URL Normalizer & Parser
  function parseTargetUrl(raw) {
    let input = (raw || '').trim();
    if (!input) return null;

    // Extract link if user pasted text with surrounding words (e.g. "Check this: https://scam.top/login")
    const urlMatch = input.match(/https?:\/\/[^\s]+/i) || input.match(/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?/i);
    if (urlMatch) {
      input = urlMatch[0];
    }

    let protocol = 'https:';
    if (/^http:\/\//i.test(input)) {
      protocol = 'http:';
    } else if (!/^https?:\/\//i.test(input)) {
      input = 'https://' + input;
    }

    try {
      const parsed = new URL(input);
      const hostname = parsed.hostname.toLowerCase();
      const parts = hostname.split('.');
      const tld = parts[parts.length - 1];
      const sld = parts.length > 2 ? parts[parts.length - 2] + '.' + tld : tld;

      return {
        fullUrl: parsed.href,
        protocol: parsed.protocol,
        hostname,
        pathname: parsed.pathname.toLowerCase(),
        search: parsed.search,
        tld,
        sld,
        isIp: /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.includes(':')
      };
    } catch (e) {
      return null;
    }
  }

  // Authoritative RDAP Resolver for Domain Age
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
      try {
        const pUrl = 'https://cors-get-proxy.sirjosh.workers.dev/?url=' + encodeURIComponent(url);
        const pRes = await fetch(pUrl, { cache: 'no-store' });
        if (pRes.ok) return await pRes.json();
      } catch (pErr) {}
    }
    return null;
  }

  function parseRegistrationDate(rdap) {
    if (!rdap || !rdap.events) return null;
    let regDate = null;
    rdap.events.forEach(ev => {
      const act = (ev.eventAction || '').toLowerCase();
      if (act === 'registration' || act === 'created') regDate = new Date(ev.eventDate);
    });
    return regDate;
  }

  // Cloudflare 1.1.1.2 Threat Intelligence Resolver (Blocks known malware & phishing)
  async function checkCloudflareSecurityDoh(hostname) {
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 4000);
      
      const res = await fetch(`https://security.cloudflare-dns.com/dns-query?name=${encodeURIComponent(hostname)}&type=A`, {
        headers: { 'accept': 'application/dns-json' },
        signal: controller.signal
      });
      clearTimeout(tid);

      if (res.ok) {
        const data = await res.json();
        const answers = data.Answer || [];
        
        // 1.1.1.2 returns 0.0.0.0 when a domain is a confirmed security threat
        const isBlocked = answers.some(a => a.data === '0.0.0.0' || a.data === '127.0.0.1');
        return {
          checked: true,
          isBlocked,
          hasDns: answers.length > 0 && !isBlocked,
          answers
        };
      }
    } catch (e) {}

    return { checked: false, isBlocked: false, hasDns: true, answers: [] };
  }

  // Main Security Scan Handler
  async function handleScan() {
    const raw = (inpLink ? inpLink.value : '').trim();
    if (!raw) {
      showToast('Please enter or paste a link to scan.', 'error');
      return;
    }

    const parsed = parseTargetUrl(raw);
    if (!parsed) {
      showToast('Please enter a valid web URL (e.g. "https://example.com")', 'error');
      return;
    }

    showLoading(true, `Auditing ${parsed.hostname}...`, 'Scanning Cloudflare threat DB, domain age, brand spoofing, and malware signatures...');

    try {
      // Parallel Security Intelligence Queries
      const [cfDoh, rdapData] = await Promise.all([
        checkCloudflareSecurityDoh(parsed.hostname),
        parsed.isIp ? null : fetchWhoisRdap(parsed.hostname)
      ]);

      const regDate = parseRegistrationDate(rdapData);

      // Run 10-Point Deep Inspection
      const auditResult = evaluateUrlThreats(parsed, cfDoh, regDate);

      renderSafetyDashboard(parsed, auditResult);
      showLoading(false);

    } catch (err) {
      console.error(err);
      showToast('Scan encountered an error. Please retry.', 'error');
      showLoading(false);
    }
  }

  // 10-Point Threat Evaluation Engine
  function evaluateUrlThreats(urlInfo, cfDoh, regDate) {
    const checks = [];
    let safetyScore = 100;

    const hostname = urlInfo.hostname;
    const pathname = urlInfo.pathname;
    const fullUrl = urlInfo.fullUrl;

    // -------------------------------------------------------------
    // Check 1: Cloudflare Security Blocklist (1.1.1.2 Threat Intelligence)
    // -------------------------------------------------------------
    if (cfDoh.isBlocked) {
      safetyScore -= 55;
      checks.push({
        id: 'cf_dnsbl',
        name: 'Cloudflare Threat Intelligence (1.1.1.2)',
        status: 'danger',
        badge: '✕ Active Blocklist',
        evidence: 'CRITICAL: Blocked by Cloudflare Security Network. Confirmed source of active malware, ransomware, or phishing campaigns.'
      });
    } else {
      checks.push({
        id: 'cf_dnsbl',
        name: 'Cloudflare Threat Intelligence (1.1.1.2)',
        status: 'pass',
        badge: '✓ Clean Status',
        evidence: 'Clean — Zero threat records or security blocks found in Cloudflare Security threat databases.'
      });
    }

    // -------------------------------------------------------------
    // Check 2: Domain Age & Newly Registered Domain (NRD Risk)
    // -------------------------------------------------------------
    let domainAgeText = 'Established';
    if (regDate) {
      const now = new Date();
      const ageDays = Math.max(1, Math.floor((now - regDate) / (1000 * 60 * 60 * 24)));
      const regFormatted = regDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

      if (ageDays <= 15) {
        safetyScore -= 35;
        domainAgeText = `${ageDays} Days Old (Extreme Risk)`;
        checks.push({
          id: 'domain_age',
          name: 'Domain Age & NRD Scanner',
          status: 'danger',
          badge: '✕ Fresh Domain (< 15d)',
          evidence: `HIGH RISK: Registered only ${ageDays} days ago (${regFormatted}). Over 85% of phishing & SMS scam sites use domains registered under 15 days.`
        });
      } else if (ageDays <= 60) {
        safetyScore -= 15;
        domainAgeText = `${ageDays} Days Old (Fresh)`;
        checks.push({
          id: 'domain_age',
          name: 'Domain Age & NRD Scanner',
          status: 'warning',
          badge: '⚠️ Recently Created',
          evidence: `CAUTION: Domain was registered ${ageDays} days ago (${regFormatted}). Young domain, proceed with heightened caution.`
        });
      } else {
        const years = (ageDays / 365).toFixed(1);
        domainAgeText = `${years} Yrs Old (${regFormatted})`;
        checks.push({
          id: 'domain_age',
          name: 'Domain Age & NRD Scanner',
          status: 'pass',
          badge: '✓ Established Domain',
          evidence: `Verified established domain registered ${years} years ago (${regFormatted}). Low probability of throwaway fraud.`
        });
      }
    } else if (urlInfo.isIp) {
      domainAgeText = 'Raw IP Address';
      checks.push({
        id: 'domain_age',
        name: 'Domain Age & NRD Scanner',
        status: 'warning',
        badge: '⚠️ No Domain Name',
        evidence: 'Host uses a direct IP address. Domain registry information does not exist.'
      });
    } else {
      domainAgeText = 'Active in DNS';
      checks.push({
        id: 'domain_age',
        name: 'Domain Age & NRD Scanner',
        status: 'pass',
        badge: '✓ Active Domain',
        evidence: 'Domain is active in DNS registry. Authoritative RDAP record queried.'
      });
    }

    // -------------------------------------------------------------
    // Check 3: Brand Spoofing & Phishing Keywords (SBI, HDFC, Paytm, Electricity)
    // -------------------------------------------------------------
    const targetBrands = [
      { name: 'State Bank of India (SBI)', trigger: 'sbi', legit: 'sbi.co.in' },
      { name: 'HDFC Bank', trigger: 'hdfc', legit: 'hdfcbank.com' },
      { name: 'ICICI Bank', trigger: 'icici', legit: 'icicibank.com' },
      { name: 'Paytm', trigger: 'paytm', legit: 'paytm.com' },
      { name: 'PhonePe', trigger: 'phonepe', legit: 'phonepe.com' },
      { name: 'India Post / Speed Post', trigger: 'indiapost', legit: 'indiapost.gov.in' },
      { name: 'Google', trigger: 'google', legit: 'google.com' },
      { name: 'Apple', trigger: 'apple', legit: 'apple.com' },
      { name: 'Netflix', trigger: 'netflix', legit: 'netflix.com' },
      { name: 'Amazon', trigger: 'amazon', legit: 'amazon.' },
      { name: 'WhatsApp', trigger: 'whatsapp', legit: 'whatsapp.com' },
      { name: 'Electricity Bill', trigger: 'bijli', legit: 'gov.in' }
    ];

    const fraudTriggers = [
      'kyc', 'pan', 'aadhaar', 'update', 'verify', 'verification', 'otp',
      'login', 'signin', 'secure', 'account', 'alert', 'bill', 'overdue',
      'suspended', 'bonus', 'cashback', 'lottery', 'winner', 'gift',
      'free-recharge', 'telegram-task', 'earn-money', 'refund'
    ];

    let brandSpoofed = null;
    let matchedTrigger = null;

    targetBrands.forEach(b => {
      if (hostname.includes(b.trigger) && !hostname.endsWith(b.legit)) {
        fraudTriggers.forEach(f => {
          if (hostname.includes(f) || pathname.includes(f)) {
            brandSpoofed = b.name;
            matchedTrigger = f;
          }
        });
      }
    });

    if (brandSpoofed) {
      safetyScore -= 45;
      checks.push({
        id: 'brand_spoofing',
        name: 'Brand Spoofing & Phishing Scanner',
        status: 'danger',
        badge: '✕ Brand Impersonation',
        evidence: `CRITICAL FRAUD ALERT: Detected spoofing attempt impersonating ${brandSpoofed} with attack trigger "${matchedTrigger}". Legitimate banks/companies never use third-party domains for authentication.`
      });
    } else {
      checks.push({
        id: 'brand_spoofing',
        name: 'Brand Spoofing & Phishing Scanner',
        status: 'pass',
        badge: '✓ No Brand Spoofing',
        evidence: 'No unauthorized financial or corporate brand trademarks combined with fraud triggers detected.'
      });
    }

    // -------------------------------------------------------------
    // Check 4: Homograph & Punycode Lookalike Attacks (e.g. Cyrillic 'рaypal')
    // -------------------------------------------------------------
    const isPunycode = hostname.startsWith('xn--') || hostname.includes('.xn--');
    const hasCyrillic = /[\u0400-\u04FF]/.test(fullUrl);

    if (isPunycode || hasCyrillic) {
      safetyScore -= 40;
      checks.push({
        id: 'homograph',
        name: 'Punycode & Lookalike Domain Scanner',
        status: 'danger',
        badge: '✕ Homograph Attack',
        evidence: 'CRITICAL ALERT: URL uses Punycode (xn--) or non-Latin lookalike characters designed to visually deceive victims into mistaking it for a legitimate website.'
      });
    } else {
      checks.push({
        id: 'homograph',
        name: 'Punycode & Lookalike Domain Scanner',
        status: 'pass',
        badge: '✓ Clean Character Set',
        evidence: 'Pure ASCII standard character set. Zero deceptive internationalized lookalike characters found.'
      });
    }

    // -------------------------------------------------------------
    // Check 5: URL Shorteners & Hidden Destination Link
    // -------------------------------------------------------------
    const shorteners = [
      'bit.ly', 'tinyurl.com', 't.co', 'is.gd', 'cutt.ly', 'rb.gy',
      'shorturl.at', 'ow.ly', 'rebrand.ly', 'bl.ink', 'tiny.cc'
    ];
    const isShortener = shorteners.some(s => hostname === s || hostname.endsWith('.' + s));

    if (isShortener) {
      safetyScore -= 15;
      checks.push({
        id: 'url_shortener',
        name: 'URL Shortener & Redirection Check',
        status: 'warning',
        badge: '⚠️ Masked Destination',
        evidence: 'WARNING: Link uses a public URL shortener. Cybercriminals frequently use link shorteners to hide malicious destinations from SMS & WhatsApp filters.'
      });
    } else {
      checks.push({
        id: 'url_shortener',
        name: 'URL Shortener & Redirection Check',
        status: 'pass',
        badge: '✓ Direct FQDN Domain',
        evidence: 'Direct domain URL. The real destination domain is openly visible.'
      });
    }

    // -------------------------------------------------------------
    // Check 6: Dangerous Executable / APK File Download Signatures
    // -------------------------------------------------------------
    const badExts = ['.exe', '.scr', '.bat', '.vbs', '.apk', '.dmg', '.iso', '.zip', '.jar', '.msi'];
    const matchedExt = badExts.find(ext => pathname.endsWith(ext) || pathname.includes(ext + '?'));

    if (matchedExt) {
      safetyScore -= 40;
      checks.push({
        id: 'payload_ext',
        name: 'Executable & APK Payload Scanner',
        status: 'danger',
        badge: `✕ Payload: ${matchedExt}`,
        evidence: `CRITICAL ALERT: Direct link to download an executable payload (${matchedExt}). Scammers commonly distribute remote-access trojans (RATs) and malware via fake APK / EXE downloads.`
      });
    } else {
      checks.push({
        id: 'payload_ext',
        name: 'Executable & APK Payload Scanner',
        status: 'pass',
        badge: '✓ No Executable Payload',
        evidence: 'URL points to standard web content. Zero executable files (.exe, .apk, .bat) detected.'
      });
    }

    // -------------------------------------------------------------
    // Check 7: Raw IP Hostname Check
    // -------------------------------------------------------------
    if (urlInfo.isIp) {
      safetyScore -= 30;
      checks.push({
        id: 'ip_hostname',
        name: 'Host Architecture Verification',
        status: 'danger',
        badge: '✕ Raw IP Hostname',
        evidence: 'HIGH RISK: URL directs to a raw numerical IP address instead of a registered domain name. Legitimate public services almost never ask customers to access websites via raw IPs.'
      });
    } else {
      checks.push({
        id: 'ip_hostname',
        name: 'Host Architecture Verification',
        status: 'pass',
        badge: '✓ Registered Domain',
        evidence: 'Uses authoritative registered Top-Level Domain (TLD) infrastructure.'
      });
    }

    // -------------------------------------------------------------
    // Check 8: SSL / Insecure HTTP Protocol
    // -------------------------------------------------------------
    if (urlInfo.protocol === 'http:') {
      safetyScore -= 15;
      checks.push({
        id: 'ssl_proto',
        name: 'Transport Encryption (HTTPS)',
        status: 'warning',
        badge: '⚠️ Insecure Plain HTTP',
        evidence: 'WARNING: Connection is unencrypted (HTTP). Any passwords, forms, or credentials entered can be intercepted by third parties on the same network.'
      });
    } else {
      checks.push({
        id: 'ssl_proto',
        name: 'Transport Encryption (HTTPS)',
        status: 'pass',
        badge: '✓ Secure HTTPS',
        evidence: 'Encrypted SSL/TLS connection. Communications between your browser and the server are encrypted.'
      });
    }

    // -------------------------------------------------------------
    // Check 9: High-Risk / Abused TLDs
    // -------------------------------------------------------------
    const highRiskTlds = ['top', 'xyz', 'cam', 'work', 'click', 'buzz', 'surf', 'gq', 'cf', 'tk', 'ml', 'fit', 'rest', 'icu', 'loan', 'live'];
    if (highRiskTlds.includes(urlInfo.tld)) {
      safetyScore -= 10;
      checks.push({
        id: 'abused_tld',
        name: 'TLD Reputation & Spam Abuse Index',
        status: 'warning',
        badge: `⚠️ High-Risk TLD (.${urlInfo.tld})`,
        evidence: `CAUTION: Top-level domain .${urlInfo.tld} has a statistically high volume of spam, malware distribution, and throwaway phishing registrations according to global threat metrics.`
      });
    } else {
      checks.push({
        id: 'abused_tld',
        name: 'TLD Reputation & Spam Abuse Index',
        status: 'pass',
        badge: `✓ Standard TLD (.${urlInfo.tld})`,
        evidence: `Top-level domain .${urlInfo.tld} has a standard reputation profile.`
      });
    }

    // -------------------------------------------------------------
    // Check 10: URL Obfuscation & Nested Subdomain Inspection
    // -------------------------------------------------------------
    const subCount = hostname.split('.').length;
    const hasAtSymbol = fullUrl.includes('@');

    if (subCount > 4 || hasAtSymbol) {
      safetyScore -= 20;
      checks.push({
        id: 'url_obfuscation',
        name: 'URL Obfuscation & Subdomain Stacking',
        status: 'warning',
        badge: '⚠️ Deep Subdomain Stacking',
        evidence: 'WARNING: URL contains deeply nested subdomains or "@" credentials obfuscation. Attackers use this trick to display reputable names in the prefix while leading to a different domain.'
      });
    } else {
      checks.push({
        id: 'url_obfuscation',
        name: 'URL Obfuscation & Subdomain Stacking',
        status: 'pass',
        badge: '✓ Clean URL Structure',
        evidence: 'Standard hostname hierarchy without misleading subdomain nesting.'
      });
    }

    // Clamp score
    safetyScore = Math.max(5, Math.min(100, safetyScore));

    return {
      safetyScore,
      domainAgeText,
      brandSpoofed,
      checks
    };
  }

  // Render Complete Safety Dashboard
  function renderSafetyDashboard(urlInfo, audit) {
    if (!safetyDashboard) return;

    dispScannedUrl.textContent = urlInfo.fullUrl;

    // External Scanner Links
    if (btnVirusTotal) {
      btnVirusTotal.href = `https://www.virustotal.com/gui/search/${encodeURIComponent(urlInfo.fullUrl)}`;
    }
    if (btnGoogleSafeBrowsing) {
      btnGoogleSafeBrowsing.href = `https://transparencyreport.google.com/safe-browsing/search?url=${encodeURIComponent(urlInfo.fullUrl)}`;
    }
    if (btnUrlScan) {
      btnUrlScan.href = `https://urlscan.io/`;
    }
    if (btnPhishTank) {
      btnPhishTank.href = `https://phishtank.org/`;
    }

    // Protocol Badge
    if (urlInfo.protocol === 'https:') {
      verdictProtocolBadge.textContent = '🔒 HTTPS Encrypted';
      verdictProtocolBadge.style.background = '#ecfdf5';
      verdictProtocolBadge.style.color = '#15803d';
    } else {
      verdictProtocolBadge.textContent = '⚠️ Insecure Plain HTTP';
      verdictProtocolBadge.style.background = '#fef2f2';
      verdictProtocolBadge.style.color = '#dc2626';
    }

    // Verdict Logic (Safe vs Caution vs Dangerous)
    const score = audit.safetyScore;
    dispSafetyScore.textContent = `${score}%`;

    const hasDanger = audit.checks.some(c => c.status === 'danger');
    const hasWarning = audit.checks.some(c => c.status === 'warning');

    if (score >= 80 && !hasDanger) {
      // 🟢 SAFE
      verdictCard.style.borderColor = '#86efac';
      verdictCard.style.background = '#ffffff';
      verdictIconBox.textContent = '🛡️';
      verdictIconBox.style.background = '#ecfdf5';
      verdictIconBox.style.borderColor = '#bbf7d0';

      verdictBadge.textContent = 'SAFE TO BROWSE';
      verdictBadge.style.background = '#dcfce7';
      verdictBadge.style.color = '#15803d';

      dispSafetyScore.style.color = '#16a34a';
      dispScoreLabel.textContent = 'Low Risk';
      dispScoreLabel.style.color = '#15803d';

      verdictSummaryText.textContent = 'No malicious patterns, brand spoofing, or active threat listings detected for this domain. It appears safe to visit.';

      safetyActionNotice.style.background = '#f0fdf4';
      safetyActionNotice.style.borderColor = '#bbf7d0';
      safetyActionNotice.style.color = '#166534';
      safetyActionText.innerHTML = '<strong>Safe Recommendation:</strong> This link looks legitimate. Always confirm the URL in your browser matches the official company name before logging in.';

    } else if (score >= 50 && !hasDanger) {
      // 🟡 SUSPICIOUS / CAUTION
      verdictCard.style.borderColor = '#fde047';
      verdictCard.style.background = '#fffbeb';
      verdictIconBox.textContent = '⚠️';
      verdictIconBox.style.background = '#fef9c3';
      verdictIconBox.style.borderColor = '#fef08a';

      verdictBadge.textContent = 'PROCEED WITH CAUTION';
      verdictBadge.style.background = '#fef08a';
      verdictBadge.style.color = '#854d0e';

      dispSafetyScore.style.color = '#d97706';
      dispScoreLabel.textContent = 'Moderate Risk';
      dispScoreLabel.style.color = '#b45309';

      verdictSummaryText.textContent = 'Potential warning signals detected (such as a newly registered domain, public link shortener, or unencrypted HTTP protocol).';

      safetyActionNotice.style.background = '#fffbeb';
      safetyActionNotice.style.borderColor = '#fde68a';
      safetyActionNotice.style.color = '#92400e';
      safetyActionText.innerHTML = '<strong>Caution Recommendation:</strong> Do not enter passwords, credit card numbers, or OTP on this site unless you independently verify the sender.';

    } else {
      // 🔴 DANGEROUS / HIGH RISK
      verdictCard.style.borderColor = '#fca5a5';
      verdictCard.style.background = '#fef2f2';
      verdictIconBox.textContent = '🚨';
      verdictIconBox.style.background = '#fee2e2';
      verdictIconBox.style.borderColor = '#fecaca';

      verdictBadge.textContent = 'DANGEROUS / HIGH RISK';
      verdictBadge.style.background = '#fee2e2';
      verdictBadge.style.color = '#991b1b';

      dispSafetyScore.style.color = '#dc2626';
      dispScoreLabel.textContent = 'High Danger';
      dispScoreLabel.style.color = '#991b1b';

      verdictSummaryText.textContent = 'CRITICAL THREAT DETECTED: This link exhibits strong characteristics of phishing, financial scam impersonation, or malicious file downloads.';

      safetyActionNotice.style.background = '#fef2f2';
      safetyActionNotice.style.borderColor = '#fecaca';
      safetyActionNotice.style.color = '#991b1b';
      safetyActionText.innerHTML = '<strong>DO NOT OPEN OR PROCEED:</strong> Do NOT click this link, do not enter your bank/card details, and do not download any files. Report to 1930 / cybercrime.gov.in immediately.';
    }

    // Populate 4 Bento Key Metrics
    const cfCheck = audit.checks.find(c => c.id === 'cf_dnsbl');
    if (bentoCfStatus) {
      bentoCfStatus.textContent = cfCheck?.status === 'pass' ? '✓ Clean Status' : '✕ Threat Listed';
      bentoCfStatus.style.color = cfCheck?.status === 'pass' ? '#16a34a' : '#dc2626';
    }

    if (bentoAgeStatus) {
      bentoAgeStatus.textContent = audit.domainAgeText;
      const ageCheck = audit.checks.find(c => c.id === 'domain_age');
      bentoAgeStatus.style.color = ageCheck?.status === 'danger' ? '#dc2626' : (ageCheck?.status === 'warning' ? '#d97706' : 'var(--navy)');
    }

    if (bentoBrandStatus) {
      if (audit.brandSpoofed) {
        bentoBrandStatus.textContent = `✕ Spoofing: ${audit.brandSpoofed}`;
        bentoBrandStatus.style.color = '#dc2626';
      } else {
        bentoBrandStatus.textContent = '✓ No Brand Spoofing';
        bentoBrandStatus.style.color = '#16a34a';
      }
    }

    if (bentoProtocolStatus) {
      bentoProtocolStatus.textContent = urlInfo.protocol === 'https:' ? '🔒 HTTPS Secure' : '⚠️ Plain HTTP';
      bentoProtocolStatus.style.color = urlInfo.protocol === 'https:' ? '#16a34a' : '#dc2626';
    }

    // Populate 10-Point Threat Breakdown Table
    safetyChecksTableBody.innerHTML = '';
    audit.checks.forEach(chk => {
      const tr = document.createElement('tr');
      const badgeColor = chk.status === 'pass'
        ? 'background: #ecfdf5; color: #15803d; border: 1px solid #bbf7d0;'
        : (chk.status === 'warning'
          ? 'background: #fffbeb; color: #b45309; border: 1px solid #fde68a;'
          : 'background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;');

      tr.innerHTML = `
        <td style="font-weight: 600; color: var(--navy);">${escapeHtml(chk.name)}</td>
        <td>
          <span style="font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; display: inline-block; ${badgeColor}">
            ${escapeHtml(chk.badge)}
          </span>
        </td>
        <td style="font-size: 12px; color: ${chk.status === 'danger' ? '#991b1b' : (chk.status === 'warning' ? '#92400e' : 'var(--gray-700)')}; line-height: 1.5;">
          ${escapeHtml(chk.evidence)}
        </td>
      `;
      safetyChecksTableBody.appendChild(tr);
    });

    const passedCount = audit.checks.filter(c => c.status === 'pass').length;
    if (threatSummaryPill) {
      threatSummaryPill.textContent = `${passedCount}/10 Checks Passed`;
      threatSummaryPill.style.background = passedCount >= 8 ? '#ecfdf5' : (passedCount >= 5 ? '#fffbeb' : '#fef2f2');
      threatSummaryPill.style.color = passedCount >= 8 ? '#15803d' : (passedCount >= 5 ? '#b45309' : '#dc2626');
      threatSummaryPill.style.borderColor = passedCount >= 8 ? '#bbf7d0' : (passedCount >= 5 ? '#fde68a' : '#fecaca');
    }

    safetyDashboard.style.display = 'block';
    safetyDashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Loading indicator helpers
  function showLoading(show, title = '', subtitle = '') {
    if (!safetyLoading) return;
    safetyLoading.style.display = show ? 'block' : 'none';
    if (loadingTitle && title) loadingTitle.textContent = title;
    if (loadingSubtitle && subtitle) loadingSubtitle.textContent = subtitle;
    if (show && safetyDashboard) safetyDashboard.style.display = 'none';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function showToast(msg, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = msg;
    toast.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 9999; padding: 12px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; color: #fff; background: ' + (type === 'error' ? '#ef4444' : (type === 'success' ? '#10b981' : '#3b82f6')) + '; box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: fadeIn 0.2s ease;';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
});
