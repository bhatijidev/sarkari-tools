// TDEE & Macro Calculator Logic (Mifflin-St Jeor)
document.addEventListener('DOMContentLoaded', () => {
  const btnUnitUS = document.getElementById('btnUnitUS');
  const btnUnitMetric = document.getElementById('btnUnitMetric');
  const usHeightWrap = document.getElementById('usHeightWrap');
  const metricHeightWrap = document.getElementById('metricHeightWrap');
  const lblWeight = document.getElementById('lblWeight');
  const gender = document.getElementById('gender');
  const age = document.getElementById('age');
  const heightFt = document.getElementById('heightFt');
  const heightIn = document.getElementById('heightIn');
  const heightCm = document.getElementById('heightCm');
  const weight = document.getElementById('weight');
  const activity = document.getElementById('activity');

  const dispTdee = document.getElementById('dispTdee');
  const dispBmr = document.getElementById('dispBmr');
  const dispMildCut = document.getElementById('dispMildCut');
  const dispStdCut = document.getElementById('dispStdCut');
  const dispExtCut = document.getElementById('dispExtCut');
  const dispBulk = document.getElementById('dispBulk');
  const dispMacroProtein = document.getElementById('dispMacroProtein');
  const dispMacroFat = document.getElementById('dispMacroFat');
  const dispMacroCarb = document.getElementById('dispMacroCarb');

  let isMetric = false;

  btnUnitUS.addEventListener('click', () => {
    if (!isMetric) return;
    isMetric = false;
    btnUnitUS.className = 'btn btn-sm btn-primary';
    btnUnitMetric.className = 'btn btn-sm btn-outline';
    usHeightWrap.style.display = 'grid';
    metricHeightWrap.style.display = 'none';
    lblWeight.textContent = 'Weight (lbs)';
    weight.value = Math.round((parseFloat(weight.value) || 75) * 2.20462);
    calculate();
  });

  btnUnitMetric.addEventListener('click', () => {
    if (isMetric) return;
    isMetric = true;
    btnUnitMetric.className = 'btn btn-sm btn-primary';
    btnUnitUS.className = 'btn btn-sm btn-outline';
    usHeightWrap.style.display = 'none';
    metricHeightWrap.style.display = 'block';
    lblWeight.textContent = 'Weight (kg)';
    weight.value = Math.round((parseFloat(weight.value) || 165) / 2.20462);
    calculate();
  });

  [gender, age, heightFt, heightIn, heightCm, weight, activity].forEach(el => {
    el.addEventListener('input', calculate);
  });

  function calculate() {
    let weightKg = parseFloat(weight.value) || 0;
    if (!isMetric) weightKg = weightKg * 0.453592;

    let heightCentimeters = 0;
    if (isMetric) {
      heightCentimeters = parseFloat(heightCm.value) || 0;
    } else {
      const ft = parseFloat(heightFt.value) || 0;
      const inch = parseFloat(heightIn.value) || 0;
      heightCentimeters = (ft * 12 + inch) * 2.54;
    }

    const ageYrs = parseFloat(age.value) || 25;
    const isMale = gender.value === 'male';

    // Mifflin-St Jeor formula:
    // BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age(y) + (male ? +5 : -161)
    let bmr = (10 * weightKg) + (6.25 * heightCentimeters) - (5 * ageYrs) + (isMale ? 5 : -161);
    bmr = Math.max(800, bmr);

    const actMult = parseFloat(activity.value) || 1.375;
    const tdee = Math.round(bmr * actMult);

    dispTdee.textContent = tdee.toLocaleString('en-US');
    dispBmr.textContent = Math.round(bmr).toLocaleString('en-US');

    dispMildCut.textContent = Math.max(1200, tdee - 250).toLocaleString('en-US') + ' kcal';
    const stdCutCal = Math.max(1200, tdee - 500);
    dispStdCut.textContent = stdCutCal.toLocaleString('en-US') + ' kcal';
    dispExtCut.textContent = Math.max(1200, tdee - 1000).toLocaleString('en-US') + ' kcal';
    dispBulk.textContent = (tdee + 300).toLocaleString('en-US') + ' kcal';

    // Standard Cut Macro breakdown (40% Protein, 30% Fat, 30% Carbs)
    // Protein: 4 kcal/g, Fat: 9 kcal/g, Carbs: 4 kcal/g
    const proteinGrams = Math.round((stdCutCal * 0.40) / 4);
    const fatGrams = Math.round((stdCutCal * 0.30) / 9);
    const carbGrams = Math.round((stdCutCal * 0.30) / 4);

    dispMacroProtein.textContent = proteinGrams + 'g';
    dispMacroFat.textContent = fatGrams + 'g';
    dispMacroCarb.textContent = carbGrams + 'g';
  }

  calculate();
});
