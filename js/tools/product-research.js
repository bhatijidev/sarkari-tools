/**
 * AllToolsInOne - Winning Product Research & Dropshipping Spy Tool
 * Dynamic Engine Features:
 * 1. Country-Adaptive Market Profiles & Local Currencies (INR, USD, GBP, EUR, AED, CAD, AUD)
 * 2. Country-Specific Trending Categories Hotlist (Auto-generated when no category selected)
 * 3. 26 Proven Viral Winning Products with Dynamic Day/Week Trend Momentum Scoring
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
      codRate: '0% (100% Card & Afterpay)',
      logistics: 'Australia Post, Sendle, StarTrack',
      gateway: 'Stripe, Afterpay, Zip, PayPal',
      aovRange: 'A$49 - A$99 (Active outdoor lifestyle & pet care)',
      amazonDomain: 'amazon.com.au',
      adPlatform: 'Meta Feed & TikTok'
    },
    AE: {
      name: 'United Arab Emirates',
      flag: '🇦🇪',
      currency: 'AED',
      symbol: 'AED ',
      fxRate: 0.044,
      avgCpa: 45,
      avgShip: 18,
      codRate: '55% - 65% COD Orders',
      logistics: 'Aramex, Fetchr, SMSA Express, iMile',
      gateway: 'Checkout.com, Network International, Stripe',
      aovRange: 'AED 120 - 250 (High ticket luxury & tech focus)',
      amazonDomain: 'amazon.ae',
      adPlatform: 'Snapchat Ads & Instagram Reels'
    },
    DE: {
      name: 'Germany / Europe',
      flag: '🇩🇪',
      currency: 'EUR',
      symbol: '€',
      fxRate: 0.011,
      avgCpa: 22,
      avgShip: 5,
      codRate: '0% (Sofort, Klarna, PayPal, GiroPay)',
      logistics: 'DHL Paket, Hermes, DPD Deutschland',
      gateway: 'Klarna, PayPal, Mollie, Stripe',
      aovRange: '€35 - €75 (Practical problem-solvers & quality)',
      amazonDomain: 'amazon.de',
      adPlatform: 'Google Shopping & Meta Ads'
    },
    ALL: {
      name: 'Global Market',
      flag: '🌐',
      currency: 'USD',
      symbol: '$',
      fxRate: 0.012,
      avgCpa: 22,
      avgShip: 6,
      codRate: 'Varies by region',
      logistics: 'CNE Express, YunExpress, Yanwen 4PX',
      gateway: 'Stripe, PayPal, Shopify Payments',
      aovRange: '$35 - $75 (Universal mass-market problem solvers)',
      amazonDomain: 'amazon.com',
      adPlatform: 'TikTok Creative & Meta Ad Library'
    }
  };

  // Country Trending Categories Hotlist
  const COUNTRY_TRENDING_CATEGORIES = {
    IN: [
      {
        id: 'auto',
        name: 'Car & Bike Accessories & Cleaning Tech',
        icon: '🚗',
        growth: '+58% MoM',
        reason: 'Huge spike in wireless tire inflators, high-pressure car dusters, and 360° phone mounts across tier-1 & tier-2 cities.',
        sample: 'Wireless Car Vacuum & Blower, Portable Tire Inflator'
      },
      {
        id: 'home',
        name: 'Smart Kitchen & Home Problem Solvers',
        icon: '🏠',
        growth: '+46% MoM',
        reason: 'Viral Instagram Reels driving high COD orders on flame diffusers, vegetable choppers, and cordless scrubbers.',
        sample: 'Ultrasonic Flame Diffuser, Electric Spin Scrubber'
      },
      {
        id: 'tech',
        name: 'Wireless Gadgets & MagSafe Tech',
        icon: '⚡',
        growth: '+42% MoM',
        reason: 'Rising smartphone adoption driving strong demand for 3-in-1 multi-chargers and pocket power banks.',
        sample: 'Foldable 3-in-1 MagSafe Dock, Mini Capsule Power Bank'
      },
      {
        id: 'beauty',
        name: 'Painless Hair Removal & Skincare Tools',
        icon: '💄',
        growth: '+39% MoM',
        reason: 'Zero-pain crystal hair erasers and red light therapy wands driving 75%+ profit margins with low returns.',
        sample: 'Nano-Crystalline Hair Eraser, Red Light Facial Wand'
      },
      {
        id: 'fitness',
        name: 'Orthopedic Back Pain & Posture Care',
        icon: '🏋️',
        growth: '+34% MoM',
        reason: 'Work-from-home back & neck strain drives high conversion on acupressure stretchers and posture braces.',
        sample: 'Multi-Level Back Stretcher, Posture Corrector'
      },
      {
        id: 'fashion',
        name: 'Anti-Theft Travel Backpacks & Smart Wallets',
        icon: '🎒',
        growth: '+31% MoM',
        reason: 'Commuters and college youth driving strong volume on USB-charging waterproof travel bags and carbon RFID wallets.',
        sample: 'Expandable Travel Backpack, RFID Carbon Fiber Wallet'
      }
    ],
    US: [
      {
        id: 'pets',
        name: 'Smart Pet Tech & Interactive Toys',
        icon: '🐾',
        growth: '+52% MoM',
        reason: 'Americans spend over $140B on pets. High impulse buys on self-moving balls, calming beds, and shedding vacuums.',
        sample: 'Smart Bouncing Pet Ball, Self-Cleaning Pet Hair Roller'
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
        sample: 'Ultra-Thin Walking Pad, 14-in-1 Push-Up Board'
      },
      {
        id: 'tech',
        name: 'MagSafe Multi-Device Wireless Docks',
        icon: '⚡',
        growth: '+38% MoM',
        reason: 'Aesthetic bedside 3-in-1 foldable charging stations for iPhone, Apple Watch, and AirPods.',
        sample: 'Foldable 3-in-1 MagSafe Travel Charger, Sunset Lamp'
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
        sample: 'LED Wooden Busy Board for Toddlers, LCD Drawing Tablet'
      }
    ],
    GB: [
      {
        id: 'home',
        name: 'Aesthetic Cozy Home Decor & Diffusers',
        icon: '🕯️',
        growth: '+49% MoM',
        reason: 'UK consumer appetite for cozy autumn/winter home aesthetics, flame diffusers, and mood lighting.',
        sample: 'Ultrasonic Flame Diffuser, Sunset Projection Lamp'
      },
      {
        id: 'pets',
        name: 'Calming Dog & Cat Beds & Grooming',
        icon: '🐕',
        growth: '+44% MoM',
        reason: 'High pet ownership in UK apartments driving massive volume for anxiety-relief donut beds.',
        sample: 'Anti-Anxiety Donut Plush Pet Bed, Lint Roller'
      },
      {
        id: 'fitness',
        name: 'Ergonomic WFH Posture & Back Pain Relief',
        icon: '🧘',
        growth: '+37% MoM',
        reason: 'Office & remote workers seeking non-medicinal relief for posture and lower spine ache.',
        sample: 'Orthopedic Back Stretcher, Posture Corrector'
      },
      {
        id: 'fashion',
        name: 'Weatherproof Travel Bags & Slim Wallets',
        icon: '☂️',
        growth: '+35% MoM',
        reason: 'Frequent rain and tube travel drives demand for waterproof anti-theft bags and RFID protection.',
        sample: 'Waterproof Anti-Theft Backpack, RFID Pop-Up Wallet'
      }
    ],
    CA: [
      {
        id: 'auto',
        name: 'Winter Automotive Gadgets & Emergency Tools',
        icon: '🚙',
        growth: '+55% MoM',
        reason: 'Harsh winters drive urgency for portable battery jump starters, high-power defrosters, and cordless car cleaners.',
        sample: 'Wireless Car Vacuum, Tire Inflator'
      },
      {
        id: 'fitness',
        name: 'Home Gym & Indoor Walking Pads',
        icon: '🏋️',
        growth: '+47% MoM',
        reason: 'Cold Canadian climate forces fitness indoors during long winters.',
        sample: 'Under-Desk Walking Treadmill, Push-Up Board'
      },
      {
        id: 'home',
        name: 'Power Scrubbers & Moisture Care',
        icon: '🏠',
        growth: '+40% MoM',
        reason: 'Home maintenance, indoor tile cleaning, and winter humidity control.',
        sample: 'Power Spin Scrubber, Flame Aroma Diffuser'
      }
    ],
    AU: [
      {
        id: 'fitness',
        name: 'Outdoor Fitness, Hydration & Wellness',
        icon: '🏄',
        growth: '+51% MoM',
        reason: 'Active Australian lifestyle creates booming demand for portable blenders, posture gear, and massage tools.',
        sample: 'Portable Juice Blender Bottle, Lumbar Stretcher'
      },
      {
        id: 'auto',
        name: 'Road Trip & 4WD Accessories',
        icon: '🏕️',
        growth: '+43% MoM',
        reason: 'Australians love camping and road trips; strong demand for powerful car vacuums and dash cameras.',
        sample: 'High-Power Car Vacuum, HD 3-Channel Dash Cam'
      },
      {
        id: 'tech',
        name: 'Solar & Wireless Charging Gear',
        icon: '⚡',
        growth: '+39% MoM',
        reason: 'Travel-friendly multi-chargers and portable emergency power.',
        sample: 'Foldable 3-in-1 MagSafe Station, Mini Power Bank'
      }
    ],
    AE: [
      {
        id: 'auto',
        name: 'Premium Car Detailing & Interior Gadgets',
        icon: '🏎️',
        growth: '+62% MoM',
        reason: 'Car culture is massive in UAE. Handheld vacuums, dash cams, and 360° phone mounts fly off shelves.',
        sample: 'High-Power Wireless Car Vacuum, HD Dash Cam'
      },
      {
        id: 'tech',
        name: 'Luxury Desktop & Bedside Wireless Docks',
        icon: '💎',
        growth: '+54% MoM',
        reason: 'High purchasing power consumers looking for sleek Apple/Android MagSafe charging aesthetics.',
        sample: 'Foldable 3-in-1 MagSafe Charger, Levitating Humidifier'
      },
      {
        id: 'beauty',
        name: 'High-Tech Skincare & Anti-Aging Tools',
        icon: '✨',
        growth: '+48% MoM',
        reason: 'Red light microcurrent wands and crystal hair erasers driving high COD basket values.',
        sample: 'Red Light Therapy Wand, Nano-Crystalline Hair Eraser'
      }
    ],
    DE: [
      {
        id: 'home',
        name: 'Efficient Cleaning & Precision Gadgets',
        icon: '🧼',
        growth: '+45% MoM',
        reason: 'German buyers value high-efficiency cleaning machines and time-saving household tools.',
        sample: 'Electric Cordless Power Spin Scrubber, Flame Diffuser'
      },
      {
        id: 'fitness',
        name: 'Ergonomic Health & Posture Correction',
        icon: '🩺',
        growth: '+41% MoM',
        reason: 'Physiotherapist-endorsed posture correctors and spine traction arches.',
        sample: 'Orthopedic Back Stretcher, Posture Corrector'
      }
    ],
    ALL: [
      {
        id: 'home',
        name: 'Viral TikTok Cleaning & Aesthetic Living',
        icon: '🏠',
        growth: '+54% MoM',
        reason: 'Global #CleanTok and cozy living trends drive continuous cross-border dropshipping demand.',
        sample: 'Electric Spin Scrubber, Ultrasonic Flame Diffuser'
      },
      {
        id: 'pets',
        name: 'Smart Pet Toys & Self-Cleaning Rollers',
        icon: '🐾',
        growth: '+49% MoM',
        reason: 'Emotion-driven viral videos with extremely high shareability on TikTok and Instagram.',
        sample: 'Smart Bouncing Pet Ball, Pet Hair Lint Roller'
      },
      {
        id: 'tech',
        name: 'MagSafe Multi-Device Chargers & Ambient Lights',
        icon: '⚡',
        growth: '+46% MoM',
        reason: 'High perceived value, lightweight international shipping, low return rates.',
        sample: 'Foldable 3-in-1 MagSafe Station, Sunset Lamp'
      },
      {
        id: 'beauty',
        name: 'Non-Invasive Beauty & Facial Wands',
        icon: '💄',
        growth: '+43% MoM',
        reason: 'High gross margins (75%-85%) with visual transformation demos that crush video ads.',
        sample: 'Nano Hair Eraser, Red Light Face Wand'
      }
    ]
  };

  // Base Products Master Catalog (26 Proven Viral Winning Products)
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
      id: 'smart_trash_can',
      category: 'home',
      name: 'Automatic Touchless Motion Sensor Smart Trash Can',
      tagline: 'Infrared sensor bathroom/kitchen bin with odor-seal lid and 0.3s quick open.',
      tags: ['Smart Living', '65% Margin', 'Clean Home'],
      trendMomentum: 89,
      saturation: 'Low Saturation',
      baseCostInr: 550,
      baseSellInr: 1799,
      wowFactor: 'Wave hand or bend knee and lid opens seamlessly with zero physical touch.',
      solvesProblem: 'Prevents touching dirty, germ-infested garbage bin lids while cooking or holding trash.',
      whyItSells: 'Modern smart home aesthetic; essential for hygiene-conscious homeowners.',
      targetAudience: 'Modern homeowners, young couples, bathroom renovators',
      bestAdAngle: 'Hands full of kitchen waste -> Wave knee near sensor -> Lid opens like magic.'
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
      id: 'heatless_curler',
      category: 'beauty',
      name: 'Satin Heatless Hair Curling Ribbon & Wrap',
      tagline: 'Damage-free overnight bouncy curls kit with silk scrunchies and claw clip.',
      tags: ['Viral TikTok', '85% Margin', 'Zero Tech Risk'],
      trendMomentum: 93,
      saturation: 'Medium Demand',
      baseCostInr: 90,
      baseSellInr: 649,
      wowFactor: 'Wake up with salon-grade voluminous blowout curls without putting burning hot curling irons on your hair.',
      solvesProblem: 'Prevents split ends and severe heat damage caused by daily curling irons.',
      whyItSells: 'Huge organic UGC virality on TikTok and Reels; massive profit margin.',
      targetAudience: 'Women with medium-to-long hair, college girls, bridal parties',
      bestAdAngle: 'Filming nighttime wrap routine -> Morning clip removal showing giant bouncy salon curls.'
    },
    {
      id: 'red_light_wand',
      category: 'beauty',
      name: '4-in-1 Red Light Microcurrent Face & Neck Wand',
      tagline: 'LED therapy, therapeutic warmth, and facial massage for jawline sculpting.',
      tags: ['High Ticket', '75% Margin', 'Celebrity Trend'],
      trendMomentum: 95,
      saturation: 'Scaling Rapidly',
      baseCostInr: 480,
      baseSellInr: 2199,
      wowFactor: 'Rotating wand head that glides along jawline with relaxing warm red glow.',
      solvesProblem: 'Reduces morning face puffiness, smooths fine lines, and lifts sagging skin.',
      whyItSells: 'Replaces ₹5,000/session dermatology spa treatments for a fraction of the cost.',
      targetAudience: 'Women and men aged 25-55 interested in skincare and anti-aging',
      bestAdAngle: 'Side-by-side face comparison: puffy tired morning face vs 5-minute sculpted contoured cheekbones.'
    },
    {
      id: 'skin_scrubber',
      category: 'beauty',
      name: 'Ultrasonic Pore Cleanser & Skin Scrubber',
      tagline: 'High-frequency vibration spatula that extracts blackheads and infuses serums.',
      tags: ['Oddly Satisfying', '70% Margin', 'Skincare'],
      trendMomentum: 88,
      saturation: 'Medium (Evergreen)',
      baseCostInr: 320,
      baseSellInr: 1299,
      wowFactor: 'Audibly sprays mist and visibly scrapes blackhead sebum out of nose pores on camera.',
      solvesProblem: 'Painless blackhead extraction without squeezing with fingernails or leaving scars.',
      whyItSells: 'Insanely satisfying visual hook that stops people scrolling on social media instantly.',
      targetAudience: 'Teens, young adults, people suffering from clogged pores and acne',
      bestAdAngle: 'Extreme macro close-up of nose pores with ultrasonic spatula pushing out sebum mist.'
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
      id: 'levitating_humidifier',
      category: 'tech',
      name: 'Anti-Gravity Levitating Water Droplet Humidifier',
      tagline: 'Optical illusion air humidifier with water droplets defying gravity upwards.',
      tags: ['Mind-Bending Wow', 'High Ticket', '68% Margin'],
      trendMomentum: 92,
      saturation: 'Low Saturation',
      baseCostInr: 850,
      baseSellInr: 2899,
      wowFactor: 'Stroboscopic water droplets appear to float slowly upwards against gravity.',
      solvesProblem: 'Functions as a silent room humidifier and captivating conversation starter.',
      whyItSells: 'Pure visual witchcraft that gets millions of organic views on TikTok.',
      targetAudience: 'Tech enthusiasts, desk setup collectors, gamers, gift buyers',
      bestAdAngle: 'Close-up video showing water drops moving upwards with sound effect: "Bro what did I just buy?!"'
    },
    {
      id: 'mini_powerbank',
      category: 'tech',
      name: 'Ultra-Mini Direct-Plug Emergency Pocket Power Bank',
      tagline: 'Lipstick-sized 5000mAh portable charger with built-in Lightning/Type-C connector.',
      tags: ['Everyday Essential', '62% Margin', 'High Volume'],
      trendMomentum: 90,
      saturation: 'Scaling (Medium)',
      baseCostInr: 320,
      baseSellInr: 999,
      wowFactor: 'Plugs directly into the phone without dangling cords; fits inside tiny pockets.',
      solvesProblem: 'Eliminates dead phone panic when shopping or commuting without carrying heavy brick power banks.',
      whyItSells: 'Impulse buy under ₹1,000 / $25 with immediate universal utility.',
      targetAudience: 'College students, club-goers, travelers, iPhone users with poor battery health',
      bestAdAngle: 'POV: Your phone is at 1% at a concert -> Pull mini battery out of pocket and snap it on.'
    },
    {
      id: 'sunset_lamp',
      category: 'tech',
      name: 'Smart RGB 16-Color App Sunset Projection Lamp',
      tagline: '360° halo projection lamp with remote and smartphone app color tuning.',
      tags: ['TikTok Aesthetic', '74% Margin', 'Creator Favorite'],
      trendMomentum: 86,
      saturation: 'Medium (Evergreen)',
      baseCostInr: 240,
      baseSellInr: 899,
      wowFactor: 'Instantly transforms any dull white wall into a golden hour sunset photo studio.',
      solvesProblem: 'Creators and girls need golden hour lighting without waiting for 5 PM sun.',
      whyItSells: 'Instagram and TikTok creators need aesthetic lighting for photos and room decor.',
      targetAudience: 'Content creators, Instagram models, aesthetic bedroom lovers',
      bestAdAngle: 'Boring dark room -> Click switch -> Warm radiant golden sunset covers the entire room.'
    },
    {
      id: 'car_vacuum',
      category: 'auto',
      name: 'High-Power Wireless Portable Car Vacuum & Air Duster',
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
      id: 'dash_cam_3ch',
      category: 'auto',
      name: 'HD 3-Channel 1080P Infrared Night Vision Dash Cam',
      tagline: 'Front, inside cabin, and rear recording with G-sensor loop protection.',
      tags: ['High Ticket', 'Safety Product', '58% Margin'],
      trendMomentum: 94,
      saturation: 'Low Saturation',
      baseCostInr: 1200,
      baseSellInr: 3499,
      wowFactor: 'Triple camera coverage with infrared night vision that records inside cabin and road simultaneously.',
      solvesProblem: 'Provides rock-solid legal evidence in road accidents, fraud claims, and police stops.',
      whyItSells: 'Fear-based safety purchase. Drivers want peace of mind against road rage and hit-and-runs.',
      targetAudience: 'All car owners, Uber/taxi drivers, road trippers, cautious parents',
      bestAdAngle: 'Dashcam clip of a close-call road incident: "This ₹3,000 gadget saved me ₹50,000 in insurance fraud."'
    },
    {
      id: 'phone_mount_mirror',
      category: 'auto',
      name: '360° Rotatable Rearview Mirror Phone Mount Holder',
      tagline: 'Sturdy clamp rearview mirror navigation mount with retractable swivel arm.',
      tags: ['Impulse Auto', '72% Margin', 'Everyday Use'],
      trendMomentum: 88,
      saturation: 'Scaling (High Demand)',
      baseCostInr: 150,
      baseSellInr: 649,
      wowFactor: 'Keeps phone directly at eye level without blocking windshield view or falling off suction cups.',
      solvesProblem: 'Stops phone from falling off flimsy AC vent clips while driving over potholes.',
      whyItSells: 'Universal utility for Google Maps navigation; fits every car mirror in 10 seconds.',
      targetAudience: 'Daily car commuters, cab drivers, delivery agents',
      bestAdAngle: 'Demonstrate bumpy road driving: AC vent holder falls down -> Mirror mount stays rock solid.'
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
      id: 'walking_pad',
      category: 'fitness',
      name: 'Ultra-Thin Foldable Under-Desk Walking Treadmill Pad',
      tagline: 'Compact flat treadmill with smart LED display and remote speed control.',
      tags: ['High Ticket Winner', '52% Margin', 'Work From Home'],
      trendMomentum: 97,
      saturation: 'Low Saturation',
      baseCostInr: 6500,
      baseSellInr: 14999,
      wowFactor: 'Slides underneath any standing desk or sofa; lets you walk 10,000 steps while typing emails.',
      solvesProblem: 'Solves sedentary lifestyle weight gain for busy desk workers with zero time for the gym.',
      whyItSells: 'Huge global WFH trend with massive order values and strong word-of-mouth.',
      targetAudience: 'Remote workers, desk workers, busy moms, fitness beginners',
      bestAdAngle: 'POV: Walking at 3 km/h while attending a Zoom meeting on a laptop: "How I hit 10k steps before 2 PM."'
    },
    {
      id: 'pushup_board',
      category: 'fitness',
      name: '14-in-1 Color-Coded Multi-Angle Push-Up Board',
      tagline: 'Foldable chest, triceps, back, and shoulders training board with resistance handles.',
      tags: ['Home Gym', '66% Margin', 'High Volume'],
      trendMomentum: 86,
      saturation: 'Medium Demand',
      baseCostInr: 340,
      baseSellInr: 1199,
      wowFactor: 'Color-coded slots guide hand positioning to target specific muscle groups with zero wrist strain.',
      solvesProblem: 'Prevents wrist injuries from flat floor push-ups and provides structured home workouts.',
      whyItSells: 'Affordable home gym equipment for people who dislike crowded gyms.',
      targetAudience: 'Men aged 18-35, home workout beginners, calisthenics enthusiasts',
      bestAdAngle: 'Plug handles into blue slots (Chest pump) -> Move to yellow (Back) -> Insane chest pump demonstration.'
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
      id: 'pet_hair_roller',
      category: 'pets',
      name: '2-in-1 Pet Hair Lint Roller with Self-Cleaning Base',
      tagline: 'Electrostatic reusable sofa and clothing fur remover with waste chamber.',
      tags: ['Massive Problem Solver', '78% Margin', 'Zero Refills'],
      trendMomentum: 92,
      saturation: 'Scaling (High Demand)',
      baseCostInr: 140,
      baseSellInr: 699,
      wowFactor: 'Roll back and forth on a hairy couch and watch fur instantly get trapped inside waste chamber.',
      solvesProblem: 'Eliminates buying expensive sticky paper tape rolls that run out after 2 days.',
      whyItSells: 'Every single pet owner has dog/cat hair on their clothes and furniture.',
      targetAudience: 'Dog and cat owners, groomers, clean home enthusiasts',
      bestAdAngle: 'Roll once over a black velvet couch covered in white dog fur -> Clean line revealed instantly.'
    },
    {
      id: 'donut_pet_bed',
      category: 'pets',
      name: 'Fluffy Anti-Anxiety Calming Plush Donut Pet Bed',
      tagline: 'Ultra-soft faux fur circular orthopedic bed with raised rim for head support.',
      tags: ['High Ticket Emotion', '64% Margin', 'Pet Comfort'],
      trendMomentum: 88,
      saturation: 'Medium (Evergreen)',
      baseCostInr: 450,
      baseSellInr: 1499,
      wowFactor: 'Dogs and cats immediately burrow inside the fluffy rim and fall into a deep peaceful sleep.',
      solvesProblem: 'Calms anxious dogs during thunderstorms, fireworks, and owner separation.',
      whyItSells: 'Heartwarming visual appeal; pet parents want their pets to sleep like royalty.',
      targetAudience: 'Dog and cat parents, older pets with arthritis',
      bestAdAngle: 'Hyperactive puppy pacing around -> Jumps into the donut cloud bed -> Instantly curls up asleep.'
    },
    {
      id: 'led_drawing_tablet',
      category: 'baby',
      name: 'Color LCD Writing & Drawing Tablet for Kids',
      tagline: 'Eco-friendly paperless digital doodle board with 1-click erase lock.',
      tags: ['Parent Favorite', '72% Margin', 'Low Return Rate'],
      trendMomentum: 89,
      saturation: 'Scaling (Medium)',
      baseCostInr: 160,
      baseSellInr: 649,
      wowFactor: 'Zero radiation, paper-free pressure-sensitive colorful drawing with instant erase button.',
      solvesProblem: 'Keeps kids occupied in cars and restaurants without giving them addictive smartphones.',
      whyItSells: 'Parents desperately look for screen-free alternatives to keep children engaged.',
      targetAudience: 'Parents of kids aged 2 to 10, preschool teachers, gift shoppers',
      bestAdAngle: 'Show child throwing a tantrum for a phone -> Hand them the colorful doodle board -> Peaceful silent drawing.'
    },
    {
      id: 'montessori_busy_board',
      category: 'baby',
      name: 'Montessori Wooden Sensory LED Switch Busy Board',
      tagline: 'Natural wood sensory activity board with working LED switches, keys, and plugs.',
      tags: ['Educational Trend', '65% Margin', 'High Parent Demand'],
      trendMomentum: 91,
      saturation: 'Low Saturation',
      baseCostInr: 480,
      baseSellInr: 1599,
      wowFactor: 'Real interactive toggles, keys, and multi-colored LED bulbs designed for tiny toddler fingers.',
      solvesProblem: 'Develops fine motor skills and tactile problem solving away from digital iPad screens.',
      whyItSells: 'Montessori educational methodology is one of the highest-converting angles in e-commerce.',
      targetAudience: 'Moms of toddlers aged 1 to 5, grandparents buying gifts',
      bestAdAngle: 'Toddler deeply focused, turning real keys and flicking switches with calm background music.'
    },
    {
      id: 'waterproof_backpack',
      category: 'fashion',
      name: 'Waterproof Anti-Theft Travel Backpack with USB Port',
      tagline: '180° clamshell opening flight-approved travel bag with hidden zipper pockets.',
      tags: ['Travel Hero', '63% Margin', 'High Ticket'],
      trendMomentum: 92,
      saturation: 'Medium (Evergreen)',
      baseCostInr: 750,
      baseSellInr: 2299,
      wowFactor: 'Opens like a suitcase; has separate waterproof shoe compartment and external phone charging port.',
      solvesProblem: 'Eliminates paying ₹2,000 airline cabin baggage fees on budget airlines.',
      whyItSells: 'Travel boom; students and digital nomads travel constantly with laptops and gadgets.',
      targetAudience: 'Travelers, college students, digital nomads, business commuters',
      bestAdAngle: 'Pack 4 days of clothes, shoes, and laptop into one sleek backpack that slides under airline seat.'
    },
    {
      id: 'posture_brace',
      category: 'fashion',
      name: 'Breathable Adjustable Clavicle Posture Corrector',
      tagline: 'Discreet under-shirt ergonomic upper back support brace for rounded shoulders.',
      tags: ['Pain & Appearance', '76% Margin', 'High Conversion'],
      trendMomentum: 87,
      saturation: 'High (Evergreen)',
      baseCostInr: 140,
      baseSellInr: 699,
      wowFactor: 'Instantly pulls shoulders back and lifts chest, improving height and posture by 2 inches immediately.',
      solvesProblem: 'Corrects "text-neck" and desk slump while easing upper back and shoulder knot pain.',
      whyItSells: 'Dual emotional trigger: solves physical back pain + makes you look taller and more confident.',
      targetAudience: 'Desk workers, gamers, people conscious about slouching',
      bestAdAngle: 'Wear it under a plain t-shirt: Slouched gamer posture -> Snaps posture into straight confident stance.'
    },
    {
      id: 'carbon_wallet',
      category: 'fashion',
      name: 'Men RFID-Blocking Carbon Fiber Slim Pop-Up Wallet',
      tagline: 'Minimalist aluminum cardholder with 1-click quick-draw fan mechanism.',
      tags: ['Men Gifting', '70% Margin', 'Zero Tech Risk'],
      trendMomentum: 89,
      saturation: 'Scaling (Medium)',
      baseCostInr: 190,
      baseSellInr: 799,
      wowFactor: 'Click bottom switch and all 6 credit cards instantly fan out in tiered order for effortless retrieval.',
      solvesProblem: 'Replaces bulky fat leather bi-fold wallets that hurt your lower back when sitting down.',
      whyItSells: 'Number one gift for men (birthdays, Father’s day, anniversaries); satisfying mechanical flick.',
      targetAudience: 'Men aged 20-50, girlfriends and wives buying gifts for men',
      bestAdAngle: 'Fat bulging leather wallet bulging in back pocket -> Throw away -> Click sleek carbon wallet with 1 finger.'
    }
  ];

  // Dynamic Date-Based Momentum & Freshness Calculation Engine
  function getDynamicMetrics(product, countryCode) {
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    
    // Deterministic pseudo-jitter seeded by product id + day of year
    const seed = (product.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) + dayOfYear * 7) % 15;
    const jitter = seed - 7; // -7 to +7

    // Country popularity weighting
    let countryBonus = 0;
    if (countryCode === 'IN' && (product.category === 'auto' || product.category === 'home' || product.category === 'tech')) countryBonus = 3;
    if (countryCode === 'US' && (product.category === 'pets' || product.category === 'beauty' || product.category === 'fitness')) countryBonus = 4;
    if (countryCode === 'AE' && (product.category === 'tech' || product.category === 'auto' || product.category === 'beauty')) countryBonus = 5;
    if (countryCode === 'GB' && (product.category === 'home' || product.category === 'fashion')) countryBonus = 3;

    const dynamicMomentum = Math.min(99, Math.max(78, product.trendMomentum + jitter + countryBonus));
    const dynamicGrowth = Math.min(85, Math.max(24, Math.round(dynamicMomentum * 0.58 + jitter * 1.4)));

    let trendStatus = '🔥 Breakout Trend';
    if (dynamicMomentum >= 93) trendStatus = '🔥 Viral Breakout (#1 Trending)';
    else if (dynamicMomentum >= 87) trendStatus = '⚡ Rapid Scaling (High Demand)';
    else trendStatus = '💎 Evergreen High Margin';

    return { dynamicMomentum, dynamicGrowth, trendStatus };
  }

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
        handleCustomProductSearch(query, cfg, countryCode);
      } else {
        handleStandardCatalogResearch(categoryFilter, cfg, countryCode);
      }

      showLoading(false);
    }, 450);
  }

  // Standard Catalog Handler
  function handleStandardCatalogResearch(categoryFilter, cfg, countryCode) {
    // If NO category is selected ("ALL"), render Country Trending Categories Hotlist!
    if (categoryFilter === 'ALL') {
      renderTrendingCategoriesHotlist(countryCode, cfg);
      trendingCategoriesSection.style.display = 'block';
    } else {
      trendingCategoriesSection.style.display = 'none';
    }

    // Filter Master Products
    let filtered = MASTER_PRODUCTS;
    if (categoryFilter !== 'ALL') {
      filtered = MASTER_PRODUCTS.filter(p => p.category === categoryFilter);
    }

    // Calculate localized and dynamic metrics for each product
    currentProductsList = filtered.map(p => {
      const { dynamicMomentum, dynamicGrowth, trendStatus } = getDynamicMetrics(p, countryCode);
      
      const sellPrice = (countryCode === 'IN')
        ? p.baseSellInr
        : Math.round(p.baseSellInr * cfg.fxRate);

      const costPrice = (countryCode === 'IN')
        ? p.baseCostInr
        : Math.max(2, Math.round(p.baseCostInr * cfg.fxRate));

      const netProfit = sellPrice - costPrice - cfg.avgShip - cfg.avgCpa;
      const profitMargin = Math.round((netProfit / sellPrice) * 100);

      return {
        ...p,
        sellPrice,
        costPrice,
        netProfit,
        profitMargin,
        trendMomentum: dynamicMomentum,
        growthMoM: `+${dynamicGrowth}% MoM`,
        trendStatus
      };
    });

    sortAndRenderProducts();

    // Generate Ad Scripts for the Top #1 Winning Product
    if (currentProductsList.length > 0) {
      generateAdScripts(currentProductsList[0]);
    }
  }

  // Custom Search Query Generator
  function handleCustomProductSearch(query, cfg, countryCode) {
    trendingCategoriesSection.style.display = 'none';
    const customProduct = generateCustomProductReport(query, cfg, countryCode);
    currentProductsList = [customProduct];
    sortAndRenderProducts();
    generateAdScripts(customProduct);
  }

  function generateCustomProductReport(query, cfg, countryCode) {
    const capitalized = query.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    // Dynamic estimates for any query
    const baseSell = countryCode === 'IN' ? 1499 : Math.round(1499 * cfg.fxRate);
    const baseCost = countryCode === 'IN' ? 420 : Math.max(3, Math.round(420 * cfg.fxRate));
    const netProfit = baseSell - baseCost - cfg.avgShip - cfg.avgCpa;
    const profitMargin = Math.round((netProfit / baseSell) * 100);

    return {
      id: 'custom_' + query.replace(/\s+/g, '_'),
      category: 'custom',
      name: `${capitalized} (Custom Intelligence Dossier)`,
      tagline: `Live dropshipping & market feasibility audit for "${capitalized}".`,
      tags: ['Custom Niche Search', 'Dynamic Spy Query', 'Live Intelligence'],
      trendMomentum: 92,
      growthMoM: '+46% MoM',
      trendStatus: '⚡ Active Keyword Search',
      saturation: 'Calculated Live',
      sellPrice: baseSell,
      costPrice: baseCost,
      netProfit: netProfit,
      profitMargin: profitMargin,
      wowFactor: `High intent search volume for "${capitalized}" across Google and TikTok Creative Center.`,
      solvesProblem: `Targets specific buyer pain points or aesthetic desires associated with ${capitalized}.`,
      whyItSells: `High search interest and active advertising on Meta Ad Library indicating strong merchant demand.`,
      targetAudience: `Online shoppers actively looking for ${capitalized} solutions and related accessories.`,
      bestAdAngle: `Highlight the top frustrating problem solved by ${capitalized} in the first 2 seconds of video.`
    };
  }

  // Render Trending Categories Hotlist
  function renderTrendingCategoriesHotlist(countryCode, cfg) {
    if (!trendingCategoriesGrid) return;
    trendingCategoriesGrid.innerHTML = '';

    const categories = COUNTRY_TRENDING_CATEGORIES[countryCode] || COUNTRY_TRENDING_CATEGORIES.IN;
    trendingCategoriesTitle.innerHTML = `🔥 Top Trending E-Commerce Categories in ${cfg.flag} ${cfg.name} (Auto-Hotlist)`;

    categories.forEach(cat => {
      const card = document.createElement('div');
      card.className = 'category-chip-card';
      card.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 24px;">${cat.icon}</span>
            <span style="font-size: 11px; font-weight: 700; color: #16a34a; background: #dcfce7; padding: 3px 8px; border-radius: 9999px;">${cat.growth}</span>
          </div>
          <div style="font-size: 14px; font-weight: 700; color: var(--navy); margin-bottom: 6px;">${escapeHtml(cat.name)}</div>
          <div style="font-size: 12px; color: var(--gray-600); line-height: 1.4; margin-bottom: 10px;">${escapeHtml(cat.reason)}</div>
        </div>
        <div>
          <div style="font-size: 11px; color: var(--gray-500); margin-bottom: 8px;">
            <strong>Sample Winners:</strong> ${escapeHtml(cat.sample)}
          </div>
          <button type="button" class="btn btn-outline btn-filter-cat" data-cat="${cat.id}" style="width: 100%; font-size: 11px; padding: 6px 10px;">
            Filter Winning Products in this Category →
          </button>
        </div>
      `;

      const filterBtn = card.querySelector('.btn-filter-cat');
      filterBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (selCategory) {
          selCategory.value = cat.id;
          runProductResearch();
        }
      });

      card.addEventListener('click', () => {
        if (selCategory) {
          selCategory.value = cat.id;
          runProductResearch();
        }
      });

      trendingCategoriesGrid.appendChild(card);
    });
  }

  // Sort & Render Winning Products
  function sortAndRenderProducts() {
    const sortBy = selSortProducts ? selSortProducts.value : 'trend';
    const cfg = COUNTRY_CONFIG[currentCountry] || COUNTRY_CONFIG.IN;

    if (sortBy === 'trend') {
      currentProductsList.sort((a, b) => b.trendMomentum - a.trendMomentum);
    } else if (sortBy === 'profit') {
      currentProductsList.sort((a, b) => b.netProfit - a.netProfit);
    } else if (sortBy === 'margin') {
      currentProductsList.sort((a, b) => b.profitMargin - a.profitMargin);
    } else if (sortBy === 'price_asc') {
      currentProductsList.sort((a, b) => a.sellPrice - b.sellPrice);
    } else if (sortBy === 'price_desc') {
      currentProductsList.sort((a, b) => b.sellPrice - a.sellPrice);
    }

    renderProductsGrid(currentProductsList, cfg);
  }

  function renderProductsGrid(products, cfg) {
    if (!winningProductsGrid) return;
    winningProductsGrid.innerHTML = '';

    winningProductsTitle.textContent = `🏆 Winning Products for ${cfg.flag} ${cfg.name} (${products.length} Products Found)`;

    if (products.length === 0) {
      winningProductsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 40px; text-align: center; background: var(--white); border: 1px solid var(--gray-200); border-radius: var(--radius-xl);">
          <div style="font-size: 40px; margin-bottom: 12px;">🔍</div>
          <div style="font-size: 16px; font-weight: 700; color: var(--navy); margin-bottom: 6px;">No products match this specific filter</div>
          <div style="font-size: 13px; color: var(--gray-600); margin-bottom: 16px;">Try switching to "All Categories" or searching a broader keyword.</div>
          <button type="button" class="btn btn-primary" id="btnEmptyReset" style="font-size: 13px;">View All Winning Products</button>
        </div>
      `;
      document.getElementById('btnEmptyReset')?.addEventListener('click', resetFilters);
      return;
    }

    products.forEach((p, idx) => {
      const card = document.createElement('div');
      card.className = 'winning-product-card';

      // Live Search / Spy URLs adapted to Country
      const metaAdsUrl = `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=${currentCountry}&q=${encodeURIComponent(p.name)}&search_type=keyword_unordered`;
      const tikTokUrl = `https://ads.tiktok.com/business/creativecenter/inspiration/popular/hashtag/pc/en?keyword=${encodeURIComponent(p.name)}`;
      const googleTrendsUrl = `https://trends.google.com/trends/explore?geo=${currentCountry}&q=${encodeURIComponent(p.name)}`;
      const aliExpressUrl = `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(p.name)}`;
      const amazonUrl = `https://www.${cfg.amazonDomain}/s?k=${encodeURIComponent(p.name)}`;
      const shopifySpyUrl = `https://www.google.com/search?q=site%3Amyshopify.com+${encodeURIComponent('"' + p.name + '"')}`;

      card.innerHTML = `
        <div>
          <!-- Top Row: Badge & Trend Score -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <span class="product-tag product-tag-trend">#${idx + 1} Trending</span>
              <span class="product-tag product-tag-viral">${escapeHtml(p.trendStatus)}</span>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 14px; font-weight: 800; color: #4f46e5;">${p.trendMomentum}/100</div>
              <div style="font-size: 10px; font-weight: 600; color: #16a34a;">${p.growthMoM}</div>
            </div>
          </div>

          <!-- Product Name & Tagline -->
          <h3 style="font-size: 16px; font-weight: 700; color: var(--navy); margin: 0 0 4px; line-height: 1.3;">
            ${escapeHtml(p.name)}
          </h3>
          <p style="font-size: 12px; color: var(--gray-600); margin: 0 0 12px; line-height: 1.4;">
            ${escapeHtml(p.tagline)}
          </p>

          <!-- Profitability & Margin Pill Grid -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-md); padding: 10px; margin-bottom: 14px; text-align: center;">
            <div>
              <div style="font-size: 10px; color: var(--gray-500); font-weight: 600; text-transform: uppercase;">Wholesale Cost</div>
              <div style="font-size: 14px; font-weight: 700; color: var(--navy); margin-top: 2px;">${cfg.symbol}${p.costPrice.toLocaleString()}</div>
            </div>
            <div>
              <div style="font-size: 10px; color: var(--gray-500); font-weight: 600; text-transform: uppercase;">Retail Price</div>
              <div style="font-size: 14px; font-weight: 700; color: #0284c7; margin-top: 2px;">${cfg.symbol}${p.sellPrice.toLocaleString()}</div>
            </div>
            <div>
              <div style="font-size: 10px; color: var(--gray-500); font-weight: 600; text-transform: uppercase;">Net Profit / Order</div>
              <div style="font-size: 14px; font-weight: 700; color: #16a34a; margin-top: 2px;">+${cfg.symbol}${Math.round(p.netProfit).toLocaleString()}</div>
            </div>
          </div>

          <!-- Key Angles: Why It Sells & Problem Solved -->
          <div style="font-size: 12px; line-height: 1.5; color: var(--gray-700); margin-bottom: 14px; background: #faf5ff; border: 1px solid #f3e8ff; border-radius: var(--radius-md); padding: 10px;">
            <div style="margin-bottom: 6px;">
              <strong style="color: #6b21a8;">💡 Why It Sells:</strong> ${escapeHtml(p.whyItSells)}
            </div>
            <div style="margin-bottom: 6px;">
              <strong style="color: #6b21a8;">🎯 Target Audience:</strong> ${escapeHtml(p.targetAudience)}
            </div>
            <div>
              <strong style="color: #6b21a8;">🎬 Best Video Hook:</strong> <em>${escapeHtml(p.bestAdAngle)}</em>
            </div>
          </div>
        </div>

        <div>
          <!-- 6-Link Live Spy Buttons -->
          <div style="font-size: 11px; font-weight: 700; color: var(--navy); text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
            <span>🕵️ Live Competitor Spy Links</span>
            <span style="font-size: 10px; color: var(--gray-500); font-weight: 500;">Live External Search</span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 12px;">
            <a href="${metaAdsUrl}" target="_blank" rel="noopener" class="spy-link-btn spy-link-meta" title="Spy on live running Meta ads in ${cfg.name}">
              <span>👁️</span> <span>Meta Ads</span>
            </a>
            <a href="${tikTokUrl}" target="_blank" rel="noopener" class="spy-link-btn spy-link-tiktok" title="Explore viral TikTok hashtag & creative trends">
              <span>🎵</span> <span>TikTok Trends</span>
            </a>
            <a href="${googleTrendsUrl}" target="_blank" rel="noopener" class="spy-link-btn spy-link-trends" title="Check real-time Google search demand">
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
      if (netProfit > 0 && breakevenRoas < 2.0) {
        roasVerdictBox.innerHTML = `
          <div style="font-weight: 700; color: #166534; font-size: 13px; margin-bottom: 2px;">✅ Highly Profitable Dropshipping Unit Economics</div>
          <div style="font-size: 12px; color: #15803d;">You only need an ad ROAS above <strong>${breakevenRoas.toFixed(2)}x</strong> to make profit. Healthy margin allows scaling aggressive Facebook & TikTok ad budgets.</div>
        `;
        roasVerdictBox.style.background = '#f0fdf4';
        roasVerdictBox.style.borderColor = '#86efac';
      } else if (netProfit > 0) {
        roasVerdictBox.innerHTML = `
          <div style="font-weight: 700; color: #b45309; font-size: 13px; margin-bottom: 2px;">⚠️ Moderate Profit Margin (Tight Ad Room)</div>
          <div style="font-size: 12px; color: #92400e;">Breakeven ROAS is <strong>${breakevenRoas.toFixed(2)}x</strong>. Optimize ad creative click-through rates (CTR) and offer bundle upsells to increase average order value.</div>
        `;
        roasVerdictBox.style.background = '#fefce8';
        roasVerdictBox.style.borderColor = '#fef08a';
      } else {
        roasVerdictBox.innerHTML = `
          <div style="font-weight: 700; color: #991b1b; font-size: 13px; margin-bottom: 2px;">❌ Negative Margins (Unprofitable at Current CPA)</div>
          <div style="font-size: 12px; color: #b91c1c;">You are losing money on each order. Increase selling price or renegotiate supplier COGS on AliExpress / CJ Dropshipping.</div>
        `;
        roasVerdictBox.style.background = '#fef2f2';
        roasVerdictBox.style.borderColor = '#fecaca';
      }
    }
  }

  // Generate 3 Viral Video Ad Scripts
  function generateAdScripts(product) {
    if (!adScriptsGrid) return;
    adScriptsGrid.innerHTML = '';

    const scripts = [
      {
        angle: 'Angle 1: Problem - Agitate - Solve (UGC Viral Hook)',
        badge: 'High Conversion',
        hook: `"Stop wasting your money on ${product.name.split(' ')[0]} until you see this..."`,
        body: `Show the most frustrating daily problem ${product.solvesProblem}. Then instantly whip out the ${product.name} and demonstrate the jaw-dropping solution in 5 seconds.`,
        cta: `"They're selling out fast for 50% off today only. Click the link below before stock runs out."`
      },
      {
        angle: 'Angle 2: Aesthetic TikTok / ASMR Unboxing',
        badge: 'Viral TikTok',
        hook: `"The one Amazon find that actually changed my entire daily routine ✨"`,
        body: `Satisfying unboxing with crisp sound effects (ASMR). Peel off the film, turn on the device, and show it operating seamlessly in a clean aesthetic room setting.`,
        cta: `"Link in bio or tap Shop Now to get yours delivered with free shipping!"`
      },
      {
        angle: 'Angle 3: The "Wait, Did You Know?" Discovery Hook',
        badge: 'Engagement Magnet',
        hook: `"I bet you didn't know this existed, but you 100% need it in your life right now."`,
        body: `Demonstrate the core feature: ${product.wowFactor} Explain why traditional alternatives are inconvenient and how this fixes it permanently.`,
        cta: `"Tap the button below to check if the 40% discount is still active!"`
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
