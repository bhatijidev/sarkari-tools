/* ═══════════════════════════════════════════════════
   AllToolsInOne — UPSC Photo & Signature Resizer
   Strict Compliance with Official UPSC OTR (One Time Registration)
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  // Photo Elements
  const photoDropZone = document.getElementById('photoDropZone');
  const photoInput = document.getElementById('photoInput');
  const photoSettingsArea = document.getElementById('photoSettingsArea');
  const photoStatusBadge = document.getElementById('photoStatusBadge');
  const addDateCheckbox = document.getElementById('addDateCheckbox');
  const dateFieldsRow = document.getElementById('dateFieldsRow');
  const candidateName = document.getElementById('candidateName');
  const dopText = document.getElementById('dopText');
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

  // UPSC Official Guidelines: 350x350 to 1000x1000 px, 20 KB to 300 KB
  const UPSC_SPECS = {
    photoW: 500,
    photoH: 500,
    photoMinKb: 20,
    photoMaxKb: 300,
    signW: 500,
    signH: 500,
    signMinKb: 20,
    signMaxKb: 300
  };

  let photoImg = null;
  let signImg = null;
  let photoBlob = null;
  let signBlob = null;

  if (dopText) {
    const today = new Date();
    const d = String(today.getDate()).padStart(2, '0');
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const y = today.getFullYear();
    dopText.value = `${d}/${m}/${y}`;
  }

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
    photoCanvas.width = UPSC_SPECS.photoW;
    photoCanvas.height = UPSC_SPECS.photoH;

    ctx.fillStyle = photoBgSelect.value === 'white' ? '#ffffff' : (photoBgSelect.value === 'lightblue' ? '#e0f2fe' : '#ffffff');
    ctx.fillRect(0, 0, UPSC_SPECS.photoW, UPSC_SPECS.photoH);

    const hasDate = addDateCheckbox.checked;
    const dateStripHeight = hasDate ? 60 : 0;
    const drawHeight = UPSC_SPECS.photoH - dateStripHeight;

    const imgRatio = photoImg.width / photoImg.height;
    const targetRatio = UPSC_SPECS.photoW / drawHeight;
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

    ctx.drawImage(photoImg, sX, sY, sW, sH, 0, 0, UPSC_SPECS.photoW, drawHeight);

    if (hasDate) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, drawHeight, UPSC_SPECS.photoW, dateStripHeight);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(0, drawHeight, UPSC_SPECS.photoW, dateStripHeight);

      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'center';

      const name = candidateName.value.trim() || 'UPSC APPLICANT';
      const dop = dopText.value.trim() ? `DOP: ${dopText.value.trim()}` : '';

      if (name && dop) {
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(name.toUpperCase(), UPSC_SPECS.photoW / 2, drawHeight + 25);
        ctx.font = '600 13px sans-serif';
        ctx.fillText(dop, UPSC_SPECS.photoW / 2, drawHeight + 47);
      } else {
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText((name || dop).toUpperCase(), UPSC_SPECS.photoW / 2, drawHeight + 36);
      }
    }

    compressToTarget(photoCanvas, parseInt(photoTargetKb.value, 10), UPSC_SPECS.photoMinKb, (blob, sizeKb) => {
      photoBlob = blob;
      const isValid = sizeKb >= UPSC_SPECS.photoMinKb && sizeKb <= UPSC_SPECS.photoMaxKb;
      photoSizeOutput.innerHTML = `
        <span style="color: ${isValid ? '#15803d' : '#b45309'}; font-weight: 700;">
          ${isValid ? '✅ UPSC OTR Compliant:' : '⚠️ Size:'} ${sizeKb.toFixed(1)} KB (Target: 20-300 KB)
        </span>
        <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
          Dimensions: ${UPSC_SPECS.photoW}×${UPSC_SPECS.photoH} px (1:1 Square)
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
    signCanvas.width = UPSC_SPECS.signW;
    signCanvas.height = UPSC_SPECS.signH;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, UPSC_SPECS.signW, UPSC_SPECS.signH);

    const padding = 24;
    const drawW = UPSC_SPECS.signW - (padding * 2);
    const drawH = UPSC_SPECS.signH - (padding * 2);

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
      const imgData = ctx.getImageData(0, 0, UPSC_SPECS.signW, UPSC_SPECS.signH);
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

    compressToTarget(signCanvas, parseInt(signTargetKb.value, 10), UPSC_SPECS.signMinKb, (blob, sizeKb) => {
      signBlob = blob;
      const isValid = sizeKb >= UPSC_SPECS.signMinKb && sizeKb <= UPSC_SPECS.signMaxKb;
      signSizeOutput.innerHTML = `
        <span style="color: ${isValid ? '#15803d' : '#b45309'}; font-weight: 700;">
          ${isValid ? '✅ UPSC OTR Compliant:' : '⚠️ Size:'} ${sizeKb.toFixed(1)} KB (Target: 20-300 KB)
        </span>
        <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
          Dimensions: ${UPSC_SPECS.signW}×${UPSC_SPECS.signH} px (1:1 Square)
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

  if (addDateCheckbox) {
    addDateCheckbox.addEventListener('change', () => {
      if (dateFieldsRow) dateFieldsRow.style.display = addDateCheckbox.checked ? 'flex' : 'none';
      processPhoto();
    });
  }
  [candidateName, dopText, photoBgSelect, photoTargetKb].forEach(el => {
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
      a.download = 'UPSC_Compliant_Photo.jpg';
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
      a.download = 'UPSC_Compliant_Signature.jpg';
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
