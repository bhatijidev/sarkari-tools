// Hourly to Salary Paycheck Calculator
document.addEventListener('DOMContentLoaded', () => {
  const hourlyRate = document.getElementById('hourlyRate');
  const hoursPerWeek = document.getElementById('hoursPerWeek');
  const weeksPerYear = document.getElementById('weeksPerYear');
  const overtimeHours = document.getElementById('overtimeHours');
  const overtimeRate = document.getElementById('overtimeRate');
  const taxEstimateToggle = document.getElementById('taxEstimateToggle');
  const fedTaxRate = document.getElementById('fedTaxRate');
  const stateTaxRate = document.getElementById('stateTaxRate');
  const taxInputsWrap = document.getElementById('taxInputsWrap');

  const dispAnnualGross = document.getElementById('dispAnnualGross');
  const dispNetTakeHomeBadge = document.getElementById('dispNetTakeHomeBadge');
  const dispGrossHourly = document.getElementById('dispGrossHourly');
  const dispNetHourly = document.getElementById('dispNetHourly');
  const dispGrossDaily = document.getElementById('dispGrossDaily');
  const dispNetDaily = document.getElementById('dispNetDaily');
  const dispGrossWeekly = document.getElementById('dispGrossWeekly');
  const dispNetWeekly = document.getElementById('dispNetWeekly');
  const dispGrossBiweekly = document.getElementById('dispGrossBiweekly');
  const dispNetBiweekly = document.getElementById('dispNetBiweekly');
  const dispGrossSemimonthly = document.getElementById('dispGrossSemimonthly');
  const dispNetSemimonthly = document.getElementById('dispNetSemimonthly');
  const dispGrossMonthly = document.getElementById('dispGrossMonthly');
  const dispNetMonthly = document.getElementById('dispNetMonthly');
  const btnCopyPaycheck = document.getElementById('btnCopyPaycheck');

  function fmt(val) {
    return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  [hourlyRate, hoursPerWeek, weeksPerYear, overtimeHours, overtimeRate, fedTaxRate, stateTaxRate].forEach(el => {
    el.addEventListener('input', calculate);
  });

  taxEstimateToggle.addEventListener('change', () => {
    taxInputsWrap.style.display = taxEstimateToggle.checked ? 'grid' : 'none';
    calculate();
  });

  function calculate() {
    const rate = Math.max(0, parseFloat(hourlyRate.value) || 0);
    const regularHours = Math.max(0, parseFloat(hoursPerWeek.value) || 0);
    const weeks = parseInt(weeksPerYear.value) || 52;
    const otHours = Math.max(0, parseFloat(overtimeHours.value) || 0);
    const otMult = parseFloat(overtimeRate.value) || 1.5;

    const weeklyRegularPay = rate * regularHours;
    const weeklyOtPay = (rate * otMult) * otHours;
    const weeklyGross = weeklyRegularPay + weeklyOtPay;
    const annualGross = weeklyGross * weeks;

    // Deductions: 7.65% FICA + Fed + State
    let totalTaxPct = 0;
    if (taxEstimateToggle.checked) {
      const fica = 0.0765;
      const fed = (parseFloat(fedTaxRate.value) || 0) / 100;
      const state = (parseFloat(stateTaxRate.value) || 0) / 100;
      totalTaxPct = fica + fed + state;
    }

    const netFactor = Math.max(0, 1 - totalTaxPct);
    const annualNet = annualGross * netFactor;

    dispAnnualGross.textContent = fmt(annualGross);
    if (taxEstimateToggle.checked) {
      dispNetTakeHomeBadge.textContent = `Est. Take-Home: ${fmt(annualNet)} / yr (${(totalTaxPct*100).toFixed(1)}% total tax)`;
      dispNetTakeHomeBadge.style.display = 'block';
    } else {
      dispNetTakeHomeBadge.style.display = 'none';
    }

    // Frequencies
    dispGrossHourly.textContent = fmt(rate);
    dispNetHourly.textContent = fmt(rate * netFactor);

    dispGrossDaily.textContent = fmt(rate * 8);
    dispNetDaily.textContent = fmt(rate * 8 * netFactor);

    dispGrossWeekly.textContent = fmt(weeklyGross);
    dispNetWeekly.textContent = fmt(weeklyGross * netFactor);

    dispGrossBiweekly.textContent = fmt(weeklyGross * 2);
    dispNetBiweekly.textContent = fmt(weeklyGross * 2 * netFactor);

    dispGrossSemimonthly.textContent = fmt(annualGross / 24);
    dispNetSemimonthly.textContent = fmt(annualNet / 24);

    dispGrossMonthly.textContent = fmt(annualGross / 12);
    dispNetMonthly.textContent = fmt(annualNet / 12);
  }

  btnCopyPaycheck.addEventListener('click', () => {
    const text = `💼 Hourly to Salary Paycheck Summary:
• Hourly Wage: ${dispGrossHourly.textContent}/hr
• Annual Gross Salary: ${dispAnnualGross.textContent}
• Bi-Weekly Gross: ${dispGrossBiweekly.textContent} | Net: ${dispNetBiweekly.textContent}
• Monthly Gross: ${dispGrossMonthly.textContent} | Net: ${dispNetMonthly.textContent}
Calculated via AllToolsInOne (https://alltoolsinone.com/tools/paycheck-calculator.html)`;

    navigator.clipboard.writeText(text).then(() => {
      if (window.showToast) window.showToast('Paycheck summary copied!', 'success');
      else alert('Paycheck summary copied!');
    });
  });

  calculate();
});
