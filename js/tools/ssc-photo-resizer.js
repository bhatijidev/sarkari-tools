/* ═══════════════════════════════════════════════════
   AllToolsInOne — SSC Exam Photo & Signature Resizer
   Strict Compliance with Official SSC CGL, CHSL, MTS, GD Guidelines
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

  // SSC Official Specs
  const SSC_SPECS = {
    photoW: 413,
    photoH: 531,
    photoMinKb: 20,
    photoMaxKb: 50,
    signW: 280,
    signH: 120,
    signMinKb: 10,
    signMaxKb: 20
  };

  let photoImg = null;
  let signImg = null;
  let photoBlob = null;
  let signBlob = null;

  // Initialize today's date for DOP
  if (dopText) {
    const today = new Date();
    const d = String(today.getDate()).padStart(2, '0');
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const y = today.getFullYear();
    dopText.value = `${d}/${m}/${y}`;
  }

  // --- PHOTO PROCESSING ---
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
    photoCanvas.width = SSC_SPECS.photoW;
    photoCanvas.height = SSC_SPECS.photoH;

    // Background fill
    ctx.fillStyle = photoBgSelect.value === 'white' ? '#ffffff' : (photoBgSelect.value === 'lightblue' ? '#e0f2fe' : '#ffffff');
    ctx.fillRect(0, 0, SSC_SPECS.photoW, SSC_SPECS.photoH);

    const hasDate = addDateCheckbox.checked;
    const dateStripHeight = hasDate ? 60 : 0;
    const drawHeight = SSC_SPECS.photoH - dateStripHeight;

    // Aspect ratio preserve & center
    const imgRatio = photoImg.width / photoImg.height;
    const targetRatio = SSC_SPECS.photoW / drawHeight;
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

    ctx.drawImage(photoImg, sX, sY, sW, sH, 0, 0, SSC_SPECS.photoW, drawHeight);

    // Name & DOP Strip (SSC Standard)
    if (hasDate) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, drawHeight, SSC_SPECS.photoW, dateStripHeight);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(0, drawHeight, SSC_SPECS.photoW, dateStripHeight);

      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'center';

      const name = candidateName.value.trim() || 'CANDIDATE NAME';
      const dop = dopText.value.trim() ? `DOP: ${dopText.value.trim()}` : '';

      if (name && dop) {
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText(name.toUpperCase(), SSC_SPECS.photoW / 2, drawHeight + 24);
        ctx.font = '600 13px sans-serif';
        ctx.fillText(dop, SSC_SPECS.photoW / 2, drawHeight + 46);
      } else {
        ctx.font = 'bold 17px sans-serif';
        ctx.fillText((name || dop).toUpperCase(), SSC_SPECS.photoW / 2, drawHeight + 35);
      }
    }

    compressToTarget(photoCanvas, parseInt(photoTargetKb.value, 10), SSC_SPECS.photoMinKb, (blob, sizeKb) => {
      photoBlob = blob;
      const isValid = sizeKb >= SSC_SPECS.photoMinKb && sizeKb <= SSC_SPECS.photoMaxKb;
      photoSizeOutput.innerHTML = `
        <span style="color: ${isValid ? '#15803d' : '#b45309'}; font-weight: 700;">
          ${isValid ? '✅ SSC Compliant:' : '⚠️ Size:'} ${sizeKb.toFixed(1)} KB (Target: 20-50 KB)
        </span>
        <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
          Dimensions: ${SSC_SPECS.photoW}×${SSC_SPECS.photoH} px (3.5×4.5 cm)
        </div>
      `;
    });
  }

  // --- SIGNATURE PROCESSING ---
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
    signCanvas.width = SSC_SPECS.signW;
    signCanvas.height = SSC_SPECS.signH;

    // Pure white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, SSC_SPECS.signW, SSC_SPECS.signH);

    // Draw signature centered with padding
    const padding = 12;
    const drawW = SSC_SPECS.signW - (padding * 2);
    const drawH = SSC_SPECS.signH - (padding * 2);

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

    // Apply Ink Enhancement
    const contrast = signContrastSelect.value;
    if (contrast !== 'normal') {
      const imgData = ctx.getImageData(0, 0, SSC_SPECS.signW, SSC_SPECS.signH);
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

    compressToTarget(signCanvas, parseInt(signTargetKb.value, 10), SSC_SPECS.signMinKb, (blob, sizeKb) => {
      signBlob = blob;
      const isValid = sizeKb >= SSC_SPECS.signMinKb && sizeKb <= SSC_SPECS.signMaxKb;
      signSizeOutput.innerHTML = `
        <span style="color: ${isValid ? '#15803d' : '#b45309'}; font-weight: 700;">
          ${isValid ? '✅ SSC Compliant:' : '⚠️ Size:'} ${sizeKb.toFixed(1)} KB (Target: 10-20 KB)
        </span>
        <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
          Dimensions: ${SSC_SPECS.signW}×${SSC_SPECS.signH} px (4.0×2.0 cm)
        </div>
      `;
    });
  }

  // --- COMPRESS TO EXACT KB HELPER ---
  function compressToTarget(canvas, maxKb, minKb, callback) {
    let qMin = 0.05, qMax = 0.98, bestBlob = null, bestSize = 0;
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
    attempt(0.85, 6);
  }

  function checkReadyState() {
    if (photoBlob || signBlob) {
      if (shareArea) shareArea.style.display = 'block';
    }
  }

  // Event Listeners for inputs
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

  // Downloads
  if (downloadPhotoBtn) {
    downloadPhotoBtn.addEventListener('click', () => {
      if (!photoBlob) return;
      const url = URL.createObjectURL(photoBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'SSC_Compliant_Photo.jpg';
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
      a.download = 'SSC_Compliant_Signature.jpg';
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
