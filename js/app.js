/* ═══════════════════════════════════════════════════
   SARKARI RESULT TOOLS — Main Application JS
   ═══════════════════════════════════════════════════ */

(function() {
  'use strict';

  /* ───────── THEME (DARK MODE) — applied before first paint ───────── */
  (function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem('skt-theme'); } catch (e) { /* private mode */ }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
      document.body.classList.add('dark');
      document.documentElement.classList.add('dark');
    }
  })();

  /* ───────── TOOL REGISTRY ───────── */
  const TOOLS = [
    {
      id: 'video-to-audio-converter',
      name: 'Any Video to Audio Converter',
      description: 'Extract studio MP3, WAV, AAC & M4A from any video — unlimited duration, custom bitrates, volume booster & audio trimmer',
      category: 'video',
      categoryLabel: 'Video & Audio',
      icon: '🎵',
      iconBg: 'utility-tools',
      url: 'tools/video-to-audio-converter.html',
      keywords: ['video to audio', 'extract mp3 from video', 'mp4 to mp3', 'video to wav', 'convert video to audio', 'video audio extractor', 'video to m4a', 'extract sound from video'],
      badge: 'New'
    },
    {
      id: 'image-enhancer',
      name: 'Ultra AI Image Enhancer & 4K Super-Resolution',
      description: 'Deep multi-stage photo enhancer: Edge-directed super-resolution (up to 8x), CLAHE local HDR tone mapping, bilateral de-noising, and micro-texture recovery',
      category: 'image',
      categoryLabel: 'Image Tools',
      icon: '💎',
      iconBg: 'image-tools',
      url: 'tools/image-enhancer.html',
      keywords: ['image enhancer', 'ai photo enhancer', 'unblur image', 'super resolution', 'upscale image', 'clahe photo enhancer', 'hd photo converter', 'old photo restore', 'sharpen image', 'photo quality enhancer', '4k upscaler'],
      badge: 'New'
    },
    {
      id: 'ai-video-remover',
      name: 'AI Video to Camera Converter & Forensics Humanizer',
      description: 'Purge C2PA credentials, inject Apple iPhone 15 Pro & Sony FX3 metadata, and simulate physical CMOS sensor grain & camera mic room tone',
      category: 'video',
      categoryLabel: 'Video & Media Tools',
      icon: '🎬',
      iconBg: 'media-tools',
      url: 'tools/ai-video-remover.html',
      keywords: ['ai video remover', 'ai to camera video', 'remove ai from video', 'video metadata editor', 'c2pa video remover', 'sora ai remover', 'kling ai humanizer', 'runway video metadata', 'cmos sensor noise video', 'deepfake humanizer', 'fake video to real'],
      badge: 'New'
    },
    {
      id: 'image-metadata-editor',
      name: 'Image Metadata & AI to Camera Converter',
      description: 'View, edit, or delete EXIF & GPS metadata, remove AI prompt traces, and convert AI images into authentic camera photos',
      category: 'image',
      categoryLabel: 'Image Tools',
      icon: '📷',
      iconBg: 'image-tools',
      url: 'tools/image-metadata-editor.html',
      keywords: ['image metadata', 'exif editor', 'remove ai metadata', 'convert ai to camera photo', 'delete exif', 'photo metadata', 'midjourney metadata', 'stable diffusion exif', 'gps remover', 'camera exif'],
      badge: 'New'
    },
    {
      id: 'image-extractor',
      name: 'Webpage Image Extractor',
      description: 'Extract and download all photos, SVGs, and background images from any website URL or HTML in bulk or ZIP',
      category: 'image',
      categoryLabel: 'Image Tools',
      icon: '📥',
      iconBg: 'image-tools',
      url: 'tools/image-extractor.html',
      keywords: ['image extractor', 'extract images', 'website image downloader', 'scrape images', 'bulk image download', 'zip images', 'save images from link', 'svg extractor', 'photo scraper'],
      badge: 'New'
    },
    {
      id: 'image-to-text',
      name: 'Image to Text (OCR)',
      description: 'Extract editable text from multiple images in English & Hindi with high accuracy',
      category: 'image',
      categoryLabel: 'Image Tools',
      icon: '🔤',
      iconBg: 'image-tools',
      url: 'tools/image-to-text.html',
      keywords: ['ocr', 'image to text', 'extract text', 'photo to text', 'hindi ocr', 'english ocr', 'scan to text', 'picture to text', 'text scanner', 'batch ocr'],
      badge: 'New'
    },
    {
      id: 'image-resizer',
      name: 'Image Resizer',
      description: 'Resize images by pixel, percentage or preset sizes for government forms',
      category: 'image',
      categoryLabel: 'Image Tools',
      icon: '🖼️',
      iconBg: 'image-tools',
      url: 'tools/image-resizer.html',
      keywords: ['resize', 'image', 'photo', 'pixel', 'dimension', 'size', 'crop', 'scale', 'kb', 'passport', 'form'],
      badge: 'Popular'
    },
    {
      id: 'image-converter',
      name: 'Image Format Converter',
      description: 'Convert images between JPG, PNG, WebP, BMP and more formats',
      category: 'image',
      categoryLabel: 'Image Tools',
      icon: '🔄',
      iconBg: 'image-tools',
      url: 'tools/image-converter.html',
      keywords: ['convert', 'format', 'jpg', 'jpeg', 'png', 'webp', 'bmp', 'gif', 'image']
    },
    {
      id: 'passport-photo',
      name: 'Passport Size Photo Maker',
      description: 'Create passport size photos with A4 print layout — 5 or 10 photos per sheet',
      category: 'image',
      categoryLabel: 'Image Tools',
      icon: '📷',
      iconBg: 'image-tools',
      url: 'tools/passport-photo.html',
      keywords: ['passport', 'photo', 'size', 'stamp', 'a4', 'print', 'sheet', 'id'],
      badge: 'Popular'
    },
    {
      id: 'bg-remover',
      name: 'Background Remover',
      description: 'Remove image background instantly and replace with custom colors',
      category: 'image',
      categoryLabel: 'Image Tools',
      icon: '✂️',
      iconBg: 'image-tools',
      url: 'tools/bg-remover.html',
      keywords: ['background', 'remove', 'transparent', 'cutout', 'erase', 'bg']
    },
    {
      id: 'photo-signature',
      name: 'Photo & Signature Joiner',
      description: 'Join photo and signature side by side for government application forms',
      category: 'image',
      categoryLabel: 'Image Tools',
      icon: '✍️',
      iconBg: 'image-tools',
      url: 'tools/photo-signature.html',
      keywords: ['photo', 'signature', 'join', 'combine', 'sarkari', 'form', 'government'],
      badge: 'Popular'
    },
    {
      id: 'name-date-photo',
      name: 'Name & Date on Photo',
      description: 'Add name, date or custom text below your passport photo',
      category: 'image',
      categoryLabel: 'Image Tools',
      icon: '🏷️',
      iconBg: 'image-tools',
      url: 'tools/name-date-photo.html',
      keywords: ['name', 'date', 'photo', 'text', 'watermark', 'label', 'stamp']
    },
    {
      id: 'bg-color-changer',
      name: 'Photo Background Color',
      description: 'Change photo background color to white, blue, red or any custom color',
      category: 'image',
      categoryLabel: 'Image Tools',
      icon: '🎨',
      iconBg: 'image-tools',
      url: 'tools/bg-color-changer.html',
      keywords: ['background', 'color', 'change', 'white', 'blue', 'red', 'photo']
    },
    {
      id: 'image-to-pdf',
      name: 'Image to PDF Converter',
      description: 'Convert images to PDF with headers, footers, watermark and page numbering',
      category: 'pdf',
      categoryLabel: 'PDF Tools',
      icon: '📄',
      iconBg: 'pdf-tools',
      url: 'tools/image-to-pdf.html',
      keywords: ['image', 'pdf', 'convert', 'document', 'merge', 'combine', 'page'],
      badge: 'Popular'
    },
    {
      id: 'pdf-to-image',
      name: 'PDF to Image Converter',
      description: 'Convert PDF pages into high-resolution JPG, PNG, or WebP images and download as a neat ZIP archive with custom folder organization',
      category: 'pdf',
      categoryLabel: 'PDF Tools',
      icon: '🖼️',
      iconBg: 'pdf-tools',
      url: 'tools/pdf-to-image.html',
      keywords: ['pdf to image', 'pdf to jpg', 'pdf to png', 'pdf to webp', 'convert pdf to photos', 'extract pdf pages as images', 'pdf image extractor', 'pdf to zip', 'pdf to images zip'],
      badge: 'New'
    },
    {
      id: 'pdf-editor',
      name: 'Advanced PDF Editor',
      description: 'Edit PDF in browser — add text, images & signatures, watermark, merge, rotate and reorder pages',
      category: 'pdf',
      categoryLabel: 'PDF Tools',
      icon: '📝',
      iconBg: 'pdf-tools',
      url: 'tools/pdf-editor.html',
      keywords: ['pdf editor', 'edit pdf', 'pdf', 'signature', 'sign pdf', 'watermark pdf', 'merge pdf', 'rotate pdf', 'delete pdf pages', 'reorder pdf', 'annotate pdf', 'pdf page numbers'],
      badge: 'New'
    },
    {
      id: 'video-subtitle-maker',
      name: 'AI Video Subtitle Maker',
      description: 'Auto-generate timed subtitles from video with on-device AI — Hindi, English & Hinglish, timeline editor, SRT/VTT export',
      category: 'video',
      categoryLabel: 'Video & Subtitles',
      icon: '🎬',
      iconBg: 'utility-tools',
      url: 'tools/video-subtitle-maker.html',
      keywords: ['video to subtitle', 'subtitle', 'subtitles', 'srt', 'vtt', 'whisper', 'ai subtitle', 'hindi subtitle', 'hinglish subtitle', 'english subtitle', 'caption', 'captions', 'subtitle editor', 'timeline', 'transcription', 'video caption maker'],
      badge: 'New'
    },
    {
      id: 'age-calculator',
      name: 'Age Calculator',
      description: 'Calculate exact age in years, months and days for government exam eligibility',
      category: 'calculator',
      categoryLabel: 'Calculators',
      icon: '📅',
      iconBg: 'calc-tools',
      url: 'tools/age-calculator.html',
      keywords: ['age', 'calculator', 'date', 'birth', 'exam', 'eligibility', 'years', 'months']
    },
    {
      id: 'typing-test',
      name: 'Typing Speed Test',
      description: 'Practice Hindi & English typing for SSC, CHSL and government typing exams',
      category: 'exam',
      categoryLabel: 'Exam Tools',
      icon: '⌨️',
      iconBg: 'exam-tools',
      url: 'tools/typing-test.html',
      keywords: ['typing', 'test', 'speed', 'wpm', 'hindi', 'english', 'ssc', 'chsl', 'practice'],
      badge: 'Popular'
    },
    {
      id: 'resume-maker',
      name: 'Resume / CV Maker',
      description: 'Create professional resumes with beautiful templates — download as PDF',
      category: 'document',
      categoryLabel: 'Document Tools',
      icon: '📝',
      iconBg: 'doc-tools',
      url: 'tools/resume-maker.html',
      keywords: ['resume', 'cv', 'maker', 'builder', 'template', 'job', 'professional', 'career']
    },
    {
      id: 'biodata-maker',
      name: 'Shadi / Marriage Biodata',
      description: 'Create beautiful marriage biodata with customizable templates in Hindi & English',
      category: 'document',
      categoryLabel: 'Document Tools',
      icon: '💍',
      iconBg: 'doc-tools',
      url: 'tools/biodata-maker.html',
      keywords: ['biodata', 'marriage', 'shadi', 'wedding', 'bio', 'data', 'template', 'hindi']
    },
    {
      id: 'letter-writer',
      name: 'Application & Letter Writer',
      description: 'Write formal letters and applications in Hindi, English or Hinglish with AI assistance',
      category: 'document',
      categoryLabel: 'Document Tools',
      icon: '✉️',
      iconBg: 'doc-tools',
      url: 'tools/letter-writer.html',
      keywords: ['letter', 'application', 'formal', 'write', 'hindi', 'english', 'official', 'ai']
    },
    {
      id: 'password-generator',
      name: 'Password Generator',
      description: 'Generate strong, secure passwords for your online accounts',
      category: 'utility',
      categoryLabel: 'Utility Tools',
      icon: '🔐',
      iconBg: 'utility-tools',
      url: 'tools/password-generator.html',
      keywords: ['password', 'generator', 'secure', 'strong', 'random', 'safety']
    },
    {
      id: 'exam-studio',
      name: 'All-in-One Exam Studio',
      description: 'Unified studio to resize photo, crop signature, add name & date, and generate compliant files in 1 click',
      category: 'exam',
      categoryLabel: 'Exam Tools',
      icon: '⚡',
      iconBg: 'exam-tools',
      url: 'tools/exam-studio.html',
      keywords: ['exam', 'studio', 'ssc', 'upsc', 'ibps', 'rrb', 'police', 'signature', 'photo', 'all in one'],
      badge: 'Featured'
    },
    {
      id: 'attendance-calculator',
      name: 'College Attendance Planner',
      description: 'Calculate 75% college attendance eligibility and convert CGPA to percentage',
      category: 'calculator',
      categoryLabel: 'Calculators',
      icon: '🎓',
      iconBg: 'calc-tools',
      url: 'tools/attendance-calculator.html',
      keywords: ['attendance', '75 percent', 'college', 'bunk', 'cgpa', 'percentage', 'university', 'classes'],
      badge: 'Student'
    },
    {
      id: 'qr-generator',
      name: 'All-in-One QR Code Studio & Scanner',
      description: 'Generate UPI with GPay/PhonePe logo, vCard visiting card, Wi-Fi, WhatsApp, Google reviews, and scan QR codes from camera/image',
      category: 'utility',
      categoryLabel: 'Utility Tools',
      icon: '📱',
      iconBg: 'utility-tools',
      url: 'tools/qr-generator.html',
      keywords: ['qr', 'upi', 'phonepe', 'gpay', 'paytm', 'bhim', 'logo', 'vcard', 'visiting card', 'scanner', 'camera', 'scan', 'wifi', 'whatsapp', 'google review', 'maps', 'bulk qr', 'standee', 'payment'],
      badge: 'Featured'
    },
    {
      id: 'upi-qr-generator',
      name: 'UPI QR Code Generator with Logo',
      description: 'Generate Bharat UPI payment QR with GPay, PhonePe, Paytm logo & printable counter standees',
      category: 'utility',
      categoryLabel: 'Utility Tools',
      icon: '💳',
      iconBg: 'utility-tools',
      url: 'tools/upi-qr-generator.html',
      keywords: ['upi', 'qr', 'payment', 'phonepe', 'gpay', 'paytm', 'bhim', 'logo', 'standee', 'scan to pay', 'bharat upi', 'merchant'],
      badge: 'Popular'
    },
    {
      id: 'vcard-qr-generator',
      name: 'vCard Digital Visiting Card QR',
      description: 'Generate digital business card QR codes — scan with iPhone/Android camera to save contact in 1 tap',
      category: 'utility',
      categoryLabel: 'Utility Tools',
      icon: '📇',
      iconBg: 'doc-tools',
      url: 'tools/vcard-qr-generator.html',
      keywords: ['vcard', 'visiting card', 'digital business card', 'contact qr', 'phonebook', 'address book', 'mecard'],
      badge: 'New'
    },
    {
      id: 'qr-scanner',
      name: 'Online QR Code Scanner',
      description: 'Scan QR codes online using your laptop/phone webcam or upload gallery screenshots & images',
      category: 'utility',
      categoryLabel: 'Utility Tools',
      icon: '📷',
      iconBg: 'image-tools',
      url: 'tools/qr-scanner.html',
      keywords: ['qr scanner', 'scan qr', 'webcam qr', 'screenshot qr', 'decode qr', 'read qr online', 'barcode scanner', 'camera'],
      badge: 'Popular'
    },
    {
      id: 'wifi-qr-generator',
      name: 'Wi-Fi Access QR Code Generator',
      description: 'Let guests and customers scan to connect directly to your Wi-Fi without typing passwords',
      category: 'utility',
      categoryLabel: 'Utility Tools',
      icon: '📶',
      iconBg: 'utility-tools',
      url: 'tools/wifi-qr-generator.html',
      keywords: ['wifi', 'wifi qr', 'wifi password', 'connect to wifi', 'guest network', 'table standee', 'router', 'wpa2'],
      badge: 'New'
    },
    {
      id: 'whatsapp-qr-generator',
      name: 'WhatsApp Direct Chat QR Generator',
      description: 'Create scan-to-chat WhatsApp QR codes with pre-filled greeting messages without saving phone numbers',
      category: 'seo',
      categoryLabel: 'SEO & Marketing',
      icon: '💬',
      iconBg: 'utility-tools',
      url: 'tools/whatsapp-qr-generator.html',
      keywords: ['whatsapp', 'whatsapp qr', 'wa me', 'chat qr', 'prefilled message', 'customer support', 'marketing', 'direct chat'],
      badge: 'Popular'
    },
    {
      id: 'google-review-qr-generator',
      name: 'Google Review 5-Star QR Generator',
      description: 'Boost Google Maps local ranking — direct 5-star review QR standee for shop counters & receipts',
      category: 'seo',
      categoryLabel: 'SEO & Marketing',
      icon: '⭐',
      iconBg: 'calc-tools',
      url: 'tools/google-review-qr-generator.html',
      keywords: ['google review', 'review qr', '5 star review', 'google maps review', 'local seo', 'standee', 'feedback', 'ratings'],
      badge: 'Featured'
    },
    {
      id: 'google-maps-qr-generator',
      name: 'Google Maps Location QR Generator',
      description: 'Create turn-by-turn navigation QR codes for store addresses, banners, and wedding invitation cards',
      category: 'utility',
      categoryLabel: 'Utility Tools',
      icon: '📍',
      iconBg: 'image-tools',
      url: 'tools/google-maps-qr-generator.html',
      keywords: ['google maps', 'maps qr', 'location qr', 'navigation', 'wedding card qr', 'store directions', 'gps', 'driving'],
      badge: 'New'
    },
    {
      id: 'gst-calculator',
      name: 'Indian GST Calculator',
      description: 'Calculate GST inclusive, exclusive, CGST, SGST, IGST tax breakdown and retailer profit margins',
      category: 'calculator',
      categoryLabel: 'Calculators',
      icon: '📊',
      iconBg: 'calc-tools',
      url: 'tools/gst-calculator.html',
      keywords: ['gst', 'cgst', 'sgst', 'igst', 'tax', 'invoice', 'margin', 'profit', 'calculator'],
      badge: 'New'
    },
    {
      id: 'invoice-maker',
      name: 'Cyber Cafe Invoice Maker',
      description: 'Generate instant cash memos, customer receipts and GST bills with quick cyber cafe presets',
      category: 'utility',
      categoryLabel: 'Utility Tools',
      icon: '🧾',
      iconBg: 'utility-tools',
      url: 'tools/invoice-maker.html',
      keywords: ['invoice', 'bill', 'receipt', 'cash memo', 'cyber cafe', 'csc', 'print', 'pdf'],
      badge: 'Popular'
    },
    {
      id: 'word-counter',
      name: 'Word & Character Counter',
      description: 'Count words, characters, check SSC/UPSC essay limits, change cases and clean spaces',
      category: 'utility',
      categoryLabel: 'Utility Tools',
      icon: '✍️',
      iconBg: 'utility-tools',
      url: 'tools/word-counter.html',
      keywords: ['word', 'character', 'counter', 'text', 'format', 'case', 'uppercase', 'lowercase', 'essay', 'limit']
    },
    {
      id: 'ai-plagiarism-checker',
      name: 'AI & Plagiarism Detector',
      description: 'Check essays & text for ChatGPT, Claude AI probability, similarity %, word counts & highlighted sentences',
      category: 'document',
      categoryLabel: 'Document Tools',
      icon: '🤖',
      iconBg: 'doc-tools',
      url: 'tools/ai-plagiarism-checker.html',
      keywords: ['ai', 'detector', 'plagiarism', 'chatgpt', 'claude', 'gemini', 'percentage', 'words', 'essay', 'check', 'similarity'],
      badge: 'Popular'
    },
    {
      id: 'barcode-generator',
      name: 'Online Barcode Generator',
      description: 'Generate Code 128, EAN-13, UPC barcodes with instant SVG/PNG download and printable A4 sticker sheets',
      category: 'utility',
      categoryLabel: 'Utility Tools',
      icon: '🏷️',
      iconBg: 'utility-tools',
      url: 'tools/barcode-generator.html',
      keywords: ['barcode', 'generator', 'code 128', 'ean 13', 'upc', 'code 39', 'label', 'sticker', 'inventory', 'retail', 'product', 'sheet'],
      badge: 'New'
    },
    {
      id: 'whois-lookup',
      name: 'Domain WHOIS & DNS Checker',
      description: 'Check live DNS records (A, MX, TXT, NS, CNAME), domain age, hosting provider and SPF/DMARC email security',
      category: 'seo',
      categoryLabel: 'SEO & Marketing',
      icon: '🌐',
      iconBg: 'image-tools',
      url: 'tools/whois-lookup.html',
      keywords: ['whois', 'domain', 'dns', 'mx', 'txt', 'ns', 'a record', 'ssl', 'spf', 'dmarc', 'domain age', 'registrar', 'host', 'seo'],
      badge: 'New'
    },
    {
      id: 'url-safety-checker',
      name: 'URL Safety Checker & Scam Link Detector',
      description: 'Scan links for phishing, WhatsApp/SMS scams, fake bank KYC fraud, malware downloads & Cloudflare threat blocklists',
      category: 'seo',
      categoryLabel: 'Security & Utility',
      icon: '🛡️',
      iconBg: 'utility-tools',
      url: 'tools/url-safety-checker.html',
      keywords: ['url safety checker', 'safe link checker', 'scam link detector', 'phishing checker', 'is link safe', 'malicious url', 'fraud link detector', 'whatsapp scam link', 'virus link checker'],
      badge: 'New'
    },
    {
      id: 'product-research',
      name: 'Winning Product Research & Dropshipping Spy Tool',
      description: 'Find trending winning products by country & category, spy on live competitor Meta ads, TikTok trends & calculate profit margins',
      category: 'seo',
      categoryLabel: 'E-Commerce & Marketing',
      icon: '🛍️',
      iconBg: 'calc-tools',
      url: 'tools/product-research.html',
      keywords: ['product research', 'dropshipping product finder', 'winning products', 'meta ad library spy', 'tiktok creative center', 'ecommerce tools', 'dropshipping profit calculator', 'trending products india usa'],
      badge: 'New'
    },
    {
      id: 'website-analyzer',
      name: 'All-in-One Website Analyzer & Auditor',
      description: '360° verified audit: active Meta & Facebook ads, social profiles, Google Maps, contact details, tech stack & DNS',
      category: 'seo',
      categoryLabel: 'SEO & Marketing',
      icon: '🔬',
      iconBg: 'calc-tools',
      url: 'tools/website-analyzer.html',
      keywords: ['website analyzer', 'site audit', 'meta ads', 'facebook ads library', 'instagram finder', 'google maps', 'tech stack', 'competitor analysis', 'email finder', 'phone finder'],
      badge: 'New'
    },
    {
      id: 'tech-detector',
      name: 'Website Tech Stack & Shopify Detector',
      description: 'Discover CMS, Shopify apps & themes, React, Next.js, hosting, CDN, and 200+ technologies',
      category: 'seo',
      categoryLabel: 'SEO & Marketing',
      icon: '🔎',
      iconBg: 'calc-tools',
      url: 'tools/tech-detector.html',
      keywords: ['wappalyzer', 'tech stack', 'shopify detector', 'what cms', 'builtwith', 'ecommerce detector', 'technology lookup', 'shopify apps', 'wordpress detector', 'website technologies'],
      badge: 'New'
    },
    {
      id: 'da-pa-checker',
      name: 'Domain Authority (DA) & PA Checker',
      description: 'Analyze website ranking potential — calculate estimated DA (1-100), Page Authority (PA), Spam Score, and 10-point SEO audit',
      category: 'seo',
      categoryLabel: 'SEO & Marketing',
      icon: '📊',
      iconBg: 'calc-tools',
      url: 'tools/da-pa-checker.html',
      keywords: ['da', 'pa', 'domain authority', 'page authority', 'moz', 'spam score', 'seo audit', 'rank', 'website score', 'digital marketing'],
      badge: 'Popular'
    },
    {
      id: 'meta-tag-generator',
      name: 'Meta Tag & Open Graph Generator',
      description: 'Build Google SEO meta tags and social share cards (WhatsApp, Facebook, Twitter) with live interactive previews',
      category: 'seo',
      categoryLabel: 'SEO & Marketing',
      icon: '🏷️',
      iconBg: 'utility-tools',
      url: 'tools/meta-tag-generator.html',
      keywords: ['meta tag', 'open graph', 'og', 'twitter card', 'meta title', 'meta description', 'facebook preview', 'whatsapp preview', 'seo'],
      badge: 'Featured'
    },
    {
      id: 'keyword-density',
      name: 'Keyword Density & Content Optimizer',
      description: 'Analyze articles for 1-word, 2-word, 3-word phrase frequency, keyword density %, Flesch readability, and stuffing warnings',
      category: 'seo',
      categoryLabel: 'SEO & Marketing',
      icon: '📈',
      iconBg: 'doc-tools',
      url: 'tools/keyword-density.html',
      keywords: ['keyword density', 'content optimizer', 'keyword frequency', 'stuffing', 'ngram', 'flesch', 'reading time', 'article', 'blog', 'seo']
    },
    {
      id: 'robots-sitemap-generator',
      name: 'Robots.txt & XML Sitemap Generator',
      description: 'Build search engine crawl directives with live URL testing, CMS presets (WordPress, Shopify), and W3C XML sitemaps',
      category: 'seo',
      categoryLabel: 'SEO & Marketing',
      icon: '🤖',
      iconBg: 'exam-tools',
      url: 'tools/robots-sitemap-generator.html',
      keywords: ['robots txt', 'sitemap', 'xml sitemap', 'googlebot', 'crawler', 'crawl delay', 'disallow', 'allow', 'seo tools', 'url tester']
    },
    {
      id: 'schema-generator',
      name: 'Google Schema Markup (JSON-LD)',
      description: 'Generate rich snippet structured data for FAQ accordions, Local Business, Article, Product reviews, and Organization',
      category: 'seo',
      categoryLabel: 'SEO & Marketing',
      icon: '⚡',
      iconBg: 'utility-tools',
      url: 'tools/schema-generator.html',
      keywords: ['schema', 'json ld', 'faq schema', 'rich snippets', 'local business schema', 'product schema', 'article schema', 'google rich results', 'seo'],
      badge: 'New'
    },
    {
      id: 'utm-builder',
      name: 'UTM Campaign URL Builder & QR',
      description: 'Create Google Analytics tracking links with 1-click pills, multi-channel bulk links (WhatsApp, Meta, Google), and printable QR',
      category: 'seo',
      categoryLabel: 'SEO & Marketing',
      icon: '🔗',
      iconBg: 'image-tools',
      url: 'tools/utm-builder.html',
      keywords: ['utm', 'campaign', 'url builder', 'google analytics', 'ga4', 'tracking link', 'whatsapp marketing', 'qr code link', 'digital marketing']
    },
    {
      id: 'serp-simulator',
      name: 'Google SERP Snippet Simulator',
      description: 'Simulate desktop and mobile search snippets with real Arial 20px pixel width calculation, rich stars, and query bolding',
      category: 'seo',
      categoryLabel: 'SEO & Marketing',
      icon: '🔍',
      iconBg: 'calc-tools',
      url: 'tools/serp-simulator.html',
      keywords: ['serp simulator', 'google preview', 'pixel width', 'title pixel', 'meta description', 'ctr optimizer', 'rich snippet preview', 'seo']
    },
    {
      id: 'domain-checker',
      name: 'Domain Availability Checker',
      description: 'Check live domain availability in real time across .com, .in, .co.in, .org with instant pricing & bulk search',
      category: 'seo',
      categoryLabel: 'SEO & Marketing',
      icon: '🌐',
      iconBg: 'image-tools',
      url: 'tools/domain-checker.html',
      keywords: ['domain', 'domain availability', 'domain checker', 'check domain', 'is domain available', 'buy domain', 'godaddy', 'in domain', 'com domain', 'bulk domain', 'whois', 'seo'],
      badge: 'Popular'
    },
    {
      id: 'internet-speed-test',
      name: 'Internet Speed Test & Net Performance',
      description: 'Test live broadband, 5G & Wi-Fi internet speeds, download & upload throughput, latency ping, and jitter with speedometer gauge',
      category: 'utility',
      categoryLabel: 'Utility Tools',
      icon: '⚡',
      iconBg: 'utility-tools',
      url: 'tools/internet-speed-test.html',
      keywords: ['internet speed test', 'net speed checker', 'speedtest', 'wifi speed', 'broadband test', '5g speed', 'ping', 'jitter', 'download speed', 'upload speed', 'mbps', 'speed'],
      badge: 'New'
    },
    {
      id: 'quick-notes',
      name: 'Quick Notes & Local Task Keeper',
      description: 'Fast offline notepad with complete local CRUD operations, interactive checklist tasks, tags, auto-save, and JSON backup',
      category: 'utility',
      categoryLabel: 'Utility Tools',
      icon: '📝',
      iconBg: 'utility-tools',
      url: 'tools/quick-notes.html',
      keywords: ['quick notes', 'notes', 'notepad', 'local notes', 'crud notes', 'todo', 'checklist', 'task keeper', 'offline notepad', 'memo', 'cyber cafe records'],
      badge: 'New'
    },
    {
      id: 'emi-calculator',
      name: 'Loan & EMI Calculator (Home, Car, Personal)',
      description: 'Calculate monthly loan EMI, total interest payable, visual principal-interest donut chart, and complete yearly amortization schedule',
      category: 'calculator',
      categoryLabel: 'Calculators',
      icon: '💰',
      iconBg: 'calc-tools',
      url: 'tools/emi-calculator.html',
      keywords: ['emi calculator', 'loan emi', 'home loan emi', 'car loan', 'personal loan', 'interest calculator', 'amortization table', 'bank emi', 'sbi emi', 'loan schedule', 'emi'],
      badge: 'New'
    },
    {
      id: 'unit-converter',
      name: 'Land Area & Smart Unit Converter',
      description: 'Convert Indian land units (Bigha, Gaj, Biswa, Katha, Acre, Sq.Ft) along with Length, Weight (Tola), and Digital Data (MB/GB)',
      category: 'calculator',
      categoryLabel: 'Calculators',
      icon: '📐',
      iconBg: 'calc-tools',
      url: 'tools/unit-converter.html',
      keywords: ['unit converter', 'land converter', 'bigha to sq ft', 'bigha to gaj', 'biswa', 'katha', 'acre', 'tola to gram', 'digital storage', 'length converter', 'bhulekh'],
      badge: 'New'
    }
,
    {
      id: 'krutidev-converter',
      name: 'Unicode to Kruti Dev 010 Converter',
      description: 'Accurately convert Hindi text between modern Unicode (Mangal) and Kruti Dev 010 for typing exams and court jobs',
      category: 'document',
      categoryLabel: 'Document Tools',
      icon: '🇮🇳',
      iconBg: 'doc-tools',
      url: 'tools/krutidev-converter.html',
      keywords: ['unicode to krutidev', 'krutidev to unicode', 'mangal to kruti dev', 'hindi font converter', 'krutidev 010', 'hindi typing converter', 'remington font'],
      badge: 'New'
    },
    {
      id: 'text-to-handwriting',
      name: 'Text to Handwriting Converter',
      description: 'Convert typed homework, assignments, and notes into realistic handwritten notebook pages with custom ink and paper',
      category: 'document',
      categoryLabel: 'Document Tools',
      icon: '📝',
      iconBg: 'doc-tools',
      url: 'tools/text-to-handwriting.html',
      keywords: ['text to handwriting', 'handwriting generator', 'typed to handwritten', 'assignment maker', 'notes converter', 'ruled paper text'],
      badge: 'New'
    },
    {
      id: 'bionic-reading',
      name: 'Bionic Reading Converter',
      description: 'Read up to 3x faster with higher retention using artificial eye fixation points on any text or article',
      category: 'utility',
      categoryLabel: 'Utility Tools',
      icon: '🧠',
      iconBg: 'utility-tools',
      url: 'tools/bionic-reading.html',
      keywords: ['bionic reading', 'speed reading', 'adhd reading', 'fast reader', 'bold first letters', 'comprehension focus'],
      badge: 'New'
    },
    {
      id: 'numbers-to-words',
      name: 'Numbers to Words Converter',
      description: 'Convert numbers, amounts, and currency into official words in Indian (Lakhs/Crores) and International formats for cheques and invoices',
      category: 'calculator',
      categoryLabel: 'Calculators',
      icon: '🔢',
      iconBg: 'calc-tools',
      url: 'tools/numbers-to-words.html',
      keywords: ['numbers to words', 'amount in words', 'cheque amount in words', 'indian number converter', 'lakh crore in words', 'rupees to words'],
      badge: 'New'
    },
    {
      id: 'youtube-thumbnail-downloader',
      name: 'YouTube Thumbnail Downloader',
      description: 'Grab and download Ultra HD 1080p, 720p, HQ, and Shorts cover thumbnails from any YouTube video in one click',
      category: 'social',
      categoryLabel: 'Social Media',
      icon: '📺',
      iconBg: 'video-tools',
      url: 'tools/youtube-thumbnail-downloader.html',
      keywords: ['youtube thumbnail downloader', 'download yt thumbnail', '1080p thumbnail', 'youtube shorts cover', 'maxresdefault grabber'],
      badge: 'New'
    },
    {
      id: 'youtube-thumbnail-editor',
      name: 'AI YouTube Thumbnail Editor & Multi-Layer Studio',
      description: 'Deconstruct YouTube thumbnails into editable subject & background layers, add pro YouTuber outlines, 3D text, arrows, and export in 1080p — 100% GPU accelerated',
      category: 'video',
      categoryLabel: 'Video & Subtitles',
      icon: '🎨',
      iconBg: 'media-tools',
      url: 'tools/youtube-thumbnail-editor.html',
      keywords: ['youtube thumbnail editor', 'thumbnail maker', 'ai thumbnail editor', 'youtube thumbnail layers', 'thumbnail layer separator', 'photoshop thumbnail editor', 'mrbeast outline generator', 'youtube banner maker', 'multilateral thumbnail'],
      badge: 'New'
    },
    {
      id: 'tweet-generator',
      name: 'Fake Tweet / X Post Generator',
      description: 'Create pixel-perfect Twitter and X post mockups with custom verified ticks, avatars, metrics, and high-res PNG download',
      category: 'social',
      categoryLabel: 'Social Media',
      icon: '🐦',
      iconBg: 'utility-tools',
      url: 'tools/tweet-generator.html',
      keywords: ['fake tweet generator', 'twitter mockup', 'x post generator', 'tweet meme maker', 'fake twitter screenshot'],
      badge: 'New'
    },
    {
      id: 'instagram-post-generator',
      name: 'Instagram Post Mockup Generator',
      description: 'Design realistic Instagram feed post mockups with profile avatar, photo, likes count, caption, and verified badge',
      category: 'social',
      categoryLabel: 'Social Media',
      icon: '📸',
      iconBg: 'image-tools',
      url: 'tools/instagram-post-generator.html',
      keywords: ['instagram post generator', 'fake instagram post', 'ig post mockup', 'instagram meme maker', 'social mockup'],
      badge: 'New'
    },
    {
      id: 'youtube-tag-extractor',
      name: 'YouTube Tags & SEO Extractor',
      description: 'Extract hidden tags, keywords, titles, and SEO metadata from any YouTube video or Shorts to boost rankings',
      category: 'seo',
      categoryLabel: 'SEO & Marketing',
      icon: '🏷️',
      iconBg: 'seo-tools',
      url: 'tools/youtube-tag-extractor.html',
      keywords: ['youtube tag extractor', 'extract youtube tags', 'youtube keyword finder', 'video seo tags', 'copy tags youtube studio'],
      badge: 'New'
    },
    {
      id: 'base64-converter',
      name: 'Base64 Encoder & Decoder',
      description: 'Encode and decode plain text, images, and files to Base64 format with full UTF-8 and Data URI support',
      category: 'utility',
      categoryLabel: 'Utility Tools',
      icon: '🔐',
      iconBg: 'utility-tools',
      url: 'tools/base64-converter.html',
      keywords: ['base64 encode', 'base64 decode', 'image to base64', 'base64 to image', 'data uri generator', 'base64 string'],
      badge: 'New'
    },
    {
      id: 'hash-generator',
      name: 'Hash Generator & Checksum Verifier',
      description: 'Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes from text or files and verify download integrity',
      category: 'utility',
      categoryLabel: 'Utility Tools',
      icon: '🛡️',
      iconBg: 'utility-tools',
      url: 'tools/hash-generator.html',
      keywords: ['hash generator', 'md5 hash', 'sha256 generator', 'sha1 hash', 'sha512', 'checksum verifier', 'file integrity check'],
      badge: 'New'
    },
    {
      id: 'code-formatter',
      name: 'Code Formatter & Minifier',
      description: 'Beautify or minify HTML, CSS, JavaScript, and JSON code to reduce file sizes and clean messy syntax',
      category: 'utility',
      categoryLabel: 'Utility Tools',
      icon: '💻',
      iconBg: 'utility-tools',
      url: 'tools/code-formatter.html',
      keywords: ['code formatter', 'code beautifier', 'css minifier', 'html beautifier', 'js minifier', 'json formatter', 'compress code'],
      badge: 'New'
    },
    {
      id: 'json-xml-converter',
      name: 'JSON to XML & XML to JSON Converter',
      description: 'Convert structured data seamlessly between JSON and XML with syntax validation and custom root tags',
      category: 'utility',
      categoryLabel: 'Utility Tools',
      icon: '🔄',
      iconBg: 'utility-tools',
      url: 'tools/json-xml-converter.html',
      keywords: ['json to xml', 'xml to json', 'json xml converter', 'convert json to xml', 'xml parser', 'soap to rest'],
      badge: 'New'
    },
    {
      id: 'url-html-encoder',
      name: 'URL & HTML Entity Encoder / Decoder',
      description: 'Escape and sanitize special characters for web URLs, query parameters, and HTML templates to prevent broken links and XSS',
      category: 'utility',
      categoryLabel: 'Utility Tools',
      icon: '🌐',
      iconBg: 'utility-tools',
      url: 'tools/url-html-encoder.html',
      keywords: ['url encode', 'url decode', 'html entity encoder', 'html escape', 'percent encoding', 'url parameter encoder'],
      badge: 'New'
    },
    {
      id: 'color-converter',
      name: 'Color Converter & Palette Studio',
      description: 'Convert between HEX, RGB, HSL, and CMYK color codes, check WCAG accessibility contrast ratios, and generate palettes',
      category: 'utility',
      categoryLabel: 'Utility Tools',
      icon: '🎨',
      iconBg: 'utility-tools',
      url: 'tools/color-converter.html',
      keywords: ['color converter', 'hex to rgb', 'rgb to hex', 'hex to hsl', 'cmyk converter', 'wcag contrast checker', 'color palette generator'],
      badge: 'New'
    },
    {
      id: 'case-converter',
      name: 'Text Case Converter & String Tools',
      description: 'Convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, and reverse text',
      category: 'utility',
      categoryLabel: 'Utility Tools',
      icon: '🔠',
      iconBg: 'utility-tools',
      url: 'tools/case-converter.html',
      keywords: ['case converter', 'uppercase to lowercase', 'title case', 'camelcase generator', 'snake case', 'capitalize words', 'reverse text'],
      badge: 'New'
    },
    {
      id: 'image-slicer',
      name: 'Image Slicer & Grid Splitter',
      description: 'Split photos into multi-image grids for Instagram 3x3 profiles, Twitter panoramic banners, and custom slices with ZIP download',
      category: 'image',
      categoryLabel: 'Image Tools',
      icon: '✂️',
      iconBg: 'image-tools',
      url: 'tools/image-slicer.html',
      keywords: ['image slicer', 'grid splitter', 'instagram 3x3 grid', 'twitter image slicer', 'split photo into parts', 'photo splitter'],
      badge: 'New'
    },
    {
      id: 'webcam-mic-tester',
      name: 'Webcam & Microphone Tester',
      description: 'Verify camera resolution, real-time FPS, microphone volume level meter, and speaker audio before exams and online interviews',
      category: 'utility',
      categoryLabel: 'Utility Tools',
      icon: '🎥',
      iconBg: 'utility-tools',
      url: 'tools/webcam-mic-tester.html',
      keywords: ['webcam test', 'mic test', 'microphone tester', 'camera test online', 'test resolution', 'zoom audio check', 'proctored exam check'],
      badge: 'New'
    },
    {
      id: 'pdf-merger-splitter',
      name: 'Merge PDF & Split PDF Pages',
      description: 'Combine multiple PDF documents into one or extract specific page ranges with 100% client-side privacy',
      category: 'pdf',
      categoryLabel: 'PDF Tools',
      icon: '📑',
      iconBg: 'pdf-tools',
      url: 'tools/pdf-merger-splitter.html',
      keywords: ['merge pdf', 'split pdf', 'combine pdf files', 'separate pdf pages', 'pdf joiner', 'pdf page extractor'],
      badge: 'New'
    },
    {
      id: 'pdf-lock-unlock',
      name: 'Protect PDF & Unlock PDF Tool',
      description: 'Add strong password encryption to confidential PDFs or permanently remove passwords from protected PDFs in your browser',
      category: 'pdf',
      categoryLabel: 'PDF Tools',
      icon: '🔒',
      iconBg: 'pdf-tools',
      url: 'tools/pdf-lock-unlock.html',
      keywords: ['protect pdf', 'unlock pdf', 'encrypt pdf', 'remove pdf password', 'decrypt pdf', 'secure pdf online'],
      badge: 'New'
    },
    {
      id: 'policy-generator',
      name: 'Privacy Policy & Terms Generator',
      description: 'Generate legally compliant Privacy Policy and Terms of Service documents configured for Google AdSense, GDPR, and analytics',
      category: 'document',
      categoryLabel: 'Document Tools',
      icon: '📜',
      iconBg: 'doc-tools',
      url: 'tools/policy-generator.html',
      keywords: ['privacy policy generator', 'terms and conditions generator', 'terms of service', 'adsense privacy policy', 'gdpr policy maker'],
      badge: 'New'
    }
  ];

  const CATEGORIES = [
    { id: 'all', label: 'All Tools', count: TOOLS.length },
    { id: 'image', label: 'Image Tools', count: TOOLS.filter(t => t.category === 'image').length },
    { id: 'pdf', label: 'PDF Tools', count: TOOLS.filter(t => t.category === 'pdf').length },
    { id: 'calculator', label: 'Calculators', count: TOOLS.filter(t => t.category === 'calculator').length },
    { id: 'exam', label: 'Exam Tools', count: TOOLS.filter(t => t.category === 'exam').length },
    { id: 'document', label: 'Documents', count: TOOLS.filter(t => t.category === 'document').length },
    { id: 'utility', label: 'Utilities', count: TOOLS.filter(t => t.category === 'utility').length },
    { id: 'social', label: 'Social Media', count: TOOLS.filter(t => t.category === 'social').length },
    { id: 'video', label: 'Video & Subtitles', count: TOOLS.filter(t => t.category === 'video').length },
    { id: 'seo', label: 'SEO & Marketing', count: TOOLS.filter(t => t.category === 'seo').length }
  ];

  /* ───────── PATH HELPERS FOR ROOT VS /tools/ ───────── */
  const isInsideTools = window.location.pathname.includes('/tools/') || window.location.href.includes('/tools/');
  const homeUrl = '/';
  const toolsDirUrl = '/tools.html';
  const aboutUrl = '/about.html';
  const contactUrl = '/contact.html';
  const privacyUrl = '/privacy-policy.html';
  const termsUrl = '/terms.html';
  const disclaimerUrl = '/disclaimer.html';
  function getToolUrl(tool) {
    return `/tools/${tool.id}.html`;
  }

  /* ───────── SHARED HEADER COMPONENT ───────── */
  function renderHeader() {
    return `
    <div class="tricolor-stripe"></div>
    <header class="site-header" id="siteHeader">
      <div class="header-inner">
        <a href="${homeUrl}" class="logo" aria-label="AllToolsInOne - Home">
          <svg class="logo-icon" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="8" fill="#1A237E"/>
            <path d="M8 18C8 12.477 12.477 8 18 8s10 4.477 10 10-4.477 10-10 10S8 23.523 8 18z" fill="#FF9933" opacity="0.9"/>
            <path d="M18 11l1.5 4.5H24l-3.7 2.7L21.8 23 18 20.3 14.2 23l1.5-4.8L12 15.5h4.5L18 11z" fill="white"/>
          </svg>
          <div class="logo-text">All<span>ToolsInOne</span></div>
        </a>

        <div class="header-search" id="headerSearch">
          <svg class="header-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input type="text" class="header-search-input" placeholder="Search tools... (Ctrl+K)" id="headerSearchInput" autocomplete="off" aria-label="Search tools">
          <div class="search-results-dropdown" id="headerSearchResults"></div>
        </div>

        <nav class="nav-menu" id="navMenu">
          <ul class="nav-links">
            <li><a href="${homeUrl}">Home</a></li>
            <li><a href="${toolsDirUrl}">All Tools</a></li>
            <li><a href="${aboutUrl}">About</a></li>
            <li><a href="${contactUrl}">Contact</a></li>
          </ul>
        </nav>

        <button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode" title="Toggle dark / light mode">
          <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
          <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        </button>

        <button class="menu-toggle" id="menuToggle" aria-label="Toggle menu" aria-expanded="false">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>
    </header>

    <nav class="mobile-nav" id="mobileNav">
      <div class="mobile-search" style="margin-bottom: var(--space-4);">
        <input type="text" class="header-search-input" placeholder="Search tools..." id="mobileSearchInput" autocomplete="off" aria-label="Search tools" style="width:100%; border-radius:var(--radius-md);">
        <div class="search-results-dropdown" id="mobileSearchResults"></div>
      </div>
      <ul class="mobile-nav-links" id="mobileNavLinks">
        <li><a href="${homeUrl}">🏠 Home</a></li>
        <li><a href="${toolsDirUrl}">⚡ All Tools Directory</a></li>
        <li><a href="${aboutUrl}">ℹ️ About Us</a></li>
        <li><a href="${contactUrl}">📬 Contact Support</a></li>
        <li><a href="${privacyUrl}">🔒 Privacy Policy</a></li>
        <li><a href="${termsUrl}">📜 Terms of Service</a></li>
      </ul>
    </nav>`;
  }

  /* ───────── SHARED FOOTER COMPONENT ───────── */
  function renderFooter() {
    return `
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="logo-text">All<span style="color: var(--saffron);">ToolsInOne</span></div>
            <p>All-in-one free online tools for everyone — students, freelancers, and businesses worldwide. 100% private in your browser: zero server uploads, no login required.</p>
          </div>
          <div class="footer-col">
            <h4>Image & Exam Tools</h4>
            <ul>
              ${TOOLS.filter(t => ['image', 'exam'].includes(t.category)).slice(0, 6).map(t => `<li><a href="${getToolUrl(t)}">${t.name}</a></li>`).join('')}
            </ul>
          </div>
          <div class="footer-col">
            <h4>Documents & PDF</h4>
            <ul>
              ${TOOLS.filter(t => ['pdf','document'].includes(t.category)).map(t => `<li><a href="${getToolUrl(t)}">${t.name}</a></li>`).join('')}
            </ul>
          </div>
          <div class="footer-col">
            <h4>Calculators & Utilities</h4>
            <ul>
              ${TOOLS.filter(t => ['calculator','utility'].includes(t.category)).slice(0, 6).map(t => `<li><a href="${getToolUrl(t)}">${t.name}</a></li>`).join('')}
            </ul>
          </div>
          <div class="footer-col">
            <h4>SEO & Marketing Tools</h4>
            <ul>
              ${TOOLS.filter(t => t.category === 'seo').slice(0, 6).map(t => `<li><a href="${getToolUrl(t)}">${t.name}</a></li>`).join('')}
            </ul>
          </div>
          <div class="footer-col">
            <h4>Support &amp; Legal</h4>
            <ul>
              <li><a href="${aboutUrl}">About Us</a></li>
              <li><a href="${contactUrl}">Contact Support</a></li>
              <li><a href="${privacyUrl}">Privacy Policy</a></li>
              <li><a href="${termsUrl}">Terms of Service</a></li>
              <li><a href="${disclaimerUrl}">Disclaimer</a></li>
              <li><a href="${homeUrl}#anonymousFeedbackSection">💬 Feedback &amp; Bugs</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; ${new Date().getFullYear()} AllToolsInOne. 100% Free &amp; Private — No Google / Gmail Login Required.</p>
          <div class="footer-bottom-links">
            <a href="${homeUrl}">Home</a>
            <a href="${toolsDirUrl}">All Tools</a>
            <a href="${aboutUrl}">About Us</a>
            <a href="${contactUrl}">Contact</a>
            <a href="${privacyUrl}">Privacy Policy</a>
            <a href="${termsUrl}">Terms</a>
            <a href="${disclaimerUrl}">Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>`;
  }

  /* ───────── SEARCH ENGINE ───────── */
  function fuzzyMatch(query, text) {
    query = query.toLowerCase();
    text = text.toLowerCase();
    if (text.includes(query)) return 100;
    
    let score = 0;
    let qi = 0;
    for (let ti = 0; ti < text.length && qi < query.length; ti++) {
      if (text[ti] === query[qi]) {
        score += 10;
        qi++;
      }
    }
    return qi === query.length ? score : 0;
  }

  function searchTools(query) {
    if (!query || query.length < 1) return [];
    
    const results = TOOLS.map(tool => {
      let score = 0;
      score += fuzzyMatch(query, tool.name) * 3;
      score += fuzzyMatch(query, tool.description) * 1;
      tool.keywords.forEach(kw => {
        score += fuzzyMatch(query, kw) * 2;
      });
      score += fuzzyMatch(query, tool.categoryLabel) * 1.5;
      return { ...tool, score };
    })
    .filter(t => t.score > 0)
    .sort((a, b) => b.score - a.score);
    
    return results;
  }

  function renderSearchResults(results, container) {
    if (results.length === 0) {
      container.innerHTML = '<div class="search-no-results">No tools found. Try a different search term like "photo", "pdf", "age", "qr".</div>';
      container.classList.add('active');
      return;
    }

    container.innerHTML = results.map(tool => `
      <a href="${getToolUrl(tool)}" class="search-result-item">
        <div style="display: flex; align-items: center; gap: 14px; min-width: 0;">
          <div class="result-icon tool-card-icon ${tool.iconBg}">${tool.icon}</div>
          <div style="min-width: 0;">
            <div class="result-name">${tool.name}</div>
            <div class="result-category">${tool.categoryLabel}</div>
          </div>
        </div>
        <div class="result-arrow">→</div>
      </a>
    `).join('');
    container.classList.add('active');
  }

  /* ───────── SCROLL REVEAL OBSERVER ───────── */
  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if (!entry.target.classList.contains('stagger-children')) {
            observer.unobserve(entry.target);
          }
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children').forEach(el => {
      observer.observe(el);
    });
  }

  /* ───────── HEADER SCROLL EFFECT ───────── */
  function initHeaderScroll() {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    const heroSearch = document.getElementById('heroSearchInput');
    if (heroSearch) {
      document.body.classList.add('home-page');
    }

    let ticking = false;
    const checkHeroScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
          if (currentScroll > 10) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }

          if (heroSearch) {
            const rect = heroSearch.getBoundingClientRect();
            if (rect.bottom < 50) {
              document.body.classList.add('scrolled-past-hero');
            } else {
              document.body.classList.remove('scrolled-past-hero');
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', checkHeroScroll, { passive: true });
    checkHeroScroll();
  }

  /* ───────── MOBILE MENU ───────── */
  function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    if (!toggle || !mobileNav) return;

    toggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('active');
      if (!isOpen) {
        const linksList = document.getElementById('mobileNavLinks');
        if (linksList && !linksList.dataset.rendered) {
          linksList.dataset.rendered = 'true';
          linksList.innerHTML = `
            <li><a href="${homeUrl}">🏠 Home</a></li>
            <li><a href="${toolsDirUrl}">⚡ All Tools Directory</a></li>
            ${TOOLS.map(t => `<li><a href="${getToolUrl(t)}">${t.icon} ${t.name}</a></li>`).join('')}
          `;
        }
      }
      mobileNav.classList.toggle('active');
      toggle.setAttribute('aria-expanded', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });
  }

  /* ───────── SEARCH INITIALIZATION ───────── */
  function initSearch() {
    // Header search
    const headerInput = document.getElementById('headerSearchInput');
    const headerResults = document.getElementById('headerSearchResults');
    
    if (headerInput && headerResults) {
      headerInput.addEventListener('input', (e) => {
        const q = e.target.value.trim();
        if (q.length > 0) {
          renderSearchResults(searchTools(q), headerResults);
        } else {
          headerResults.classList.remove('active');
        }
      });

      document.addEventListener('click', (e) => {
        if (!headerInput.contains(e.target) && !headerResults.contains(e.target)) {
          headerResults.classList.remove('active');
        }
      });
    }

    // Hero search
    const heroInput = document.getElementById('heroSearchInput');
    const heroResults = document.getElementById('heroSearchResults');
    
    if (heroInput && heroResults) {
      heroInput.addEventListener('input', (e) => {
        const q = e.target.value.trim();
        if (q.length > 0) {
          renderSearchResults(searchTools(q), heroResults);
        } else {
          heroResults.classList.remove('active');
        }
      });

      document.addEventListener('click', (e) => {
        if (!heroInput.contains(e.target) && !heroResults.contains(e.target)) {
          heroResults.classList.remove('active');
        }
      });
    }

    // Mobile search
    const mobileInput = document.getElementById('mobileSearchInput');
    const mobileResults = document.getElementById('mobileSearchResults');
    
    if (mobileInput && mobileResults) {
      mobileInput.addEventListener('input', (e) => {
        const q = e.target.value.trim();
        if (q.length > 0) {
          renderSearchResults(searchTools(q), mobileResults);
        } else {
          mobileResults.classList.remove('active');
        }
      });
    }

    // Keyboard shortcut Ctrl+K
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        let input = headerInput;
        if (heroInput && !document.body.classList.contains('scrolled-past-hero')) {
          input = heroInput;
        } else if (headerInput) {
          input = headerInput;
        }
        if (input) {
          input.focus();
          input.select();
        }
      }
    });
  }

  /* ───────── CATEGORY NAVIGATION & SECTIONS (Allinone Style) ───────── */
  function initCategoryFilter() {
    const navPills = document.querySelectorAll('.cat-nav-pill');
    const sections = document.querySelectorAll('.category-section');
    if (!navPills.length) return;

    // Click handler on navigation pills
    navPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        const targetFilter = pill.dataset.filter;
        navPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        if (targetFilter === 'all') {
          sections.forEach(s => s.style.display = '');
          const toolsRoot = document.getElementById('tools');
          if (toolsRoot) toolsRoot.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          // If user clicked a specific category, smooth scroll to it
          const targetSection = document.getElementById(`cat-${targetFilter}`);
          if (targetSection) {
            sections.forEach(s => s.style.display = '');
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });

    // Scroll Spy: Highlight active category pill as user scrolls through sections
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const catId = entry.target.id;
            const filterKey = catId.replace('cat-', '');
            navPills.forEach(p => {
              if (p.dataset.filter === filterKey) {
                p.classList.add('active');
                // Scroll nav pill into view horizontally on mobile
                p.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
              } else {
                p.classList.remove('active');
              }
            });
          }
        });
      }, {
        rootMargin: '-20% 0px -70% 0px'
      });

      sections.forEach(s => observer.observe(s));
    }

    // Hero live filter across all categorized sections
    const heroInput = document.getElementById('heroSearchInput');
    if (heroInput) {
      heroInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        sections.forEach(sec => {
          let visibleCount = 0;
          const cards = sec.querySelectorAll('.tool-card');
          cards.forEach(card => {
            const title = (card.querySelector('h3')?.textContent || '').toLowerCase();
            const desc = (card.querySelector('p')?.textContent || '').toLowerCase();
            const tags = (card.dataset.tags || '').toLowerCase();
            const matches = !query || title.includes(query) || desc.includes(query) || tags.includes(query);
            card.style.display = matches ? '' : 'none';
            if (matches) visibleCount++;
          });
          sec.style.display = visibleCount > 0 ? '' : 'none';
        });
      });
    }
  }

  /* ───────── BACK TO TOP ───────── */
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ───────── FAQ ACCORDION ───────── */
  function initFAQ() {
    document.addEventListener('click', (e) => {
      const question = e.target.closest('.faq-question');
      if (!question) return;

      const item = question.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(i => {
        if (i !== item) i.classList.remove('open');
      });

      item.classList.toggle('open', !wasOpen);
    });
  }

  /* ───────── TOAST NOTIFICATION SYSTEM ───────── */
  window.showToast = function(message, type = 'success', duration = 3000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const icons = {
      success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>',
      error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
      warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = `slideOutRight var(--duration-normal) var(--ease-out) forwards`;
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };

  /* ───────── FILE SIZE FORMATTER ───────── */
  window.formatFileSize = function(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  /* ───────── DOWNLOAD HELPER ───────── */
  window.downloadFile = function(blob, filename) {
    if (!blob) return;
    let safeName = filename || 'download';
    if (!/\.[a-zA-Z0-9]+$/.test(safeName)) {
      const mime = (blob.type || '').toLowerCase();
      let ext = 'jpg';
      if (mime.includes('png')) ext = 'png';
      else if (mime.includes('webp')) ext = 'webp';
      else if (mime.includes('svg')) ext = 'svg';
      else if (mime.includes('gif')) ext = 'gif';
      else if (mime.includes('pdf')) ext = 'pdf';
      else if (mime.includes('zip')) ext = 'zip';
      else if (mime.includes('mp4')) ext = 'mp4';
      safeName += '.' + ext;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = safeName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Retain blob URL for 60s so Chromium does not discard download filename and fallback to raw UUID
    setTimeout(() => {
      try { URL.revokeObjectURL(url); } catch (e) {}
    }, 60000);
  };

  /* ───────── ANONYMOUS FEEDBACK SYSTEM ───────── */
  function initFeedbackSystem() {
    // 1. Inject Feedback Modal Backdrop if not already present
    if (!document.getElementById('feedbackModalBackdrop')) {
      const modalBackdrop = document.createElement('div');
      modalBackdrop.className = 'feedback-modal-backdrop';
      modalBackdrop.id = 'feedbackModalBackdrop';
      modalBackdrop.innerHTML = `
        <div class="feedback-modal-box">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-4);">
            <div>
              <span class="feedback-badge">🔒 100% Anonymous • No Login Required</span>
              <h3 style="font-size: 1.25rem; font-family: var(--font-heading); color: var(--navy); margin: 4px 0 0 0;">Community Feedback & Ideas</h3>
            </div>
            <button type="button" id="btnCloseFeedbackModal" style="background: none; border: none; font-size: 22px; cursor: pointer; color: var(--gray-500); padding: 4px 8px;" aria-label="Close modal">✕</button>
          </div>
          <p style="font-size: 13px; color: var(--gray-600); margin-bottom: 16px; line-height: 1.5;">
            Found an issue, need a specific SSC/UPSC exam format, or have an idea? Tell us directly without needing any Gmail or Google account.
          </p>
          <form id="modalFeedbackForm">
            <div class="form-group" style="margin-bottom: 12px; width: 100%;">
              <label class="form-label" for="modalFeedbackType">Feedback Type</label>
              <select id="modalFeedbackType" class="form-select" style="width: 100%;">
                <option value="🐞 Bug / Problem Report">🐞 Bug / Problem Report</option>
                <option value="💡 Request New Tool">💡 Request a New Tool or Exam Preset</option>
                <option value="⚡ Feature Improvement">⚡ Feature Improvement</option>
                <option value="💬 General Suggestion">💬 General Suggestion</option>
              </select>
            </div>
            <div class="form-group" style="margin-bottom: 12px; width: 100%;">
              <label class="form-label" for="modalFeedbackMsg">Message / Details *</label>
              <textarea id="modalFeedbackMsg" class="form-textarea" rows="4" placeholder="Explain the problem or tool you need... (e.g. Please add 20KB preset for Delhi Police)" style="width: 100%; min-height: 100px;" required></textarea>
            </div>
            <div class="form-group" style="margin-bottom: 16px; width: 100%;">
              <label class="form-label" for="modalFeedbackAuthor">Your Name / Telegram (Optional)</label>
              <input type="text" id="modalFeedbackAuthor" class="form-input" placeholder="Anonymous (Leave blank for total privacy)" style="width: 100%;">
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 8px;">
              <button type="button" id="btnCancelFeedbackModal" class="btn btn-outline">Cancel</button>
              <button type="submit" class="btn btn-primary">Submit Feedback</button>
            </div>
          </form>
        </div>
      `;
      document.body.appendChild(modalBackdrop);

      // Modal close events
      const closeModal = () => modalBackdrop.classList.remove('active');
      document.getElementById('btnCloseFeedbackModal').addEventListener('click', closeModal);
      document.getElementById('btnCancelFeedbackModal').addEventListener('click', closeModal);
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeModal();
      });
    }

    // 2. Open triggers
    document.querySelectorAll('.open-feedback-trigger').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const pageSection = document.getElementById('anonymousFeedbackSection');
        if (pageSection) {
          pageSection.scrollIntoView({ behavior: 'smooth' });
          const inp = pageSection.querySelector('textarea');
          if (inp) inp.focus();
        } else {
          ensureFeedbackModal();
          const backdrop = document.getElementById('feedbackModalBackdrop');
          if (backdrop) backdrop.classList.add('active');
        }
      });
    });

    // Helper: Save feedback payload
    function saveFeedback(type, message, author) {
      if (!message || message.trim().length < 4) {
        if (window.showToast) window.showToast('Please enter at least 4 characters of feedback.', 'warning');
        return false;
      }

      const stored = JSON.parse(localStorage.getItem('sarkari_user_feedback') || '[]');
      const newEntry = {
        id: 'FB-' + Date.now().toString().slice(-6),
        type: type,
        message: message.trim(),
        author: (author && author.trim()) ? author.trim() : 'Anonymous User',
        timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
      };

      stored.unshift(newEntry);
      localStorage.setItem('sarkari_user_feedback', JSON.stringify(stored));

      if (window.showToast) {
        window.showToast('Feedback submitted anonymously! Thank you.', 'success');
      }

      renderFeedbackHistory();
      return true;
    }

    // 3. Modal Form Submit
    const modalForm = document.getElementById('modalFeedbackForm');
    if (modalForm) {
      modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const type = document.getElementById('modalFeedbackType').value;
        const msg = document.getElementById('modalFeedbackMsg').value;
        const author = document.getElementById('modalFeedbackAuthor').value;

        if (saveFeedback(type, msg, author)) {
          modalForm.reset();
          document.getElementById('feedbackModalBackdrop').classList.remove('active');
        }
      });
    }

    // 4. On-page Form Submit (for index.html)
    const pageForm = document.getElementById('pageFeedbackForm');
    if (pageForm) {
      pageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const type = document.getElementById('pageFeedbackType').value;
        const msg = document.getElementById('pageFeedbackMsg').value;
        const author = document.getElementById('pageFeedbackAuthor').value;

        if (saveFeedback(type, msg, author)) {
          pageForm.reset();
        }
      });
    }

    // Render Recent Submissions History (if container exists on page)
    function renderFeedbackHistory() {
      const historyContainer = document.getElementById('feedbackHistoryList');
      if (!historyContainer) return;

      const stored = JSON.parse(localStorage.getItem('sarkari_user_feedback') || '[]');
      if (stored.length === 0) {
        historyContainer.innerHTML = '<p style="color: var(--gray-500); font-size: 13px; font-style: italic;">No feedback submitted in this session yet.</p>';
        return;
      }

      historyContainer.innerHTML = stored.slice(0, 5).map(item => `
        <div class="feedback-history-item">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <strong style="color: var(--navy);">${item.type}</strong>
            <span style="font-size: 11px; color: var(--gray-500);">${item.timestamp}</span>
          </div>
          <div style="color: var(--gray-800); margin-bottom: 4px;">${item.message.replace(/</g, '&lt;')}</div>
          <div style="font-size: 11px; color: var(--gray-500);">By: <strong>${item.author}</strong> <span style="color:#059669;">• Recorded Locally</span></div>
        </div>
      `).join('');
    }

    renderFeedbackHistory();
  }

  /* ───────── INITIALIZATION ───────── */
  function init() {
    // Check if running in embed mode (?embed=true) for viral backlink widgets
    if (window.location.search.includes('embed=true')) {
      document.documentElement.classList.add('is-embedded');
      document.body.style.background = 'transparent';
      document.body.style.padding = '10px';
      const hEl = document.getElementById('header-placeholder');
      const fEl = document.getElementById('footer-placeholder');
      const faqEl = document.querySelector('.faq-section');
      const relEl = document.querySelector('.related-tools');
      const heroEl = document.querySelector('.tool-hero, .hero-section');
      if (hEl) hEl.style.display = 'none';
      if (fEl) fEl.style.display = 'none';
      if (faqEl) faqEl.style.display = 'none';
      if (relEl) relEl.style.display = 'none';
      if (heroEl) heroEl.style.display = 'none';
      return;
    }

    // Inject header & footer if placeholders exist and not already rendered
    const headerEl = document.getElementById('header-placeholder');
    const footerEl = document.getElementById('footer-placeholder');
    
    if (headerEl && !document.getElementById('siteHeader')) headerEl.innerHTML = renderHeader();
    if (footerEl && !document.querySelector('.site-footer')) footerEl.innerHTML = renderFooter();

    // Theme toggle (sun/moon) — top right corner of header
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        const dark = document.body.classList.toggle('dark');
        document.documentElement.classList.toggle('dark', dark);
        try { localStorage.setItem('skt-theme', dark ? 'dark' : 'light'); } catch (e) { /* private mode */ }
      });
    }

    // Initialize all modules
    initHeaderScroll();
    initMobileMenu();
    initSearch();
    initCategoryFilter();
    initScrollReveal();
    initBackToTop();
    initFAQ();
    initFeedbackSystem();
    // Universal smooth scroll chaining & wheel trap prevention
    initScrollChaining();


    // Live Hero Tool Counter (always dynamically reflects total tools in catalog)
    const heroToolStat = document.getElementById('heroToolCount') || document.querySelector('.hero-stat:first-child .hero-stat-number');
    if (heroToolStat) {
      heroToolStat.textContent = `${TOOLS.length}+`;
    }

    // Initial tool grid render
    const grid = document.getElementById('toolsGrid');
    if (grid) {
      if (grid.children.length === 0) {
        renderToolsGrid('all');
      } else {
        grid.classList.add('visible');
      }
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  
  // ── Universal Smooth Scroll Chaining & Wheel Trap Prevention ──
  function initScrollChaining() {
    const hasStickyPanels = document.querySelector('.split-layout, .tool-split-output, .qr-preview-column, .preview-panel');
    if (!hasStickyPanels) return;
    window.addEventListener('wheel', function (e) {
      // 1. If active element is a number input, blur it so wheel doesn't get trapped changing values
      if (document.activeElement && document.activeElement.type === 'number') {
        document.activeElement.blur();
      }

      // 2. If scrolling over a sticky preview/output container or preview panel
      const stickyCol = e.target.closest && e.target.closest('.split-layout > :nth-child(2), .tool-split-output, .qr-preview-column, .preview-panel');
      if (stickyCol) {
        const isAtBottom = stickyCol.scrollTop + stickyCol.clientHeight >= stickyCol.scrollHeight - 2;
        const isAtTop = stickyCol.scrollTop <= 0;
        const cannotScroll = stickyCol.scrollHeight <= stickyCol.clientHeight;

        if (cannotScroll || (e.deltaY > 0 && isAtBottom) || (e.deltaY < 0 && isAtTop)) {
          window.scrollBy({ top: e.deltaY, left: 0, behavior: 'auto' });
        }
      }
    }, { passive: true });
  }

  // Expose TOOLS for other scripts
  window.SARKARI_TOOLS = TOOLS;
  window.SARKARI_CATEGORIES = CATEGORIES;


  /* ───────── VIRAL EMBED & SHARE WIDGET FOR OFF-PAGE BACKLINKS ───────── */
  function initEmbedWidget() {
    if (!window.location.pathname.includes('/tools/') || window.location.search.includes('embed=true')) return;

    const toolName = document.querySelector('h1')?.textContent?.trim() || document.title.split('-')[0]?.trim() || 'Tool';
    const currentUrl = window.location.href.split('?')[0];
    const embedUrl = currentUrl + '?embed=true';

    const embedHtml = `
      <!-- Floating Embed / Share Pill -->
      <div id="embedSharePill" style="position: fixed; bottom: 24px; left: 24px; z-index: 999; display: flex; align-items: center; gap: 8px;">
        <button id="btnOpenEmbedModal" type="button" style="display: flex; align-items: center; gap: 6px; background: var(--white, #ffffff); color: var(--navy, #0f172a); border: 1.5px solid var(--gray-300, #cbd5e1); border-radius: 999px; padding: 8px 14px; font-size: 12px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.08); transition: all 0.2s ease;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2.5"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
          <span>Embed / Share Tool</span>
        </button>
      </div>

      <!-- Embed Modal Backdrop -->
      <div id="embedModalBackdrop" style="display: none; position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); z-index: 9999; align-items: center; justify-content: center; padding: 16px; backdrop-filter: blur(2px);">
        <div style="background: var(--white, #ffffff); border-radius: 16px; max-width: 540px; width: 100%; padding: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); position: relative; border: 1px solid var(--gray-200, #e2e8f0);">
          <button id="btnCloseEmbedModal" style="position: absolute; top: 16px; right: 16px; background: transparent; border: none; font-size: 20px; color: var(--gray-400, #94a3b8); cursor: pointer; line-height: 1;">&times;</button>
          
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
            <div style="width: 36px; height: 36px; border-radius: 10px; background: #e0e7ff; color: #4f46e5; display: flex; align-items: center; justify-content: center; font-size: 18px;">🔗</div>
            <div>
              <h3 style="margin: 0; font-size: 17px; font-weight: 700; color: var(--navy, #0f172a);">Embed on Your Website</h3>
              <p style="margin: 2px 0 0; font-size: 12px; color: var(--gray-500, #64748b);">Add this free tool directly to your blog, school portal, or website</p>
            </div>
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--gray-500, #64748b); margin-bottom: 6px;">HTML Embed Code (With Free Attribution)</label>
            <textarea id="txtEmbedSnippet" readonly rows="4" style="width: 100%; font-family: monospace; font-size: 11px; padding: 10px; border: 1.5px solid var(--gray-200, #e2e8f0); border-radius: 8px; background: #f8fafc; color: #334155; resize: none; box-sizing: border-box;"></textarea>
          </div>

          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button id="btnCopyEmbedSnippet" type="button" class="btn btn-primary" style="font-size: 13px; padding: 8px 18px; display: flex; align-items: center; gap: 6px;">
              <span>📋</span> <span id="txtCopyLabel">Copy Embed Code</span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', embedHtml);

    const btnOpen = document.getElementById('btnOpenEmbedModal');
    const btnClose = document.getElementById('btnCloseEmbedModal');
    const backdrop = document.getElementById('embedModalBackdrop');
    const textarea = document.getElementById('txtEmbedSnippet');
    const btnCopy = document.getElementById('btnCopyEmbedSnippet');
    const copyLabel = document.getElementById('txtCopyLabel');

    const snippetText = `<iframe src="${embedUrl}" width="100%" height="600" frameborder="0" style="border:1px solid #e2e8f0;border-radius:12px;max-width:800px;"></iframe>\n<p style="font-size:11px;color:#64748b;font-family:sans-serif;margin-top:6px;">Powered by <a href="${currentUrl}" target="_blank" rel="noopener" style="color:#4f46e5;text-decoration:underline;">AllToolsInOne ${toolName}</a></p>`;

    if (textarea) textarea.value = snippetText;

    btnOpen?.addEventListener('click', () => {
      if (backdrop) backdrop.style.display = 'flex';
    });

    btnClose?.addEventListener('click', () => {
      if (backdrop) backdrop.style.display = 'none';
    });

    backdrop?.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.style.display = 'none';
    });

    btnCopy?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(snippetText);
        if (copyLabel) copyLabel.textContent = 'Copied to Clipboard!';
        setTimeout(() => { if (copyLabel) copyLabel.textContent = 'Copy Embed Code'; }, 2500);
      } catch (err) {
        if (textarea) {
          textarea.select();
          document.execCommand('copy');
          if (copyLabel) copyLabel.textContent = 'Copied to Clipboard!';
          setTimeout(() => { if (copyLabel) copyLabel.textContent = 'Copy Embed Code'; }, 2500);
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEmbedWidget);
  } else {
    initEmbedWidget();
  }


  /* ───────── AUTOMATIC CROSS-PROMOTION: RELATED TOOLS SECTION ───────── */
  function initRelatedToolsSection() {
    if (!window.location.pathname.includes('/tools/') || window.location.search.includes('embed=true')) return;
    if (document.getElementById('dynamicRelatedTools')) return;

    const currentPath = window.location.pathname;
    const currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1);

    // Find current tool
    const currentTool = TOOLS.find(t => t.url.endsWith(currentFile) || t.id === currentFile.replace('.html', ''));
    const currentCategory = currentTool ? currentTool.category : 'utilities';

    // Pick 4 related tools in same category or popular utilities
    let related = TOOLS.filter(t => !t.url.endsWith(currentFile) && t.category === currentCategory);
    if (related.length < 4) {
      const others = TOOLS.filter(t => !t.url.endsWith(currentFile) && t.category !== currentCategory);
      related = related.concat(others);
    }
    related = related.slice(0, 4);

    if (related.length === 0) return;

    const cardsHtml = related.map(tool => {
      const cleanUrl = tool.url.startsWith('../') ? tool.url : (tool.url.startsWith('tools/') ? tool.url.replace('tools/', '') : tool.url);
      return `
        <a href="${cleanUrl}" class="related-tool-card" style="display: flex; flex-direction: column; padding: 18px; background: var(--white, #ffffff); border: 1px solid var(--gray-200, #e2e8f0); border-radius: 14px; text-decoration: none; color: inherit; transition: all 0.2s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
            <div style="font-size: 24px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: #f1f5f9; border-radius: 10px;">${tool.icon || '🛠️'}</div>
            <div style="font-size: 14px; font-weight: 700; color: var(--navy, #0f172a); line-height: 1.3;">${tool.name}</div>
          </div>
          <p style="font-size: 12px; color: var(--gray-500, #64748b); margin: 0; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${tool.description}</p>
          <div style="margin-top: 12px; font-size: 11px; font-weight: 600; color: #4f46e5; display: flex; align-items: center; gap: 4px;">
            <span>Open Tool</span> <span>&rarr;</span>
          </div>
        </a>
      `;
    }).join('');

    const sectionHtml = `
      <!-- Related Tools Cross-Promotion Section -->
      <section id="dynamicRelatedTools" class="related-tools-section" style="margin-top: 48px; margin-bottom: 32px; padding-top: 32px; border-top: 1px solid var(--gray-200, #e2e8f0);">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="font-size: 20px; font-weight: 700; color: var(--navy, #0f172a); margin: 0; display: flex; align-items: center; gap: 8px;">
              <span>⚡</span> <span>Related &amp; Popular Utilities</span>
            </h3>
            <p style="font-size: 13px; color: var(--gray-500, #64748b); margin: 4px 0 0;">Users working with this utility also frequently use these tools</p>
          </div>
          <a href="../tools.html" style="font-size: 13px; font-weight: 600; color: #4f46e5; text-decoration: none; display: flex; align-items: center; gap: 4px;">
            <span>Explore all 73+ tools</span> <span>&rarr;</span>
          </a>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
          ${cardsHtml}
        </div>
      </section>
    `;

    // Inject before FAQ section or before footer
    const faqSection = document.querySelector('.faq-section');
    const footerEl = document.getElementById('footer-placeholder');
    if (faqSection) {
      faqSection.insertAdjacentHTML('beforebegin', sectionHtml);
    } else if (footerEl) {
      footerEl.insertAdjacentHTML('beforebegin', sectionHtml);
    } else {
      document.body.insertAdjacentHTML('beforeend', sectionHtml);
    }
  }


  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRelatedToolsSection);
  } else {
    initRelatedToolsSection();
  }

})();
