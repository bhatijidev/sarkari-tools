// US Mortgage Calculator - Client-side Interactive Logic
document.addEventListener('DOMContentLoaded', () => {
  const homePrice = document.getElementById('homePrice');
  const downPaymentAmt = document.getElementById('downPaymentAmt');
  const downPaymentPct = document.getElementById('downPaymentPct');
  const loanTerm = document.getElementById('loanTerm');
  const interestRate = document.getElementById('interestRate');
  const propertyTaxRate = document.getElementById('propertyTaxRate');
  const homeInsurance = document.getElementById('homeInsurance');
  const pmiRate = document.getElementById('pmiRate');
  const hoaFee = document.getElementById('hoaFee');
  const extraPayment = document.getElementById('extraPayment');

  const dispTotalMonthly = document.getElementById('dispTotalMonthly');
  const dispPmiStatus = document.getElementById('dispPmiStatus');
  const dispPI = document.getElementById('dispPI');
  const dispTax = document.getElementById('dispTax');
  const dispIns = document.getElementById('dispIns');
  const dispPmi = document.getElementById('dispPmi');
  const dispHoa = document.getElementById('dispHoa');
  const dispLoanAmt = document.getElementById('dispLoanAmt');
  const dispTotalInterest = document.getElementById('dispTotalInterest');
  const dispTotalCost = document.getElementById('dispTotalCost');
  const dispPayoffDate = document.getElementById('dispPayoffDate');
  const extraSavingsBox = document.getElementById('extraSavingsBox');
  const dispInterestSaved = document.getElementById('dispInterestSaved');
  const dispYearsSaved = document.getElementById('dispYearsSaved');

  const donutSvg = document.getElementById('donutSvg');
  const scheduleBody = document.getElementById('scheduleBody');
  const btnScheduleYearly = document.getElementById('btnScheduleYearly');
  const btnScheduleMonthly = document.getElementById('btnScheduleMonthly');
  const btnCopyMortgage = document.getElementById('btnCopyMortgage');
  const btnPrintSchedule = document.getElementById('btnPrintSchedule');

  let scheduleMode = 'yearly';

  function formatUSD(num) {
    return '$' + Math.round(num).toLocaleString('en-US');
  }

  function syncDownPayment(fromAmt) {
    const price = parseFloat(homePrice.value) || 0;
    if (price <= 0) return;
    if (fromAmt) {
      const amt = parseFloat(downPaymentAmt.value) || 0;
      downPaymentPct.value = ((amt / price) * 100).toFixed(1);
    } else {
      const pct = parseFloat(downPaymentPct.value) || 0;
      downPaymentAmt.value = Math.round(price * (pct / 100));
    }
  }

  homePrice.addEventListener('input', () => { syncDownPayment(false); calculate(); });
  downPaymentAmt.addEventListener('input', () => { syncDownPayment(true); calculate(); });
  downPaymentPct.addEventListener('input', () => { syncDownPayment(false); calculate(); });
  [loanTerm, interestRate, propertyTaxRate, homeInsurance, pmiRate, hoaFee, extraPayment].forEach(el => {
    el.addEventListener('input', calculate);
  });

  btnScheduleYearly.addEventListener('click', () => {
    scheduleMode = 'yearly';
    btnScheduleYearly.className = 'btn btn-sm btn-primary';
    btnScheduleMonthly.className = 'btn btn-sm btn-outline';
    calculate();
  });

  btnScheduleMonthly.addEventListener('click', () => {
    scheduleMode = 'monthly';
    btnScheduleMonthly.className = 'btn btn-sm btn-primary';
    btnScheduleYearly.className = 'btn btn-sm btn-outline';
    calculate();
  });

  function renderDonut(segments) {
    const total = segments.reduce((sum, s) => sum + s.val, 0);
    if (total <= 0) return;
    let accumulated = 0;
    const r = 50;
    const cx = 70;
    const cy = 70;
    const circumference = 2 * Math.PI * r;

    let svgHtml = '';
    segments.forEach(s => {
      const ratio = s.val / total;
      const strokeLength = ratio * circumference;
      const strokeDashoffset = -(accumulated * circumference);
      svgHtml += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${s.color}" stroke-width="24" stroke-dasharray="${strokeLength} ${circumference}" stroke-dashoffset="${strokeDashoffset}"></circle>`;
      accumulated += ratio;
    });

    donutSvg.innerHTML = svgHtml;
  }

  function calculate() {
    const price = parseFloat(homePrice.value) || 0;
    const downAmt = parseFloat(downPaymentAmt.value) || 0;
    const principal = Math.max(0, price - downAmt);
    const years = parseInt(loanTerm.value) || 30;
    const totalMonths = years * 12;
    const annualRate = (parseFloat(interestRate.value) || 0) / 100;
    const monthlyRate = annualRate / 12;
    const taxRate = (parseFloat(propertyTaxRate.value) || 0) / 100;
    const monthlyTax = (price * taxRate) / 12;
    const monthlyIns = (parseFloat(homeInsurance.value) || 0) / 12;
    const monthlyHoa = parseFloat(hoaFee.value) || 0;
    const extra = parseFloat(extraPayment.value) || 0;

    // PMI check: If down payment < 20%
    const isPmiApplicable = (downAmt / price) < 0.20 && principal > 0;
    const monthlyPmi = isPmiApplicable ? (principal * ((parseFloat(pmiRate.value) || 0.75) / 100)) / 12 : 0;

    // Monthly Principal & Interest: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]
    let basePI = 0;
    if (monthlyRate > 0 && principal > 0) {
      basePI = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else if (principal > 0) {
      basePI = principal / totalMonths;
    }

    const totalMonthly = basePI + monthlyTax + monthlyIns + monthlyPmi + monthlyHoa;

    dispTotalMonthly.textContent = formatUSD(totalMonthly);
    dispPI.textContent = formatUSD(basePI);
    dispTax.textContent = formatUSD(monthlyTax);
    dispIns.textContent = formatUSD(monthlyIns);
    dispPmi.textContent = formatUSD(monthlyPmi);
    dispHoa.textContent = formatUSD(monthlyHoa);
    dispLoanAmt.textContent = formatUSD(principal);

    if (isPmiApplicable) {
      dispPmiStatus.innerHTML = `⚠️ Includes estimated ${formatUSD(monthlyPmi)}/mo PMI (Down &lt; 20%)`;
      dispPmiStatus.style.color = '#d97706';
    } else {
      dispPmiStatus.innerHTML = `✅ No PMI required (${( (downAmt/price)*100 ).toFixed(0)}% Down)`;
      dispPmiStatus.style.color = '#16a34a';
    }

    renderDonut([
      { val: basePI, color: '#2563eb' },
      { val: monthlyTax, color: '#10b981' },
      { val: monthlyIns, color: '#f59e0b' },
      { val: monthlyPmi, color: '#ef4444' },
      { val: monthlyHoa, color: '#8b5cf6' }
    ]);

    // Amortization Schedule & Extra Payment Simulation
    let balance = principal;
    let balanceWithExtra = principal;
    let totalInterestBase = 0;
    let totalInterestWithExtra = 0;
    let monthsToPayoffWithExtra = totalMonths;
    let payoffRecorded = false;

    const rows = [];
    let curYearPrincipal = 0;
    let curYearInterest = 0;
    let curYearPayment = 0;
    let curYear = 1;

    for (let m = 1; m <= totalMonths; m++) {
      const interestMonth = balance * monthlyRate;
      let principalMonth = basePI - interestMonth;
      if (balance - principalMonth < 0) principalMonth = balance;
      balance = Math.max(0, balance - principalMonth);
      totalInterestBase += interestMonth;

      // Extra simulation
      if (balanceWithExtra > 0) {
        const intEx = balanceWithExtra * monthlyRate;
        totalInterestWithExtra += intEx;
        let prinEx = (basePI + extra) - intEx;
        if (balanceWithExtra - prinEx < 0) prinEx = balanceWithExtra;
        balanceWithExtra = Math.max(0, balanceWithExtra - prinEx);
        if (balanceWithExtra <= 0 && !payoffRecorded) {
          monthsToPayoffWithExtra = m;
          payoffRecorded = true;
        }
      }

      curYearPrincipal += principalMonth;
      curYearInterest += interestMonth;
      curYearPayment += (principalMonth + interestMonth);

      if (scheduleMode === 'monthly') {
        rows.push(`<tr>
          <td>Month ${m}</td>
          <td>${formatUSD(principalMonth + interestMonth)}</td>
          <td style="color:#2563eb; font-weight:600;">${formatUSD(principalMonth)}</td>
          <td style="color:#d97706;">${formatUSD(interestMonth)}</td>
          <td>${formatUSD(balance)}</td>
        </tr>`);
      } else if (m % 12 === 0 || m === totalMonths) {
        rows.push(`<tr>
          <td>Year ${curYear}</td>
          <td>${formatUSD(curYearPayment)}</td>
          <td style="color:#2563eb; font-weight:600;">${formatUSD(curYearPrincipal)}</td>
          <td style="color:#d97706;">${formatUSD(curYearInterest)}</td>
          <td>${formatUSD(balance)}</td>
        </tr>`);
        curYear++;
        curYearPrincipal = 0;
        curYearInterest = 0;
        curYearPayment = 0;
      }
    }

    dispTotalInterest.textContent = formatUSD(totalInterestBase);
    dispTotalCost.textContent = formatUSD(principal + totalInterestBase);

    const now = new Date();
    const payoffDate = new Date(now.getFullYear(), now.getMonth() + (extra > 0 ? monthsToPayoffWithExtra : totalMonths));
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    dispPayoffDate.textContent = `${monthNames[payoffDate.getMonth()]} ${payoffDate.getFullYear()}`;

    if (extra > 0 && monthsToPayoffWithExtra < totalMonths) {
      const savedInt = Math.max(0, totalInterestBase - totalInterestWithExtra);
      const savedYears = ((totalMonths - monthsToPayoffWithExtra) / 12).toFixed(1);
      dispInterestSaved.textContent = formatUSD(savedInt);
      dispYearsSaved.textContent = `${savedYears} years`;
      extraSavingsBox.style.display = 'block';
    } else {
      extraSavingsBox.style.display = 'none';
    }

    scheduleBody.innerHTML = rows.join('');
  }

  btnCopyMortgage.addEventListener('click', () => {
    const summary = `🏡 US Mortgage Calculation Summary
• Home Price: ${homePrice.value} | Down: ${downPaymentAmt.value} (${downPaymentPct.value}%)
• Loan Term: ${loanTerm.value} Years @ ${interestRate.value}% APR
• Estimated Total Monthly: ${dispTotalMonthly.textContent}
• Principal & Interest: ${dispPI.textContent}
• Property Tax: ${dispTax.textContent} | Insurance: ${dispIns.textContent}
• Total Loan Interest: ${dispTotalInterest.textContent}
Calculated via AllToolsInOne (https://alltoolsinone.com/tools/mortgage-calculator.html)`;

    navigator.clipboard.writeText(summary).then(() => {
      if (window.showToast) window.showToast('Mortgage summary copied to clipboard!', 'success');
      else alert('Mortgage summary copied to clipboard!');
    });
  });

  btnPrintSchedule.addEventListener('click', () => {
    window.print();
  });

  syncDownPayment(false);
  calculate();
});
