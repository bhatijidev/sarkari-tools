/**
 * AllToolsInOne — Smart TDEE, Protein Tier (Low / Balanced / High) & Daily Meal Planner
 * Supports full stats OR quick height+weight-only estimation,
 * parses shorthand feet.inches (e.g. "5.10" = 5 ft 10 in),
 * and generates practical Veg / Eggetarian / Non-Veg food portions.
 */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  var state = {
    unitMode: 'metric',    // 'metric' (kg + ft.in/cm) | 'us' (lbs + ft/in)
    heightMode: 'ftin',    // 'ftin' | 'cm'
    goal: 'cut',           // 'cut' | 'maintain' | 'bulk'
    diet: 'veg',           // 'veg' | 'egg' | 'nonveg'
    proteinTier: 'balanced' // 'low' | 'balanced' | 'high'
  };

  var btnUnitMetric = $('btnUnitMetric');
  var btnUnitUS = $('btnUnitUS');
  var btnToggleHeightMode = $('btnToggleHeightMode');
  var ftInWrap = $('ftInWrap');
  var metricHeightWrap = $('metricHeightWrap');
  var lblHeightMode = $('lblHeightMode');
  var lblWeight = $('lblWeight');

  var weightEl = $('weight');
  var heightFtEl = $('heightFt');
  var heightInEl = $('heightIn');
  var heightCmEl = $('heightCm');
  var genderEl = $('gender');
  var ageEl = $('age');
  var activityEl = $('activity');
  var btnQuickOnly = $('btnQuickOnly');

  var smartResolvedBadge = $('smartResolvedBadge');
  var goalBtns = document.querySelectorAll('#goalPillRow .tdee-pill-btn');
  var dietBtns = document.querySelectorAll('#dietPillRow .tdee-pill-btn');
  var tierCards = document.querySelectorAll('#proteinTierGrid .protein-tier-card');

  var dispTargetCals = $('dispTargetCals');
  var lblRecommendedCals = $('lblRecommendedCals');
  var dispTdee = $('dispTdee');
  var dispBmr = $('dispBmr');
  var dispBmi = $('dispBmi');
  var dispBmiTag = $('dispBmiTag');
  var dispHealthyRange = $('dispHealthyRange');

  var dispMildCut = $('dispMildCut');
  var dispStdCut = $('dispStdCut');
  var dispExtCut = $('dispExtCut');
  var dispBulk = $('dispBulk');

  var tierLowG = $('tierLowG');
  var tierBalG = $('tierBalG');
  var tierHighG = $('tierHighG');

  var dispMacroProtein = $('dispMacroProtein');
  var dispMacroProteinPct = $('dispMacroProteinPct');
  var dispMacroCarb = $('dispMacroCarb');
  var dispMacroCarbPct = $('dispMacroCarbPct');
  var dispMacroFat = $('dispMacroFat');
  var dispMacroFatPct = $('dispMacroFatPct');
  var dispWater = $('dispWater');

  var mealPlanHeading = $('mealPlanHeading');
  var mealPlanSummary = $('mealPlanSummary');
  var mealPlanList = $('mealPlanList');
  var coachTipBox = $('coachTipBox');
  var btnCopyPlan = $('btnCopyPlan');

  var lastCopyText = '';

  // Parse "5.10" / "5'10" / "5 ft + 10 in" cleanly!
  function parseSmartHeight() {
    if (state.heightMode === 'cm') {
      var cm = parseFloat(heightCmEl.value) || 0;
      cm = Math.max(90, Math.min(250, cm || 170));
      var totIn = cm / 2.54;
      return {
        cm: cm,
        ft: Math.floor(totIn / 12),
        inch: Math.round(totIn % 12)
      };
    }

    var rawFt = (heightFtEl.value || '').trim().replace(/['"\s]/g, '.');
    var rawInVal = heightInEl.value !== '' ? parseFloat(heightInEl.value) : null;

    var ft = 5;
    var inch = 8;

    if (rawInVal !== null && !isNaN(rawInVal)) {
      ft = Math.floor(parseFloat(rawFt) || 0);
      inch = Math.max(0, Math.min(11.9, rawInVal));
    } else if (rawFt.indexOf('.') !== -1) {
      // Shorthand like "5.10" => 5 ft 10 in, "5.8" => 5 ft 8 in, "6.0" => 6 ft 0 in
      var parts = rawFt.split('.');
      ft = parseInt(parts[0], 10) || 0;
      var decPart = parts[1] || '0';
      if (decPart === '1') {
        // User might type "5.1" intending 5'1" or 5'10"? Treat single '1' as 1 inch (users type 5.10 for 10)
        inch = 1;
      } else {
        inch = Math.min(11, parseInt(decPart.slice(0, 2), 10) || 0);
      }
    } else {
      ft = Math.max(3, Math.min(8, parseFloat(rawFt) || 5));
      inch = 0;
    }

    var totalInches = ft * 12 + inch;
    var cmOut = totalInches * 2.54;
    if (heightCmEl) heightCmEl.value = Math.round(cmOut);
    return { cm: cmOut, ft: ft, inch: Math.round(inch) };
  }

  function getWeightKg() {
    var w = parseFloat(weightEl.value) || 0;
    if (state.unitMode === 'us') return w * 0.453592;
    return w;
  }

  function setUnitMode(mode) {
    if (state.unitMode === mode) return;
    var prevKg = getWeightKg();
    state.unitMode = mode;
    btnUnitMetric.className = mode === 'metric' ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-outline';
    btnUnitUS.className = mode === 'us' ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-outline';
    lblWeight.textContent = mode === 'metric' ? 'Weight (kg)' : 'Weight (lbs)';
    if (prevKg > 0) {
      weightEl.value = mode === 'metric'
        ? Math.round(prevKg * 10) / 10
        : Math.round(prevKg * 2.20462);
    }
    if (mode === 'us' && state.heightMode === 'cm') {
      toggleHeightMode('ftin');
    }
    calculate();
  }

  function toggleHeightMode(forceMode) {
    state.heightMode = forceMode || (state.heightMode === 'ftin' ? 'cm' : 'ftin');
    if (state.heightMode === 'cm') {
      var h = parseSmartHeight(); // reads ftin before switching
      ftInWrap.style.display = 'none';
      metricHeightWrap.style.display = 'block';
      lblHeightMode.textContent = 'Height (cm)';
      btnToggleHeightMode.textContent = 'Switch to ft.in';
      if (!heightCmEl.value) heightCmEl.value = Math.round(h.cm);
    } else {
      var cmNow = parseFloat(heightCmEl.value) || 178;
      var totIn = Math.round(cmNow / 2.54);
      var f = Math.floor(totIn / 12);
      var inc = totIn % 12;
      heightFtEl.value = String(f);
      heightInEl.value = String(inc);
      ftInWrap.style.display = 'grid';
      metricHeightWrap.style.display = 'none';
      lblHeightMode.textContent = 'Height (ft.in or ft)';
      btnToggleHeightMode.textContent = 'Switch to cm';
    }
    calculate();
  }

  function buildMealSuggestions(targetCals, pG, cG, fG, diet, tier, goal) {
    var mealKcal = Math.round(targetCals / 4);
    var pEach = Math.round(pG / 4);

    if (diet === 'veg') {
      if (tier === 'high') {
        return {
          items: [
            { title: '🌅 Breakfast', desc: '50g Rolled Oats or 2 Moong Dal Chillas + 250ml Skim Milk/Soy Milk + 1 Scoop Whey or 40g Soya Chunks', meta: '~' + Math.round(pG * 0.28) + 'g protein • ~' + Math.round(targetCals * 0.25) + ' kcal' },
            { title: '🍛 Lunch', desc: '150g Boiled Soya/Paneer bhurji OR 1.5 bowl Thick Dal + 150g Low-fat Curd (Dahi) + 2 Whole Wheat Roti + Salad', meta: '~' + Math.round(pG * 0.30) + 'g protein • ~' + Math.round(targetCals * 0.32) + ' kcal' },
            { title: '🥜 Evening Snack', desc: '180g Roasted Chana / Sprouts Chaat OR Greek Yogurt (150g) + 8 Almonds', meta: '~' + Math.round(pG * 0.16) + 'g protein • ~' + Math.round(targetCals * 0.15) + ' kcal' },
            { title: '🌙 Dinner', desc: '150g Grilled Paneer or 200g Tofu + Stir-fry Veggies + 1–2 Roti (or 120g cooked rice)', meta: '~' + Math.round(pG * 0.26) + 'g protein • ~' + Math.round(targetCals * 0.28) + ' kcal' }
          ],
          tip: 'Veg High-Protein Tip: Paneer, Soya Chunks (52g protein/100g dry), Tofu, Greek Yogurt/Hung Curd, Besan Chilla, and 1 Scoop Whey make hitting ' + pG + 'g easy without excess oil.'
        };
      }
      return {
        items: [
          { title: '🌅 Breakfast', desc: '1 Bowl Poha / Upma / Oats + 1 Glass Milk (250ml) + 1 Tbsp Peanut Butter or Handful Chana', meta: '~' + Math.round(pG * 0.24) + 'g protein • ~' + mealKcal + ' kcal' },
          { title: '🍛 Lunch', desc: '1 Large Bowl Dal / Rajma / Chole + 100g Curd + 2 Roti (light ghee) + Cucumber/Tomato Salad', meta: '~' + Math.round(pG * 0.30) + 'g protein • ~' + Math.round(targetCals * 0.34) + ' kcal' },
          { title: '☕ Evening Snack', desc: '30g Roasted Chana / Makhana + 1 Seasonal Fruit (Apple/Guava)', meta: '~' + Math.round(pG * 0.14) + 'g protein • ~' + Math.round(targetCals * 0.14) + ' kcal' },
          { title: '🌙 Dinner', desc: '100g Paneer / Soya Sabzi + Green Vegetable + 2 Roti (or light Khichdi)', meta: '~' + Math.round(pG * 0.32) + 'g protein • ~' + Math.round(targetCals * 0.28) + ' kcal' }
        ],
        tip: 'Veg Eating Tip: Simply double your Dal/Curd/Paneer portion and reduce refined oil/extra rice to easily hit ~' + pG + 'g protein inside ' + targetCals + ' kcal.'
      };
    }

    if (diet === 'egg') {
      var whites = tier === 'high' ? 6 : (tier === 'balanced' ? 4 : 2);
      return {
        items: [
          { title: '🌅 Breakfast', desc: whites + ' Boiled Egg Whites + 2 Whole Eggs Omelette + 2 Multigrain Toast or 1 Bowl Oats', meta: '~' + Math.round(pG * 0.32) + 'g protein • ~' + Math.round(targetCals * 0.27) + ' kcal' },
          { title: '🍛 Lunch', desc: '1 Bowl Thick Dal/Rajma + ' + (tier === 'high' ? '150g Paneer/Soya' : '100g Curd') + ' + 2 Roti + Salad', meta: '~' + Math.round(pG * 0.28) + 'g protein • ~' + Math.round(targetCals * 0.32) + ' kcal' },
          { title: '☕ Evening Snack', desc: '30g Roasted Peanuts/Chana + 1 Fruit or Black Coffee', meta: '~' + Math.round(pG * 0.14) + 'g protein • ~' + Math.round(targetCals * 0.14) + ' kcal' },
          { title: '🌙 Dinner', desc: (tier === 'high' ? '3 Whole Eggs / Bhurji' : '2 Boiled Eggs') + ' + Mixed Veggies + 1–2 Roti (light oil)', meta: '~' + Math.round(pG * 0.26) + 'g protein • ~' + Math.round(targetCals * 0.27) + ' kcal' }
        ],
        tip: 'Eggetarian Advantage: 1 whole egg gives 6g protein + healthy yolk; extra egg whites give pure ~3.5g protein per egg at just 17 kcal!'
      };
    }

    // Non-Veg
    var chickenGrams = tier === 'high' ? 200 : (tier === 'balanced' ? 150 : 100);
    return {
      items: [
        { title: '🌅 Breakfast', desc: (tier === 'high' ? '4 Egg Whites + 2 Whole Eggs' : '2 Whole Eggs + 2 Whites') + ' + 2 Toast / Oats', meta: '~' + Math.round(pG * 0.28) + 'g protein • ~' + Math.round(targetCals * 0.25) + ' kcal' },
        { title: '🍛 Lunch', desc: chickenGrams + 'g Grilled/Curry Chicken Breast (minimal oil) + 150g Steamed Rice or 2 Roti + Salad', meta: '~' + Math.round(pG * 0.36) + 'g protein • ~' + Math.round(targetCals * 0.35) + ' kcal' },
        { title: '☕ Evening Snack', desc: 'Greek Yogurt / Curd (150g) or 1 Scoop Whey / Fruit + Nuts', meta: '~' + Math.round(pG * 0.12) + 'g protein • ~' + Math.round(targetCals * 0.13) + ' kcal' },
        { title: '🌙 Dinner', desc: (tier === 'high' ? '180g' : '120g') + ' Fish, Chicken, or Lean Mutton/Paneer + Veggies + 1–2 Roti', meta: '~' + Math.round(pG * 0.24) + 'g protein • ~' + Math.round(targetCals * 0.27) + ' kcal' }
      ],
      tip: 'Daily Plate Rule: Aim for ~' + pEach + 'g protein at each meal (' + chickenGrams + 'g chicken or eggs/fish) and fill half your plate with high-fiber salad & veggies so you stay full on ' + targetCals + ' kcal.'
    };
  }

  function calculate() {
    var weightKg = Math.max(25, getWeightKg() || 70);
    var hInfo = parseSmartHeight();
    var cm = hInfo.cm;
    var heightM = cm / 100;

    var weightLbs = Math.round(weightKg * 2.20462);
    if (smartResolvedBadge) {
      smartResolvedBadge.textContent = '✓ Parsed: ' + hInfo.ft + ' ft ' + hInfo.inch + ' in (' + Math.round(cm) + ' cm) • ' + Math.round(weightKg * 10) / 10 + ' kg (' + weightLbs + ' lbs)';
    }

    var ageVal = parseFloat(ageEl.value);
    var ageYrs = (!isNaN(ageVal) && ageVal >= 14 && ageVal <= 100) ? ageVal : 28;
    var gVal = genderEl.value;
    var sexOffset = gVal === 'male' ? 5 : (gVal === 'female' ? -161 : -78);

    // Mifflin-St Jeor BMR
    var bmr = Math.max(900, (10 * weightKg) + (6.25 * cm) - (5 * ageYrs) + sexOffset);
    var actMult = parseFloat(activityEl.value) || 1.375;
    var tdee = Math.round(bmr * actMult);

    // BMI & Healthy Ideal Range (BMI 18.5 - 24.9)
    var bmi = weightKg / (heightM * heightM);
    var idealLowKg = Math.round(18.5 * heightM * heightM);
    var idealHighKg = Math.round(24.9 * heightM * heightM);
    var bmiTag = 'Healthy Weight';
    if (bmi < 18.5) bmiTag = 'Underweight';
    else if (bmi >= 25 && bmi < 30) bmiTag = 'Overweight Range';
    else if (bmi >= 30) bmiTag = 'Fat-Loss Recommended';

    // Goal calories
    var mildCut = Math.max(1300, tdee - 250);
    var stdCut = Math.max(1350, tdee - 500);
    var extCut = Math.max(1250, tdee - 850);
    var leanBulk = tdee + 300;

    var targetCals = stdCut;
    var goalLabel = 'Daily Target (Fat Loss)';
    if (state.goal === 'maintain') {
      targetCals = tdee;
      goalLabel = 'Daily Target (Maintain Weight)';
    } else if (state.goal === 'bulk') {
      targetCals = leanBulk;
      goalLabel = 'Daily Target (Lean Muscle Gain)';
    }

    // Smart Reference Weight for Protein Calculation:
    // If BMI > 26 (e.g., 98 kg @ 5'10"), anchor protein to Adjusted Lean/Healthy Reference Weight
    // so targets remain realistic (not inflated by excess body fat).
    var midHealthyKg = (idealLowKg + idealHighKg) / 2;
    var refKg = weightKg > idealHighKg
      ? (idealHighKg + 0.30 * (weightKg - idealHighKg))
      : weightKg;
    refKg = Math.max(45, refKg);

    var lowProt = Math.round(refKg * 1.0);
    var balProt = Math.round(refKg * 1.35);
    var highProt = Math.round(refKg * 1.8);

    tierLowG.textContent = lowProt + 'g / day';
    tierBalG.textContent = balProt + 'g / day';
    tierHighG.textContent = highProt + 'g / day';

    var chosenProt = state.proteinTier === 'low' ? lowProt : (state.proteinTier === 'high' ? highProt : balProt);
    // Guard against protein exceeding 45% of total calories
    chosenProt = Math.min(chosenProt, Math.round((targetCals * 0.45) / 4));

    var protKcal = chosenProt * 4;
    var fatShare = state.proteinTier === 'high' ? 0.27 : (state.proteinTier === 'low' ? 0.28 : 0.27);
    var fatGrams = Math.max(35, Math.round((targetCals * fatShare) / 9));
    var fatKcal = fatGrams * 9;
    var carbKcal = Math.max(200, targetCals - protKcal - fatKcal);
    var carbGrams = Math.round(carbKcal / 4);

    var waterLiters = Math.max(2.0, Math.min(5.0, Math.round(weightKg * 0.035 * 10) / 10));

    // Render KPIs
    lblRecommendedCals.textContent = goalLabel;
    dispTargetCals.textContent = targetCals.toLocaleString('en-US');
    dispTdee.textContent = tdee.toLocaleString('en-US');
    dispBmr.textContent = Math.round(bmr).toLocaleString('en-US');
    dispBmi.textContent = bmi.toFixed(1);
    dispBmiTag.textContent = bmiTag;
    dispHealthyRange.textContent = 'Ideal Range for ' + hInfo.ft + "'" + hInfo.inch + '": ' + idealLowKg + '–' + idealHighKg + ' kg';

    dispMildCut.textContent = mildCut.toLocaleString('en-US') + ' kcal';
    dispStdCut.textContent = stdCut.toLocaleString('en-US') + ' kcal';
    dispExtCut.textContent = extCut.toLocaleString('en-US') + ' kcal';
    dispBulk.textContent = leanBulk.toLocaleString('en-US') + ' kcal';

    dispMacroProtein.textContent = chosenProt + 'g';
    dispMacroProteinPct.textContent = Math.round((protKcal / targetCals) * 100) + '% kcal';
    dispMacroCarb.textContent = carbGrams + 'g';
    dispMacroCarbPct.textContent = Math.round((carbKcal / targetCals) * 100) + '% kcal';
    dispMacroFat.textContent = fatGrams + 'g';
    dispMacroFatPct.textContent = Math.round((fatKcal / targetCals) * 100) + '% kcal';
    dispWater.textContent = waterLiters.toFixed(1) + ' L';

    var dietTitle = state.diet === 'veg' ? 'Pure Veg' : (state.diet === 'egg' ? 'Veg + Eggs' : 'Non-Veg');
    var tierTitle = state.proteinTier === 'high' ? 'High Protein' : (state.proteinTier === 'low' ? 'Light Protein' : 'Balanced Protein');
    mealPlanHeading.textContent = '🍱 Daily Meal Plan — ' + dietTitle + ' (' + tierTitle + ')';
    mealPlanSummary.textContent = 'How much to eat: ~' + targetCals.toLocaleString('en-US') + ' kcal/day with ' + chosenProt + 'g Protein, ' + carbGrams + 'g Carbs, ' + fatGrams + 'g Fats & ' + waterLiters.toFixed(1) + 'L Water.';

    var plan = buildMealSuggestions(targetCals, chosenProt, carbGrams, fatGrams, state.diet, state.proteinTier, state.goal);
    mealPlanList.innerHTML = plan.items.map(function (m) {
      return '<div class="meal-slot-card">' +
        '<div style="font-size:13px; font-weight:700; color:var(--navy); margin-bottom:4px;">' + m.title + '</div>' +
        '<div style="font-size:12px; color:#475569; line-height:1.45; margin-bottom:6px;">' + m.desc + '</div>' +
        '<div style="font-size:11px; font-weight:700; color:#059669;">' + m.meta + '</div>' +
        '</div>';
    }).join('');

    var stepNote = state.goal === 'cut'
      ? ' • Walk 8,000–10,000 steps daily to lose ~0.5 kg/week safely.'
      : (state.goal === 'bulk' ? ' • Train with progressive weights 3–4x/wk for lean muscle gain.' : '');
    coachTipBox.innerHTML = '💡 <strong>Coach Insight:</strong> ' + plan.tip + stepNote;

    lastCopyText = [
      'AllToolsInOne Daily Calorie & Protein Plan',
      'Stats: ' + hInfo.ft + "'" + hInfo.inch + '" (' + Math.round(cm) + ' cm), ' + Math.round(weightKg * 10) / 10 + ' kg (BMI ' + bmi.toFixed(1) + ')',
      'Goal: ' + goalLabel + ' -> ' + targetCals + ' kcal/day (TDEE: ' + tdee + ' kcal)',
      'Selected Tier: ' + tierTitle + ' (' + dietTitle + ')',
      'Macros: Protein ' + chosenProt + 'g | Carbs ' + carbGrams + 'g | Fats ' + fatGrams + 'g | Water ' + waterLiters.toFixed(1) + 'L',
      'Light Protein: ' + lowProt + 'g | Balanced: ' + balProt + 'g | High Protein: ' + highProt + 'g',
      'Meals:',
    ].concat(plan.items.map(function (m) {
      return '- ' + m.title + ': ' + m.desc + ' (' + m.meta + ')';
    })).join('\n');
  }

  function init() {
    // Auto-select Metric vs US smoothly based on visitor region
    if (window.ALLTOOLSINONE_GET_REGION && window.ALLTOOLSINONE_GET_REGION() === 'global') {
      state.unitMode = 'us';
      btnUnitUS.className = 'btn btn-sm btn-primary';
      btnUnitMetric.className = 'btn btn-sm btn-outline';
      lblWeight.textContent = 'Weight (lbs)';
      weightEl.value = '216';
    }

    btnUnitMetric.addEventListener('click', function () { setUnitMode('metric'); });
    btnUnitUS.addEventListener('click', function () { setUnitMode('us'); });
    btnToggleHeightMode.addEventListener('click', function () { toggleHeightMode(); });

    [weightEl, heightFtEl, heightInEl, heightCmEl, genderEl, ageEl, activityEl].forEach(function (el) {
      if (el) el.addEventListener('input', calculate);
    });

    goalBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        goalBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        state.goal = btn.dataset.goal;
        calculate();
      });
    });

    dietBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        dietBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        state.diet = btn.dataset.diet;
        calculate();
      });
    });

    tierCards.forEach(function (card) {
      card.addEventListener('click', function () {
        tierCards.forEach(function (c) { c.classList.remove('active'); });
        card.classList.add('active');
        state.proteinTier = card.dataset.tier;
        calculate();
      });
    });

    if (btnQuickOnly) {
      btnQuickOnly.addEventListener('click', function () {
        genderEl.value = 'avg';
        ageEl.value = '28';
        activityEl.value = '1.375';
        calculate();
        if (window.showToast) window.showToast('Using quick height & weight average defaults!', 'info');
      });
    }

    if (btnCopyPlan) {
      btnCopyPlan.addEventListener('click', function () {
        if (!lastCopyText) return;
        navigator.clipboard.writeText(lastCopyText).then(function () {
          btnCopyPlan.textContent = '✅ Plan Copied!';
          setTimeout(function () { btnCopyPlan.textContent = '📋 Copy My Plan'; }, 2000);
        }).catch(function () {});
      });
    }

    calculate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
