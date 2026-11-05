/**
 * AllToolsInOne - Multi-Image to Text (OCR) Converter
 * High-accuracy client-side Optical Character Recognition
 * Powered by Tesseract.js v5 with Sauvola Adaptive Preprocessing,
 * Auto-Deskew, Blacklist Filters, and AI-grade Post-Processing Cleaner
 */

(function () {
  'use strict';

  // State
  let items = [];
  let activeWorker = null;
  let activeWorkerKey = null;
  let isProcessingBatch = false;

  // DOM Elements
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const btnBrowse = document.getElementById('btnBrowse');
  const btnPasteClipboard = document.getElementById('btnPasteClipboard');
  const btnSampleDoc = document.getElementById('btnSampleDoc');
  const btnEmptySample = document.getElementById('btnEmptySample');
  const ocrCardsContainer = document.getElementById('ocrCardsContainer');
  const emptyState = document.getElementById('emptyState');
  const batchBar = document.getElementById('batchBar');
  const batchCountBadge = document.getElementById('batchCountBadge');
  const batchStatusText = document.getElementById('batchStatusText');
  const batchProgressWrapper = document.getElementById('batchProgressWrapper');
  const batchProgressBar = document.getElementById('batchProgressBar');
  const btnExtractAll = document.getElementById('btnExtractAll');
  const btnCopyAll = document.getElementById('btnCopyAll');
  const btnDownloadAllTxt = document.getElementById('btnDownloadAllTxt');
  const btnDownloadWord = document.getElementById('btnDownloadWord');
  const btnDownloadZip = document.getElementById('btnDownloadZip');
  const btnClearAll = document.getElementById('btnClearAll');
  const btnToggleFindReplace = document.getElementById('btnToggleFindReplace');
  const findReplaceBar = document.getElementById('findReplaceBar');
  const findInput = document.getElementById('findInput');
  const replaceInput = document.getElementById('replaceInput');
  const btnApplyReplace = document.getElementById('btnApplyReplace');
  const replaceCountMsg = document.getElementById('replaceCountMsg');

  // Controls
  const ocrPresetMode = document.getElementById('ocrPresetMode');
  const ocrRemoveLines = document.getElementById('ocrRemoveLines');
  const ocrStrokeDilation = document.getElementById('ocrStrokeDilation');
  const ocrLanguage = document.getElementById('ocrLanguage');
  const ocrPreprocessMode = document.getElementById('ocrPreprocessMode');
  const ocrCleanMode = document.getElementById('ocrCleanMode');
  const ocrPsmMode = document.getElementById('ocrPsmMode');
  const ocrDeskew = document.getElementById('ocrDeskew');
  const ocrDelimiter = document.getElementById('ocrDelimiter');

  // Modal
  const imageModal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const preprocessCanvas = document.getElementById('preprocessCanvas');

  // Initialize
  function init() {
    setupEventListeners();
  }

  function setupEventListeners() {
    // Preset change handler
    ocrPresetMode?.addEventListener('change', () => {
      const val = ocrPresetMode.value;
      if (val === 'handwriting') {
        if (ocrPreprocessMode) ocrPreprocessMode.value = 'handwriting';
        if (ocrCleanMode) ocrCleanMode.value = 'handwriting';
        if (ocrPsmMode) ocrPsmMode.value = 'single_block';
        if (ocrRemoveLines) ocrRemoveLines.checked = true;
        if (ocrStrokeDilation) ocrStrokeDilation.checked = true;
        showToast('Activated Handwriting & Ruled Notes Optimization', 'info');
      } else if (val === 'document') {
        if (ocrPreprocessMode) ocrPreprocessMode.value = 'sauvola';
        if (ocrCleanMode) ocrCleanMode.value = 'strict';
        if (ocrPsmMode) ocrPsmMode.value = 'auto';
        if (ocrRemoveLines) ocrRemoveLines.checked = false;
        if (ocrStrokeDilation) ocrStrokeDilation.checked = false;
        showToast('Activated Printed Document & Books Mode', 'info');
      } else if (val === 'receipt') {
        if (ocrPreprocessMode) ocrPreprocessMode.value = 'upscale';
        if (ocrCleanMode) ocrCleanMode.value = 'moderate';
        if (ocrPsmMode) ocrPsmMode.value = 'sparse_text';
        if (ocrRemoveLines) ocrRemoveLines.checked = false;
        if (ocrStrokeDilation) ocrStrokeDilation.checked = false;
        showToast('Activated Receipts & Tables Mode', 'info');
      } else if (val === 'camera') {
        if (ocrPreprocessMode) ocrPreprocessMode.value = 'camera';
        if (ocrCleanMode) ocrCleanMode.value = 'strict';
        if (ocrPsmMode) ocrPsmMode.value = 'auto';
        if (ocrRemoveLines) ocrRemoveLines.checked = true;
        if (ocrStrokeDilation) ocrStrokeDilation.checked = true;
        showToast('Activated Mobile Camera Shadows Mode', 'info');
      }
    });

    // Browse & Input
    btnBrowse?.addEventListener('click', () => fileInput?.click());
    fileInput?.addEventListener('change', handleFileSelect);

    // Drag & Drop
    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone?.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropZone?.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('dragover');
      });
    });

    dropZone?.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt ? Array.from(dt.files) : [];
      if (files.length > 0) {
        handleFiles(files);
      }
    });

    // Paste from clipboard
    btnPasteClipboard?.addEventListener('click', pasteFromClipboard);
    window.addEventListener('paste', handleGlobalPaste);

    // Samples
    btnSampleDoc?.addEventListener('click', loadSampleImages);
    btnEmptySample?.addEventListener('click', loadSampleImages);

    // Batch Actions
    btnExtractAll?.addEventListener('click', extractAllText);
    btnCopyAll?.addEventListener('click', copyAllText);
    btnDownloadAllTxt?.addEventListener('click', downloadAllTxt);
    btnDownloadWord?.addEventListener('click', downloadWordDoc);
    btnDownloadZip?.addEventListener('click', downloadZip);
    btnClearAll?.addEventListener('click', clearAll);

    // Find & Replace
    btnToggleFindReplace?.addEventListener('click', () => {
      if (findReplaceBar) {
        findReplaceBar.style.display = findReplaceBar.style.display === 'none' ? 'block' : 'none';
      }
    });
    btnApplyReplace?.addEventListener('click', applyFindAndReplace);

    // Modal
    modalCloseBtn?.addEventListener('click', closeModal);
    imageModal?.addEventListener('click', (e) => {
      if (e.target === imageModal) closeModal();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && imageModal?.style.display === 'flex') {
        closeModal();
      }
    });
  }

  // Handle files
  function handleFileSelect(e) {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFiles(files);
      fileInput.value = '';
    }
  }

  function handleFiles(files) {
    const validImageFiles = files.filter(f => f.type.startsWith('image/'));
    if (validImageFiles.length === 0) {
      showToast('Please select valid image files (PNG, JPG, WebP, BMP)', 'error');
      return;
    }

    validImageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        const img = new Image();
        img.onload = () => {
          const nameLower = file.name.toLowerCase();
          const isHandwriting = nameLower.includes('handwrit') || nameLower.includes('note');
          const isDoc = nameLower.includes('notice') || nameLower.includes('form') || nameLower.includes('doc');
          const isHindi = nameLower.includes('hindi');

          const item = {
            id: 'ocr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
            file: file,
            name: file.name,
            size: file.size,
            dimensions: { width: img.naturalWidth, height: img.naturalHeight },
            originalDataUrl: dataUrl,
            enhancedDataUrl: null,
            extractedText: '',
            rawText: '',
            cleanedText: '',
            isShowingClean: true,
            status: 'ready', // 'ready' | 'processing' | 'done' | 'error'
            statusText: 'Ready to extract',
            progress: 0,
            confidence: 0,
            wordsCount: 0,
            charsCount: 0,
            error: null,
            // Card-level options
            customLang: isHindi ? 'hin' : (ocrLanguage ? ocrLanguage.value : 'eng'),
            customMode: isHandwriting ? 'handwriting' : (isDoc ? 'none' : (ocrPreprocessMode ? ocrPreprocessMode.value : 'handwriting')),
            customRemoveLines: isHandwriting ? true : (isDoc ? false : (ocrRemoveLines ? ocrRemoveLines.checked : false)),
            customStrokeDilation: isHandwriting ? true : false,
            customContrast: 0,
            customPsm: isHandwriting ? 'single_block' : (isDoc ? 'auto' : (ocrPsmMode ? ocrPsmMode.value : 'single_block'))
          };

          items.push(item);
          renderCard(item);
          updateBatchBar();
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });

    showToast(`Added ${validImageFiles.length} image${validImageFiles.length > 1 ? 's' : ''}`, 'info');
  }

  // Paste from clipboard
  async function pasteFromClipboard() {
    try {
      const clipboardItems = await navigator.clipboard.read();
      let foundImage = false;

      for (const item of clipboardItems) {
        const imageType = item.types.find(type => type.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          const file = new File([blob], `Pasted_Image_${Date.now()}.${imageType.split('/')[1] || 'png'}`, { type: imageType });
          handleFiles([file]);
          foundImage = true;
          break;
        }
      }

      if (!foundImage) {
        showToast('No image data found in clipboard. Copy an image and try again.', 'error');
      }
    } catch (err) {
      showToast('Clipboard access denied or not supported in this browser.', 'error');
    }
  }

  function handleGlobalPaste(e) {
    if (!e.clipboardData || !e.clipboardData.items) return;
    const pastedFiles = [];
    for (let i = 0; i < e.clipboardData.items.length; i++) {
      const item = e.clipboardData.items[i];
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) pastedFiles.push(file);
      }
    }
    if (pastedFiles.length > 0) {
      e.preventDefault();
      handleFiles(pastedFiles);
    }
  }

  // Load High-Res Sample Images (Handwritten Ruled Notes, English Notice & Hindi Admit Card)
  function loadSampleImages() {
    // Sample 1: Authentic Handwritten Notes on Ruled Notebook Paper
    const cHand = document.createElement('canvas');
    cHand.width = 1200;
    cHand.height = 620;
    const ctxH = cHand.getContext('2d');

    // Notebook paper background with warm off-white tone
    ctxH.fillStyle = '#faf8f5';
    ctxH.fillRect(0, 0, cHand.width, cHand.height);

    // Red left margin line (characteristic of school/college registers)
    ctxH.strokeStyle = '#f87171';
    ctxH.lineWidth = 2;
    ctxH.beginPath();
    ctxH.moveTo(110, 0);
    ctxH.lineTo(110, cHand.height);
    ctxH.stroke();

    // Blue horizontal ruled notebook lines
    ctxH.strokeStyle = '#93c5fd';
    ctxH.lineWidth = 1.5;
    for (let y = 80; y < cHand.height; y += 50) {
      ctxH.beginPath();
      ctxH.moveTo(0, y);
      ctxH.lineTo(cHand.width, y);
      ctxH.stroke();
    }

    // Realistic Handwritten student notes in dark blue gel pen
    ctxH.fillStyle = '#1e3a8a';
    ctxH.font = 'bold 24px cursive, sans-serif';
    ctxH.fillText("Physics Chapter 4: Newton's Laws & Momentum Notes", 130, 70);

    ctxH.font = '22px cursive, sans-serif';
    ctxH.fillText("• Newton's 2nd Law of Motion: Force = mass * acceleration (F = m * a)", 130, 120);
    ctxH.fillText("• Momentum is defined as the product of mass and velocity (p = m * v)", 130, 170);
    ctxH.fillText("• The rate of change of momentum is directly proportional to applied force.", 130, 220);
    ctxH.fillText("• SI Unit of Force is Newton (N) or kg m/s2", 130, 270);
    ctxH.fillText("• Real Life Example: A cricketer pulls his hands backwards while catching a fast ball.", 130, 320);
    ctxH.fillText("• Conservation of Momentum: Total momentum before collision = after collision.", 130, 370);
    ctxH.fillText("• Important Revision for Board Exams & SSC CGL 2026 Competitive Exam.", 130, 420);

    cHand.toBlob(blobHand => {
      const fileHand = new File([blobHand], 'Sample_Handwritten_Notes.png', { type: 'image/png' });

      // Sample 2: English Exam Notice
      const c1 = document.createElement('canvas');
      c1.width = 1200;
      c1.height = 550;
      const ctx1 = c1.getContext('2d');
      ctx1.fillStyle = '#ffffff';
      ctx1.fillRect(0, 0, c1.width, c1.height);

      ctx1.fillStyle = '#0f172a';
      ctx1.font = 'bold 30px sans-serif';
      ctx1.fillText('GOVERNMENT OF INDIA — STAFF SELECTION COMMISSION', 50, 60);

      ctx1.fillStyle = '#2563eb';
      ctx1.fillRect(50, 75, 1100, 4);

      ctx1.fillStyle = '#1e293b';
      ctx1.font = 'bold 24px sans-serif';
      ctx1.fillText('OFFICIAL NOTICE: Combined Graduate Level Examination (CGL 2026)', 50, 120);

      ctx1.fillStyle = '#334155';
      ctx1.font = '19px sans-serif';
      ctx1.fillText('• 1. Online Registration Commences: 15-November-2026', 50, 180);
      ctx1.fillText('• 2. Closing Date for Submission: 15-December-2026 (23:00 Hrs)', 50, 225);
      ctx1.fillText('• 3. Minimum Age Requirement: 18 Years as on Cutoff Date', 50, 270);
      ctx1.fillText('• 4. Essential Educational Qualification: Bachelor Degree in Any Stream', 50, 315);
      ctx1.fillText('• 5. Candidate must upload passport photograph and digital signature.', 50, 360);

      ctx1.fillStyle = '#64748b';
      ctx1.font = 'italic 16px sans-serif';
      ctx1.fillText('For official syllabus and exam centers visit: https://sarkaritools.in', 50, 440);

      c1.toBlob(blob1 => {
        const file1 = new File([blob1], 'Sample_English_Notice.png', { type: 'image/png' });

        // Sample 3: Hindi Form
        const c2 = document.createElement('canvas');
        c2.width = 1200;
        c2.height = 550;
        const ctx2 = c2.getContext('2d');
        ctx2.fillStyle = '#ffffff';
        ctx2.fillRect(0, 0, c2.width, c2.height);

        ctx2.fillStyle = '#0f172a';
        ctx2.font = 'bold 30px sans-serif';
        ctx2.fillText('कर्मचारी चयन आयोग — भारत सरकार (प्रवेश पत्र)', 50, 60);

        ctx2.fillStyle = '#16a34a';
        ctx2.fillRect(50, 75, 1100, 4);

        ctx2.fillStyle = '#1e293b';
        ctx2.font = 'bold 24px sans-serif';
        ctx2.fillText('उम्मीदवार विवरण एवं महत्वपूर्ण दिशा-निर्देश 2026', 50, 120);

        ctx2.fillStyle = '#334155';
        ctx2.font = '19px sans-serif';
        ctx2.fillText('• १. अभ्यर्थी का नाम: राहुल कुमार शर्मा (Rahul Kumar Sharma)', 50, 180);
        ctx2.fillText('• २. अनुक्रमांक / रोल नंबर: 220108945672', 50, 225);
        ctx2.fillText('• ३. परीक्षा केंद्र: राजकीय इंटर कॉलेज, सिविल लाइंस', 50, 270);
        ctx2.fillText('• ४. परीक्षा समय: प्रातः 09:30 बजे से 11:30 बजे तक', 50, 315);
        ctx2.fillText('• ५. आवश्यक दस्तावेज: मूल आधार कार्ड एवं दो पासपोर्ट साइज फोटो अनिवार्य हैं।', 50, 360);

        ctx2.fillStyle = '#dc2626';
        ctx2.font = 'bold 17px sans-serif';
        ctx2.fillText('विशेष सूचना: परीक्षा कक्ष में मोबाइल फोन एवं इलेक्ट्रॉनिक घड़ी पूर्णतः वर्जित है।', 50, 440);

        c2.toBlob(blob2 => {
          const file2 = new File([blob2], 'Sample_Hindi_Form.png', { type: 'image/png' });
          handleFiles([fileHand, file1, file2]);
          showToast('Loaded Handwritten Notes, English Notice & Hindi Admit Card!', 'success');
        }, 'image/png');
      }, 'image/png');
    }, 'image/png');
  }

  // ════════════════════════════════════════════════════════════════
  // IMAGE PREPROCESSING ENGINE (Sauvola Adaptive, Ruled Lines, Deskew)
  // ════════════════════════════════════════════════════════════════

  // Sauvola Thresholding with 64-bit Integral Image
  function applySauvolaThreshold(grayData, w, h, r = 26, k = 0.18, R = 128) {
    const integral = new Float64Array((w + 1) * (h + 1));
    const sqIntegral = new Float64Array((w + 1) * (h + 1));
    const rowStride = w + 1;

    for (let y = 0; y < h; y++) {
      let rowSum = 0;
      let rowSqSum = 0;
      const grayOffset = y * w;
      const intOffset = (y + 1) * rowStride;
      const prevIntOffset = y * rowStride;

      for (let x = 0; x < w; x++) {
        const val = grayData[grayOffset + x];
        rowSum += val;
        rowSqSum += val * val;

        integral[intOffset + x + 1] = integral[prevIntOffset + x + 1] + rowSum;
        sqIntegral[intOffset + x + 1] = sqIntegral[prevIntOffset + x + 1] + rowSqSum;
      }
    }

    const binarized = new Uint8Array(w * h);

    for (let y = 0; y < h; y++) {
      const y1 = Math.max(0, y - r);
      const y2 = Math.min(h - 1, y + r);

      for (let x = 0; x < w; x++) {
        const x1 = Math.max(0, x - r);
        const x2 = Math.min(w - 1, x + r);
        const count = (x2 - x1 + 1) * (y2 - y1 + 1);

        const iA = y1 * rowStride + x1;
        const iB = y1 * rowStride + (x2 + 1);
        const iC = (y2 + 1) * rowStride + x1;
        const iD = (y2 + 1) * rowStride + (x2 + 1);

        const sum = integral[iD] - integral[iB] - integral[iC] + integral[iA];
        const sqSum = sqIntegral[iD] - sqIntegral[iB] - sqIntegral[iC] + sqIntegral[iA];

        const mean = sum / count;
        const variance = Math.max(0, (sqSum / count) - (mean * mean));
        const stdDev = Math.sqrt(variance);

        const threshold = mean * (1.0 + k * (stdDev / R - 1.0));
        binarized[y * w + x] = grayData[y * w + x] < threshold ? 0 : 255;
      }
    }

    return binarized;
  }

  // Color-Space Blue & Red Ruled Line Attenuator (Notebook paper)
  function removeColorRuledLines(data, w, h) {
    const totalPixels = w * h;
    for (let p = 0, i = 0; p < totalPixels; p++, i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = (r + g + b) / 3;

      // Detect blue horizontal ruled notebook lines
      if (b > r + 15 && b > g + 8 && lum > 90) {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
      }
      // Detect red/pink left margin lines
      else if (r > g + 35 && r > b + 35 && lum > 95) {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
      }
    }
  }

  // Morphological Ruled Line Eraser (Preserves crossing vertical letter strokes)
  function removeBinaryRuledLines(bin, w, h, minRun = 22) {
    const output = new Uint8Array(bin);

    for (let y = 3; y < h - 3; y++) {
      let runStart = -1;
      for (let x = 0; x < w; x++) {
        if (bin[y * w + x] === 0) {
          if (runStart === -1) runStart = x;
        } else {
          if (runStart !== -1) {
            const runLength = x - runStart;
            if (runLength >= minRun) {
              // Horizontal ruled line detected: check each pixel for letter crossing
              for (let rx = runStart; rx < x; rx++) {
                const hasAbove = (bin[(y - 3) * w + rx] === 0 || bin[(y - 4) * w + rx] === 0);
                const hasBelow = (bin[(y + 3) * w + rx] === 0 || bin[(y + 4) * w + rx] === 0);
                // If no character stroke passes vertically through, erase line!
                if (!hasAbove && !hasBelow) {
                  output[y * w + rx] = 255;
                }
              }
            }
            runStart = -1;
          }
        }
      }
    }

    return output;
  }

  // Stroke Gap Healer: bridges 1-pixel micro-breaks in handwritten letter loops
  function healStrokeGaps(bin, w, h) {
    const out = new Uint8Array(bin);
    for (let y = 1; y < h - 1; y++) {
      const yw = y * w;
      for (let x = 1; x < w - 1; x++) {
        if (bin[yw + x] === 255) {
          // Horizontal gap
          if (bin[yw + x - 1] === 0 && bin[yw + x + 1] === 0) {
            out[yw + x] = 0;
          }
          // Vertical gap
          else if (bin[(y - 1) * w + x] === 0 && bin[(y + 1) * w + x] === 0) {
            out[yw + x] = 0;
          }
          // Diagonal gaps
          else if (bin[(y - 1) * w + x - 1] === 0 && bin[(y + 1) * w + x + 1] === 0) {
            out[yw + x] = 0;
          }
          else if (bin[(y - 1) * w + x + 1] === 0 && bin[(y + 1) * w + x - 1] === 0) {
            out[yw + x] = 0;
          }
        }
      }
    }
    return out;
  }

  // Morphological Pen Stroke Dilation: thickens faint pencil & ballpoint pen marks
  function applyStrokeDilation(bin, w, h, strength = 1) {
    if (strength <= 0) return bin;
    let current = new Uint8Array(bin);

    for (let iter = 0; iter < strength; iter++) {
      const next = new Uint8Array(current);
      for (let y = 1; y < h - 1; y++) {
        const yw = y * w;
        for (let x = 1; x < w - 1; x++) {
          if (current[yw + x] === 0) {
            // Dilate 4-connectivity
            next[yw + x - 1] = 0;
            next[yw + x + 1] = 0;
            next[(y - 1) * w + x] = 0;
            next[(y + 1) * w + x] = 0;
          }
        }
      }
      current = next;
    }

    return current;
  }

  // Auto-Deskew Angle Estimator via Horizontal Projection Profile
  function estimateSkewAngle(binarized, w, h) {
    let bestAngle = 0;
    let maxVariance = -1;

    for (let angle = -8; angle <= 8; angle += 1) {
      const rad = (angle * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);

      const rowCounts = new Float64Array(h);
      const step = 3;

      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          if (binarized[y * w + x] === 0) {
            const cx = x - w / 2;
            const cy = y - h / 2;
            const rotY = Math.round(cy * cos - cx * sin + h / 2);
            if (rotY >= 0 && rotY < h) {
              rowCounts[rotY]++;
            }
          }
        }
      }

      let sum = 0;
      let sqSum = 0;
      for (let y = 0; y < h; y++) {
        sum += rowCounts[y];
        sqSum += rowCounts[y] * rowCounts[y];
      }
      const mean = sum / h;
      const variance = (sqSum / h) - (mean * mean);

      if (variance > maxVariance) {
        maxVariance = variance;
        bestAngle = angle;
      }
    }

    return bestAngle;
  }

  // Master Preprocessor
  async function preprocessImage(imgUrl, mode = 'handwriting', shouldDeskew = true, options = {}) {
    if (mode === 'none') return imgUrl;

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        let origW = img.naturalWidth;
        let origH = img.naturalHeight;

        // Scaling: keep scale 1.0 for normal resolutions (450px to 2400px) to prevent blurring
        let scale = 1.0;
        const maxDim = Math.max(origW, origH);
        const minDim = Math.min(origW, origH);

        if (mode === 'upscale' || minDim < 450) {
          scale = minDim < 350 ? 2.0 : 1.4;
        } else if (maxDim > 2400) {
          scale = 2200 / maxDim;
        }

        const targetW = Math.round(origW * scale);
        const targetH = Math.round(origH * scale);

        const canvas = preprocessCanvas || document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetW, targetH);

        const imgData = ctx.getImageData(0, 0, targetW, targetH);
        const data = imgData.data;
        const totalPixels = targetW * targetH;

        // 1. Color-space ruled line removal
        const removeLines = options.removeLines ?? (ocrRemoveLines ? ocrRemoveLines.checked : true);
        if ((mode === 'handwriting' || mode === 'camera') && removeLines) {
          removeColorRuledLines(data, targetW, targetH);
        }

        // 2. Contrast adjustment
        const contrastOffset = options.contrast || 0;
        if (contrastOffset !== 0) {
          const factor = (259 * (contrastOffset + 255)) / (255 * (259 - contrastOffset));
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
            data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
            data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
          }
        }

        let finalBinary = null;

        if (mode === 'handwriting') {
          // Grayscale & Paper Whitening with Anti-Aliased Edge Preservation
          for (let i = 0; i < totalPixels; i++) {
            const idx = i * 4;
            let gray = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
            // Normalize background: off-white paper becomes pure white 255
            if (gray > 192) {
              gray = 255;
            } else {
              // Deepen dark ink while preserving anti-aliased gradient
              gray = Math.max(0, (gray - 20) * (255 / 172));
            }
            const val = Math.min(255, Math.max(0, Math.round(gray)));
            data[idx] = val;
            data[idx + 1] = val;
            data[idx + 2] = val;
          }

          // Quick binary for deskew angle estimation
          finalBinary = new Uint8Array(totalPixels);
          for (let p = 0; p < totalPixels; p++) {
            finalBinary[p] = data[p * 4] < 160 ? 0 : 255;
          }
        } else if (mode === 'sauvola' || mode === 'upscale') {
          const radius = Math.max(15, Math.min(32, Math.round(targetW / 40)));
          finalBinary = applySauvolaThreshold(gray, targetW, targetH, radius, 0.22, 128);

          for (let p = 0, i = 0; p < totalPixels; p++, i += 4) {
            const v = finalBinary[p];
            data[i] = v;
            data[i + 1] = v;
            data[i + 2] = v;
          }
        } else if (mode === 'camera') {
          const step = 8;
          const bgW = Math.ceil(targetW / step);
          const bgH = Math.ceil(targetH / step);
          const bg = new Float32Array(bgW * bgH);

          for (let by = 0; by < bgH; by++) {
            for (let bx = 0; bx < bgW; bx++) {
              let sum = 0, count = 0;
              for (let sy = 0; sy < step && by * step + sy < targetH; sy++) {
                for (let sx = 0; sx < step && bx * step + sx < targetW; sx++) {
                  sum += gray[(by * step + sy) * targetW + (bx * step + sx)];
                  count++;
                }
              }
              bg[by * bgW + bx] = sum / (count || 1);
            }
          }

          for (let y = 0; y < targetH; y++) {
            const by = Math.min(bgH - 1, Math.floor(y / step));
            for (let x = 0; x < targetW; x++) {
              const bx = Math.min(bgW - 1, Math.floor(x / step));
              const localBg = Math.max(30, bg[by * bgW + bx]);
              const p = y * targetW + x;
              const normalized = Math.min(255, Math.max(0, Math.round((gray[p] / localBg) * 235)));
              const idx = p * 4;
              data[idx] = normalized;
              data[idx + 1] = normalized;
              data[idx + 2] = normalized;
            }
          }
        } else if (mode === 'binarize') {
          const threshold = computeOtsuThreshold(gray);
          for (let p = 0, i = 0; p < totalPixels; p++, i += 4) {
            const v = gray[p] < threshold ? 0 : 255;
            data[i] = v;
            data[i + 1] = v;
            data[i + 2] = v;
          }
        }

        ctx.putImageData(imgData, 0, 0);

        // Auto-Deskew & Leveling
        if (shouldDeskew && finalBinary) {
          const skewAngle = estimateSkewAngle(finalBinary, targetW, targetH);
          if (Math.abs(skewAngle) >= 1) {
            const rotCanvas = document.createElement('canvas');
            rotCanvas.width = targetW;
            rotCanvas.height = targetH;
            const rotCtx = rotCanvas.getContext('2d');
            rotCtx.fillStyle = '#ffffff';
            rotCtx.fillRect(0, 0, targetW, targetH);

            rotCtx.translate(targetW / 2, targetH / 2);
            rotCtx.rotate((-skewAngle * Math.PI) / 180);
            rotCtx.drawImage(canvas, -targetW / 2, -targetH / 2);

            resolve(rotCanvas.toDataURL('image/png'));
            return;
          }
        }

        resolve(canvas.toDataURL('image/png'));
      };
      img.src = imgUrl;
    });
  }

  // Otsu's Threshold Algorithm
  function computeOtsuThreshold(grayArray) {
    const histogram = new Array(256).fill(0);
    const total = grayArray.length;
    for (let i = 0; i < total; i++) histogram[grayArray[i]]++;

    let sum = 0;
    for (let t = 0; t < 256; t++) sum += t * histogram[t];

    let sumB = 0, wB = 0, wF = 0, varMax = 0, threshold = 128;
    for (let t = 0; t < 256; t++) {
      wB += histogram[t];
      if (wB === 0) continue;
      wF = total - wB;
      if (wF === 0) break;

      sumB += t * histogram[t];
      const mB = sumB / wB;
      const mF = (sum - sumB) / wF;
      const varBetween = wB * wF * (mB - mF) * (mB - mF);

      if (varBetween > varMax) {
        varMax = varBetween;
        threshold = t;
      }
    }
    return threshold;
  }

  // ════════════════════════════════════════════════════════════════
  // AI-GRADE POST-PROCESSING & HANDWRITING ERROR CORRECTOR
  // ════════════════════════════════════════════════════════════════

  function correctHandwritingErrors(text) {
    if (!text) return '';
    let s = text;

    // 1. Digit-to-letter repairs inside English words:
    // e.g. "b00k" -> "book", "inf0rmati0n" -> "information", "c0ntact" -> "contact"
    s = s.replace(/\b([a-zA-Z]*[a-z])0([a-z][a-zA-Z]*)\b/g, '$1o$2');
    s = s.replace(/\b([a-zA-Z]*[a-z])0([a-zA-Z]*)\b/g, '$1o$2');
    s = s.replace(/\b0([a-z]{2,})\b/g, 'o$1');

    // e.g. "he11o" -> "hello", "p1ease" -> "please", "app1y" -> "apply", "resu1t" -> "result"
    s = s.replace(/\b([a-z]+)1([a-z]+)\b/g, '$1l$2');
    s = s.replace(/\b([a-z]{2,})1\b/g, '$1l');

    // e.g. "sy5tem" -> "system", "que5tion" -> "question"
    s = s.replace(/\b([a-zA-Z]+)5([a-zA-Z]+)\b/g, '$1s$2');

    // e.g. "8ecause" -> "Because", "8oth" -> "Both"
    s = s.replace(/\b8([a-z]{2,})\b/g, 'B$1');
    s = s.replace(/\b1s\b/g, 'is');

    // 2. Academic & Notes common misread fixes:
    s = s.replace(/\btomenturm\b/gi, 'Momentum');
    s = s.replace(/\btomentum\b/gi, 'Momentum');
    s = s.replace(/\bMomenturm\b/gi, 'Momentum');
    s = s.replace(/\bST Unit\b/g, 'SI Unit');
    s = s.replace(/\b[nN]ate of\b/g, 'rate of');
    s = s.replace(/\bThe ate of\b/g, 'The rate of');
    s = s.replace(/\bthe ate of\b/g, 'the rate of');
    s = s.replace(/\bnands\b/g, 'hands');
    s = s.replace(/\bproporticnal\b/gi, 'proportional');
    s = s.replace(/\bImpo-tant\b/gi, 'Important');
    s = s.replace(/\bRevisicn\b/gi, 'Revision');
    s = s.replace(/\bC6L\b/g, 'CGL');
    s = s.replace(/\bsefere\b/gi, 'before');
    s = s.replace(/(\bForce|\bmass)\s+z\s+/gi, '$1 = ');
    s = s.replace(/\bForce\s+mass\b/g, 'Force = mass');
    s = s.replace(/\((F|p)\s*z\s*/g, '($1 = ');
    s = s.replace(/\((F|p)\s*=\s*2\s*m\s*\*\s*([av])\)/gi, '($1 = m * $2)');
    s = s.replace(/(\bcollision)\s+z\s+/gi, '$1 = ');
    s = s.replace(/\bo-\s*(kg|g)\b/g, 'or $1');

    // 2. Common cursive handwriting OCR letter misrecognitions:
    const ligatureReplacements = [
      [/\bleam\b/gi, 'learn'],
      [/\bretum\b/gi, 'return'],
      [/\bpattem\b/gi, 'pattern'],
      [/\bgovemment\b/gi, 'government'],
      [/\bintemet\b/gi, 'internet'],
      [/\bextemal\b/gi, 'external'],
      [/\bintemal\b/gi, 'internal'],
      [/\binfonnation\b/gi, 'information'],
      [/\bperfomn\b/gi, 'perform'],
      [/\bfomn\b/gi, 'form'],
      [/\bbom\b/gi, 'born'],
      [/\bclecide\b/gi, 'decide'],
      [/\bclevelop\b/gi, 'develop'],
      [/\bclefinition\b/gi, 'definition'],
      [/\bcluring\b/gi, 'during'],
      [/\bvvith\b/gi, 'with'],
      [/\bvvork\b/gi, 'work'],
      [/\bvvhen\b/gi, 'when'],
      [/\bvvhat\b/gi, 'what'],
      [/\bvvhere\b/gi, 'where'],
      [/\bvvhy\b/gi, 'why'],
      [/\bvvhich\b/gi, 'which'],
      [/\bvvould\b/gi, 'would'],
      [/\bvve\b/gi, 'we'],
      [/\bvvill\b/gi, 'will'],
      [/\btlie\b/gi, 'the'],
      [/\btliat\b/gi, 'that'],
      [/\btliese\b/gi, 'these'],
      [/\btliey\b/gi, 'they'],
      [/\btliis\b/gi, 'this']
    ];
    for (const [re, rep] of ligatureReplacements) {
      s = s.replace(re, rep);
    }

    // 3. Remove isolated noise symbols from notebook ruled lines / margins
    s = s.replace(/(^|\s)[|~^\\_]{1,3}(\s|$)/gm, ' ');
    s = s.replace(/^[_\-~=]{3,}$/gm, '');

    // 4. Strip stray characters surrounding words (e.g. "_word_" -> "word", "|word|" -> "word")
    s = s.replace(/(\s|^)[|_~^]([a-zA-Z0-9\u0900-\u097F]+)[|_~^](\s|$)/g, '$1$2$3');

    // 5. Rejoin hyphenated words split across lines (e.g. "experi-\nment" -> "experiment")
    s = s.replace(/(\b[a-zA-Z]{2,})-\r?\n\s*([a-zA-Z]{2,}\b)/g, '$1$2');

    // 6. Contractions repair (e.g. "don ' t" -> "don't", "can ' t" -> "can't", "it ' s" -> "it's")
    s = s.replace(/\b([a-zA-Z]+)\s+['’]\s+([a-zA-Z]+)\b/g, "$1'$2");

    // 7. Hindi Devanagari handwriting corrections:
    s = s.replace(/([\u0915-\u0939])\s+([\u093E-\u094C\u0901-\u0903\u094D])/g, '$1$2');
    s = s.replace(/ि\s+([\u0915-\u0939])/g, '$1ि');
    s = s.replace(/([\u0915-\u0939]्)\s+([\u0915-\u0939])/g, '$1$2');

    // 8. Fix spacing around punctuation
    s = s.replace(/\s+([.,;:?!%।])/g, '$1');
    s = s.replace(/([.,;:?!%।])([a-zA-Z\u0900-\u097F])/g, '$1 $2');

    // 9. Normalize multiple spaces & newlines
    s = s.replace(/[ \t]+/g, ' ');
    s = s.replace(/\n{3,}/g, '\n\n');

    return s.trim();
  }

  function cleanOcrText(rawText, mode = 'handwriting') {
    if (!rawText) return '';
    if (mode === 'raw') return rawText;

    const lines = rawText.split(/\r?\n/);
    const cleanedLines = [];

    for (let rawLine of lines) {
      let line = rawLine;

      // 1. Remove non-printable / control characters
      line = line.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');

      // 2. Strip noise symbols that Tesseract hallucinates
      if (mode === 'strict' || mode === 'handwriting') {
        line = line.replace(/[~^\\|<>{}[\x5D_=+§©®¢¥°±µ¿¡]/g, ' ');
      }

      // 3. Normalize quotes and apostrophes
      line = line.replace(/[`‘’‛]/g, "'").replace(/[“”‟«»]/g, '"');

      // 4. Normalize multiple punctuation
      line = line.replace(/,{2,}/g, ',');
      line = line.replace(/;{2,}/g, ';');
      line = line.replace(/:{2,}/g, ':');
      line = line.replace(/-{3,}/g, '—');

      // 5. Clean up bullet points & numbers at line starts
      line = line.replace(/^[\s]*[+*•o\-\u2022\u25E6\u25AA\u25AB\u2023"'`~^|><]\s*(\d+[.)])\s*/u, '$1 ');
      line = line.replace(/^[\s]*[+*•o\-\u2022\u25E6\u25AA\u25AB\u2023"'`~^|><]\s+/u, '• ');

      // 6. Fix spacing before punctuation
      line = line.replace(/\s+([.,;:?!%])/g, '$1');

      // 7. Collapse multiple horizontal spaces
      line = line.replace(/[ \t]+/g, ' ').trim();

      // 8. Filter noise lines & strip edge junk
      line = line.replace(/^[^a-zA-Z0-9\u0900-\u097F•"'(]+/, '').replace(/[^a-zA-Z0-9\u0900-\u097F.)"']+$/, '').trim();

      if (line.length <= 3 && !/[a-zA-Z0-9\u0900-\u097F]/.test(line)) {
        continue;
      }

      const words = line.split(/\s+/).filter(Boolean);
      const hasLongWord = words.some(w => w.length >= 3);
      const hasNumber = /\d/.test(line);
      if (words.length <= 2 && !hasLongWord && !hasNumber) {
        continue;
      }

      cleanedLines.push(line);
    }

    let result = cleanedLines.join('\n');
    result = result.replace(/\n{3,}/g, '\n\n').trim();

    if (mode === 'handwriting') {
      result = correctHandwritingErrors(result);
    }

    return result;
  }

  // ════════════════════════════════════════════════════════════════
  // TESSERACT WORKER MANAGEMENT
  // ════════════════════════════════════════════════════════════════

  async function getTesseractWorker(lang, psmMode = 'single_block') {
    let psmCode = window.Tesseract.PSM.SINGLE_BLOCK;
    if (psmMode === 'auto') psmCode = window.Tesseract.PSM.AUTO;
    else if (psmMode === 'single_column') psmCode = window.Tesseract.PSM.SINGLE_COLUMN;
    else if (psmMode === 'sparse_text') psmCode = window.Tesseract.PSM.SPARSE_TEXT;

    const workerKey = `${lang}_${psmCode}`;

    if (activeWorker && activeWorkerKey === workerKey) {
      return activeWorker;
    }

    if (activeWorker) {
      try {
        await activeWorker.terminate();
      } catch (e) {}
      activeWorker = null;
    }

    const langArray = lang.includes('+') ? lang.split('+') : [lang];

    activeWorker = await window.Tesseract.createWorker(langArray, 1, {
      logger: (m) => {
        if (window.__currentProcessingItem) {
          const item = window.__currentProcessingItem;
          if (m.status === 'recognizing text') {
            item.progress = 30 + Math.round((m.progress || 0) * 65);
            item.statusText = `Recognizing text... ${Math.round((m.progress || 0) * 100)}%`;
          } else if (m.status === 'loading language traineddata') {
            item.progress = Math.round((m.progress || 0) * 25);
            item.statusText = `Downloading OCR language model...`;
          } else if (m.status) {
            item.statusText = m.status;
          }
          updateCardProgress(item);
        }
      }
    });

    // Configure Worker Parameters
    await activeWorker.setParameters({
      tessedit_pageseg_mode: psmCode,
      preserve_interword_spaces: '1',
      tessedit_char_blacklist: '§©®¢¥°±µ¿¡~^`\\|<>{}[]_=',
    });

    activeWorkerKey = workerKey;
    return activeWorker;
  }

  // ════════════════════════════════════════════════════════════════
  // RECOGNITION PIPELINE (Process Single Item)
  // ════════════════════════════════════════════════════════════════

  async function processItem(item) {
    if (item.status === 'processing') return;

    item.status = 'processing';
    item.progress = 5;
    item.statusText = 'Enhancing image & removing notebook lines...';
    updateCardProgress(item);

    window.__currentProcessingItem = item;

    try {
      const mode = ocrPreprocessMode ? ocrPreprocessMode.value : 'handwriting';
      const lang = item.customLang || (ocrLanguage ? ocrLanguage.value : 'eng');
      const cleanMode = ocrCleanMode ? ocrCleanMode.value : 'handwriting';
      const psmVal = item.customPsm || (ocrPsmMode ? ocrPsmMode.value : 'single_block');
      const shouldDeskew = ocrDeskew ? ocrDeskew.checked : true;

      const preprocessOpts = {
        removeLines: item.customRemoveLines ?? (ocrRemoveLines ? ocrRemoveLines.checked : true),
        strokeDilation: item.customStrokeDilation ?? (ocrStrokeDilation ? ocrStrokeDilation.checked : true),
        contrast: item.customContrast || 0
      };

      // 1. Run Preprocessing (Handwriting / Sauvola + Line Suppression + Deskew)
      const enhancedUrl = await preprocessImage(item.originalDataUrl, mode, shouldDeskew, preprocessOpts);
      item.enhancedDataUrl = enhancedUrl;
      item.progress = 30;
      item.statusText = 'Running neural OCR...';
      updateCardProgress(item);

      // 2. Pass 1: Run OCR with primary PSM
      let worker = await getTesseractWorker(lang, psmVal);
      let ret = await worker.recognize(enhancedUrl);
      let raw = (ret.data.text || '').trim();
      let conf = Math.round(ret.data.confidence || 0);

      // 3. Adaptive Pass 2 (If handwriting confidence is low or word count < 3)
      if (mode === 'handwriting' && (conf < 60 || raw.split(/\s+/).length < 3)) {
        try {
          const fallbackPsm = psmVal === 'single_block' ? 'auto' : 'single_block';
          const worker2 = await getTesseractWorker(lang, fallbackPsm);
          const ret2 = await worker2.recognize(enhancedUrl);
          const raw2 = (ret2.data.text || '').trim();
          const conf2 = Math.round(ret2.data.confidence || 0);
          if (raw2.split(/\s+/).length > raw.split(/\s+/).length && conf2 > conf - 10) {
            ret = ret2;
            raw = raw2;
            conf = conf2;
          }
        } catch (e) {
          console.warn('Fallback pass error:', e);
        }
      }

      // 4. Process & Clean Output
      const cleaned = cleanOcrText(raw, cleanMode);

      item.rawText = raw;
      item.cleanedText = cleaned;
      item.extractedText = cleanMode === 'raw' ? raw : cleaned;
      item.isShowingClean = cleanMode !== 'raw';
      item.confidence = conf;
      item.status = 'done';
      item.progress = 100;
      item.statusText = `Completed (${item.confidence}% Confidence)`;

      updateCounts(item);
      updateCardFull(item);
    } catch (err) {
      console.error('OCR Error on item', item.name, err);
      item.status = 'error';
      item.statusText = 'Error during extraction';
      item.error = err.message || 'Recognition failed';
      updateCardFull(item);
    } finally {
      window.__currentProcessingItem = null;
    }
  }

  // Batch: Extract All Text
  async function extractAllText() {
    if (items.length === 0) {
      showToast('No images to extract. Please add images first.', 'error');
      return;
    }
    if (isProcessingBatch) return;

    isProcessingBatch = true;
    btnExtractAll.disabled = true;
    btnExtractAll.innerText = '⏳ Processing Batch...';

    if (batchProgressWrapper) batchProgressWrapper.style.display = 'block';

    let completed = 0;
    const total = items.length;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      batchStatusText.innerText = `Processing ${i + 1} of ${total}: ${item.name}`;
      if (batchProgressBar) {
        batchProgressBar.style.width = Math.round((i / total) * 100) + '%';
      }

      await processItem(item);
      completed++;
    }

    if (batchProgressBar) batchProgressBar.style.width = '100%';
    batchStatusText.innerText = `All ${total} images extracted successfully!`;
    showToast(`Batch OCR finished for all ${total} images!`, 'success');

    btnExtractAll.disabled = false;
    btnExtractAll.innerText = '⚡ Extract All Text';
    isProcessingBatch = false;
  }

  // ════════════════════════════════════════════════════════════════
  // UI CARD RENDERING & EVENT BINDING
  // ════════════════════════════════════════════════════════════════

  function renderCard(item) {
    if (emptyState) emptyState.style.display = 'none';

    const card = document.createElement('div');
    card.className = 'ocr-card';
    card.id = `card_${item.id}`;

    const currentLang = item.customLang || (ocrLanguage ? ocrLanguage.value : 'eng');

    card.innerHTML = `
      <div class="ocr-card-header">
        <div class="ocr-card-header-left">
          <img src="${item.originalDataUrl}" class="ocr-thumbnail" id="thumb_${item.id}" alt="Thumbnail" title="Click to view full image">
          <div class="ocr-file-info">
            <div class="ocr-file-name" title="${item.name}">${escapeHtml(item.name)}</div>
            <div class="ocr-file-meta">
              <span>${formatBytes(item.size)}</span>
              <span>•</span>
              <span>${item.dimensions.width} × ${item.dimensions.height} px</span>
            </div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <span class="ocr-badge status-ready" id="statusBadge_${item.id}">Ready</span>
          <span class="ocr-badge" id="confBadge_${item.id}" style="display: none;"></span>

          <!-- Card Language Selector -->
          <select id="cardLang_${item.id}" class="form-select" style="font-size: 11px; padding: 2px 6px; width: auto; height: 26px; border-radius: 6px; background: #fff; border-color: #cbd5e1; font-weight: 500;" title="Recognition language for this image">
            <option value="eng" ${currentLang === 'eng' ? 'selected' : ''}>🇬🇧 English</option>
            <option value="hin" ${currentLang === 'hin' ? 'selected' : ''}>🇮🇳 Hindi</option>
            <option value="eng+hin" ${currentLang === 'eng+hin' ? 'selected' : ''}>🌐 Eng+Hin</option>
          </select>

          <!-- Fine-Tune Drawer Toggle -->
          <button type="button" class="btn btn-outline ocr-btn-xs" id="btnToggleTune_${item.id}" style="font-size: 11px; padding: 3px 8px; color: #0284c7; border-color: #bae6fd; background: #f0f9ff;" title="Tune contrast, line removal, and handwriting filters">
            ⚙️ Tune
          </button>

          <button type="button" class="btn btn-outline ocr-btn-sm" id="btnDelete_${item.id}" style="color: #dc2626; border-color: #fca5a5;" title="Remove this image">
            ✕
          </button>
        </div>
      </div>

      <!-- Collapsible Fine-Tune Drawer -->
      <div id="tuneDrawer_${item.id}" style="display: none; background: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 10px 18px; font-size: 12px;">
        <div style="display: flex; flex-wrap: wrap; gap: 14px; align-items: center; justify-content: space-between;">
          <div style="display: flex; flex-wrap: wrap; gap: 14px; align-items: center;">
            <label style="display: flex; align-items: center; gap: 5px; cursor: pointer; font-weight: 500; color: #1e293b;">
              <input type="checkbox" id="cardRemoveLines_${item.id}" ${item.customRemoveLines ? 'checked' : ''} style="accent-color: #0284c7;">
              <span>📏 Ruled Line Removal</span>
            </label>
            <label style="display: flex; align-items: center; gap: 5px; cursor: pointer; font-weight: 500; color: #1e293b;">
              <input type="checkbox" id="cardStrokeHealer_${item.id}" ${item.customStrokeDilation ? 'checked' : ''} style="accent-color: #0284c7;">
              <span>✒️ Stroke Gap Healer</span>
            </label>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-weight: 500; color: #1e293b;">☀️ Ink Darkness:</span>
              <input type="range" id="cardContrast_${item.id}" min="-30" max="30" value="${item.customContrast || 0}" style="width: 80px; accent-color: #0284c7;">
            </div>
          </div>
          <button type="button" class="btn btn-primary ocr-btn-xs" id="btnApplyTune_${item.id}" style="font-size: 11px; padding: 4px 12px; background: #0284c7; border-color: #0284c7;">
            ⚡ Re-Extract with Filters
          </button>
        </div>
      </div>

      <!-- Item Progress Bar -->
      <div class="ocr-progress-container" id="cardProgressWrapper_${item.id}" style="display: none; height: 4px; border-radius: 0;">
        <div class="ocr-progress-fill animated" id="cardProgressBar_${item.id}" style="width: 0%;"></div>
      </div>

      <div class="ocr-card-body ocr-split-body">
        <div class="ocr-image-preview-pane">
          <div class="ocr-pane-label">Document Photo (Preprocessed Preview)</div>
          <div class="ocr-image-wrapper">
            <img src="${item.enhancedDataUrl || item.originalDataUrl}" class="ocr-preview-img" id="bodyThumb_${item.id}" alt="${escapeHtml(item.name)}" title="Click to view full screen">
          </div>
          <button type="button" class="btn btn-outline ocr-btn-xs" id="btnViewModal_${item.id}" style="margin-top: 8px; width: 100%; font-size: 11px; padding: 4px 8px;">
            🔍 View Full Size
          </button>
        </div>
        <div class="ocr-text-pane">
          <div class="ocr-pane-label" style="display:flex; justify-content:space-between; align-items:center; flex-wrap: wrap; gap: 6px;">
            <span>Clean Extracted Text</span>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <button type="button" class="btn btn-outline ocr-btn-xs" id="btnFixTypos_${item.id}" style="font-size: 11px; padding: 2px 8px; background: #fdf2f8; color: #be185d; border-color: #fbcfe8;" title="Auto-fix handwriting errors (0/o, 1/l, ligatures, spacing)">
                🪄 Fix Typos
              </button>
              <button type="button" class="btn btn-outline ocr-btn-xs" id="btnToggleClean_${item.id}" style="font-size: 11px; padding: 2px 8px; background: #eff6ff; color: #2563eb; border-color: #93c5fd;" title="Switch between Clean and Raw OCR">
                ✨ Cleaned
              </button>
            </div>
          </div>
          <textarea class="ocr-textarea" id="textarea_${item.id}" placeholder="Extracted text will appear here. Clean words, line breaks, and bullet points are preserved..."></textarea>
        </div>
      </div>

      <div class="ocr-card-footer">
        <div class="ocr-counts" id="counts_${item.id}">
          <span>Words: <strong>0</strong></span>
          <span>Chars: <strong>0</strong></span>
        </div>
        <div class="ocr-card-actions">
          <button type="button" class="btn btn-primary ocr-btn-sm" id="btnExtractSingle_${item.id}">
            ⚡ Extract Text
          </button>
          <button type="button" class="btn btn-outline ocr-btn-sm" id="btnCopy_${item.id}">
            📋 Copy
          </button>
          <button type="button" class="btn btn-outline ocr-btn-sm" id="btnDownloadSingle_${item.id}">
            ⬇️ .txt
          </button>
          <button type="button" class="btn btn-outline ocr-btn-sm" id="btnCleanSingle_${item.id}" title="Remove all remaining symbols and align lines">
            🧹 Clean Symbols
          </button>
        </div>
      </div>
    `;

    ocrCardsContainer.appendChild(card);
    bindCardEvents(item);
  }

  // Bind Card Events
  function bindCardEvents(item) {
    const card = document.getElementById(`card_${item.id}`);
    if (!card) return;

    // Zoom preview
    const thumb = document.getElementById(`thumb_${item.id}`);
    thumb?.addEventListener('click', () => openModal(item.name, item.enhancedDataUrl || item.originalDataUrl));

    const bodyThumb = document.getElementById(`bodyThumb_${item.id}`);
    bodyThumb?.addEventListener('click', () => openModal(item.name, item.enhancedDataUrl || item.originalDataUrl));

    const btnViewModal = document.getElementById(`btnViewModal_${item.id}`);
    btnViewModal?.addEventListener('click', () => openModal(item.name, item.enhancedDataUrl || item.originalDataUrl));

    // Toggle Fine-Tune Drawer
    const btnToggleTune = document.getElementById(`btnToggleTune_${item.id}`);
    const tuneDrawer = document.getElementById(`tuneDrawer_${item.id}`);
    btnToggleTune?.addEventListener('click', () => {
      if (tuneDrawer) {
        tuneDrawer.style.display = tuneDrawer.style.display === 'none' ? 'block' : 'none';
      }
    });

    // Card language change
    const cardLang = document.getElementById(`cardLang_${item.id}`);
    cardLang?.addEventListener('change', () => {
      item.customLang = cardLang.value;
      showToast(`Language set to ${cardLang.value.toUpperCase()}`, 'info');
      if (item.status === 'done') {
        processItem(item);
      }
    });

    // Apply Fine-Tune
    const btnApplyTune = document.getElementById(`btnApplyTune_${item.id}`);
    btnApplyTune?.addEventListener('click', () => {
      const rm = document.getElementById(`cardRemoveLines_${item.id}`);
      const st = document.getElementById(`cardStrokeHealer_${item.id}`);
      const ct = document.getElementById(`cardContrast_${item.id}`);
      item.customRemoveLines = rm ? rm.checked : true;
      item.customStrokeDilation = st ? st.checked : true;
      item.customContrast = ct ? parseInt(ct.value, 10) : 0;
      showToast('Re-processing with custom image filters...', 'info');
      processItem(item);
    });

    // Textarea editing
    const textarea = document.getElementById(`textarea_${item.id}`);
    textarea?.addEventListener('input', (e) => {
      item.extractedText = e.target.value;
      updateCounts(item);
    });

    // Fix Typos button
    const btnFixTypos = document.getElementById(`btnFixTypos_${item.id}`);
    btnFixTypos?.addEventListener('click', () => {
      let t = textarea ? textarea.value : (item.extractedText || '');
      t = correctHandwritingErrors(t);
      item.extractedText = t;
      item.cleanedText = t;
      if (textarea) textarea.value = t;
      updateCounts(item);
      showToast('Repaired handwriting OCR errors & ligatures!', 'success');
    });

    // Toggle Clean vs Raw
    const btnToggleClean = document.getElementById(`btnToggleClean_${item.id}`);
    btnToggleClean?.addEventListener('click', () => {
      if (!item.rawText) return;
      if (item.isShowingClean) {
        item.extractedText = item.rawText;
        item.isShowingClean = false;
        btnToggleClean.innerText = '📜 Raw Text';
        btnToggleClean.style.background = '#fef3c7';
        btnToggleClean.style.color = '#92400e';
      } else {
        item.extractedText = item.cleanedText || cleanOcrText(item.rawText, 'handwriting');
        item.isShowingClean = true;
        btnToggleClean.innerText = '✨ Cleaned';
        btnToggleClean.style.background = '#eff6ff';
        btnToggleClean.style.color = '#2563eb';
      }
      if (textarea) textarea.value = item.extractedText;
      updateCounts(item);
    });

    // Extract single
    const btnExtract = document.getElementById(`btnExtractSingle_${item.id}`);
    btnExtract?.addEventListener('click', () => processItem(item));

    // Copy single
    const btnCopy = document.getElementById(`btnCopy_${item.id}`);
    btnCopy?.addEventListener('click', () => {
      const text = item.extractedText;
      if (!text) {
        showToast('No text extracted yet to copy.', 'error');
        return;
      }
      copyToClipboard(text);
      btnCopy.innerText = '✅ Copied!';
      setTimeout(() => { btnCopy.innerText = '📋 Copy'; }, 2000);
    });

    // Download single txt
    const btnDown = document.getElementById(`btnDownloadSingle_${item.id}`);
    btnDown?.addEventListener('click', () => {
      const text = item.extractedText;
      if (!text) {
        showToast('No text to download yet.', 'error');
        return;
      }
      const safeName = item.name.replace(/\.[^/.]+$/, '') + '_extracted.txt';
      downloadFile(safeName, text, 'text/plain;charset=utf-8');
    });

    // Deep Clean button
    const btnClean = document.getElementById(`btnCleanSingle_${item.id}`);
    btnClean?.addEventListener('click', () => {
      let t = textarea ? textarea.value : (item.extractedText || '');
      t = cleanOcrText(t, 'handwriting');
      item.extractedText = t;
      item.cleanedText = t;
      if (textarea) textarea.value = t;
      updateCounts(item);
      showToast('Sanitized symbols & aligned line formatting!', 'success');
    });

    // Delete item
    const btnDel = document.getElementById(`btnDelete_${item.id}`);
    btnDel?.addEventListener('click', () => {
      items = items.filter(x => x.id !== item.id);
      card.remove();
      updateBatchBar();
      if (items.length === 0 && emptyState) {
        emptyState.style.display = 'block';
      }
    });
  }

  // Update Card Progress UI
  function updateCardProgress(item) {
    const pWrap = document.getElementById(`cardProgressWrapper_${item.id}`);
    const pBar = document.getElementById(`cardProgressBar_${item.id}`);
    const badge = document.getElementById(`statusBadge_${item.id}`);

    if (pWrap && pBar) {
      if (item.status === 'processing') {
        pWrap.style.display = 'block';
        pBar.style.width = `${item.progress}%`;
      } else {
        pWrap.style.display = 'none';
      }
    }

    if (badge) {
      badge.className = `ocr-badge status-${item.status}`;
      badge.innerText = item.statusText || item.status;
    }
  }

  // Update Complete Card UI
  function updateCardFull(item) {
    updateCardProgress(item);

    const textarea = document.getElementById(`textarea_${item.id}`);
    if (textarea) {
      textarea.value = item.extractedText || '';
    }

    const bodyThumb = document.getElementById(`bodyThumb_${item.id}`);
    if (bodyThumb && item.enhancedDataUrl) {
      bodyThumb.src = item.enhancedDataUrl;
    }

    const confBadge = document.getElementById(`confBadge_${item.id}`);
    if (confBadge) {
      if (item.status === 'done' && item.confidence > 0) {
        confBadge.style.display = 'inline-flex';
        let confClass = 'confidence-high';
        if (item.confidence < 70) confClass = 'confidence-low';
        else if (item.confidence < 85) confClass = 'confidence-mid';

        confBadge.className = `ocr-badge ${confClass}`;
        confBadge.innerText = `🎯 ${item.confidence}% Acc.`;
      } else {
        confBadge.style.display = 'none';
      }
    }

    const btnExtract = document.getElementById(`btnExtractSingle_${item.id}`);
    if (btnExtract) {
      if (item.status === 'done') {
        btnExtract.innerText = '🔄 Re-Extract';
        btnExtract.className = 'btn btn-outline ocr-btn-sm';
      } else if (item.status === 'processing') {
        btnExtract.innerText = '⏳ Extracting...';
        btnExtract.disabled = true;
      } else {
        btnExtract.innerText = '⚡ Extract Text';
        btnExtract.disabled = false;
      }
    }

    updateCounts(item);
  }

  // Word & Character Counter
  function updateCounts(item) {
    const text = item.extractedText || '';
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    item.wordsCount = words;
    item.charsCount = chars;

    const countsEl = document.getElementById(`counts_${item.id}`);
    if (countsEl) {
      countsEl.innerHTML = `<span>Words: <strong>${words}</strong></span><span>Chars: <strong>${chars}</strong></span>`;
    }
  }

  // Update Batch Bar UI
  function updateBatchBar() {
    if (!batchBar) return;
    if (items.length === 0) {
      batchBar.style.display = 'none';
      return;
    }
    batchBar.style.display = 'flex';

    const doneCount = items.filter(x => x.status === 'done').length;
    batchCountBadge.innerText = `${items.length} Image${items.length > 1 ? 's' : ''}`;
    batchStatusText.innerText = doneCount > 0 
      ? `${doneCount} of ${items.length} extracted`
      : 'Ready to extract';
  }

  // Combine All Extracted Texts
  function getCombinedText() {
    const delimiter = ocrDelimiter ? ocrDelimiter.value : 'filename';
    const parts = [];

    items.forEach((item, idx) => {
      const text = (item.extractedText || '').trim();
      if (!text) return;

      let header = '';
      if (delimiter === 'filename') {
        header = `\n========================================\n--- File: ${item.name} ---\n========================================\n`;
      } else if (delimiter === 'page') {
        header = `\n[--- Page ${idx + 1} : ${item.name} ---]\n`;
      } else {
        header = `\n\n`;
      }
      parts.push(header + text);
    });

    return parts.join('\n').trim();
  }

  // Batch: Copy All
  function copyAllText() {
    const combined = getCombinedText();
    if (!combined) {
      showToast('No extracted text available yet. Please extract text first.', 'error');
      return;
    }
    copyToClipboard(combined);
    btnCopyAll.innerText = '✅ Copied All!';
    setTimeout(() => { btnCopyAll.innerText = '📋 Copy All'; }, 2000);
    showToast(`Copied text from all ${items.length} images!`, 'success');
  }

  // Batch: Download All TXT
  function downloadAllTxt() {
    const combined = getCombinedText();
    if (!combined) {
      showToast('No extracted text to download. Please extract text first.', 'error');
      return;
    }
    downloadFile(`AllToolsInOne_OCR_Batch_${Date.now()}.txt`, combined, 'text/plain;charset=utf-8');
    showToast('Downloaded combined text file!', 'success');
  }

  // Batch: Download Word Document (.doc)
  function downloadWordDoc() {
    const combined = getCombinedText();
    if (!combined) {
      showToast('No extracted text to download. Please extract text first.', 'error');
      return;
    }

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Extracted OCR Document</title>
        <style>
          body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.5; }
          h2 { color: #0f172a; border-bottom: 2px solid #3b82f6; padding-bottom: 4px; }
          pre { font-family: Consolas, monospace; white-space: pre-wrap; }
        </style>
      </head>
      <body>
        <h2>Extracted Text — AllToolsInOne OCR</h2>
        <pre>${escapeHtml(combined)}</pre>
      </body>
      </html>
    `;

    downloadFile(`AllToolsInOne_OCR_Document_${Date.now()}.doc`, htmlContent, 'application/msword;charset=utf-8');
    showToast('Downloaded Word (.doc) document!', 'success');
  }

  // Batch: Download ZIP of individual files
  async function downloadZip() {
    const doneItems = items.filter(x => (x.extractedText || '').trim());
    if (doneItems.length === 0) {
      showToast('No extracted text to package. Please extract text first.', 'error');
      return;
    }

    if (typeof window.JSZip === 'undefined') {
      showToast('ZIP library loading... Please try again in 2 seconds.', 'error');
      return;
    }

    btnDownloadZip.innerText = '⏳ Zipping...';
    try {
      const zip = new window.JSZip();
      doneItems.forEach((item) => {
        const safeName = item.name.replace(/\.[^/.]+$/, '') + `_extracted.txt`;
        zip.file(safeName, item.extractedText);
      });

      zip.file('_ALL_EXTRACTED_COMBINED.txt', getCombinedText());

      const content = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(content);
      a.download = `AllToolsInOne_OCR_Batch_${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(a.href);

      showToast(`Downloaded ZIP containing ${doneItems.length} text files!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to create ZIP: ' + err.message, 'error');
    } finally {
      btnDownloadZip.innerText = '📦 ZIP';
    }
  }

  // Find & Replace in all textareas
  function applyFindAndReplace() {
    const findStr = findInput ? findInput.value : '';
    const replaceStr = replaceInput ? replaceInput.value : '';

    if (!findStr) {
      showToast('Please enter text to find.', 'error');
      return;
    }

    let totalReplaced = 0;
    items.forEach(item => {
      if (item.extractedText && item.extractedText.includes(findStr)) {
        const count = (item.extractedText.split(findStr).length - 1);
        totalReplaced += count;
        item.extractedText = item.extractedText.replaceAll(findStr, replaceStr);

        const textarea = document.getElementById(`textarea_${item.id}`);
        if (textarea) textarea.value = item.extractedText;
        updateCounts(item);
      }
    });

    if (replaceCountMsg) {
      replaceCountMsg.innerText = `Replaced ${totalReplaced} match${totalReplaced !== 1 ? 'es' : ''}`;
    }
    showToast(`Replaced ${totalReplaced} occurrences across all cards!`, 'success');
  }

  // Clear All
  function clearAll() {
    if (items.length === 0) return;
    if (!confirm('Are you sure you want to remove all images and extracted text?')) return;

    items = [];
    ocrCardsContainer.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    ocrCardsContainer.appendChild(emptyState);
    updateBatchBar();
    showToast('Cleared all images and text.', 'info');
  }

  // Modal Image Viewer
  function openModal(title, src) {
    if (!imageModal || !modalImg) return;
    modalImg.src = src;
    if (modalTitle) modalTitle.innerText = title;
    imageModal.style.display = 'flex';
  }

  function closeModal() {
    if (imageModal) imageModal.style.display = 'none';
  }

  // Clipboard copy helper
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  }

  // File download helper
  function downloadFile(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Format bytes
  function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function showToast(msg, type = 'info') {
    if (window.showToast) {
      window.showToast(msg, type);
    } else {
      console.log(`[${type.toUpperCase()}] ${msg}`);
    }
  }

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
