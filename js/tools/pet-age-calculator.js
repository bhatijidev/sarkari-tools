// Pet Age Calculator Logic (AVMA standards)
document.addEventListener('DOMContentLoaded', () => {
  const btnPetDog = document.getElementById('btnPetDog');
  const btnPetCat = document.getElementById('btnPetCat');
  const dogSizeWrap = document.getElementById('dogSizeWrap');
  const dogSize = document.getElementById('dogSize');
  const petYears = document.getElementById('petYears');
  const petMonths = document.getElementById('petMonths');
  const petName = document.getElementById('petName');

  const dispPetTitle = document.getElementById('dispPetTitle');
  const dispHumanAge = document.getElementById('dispHumanAge');
  const dispLifeStageBadge = document.getElementById('dispLifeStageBadge');
  const dispStageGuidance = document.getElementById('dispStageGuidance');
  const btnShareCertificate = document.getElementById('btnShareCertificate');

  let petType = 'dog';

  btnPetDog.addEventListener('click', () => {
    petType = 'dog';
    btnPetDog.className = 'btn btn-primary';
    btnPetCat.className = 'btn btn-outline';
    dogSizeWrap.style.display = 'block';
    calculate();
  });

  btnPetCat.addEventListener('click', () => {
    petType = 'cat';
    btnPetCat.className = 'btn btn-primary';
    btnPetDog.className = 'btn btn-outline';
    dogSizeWrap.style.display = 'none';
    calculate();
  });

  [dogSize, petYears, petMonths, petName].forEach(el => el.addEventListener('input', calculate));

  function calculate() {
    const y = parseInt(petYears.value) || 0;
    const m = parseInt(petMonths.value) || 0;
    const totalYears = y + (m / 12);
    const name = petName.value.trim() || (petType === 'dog' ? 'Your Dog' : 'Your Cat');

    dispPetTitle.textContent = `${name.toUpperCase()}'S EQUIVALENT HUMAN AGE`;

    let humanAge = 0;
    let stage = 'Adult';
    let guidance = '';

    if (petType === 'cat') {
      // Cat formula: 1st yr = 15 human yrs, 2nd yr = +9 (24), subsequent yrs = +4 each
      if (totalYears <= 0) humanAge = 0;
      else if (totalYears <= 1) humanAge = totalYears * 15;
      else if (totalYears <= 2) humanAge = 15 + (totalYears - 1) * 9;
      else humanAge = 24 + (totalYears - 2) * 4;

      if (totalYears < 1) { stage = 'Kitten'; guidance = 'Rapid growth phase! Needs high-protein kitten food, vaccinations, and microchipping.'; }
      else if (totalYears < 7) { stage = 'Prime Adult'; guidance = 'Active and healthy. Keep up with dental checkups and annual vaccinations.'; }
      else if (totalYears < 11) { stage = 'Mature / Senior'; guidance = 'Metabolism slows down. Monitor kidney and thyroid health with senior blood panels.'; }
      else { stage = 'Geriatric'; guidance = 'Super senior! Provide orthopedic bedding, joint supplements, and bi-annual vet visits.'; }
    } else {
      // Dog formula based on AVMA breed weights
      const sz = dogSize.value;
      const rateAfterTwo = sz === 'small' ? 4 : (sz === 'medium' ? 5 : (sz === 'large' ? 6 : 7.5));

      if (totalYears <= 0) humanAge = 0;
      else if (totalYears <= 1) humanAge = totalYears * 15;
      else if (totalYears <= 2) humanAge = 15 + (totalYears - 1) * 9; // ~24 at age 2
      else humanAge = 24 + (totalYears - 2) * rateAfterTwo;

      if (totalYears < 1) { stage = 'Puppy'; guidance = 'Puppy training, core vaccinations, and socialization are top priorities.'; }
      else if (totalYears < 6) { stage = 'Adult'; guidance = 'Prime physical condition. Maintain balanced diet, regular exercise, and tick/flea prevention.'; }
      else if (totalYears < (sz === 'giant' ? 7 : 9)) { stage = 'Senior'; guidance = 'Watch for joint stiffness and arthritis. Consider glucosamine and senior dog food.'; }
      else { stage = 'Geriatric'; guidance = 'Cherished senior! Monitor heart and renal function with bi-annual veterinary exams.'; }
    }

    dispHumanAge.textContent = Math.round(humanAge);
    dispLifeStageBadge.textContent = `Life Stage: ${stage}`;
    dispStageGuidance.innerHTML = `<strong>Health &amp; Care Guidance:</strong> ${guidance}`;
  }

  btnShareCertificate.addEventListener('click', () => {
    const text = `🐾 Pet Age Calculation:
${dispPetTitle.textContent}
• Equivalent Human Age: ${dispHumanAge.textContent} years old
• ${dispLifeStageBadge.textContent}
Calculated via AllToolsInOne (https://alltoolsinone.com/tools/pet-age-calculator.html)`;

    navigator.clipboard.writeText(text).then(() => {
      if (window.showToast) window.showToast('Copied to clipboard!', 'success');
      else alert('Copied to clipboard!');
    });
  });

  calculate();
});
