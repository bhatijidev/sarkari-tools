// Diff Checker Logic
document.addEventListener('DOMContentLoaded', () => {
  const origText = document.getElementById('origText');
  const modText = document.getElementById('modText');
  const btnCompare = document.getElementById('btnCompare');
  const btnSwap = document.getElementById('btnSwap');
  const btnClear = document.getElementById('btnClear');
  const btnSample = document.getElementById('btnSample');
  const chkIgnoreWhitespace = document.getElementById('chkIgnoreWhitespace');
  const diffResultsWrap = document.getElementById('diffResultsWrap');
  const diffBody = document.getElementById('diffBody');
  const diffStats = document.getElementById('diffStats');

  const sample1 = `function calculateTotal(items) {
  let subtotal = 0;
  for (let i = 0; i < items.length; i++) {
    subtotal += items[i].price;
  }
  const tax = subtotal * 0.05;
  return subtotal + tax;
}`;

  const sample2 = `function calculateTotal(items, discountRate = 0) {
  let subtotal = 0;
  items.forEach(item => {
    subtotal += item.price;
  });
  const discount = subtotal * discountRate;
  const tax = (subtotal - discount) * 0.08;
  return (subtotal - discount) + tax;
}`;

  btnSample.addEventListener('click', () => {
    origText.value = sample1;
    modText.value = sample2;
    runDiff();
  });

  btnSwap.addEventListener('click', () => {
    const tmp = origText.value;
    origText.value = modText.value;
    modText.value = tmp;
    runDiff();
  });

  btnClear.addEventListener('click', () => {
    origText.value = '';
    modText.value = '';
    diffResultsWrap.style.display = 'none';
  });

  btnCompare.addEventListener('click', runDiff);

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function runDiff() {
    let t1 = origText.value;
    let t2 = modText.value;

    if (!t1 && !t2) return;

    let lines1 = t1.split('\n');
    let lines2 = t2.split('\n');

    if (chkIgnoreWhitespace.checked) {
      lines1 = lines1.map(l => l.trimEnd());
      lines2 = lines2.map(l => l.trimEnd());
    }

    // Simple Myers line comparison
    let i = 0, j = 0;
    let addedCount = 0;
    let deletedCount = 0;
    const rows = [];
    let lineNum1 = 1;
    let lineNum2 = 1;

    while (i < lines1.length || j < lines2.length) {
      if (i < lines1.length && j < lines2.length && lines1[i] === lines2[j]) {
        rows.push(`<tr class="diff-same">
          <td class="diff-num">${lineNum1++}</td>
          <td class="diff-num">${lineNum2++}</td>
          <td><pre style="margin:0;">${escapeHtml(lines1[i])}</pre></td>
        </tr>`);
        i++;
        j++;
      } else {
        // Look ahead
        const matchIn2 = lines2.indexOf(lines1[i], j);
        const matchIn1 = lines1.indexOf(lines2[j], i);

        if (i < lines1.length && (matchIn2 === -1 || (matchIn1 !== -1 && matchIn1 <= matchIn2))) {
          rows.push(`<tr class="diff-del">
            <td class="diff-num">${lineNum1++}</td>
            <td class="diff-num">-</td>
            <td><pre style="margin:0;">- ${escapeHtml(lines1[i])}</pre></td>
          </tr>`);
          deletedCount++;
          i++;
        } else if (j < lines2.length) {
          rows.push(`<tr class="diff-add">
            <td class="diff-num">-</td>
            <td class="diff-num">${lineNum2++}</td>
            <td><pre style="margin:0;">+ ${escapeHtml(lines2[j])}</pre></td>
          </tr>`);
          addedCount++;
          j++;
        } else {
          break;
        }
      }
    }

    diffBody.innerHTML = rows.join('');
    diffStats.innerHTML = `<span style="color:#16a34a;">+${addedCount} Additions</span> &nbsp;|&nbsp; <span style="color:#dc2626;">-${deletedCount} Deletions</span>`;
    diffResultsWrap.style.display = 'block';
  }
});
