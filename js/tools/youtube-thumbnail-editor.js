/* ═══════════════════════════════════════════════════════════
   AllToolsInOne — AI YouTube Thumbnail Editor & Layer Studio
   GPU-Accelerated (WebGL 2.0 / MediaPipe / Fabric.js)
   Multi-Layer Photoshop-style editing, Cutout Outlines, 1080p export
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // State
  let canvas = null;
  let aiSegmenter = null;
  let isAiProcessing = false;
  let undoStack = [];
  let redoStack = [];
  let isUndoRedoAction = false;
  let activeCutoutOriginalCanvas = null; // Stored raw cutout for dynamic re-stroking

  // DOM Elements - Input Source
  const gpuDetectBadge = document.getElementById('gpuDetectBadge');
  const gpuNameText = document.getElementById('gpuNameText');
  const tabYtUrl = document.getElementById('tabYtUrl');
  const tabUpload = document.getElementById('tabUpload');
  const tabDemo = document.getElementById('tabDemo');
  const panelYtUrl = document.getElementById('panelYtUrl');
  const panelUpload = document.getElementById('panelUpload');
  const panelDemo = document.getElementById('panelDemo');
  const ytVideoUrlInput = document.getElementById('ytVideoUrlInput');
  const btnPasteUrl = document.getElementById('btnPasteUrl');
  const btnFetchYt = document.getElementById('btnFetchYt');
  const editorDropZone = document.getElementById('editorDropZone');
  const editorFileInput = document.getElementById('editorFileInput');
  const stickerFileInput = document.getElementById('stickerFileInput');

  // Studio Header & Actions
  const currentDocLabel = document.getElementById('currentDocLabel');
  const btnAiSeparateLayers = document.getElementById('btnAiSeparateLayers');
  const btnCopyClipboard = document.getElementById('btnCopyClipboard');
  const btnExportHd = document.getElementById('btnExportHd');
  const btnExportFullHd = document.getElementById('btnExportFullHd');

  // Quick Action Buttons
  const btnUndo = document.getElementById('btnUndo');
  const btnRedo = document.getElementById('btnRedo');
  const btnBringFwd = document.getElementById('btnBringFwd');
  const btnSendBwd = document.getElementById('btnSendBwd');
  const btnDuplicateLayer = document.getElementById('btnDuplicateLayer');
  const btnDeleteLayer = document.getElementById('btnDeleteLayer');

  // Add Elements
  const btnAddText = document.getElementById('btnAddText');
  const btnAddArrow = document.getElementById('btnAddArrow');
  const btnAddCircle = document.getElementById('btnAddCircle');
  const btnAddBadge = document.getElementById('btnAddBadge');
  const btnAddEmoji = document.getElementById('btnAddEmoji');
  const btnAddStickerImg = document.getElementById('btnAddStickerImg');

  // Background Controls
  const bgBlurSlider = document.getElementById('bgBlurSlider');
  const bgBlurVal = document.getElementById('bgBlurVal');
  const bgDarknessSlider = document.getElementById('bgDarknessSlider');
  const bgDarknessVal = document.getElementById('bgDarknessVal');

  // Layers & Inspector
  const layersStackList = document.getElementById('layersStackList');
  const layerOpacitySlider = document.getElementById('layerOpacitySlider');
  const layerOpacityVal = document.getElementById('layerOpacityVal');

  // Subject / Cutout Controls
  const subjectControlGroup = document.getElementById('subjectControlGroup');
  const checkOutlineEnabled = document.getElementById('checkOutlineEnabled');
  const outlineColorPicker = document.getElementById('outlineColorPicker');
  const outlineWidthSlider = document.getElementById('outlineWidthSlider');
  const outlineWidthVal = document.getElementById('outlineWidthVal');
  const outlineGlowSlider = document.getElementById('outlineGlowSlider');
  const outlineGlowVal = document.getElementById('outlineGlowVal');
  const btnFlipH = document.getElementById('btnFlipH');
  const btnFlipV = document.getElementById('btnFlipV');

  // Text Controls
  const textControlGroup = document.getElementById('textControlGroup');
  const textValueInput = document.getElementById('textValueInput');
  const textFontSelect = document.getElementById('textFontSelect');
  const textFillColor = document.getElementById('textFillColor');
  const textStrokeColor = document.getElementById('textStrokeColor');
  const textStrokeSlider = document.getElementById('textStrokeSlider');
  const textStrokeVal = document.getElementById('textStrokeVal');

  // AI Modal
  const aiProcessingModal = document.getElementById('aiProcessingModal');
  const aiModalStatusTitle = document.getElementById('aiModalStatusTitle');
  const aiModalStatusDesc = document.getElementById('aiModalStatusDesc');

  // 1. Detect Hardware GPU
  function detectGpu() {
    try {
      const glCanvas = document.createElement('canvas');
      const gl = glCanvas.getContext('webgl2') || glCanvas.getContext('webgl');
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          // Format clean GPU name (e.g. "NVIDIA RTX 4060", "Apple M2", "Intel Iris Xe")
          const cleanName = renderer
            .replace(/ANGLE \((.*)\)/i, '$1')
            .replace(/Direct3D.*vs_\d+_\d+.*ps_\d+_\d+/i, '')
            .replace(/\s+/g, ' ')
            .trim();
          if (gpuNameText) {
            gpuNameText.textContent = `GPU: ${cleanName.slice(0, 32)} (WebGL 2.0)`;
          }
          return;
        }
      }
    } catch (e) {
      console.warn('GPU detection note:', e);
    }
    if (gpuNameText) gpuNameText.textContent = 'GPU Hardware Accelerated';
  }

  // 2. Initialize Fabric.js Canvas
  function initCanvas() {
    const canvasEl = document.getElementById('editorCanvas');
    if (!canvasEl || !window.fabric) return;

    // Fixed base size: 1280 x 720 (YouTube standard 16:9)
    canvas = new window.fabric.Canvas('editorCanvas', {
      width: 1280,
      height: 720,
      backgroundColor: '#0b1120',
      preserveObjectStacking: true,
      selectionColor: 'rgba(37, 99, 235, 0.15)',
      selectionBorderColor: '#3b82f6',
      selectionLineWidth: 1.5
    });

    // Custom styling for object transformation handles
    window.fabric.Object.prototype.set({
      transparentCorners: false,
      cornerColor: '#ffffff',
      cornerStrokeColor: '#2563eb',
      borderColor: '#3b82f6',
      cornerSize: 10,
      cornerStyle: 'circle',
      borderDashArray: [4, 4],
      padding: 6
    });

    // Handle canvas events
    canvas.on('selection:created', onObjectSelected);
    canvas.on('selection:updated', onObjectSelected);
    canvas.on('selection:cleared', onSelectionCleared);
    canvas.on('object:modified', () => {
      saveHistoryState();
      refreshLayersList();
    });
    canvas.on('object:added', () => {
      if (!isUndoRedoAction) saveHistoryState();
      refreshLayersList();
    });
    canvas.on('object:removed', () => {
      if (!isUndoRedoAction) saveHistoryState();
      refreshLayersList();
    });

    // Responsive scaling on resize
    handleResponsiveScale();
    window.addEventListener('resize', handleResponsiveScale);

    // Initial demo load
    loadDemoTemplate('tech');
  }

  function handleResponsiveScale() {
    if (!canvas) return;
    const stage = document.querySelector('.studio-canvas-stage');
    if (!stage) return;

    const availableWidth = stage.clientWidth - 48;
    const baseWidth = 1280;
    const scale = Math.min(1, Math.max(0.3, availableWidth / baseWidth));

    const wrapper = document.querySelector('.canvas-wrapper');
    if (wrapper) {
      wrapper.style.transform = `scale(${scale})`;
      wrapper.style.transformOrigin = 'top center';
      wrapper.style.marginBottom = `${-(720 * (1 - scale))}px`;
    }
  }

  // 3. MediaPipe SelfieSegmentation AI Loader
  function initMediaPipe() {
    if (typeof window.SelfieSegmentation === 'undefined') {
      return null;
    }
    try {
      const segmenter = new window.SelfieSegmentation({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
      });
      segmenter.setOptions({
        modelSelection: 1 // 1: Landscape/Portrait optimized
      });
      return segmenter;
    } catch (e) {
      console.error('Error initializing MediaPipe:', e);
      return null;
    }
  }

  // 4. Input Tabs & Fetchers
  function setupInputHandlers() {
    // Mode Switcher Tabs
    tabYtUrl?.addEventListener('click', () => switchInputTab('yt'));
    tabUpload?.addEventListener('click', () => switchInputTab('upload'));
    tabDemo?.addEventListener('click', () => switchInputTab('demo'));

    // Clipboard Paste
    btnPasteUrl?.addEventListener('click', async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text && ytVideoUrlInput) {
          ytVideoUrlInput.value = text.trim();
          fetchYouTubeThumbnail(text.trim());
        }
      } catch (e) {
        ytVideoUrlInput?.focus();
      }
    });

    // Fetch YouTube URL
    btnFetchYt?.addEventListener('click', () => {
      const url = ytVideoUrlInput?.value.trim();
      if (!url) {
        window.showToast?.('Please enter a YouTube link or Video ID', 'warning');
        return;
      }
      fetchYouTubeThumbnail(url);
    });

    ytVideoUrlInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') btnFetchYt?.click();
    });

    // Local File Upload
    editorDropZone?.addEventListener('click', (e) => {
      if (e.target !== editorFileInput) editorFileInput?.click();
    });

    editorFileInput?.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) handleLocalImageFile(file);
    });

    // Drag and Drop
    ['dragenter', 'dragover'].forEach((ev) => {
      editorDropZone?.addEventListener(ev, (e) => {
        e.preventDefault();
        editorDropZone.classList.add('dragover');
      });
    });
    ['dragleave', 'drop'].forEach((ev) => {
      editorDropZone?.addEventListener(ev, (e) => {
        e.preventDefault();
        editorDropZone.classList.remove('dragover');
      });
    });
    editorDropZone?.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const file = dt && dt.files && dt.files[0];
      if (file) handleLocalImageFile(file);
    });

    // Custom Sticker Overlay Upload
    stickerFileInput?.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) addStickerFromFile(file);
    });

    // Demo Templates Click
    document.querySelectorAll('.demo-template-card').forEach((card) => {
      card.addEventListener('click', () => {
        const demo = card.dataset.demo;
        loadDemoTemplate(demo);
      });
    });
  }

  function switchInputTab(tab) {
    [tabYtUrl, tabUpload, tabDemo].forEach((b) => b?.classList.remove('active'));
    [panelYtUrl, panelUpload, panelDemo].forEach((p) => { if (p) p.style.display = 'none'; });

    if (tab === 'yt') {
      tabYtUrl?.classList.add('active');
      if (panelYtUrl) panelYtUrl.style.display = 'block';
    } else if (tab === 'upload') {
      tabUpload?.classList.add('active');
      if (panelUpload) panelUpload.style.display = 'block';
    } else {
      tabDemo?.classList.add('active');
      if (panelDemo) panelDemo.style.display = 'block';
    }
  }

  function extractYouTubeID(url) {
    if (!url) return null;
    const cleanUrl = url.trim();
    const patterns = [
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/i,
      /^[a-zA-Z0-9_-]{11}$/
    ];
    for (const pattern of patterns) {
      const match = cleanUrl.match(pattern);
      if (match && match[1]) return match[1];
      if (match && match[0] && match[0].length === 11) return match[0];
    }
    return null;
  }

  async function fetchYouTubeThumbnail(rawUrl) {
    const videoId = extractYouTubeID(rawUrl);
    if (!videoId) {
      window.showToast?.('Invalid YouTube link. Please paste a valid YouTube video URL or ID.', 'error');
      return;
    }

    window.showToast?.(`Fetching HD thumbnail for ${videoId}...`, 'info', 2000);
    if (currentDocLabel) currentDocLabel.textContent = `YouTube: ${videoId}`;

    // Try Maxres (1080p) first, then fallback to HQ (720p)
    const maxResUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const hqUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // Check if YouTube returned its 120x90 placeholder error thumbnail
      if (img.naturalWidth === 120 && img.naturalHeight === 90) {
        // Fallback to HQ
        loadFallbackThumbnail(hqUrl, videoId);
        return;
      }
      loadBaseImageIntoCanvas(img, `YouTube_${videoId}`);
    };

    img.onerror = () => {
      loadFallbackThumbnail(hqUrl, videoId);
    };

    img.src = maxResUrl;
  }

  function loadFallbackThumbnail(url, videoId) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      loadBaseImageIntoCanvas(img, `YouTube_${videoId}`);
    };
    img.onerror = () => {
      // If direct CORS was blocked, use image proxy
      const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=1280&h=720&fit=cover`;
      const proxyImg = new Image();
      proxyImg.crossOrigin = 'anonymous';
      proxyImg.onload = () => loadBaseImageIntoCanvas(proxyImg, `YouTube_${videoId}`);
      proxyImg.onerror = () => window.showToast?.('Could not load YouTube thumbnail. Try uploading an image directly.', 'error');
      proxyImg.src = proxyUrl;
    };
    img.src = url;
  }

  function handleLocalImageFile(file) {
    if (!file.type.startsWith('image/')) {
      window.showToast?.('Please upload a valid image file (JPG, PNG, WebP)', 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        loadBaseImageIntoCanvas(img, file.name.replace(/\.[^/.]+$/, ''));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function loadBaseImageIntoCanvas(imgElement, name = 'Base Image') {
    if (!canvas) return;

    canvas.clear();
    activeCutoutOriginalCanvas = null;
    undoStack = [];
    redoStack = [];

    // Scale image to fit 1280 x 720 canvas
    const baseImg = new window.fabric.Image(imgElement, {
      left: 0,
      top: 0,
      selectable: true,
      hasControls: true,
      lockMovementX: false,
      lockMovementY: false,
      name: 'Background Image',
      isBaseImage: true
    });

    baseImg.scaleToWidth(1280);
    if (baseImg.getScaledHeight() < 720) {
      baseImg.scaleToHeight(720);
    }

    // Center image
    baseImg.set({
      left: (1280 - baseImg.getScaledWidth()) / 2,
      top: (720 - baseImg.getScaledHeight()) / 2
    });

    canvas.add(baseImg);
    canvas.setActiveObject(baseImg);
    canvas.renderAll();

    if (currentDocLabel) currentDocLabel.textContent = name;
    window.showToast?.('Thumbnail loaded! Click "✨ AI Split into Layers" to deconstruct.', 'success', 3500);

    // Scroll to studio
    document.getElementById('studioShell')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    refreshLayersList();
  }

  // 5. ✨ AI Multi-Layer Separation Engine (Subject + Background + Text)
  async function runAiLayerSeparation() {
    if (!canvas) return;
    if (isAiProcessing) return;

    const objects = canvas.getObjects();
    if (objects.length === 0) {
      window.showToast?.('Please import or upload a thumbnail first!', 'warning');
      return;
    }

    isAiProcessing = true;
    showAiModal('Neural Net Segmenting Subject...', 'Analyzing pixels via WebGL on your GPU to separate creator from background');

    try {
      if (!aiSegmenter) {
        aiSegmenter = initMediaPipe();
      }

      if (!aiSegmenter) {
        throw new Error('MediaPipe AI engine could not initialize on this browser.');
      }

      // Render current composite to offscreen canvas
      const offscreen = document.createElement('canvas');
      offscreen.width = 1280;
      offscreen.height = 720;
      const ctx = offscreen.getContext('2d');

      // Draw all current images onto offscreen
      const dataUrl = canvas.toDataURL({ format: 'png', multiplier: 1 });
      const compositeImg = await loadImagePromise(dataUrl);
      ctx.drawImage(compositeImg, 0, 0, 1280, 720);

      // Run MediaPipe segmentation
      const results = await new Promise((resolve) => {
        aiSegmenter.onResults((res) => resolve(res));
        aiSegmenter.send({ image: offscreen });
      });

      if (!results || !results.segmentationMask) {
        throw new Error('Could not detect distinct subject/person in this thumbnail.');
      }

      // 1. Create Cutout Layer (Subject with transparent background)
      const cutoutCanvas = document.createElement('canvas');
      cutoutCanvas.width = 1280;
      cutoutCanvas.height = 720;
      const cCtx = cutoutCanvas.getContext('2d');

      // Draw mask first
      cCtx.drawImage(results.segmentationMask, 0, 0, 1280, 720);
      cCtx.globalCompositeOperation = 'source-in';
      cCtx.drawImage(compositeImg, 0, 0, 1280, 720);
      cCtx.globalCompositeOperation = 'source-over';

      // 2. Create Background Layer (Original with subtle depth of field blur)
      const bgCanvas = document.createElement('canvas');
      bgCanvas.width = 1280;
      bgCanvas.height = 720;
      const bCtx = bgCanvas.getContext('2d');

      // Draw original image with a rich camera blur
      bCtx.filter = 'blur(6px) brightness(0.92)';
      bCtx.drawImage(compositeImg, 0, 0, 1280, 720);
      bCtx.filter = 'none';

      // Save raw cutout canvas for dynamic outline styling
      activeCutoutOriginalCanvas = cutoutCanvas;

      // 3. Clear canvas and reconstruct into separated layers!
      canvas.clear();

      // Layer 1: Background
      const bgFabricImg = new window.fabric.Image(bgCanvas, {
        left: 0,
        top: 0,
        selectable: true,
        name: 'Background (Blurred)',
        isBackground: true
      });
      canvas.add(bgFabricImg);

      // Layer 2: Creator Cutout with Default MrBeast Electric Yellow Outline!
      const strokedObj = generateStrokedCutoutCanvas(cutoutCanvas, 12, '#FFE600', 16, '#FFE600');
      const cutoutFabricImg = new window.fabric.Image(strokedObj.canvas, {
        left: -strokedObj.padding,
        top: -strokedObj.padding,
        selectable: true,
        hasControls: true,
        name: 'Creator Cutout (Outlined)',
        isCutout: true,
        cutoutPadding: strokedObj.padding
      });
      canvas.add(cutoutFabricImg);

      // Layer 3: Viral Clickbait Title Text
      const headlineText = new window.fabric.IText('I TRIED THIS!', {
        left: 80,
        top: 120,
        fontFamily: 'Impact',
        fontSize: 104,
        fill: '#FFE600',
        stroke: '#000000',
        strokeWidth: 6,
        strokeLineJoin: 'round',
        paintFirst: 'stroke',
        shadow: new window.fabric.Shadow({
          color: 'rgba(0,0,0,0.9)',
          blur: 18,
          offsetX: 6,
          offsetY: 8
        }),
        name: 'Headline Text'
      });
      canvas.add(headlineText);

      // Layer 4: Red Attention Arrow pointing at subject
      const arrowPath = createArrowPath(920, 240, -25);
      canvas.add(arrowPath);

      canvas.setActiveObject(cutoutFabricImg);
      canvas.renderAll();

      hideAiModal();
      window.showToast?.('🎉 AI Split into Layers Complete! Move creator cutout & edit text freely.', 'success', 4000);
      refreshLayersList();

    } catch (err) {
      console.error('AI Segmentation failed:', err);
      hideAiModal();
      window.showToast?.('AI could not segment subject automatically: ' + err.message, 'warning', 4500);
    } finally {
      isAiProcessing = false;
    }
  }

  // 6. Pro YouTuber Outline & Glow Algorithm
  function generateStrokedCutoutCanvas(sourceCanvas, strokeWidth, strokeColor, glowBlur = 0, glowColor = strokeColor) {
    const w = sourceCanvas.width;
    const h = sourceCanvas.height;
    const padding = Math.ceil(strokeWidth + glowBlur + 12);

    const canvasOut = document.createElement('canvas');
    canvasOut.width = w + padding * 2;
    canvasOut.height = h + padding * 2;
    const ctx = canvasOut.getContext('2d');

    // 1. Draw outer glow if enabled
    if (glowBlur > 0) {
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = glowBlur;
      ctx.drawImage(sourceCanvas, padding, padding);
      ctx.shadowBlur = 0;
    }

    // 2. Multi-angle radial dilation for razor-sharp solid outline
    if (strokeWidth > 0) {
      const steps = Math.max(12, Math.min(28, Math.ceil(strokeWidth * 1.8)));

      // Silhouette canvas
      const silCanvas = document.createElement('canvas');
      silCanvas.width = w;
      silCanvas.height = h;
      const sCtx = silCanvas.getContext('2d');
      sCtx.drawImage(sourceCanvas, 0, 0);
      sCtx.globalCompositeOperation = 'source-in';
      sCtx.fillStyle = strokeColor;
      sCtx.fillRect(0, 0, w, h);

      for (let r = 2; r <= strokeWidth; r += Math.max(1, strokeWidth / 4)) {
        for (let i = 0; i < steps; i++) {
          const angle = (i * 2 * Math.PI) / steps;
          const dx = Math.round(Math.cos(angle) * r);
          const dy = Math.round(Math.sin(angle) * r);
          ctx.drawImage(silCanvas, padding + dx, padding + dy);
        }
      }
    }

    // 3. Draw original crisp cutout in center
    ctx.drawImage(sourceCanvas, padding, padding);

    return { canvas: canvasOut, padding };
  }

  function updateActiveCutoutOutline() {
    const active = canvas?.getActiveObject();
    if (!active || !active.isCutout || !activeCutoutOriginalCanvas) return;

    const enabled = checkOutlineEnabled?.checked ?? true;
    const strokeWidth = enabled ? (parseInt(outlineWidthSlider?.value, 10) || 12) : 0;
    const strokeColor = outlineColorPicker?.value || '#FFE600';
    const glowBlur = enabled ? (parseInt(outlineGlowSlider?.value, 10) || 16) : 0;

    const stroked = generateStrokedCutoutCanvas(
      activeCutoutOriginalCanvas,
      strokeWidth,
      strokeColor,
      glowBlur,
      strokeColor
    );

    // Save previous transform state
    const left = active.left;
    const top = active.top;
    const scaleX = active.scaleX;
    const scaleY = active.scaleY;
    const angle = active.angle;
    const prevPadding = active.cutoutPadding || 0;

    active.setElement(stroked.canvas);
    active.cutoutPadding = stroked.padding;

    // Adjust position for padding delta so cutout does not jump
    const padDiff = stroked.padding - prevPadding;
    active.set({
      left: left - padDiff * scaleX,
      top: top - padDiff * scaleY,
      scaleX: scaleX,
      scaleY: scaleY,
      angle: angle
    });

    canvas.renderAll();
  }

  // 7. Add Custom Elements (Text, Arrow, Circle, Badges, Emojis)
  function setupAddElementHandlers() {
    // Add Text
    btnAddText?.addEventListener('click', () => {
      if (!canvas) return;
      const text = new window.fabric.IText('CLICK TO EDIT', {
        left: 200,
        top: 250,
        fontFamily: 'Impact',
        fontSize: 84,
        fill: '#FFE600',
        stroke: '#000000',
        strokeWidth: 5,
        paintFirst: 'stroke',
        shadow: new window.fabric.Shadow({
          color: 'rgba(0,0,0,0.85)',
          blur: 14,
          offsetX: 5,
          offsetY: 6
        }),
        name: 'Custom Text'
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();
    });

    // Add Red Arrow
    btnAddArrow?.addEventListener('click', () => {
      if (!canvas) return;
      const arrow = createArrowPath(400, 300, 15);
      canvas.add(arrow);
      canvas.setActiveObject(arrow);
      canvas.renderAll();
    });

    // Add Attention Ring / Circle
    btnAddCircle?.addEventListener('click', () => {
      if (!canvas) return;
      const circle = new window.fabric.Circle({
        left: 500,
        top: 250,
        radius: 80,
        fill: 'transparent',
        stroke: '#EF4444',
        strokeWidth: 10,
        shadow: new window.fabric.Shadow({ color: '#000', blur: 10 }),
        name: 'Attention Ring'
      });
      canvas.add(circle);
      canvas.setActiveObject(circle);
      canvas.renderAll();
    });

    // Add Badge (4K Ultra / LIVE)
    btnAddBadge?.addEventListener('click', () => {
      if (!canvas) return;
      const badgeGroup = createBadgeGroup('4K ULTRA HD', '#EF4444');
      canvas.add(badgeGroup);
      canvas.setActiveObject(badgeGroup);
      canvas.renderAll();
    });

    // Add Emoji
    btnAddEmoji?.addEventListener('click', () => {
      if (!canvas) return;
      const emojis = ['🔥', '😱', '💰', '🚀', '💯', '⚠️', '👑', '⭐'];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      const text = new window.fabric.Text(randomEmoji, {
        left: 600,
        top: 300,
        fontSize: 90,
        shadow: new window.fabric.Shadow({ color: 'rgba(0,0,0,0.5)', blur: 12 }),
        name: `Emoji ${randomEmoji}`
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();
    });

    // Add Custom Sticker Image Overlay
    btnAddStickerImg?.addEventListener('click', () => {
      stickerFileInput?.click();
    });

    // Font Preset Chips
    document.querySelectorAll('.preset-chip-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        applyTextPreset(btn.dataset.preset);
      });
    });

    // YouTuber Color Swatches
    document.querySelectorAll('.swatch-btn').forEach((swatch) => {
      swatch.addEventListener('click', () => {
        const color = swatch.dataset.color;
        if (outlineColorPicker) outlineColorPicker.value = color;
        updateActiveCutoutOutline();
      });
    });

    // Outline sliders
    checkOutlineEnabled?.addEventListener('change', updateActiveCutoutOutline);
    outlineColorPicker?.addEventListener('input', updateActiveCutoutOutline);
    outlineWidthSlider?.addEventListener('input', () => {
      if (outlineWidthVal) outlineWidthVal.textContent = `${outlineWidthSlider.value}px`;
      updateActiveCutoutOutline();
    });
    outlineGlowSlider?.addEventListener('input', () => {
      if (outlineGlowVal) outlineGlowVal.textContent = `${outlineGlowSlider.value}px`;
      updateActiveCutoutOutline();
    });

    // Flip H & V
    btnFlipH?.addEventListener('click', () => {
      const active = canvas?.getActiveObject();
      if (active) {
        active.set('flipX', !active.flipX);
        canvas.renderAll();
      }
    });
    btnFlipV?.addEventListener('click', () => {
      const active = canvas?.getActiveObject();
      if (active) {
        active.set('flipY', !active.flipY);
        canvas.renderAll();
      }
    });

    // Text Inspector Controls
    textValueInput?.addEventListener('input', () => {
      const active = canvas?.getActiveObject();
      if (active && (active.type === 'i-text' || active.type === 'text')) {
        active.set('text', textValueInput.value);
        canvas.renderAll();
      }
    });
    textFontSelect?.addEventListener('change', () => {
      const active = canvas?.getActiveObject();
      if (active && (active.type === 'i-text' || active.type === 'text')) {
        active.set('fontFamily', textFontSelect.value);
        canvas.renderAll();
      }
    });
    textFillColor?.addEventListener('input', () => {
      const active = canvas?.getActiveObject();
      if (active) {
        active.set('fill', textFillColor.value);
        canvas.renderAll();
      }
    });
    textStrokeColor?.addEventListener('input', () => {
      const active = canvas?.getActiveObject();
      if (active) {
        active.set('stroke', textStrokeColor.value);
        canvas.renderAll();
      }
    });
    textStrokeSlider?.addEventListener('input', () => {
      const active = canvas?.getActiveObject();
      if (active) {
        const val = parseInt(textStrokeSlider.value, 10);
        if (textStrokeVal) textStrokeVal.textContent = `${val}px`;
        active.set('strokeWidth', val);
        canvas.renderAll();
      }
    });

    // Background Depth-of-Field & Vignette Sliders
    bgBlurSlider?.addEventListener('input', () => {
      if (bgBlurVal) bgBlurVal.textContent = `${bgBlurSlider.value}px`;
      applyBackgroundFilter();
    });
    bgDarknessSlider?.addEventListener('input', () => {
      if (bgDarknessVal) bgDarknessVal.textContent = `${bgDarknessSlider.value}%`;
      applyBackgroundFilter();
    });

    // Layer Opacity Slider
    layerOpacitySlider?.addEventListener('input', () => {
      const active = canvas?.getActiveObject();
      if (active) {
        const op = parseInt(layerOpacitySlider.value, 10) / 100;
        if (layerOpacityVal) layerOpacityVal.textContent = `${layerOpacitySlider.value}%`;
        active.set('opacity', op);
        canvas.renderAll();
      }
    });

    // AI Split Button
    btnAiSeparateLayers?.addEventListener('click', runAiLayerSeparation);

    // Export Buttons
    btnExportHd?.addEventListener('click', () => exportThumbnail(1, 'jpg'));
    btnExportFullHd?.addEventListener('click', () => exportThumbnail(1.5, 'png'));
    btnCopyClipboard?.addEventListener('click', copyThumbnailToClipboard);

    // Toolbar actions
    btnBringFwd?.addEventListener('click', () => {
      const active = canvas?.getActiveObject();
      if (active) {
        canvas.bringForward(active);
        refreshLayersList();
      }
    });
    btnSendBwd?.addEventListener('click', () => {
      const active = canvas?.getActiveObject();
      if (active) {
        canvas.sendBackwards(active);
        refreshLayersList();
      }
    });
    btnDuplicateLayer?.addEventListener('click', duplicateActiveLayer);
    btnDeleteLayer?.addEventListener('click', deleteActiveLayer);

    // Undo / Redo
    btnUndo?.addEventListener('click', undo);
    btnRedo?.addEventListener('click', redo);

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteActiveLayer();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        duplicateActiveLayer();
      }
    });
  }

  function createArrowPath(left, top, angle = 0) {
    // Curved attention arrow path
    const pathStr = 'M 10 50 Q 80 0 160 40 L 150 15 L 210 50 L 175 95 L 165 65 Q 85 25 10 70 Z';
    return new window.fabric.Path(pathStr, {
      left: left,
      top: top,
      angle: angle,
      fill: '#EF4444',
      stroke: '#FFFFFF',
      strokeWidth: 4,
      shadow: new window.fabric.Shadow({
        color: 'rgba(0,0,0,0.8)',
        blur: 14,
        offsetX: 4,
        offsetY: 6
      }),
      name: 'Attention Arrow'
    });
  }

  function createBadgeGroup(textStr, bgColor = '#EF4444') {
    const rect = new window.fabric.Rect({
      width: 190,
      height: 48,
      rx: 8,
      ry: 8,
      fill: bgColor,
      stroke: '#ffffff',
      strokeWidth: 2
    });

    const label = new window.fabric.Text(textStr, {
      fontSize: 20,
      fontFamily: 'Montserrat',
      fontWeight: '900',
      fill: '#ffffff',
      originX: 'center',
      originY: 'center',
      left: 95,
      top: 24
    });

    return new window.fabric.Group([rect, label], {
      left: 100,
      top: 580,
      shadow: new window.fabric.Shadow({ color: '#000', blur: 12, offsetY: 4 }),
      name: `Badge (${textStr})`
    });
  }

  function applyTextPreset(preset) {
    if (!canvas) return;
    const presets = {
      mrbeast: { font: 'Impact', fill: '#FFE600', stroke: '#000000', strokeWidth: 6, text: 'OMG!' },
      neon: { font: 'Montserrat', fill: '#00F0FF', stroke: '#000000', strokeWidth: 5, text: 'CYBERPUNK' },
      gaming: { font: 'Bangers', fill: '#EF4444', stroke: '#FFFFFF', strokeWidth: 6, text: 'LEVEL 100' },
      drama: { font: 'Anton', fill: '#FFFFFF', stroke: '#000000', strokeWidth: 7, text: 'EXPOSED!' }
    };

    const cfg = presets[preset] || presets.mrbeast;
    const active = canvas.getActiveObject();

    if (active && (active.type === 'i-text' || active.type === 'text')) {
      active.set({
        fontFamily: cfg.font,
        fill: cfg.fill,
        stroke: cfg.stroke,
        strokeWidth: cfg.strokeWidth
      });
      canvas.renderAll();
    } else {
      const text = new window.fabric.IText(cfg.text, {
        left: 250,
        top: 280,
        fontFamily: cfg.font,
        fontSize: 96,
        fill: cfg.fill,
        stroke: cfg.stroke,
        strokeWidth: cfg.strokeWidth,
        paintFirst: 'stroke',
        shadow: new window.fabric.Shadow({ color: '#000', blur: 16, offsetX: 5, offsetY: 6 }),
        name: `Preset ${cfg.font}`
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();
    }
  }

  function addStickerFromFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const sticker = new window.fabric.Image(img, {
          left: 400,
          top: 250,
          name: `Overlay (${file.name.slice(0, 16)})`
        });
        if (sticker.width > 400) sticker.scaleToWidth(400);
        canvas.add(sticker);
        canvas.setActiveObject(sticker);
        canvas.renderAll();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function applyBackgroundFilter() {
    if (!canvas) return;
    const bg = canvas.getObjects().find((o) => o.isBackground || o.isBaseImage);
    if (!bg) return;

    const blurPx = parseInt(bgBlurSlider?.value, 10) || 0;
    const darkPct = parseInt(bgDarknessSlider?.value, 10) || 0;

    // Apply via Fabric CSS canvas filter or object brightness
    const filters = [];
    if (blurPx > 0) {
      filters.push(new window.fabric.Image.filters.Blur({ blur: blurPx / 35 }));
    }
    if (darkPct > 0) {
      filters.push(new window.fabric.Image.filters.Brightness({ brightness: -darkPct / 100 }));
    }

    bg.filters = filters;
    bg.applyFilters();
    canvas.renderAll();
  }

  // 8. Layers Panel & Selection Synchronizer
  function refreshLayersList() {
    if (!layersStackList || !canvas) return;
    layersStackList.innerHTML = '';

    const objects = canvas.getObjects().slice().reverse(); // Show top layer first like Photoshop

    objects.forEach((obj) => {
      const item = document.createElement('div');
      item.className = `layer-item ${canvas.getActiveObject() === obj ? 'active' : ''}`;

      const icon = getLayerIcon(obj);
      const name = obj.name || `${obj.type} Layer`;

      item.innerHTML = `
        <div class="layer-info">
          <div class="layer-thumb-preview">${icon}</div>
          <div class="layer-title" title="${name}">${name}</div>
        </div>
        <div class="layer-controls">
          <button type="button" class="layer-btn btn-toggle-vis ${!obj.visible ? 'is-hidden' : ''}" title="Toggle Visibility">
            ${obj.visible ? '👁️' : '🚫'}
          </button>
          <button type="button" class="layer-btn btn-layer-del" title="Delete Layer" style="color: #ef4444;">✕</button>
        </div>
      `;

      // Select Layer
      item.addEventListener('click', (e) => {
        if (e.target.closest('.layer-controls')) return;
        canvas.setActiveObject(obj);
        canvas.renderAll();
      });

      // Toggle Visibility
      const visBtn = item.querySelector('.btn-toggle-vis');
      visBtn.addEventListener('click', () => {
        obj.set('visible', !obj.visible);
        visBtn.innerHTML = obj.visible ? '👁️' : '🚫';
        visBtn.classList.toggle('is-hidden', !obj.visible);
        canvas.renderAll();
      });

      // Delete Layer
      const delBtn = item.querySelector('.btn-layer-del');
      delBtn.addEventListener('click', () => {
        canvas.remove(obj);
        canvas.renderAll();
      });

      layersStackList.appendChild(item);
    });
  }

  function getLayerIcon(obj) {
    if (obj.isCutout) return '👤';
    if (obj.isBackground || obj.isBaseImage) return '🖼️';
    if (obj.type === 'i-text' || obj.type === 'text') return '🔤';
    if (obj.type === 'path') return '🎯';
    if (obj.type === 'group') return '🏷️';
    if (obj.type === 'circle') return '⭕';
    return '📄';
  }

  function onObjectSelected(e) {
    const active = e.selected && e.selected[0];
    if (!active) return;

    refreshLayersList();

    // Universal Opacity
    if (layerOpacitySlider) {
      layerOpacitySlider.value = Math.round((active.opacity ?? 1) * 100);
      if (layerOpacityVal) layerOpacityVal.textContent = `${layerOpacitySlider.value}%`;
    }

    // Cutout Controls
    if (active.isCutout) {
      if (subjectControlGroup) subjectControlGroup.style.display = 'flex';
      if (textControlGroup) textControlGroup.style.display = 'none';
    } else if (active.type === 'i-text' || active.type === 'text') {
      if (subjectControlGroup) subjectControlGroup.style.display = 'none';
      if (textControlGroup) textControlGroup.style.display = 'flex';
      if (textValueInput) textValueInput.value = active.text || '';
      if (textFontSelect) textFontSelect.value = active.fontFamily || 'Impact';
      if (textFillColor && typeof active.fill === 'string') textFillColor.value = active.fill;
      if (textStrokeColor && typeof active.stroke === 'string') textStrokeColor.value = active.stroke;
      if (textStrokeSlider) {
        textStrokeSlider.value = active.strokeWidth || 0;
        if (textStrokeVal) textStrokeVal.textContent = `${active.strokeWidth || 0}px`;
      }
    } else {
      if (subjectControlGroup) subjectControlGroup.style.display = 'none';
      if (textControlGroup) textControlGroup.style.display = 'none';
    }
  }

  function onSelectionCleared() {
    refreshLayersList();
    if (subjectControlGroup) subjectControlGroup.style.display = 'none';
    if (textControlGroup) textControlGroup.style.display = 'none';
  }

  function duplicateActiveLayer() {
    const active = canvas?.getActiveObject();
    if (!active) return;

    active.clone((cloned) => {
      cloned.set({
        left: active.left + 25,
        top: active.top + 25,
        name: `${active.name || 'Layer'} Copy`
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
    });
  }

  function deleteActiveLayer() {
    const active = canvas?.getActiveObject();
    if (active) {
      canvas.remove(active);
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  }

  // 9. Undo & Redo History System
  function saveHistoryState() {
    if (!canvas) return;
    const json = JSON.stringify(canvas.toDatalessJSON(['name', 'isCutout', 'isBackground', 'isBaseImage', 'cutoutPadding']));
    undoStack.push(json);
    if (undoStack.length > 25) undoStack.shift();
    redoStack = [];
  }

  function undo() {
    if (undoStack.length <= 1) return;
    isUndoRedoAction = true;
    const currentState = undoStack.pop();
    redoStack.push(currentState);
    const prevState = undoStack[undoStack.length - 1];

    canvas.loadFromJSON(prevState, () => {
      canvas.renderAll();
      refreshLayersList();
      isUndoRedoAction = false;
    });
  }

  function redo() {
    if (redoStack.length === 0) return;
    isUndoRedoAction = true;
    const nextState = redoStack.pop();
    undoStack.push(nextState);

    canvas.loadFromJSON(nextState, () => {
      canvas.renderAll();
      refreshLayersList();
      isUndoRedoAction = false;
    });
  }

  // 10. High-Resolution 1080p Export & Clipboard Copy
  function exportThumbnail(multiplier = 1, format = 'jpg') {
    if (!canvas) return;

    const mime = format === 'png' ? 'image/png' : 'image/jpeg';
    const quality = format === 'png' ? 1.0 : 0.92;
    const resName = multiplier > 1 ? '1080p_FullHD' : '720p_HD';
    const filename = `YouTube_Thumbnail_${resName}.${format}`;

    window.showToast?.(`Generating ${resName} thumbnail...`, 'info', 1800);

    // Deselect objects so bounding box is not exported
    canvas.discardActiveObject();
    canvas.renderAll();

    const dataUrl = canvas.toDataURL({
      format: format === 'png' ? 'png' : 'jpeg',
      multiplier: multiplier,
      quality: quality
    });

    // Convert dataURL to Blob and download
    fetch(dataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        if (window.downloadFile) {
          window.downloadFile(blob, filename);
        } else {
          const a = document.createElement('a');
          a.href = dataUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        window.showToast?.(`Exported ${filename} (${(blob.size / 1024).toFixed(0)} KB)!`, 'success');
      });
  }

  async function copyThumbnailToClipboard() {
    if (!canvas) return;

    canvas.discardActiveObject();
    canvas.renderAll();

    const dataUrl = canvas.toDataURL({ format: 'png', multiplier: 1 });
    const res = await fetch(dataUrl);
    const blob = await res.blob();

    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      window.showToast?.('Copied thumbnail to clipboard! Paste directly in YouTube Studio.', 'success', 3500);
    } catch (e) {
      window.showToast?.('Clipboard copy failed. Please use Export HD instead.', 'warning');
    }
  }

  // 11. Quick Demo Templates
  function loadDemoTemplate(type) {
    if (!canvas) return;

    canvas.clear();
    activeCutoutOriginalCanvas = null;
    undoStack = [];
    redoStack = [];

    // Dark Studio Background
    const bgRect = new window.fabric.Rect({
      left: 0,
      top: 0,
      width: 1280,
      height: 720,
      fill: new window.fabric.Gradient({
        type: 'linear',
        gradientUnits: 'pixels',
        coords: { x1: 0, y1: 0, x2: 1280, y2: 720 },
        colorStops: [
          { offset: 0, color: type === 'gaming' ? '#450a0a' : (type === 'reaction' ? '#0c0a09' : '#0f172a') },
          { offset: 1, color: type === 'gaming' ? '#020617' : (type === 'reaction' ? '#1c1917' : '#020617') }
        ]
      }),
      selectable: false,
      name: 'Background Gradient',
      isBackground: true
    });
    canvas.add(bgRect);

    if (type === 'gaming') {
      const title = new window.fabric.IText('I BEAT THIS BOSS!', {
        left: 80,
        top: 100,
        fontFamily: 'Bangers',
        fontSize: 110,
        fill: '#EF4444',
        stroke: '#FFFFFF',
        strokeWidth: 8,
        paintFirst: 'stroke',
        shadow: new window.fabric.Shadow({ color: '#000', blur: 20, offsetX: 8, offsetY: 8 }),
        name: 'Gaming Title'
      });
      canvas.add(title);

      const subText = new window.fabric.IText('0.01% IMPOSSIBLE', {
        left: 90,
        top: 240,
        fontFamily: 'Impact',
        fontSize: 64,
        fill: '#FFE600',
        stroke: '#000000',
        strokeWidth: 6,
        name: 'Subtitle'
      });
      canvas.add(subText);

      const emoji = new window.fabric.Text('🔥', { left: 950, top: 220, fontSize: 130, name: 'Fire Emoji' });
      canvas.add(emoji);

      const badge = createBadgeGroup('WORLD FIRST', '#DC2626');
      canvas.add(badge);

    } else if (type === 'reaction') {
      const title = new window.fabric.IText('WHAT JUST HAPPENED?!', {
        left: 60,
        top: 80,
        fontFamily: 'Impact',
        fontSize: 100,
        fill: '#FFE600',
        stroke: '#000000',
        strokeWidth: 8,
        paintFirst: 'stroke',
        shadow: new window.fabric.Shadow({ color: '#000', blur: 18, offsetX: 6, offsetY: 8 }),
        name: 'Reaction Title'
      });
      canvas.add(title);

      const emoji = new window.fabric.Text('😱', { left: 880, top: 220, fontSize: 150, name: 'Shock Face' });
      canvas.add(emoji);

      const arrow = createArrowPath(780, 400, -35);
      canvas.add(arrow);

    } else {
      // Tech Review
      const title = new window.fabric.IText('DON\'T BUY THIS!', {
        left: 80,
        top: 100,
        fontFamily: 'Montserrat',
        fontWeight: '900',
        fontSize: 105,
        fill: '#FFFFFF',
        stroke: '#000000',
        strokeWidth: 8,
        paintFirst: 'stroke',
        shadow: new window.fabric.Shadow({ color: '#000', blur: 20, offsetX: 8, offsetY: 8 }),
        name: 'Tech Title'
      });
      canvas.add(title);

      const pill = new window.fabric.IText('HONEST 30 DAYS REVIEW', {
        left: 85,
        top: 240,
        fontFamily: 'Impact',
        fontSize: 56,
        fill: '#00F0FF',
        stroke: '#000000',
        strokeWidth: 5,
        name: 'Tech Subtitle'
      });
      canvas.add(pill);

      const badge = createBadgeGroup('4K ULTRA HD', '#EF4444');
      canvas.add(badge);

      const arrow = createArrowPath(880, 320, -15);
      canvas.add(arrow);
    }

    canvas.renderAll();
    refreshLayersList();
  }

  // 12. Helpers
  function loadImagePromise(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  function showAiModal(title, desc) {
    if (aiProcessingModal) {
      if (aiModalStatusTitle) aiModalStatusTitle.textContent = title;
      if (aiModalStatusDesc) aiModalStatusDesc.textContent = desc;
      aiProcessingModal.style.display = 'flex';
    }
  }

  function hideAiModal() {
    if (aiProcessingModal) aiProcessingModal.style.display = 'none';
  }

  // Self Initialization
  function init() {
    detectGpu();
    initCanvas();
    setupInputHandlers();
    setupAddElementHandlers();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
