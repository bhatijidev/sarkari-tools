// Tip Calculator & Bill Splitter Logic
document.addEventListener('DOMContentLoaded', () => {
  const billAmount = document.getElementById('billAmount');
  const currencySelect = document.getElementById('currencySelect');
  const tipChips = document.querySelectorAll('.tip-chip');
  const customTip = document.getElementById('customTip');
  const numPeople = document.getElementById('numPeople');
  const btnPersonMinus = document.getElementById('btnPersonMinus');
  const btnPersonPlus = document.getElementById('btnPersonPlus');
  const roundingRadios = document.querySelectorAll('input[name="rounding"]');

  const dispBillSubtotal = document.getElementById('dispBillSubtotal');
  const dispTipPercent = document.getElementById('dispTipPercent');
  const dispTotalTip = document.getElementById('dispTotalTip');
  const dispGrandTotal = document.getElementById('dispGrandTotal');
  const dispPeopleCount = document.getElementById('dispPeopleCount');
  const dispTipPerPerson = document.getElementById('dispTipPerPerson');
  const dispTotalPerPerson = document.getElementById('dispTotalPerPerson');
  const btnCopyReceipt = document.getElementById('btnCopyReceipt');
  const btnShareWa = document.getElementById('btnShareWa');

  let activeTip = 18;

  function fmt(val) {
    const sym = currencySelect.value;
    return sym + val.toFixed(2);
  }

  tipChips.forEach(chip => {
    chip.addEventListener('click', () => {
      tipChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeTip = parseFloat(chip.dataset.tip);
      customTip.value = activeTip;
      calculate();
    });
  });

  customTip.addEventListener('input', () => {
    tipChips.forEach(c => c.classList.remove('active'));
    activeTip = Math.max(0, parseFloat(customTip.value) || 0);
    calculate();
  });

  btnPersonMinus.addEventListener('click', () => {
    let p = parseInt(numPeople.value) || 1;
    if (p > 1) { numPeople.value = p - 1; calculate(); }
  });

  btnPersonPlus.addEventListener('click', () => {
    let p = parseInt(numPeople.value) || 1;
    numPeople.value = p + 1; calculate();
  });

  [billAmount, currencySelect, numPeople].forEach(el => el.addEventListener('input', calculate));
  roundingRadios.forEach(r => r.addEventListener('change', calculate));

  function calculate() {
    const bill = Math.max(0, parseFloat(billAmount.value) || 0);
    const people = Math.max(1, parseInt(numPeople.value) || 1);
    let rounding = 'none';
    roundingRadios.forEach(r => { if (r.checked) rounding = r.value; });

    let tipAmt = bill * (activeTip / 100);
    let total = bill + tipAmt;

    if (rounding === 'tip') {
      tipAmt = Math.ceil(tipAmt);
      total = bill + tipAmt;
    } else if (rounding === 'total') {
      total = Math.ceil(total);
      tipAmt = total - bill;
    }

    const tipPerPerson = tipAmt / people;
    const totalPerPerson = total / people;

    dispBillSubtotal.textContent = fmt(bill);
    dispTipPercent.textContent = activeTip + '%';
    dispTotalTip.textContent = fmt(tipAmt);
    dispGrandTotal.textContent = fmt(total);
    dispPeopleCount.textContent = people;
    dispTipPerPerson.textContent = fmt(tipPerPerson);
    dispTotalPerPerson.textContent = fmt(totalPerPerson);
  }

  btnCopyReceipt.addEventListener('click', () => {
    const sym = currencySelect.value;
    const text = `🧾 Restaurant Bill Split Summary:
• Subtotal: ${dispBillSubtotal.textContent}
• Tip (${dispTipPercent.textContent}): ${dispTotalTip.textContent}
• Grand Total: ${dispGrandTotal.textContent}
• Split for ${numPeople.value} people:
• EACH PAYS: ${dispTotalPerPerson.textContent} (${dispTipPerPerson.textContent} tip each)
Calculated via AllToolsInOne (https://alltoolsinone.com/tools/tip-calculator.html)`;

    navigator.clipboard.writeText(text).then(() => {
      if (window.showToast) window.showToast('Receipt breakdown copied to clipboard!', 'success');
      else alert('Copied to clipboard!');
    });
  });

  btnShareWa.addEventListener('click', () => {
    const msg = encodeURIComponent(`Hey! Here is our bill split breakdown:
Bill Total: ${dispGrandTotal.textContent}
Split (${numPeople.value} people): Each pays ${dispTotalPerPerson.textContent}
Calculated via https://alltoolsinone.com/tools/tip-calculator.html`);
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
  });

  calculate();
});
