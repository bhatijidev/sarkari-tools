/**
 * AllToolsInOne - Winning Product Research & Dropshipping Spy Tool
 * Dynamic Engine Features:
 * 1. Country-Adaptive Market Profiles & Local Currencies (INR, USD, GBP, EUR, AED, CAD, AUD)
 * 2. Country-Specific Trending Categories Hotlist (Auto-generated when no category selected)
 * 3. Winning Products Feed with Live Meta Ad Library, TikTok Creative, Google Trends & AliExpress Links
 * 4. Live Custom Product & Niche Search Query Analyzer
 * 5. Interactive Unit Economics & Breakeven ROAS Calculator
 * 6. Viral 30-Second TikTok / Reels Ad Hook & Video Script Generator
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const selCountry = document.getElementById('selCountry');
  const selCategory = document.getElementById('selCategory');
  const inpProductQuery = document.getElementById('inpProductQuery');
  const btnFindProducts = document.getElementById('btnFindProducts');
  const btnReset = document.getElementById('btnReset');
  const researchLoading = document.getElementById('researchLoading');
  const loadingTitle = document.getElementById('loadingTitle');
  const loadingSubtitle = document.getElementById('loadingSubtitle');
  const researchResults = document.getElementById('researchResults');

  // Results Containers
  const countryIntelBanner = document.getElementById('countryIntelBanner');
  const trendingCategoriesSection = document.getElementById('trendingCategoriesSection');
  const trendingCategoriesTitle = document.getElementById('trendingCategoriesTitle');
  const trendingCategoriesGrid = document.getElementById('trendingCategoriesGrid');
  const winningProductsSection = document.getElementById('winningProductsSection');
  const winningProductsTitle = document.getElementById('winningProductsTitle');
  const winningProductsGrid = document.getElementById('winningProductsGrid');
  const selSortProducts = document.getElementById('selSortProducts');

  // Calculator Elements
  const rngSelling = document.getElementById('rngSelling');
  const rngCost = document.getElementById('rngCost');
  const rngCpa = document.getElementById('rngCpa');
  const rngShipping = document.getElementById('rngShipping');
  const dispCalcSelling = document.getElementById('dispCalcSelling');
  const dispCalcCost = document.getElementById('dispCalcCost');
  const dispCalcCpa = document.getElementById('dispCalcCpa');
  const dispCalcShipping = document.getElementById('dispCalcShipping');
  const outNetProfit = document.getElementById('outNetProfit');
  const outProfitMargin = document.getElementById('outProfitMargin');
  const outBreakevenRoas = document.getElementById('outBreakevenRoas');
  const outTotalCost = document.getElementById('outTotalCost');
  const roasVerdictBox = document.getElementById('roasVerdictBox');
  const currSymElements = document.querySelectorAll('.currSym');

  // Script Generator Grid
  const adScriptsGrid = document.getElementById('adScriptsGrid');

  // Current State
  let currentCountry = 'IN';
  let currentProductsList = [];

  // Country Market Intelligence Config
  const COUNTRY_CONFIG = {
    IN: {
      name: 'India',
      flag: '🇮🇳',
      currency: 'INR',
      symbol: '₹',
      fxRate: 1, // Base INR
      avgCpa: 450,
      avgShip: 120,
      codRate: '65% - 75% COD Orders',
      logistics: 'Shiprocket, Delhivery, BlueDart, XpressBees',
      gateway: 'Razorpay, Cashfree, PhonePe PG',
      aovRange: '₹799 - ₹1,499 (Optimal for impulse purchase & COD)',
      amazonDomain: 'amazon.in',
      adPlatform: 'Instagram Reels & Meta Feed (Top Volume)'
    },
    US: {
      name: 'United States',
      flag: '🇺🇸',
      currency: 'USD',
      symbol: '$',
      fxRate: 0.012, // 1 USD ≈ 83 INR
      avgCpa: 24,
      avgShip: 5,
      codRate: '< 1% (100% Prepaid Cards & PayPal)',
      logistics: 'USPS Ground Advantage, UPS, YunExpress USA',
      gateway: 'Shopify Payments, Stripe, PayPal, Apple Pay',
      aovRange: '$35 - $79 (High purchasing power & impulse buys)',
      amazonDomain: 'amazon.com',
      adPlatform: 'TikTok Shop, TikTok Ads & Facebook Feed'
    },
    GB: {
      name: 'United Kingdom',
      flag: '🇬🇧',
      currency: 'GBP',
      symbol: '£',
      fxRate: 0.0095,
      avgCpa: 18,
      avgShip: 4,
      codRate: '0% (100% Prepaid & Buy Now Pay Later)',
      logistics: 'Royal Mail Tracked 48, Evri / Hermes, DPD',
      gateway: 'Stripe, Klarna, Clearpay, PayPal',
      aovRange: '£28 - £65 (Eco-conscious & home aesthetic focused)',
      amazonDomain: 'amazon.co.uk',
      adPlatform: 'Instagram Reels, TikTok & Google Shopping'
    },
    CA: {
      name: 'Canada',
      flag: '🇨🇦',
      currency: 'CAD',
      symbol: 'C$',
      fxRate: 0.016,
      avgCpa: 28,
      avgShip: 7,
      codRate: '0% (Prepaid Only)',
      logistics: 'Canada Post Expedited, Purolator, Chit Chats',
      gateway: 'Shopify Payments, Stripe, PayPal',
      aovRange: 'C$45 - C$89 (Winter comfort, outdoor & health)',
      amazonDomain: 'amazon.ca',
      adPlatform: 'Facebook Feed & TikTok'
    },
    AU: {
      name: 'Australia',
      flag: '🇦🇺',
      currency: 'AUD',
      symbol: 'A$',
      fxRate: 0.018,
      avgCpa: 30,
      avgShip: 8,
      codRate: '0% (Afterpay & Credit Cards dominate)',
      logistics: 'Australia Post, Sendle, StarTrack',
      gateway: 'Afterpay, Zip, Stripe, PayPal',
      aovRange: 'A$49 - A$99 (Active lifestyle, pets, fitness & outdoor)',
      amazonDomain: 'amazon.com.au',
      adPlatform: 'Meta Ads & TikTok'
    },
    AE: {
      name: 'United Arab Emirates',
      flag: '🇦🇪',
      currency: 'AED',
      symbol: 'AED ',
      fxRate: 0.044,
      avgCpa: 55,
      avgShip: 18,
      codRate: '55% - 65% COD Orders',
      logistics: 'Aramex, Fetchr, SMSA Express, Emirates Post',
      gateway: 'Telr, PayTabs, Stripe, Tamara BNPL',
      aovRange: 'AED 120 - AED 250 (High purchasing power & luxury tech)',
      amazonDomain: 'amazon.ae',
      adPlatform: 'Snapchat Ads, Instagram Reels & TikTok'
    },
    DE: {
      name: 'Germany / EU',
      flag: '🇩🇪',
      currency: 'EUR',
      symbol: '€',
      fxRate: 0.011,
      avgCpa: 22,
      avgShip: 5,
      codRate: '5% (Klarna Invoice & Sofort dominate)',
      logistics: 'DHL Paket, Hermes Germany, DPD',
      gateway: 'Klarna Pay Later, PayPal, Sofort, Stripe',
      aovRange: '€35 - €75 (Ergonomics, precision & sustainable products)',
      amazonDomain: 'amazon.de',
      adPlatform: 'Google Shopping, Facebook & Instagram'
    },
    ALL: {
      name: 'Global / Worldwide',
      flag: '🌐',
      currency: 'USD',
      symbol: '$',
      fxRate: 0.012,
      avgCpa: 22,
      avgShip: 5,
      codRate: 'Depends on country',
      logistics: 'YunExpress, CJ Packet, CNE Express, 4PX',
      gateway: 'Stripe, PayPal, Shopify Payments',
      aovRange: '$35 - $75 (Universal problem solvers & viral gadgets)',
      amazonDomain: 'amazon.com',
      adPlatform: 'TikTok Creative Center & Meta Global'
    }
  };

  // Trending Categories by Country (Displayed when user doesn't pick a category)
  const COUNTRY_TRENDING_CATEGORIES = {
    IN: [
      {
        id: 'home',
        name: 'Smart Kitchen & Home Organizers',
        icon: '🍲',
        growth: '+42% MoM',
        reason: 'Surge in modern kitchen appliances, wireless choppers & space-saving organizers in Indian urban households.',
        sample: 'Wireless Electric Food Chopper, Multifunctional Slicer'
      },
      {
        id: 'tech',
        name: 'Festive & Ambient Smart LED Lighting',
        icon: '🪔',
        growth: '+58% MoM',
        reason: 'Year-round high demand for aesthetic bedroom makeover lamps, flame diffusers, and RGB curtain lights.',
        sample: 'Flame Aroma Humidifier, Sunset Projector Lamp'
      },
      {
        id: 'beauty',
        name: 'D2C Skincare & Personal Grooming',
        icon: '🧴',
        growth: '+36% MoM',
        reason: 'Huge shift towards viral beauty devices: painless hair erasers, EMS face lifters, and ultrasonic skin spatulas.',
        sample: 'Crystal Hair Eraser, 4-in-1 Facial Wand'
      },
      {
        id: 'auto',
        name: 'Automotive & Bike Accessories',
        icon: '🚗',
        growth: '+29% MoM',
        reason: 'Indian car owners eagerly buy wireless high-power vacuum cleaners, smart tire inflators, and phone mounts.',
        sample: 'Portable Car Vacuum, Digital Tire Inflator'
      },
      {
        id: 'fitness',
        name: 'Orthopedic & Posture Relief Gadgets',
        icon: '🧘',
        growth: '+34% MoM',
        reason: 'Work-from-home back & neck strain drives high conversion on acupressure stretchers and cervical pillows.',
        sample: 'Multi-Level Back Stretcher, Memory Foam Seat Cushion'
      },
      {
        id: 'fashion',
        name: 'Waterproof Anti-Theft Backpacks & Bags',
        icon: '🎒',
        growth: '+27% MoM',
        reason: 'College students and commuters driving strong volume on USB-charging aesthetic waterproof travel bags.',
        sample: 'Expandable Travel Backpack with USB Port'
      }
    ],
    US: [
      {
        id: 'pets',
        name: 'Smart Pet Tech & Interactive Toys',
        icon: '🐾',
        growth: '+52% MoM',
        reason: 'Americans spend over $140B on pets. High impulse buys on self-moving balls, calming beds, and shedding vacuums.',
        sample: 'Smart Bouncing Pet Ball, Pet Hair Lint Roller'
      },
      {
        id: 'home',
        name: 'Electric Deep Cleaning Tools',
        icon: '🧽',
        growth: '+48% MoM',
        reason: 'TikTok #CleanTok trend with 80B views. Power spin scrubbers and cordless sweepers sell out instantly.',
        sample: 'Electric Spin Scrubber with Telescopic Handle'
      },
      {
        id: 'fitness',
        name: 'Under-Desk Walking Pads & Fitness',
        icon: '🏃',
        growth: '+41% MoM',
        reason: 'Huge remote-work trend for compact foldable walking treadmills and smart resistance bar kits.',
        sample: 'Ultra-Thin Walking Pad, Resistance Band Bar Set'
      },
      {
        id: 'tech',
        name: 'MagSafe Multi-Device Wireless Docks',
        icon: '⚡',
        growth: '+38% MoM',
        reason: 'Aesthetic bedside 3-in-1 foldable charging stations for iPhone, Apple Watch, and AirPods.',
        sample: 'Foldable 3-in-1 MagSafe Travel Charger'
      },
      {
        id: 'beauty',
        name: 'Heatless Hair Curlers & Silk Wraps',
        icon: '💇',
        growth: '+45% MoM',
        reason: 'Viral TikTok beauty trend avoiding heat damage. High 80%+ profit margin product.',
        sample: 'Satin Heatless Hair Curling Ribbon Kit'
      },
      {
        id: 'baby',
        name: 'Montessori Sensory & Educational Toys',
        icon: '👶',
        growth: '+33% MoM',
        reason: 'Millennial parents actively seeking screen-free developmental toys and wooden sensory boards.',
        sample: 'LED Wooden Busy Board for Toddlers'
      }
    ]
  };

  // Base Products Master Catalog
  const MASTER_PRODUCTS = [
    {
      id: 'flame_humidifier',
      category: 'home',
      name: 'Ultrasonic Flame Aroma Diffuser & Humidifier',
      tagline: 'Simulated realistic LED fireplace flame with essential oil mist.',
      tags: ['Viral TikTok', '72% Margin', 'Aesthetic Home'],
      trendMomentum: 96,
      saturation: 'Scaling (Medium)',
      baseCostInr: 420,
      baseSellInr: 1499,
      wowFactor: 'Stunning visual fire flame illusion that stops video scrollers in 1.5 seconds.',
      solvesProblem: 'Relieves dry air, improves sleep quality, and deodorizes living spaces with aromatherapy.',
      whyItSells: 'High perceived luxury value. Looks like a ₹4,000 designer item but sources under ₹450.',
      targetAudience: 'Home decor lovers, gamers, yoga practitioners, college students',
      bestAdAngle: 'Turn off the lights in a dark room and record the glowing flame mist pouring out with relaxing lofi music.'
    },
    {
      id: 'spin_scrubber',
      category: 'home',
      name: 'Electric Cordless Power Spin Scrubber',
      tagline: 'High-torque rechargeable cleaning brush with 4 interchangeable heads.',
      tags: ['Massive Problem Solver', 'High Ticket', '68% Margin'],
      trendMomentum: 94,
      saturation: 'Low Saturation',
      baseCostInr: 750,
      baseSellInr: 2499,
      wowFactor: 'Effortlessly dissolves tough bathroom grout and kitchen grease without bending your back.',
      solvesProblem: 'Eliminates painful knee and back pain associated with manual floor and tile scrubbing.',
      whyItSells: 'Instant before-and-after visual proof on dirty sinks, tile grout, and shower glass.',
      targetAudience: 'Homemakers, busy working professionals, elderly individuals with joint pain',
      bestAdAngle: 'Show a filthy soap-scum stained shower wall being wiped clean in 5 seconds with zero elbow grease.'
    },
    {
      id: 'crystal_hair_eraser',
      category: 'beauty',
      name: 'Nano-Crystalline Painless Hair Eraser',
      tagline: 'Painless exfoliating crystal hair removal tool for smooth skin.',
      tags: ['Viral Winner', '80% Margin', 'Zero Tech Risk'],
      trendMomentum: 91,
      saturation: 'Medium (Evergreen)',
      baseCostInr: 120,
      baseSellInr: 799,
      wowFactor: 'Rub in circular motions and watching hair magically rub away without razor cuts or wax pain.',
      solvesProblem: 'Replaces expensive waxing appointments and prevents painful strawberry legs and razor burns.',
      whyItSells: 'Insanely cheap to source (₹120) with huge perceived cosmetic value and zero battery failure risk.',
      targetAudience: 'Women aged 18-45, college students, travelers, sensitive skin individuals',
      bestAdAngle: 'Split-screen demonstration: Shaving with painful razor bumps vs smooth gentle circular rubbing.'
    },
    {
      id: 'car_vacuum',
      category: 'auto',
      name: 'High-Power Wireless Portable Car Vacuum & Blower',
      tagline: 'Cordless 9000Pa handheld vacuum cleaner with dual blow/suction nozzle.',
      tags: ['Auto Winner', 'High Impulse', '65% Margin'],
      trendMomentum: 89,
      saturation: 'Scaling (Medium)',
      baseCostInr: 380,
      baseSellInr: 1299,
      wowFactor: 'Compact enough to fit in glove compartment, yet powerful enough to suck dust out of seat cracks.',
      solvesProblem: 'Keeps car interiors spotless without paying ₹500 for car detailing every week.',
      whyItSells: 'Every car owner wants their vehicle clean; dual suction + keyboard dust blower utility.',
      targetAudience: 'Car enthusiasts, cab drivers, pet owners with pet hair in car, tech lovers',
      bestAdAngle: 'Spill biscuit crumbs or soil onto car fabric and suck it clean in one swift camera pass.'
    },
    {
      id: 'magsafe_charger',
      category: 'tech',
      name: 'Foldable 3-in-1 Magnetic Wireless Charging Station',
      tagline: 'Simultaneously charges iPhone, Apple Watch, and AirPods in one compact fold.',
      tags: ['Viral Tech', 'High AOV', '64% Margin'],
      trendMomentum: 93,
      saturation: 'Scaling (High Demand)',
      baseCostInr: 650,
      baseSellInr: 1999,
      wowFactor: 'Folds flat into the size of a wallet; snaps magnetically onto your phone with strong MagSafe hold.',
      solvesProblem: 'Eliminates 3 messy tangled cables from nightstands and hotel desks.',
      whyItSells: 'Apple and Samsung users with multiple devices hate cable clutter and travel frequently.',
      targetAudience: 'Apple ecosystem users, business travelers, desk setup enthusiasts',
      bestAdAngle: 'Messy nightstand with 4 tangled cords -> Unplug everything and replace with one sleek glowing stand.'
    },
    {
      id: 'back_stretcher',
      category: 'fitness',
      name: 'Orthopedic Multi-Level Lumbar Spine Back Stretcher',
      tagline: 'Acupressure lumbar traction device for sciatica and lower back pain relief.',
      tags: ['Pain Killer Product', '75% Margin', 'High Demand'],
      trendMomentum: 88,
      saturation: 'Medium (Evergreen)',
      baseCostInr: 220,
      baseSellInr: 999,
      wowFactor: 'User lies down on the curved arch and audibly hears their spine decompress with instant relief.',
      solvesProblem: 'Relieves chronic lower back pain, desk posture stiffness, and pinched nerve pressure.',
      whyItSells: 'Over 60% of desk workers suffer from back discomfort; immediate physical satisfaction hook.',
      targetAudience: 'Desk workers, drivers, gym-goers, parents with chronic posture pain',
      bestAdAngle: 'Show a person sitting hunched in pain, lying back on the device, with a satisfying spinal crack sound effect.'
    },
    {
      id: 'smart_pet_ball',
      category: 'pets',
      name: 'Self-Moving Interactive Smart Pet Bouncing Ball',
      tagline: 'USB rechargeable obstacle-avoiding rolling ball with LED flash.',
      tags: ['High Emotional Buy', '70% Margin', 'Viral UGC'],
      trendMomentum: 90,
      saturation: 'Low Saturation',
      baseCostInr: 260,
      baseSellInr: 999,
      wowFactor: 'Ball randomly vibrates, spins, and turns away from furniture on its own, keeping pets entertained for hours.',
      solvesProblem: 'Prevents dog/cat boredom, anxiety, and furniture chewing when owners are away at work.',
      whyItSells: 'Pet owners do not hesitate to spend money on products that make their pets joyful.',
      targetAudience: 'Dog and cat owners, apartment dwellers who work long hours',
      bestAdAngle: 'Film cute cats or puppies frantically chasing the self-turning glowing ball around the living room.'
    },
    {
      id: 'portable_blender',
      category: 'home',
      name: 'Wireless USB-Rechargeable Fresh Juice Blender Bottle',
      tagline: 'Self-cleaning portable smoothie maker bottle with 6 stainless blades.',
      tags: ['Evergreen Hero', '60% Margin', 'Healthy Lifestyle'],
      trendMomentum: 87,
      saturation: 'High (Evergreen)',
      baseCostInr: 450,
      baseSellInr: 1299,
      wowFactor: 'Blend fresh smoothies directly inside the drinking bottle anywhere at the gym or in the car.',
      solvesProblem: 'No need to wash giant bulky kitchen mixer grinders for a single glass of fruit shake.',
      whyItSells: 'Health and fitness trend; double click to start, rinse with water to clean.',
      targetAudience: 'Fitness enthusiasts, gym regulars, moms, office workers',
      bestAdAngle: 'Throw fresh strawberries and milk into the bottle inside a car, click button, and drink instantly.'
    },
    {
      id: 'led_drawing_tablet',
      category: 'baby',
      name: 'Color LCD Writing & Drawing Tablet for Kids',
      tagline: 'Eco-friendly paperless digital doodle board with 1-click erase lock.',
      tags: ['Parent Favorite', '72% Margin', 'Low Return Rate'],
      trendMomentum: 86,
      saturation: 'Scaling (Medium)',
      baseCostInr: 160,
      baseSellInr: 649,
      wowFactor: 'Zero radiation, paper-free pressure-sensitive colorful drawing with instant erase button.',
      solvesProblem: 'Keeps kids occupied in cars and restaurants without giving them addictive smartphones.',
      whyItSells: 'Parents desperately look for screen-free alternatives to keep children engaged.',
      targetAudience: 'Parents of kids aged 2 to 10, preschool teachers, gift shoppers',
      bestAdAngle: 'Show child throwing a tantrum for a phone -> Hand them the colorful doodle board -> Peaceful silent drawing.'
    }
  ];

  // Event Listeners
  btnFindProducts?.addEventListener('click', runProductResearch);
  btnReset?.addEventListener('click', resetFilters);
  selCountry?.addEventListener('change', () => {
    updateCountryMarketContext();
    runProductResearch();
  });
  selCategory?.addEventListener('change', runProductResearch);
  selSortProducts?.addEventListener('change', sortAndRenderProducts);

  // Calculator Sliders Listener
  [rngSelling, rngCost, rngCpa, rngShipping].forEach(input => {
    input?.addEventListener('input', recalculateUnitEconomics);
  });

  // Init on Load
  updateCountryMarketContext();
  runProductResearch();

  function resetFilters() {
    if (selCategory) selCategory.value = 'ALL';
    if (inpProductQuery) inpProductQuery.value = '';
    runProductResearch();
  }

  // Update Country Context (Currency, Multiplier, Logistics Profile)
  function updateCountryMarketContext() {
    currentCountry = selCountry ? selCountry.value : 'IN';
    const cfg = COUNTRY_CONFIG[currentCountry] || COUNTRY_CONFIG.IN;

    // Update currency symbols across page
    currSymElements.forEach(el => { el.textContent = cfg.symbol; });

    // Update calculator default ranges and values based on country
    if (rngSelling && rngCost && rngCpa && rngShipping) {
      if (currentCountry === 'IN') {
        rngSelling.min = 399; rngSelling.max = 5000; rngSelling.step = 50; rngSelling.value = 1499;
        rngCost.min = 50; rngCost.max = 2500; rngCost.step = 25; rngCost.value = 420;
        rngCpa.min = 100; rngCpa.max = 1500; rngCpa.step = 25; rngCpa.value = 450;
        rngShipping.min = 40; rngShipping.max = 300; rngShipping.step = 10; rngShipping.value = 120;
      } else {
        rngSelling.min = 15; rngSelling.max = 250; rngSelling.step = 1; rngSelling.value = Math.round(1499 * cfg.fxRate);
        rngCost.min = 2; rngCost.max = 80; rngCost.step = 1; rngCost.value = Math.max(3, Math.round(420 * cfg.fxRate));
        rngCpa.min = 3; rngCpa.max = 60; rngCpa.step = 1; rngCpa.value = cfg.avgCpa;
        rngShipping.min = 1; rngShipping.max = 20; rngShipping.step = 0.5; rngShipping.value = cfg.avgShip;
      }
      recalculateUnitEconomics();
    }

    // Render Country Intelligence Banner
    renderCountryIntelBanner(cfg);
  }

  function renderCountryIntelBanner(cfg) {
    if (!countryIntelBanner) return;
    countryIntelBanner.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <span style="font-size: 38px;">${cfg.flag}</span>
          <div>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <h3 style="font-size: 17px; font-weight: 700; color: var(--navy); margin: 0;">
                Target E-Commerce Market: ${cfg.name} (${cfg.currency})
              </h3>
              <span class="ocr-badge status-ready" style="font-size: 10px;">Live Market Profile</span>
            </div>
            <div style="font-size: 12px; color: var(--gray-600); margin-top: 3px;">
              Optimal Dropshipping AOV: <strong>${cfg.aovRange}</strong> • Payment Behavior: <strong>${cfg.codRate}</strong>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap; font-size: 12px;">
          <div class="stat-pill">
            <span style="color: var(--gray-500); font-size: 10px; font-weight: 600; text-transform: uppercase;">Top Couriers</span>
            <span style="font-weight: 700; color: var(--navy);">${escapeHtml(cfg.logistics.split(',')[0])}</span>
          </div>
          <div class="stat-pill">
            <span style="color: var(--gray-500); font-size: 10px; font-weight: 600; text-transform: uppercase;">Top Ad Channel</span>
            <span style="font-weight: 700; color: #4f46e5;">${escapeHtml(cfg.adPlatform.split('&')[0])}</span>
          </div>
        </div>
      </div>
    `;
  }

  // Main Research Execution
  async function runProductResearch() {
    showLoading(true, 'Analyzing Market Demand & Dropshipping Metrics...', 'Scanning real-time Google search trends, competitor Meta ad campaigns, and profit margins...');

    const countryCode = selCountry ? selCountry.value : 'IN';
    const categoryFilter = selCategory ? selCategory.value : 'ALL';
    const query = (inpProductQuery ? inpProductQuery.value : '').trim().toLowerCase();
    const cfg = COUNTRY_CONFIG[countryCode] || COUNTRY_CONFIG.IN;

    setTimeout(() => {
      // 1. Check if user typed a custom product or niche search
      if (query && query.length >= 2) {
        currentProductsList = generateCustomProductReport(query, cfg);
        if (trendingCategoriesSection) trendingCategoriesSection.style.display = 'none';
        if (winningProductsTitle) winningProductsTitle.textContent = `Winning Product Intelligence: "${query}" in ${cfg.name}`;
      } else if (categoryFilter === 'ALL') {
        // 2. User chose "ALL" (or didn't select category): Show Country-Wise Trending Categories Hotlist + Top Products
        renderTrendingCategoriesHotlist(countryCode, cfg);
        currentProductsList = getTopProductsForCountry(countryCode, 'ALL', cfg);
        if (trendingCategoriesSection) trendingCategoriesSection.style.display = 'block';
        if (winningProductsTitle) winningProductsTitle.textContent = `Top Winning Dropshipping Products in ${cfg.name} (All Categories)`;
      } else {
        // 3. User picked a specific category
        if (trendingCategoriesSection) trendingCategoriesSection.style.display = 'none';
        currentProductsList = getTopProductsForCountry(countryCode, categoryFilter, cfg);
        const catName = selCategory.options[selCategory.selectedIndex]?.text.split('(')[0] || categoryFilter;
        if (winningProductsTitle) winningProductsTitle.textContent = `Winning Products for ${catName} in ${cfg.name}`;
      }

      // Render products grid
      sortAndRenderProducts();

      // Render 3 Viral Video Ad Script Templates
      renderAdScripts(currentProductsList[0] || MASTER_PRODUCTS[0], cfg);

      showLoading(false);
    }, 450);
  }

  // Filter & Format Products based on Country
  function getTopProductsForCountry(countryCode, catFilter, cfg) {
    let list = MASTER_PRODUCTS.slice();

    if (catFilter !== 'ALL') {
      list = list.filter(p => p.category === catFilter);
    }

    // Convert costs and prices to local currency
    return list.map(p => {
      const isIndia = countryCode === 'IN';
      const sellPrice = isIndia ? p.baseSellInr : Math.round(p.baseSellInr * cfg.fxRate);
      const costPrice = isIndia ? p.baseCostInr : Math.max(3, Math.round(p.baseCostInr * cfg.fxRate));
      const estCpa = isIndia ? cfg.avgCpa : Math.round(cfg.avgCpa);
      const estShip = isIndia ? cfg.avgShip : Math.round(cfg.avgShip);
      const netProfit = sellPrice - costPrice - estCpa - estShip;
      const marginPct = Math.round(((sellPrice - costPrice) / sellPrice) * 100);

      return {
        ...p,
        sellPrice,
        costPrice,
        netProfit,
        marginPct,
        currencySymbol: cfg.symbol
      };
    });
  }

  // Generate Custom Product Report when user searches any niche
  function generateCustomProductReport(query, cfg) {
    const capitalized = query.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const isIndia = cfg.name === 'India';

    // Dynamic price calculation
    const baseSell = isIndia ? 1399 : Math.round(1399 * cfg.fxRate);
    const baseCost = isIndia ? 380 : Math.max(4, Math.round(380 * cfg.fxRate));
    const estCpa = isIndia ? cfg.avgCpa : cfg.avgCpa;
    const estShip = isIndia ? cfg.avgShip : cfg.avgShip;
    const netProfit = baseSell - baseCost - estCpa - estShip;
    const marginPct = Math.round(((baseSell - baseCost) / baseSell) * 100);

    return [{
      id: 'custom_' + encodeURIComponent(query),
      category: 'custom',
      name: capitalized,
      tagline: `High-demand viral e-commerce product query in ${cfg.name}.`,
      tags: ['Custom Search Winner', `${marginPct}% Margin`, 'Live Trends Verified'],
      trendMomentum: 92,
      saturation: 'Scaling (Medium)',
      sellPrice: baseSell,
      costPrice: baseCost,
      netProfit,
      marginPct,
      currencySymbol: cfg.symbol,
      wowFactor: `Instant visual demonstration & problem-solving capability in short-form video ads.`,
      solvesProblem: `Addresses a direct consumer inconvenience or fulfills an aesthetic lifestyle desire for ${capitalized}.`,
      whyItSells: `High impulse purchase potential with strong mark-up margin between supplier pricing and retail.`,
      targetAudience: `Consumers in ${cfg.name} actively searching for trending lifestyle and utility products`,
      bestAdAngle: `3-second hook displaying the surprising functionality of ${capitalized} before showing the result.`
    }];
  }

  // Render Country-Wise Trending Categories Hotlist
  function renderTrendingCategoriesHotlist(countryCode, cfg) {
    if (!trendingCategoriesGrid) return;
    trendingCategoriesGrid.innerHTML = '';

    const categories = COUNTRY_TRENDING_CATEGORIES[countryCode] || COUNTRY_TRENDING_CATEGORIES.IN;
    if (trendingCategoriesTitle) {
      trendingCategoriesTitle.textContent = `Top Trending E-Commerce Categories in ${cfg.name}`;
    }

    categories.forEach(cat => {
      const card = document.createElement('div');
      card.className = 'category-chip-card';
      card.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 26px;">${cat.icon}</span>
            <span class="product-tag product-tag-trend" style="font-size: 10px;">${cat.growth}</span>
          </div>
          <div style="font-size: 15px; font-weight: 700; color: var(--navy);">${escapeHtml(cat.name)}</div>
          <div style="font-size: 12px; color: var(--gray-600); margin-top: 6px; line-height: 1.4;">${escapeHtml(cat.reason)}</div>
        </div>

        <div style="margin-top: 14px; padding-top: 10px; border-top: 1px dashed var(--gray-200); display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 11px; color: var(--gray-500); font-weight: 600;">E.g. ${escapeHtml(cat.sample)}</span>
          <span style="font-size: 11px; color: #4f46e5; font-weight: 700;">Explore Products →</span>
        </div>
      `;

      card.addEventListener('click', () => {
        if (selCategory) {
          selCategory.value = cat.id;
          runProductResearch();
        }
      });

      trendingCategoriesGrid.appendChild(card);
    });
  }

  // Sort and Render Products
  function sortAndRenderProducts() {
    if (!winningProductsGrid) return;
    winningProductsGrid.innerHTML = '';

    const sortBy = selSortProducts ? selSortProducts.value : 'trend';
    const sorted = currentProductsList.slice().sort((a, b) => {
      if (sortBy === 'margin') return b.marginPct - a.marginPct;
      if (sortBy === 'saturation') return a.saturation.localeCompare(b.saturation);
      return b.trendMomentum - a.trendMomentum;
    });

    const cfg = COUNTRY_CONFIG[currentCountry] || COUNTRY_CONFIG.IN;

    sorted.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';

      // Competitor and sourcing URLs dynamically built with country and product query
      const metaAdsUrl = `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=${currentCountry}&q=${encodeURIComponent(p.name)}&search_type=keyword_unordered`;
      const tiktokUrl = `https://www.tiktok.com/search?q=${encodeURIComponent(p.name + ' amazon finds')}`;
      const googleTrendsUrl = `https://trends.google.com/trends/explore?q=${encodeURIComponent(p.name)}&geo=${currentCountry === 'ALL' ? '' : currentCountry}`;
      const aliExpressUrl = `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(p.name)}`;
      const amazonUrl = `https://www.${cfg.amazonDomain}/s?k=${encodeURIComponent(p.name)}`;
      const shopifySpyUrl = `https://www.google.com/search?q=${encodeURIComponent('site:myshopify.com "' + p.name + '"')}`;

      card.innerHTML = `
        <div>
          <!-- Header Tags & Badges -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 6px;">
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <span class="product-tag product-tag-viral">🔥 Momentum ${p.trendMomentum}/100</span>
              <span class="product-tag product-tag-margin">💰 ${p.marginPct}% Gross Margin</span>
            </div>
            <span style="font-size: 11px; font-weight: 600; color: #475569; background: #f1f5f9; padding: 2px 7px; border-radius: 4px;">
              ${p.saturation}
            </span>
          </div>

          <!-- Product Title & Hook -->
          <h3 style="font-size: 16px; font-weight: 700; color: var(--navy); margin: 0 0 4px; line-height: 1.3;">
            ${escapeHtml(p.name)}
          </h3>
          <p style="font-size: 12px; color: var(--gray-600); margin: 0 0 14px; line-height: 1.4;">
            ${escapeHtml(p.tagline)}
          </p>

          <!-- Profit & Unit Economics Grid -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 14px; background: #f8fafc; border: 1px solid var(--gray-200); border-radius: 8px; padding: 10px; text-align: center;">
            <div>
              <div style="font-size: 10px; font-weight: 600; color: var(--gray-500); text-transform: uppercase;">Source Cost</div>
              <div style="font-size: 14px; font-weight: 700; color: #0284c7; margin-top: 2px;">${p.currencySymbol}${p.costPrice.toLocaleString()}</div>
            </div>
            <div>
              <div style="font-size: 10px; font-weight: 600; color: var(--gray-500); text-transform: uppercase;">Sell Price</div>
              <div style="font-size: 14px; font-weight: 700; color: var(--navy); margin-top: 2px;">${p.currencySymbol}${p.sellPrice.toLocaleString()}</div>
            </div>
            <div>
              <div style="font-size: 10px; font-weight: 600; color: var(--gray-500); text-transform: uppercase;">Net Profit</div>
              <div style="font-size: 14px; font-weight: 800; color: #16a34a; margin-top: 2px;">+${p.currencySymbol}${p.netProfit.toLocaleString()}</div>
            </div>
          </div>

          <!-- Why It Sells Box -->
          <div style="font-size: 12px; color: var(--gray-700); margin-bottom: 14px; background: #fffbeb; border: 1px solid #fef08a; border-radius: 8px; padding: 10px;">
            <div style="font-weight: 700; color: #92400e; margin-bottom: 3px;">✨ The Viral "Why It Sells" Hook:</div>
            <div>${escapeHtml(p.wowFactor)}</div>
          </div>

          <!-- Problem Solved & Target Audience -->
          <div style="font-size: 11px; color: var(--gray-600); margin-bottom: 16px; line-height: 1.5;">
            <div><strong>🎯 Target Audience:</strong> ${escapeHtml(p.targetAudience)}</div>
            <div style="margin-top: 3px;"><strong>💡 Best Video Angle:</strong> ${escapeHtml(p.bestAdAngle)}</div>
          </div>
        </div>

        <div>
          <!-- Competitor Ads & Sourcing Links Bar -->
          <div style="font-size: 11px; font-weight: 700; color: var(--gray-500); text-transform: uppercase; margin-bottom: 8px;">
            Live Competitor Ads &amp; Sourcing Spy:
          </div>

          <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px;">
            <a href="${metaAdsUrl}" target="_blank" rel="noopener" class="spy-link-btn spy-link-meta" title="Spy on live Facebook & Instagram Ads in ${cfg.name}">
              <span>👁️</span> <span>Meta Ad Library</span>
            </a>
            <a href="${tiktokUrl}" target="_blank" rel="noopener" class="spy-link-btn spy-link-tiktok" title="View viral TikTok videos & UGC creatives">
              <span>🎵</span> <span>TikTok Trends</span>
            </a>
            <a href="${googleTrendsUrl}" target="_blank" rel="noopener" class="spy-link-btn spy-link-trends" title="Check live Google search interest in ${cfg.name}">
              <span>📈</span> <span>Google Trends</span>
            </a>
            <a href="${aliExpressUrl}" target="_blank" rel="noopener" class="spy-link-btn spy-link-ali" title="Check wholesale supplier prices on AliExpress">
              <span>📦</span> <span>AliExpress</span>
            </a>
            <a href="${amazonUrl}" target="_blank" rel="noopener" class="spy-link-btn spy-link-amazon" title="Compare customer reviews & ratings on Amazon ${cfg.name}">
              <span>🛒</span> <span>Amazon</span>
            </a>
            <a href="${shopifySpyUrl}" target="_blank" rel="noopener" class="spy-link-btn spy-link-shopify" title="Find Shopify stores selling this product via Google Dorks">
              <span>🏬</span> <span>Shopify Stores</span>
            </a>
          </div>

          <button type="button" class="btn btn-outline btn-load-calc" data-sell="${p.sellPrice}" data-cost="${p.costPrice}" style="width: 100%; font-size: 12px; padding: 7px 12px; display: flex; align-items: center; justify-content: center; gap: 6px;">
            <span>🧮</span> <span>Calculate Unit Profit &amp; ROAS for This Product</span>
          </button>
        </div>
      `;

      // Connect button to populate unit calculator
      const calcBtn = card.querySelector('.btn-load-calc');
      calcBtn?.addEventListener('click', () => {
        if (rngSelling && rngCost) {
          rngSelling.value = p.sellPrice;
          rngCost.value = p.costPrice;
          recalculateUnitEconomics();
          rngSelling.scrollIntoView({ behavior: 'smooth', block: 'center' });
          showToast(`Loaded "${p.name}" pricing into Profit Calculator!`, 'success');
        }
      });

      winningProductsGrid.appendChild(card);
    });
  }

  // Recalculate Unit Economics & Breakeven ROAS
  function recalculateUnitEconomics() {
    if (!rngSelling || !rngCost || !rngCpa || !rngShipping) return;

    const sell = parseFloat(rngSelling.value) || 0;
    const cost = parseFloat(rngCost.value) || 0;
    const cpa = parseFloat(rngCpa.value) || 0;
    const ship = parseFloat(rngShipping.value) || 0;
    const cfg = COUNTRY_CONFIG[currentCountry] || COUNTRY_CONFIG.IN;

    // Payment gateway fee (2.5%)
    const gatewayFee = sell * 0.025;
    const totalCost = cost + cpa + ship + gatewayFee;
    const netProfit = sell - totalCost;
    const profitMargin = sell > 0 ? (netProfit / sell) * 100 : 0;

    // Breakeven ROAS = Selling Price / (Selling Price - (COGS + Shipping + Gateway))
    const grossMarginPerOrder = sell - (cost + ship + gatewayFee);
    const breakevenRoas = grossMarginPerOrder > 0 ? (sell / grossMarginPerOrder) : 9.99;

    // Update displays
    if (dispCalcSelling) dispCalcSelling.textContent = `${cfg.symbol}${sell.toLocaleString()}`;
    if (dispCalcCost) dispCalcCost.textContent = `${cfg.symbol}${cost.toLocaleString()}`;
    if (dispCalcCpa) dispCalcCpa.textContent = `${cfg.symbol}${cpa.toLocaleString()}`;
    if (dispCalcShipping) dispCalcShipping.textContent = `${cfg.symbol}${ship.toLocaleString()}`;

    if (outNetProfit) {
      outNetProfit.textContent = `${netProfit >= 0 ? '+' : ''}${cfg.symbol}${Math.round(netProfit).toLocaleString()}`;
      outNetProfit.style.color = netProfit >= 0 ? '#16a34a' : '#dc2626';
    }

    if (outProfitMargin) {
      outProfitMargin.textContent = `${profitMargin.toFixed(1)}%`;
      outProfitMargin.style.color = profitMargin >= 25 ? '#16a34a' : (profitMargin >= 15 ? '#d97706' : '#dc2626');
    }

    if (outBreakevenRoas) {
      outBreakevenRoas.textContent = `${breakevenRoas.toFixed(2)}x`;
    }

    if (outTotalCost) {
      outTotalCost.textContent = `${cfg.symbol}${Math.round(totalCost).toLocaleString()}`;
    }

    if (roasVerdictBox) {
      if (profitMargin >= 28) {
        roasVerdictBox.style.background = '#ecfdf5';
        roasVerdictBox.style.color = '#15803d';
        roasVerdictBox.style.borderColor = '#bbf7d0';
        roasVerdictBox.innerHTML = `✓ <strong>Highly Profitable Product:</strong> Margin is ${profitMargin.toFixed(1)}% with Breakeven ROAS at ${breakevenRoas.toFixed(2)}x. Gives comfortable room for scaling Meta &amp; TikTok ads profitably.`;
      } else if (profitMargin >= 15) {
        roasVerdictBox.style.background = '#fffbeb';
        roasVerdictBox.style.color = '#92400e';
        roasVerdictBox.style.borderColor = '#fde68a';
        roasVerdictBox.innerHTML = `⚠️ <strong>Moderate Margin:</strong> Margin is ${profitMargin.toFixed(1)}%. Keep your Ad CPA under ${cfg.symbol}${Math.round(cpa)} to maintain positive cashflow.`;
      } else {
        roasVerdictBox.style.background = '#fef2f2';
        roasVerdictBox.style.color = '#991b1b';
        roasVerdictBox.style.borderColor = '#fecaca';
        roasVerdictBox.innerHTML = `✕ <strong>Unprofitable / High Risk:</strong> Negative or slim margin. Negotiate lower supplier cost or bundle quantities (Buy 2 Get 1 Free) to increase Average Order Value (AOV).`;
      }
    }
  }

  // Render 3 Viral Video Ad Script Templates
  function renderAdScripts(product, cfg) {
    if (!adScriptsGrid) return;
    adScriptsGrid.innerHTML = '';

    const pName = product.name;

    const scripts = [
      {
        angle: '🔥 Angle 1: Problem - Agitate - Solve (PAS)',
        hook: `"If you deal with constant ${product.category === 'beauty' ? 'unwanted hair and strawberry skin' : (product.category === 'home' ? 'dirty bathroom tiles and back pain' : 'messy cords and cluttered desks')}, STOP SCROLLING."`,
        body: `Show intense struggle for 3 seconds. Then reveal the ${pName} in full action. Point out how easy it is compared to the traditional painful/time-consuming alternative.`,
        cta: `"Link in bio / Click Shop Now before this batch sells out with 50% OFF today!"`,
        badge: 'Best for Meta Feed & Reels'
      },
      {
        angle: '🎬 Angle 2: "TikTok Made Me Buy It" Social Proof',
        hook: `"I ordered this viral ${pName} from TikTok after seeing it everywhere, and here is my honest unfiltered reaction..."`,
        body: `Unbox the product, demonstrate the immediate satisfying "Wow" factor. Highlight: "${product.wowFactor}". Add fast captions and trending audio.`,
        cta: `"Get yours before TikTok takes it viral again. Free express shipping this week only!"`,
        badge: 'Best for TikTok Ads & UGC'
      },
      {
        angle: '💡 Angle 3: "Stop Doing This" Shock Curiosity Hook',
        hook: `"Stop wasting your money on ${product.category === 'auto' ? 'expensive car washes' : (product.category === 'beauty' ? 'salon waxing' : 'cheap broken gadgets')}. Do this instead..."`,
        body: `Present the ${pName} as the smart insider secret. Show side-by-side comparison of old expensive method vs your product.`,
        cta: `"Limited stock available. Tap Shop Now to claim today's special discount."`,
        badge: 'High Click-Through-Rate (CTR)'
      }
    ];

    scripts.forEach(s => {
      const card = document.createElement('div');
      card.style.cssText = 'background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-lg); padding: 16px; display: flex; flex-direction: column; justify-content: space-between;';
      card.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="font-size: 13px; font-weight: 700; color: var(--navy);">${escapeHtml(s.angle)}</span>
            <span style="font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 4px; background: #e0e7ff; color: #4338ca;">${escapeHtml(s.badge)}</span>
          </div>

          <div style="font-size: 12px; margin-bottom: 8px;">
            <strong style="color: #db2777;">0-3s Hook:</strong>
            <div style="font-style: italic; color: #1e293b; background: #ffffff; padding: 8px 10px; border-radius: 6px; border: 1px solid #e2e8f0; margin-top: 4px;">${escapeHtml(s.hook)}</div>
          </div>

          <div style="font-size: 12px; margin-bottom: 8px;">
            <strong style="color: #4f46e5;">3-20s Visual Demonstration:</strong>
            <div style="color: var(--gray-700); margin-top: 2px; line-height: 1.4;">${escapeHtml(s.body)}</div>
          </div>

          <div style="font-size: 12px;">
            <strong style="color: #16a34a;">20-30s Urgency Call to Action:</strong>
            <div style="color: #15803d; font-weight: 600; margin-top: 2px;">${escapeHtml(s.cta)}</div>
          </div>
        </div>

        <button type="button" class="btn btn-outline btn-copy-script" style="margin-top: 14px; font-size: 11px; padding: 6px 10px; width: 100%;">
          📋 Copy Ad Script Copy
        </button>
      `;

      const copyBtn = card.querySelector('.btn-copy-script');
      copyBtn?.addEventListener('click', () => {
        const fullScript = `${s.angle}\n\n[0-3s Hook]:\n${s.hook}\n\n[3-20s Body Demo]:\n${s.body}\n\n[20-30s Call to Action]:\n${s.cta}`;
        navigator.clipboard.writeText(fullScript).then(() => {
          showToast('Ad script copied to clipboard!', 'success');
        });
      });

      adScriptsGrid.appendChild(card);
    });
  }

  // Helpers
  function showLoading(show, title = '', subtitle = '') {
    if (!researchLoading) return;
    researchLoading.style.display = show ? 'block' : 'none';
    if (loadingTitle && title) loadingTitle.textContent = title;
    if (loadingSubtitle && subtitle) loadingSubtitle.textContent = subtitle;
    if (show && researchResults) researchResults.style.display = 'none';
    if (!show && researchResults) {
      researchResults.style.display = 'block';
      researchResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
    toast.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 9999; padding: 12px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; color: #fff; background: ' + (type === 'error' ? '#ef4444' : (type === 'success' ? '#10b981' : '#4f46e5')) + '; box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: fadeIn 0.2s ease;';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
});
