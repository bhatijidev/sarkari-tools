/* ═══════════════════════════════════════════════════
   AllToolsInOne — Railway RRB Photo & Signature Resizer
   Strict Compliance with Official RRB NTPC, ALP, Group D Guidelines
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  // Photo Elements
  const photoDropZone = document.getElementById('photoDropZone');
  const photoInput = document.getElementById('photoInput');
  const photoSettingsArea = document.getElementById('photoSettingsArea');
  const photoStatusBadge = document.getElementById('photoStatusBadge');
  const photoBgSelect = document.getElementById('photoBgSelect');
  const photoTargetKb = document.getElementById('photoTargetKb');
  const photoCanvas = document.getElementById('photoCanvas');
  const photoSizeOutput = document.getElementById('photoSizeOutput');
  const downloadPhotoBtn = document.getElementById('downloadPhotoBtn');

  // Signature Elements
  const signDropZone = document.getElementById('signDropZone');
  const signInput = document.getElementById('signInput');
  const signSettingsArea = document.getElementById('signSettingsArea');
  const signStatusBadge = document.getElementById('signStatusBadge');
  const signContrastSelect = document.getElementById('signContrastSelect');
  const signTargetKb = document.getElementById('signTargetKb');
  const signCanvas = document.getElementById('signCanvas');
  const signSizeOutput = document.getElementById('signSizeOutput');
  const downloadSignBtn = document.getElementById('downloadSignBtn');

  // Master Action
  const downloadBothBtn = document.getElementById('downloadBothBtn');
  const shareArea = document.getElementById('shareArea');

  // RRB Official Specs: Photo 35x45 mm (350x450 px), 30 KB to 70 KB. Sign 300x100 px, 30 KB to 70 KB.
  const RRB_SPECS = {
    photoW: 350,
    photoH: 450,
    photoMinKb: 30,
    photoMaxKb: 70,
    signW: 300,
    signH: 100,
    signMinKb: 30,
    signMaxKb: 70
  };

  let photoImg = null;
  let signImg = null;
  let photoBlob = null;
  let signBlob = null;

  // --- PHOTO ---
  if (photoDropZone && photoInput) {
    photoDropZone.addEventListener('click', () => photoInput.click());
    photoDropZone.addEventListener('dragover', (e) => { e.preventDefault(); photoDropZone.classList.add('dragover'); });
    photoDropZone.addEventListener('dragleave', () => photoDropZone.classList.remove('dragover'));
    photoDropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      photoDropZone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) handlePhotoFile(e.dataTransfer.files[0]);
    });
    photoInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) handlePhotoFile(e.target.files[0]);
    });
  }

  function handlePhotoFile(file) {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      photoImg = new Image();
      photoImg.onload = () => {
        photoSettingsArea.style.display = 'block';
        photoStatusBadge.textContent = 'Photo Ready';
        photoStatusBadge.style.color = '#15803d';
        photoStatusBadge.style.background = '#dcfce7';
        processPhoto();
        checkReadyState();
      };
      photoImg.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function processPhoto() {
    if (!photoImg || !photoCanvas) return;
    const ctx = photoCanvas.getContext('2d');
    photoCanvas.width = RRB_SPECS.photoW;
    photoCanvas.height = RRB_SPECS.photoH;

    ctx.fillStyle = photoBgSelect.value === 'white' ? '#ffffff' : (photoBgSelect.value === 'lightblue' ? '#e0f2fe' : '#ffffff');
    ctx.fillRect(0, 0, RRB_SPECS.photoW, RRB_SPECS.photoH);

    const imgRatio = photoImg.width / photoImg.height;
    const targetRatio = RRB_SPECS.photoW / RRB_SPECS.photoH;
    let sW, sH, sX, sY;

    if (imgRatio > targetRatio) {
      sH = photoImg.height;
      sW = photoImg.height * targetRatio;
      sX = (photoImg.width - sW) / 2;
      sY = 0;
    } else {
      sW = photoImg.width;
      sH = photoImg.width / targetRatio;
      sX = 0;
      sY = (photoImg.height - sH) / 2;
    }

    ctx.drawImage(photoImg, sX, sY, sW, sH, 0, 0, RRB_SPECS.photoW, RRB_SPECS.photoH);

    compressToTarget(photoCanvas, parseInt(photoTargetKb.value, 10), RRB_SPECS.photoMinKb, (blob, sizeKb) => {
      photoBlob = blob;
      const isValid = sizeKb >= RRB_SPECS.photoMinKb && sizeKb <= RRB_SPECS.photoMaxKb;
      photoSizeOutput.innerHTML = `
        <span style="color: ${isValid ? '#15803d' : '#b45309'}; font-weight: 700;">
          ${isValid ? '✅ RRB Compliant:' : '⚠️ Size:'} ${sizeKb.toFixed(1)} KB (Target: 30-70 KB)
        </span>
        <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
          Dimensions: ${RRB_SPECS.photoW}×${RRB_SPECS.photoH} px (35×45 mm)
        </div>
      `;
    });
  }

  // --- SIGNATURE ---
  if (signDropZone && signInput) {
    signDropZone.addEventListener('click', () => signInput.click());
    signDropZone.addEventListener('dragover', (e) => { e.preventDefault(); signDropZone.classList.add('dragover'); });
    signDropZone.addEventListener('dragleave', () => signDropZone.classList.remove('dragover'));
    signDropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      signDropZone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) handleSignFile(e.dataTransfer.files[0]);
    });
    signInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) handleSignFile(e.target.files[0]);
    });
  }

  function handleSignFile(file) {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      signImg = new Image();
      signImg.onload = () => {
        signSettingsArea.style.display = 'block';
        signStatusBadge.textContent = 'Signature Ready';
        signStatusBadge.style.color = '#15803d';
        signStatusBadge.style.background = '#dcfce7';
        processSignature();
        checkReadyState();
      };
      signImg.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function processSignature() {
    if (!signImg || !signCanvas) return;
    const ctx = signCanvas.getContext('2d');
    signCanvas.width = RRB_SPECS.signW;
    signCanvas.height = RRB_SPECS.signH;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, RRB_SPECS.signW, RRB_SPECS.signH);

    const padding = 10;
    const drawW = RRB_SPECS.signW - (padding * 2);
    const drawH = RRB_SPECS.signH - (padding * 2);

    const imgRatio = signImg.width / signImg.height;
    const targetRatio = drawW / drawH;
    let dW, dH;

    if (imgRatio > targetRatio) {
      dW = drawW;
      dH = drawW / imgRatio;
    } else {
      dH = drawH;
      dW = drawH * imgRatio;
    }

    const dX = padding + (drawW - dW) / 2;
    const dY = padding + (drawH - dH) / 2;
    ctx.drawImage(signImg, dX, dY, dW, dH);

    const contrast = signContrastSelect.value;
    if (contrast !== 'normal') {
      const imgData = ctx.getImageData(0, 0, RRB_SPECS.signW, RRB_SPECS.signH);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i + 1], b = data[i + 2];
        let gray = 0.299 * r + 0.587 * g + 0.114 * b;
        if (contrast === 'boost') {
          if (gray > 200) { r = 255; g = 255; b = 255; }
          else { r = Math.max(0, r * 0.7); g = Math.max(0, g * 0.7); b = Math.max(0, b * 0.7); }
        } else if (contrast === 'pure_bw') {
          const val = gray < 170 ? 0 : 255;
          r = val; g = val; b = val;
        }
        data[i] = r; data[i + 1] = g; data[i + 2] = b;
      }
      ctx.putImageData(imgData, 0, 0);
    }

    compressToTarget(signCanvas, parseInt(signTargetKb.value, 10), RRB_SPECS.signMinKb, (blob, sizeKb) => {
      signBlob = blob;
      const isValid = sizeKb >= RRB_SPECS.signMinKb && sizeKb <= RRB_SPECS.signMaxKb;
      signSizeOutput.innerHTML = `
        <span style="color: ${isValid ? '#15803d' : '#b45309'}; font-weight: 700;">
          ${isValid ? '✅ RRB Compliant:' : '⚠️ Size:'} ${sizeKb.toFixed(1)} KB (Target: 30-70 KB)
        </span>
        <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
          Dimensions: ${RRB_SPECS.signW}×${RRB_SPECS.signH} px
        </div>
      `;
    });
  }

  function compressToTarget(canvas, maxKb, minKb, callback) {
    let qMin = 0.1, qMax = 0.98, bestBlob = null, bestSize = 0;
    function attempt(q, iterations) {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const sizeKb = blob.size / 1024;
        bestBlob = blob;
        bestSize = sizeKb;

        if (iterations <= 0 || (sizeKb <= maxKb && sizeKb >= minKb)) {
          callback(bestBlob, bestSize);
          return;
        }

        if (sizeKb > maxKb) {
          qMax = q;
          attempt((qMin + qMax) / 2, iterations - 1);
        } else if (sizeKb < minKb && q < 0.95) {
          qMin = q;
          attempt((qMin + qMax) / 2, iterations - 1);
        } else {
          callback(bestBlob, bestSize);
        }
      }, 'image/jpeg', q);
    }
    attempt(0.9, 6);
  }

  function checkReadyState() {
    if (photoBlob || signBlob) {
      if (shareArea) shareArea.style.display = 'block';
    }
  }

  [photoBgSelect, photoTargetKb].forEach(el => {
    if (el) el.addEventListener('input', processPhoto);
  });
  [signContrastSelect, signTargetKb].forEach(el => {
    if (el) el.addEventListener('change', processSignature);
  });

  if (downloadPhotoBtn) {
    downloadPhotoBtn.addEventListener('click', () => {
      if (!photoBlob) return;
      const url = URL.createObjectURL(photoBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'RRB_Compliant_Photo.jpg';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  if (downloadSignBtn) {
    downloadSignBtn.addEventListener('click', () => {
      if (!signBlob) return;
      const url = URL.createObjectURL(signBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'RRB_Compliant_Signature.jpg';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  if (downloadBothBtn) {
    downloadBothBtn.addEventListener('click', () => {
      if (downloadPhotoBtn && photoBlob) downloadPhotoBtn.click();
      setTimeout(() => {
        if (downloadSignBtn && signBlob) downloadSignBtn.click();
      }, 500);
    });
  }

})();
