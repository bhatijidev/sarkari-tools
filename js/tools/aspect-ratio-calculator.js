// Aspect Ratio Calculator Logic
document.addEventListener('DOMContentLoaded', () => {
  const ratioChips = document.querySelectorAll('.ratio-chip');
  const ratioW = document.getElementById('ratioW');
  const ratioH = document.getElementById('ratioH');
  const pixelW = document.getElementById('pixelW');
  const pixelH = document.getElementById('pixelH');
  const ratioShape = document.getElementById('ratioShape');
  const cssSnippet = document.getElementById('cssSnippet');
  const btnCopyCss = document.getElementById('btnCopyCss');

  let activePreset = true;

  function gcd(a, b) {
    return b ? gcd(b, a % b) : a;
  }

  ratioChips.forEach(chip => {
    chip.addEventListener('click', () => {
      ratioChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      ratioW.value = chip.dataset.w;
      ratioH.value = chip.dataset.h;
      scaleFromWidth();
    });
  });

  ratioW.addEventListener('input', () => {
    ratioChips.forEach(c => c.classList.remove('active'));
    scaleFromWidth();
  });
  ratioH.addEventListener('input', () => {
    ratioChips.forEach(c => c.classList.remove('active'));
    scaleFromWidth();
  });

  pixelW.addEventListener('input', scaleFromWidth);
  pixelH.addEventListener('input', scaleFromHeight);

  function scaleFromWidth() {
    const rw = parseFloat(ratioW.value) || 16;
    const rh = parseFloat(ratioH.value) || 9;
    const pw = parseFloat(pixelW.value) || 0;
    if (rw > 0 && pw > 0) {
      pixelH.value = Math.round(pw * (rh / rw));
    }
    updatePreview();
  }

  function scaleFromHeight() {
    const rw = parseFloat(ratioW.value) || 16;
    const rh = parseFloat(ratioH.value) || 9;
    const ph = parseFloat(pixelH.value) || 0;
    if (rh > 0 && ph > 0) {
      pixelW.value = Math.round(ph * (rw / rh));
    }
    updatePreview();
  }

  function updatePreview() {
    const rw = parseFloat(ratioW.value) || 16;
    const rh = parseFloat(ratioH.value) || 9;
    const pw = parseFloat(pixelW.value) || 1920;
    const ph = parseFloat(pixelH.value) || 1080;

    // Scale down to fit in 220x220 container
    const maxBox = 220;
    let shapeW = maxBox;
    let shapeH = maxBox;

    if (rw >= rh) {
      shapeH = Math.round(maxBox * (rh / rw));
    } else {
      shapeW = Math.round(maxBox * (rw / rh));
    }

    ratioShape.style.width = shapeW + 'px';
    ratioShape.style.height = shapeH + 'px';
    ratioShape.textContent = `${rw} : ${rh} (${pw}×${ph})`;

    const paddingPct = ((rh / rw) * 100).toFixed(2);
    cssSnippet.textContent = `/* Modern CSS */\naspect-ratio: ${rw} / ${rh};\n\n/* Legacy Responsive Wrapper */\npadding-top: ${paddingPct}%;`;
  }

  btnCopyCss.addEventListener('click', () => {
    navigator.clipboard.writeText(cssSnippet.textContent).then(() => {
      if (window.showToast) window.showToast('CSS copied!', 'success');
      else alert('CSS copied!');
    });
  });

  updatePreview();
});
