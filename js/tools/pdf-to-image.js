/* ═══════════════════════════════════════════════════════════
   AllToolsInOne — PDF to Image Converter
   100% Client-Side. PDF.js renders pages, JSZip packages folder.
   High-Resolution JPG / PNG / WebP exports with custom ZIP folder.
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // Initialize PDF.js worker
  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  // DOM Elements
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const toolWorkspace = document.getElementById('toolWorkspace');

  // Summary Elements
  const docFileName = document.getElementById('docFileName');
  const docTotalPagesBadge = document.getElementById('docTotalPagesBadge');
  const docFileSizeText = document.getElementById('docFileSizeText');
  const btnChangePdf = document.getElementById('btnChangePdf');

  // Settings Elements
  const targetFormat = document.getElementById('targetFormat');
  const renderResolution = document.getElementById('renderResolution');
  const qualityGroup = document.getElementById('qualityGroup');
  const qualitySlider = document.getElementById('qualitySlider');
  const qualityVal = document.getElementById('qualityVal');
  const bgColorSelect = document.getElementById('bgColorSelect');
  const zipFolderName = document.getElementById('zipFolderName');
  const folderPathPreview = document.getElementById('folderPathPreview');
  const fileNamingStyle = document.getElementById('fileNamingStyle');

  // Filter Elements
  const filterAllPagesBtn = document.getElementById('filterAllPagesBtn');
  const filterCustomPagesBtn = document.getElementById('filterCustomPagesBtn');
  const customRangeWrap = document.getElementById('customRangeWrap');
  const pageRangeInput = document.getElementById('pageRangeInput');

  // Toolbar & Grid Elements
  const toolbarStatusText = document.getElementById('toolbarStatusText');
  const btnSelectAllPages = document.getElementById('btnSelectAllPages');
  const btnDeselectAllPages = document.getElementById('btnDeselectAllPages');
  const btnInvertSelection = document.getElementById('btnInvertSelection');
  const pagesGrid = document.getElementById('pagesGrid');

  // Action Buttons
  const btnResetWorkspace = document.getElementById('btnResetWorkspace');
  const btnDownloadAllZip = document.getElementById('btnDownloadAllZip');
  const btnDownloadSelectedZip = document.getElementById('btnDownloadSelectedZip');
  const btnAllPagesCount = document.getElementById('btnAllPagesCount');
  const btnSelectedCount = document.getElementById('btnSelectedCount');

  // Progress & Success
  const progressBox = document.getElementById('progressBox');
  const progressMessage = document.getElementById('progressMessage');
  const progressPct = document.getElementById('progressPct');
  const progressFill = document.getElementById('progressFill');
  const progressSubtext = document.getElementById('progressSubtext');
  const successBox = document.getElementById('successBox');
  const successSummaryText = document.getElementById('successSummaryText');
  const btnDownloadAgain = document.getElementById('btnDownloadAgain');
  const btnConvertAnother = document.getElementById('btnConvertAnother');

  // Modal Elements
  const previewModal = document.getElementById('previewModal');
  const modalPageTitle = document.getElementById('modalPageTitle');
  const modalPreviewImg = document.getElementById('modalPreviewImg');
  const btnModalClose = document.getElementById('btnModalClose');
  const btnModalPrev = document.getElementById('btnModalPrev');
  const btnModalNext = document.getElementById('btnModalNext');
  const btnModalDownload = document.getElementById('btnModalDownload');

  // State
  let currentFile = null;
  let pdfDoc = null;
  let pagesData = []; // [{ pageNum, width, height, selected: true, thumbUrl: null }]
  let isConverting = false;
  let activeModalPageIndex = 0;
  let lastZipBlob = null;
  let lastZipFilename = '';

  // Helpers
  function formatBytes(bytes, decimals = 1) {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  function getCleanDocBaseName() {
    if (!currentFile || !currentFile.name) return 'document';
    return currentFile.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_\-]/g, '_');
  }

  function getFormatExtension() {
    const val = targetFormat.value;
    if (val === 'image/png') return 'png';
    if (val === 'image/webp') return 'webp';
    return 'jpg';
  }

  function updateFolderPathPreview() {
    const folder = (zipFolderName.value.trim() || 'AllToolsInOne-PDF-Images')
      .replace(/[\\/:*?"<>|]/g, '_');
    const ext = getFormatExtension();
    const naming = fileNamingStyle.value;
    const base = getCleanDocBaseName();
    const exampleFile = naming === 'docname-page' ? `${base}_page-01.${ext}` : `page-01.${ext}`;
    if (folderPathPreview) {
      folderPathPreview.textContent = `${folder}/${exampleFile}`;
    }
  }

  // 1. File Upload & PDF Document Parsing
  function setupUploadHandlers() {
    if (!dropZone || !fileInput) return;

    // Dropzone Click
    dropZone.addEventListener('click', (e) => {
      if (e.target !== fileInput) {
        fileInput.click();
      }
    });

    // File Input change
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) handlePdfFile(file);
    });

    // Drag & Drop
    ['dragenter', 'dragover'].forEach((ev) => {
      dropZone.addEventListener(ev, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach((ev) => {
      dropZone.addEventListener(ev, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('dragover');
      });
    });

    dropZone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const file = dt && dt.files && dt.files[0];
      if (file) handlePdfFile(file);
    });

    // Change PDF / Reset
    btnChangePdf?.addEventListener('click', () => {
      fileInput.value = '';
      fileInput.click();
    });

    btnResetWorkspace?.addEventListener('click', resetAll);
    btnConvertAnother?.addEventListener('click', resetAll);
  }

  async function handlePdfFile(file) {
    if (!file) return;

    if (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) {
      if (window.showToast) {
        window.showToast('Please upload a valid PDF document (.pdf)', 'warning');
      } else {
        alert('Please upload a valid PDF document (.pdf)');
      }
      return;
    }

    if (!window.pdfjsLib) {
      window.showToast?.('PDF library is loading, please try again in a moment', 'info');
      return;
    }

    currentFile = file;

    // Show temporary loading status
    dropZone.classList.add('has-file');
    window.showToast?.('Reading PDF document...', 'info', 1800);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = window.pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
        cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
        cMapPacked: true
      });

      pdfDoc = await loadingTask.promise;
      const totalPages = pdfDoc.numPages;

      if (!totalPages || totalPages < 1) {
        throw new Error('This PDF has no readable pages.');
      }

      // Update Summary Header
      docFileName.textContent = file.name;
      docTotalPagesBadge.textContent = `${totalPages} Page${totalPages > 1 ? 's' : ''}`;
      docFileSizeText.textContent = formatBytes(file.size);

      // Default ZIP folder name prefill
      if (!zipFolderName.dataset.userEdited) {
        zipFolderName.value = 'AllToolsInOne-PDF-Images';
      }
      updateFolderPathPreview();

      // Initialize Pages Data
      pagesData = [];
      for (let i = 1; i <= totalPages; i++) {
        pagesData.push({
          pageNum: i,
          width: 0,
          height: 0,
          selected: true,
          thumbUrl: null
        });
      }

      // Hide Drop Zone, Reveal Workspace
      dropZone.style.display = 'none';
      toolWorkspace.style.display = 'block';
      successBox.style.display = 'none';
      progressBox.style.display = 'none';

      // Render Page Cards & Thumbnails
      renderPagesGrid();
      updateSelectionCounts();

      window.showToast?.(`Loaded ${totalPages} pages successfully!`, 'success');

      // Scroll smoothly to workspace
      toolWorkspace.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (err) {
      console.error('PDF Load Error:', err);
      if (err.name === 'PasswordException') {
        window.showToast?.(
          'This PDF is password protected! Please remove password with our PDF Unlock tool.',
          'error',
          5000
        );
      } else {
        window.showToast?.('Could not load PDF: ' + (err.message || 'Corrupt or unreadable file'), 'error');
      }
      dropZone.classList.remove('has-file');
    }
  }

  // 2. Render Page Cards and Generate Thumbnails
  function renderPagesGrid() {
    if (!pagesGrid) return;
    pagesGrid.innerHTML = '';

    const totalPages = pagesData.length;

    pagesData.forEach((item, index) => {
      const pNum = item.pageNum;

      const card = document.createElement('div');
      card.className = `pdf-page-card ${item.selected ? 'is-selected' : ''}`;
      card.id = `pageCard_${pNum}`;

      card.innerHTML = `
        <div class="page-card-header">
          <label class="page-checkbox-label" title="Select/Deselect this page for ZIP export">
            <input type="checkbox" class="page-checkbox" data-page="${pNum}" ${item.selected ? 'checked' : ''}>
            <span>Page ${pNum}</span>
          </label>
          <span class="page-dim-tag" id="pageDim_${pNum}">Loading...</span>
        </div>
        <div class="page-thumb-wrap" data-page="${pNum}" title="Click to view full preview">
          <div class="page-thumb-loading" id="thumbLoader_${pNum}">
            <div class="thumb-spinner"></div>
            <span>Rendering Page ${pNum}...</span>
          </div>
          <img class="page-thumb-img" id="thumbImg_${pNum}" style="display: none;" alt="Page ${pNum}">
        </div>
        <div class="page-card-footer">
          <button type="button" class="btn-page-dl btn-dl-single" data-page="${pNum}" title="Download this single page image">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>Save Image</span>
          </button>
          <button type="button" class="btn-page-zoom btn-zoom-page" data-page="${pNum}" title="Fullscreen Preview">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </button>
        </div>
      `;

      // Checkbox event
      const cb = card.querySelector('.page-checkbox');
      cb.addEventListener('change', (e) => {
        item.selected = e.target.checked;
        card.classList.toggle('is-selected', item.selected);
        updateSelectionCounts();
      });

      // Click on thumbnail area: open full preview
      const thumbWrap = card.querySelector('.page-thumb-wrap');
      thumbWrap.addEventListener('click', () => {
        openModalPreview(index);
      });

      // Zoom button
      const zoomBtn = card.querySelector('.btn-zoom-page');
      zoomBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModalPreview(index);
      });

      // Download single page image button
      const dlBtn = card.querySelector('.btn-dl-single');
      dlBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        downloadSinglePage(pNum);
      });

      pagesGrid.appendChild(card);
    });

    // Start lazy rendering of thumbnails in queue
    generateAllThumbnails();
  }

  async function generateAllThumbnails() {
    if (!pdfDoc) return;

    for (let i = 0; i < pagesData.length; i++) {
      const pNum = pagesData[i].pageNum;
      try {
        const page = await pdfDoc.getPage(pNum);
        
        // Thumbnail scale ~ 0.45 produces crisp ~220-300px thumbnail
        const viewport = page.getViewport({ scale: 0.45 });
        pagesData[i].width = Math.round(viewport.width / 0.45);
        pagesData[i].height = Math.round(viewport.height / 0.45);

        // Update dimension badge
        const dimTag = document.getElementById(`pageDim_${pNum}`);
        if (dimTag) {
          dimTag.textContent = `${pagesData[i].width} × ${pagesData[i].height}`;
        }

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        // Always fill white background for clean thumbnail rendering
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({
          canvasContext: ctx,
          viewport: viewport
        }).promise;

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        pagesData[i].thumbUrl = dataUrl;

        const loader = document.getElementById(`thumbLoader_${pNum}`);
        const img = document.getElementById(`thumbImg_${pNum}`);
        if (loader) loader.style.display = 'none';
        if (img) {
          img.src = dataUrl;
          img.style.display = 'block';
        }
      } catch (err) {
        console.warn(`Failed to render thumbnail for page ${pNum}:`, err);
        const loader = document.getElementById(`thumbLoader_${pNum}`);
        if (loader) loader.innerHTML = '<span style="color:#ef4444;">Error</span>';
      }
    }
  }

  // 3. Selection & Filtering Controls
  function setupSelectionHandlers() {
    // Select All
    btnSelectAllPages?.addEventListener('click', () => {
      pagesData.forEach((item) => { item.selected = true; });
      updateAllCheckboxes();
      updateSelectionCounts();
    });

    // Deselect All
    btnDeselectAllPages?.addEventListener('click', () => {
      pagesData.forEach((item) => { item.selected = false; });
      updateAllCheckboxes();
      updateSelectionCounts();
    });

    // Invert Selection
    btnInvertSelection?.addEventListener('click', () => {
      pagesData.forEach((item) => { item.selected = !item.selected; });
      updateAllCheckboxes();
      updateSelectionCounts();
    });

    // Filter Buttons: All Pages vs Custom Range
    filterAllPagesBtn?.addEventListener('click', () => {
      filterAllPagesBtn.classList.add('active-filter-btn', 'btn-primary');
      filterAllPagesBtn.classList.remove('btn-outline');
      filterCustomPagesBtn.classList.remove('active-filter-btn', 'btn-primary');
      filterCustomPagesBtn.classList.add('btn-outline');
      customRangeWrap.style.display = 'none';

      // Select all
      pagesData.forEach((item) => { item.selected = true; });
      updateAllCheckboxes();
      updateSelectionCounts();
    });

    filterCustomPagesBtn?.addEventListener('click', () => {
      filterCustomPagesBtn.classList.add('active-filter-btn', 'btn-primary');
      filterCustomPagesBtn.classList.remove('btn-outline');
      filterAllPagesBtn.classList.remove('active-filter-btn', 'btn-primary');
      filterAllPagesBtn.classList.add('btn-outline');
      customRangeWrap.style.display = 'block';
      pageRangeInput?.focus();
    });

    pageRangeInput?.addEventListener('input', () => {
      applyPageRangeFilter(pageRangeInput.value);
    });

    // Target format toggle: hide quality for PNG
    targetFormat?.addEventListener('change', () => {
      const isPng = targetFormat.value === 'image/png';
      if (qualityGroup) {
        qualityGroup.style.display = isPng ? 'none' : 'block';
      }
      if (bgColorSelect) {
        // Transparent option only enabled for PNG
        const transOpt = bgColorSelect.querySelector('option[value="transparent"]');
        if (transOpt) {
          transOpt.disabled = !isPng;
          if (!isPng && bgColorSelect.value === 'transparent') {
            bgColorSelect.value = '#FFFFFF';
          }
        }
      }
      updateFolderPathPreview();
    });

    // Quality slider change
    qualitySlider?.addEventListener('input', () => {
      if (qualityVal) qualityVal.textContent = `${qualitySlider.value}%`;
    });

    // Folder Name change
    zipFolderName?.addEventListener('input', () => {
      zipFolderName.dataset.userEdited = 'true';
      updateFolderPathPreview();
    });

    fileNamingStyle?.addEventListener('change', updateFolderPathPreview);
  }

  function applyPageRangeFilter(rangeStr) {
    if (!pagesData || pagesData.length === 0) return;
    const selectedSet = parsePageRange(rangeStr, pagesData.length);
    pagesData.forEach((item) => {
      item.selected = selectedSet.has(item.pageNum);
    });
    updateAllCheckboxes();
    updateSelectionCounts();
  }

  function parsePageRange(str, maxPages) {
    const selected = new Set();
    if (!str || !str.trim()) return selected;

    const parts = str.split(',');
    parts.forEach((part) => {
      const trimmed = part.trim();
      if (!trimmed) return;

      if (trimmed.includes('-')) {
        const [startStr, endStr] = trimmed.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const min = Math.max(1, Math.min(start, end));
          const max = Math.min(maxPages, Math.max(start, end));
          for (let p = min; p <= max; p++) {
            selected.add(p);
          }
        }
      } else {
        const p = parseInt(trimmed, 10);
        if (!isNaN(p) && p >= 1 && p <= maxPages) {
          selected.add(p);
        }
      }
    });
    return selected;
  }

  function updateAllCheckboxes() {
    pagesData.forEach((item) => {
      const cb = document.querySelector(`.page-checkbox[data-page="${item.pageNum}"]`);
      const card = document.getElementById(`pageCard_${item.pageNum}`);
      if (cb) cb.checked = item.selected;
      if (card) card.classList.toggle('is-selected', item.selected);
    });
  }

  function updateSelectionCounts() {
    const total = pagesData.length;
    const selected = pagesData.filter((p) => p.selected).length;

    if (btnAllPagesCount) btnAllPagesCount.textContent = total;
    if (btnSelectedCount) btnSelectedCount.textContent = selected;
    if (toolbarStatusText) {
      toolbarStatusText.textContent = `Found ${total} Page${total !== 1 ? 's' : ''} • ${selected} Selected for ZIP`;
    }
  }

  // 4. Single Page Image Rendering & Download
  async function downloadSinglePage(pageNum) {
    if (!pdfDoc) return;

    const mimeType = targetFormat.value;
    const ext = getFormatExtension();
    const scale = parseFloat(renderResolution.value) || 2;
    const quality = (parseInt(qualitySlider.value, 10) || 92) / 100;
    const bgColor = bgColorSelect.value;
    const naming = fileNamingStyle.value;
    const base = getCleanDocBaseName();
    const pStr = String(pageNum).padStart(2, '0');
    const filename = naming === 'docname-page' ? `${base}_page-${pStr}.${ext}` : `page-${pStr}.${ext}`;

    window.showToast?.(`Rendering Page ${pageNum} at ${scale}x HD...`, 'info', 2000);

    try {
      const blob = await renderPageToBlob(pageNum, scale, mimeType, quality, bgColor);
      if (blob) {
        if (window.downloadFile) {
          window.downloadFile(blob, filename);
        } else {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 10000);
        }
        window.showToast?.(`Saved Page ${pageNum} as ${ext.toUpperCase()}!`, 'success');
      }
    } catch (err) {
      console.error(`Error rendering page ${pageNum}:`, err);
      window.showToast?.(`Failed to render Page ${pageNum}: ${err.message}`, 'error');
    }
  }

  async function renderPageToBlob(pageNum, scale, mimeType, quality, bgColor) {
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: scale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext('2d');

    // Fill white background for JPEG / WebP or solid white selection
    if (bgColor !== 'transparent' || mimeType === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    await page.render({
      canvasContext: ctx,
      viewport: viewport
    }).promise;

    return new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b), mimeType, quality);
    });
  }

  // 5. Batch ZIP Packaging & Download
  function setupExportHandlers() {
    btnDownloadSelectedZip?.addEventListener('click', () => {
      const selected = pagesData.filter((p) => p.selected);
      if (selected.length === 0) {
        window.showToast?.('Please select at least 1 page to export!', 'warning');
        return;
      }
      exportPagesToZip(selected);
    });

    btnDownloadAllZip?.addEventListener('click', () => {
      if (pagesData.length === 0) return;
      exportPagesToZip(pagesData);
    });

    btnDownloadAgain?.addEventListener('click', () => {
      if (lastZipBlob && lastZipFilename) {
        window.downloadFile?.(lastZipBlob, lastZipFilename);
        window.showToast?.('Downloading ZIP again...', 'info');
      }
    });
  }

  async function exportPagesToZip(pagesToExport) {
    if (isConverting) return;
    if (!window.JSZip) {
      window.showToast?.('ZIP library loading, please try again in a moment', 'info');
      return;
    }

    isConverting = true;
    setButtonsDisabled(true);

    // Show Progress Box
    progressBox.style.display = 'block';
    successBox.style.display = 'none';
    updateProgress(0, 'Initializing ZIP packaging...');

    const folderName = (zipFolderName.value.trim() || 'AllToolsInOne-PDF-Images')
      .replace(/[\\/:*?"<>|]/g, '_');
    const mimeType = targetFormat.value;
    const ext = getFormatExtension();
    const scale = parseFloat(renderResolution.value) || 2;
    const quality = (parseInt(qualitySlider.value, 10) || 92) / 100;
    const bgColor = bgColorSelect.value;
    const naming = fileNamingStyle.value;
    const base = getCleanDocBaseName();

    const total = pagesToExport.length;
    const zip = new window.JSZip();

    // Create the branded/custom folder inside the ZIP
    const imgFolder = zip.folder(folderName);

    try {
      for (let i = 0; i < total; i++) {
        const item = pagesToExport[i];
        const pNum = item.pageNum;
        const pct = Math.round(((i) / total) * 85);

        updateProgress(
          pct,
          `Rendering Page ${pNum} (${i + 1} of ${total}) at ${scale}x HD...`
        );

        const blob = await renderPageToBlob(pNum, scale, mimeType, quality, bgColor);
        if (blob) {
          const pStr = String(pNum).padStart(2, '0');
          const filename = naming === 'docname-page' ? `${base}_page-${pStr}.${ext}` : `page-${pStr}.${ext}`;
          imgFolder.file(filename, blob);
        }
      }

      updateProgress(88, `Compressing ${total} images into ZIP archive...`);

      const zipBlob = await zip.generateAsync(
        {
          type: 'blob',
          compression: 'DEFLATE',
          compressionOptions: { level: 6 }
        },
        (metadata) => {
          const pct = 88 + Math.round((metadata.percent / 100) * 11);
          updateProgress(pct, `Packaging archive (${Math.round(metadata.percent)}%)...`);
        }
      );

      const zipFilename = `AllToolsInOne_${base}_images.zip`;
      lastZipBlob = zipBlob;
      lastZipFilename = zipFilename;

      updateProgress(100, 'Complete! Downloading ZIP folder...');

      // Trigger browser download
      window.downloadFile?.(zipBlob, zipFilename);

      // Show Success Result
      setTimeout(() => {
        progressBox.style.display = 'none';
        successBox.style.display = 'block';
        if (successSummaryText) {
          successSummaryText.innerHTML = `Successfully exported <strong>${total} images</strong> (${ext.toUpperCase()} at ${scale}x HD, ${formatBytes(zipBlob.size)}) neatly organized in folder <code>${folderName}/</code>`;
        }
        window.showToast?.(`Downloaded ${zipFilename} successfully!`, 'success');
        successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 700);

    } catch (err) {
      console.error('ZIP Export Error:', err);
      window.showToast?.('Error creating ZIP archive: ' + err.message, 'error');
      progressBox.style.display = 'none';
    } finally {
      isConverting = false;
      setButtonsDisabled(false);
    }
  }

  function updateProgress(pct, message) {
    if (progressPct) progressPct.textContent = `${pct}%`;
    if (progressFill) progressFill.style.width = `${pct}%`;
    if (progressMessage) progressMessage.textContent = message;
  }

  function setButtonsDisabled(disabled) {
    if (btnDownloadSelectedZip) btnDownloadSelectedZip.disabled = disabled;
    if (btnDownloadAllZip) btnDownloadAllZip.disabled = disabled;
    if (btnResetWorkspace) btnResetWorkspace.disabled = disabled;
    if (btnChangePdf) btnChangePdf.disabled = disabled;
  }

  // 6. Modal Preview Functionality
  function setupModalHandlers() {
    btnModalClose?.addEventListener('click', closeModalPreview);
    previewModal?.addEventListener('click', (e) => {
      if (e.target === previewModal) closeModalPreview();
    });

    document.addEventListener('keydown', (e) => {
      if (previewModal && previewModal.style.display === 'flex') {
        if (e.key === 'Escape') closeModalPreview();
        if (e.key === 'ArrowLeft') navigateModalPage(-1);
        if (e.key === 'ArrowRight') navigateModalPage(1);
      }
    });

    btnModalPrev?.addEventListener('click', () => navigateModalPage(-1));
    btnModalNext?.addEventListener('click', () => navigateModalPage(1));

    btnModalDownload?.addEventListener('click', () => {
      if (pagesData[activeModalPageIndex]) {
        downloadSinglePage(pagesData[activeModalPageIndex].pageNum);
      }
    });
  }

  async function openModalPreview(pageIndex) {
    if (!pagesData[pageIndex] || !pdfDoc) return;
    activeModalPageIndex = pageIndex;
    const item = pagesData[pageIndex];

    if (modalPageTitle) {
      modalPageTitle.textContent = `Page ${item.pageNum} of ${pagesData.length} (${item.width || ''} × ${item.height || ''} px)`;
    }

    previewModal.style.display = 'flex';

    // Show thumbnail first while rendering higher quality modal view
    if (item.thumbUrl) {
      modalPreviewImg.src = item.thumbUrl;
    }

    try {
      const page = await pdfDoc.getPage(item.pageNum);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({
        canvasContext: ctx,
        viewport: viewport
      }).promise;

      modalPreviewImg.src = canvas.toDataURL('image/jpeg', 0.9);
    } catch (e) {
      console.warn('Modal preview render error:', e);
    }
  }

  function navigateModalPage(direction) {
    const nextIndex = activeModalPageIndex + direction;
    if (nextIndex >= 0 && nextIndex < pagesData.length) {
      openModalPreview(nextIndex);
    }
  }

  function closeModalPreview() {
    if (previewModal) previewModal.style.display = 'none';
  }

  // 7. Reset Workspace
  function resetAll() {
    currentFile = null;
    pdfDoc = null;
    pagesData = [];
    lastZipBlob = null;
    lastZipFilename = '';

    if (fileInput) fileInput.value = '';
    if (pagesGrid) pagesGrid.innerHTML = '';
    if (pageRangeInput) pageRangeInput.value = '';

    toolWorkspace.style.display = 'none';
    progressBox.style.display = 'none';
    successBox.style.display = 'none';
    dropZone.classList.remove('has-file');
    dropZone.style.display = 'block';

    updateSelectionCounts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Self Initialization
  function init() {
    setupUploadHandlers();
    setupSelectionHandlers();
    setupExportHandlers();
    setupModalHandlers();
    updateFolderPathPreview();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
