/* ═══════════════════════════════════════════════════
   PDF PASSWORD PROTECT & UNLOCK TOOL
   100% Client-Side AES-256 / RC4 Encryption & Decryption
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  const tabProtectMode = document.getElementById('tabProtectMode');
  const tabUnlockMode = document.getElementById('tabUnlockMode');
  const protectSection = document.getElementById('protectSection');
  const unlockSection = document.getElementById('unlockSection');

  // Protect Elements
  const protectDropZone = document.getElementById('protectDropZone');
  const protectFileInput = document.getElementById('protectFileInput');
  const protectFormArea = document.getElementById('protectFormArea');
  const protectFileName = document.getElementById('protectFileName');
  const pdfUserPass = document.getElementById('pdfUserPass');
  const toggleProtectPass = document.getElementById('toggleProtectPass');
  const btnEncryptPdf = document.getElementById('btnEncryptPdf');

  // Unlock Elements
  const unlockDropZone = document.getElementById('unlockDropZone');
  const unlockFileInput = document.getElementById('unlockFileInput');
  const unlockFormArea = document.getElementById('unlockFormArea');
  const unlockFileName = document.getElementById('unlockFileName');
  const pdfUnlockPass = document.getElementById('pdfUnlockPass');
  const toggleUnlockPass = document.getElementById('toggleUnlockPass');
  const btnDecryptPdf = document.getElementById('btnDecryptPdf');

  let protectBuffer = null;
  let protectFile = null;

  let unlockBuffer = null;
  let unlockFile = null;

  // ───────── Tab Switching ─────────
  tabProtectMode.addEventListener('click', () => {
    tabProtectMode.className = 'btn btn-primary';
    tabUnlockMode.className = 'btn btn-outline';
    protectSection.style.display = 'block';
    unlockSection.style.display = 'none';
  });

  tabUnlockMode.addEventListener('click', () => {
    tabUnlockMode.className = 'btn btn-primary';
    tabProtectMode.className = 'btn btn-outline';
    protectSection.style.display = 'none';
    unlockSection.style.display = 'block';
  });

  // ───────── Password Visibility Toggles ─────────
  if (toggleProtectPass) {
    toggleProtectPass.addEventListener('click', () => {
      const isPass = pdfUserPass.type === 'password';
      pdfUserPass.type = isPass ? 'text' : 'password';
      toggleProtectPass.textContent = isPass ? '🔒' : '👁';
    });
  }

  if (toggleUnlockPass) {
    toggleUnlockPass.addEventListener('click', () => {
      const isPass = pdfUnlockPass.type === 'password';
      pdfUnlockPass.type = isPass ? 'text' : 'password';
      toggleUnlockPass.textContent = isPass ? '🔒' : '👁';
    });
  }

  // ───────── Drag & Drop Utilities ─────────
  function setupDragDrop(zone, input, onFile) {
    zone.addEventListener('click', (e) => {
      if (e.target.tagName !== 'INPUT') {
        input.click();
      }
    });

    ['dragover', 'dragenter'].forEach((eventName) => {
      zone.addEventListener(eventName, (e) => {
        e.preventDefault();
        zone.style.borderColor = 'var(--saffron, #f59e0b)';
        zone.style.background = '#fffbeb';
      });
    });

    ['dragleave', 'drop'].forEach((eventName) => {
      zone.addEventListener(eventName, (e) => {
        e.preventDefault();
        zone.style.borderColor = 'var(--border-color, #cbd5e1)';
        zone.style.background = '#f8fafc';
      });
    });

    zone.addEventListener('drop', (e) => {
      if (e.dataTransfer && e.dataTransfer.files.length) {
        const file = e.dataTransfer.files[0];
        if (file && (file.type === 'application/pdf' || /\.pdf$/i.test(file.name))) {
          onFile(file);
        } else {
          alert('Please select a valid PDF file (.pdf).');
        }
      }
    });
  }

  // ───────── Protect File Selection ─────────
  async function handleProtectFile(file) {
    if (!file) return;
    protectFile = file;
    protectBuffer = await file.arrayBuffer();
    const sizeKB = (file.size / 1024).toFixed(1);
    protectFileName.innerHTML = `📄 <strong>${file.name}</strong> (${sizeKB} KB)`;
    protectFormArea.style.display = 'block';
    pdfUserPass.value = '';
    pdfUserPass.focus();

    // Check if already locked
    if (window.PDFDecrypt && window.PDFDecrypt.isEncrypted) {
      try {
        const encInfo = await window.PDFDecrypt.isEncrypted(new Uint8Array(protectBuffer));
        if (encInfo && encInfo.encrypted) {
          alert('⚠️ This PDF is already password-protected. If you want to unlock it or change the password, please switch to the "Unlock PDF" tab.');
        }
      } catch (e) {
        // ignore check failure
      }
    }
  }

  protectFileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleProtectFile(e.target.files[0]);
    }
  });

  setupDragDrop(protectDropZone, protectFileInput, handleProtectFile);

  // ───────── Encrypt (Lock) PDF ─────────
  btnEncryptPdf.addEventListener('click', async () => {
    if (!protectBuffer) {
      alert('Please upload a PDF file first.');
      return;
    }
    const password = pdfUserPass.value.trim();
    if (!password) {
      alert('Please enter a password to lock your PDF.');
      pdfUserPass.focus();
      return;
    }

    if (typeof window.PDFEncrypt === 'undefined' || !window.PDFEncrypt.encryptPDF) {
      alert('PDF encryption engine is still loading. Please wait a second and try again.');
      return;
    }

    const orig = btnEncryptPdf.innerHTML;
    btnEncryptPdf.disabled = true;
    btnEncryptPdf.innerHTML = '⏳ Encrypting with AES-256 standard...';

    try {
      const uint8 = new Uint8Array(protectBuffer);
      const hasSubtle = typeof window !== 'undefined' && window.crypto && !!window.crypto.subtle;
      const algorithm = hasSubtle ? 'AES-256' : 'RC4';

      const encryptedBytes = await window.PDFEncrypt.encryptPDF(uint8, password, {
        ownerPassword: password + '_admin',
        algorithm: algorithm,
        allowPrinting: true,
        allowCopying: false,
        allowModifying: false
      });

      const blob = new Blob([encryptedBytes], { type: 'application/pdf' });
      const rawName = protectFile ? protectFile.name.replace(/\.pdf$/i, '') : 'document';
      const outName = `protected_${rawName}.pdf`;

      if (window.downloadFile) {
        window.downloadFile(blob, outName);
      } else {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = window.formatDownloadName ? window.formatDownloadName(outName) : outName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      if (window.showToast) {
        window.showToast('✅ PDF successfully locked with password!', 'success');
      } else {
        alert('✅ PDF successfully encrypted and downloaded!');
      }
    } catch (err) {
      console.error('Encryption error:', err);
      alert('Error protecting PDF: ' + (err.message || 'Please check the file and try again.'));
    } finally {
      btnEncryptPdf.disabled = false;
      btnEncryptPdf.innerHTML = orig;
    }
  });

  // ───────── Unlock File Selection ─────────
  async function handleUnlockFile(file) {
    if (!file) return;
    unlockFile = file;
    unlockBuffer = await file.arrayBuffer();
    const sizeKB = (file.size / 1024).toFixed(1);
    unlockFileName.innerHTML = `📄 <strong>${file.name}</strong> (${sizeKB} KB)`;
    unlockFormArea.style.display = 'block';
    pdfUnlockPass.value = '';
    pdfUnlockPass.focus();

    // Check if the file is actually encrypted
    if (window.PDFDecrypt && window.PDFDecrypt.isEncrypted) {
      try {
        const encInfo = await window.PDFDecrypt.isEncrypted(new Uint8Array(unlockBuffer));
        if (encInfo && !encInfo.encrypted) {
          alert('ℹ️ This PDF is not password-protected. It is already fully open and unlocked!');
        }
      } catch (e) {
        // ignore check failure
      }
    }
  }

  unlockFileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleUnlockFile(e.target.files[0]);
    }
  });

  setupDragDrop(unlockDropZone, unlockFileInput, handleUnlockFile);

  // ───────── Decrypt (Unlock) PDF ─────────
  btnDecryptPdf.addEventListener('click', async () => {
    if (!unlockBuffer) {
      alert('Please upload a locked PDF file first.');
      return;
    }
    const password = pdfUnlockPass.value;
    if (!password) {
      alert('Please enter the current PDF password.');
      pdfUnlockPass.focus();
      return;
    }

    if (typeof window.PDFDecrypt === 'undefined' || !window.PDFDecrypt.decryptPDF) {
      alert('PDF decryption engine is still loading. Please wait a second and try again.');
      return;
    }

    const orig = btnDecryptPdf.innerHTML;
    btnDecryptPdf.disabled = true;
    btnDecryptPdf.innerHTML = '⏳ Verifying password & decrypting...';

    try {
      const uint8 = new Uint8Array(unlockBuffer);
      const decryptedBytes = await window.PDFDecrypt.decryptPDF(uint8, password);

      const blob = new Blob([decryptedBytes], { type: 'application/pdf' });
      const rawName = unlockFile ? unlockFile.name.replace(/\.pdf$/i, '') : 'document';
      const outName = `unlocked_${rawName}.pdf`;

      if (window.downloadFile) {
        window.downloadFile(blob, outName);
      } else {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = window.formatDownloadName ? window.formatDownloadName(outName) : outName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      if (window.showToast) {
        window.showToast('✅ PDF successfully unlocked! Password removed.', 'success');
      } else {
        alert('✅ PDF unlocked! The downloaded copy no longer requires a password.');
      }
    } catch (err) {
      console.error('Decryption error:', err);
      const msg = (err.message || '').toLowerCase();
      if (msg.includes('not match') || msg.includes('incorrect password')) {
        alert('❌ Incorrect password! Please enter the correct password for this PDF file.');
      } else if (msg.includes('not encrypted')) {
        alert('ℹ️ This PDF does not have a password. It is already unlocked!');
      } else {
        alert('Failed to unlock PDF: ' + (err.message || 'Please check the password.'));
      }
    } finally {
      btnDecryptPdf.disabled = false;
      btnDecryptPdf.innerHTML = orig;
    }
  });

})();
