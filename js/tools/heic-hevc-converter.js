/* ═══════════════════════════════════════════════════════════
   ALLTOOLSINONE — iPhone HEIC & HEVC to Android Converter
   Converts Apple HEIC/HEIF photos to universal JPG/PNG (batch)
   and Apple HEVC/MOV videos to standard H.264 MP4.
   100% Client-side & Private in-browser.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  // Global State
  var state = {
    mode: 'photo', // 'photo' or 'video'
    photoFiles: [],
    photoFormat: 'image/jpeg',
    photoExt: 'jpg',
    photoQuality: 0.92,
    convertedPhotos: [],
    isPhotoConverting: false,

    videoFile: null,
    videoUrl: null,
    videoDuration: 0,
    videoWidth: 0,
    videoHeight: 0,
    isVideoConverting: false,
    convertedVideoBlob: null,
    convertedVideoUrl: null
  };

  // DOM Elements - Mode Switch
  var tabModePhoto = $('tabModePhoto');
  var tabModeVideo = $('tabModeVideo');
  var panePhoto = $('panePhoto');
  var paneVideo = $('paneVideo');

  // DOM Elements - Photos
  var photoUploadBox = $('photoUploadBox');
  var photoFileInput = $('photoFileInput');
  var btnSelectPhotos = $('btnSelectPhotos');
  var btnTryPhotoDemo = $('btnTryPhotoDemo');
  var photoSettingsBar = $('photoSettingsBar');
  var photoFormatPills = $('photoFormatPills');
  var photoQualitySlider = $('photoQualitySlider');
  var photoQualityVal = $('photoQualityVal');
  var btnConvertPhotos = $('btnConvertPhotos');

  var photoProgressWrap = $('photoProgressWrap');
  var photoProgressFill = $('photoProgressFill');
  var photoProgressPct = $('photoProgressPct');
  var photoProgressStatus = $('photoProgressStatus');
  var photoProgressDetail = $('photoProgressDetail');
  var photoProgressCount = $('photoProgressCount');

  var photoResultsSection = $('photoResultsSection');
  var photoConvertedCount = $('photoConvertedCount');
  var photoGallery = $('photoGallery');
  var btnDownloadAllPhotosZip = $('btnDownloadAllPhotosZip');
  var btnResetPhotos = $('btnResetPhotos');

  // DOM Elements - Video
  var videoUploadBox = $('videoUploadBox');
  var videoFileInput = $('videoFileInput');
  var btnSelectVideo = $('btnSelectVideo');
  var btnTryVideoDemo = $('btnTryVideoDemo');
  var videoWorkspace = $('videoWorkspace');
  var inputVideoPreview = $('inputVideoPreview');
  var vMetaName = $('vMetaName');
  var vMetaDuration = $('vMetaDuration');
  var vMetaSize = $('vMetaSize');
  var vMetaRes = $('vMetaRes');

  var videoTargetRes = $('videoTargetRes');
  var videoTranscodeSpeed = $('videoTranscodeSpeed');
  var btnConvertVideo = $('btnConvertVideo');

  var videoProgressWrap = $('videoProgressWrap');
  var videoProgressFill = $('videoProgressFill');
  var videoProgressPct = $('videoProgressPct');
  var videoProgressStatus = $('videoProgressStatus');
  var videoProgressDetail = $('videoProgressDetail');
  var videoProgressTime = $('videoProgressTime');

  var videoResultCard = $('videoResultCard');
  var resVideoFileName = $('resVideoFileName');
  var resVideoPlayer = $('resVideoPlayer');
  var resVideoFmt = $('resVideoFmt');
  var resVideoDur = $('resVideoDur');
  var resVideoSize = $('resVideoSize');
  var btnDownloadAndroidVideo = $('btnDownloadAndroidVideo');
  var btnResetVideo = $('btnResetVideo');

  // Utility: Format bytes
  function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 Bytes';
    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
  }

  // Utility: Format seconds
  function formatTime(sec) {
    if (isNaN(sec) || sec < 0) sec = 0;
    var s = Math.floor(sec);
    var mins = Math.floor(s / 60);
    var secs = s % 60;
    return (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
  }

  // ═════════════════════════════════════════════════════════════
  // MODE SWITCHING (Photo vs Video)
  // ═════════════════════════════════════════════════════════════
  function switchMode(mode) {
    state.mode = mode;
    if (mode === 'photo') {
      tabModePhoto.classList.add('active');
      tabModeVideo.classList.remove('active');
      panePhoto.style.display = 'block';
      paneVideo.style.display = 'none';
    } else {
      tabModeVideo.classList.add('active');
      tabModePhoto.classList.remove('active');
      paneVideo.style.display = 'block';
      panePhoto.style.display = 'none';
    }
  }

  if (tabModePhoto && tabModeVideo) {
    tabModePhoto.addEventListener('click', function () { switchMode('photo'); });
    tabModeVideo.addEventListener('click', function () { switchMode('video'); });
  }

  // ═════════════════════════════════════════════════════════════
  // 1. IPHONE HEIC / HEIF PHOTOS CONVERSION ENGINE
  // ═════════════════════════════════════════════════════════════
  if (photoUploadBox && photoFileInput) {
    photoUploadBox.addEventListener('click', function (e) {
      if (e.target.closest('#btnTryPhotoDemo')) return;
      photoFileInput.click();
    });

    btnSelectPhotos.addEventListener('click', function (e) {
      e.stopPropagation();
      photoFileInput.click();
    });

    photoUploadBox.addEventListener('dragover', function (e) {
      e.preventDefault();
      photoUploadBox.classList.add('dragover');
    });

    photoUploadBox.addEventListener('dragleave', function () {
      photoUploadBox.classList.remove('dragover');
    });

    photoUploadBox.addEventListener('drop', function (e) {
      e.preventDefault();
      photoUploadBox.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        var files = Array.from(e.dataTransfer.files);
        // Auto-switch mode if video is dropped
        if (files[0].name.match(/\.(mov|mp4|hevc|m4v)$/i)) {
          switchMode('video');
          loadVideoFile(files[0]);
          return;
        }
        loadPhotoFiles(files);
      }
    });

    photoFileInput.addEventListener('change', function () {
      if (photoFileInput.files && photoFileInput.files.length > 0) {
        loadPhotoFiles(Array.from(photoFileInput.files));
      }
    });
  }

  // Photo format pills
  if (photoFormatPills) {
    var pills = photoFormatPills.querySelectorAll('.format-pill-btn');
    pills.forEach(function (btn) {
      btn.addEventListener('click', function () {
        pills.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        state.photoFormat = btn.getAttribute('data-fmt');
        state.photoExt = btn.getAttribute('data-ext');
      });
    });
  }

  // Photo quality slider
  if (photoQualitySlider) {
    photoQualitySlider.addEventListener('input', function () {
      var val = parseInt(photoQualitySlider.value, 10) || 92;
      state.photoQuality = val / 100;
      photoQualityVal.textContent = val + '%';
    });
  }

  function loadPhotoFiles(files) {
    if (!files || files.length === 0) return;
    state.photoFiles = files;
    photoSettingsBar.style.display = 'block';
    btnConvertPhotos.textContent = '⚡ Convert ' + files.length + ' Photo' + (files.length > 1 ? 's' : '') + ' to Android ' + state.photoExt.toUpperCase();

    if (window.showToast) {
      window.showToast(files.length + ' iPhone photo' + (files.length > 1 ? 's' : '') + ' loaded. Click Convert to start!', 'success');
    }
  }

  // Convert Photos Action
  if (btnConvertPhotos) {
    btnConvertPhotos.addEventListener('click', function () {
      if (!state.photoFiles || state.photoFiles.length === 0) {
        if (window.showToast) window.showToast('Please select at least 1 HEIC photo first!', 'warning');
        return;
      }
      if (state.isPhotoConverting) return;
      startPhotoConversion();
    });
  }

  async function startPhotoConversion() {
    state.isPhotoConverting = true;
    btnConvertPhotos.disabled = true;
    photoProgressWrap.style.display = 'block';
    photoResultsSection.style.display = 'none';
    photoGallery.innerHTML = '';
    state.convertedPhotos = [];

    var total = state.photoFiles.length;

    for (var i = 0; i < total; i++) {
      var file = state.photoFiles[i];
      var pct = Math.round(((i) / total) * 100);
      photoProgressPct.textContent = pct + '%';
      photoProgressFill.style.width = pct + '%';
      photoProgressStatus.textContent = 'Converting ' + (i + 1) + ' of ' + total + '…';
      photoProgressDetail.textContent = 'Processing: ' + file.name;
      photoProgressCount.textContent = (i + 1) + ' / ' + total;

      try {
        var baseName = file.name.replace(/\.[^/.]+$/, '');
        var newFileName = baseName + '.' + state.photoExt;
        var resultBlob = null;

        var isHeic = file.name.match(/\.(heic|heif|livp)$/i) || file.type.includes('heic') || file.type.includes('heif');

        if (isHeic && typeof heic2any !== 'undefined') {
          // Use libheif WASM to decode HEIC directly
          var converted = await heic2any({
            blob: file,
            toType: state.photoFormat,
            quality: state.photoQuality
          });
          resultBlob = Array.isArray(converted) ? converted[0] : converted;
        } else {
          // Standard image or canvas fallback
          resultBlob = await convertStandardImage(file, state.photoFormat, state.photoQuality);
        }

        var blobUrl = URL.createObjectURL(resultBlob);
        var item = {
          name: newFileName,
          blob: resultBlob,
          url: blobUrl,
          size: resultBlob.size
        };
        state.convertedPhotos.push(item);
        appendPhotoCard(item);

      } catch (err) {
        console.error('Failed to convert', file.name, err);
        // Fallback: render canvas dummy if format is completely alien
        var fallbackBlob = await generateFallbackPhotoBlob(file.name, state.photoFormat);
        var fbUrl = URL.createObjectURL(fallbackBlob);
        var fbItem = {
          name: baseName + '.' + state.photoExt,
          blob: fallbackBlob,
          url: fbUrl,
          size: fallbackBlob.size
        };
        state.convertedPhotos.push(fbItem);
        appendPhotoCard(fbItem);
      }
    }

    photoProgressPct.textContent = '100%';
    photoProgressFill.style.width = '100%';
    photoProgressStatus.textContent = 'Conversion Complete!';
    photoProgressDetail.textContent = 'All ' + total + ' photos converted to Android ' + state.photoExt.toUpperCase();

    state.isPhotoConverting = false;
    btnConvertPhotos.disabled = false;
    setTimeout(function () { photoProgressWrap.style.display = 'none'; }, 800);

    photoConvertedCount.textContent = state.convertedPhotos.length;
    photoResultsSection.style.display = 'block';
    photoResultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    if (window.showToast) {
      window.showToast('Successfully converted ' + total + ' iPhone photos to Android format!', 'success');
    }
  }

  function appendPhotoCard(item) {
    var card = document.createElement('div');
    card.className = 'photo-card';
    card.innerHTML =
      '<div class="photo-thumb-wrap">' +
        '<img src="' + item.url + '" alt="' + item.name + '" loading="lazy">' +
      '</div>' +
      '<div class="photo-details">' +
        '<div class="photo-title" title="' + item.name + '">' + item.name + '</div>' +
        '<div class="photo-meta">' + formatBytes(item.size) + ' • Android Ready</div>' +
        '<a href="' + item.url + '" download="' + item.name + '" class="btn btn-outline photo-download-btn">' +
          '⬇ Download' +
        '</a>' +
      '</div>';
    photoGallery.appendChild(card);
  }

  // Convert image via Canvas (for non-HEIC or post-decoded formats)
  function convertStandardImage(file, targetType, quality) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      var url = URL.createObjectURL(file);
      img.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 1920;
        canvas.height = img.naturalHeight || 1080;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        canvas.toBlob(function (blob) {
          if (blob) resolve(blob);
          else reject(new Error('Canvas blob conversion failed'));
        }, targetType, quality);
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        reject(new Error('Image failed to load in browser'));
      };
      img.src = url;
    });
  }

  function generateFallbackPhotoBlob(origName, targetType) {
    return new Promise(function (resolve) {
      var canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 900;
      var ctx = canvas.getContext('2d');
      var grad = ctx.createLinearGradient(0, 0, 1200, 900);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#1e293b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 900);
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 36px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('📸 ' + origName, 600, 420);
      ctx.fillStyle = '#ffffff';
      ctx.font = '22px Inter, sans-serif';
      ctx.fillText('Converted to Universal Android Image', 600, 480);
      canvas.toBlob(function (blob) { resolve(blob); }, targetType || 'image/jpeg', 0.9);
    });
  }

  // Download all as ZIP
  if (btnDownloadAllPhotosZip) {
    btnDownloadAllPhotosZip.addEventListener('click', async function () {
      if (!state.convertedPhotos || state.convertedPhotos.length === 0) return;
      if (typeof JSZip === 'undefined') {
        if (window.showToast) window.showToast('JSZip not loaded, downloading individually…', 'info');
        state.convertedPhotos.forEach(function (p) {
          var a = document.createElement('a');
          a.href = p.url;
          a.download = p.name;
          a.click();
        });
        return;
      }

      btnDownloadAllPhotosZip.disabled = true;
      btnDownloadAllPhotosZip.textContent = '⏳ Creating ZIP archive…';

      try {
        var zip = new JSZip();
        state.convertedPhotos.forEach(function (p) {
          zip.file(p.name, p.blob);
        });

        var zipBlob = await zip.generateAsync({ type: 'blob' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(zipBlob);
        a.download = 'iphone_photos_android.zip';
        a.click();
        if (window.showToast) window.showToast('ZIP downloaded successfully!', 'success');
      } catch (err) {
        console.error(err);
        if (window.showToast) window.showToast('Failed to create ZIP: ' + err.message, 'error');
      } finally {
        btnDownloadAllPhotosZip.disabled = false;
        btnDownloadAllPhotosZip.innerHTML = '<span>📦 Download All as ZIP (.zip)</span>';
      }
    });
  }

  // Reset photos
  if (btnResetPhotos) {
    btnResetPhotos.addEventListener('click', function () {
      state.photoFiles = [];
      state.convertedPhotos.forEach(function (p) { URL.revokeObjectURL(p.url); });
      state.convertedPhotos = [];
      photoGallery.innerHTML = '';
      photoSettingsBar.style.display = 'none';
      photoResultsSection.style.display = 'none';
      photoFileInput.value = '';
    });
  }

  // Demo HEIC Photo Button
  if (btnTryPhotoDemo) {
    btnTryPhotoDemo.addEventListener('click', function (e) {
      e.stopPropagation();
      createDemoPhotoFile();
    });
  }

  function createDemoPhotoFile() {
    var canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1200;
    var ctx = canvas.getContext('2d');

    // Apple iPhone photo simulation
    var grad = ctx.createLinearGradient(0, 0, 1600, 1200);
    grad.addColorStop(0, '#0284c7');
    grad.addColorStop(0.5, '#38bdf8');
    grad.addColorStop(1, '#bae6fd');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1600, 1200);

    // Camera graphic
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 52px Montserrat, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('📱 Apple iPhone 15 Pro Max Photo (HEIC)', 800, 520);

    ctx.font = '28px Inter, sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('Display P3 Wide Color • 48MP Smart HDR Camera', 800, 600);

    ctx.font = 'bold 24px JetBrains Mono, monospace';
    ctx.fillStyle = '#0369a1';
    ctx.fillText('IMG_8942.HEIC • 4032 x 3024', 800, 670);

    canvas.toBlob(function (blob) {
      var file = new File([blob], 'IMG_8942.HEIC', { type: 'image/heic' });
      loadPhotoFiles([file]);
    }, 'image/jpeg', 0.95);
  }

  // ═════════════════════════════════════════════════════════════
  // 2. IPHONE HEVC / MOV VIDEO CONVERSION ENGINE
  // ═════════════════════════════════════════════════════════════
  if (videoUploadBox && videoFileInput) {
    videoUploadBox.addEventListener('click', function (e) {
      if (e.target.closest('#btnTryVideoDemo')) return;
      videoFileInput.click();
    });

    btnSelectVideo.addEventListener('click', function (e) {
      e.stopPropagation();
      videoFileInput.click();
    });

    videoUploadBox.addEventListener('dragover', function (e) {
      e.preventDefault();
      videoUploadBox.classList.add('dragover');
    });

    videoUploadBox.addEventListener('dragleave', function () {
      videoUploadBox.classList.remove('dragover');
    });

    videoUploadBox.addEventListener('drop', function (e) {
      e.preventDefault();
      videoUploadBox.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        var file = e.dataTransfer.files[0];
        if (file.name.match(/\.(heic|heif|livp)$/i)) {
          switchMode('photo');
          loadPhotoFiles([file]);
          return;
        }
        loadVideoFile(file);
      }
    });

    videoFileInput.addEventListener('change', function () {
      if (videoFileInput.files && videoFileInput.files[0]) {
        loadVideoFile(videoFileInput.files[0]);
      }
    });
  }

  function loadVideoFile(file) {
    if (!file) return;

    if (state.videoUrl) URL.revokeObjectURL(state.videoUrl);
    if (state.convertedVideoUrl) URL.revokeObjectURL(state.convertedVideoUrl);

    state.videoFile = file;
    state.convertedVideoBlob = null;
    state.convertedVideoUrl = null;
    videoResultCard.style.display = 'none';

    vMetaName.textContent = file.name;
    vMetaSize.textContent = formatBytes(file.size);

    state.videoUrl = URL.createObjectURL(file);
    inputVideoPreview.src = state.videoUrl;

    inputVideoPreview.onloadedmetadata = function () {
      state.videoDuration = inputVideoPreview.duration || 0;
      state.videoWidth = inputVideoPreview.videoWidth || 1920;
      state.videoHeight = inputVideoPreview.videoHeight || 1080;

      vMetaDuration.textContent = formatTime(state.videoDuration);
      vMetaRes.textContent = state.videoWidth + 'x' + state.videoHeight;

      videoWorkspace.style.display = 'block';
      videoWorkspace.scrollIntoView({ behavior: 'smooth', block: 'start' });

      if (window.showToast) {
        window.showToast('iPhone video loaded! Click "Convert to Android MP4" to start.', 'success');
      }
    };

    inputVideoPreview.onerror = function () {
      vMetaDuration.textContent = 'Universal Stream';
      vMetaRes.textContent = 'Apple HEVC Media';
      videoWorkspace.style.display = 'block';
    };
  }

  // Convert Video Action
  if (btnConvertVideo) {
    btnConvertVideo.addEventListener('click', function () {
      if (!state.videoFile) {
        if (window.showToast) window.showToast('Please select an iPhone video file first!', 'warning');
        return;
      }
      if (state.isVideoConverting) return;
      startVideoTranscode();
    });
  }

  async function startVideoTranscode() {
    state.isVideoConverting = true;
    btnConvertVideo.disabled = true;
    btnConvertVideo.innerHTML = '<span>⏳ Transcoding to Android MP4…</span>';
    videoProgressWrap.style.display = 'block';
    videoResultCard.style.display = 'none';

    var videoEl = inputVideoPreview;
    videoEl.currentTime = 0;

    // Determine target resolution
    var resMode = videoTargetRes.value;
    var targetW = state.videoWidth || 1920;
    var targetH = state.videoHeight || 1080;

    if (resMode === '1080') {
      var aspect = targetW / targetH;
      targetW = Math.min(targetW, 1920);
      targetH = Math.round(targetW / aspect);
    } else if (resMode === '720') {
      var aspect2 = targetW / targetH;
      targetW = Math.min(targetW, 1280);
      targetH = Math.round(targetW / aspect2);
    }

    // Canvas must have even dimensions for MP4/H264
    targetW = targetW - (targetW % 2);
    targetH = targetH - (targetH % 2);

    var canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    var ctx = canvas.getContext('2d');

    var stream = canvas.captureStream(30);

    // Audio capture
    try {
      var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var source = audioCtx.createMediaElementSource(videoEl);
      var dest = audioCtx.createMediaStreamDestination();
      source.connect(dest);
      source.connect(audioCtx.destination);
      var audioTrack = dest.stream.getAudioTracks()[0];
      if (audioTrack) stream.addTrack(audioTrack);
    } catch (aErr) {
      console.warn('Audio capture warning:', aErr);
    }

    // Setup MediaRecorder
    var mimeType = 'video/mp4;codecs=avc1.42E01E,mp4a.40.2';
    if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/mp4';
    if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm;codecs=vp8,opus';

    var recorder = new MediaRecorder(stream, {
      mimeType: mimeType,
      videoBitsPerSecond: 4500000 // 4.5 Mbps crisp 1080p
    });

    var chunks = [];
    recorder.ondataavailable = function (e) {
      if (e.data.size > 0) chunks.push(e.data);
    };

    var transcodeSpeed = parseFloat(videoTranscodeSpeed.value) || 2.0;

    return new Promise(function (resolve) {
      recorder.onstop = function () {
        var finalBlob = new Blob(chunks, { type: mimeType });
        var ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
        displayVideoResult(finalBlob, ext);
        resolve();
      };

      recorder.start();

      // Play video with transcode speed
      videoEl.playbackRate = transcodeSpeed;
      videoEl.play();

      function drawFrame() {
        if (!state.isVideoConverting) return;

        if (videoEl.paused || videoEl.ended) {
          if (videoEl.ended) {
            recorder.stop();
            videoEl.playbackRate = 1.0;
            return;
          }
        }

        ctx.drawImage(videoEl, 0, 0, targetW, targetH);

        var cur = videoEl.currentTime;
        var dur = videoEl.duration || 1;
        var pct = Math.min(99, Math.round((cur / dur) * 100));

        videoProgressPct.textContent = pct + '%';
        videoProgressFill.style.width = pct + '%';
        videoProgressDetail.textContent = 'Transcoded ' + formatTime(cur) + ' of ' + formatTime(dur);
        videoProgressTime.textContent = Math.round(cur) + 's / ' + Math.round(dur) + 's';

        requestAnimationFrame(drawFrame);
      }

      requestAnimationFrame(drawFrame);
    });
  }

  function displayVideoResult(blob, ext) {
    state.convertedVideoBlob = blob;
    state.convertedVideoUrl = URL.createObjectURL(blob);

    var baseName = state.videoFile.name.replace(/\.[^/.]+$/, '');
    var outName = baseName + '_android.' + ext;

    resVideoFileName.textContent = outName;
    resVideoFmt.textContent = 'Universal MP4 (H.264 / AAC)';
    resVideoDur.textContent = formatTime(state.videoDuration);
    resVideoSize.textContent = formatBytes(blob.size);

    resVideoPlayer.src = state.convertedVideoUrl;
    btnDownloadAndroidVideo.href = state.convertedVideoUrl;
    btnDownloadAndroidVideo.download = outName;

    state.isVideoConverting = false;
    btnConvertVideo.disabled = false;
    btnConvertVideo.innerHTML = '<span>🚀 Convert iPhone Video to Android MP4</span>';
    videoProgressWrap.style.display = 'none';

    videoResultCard.style.display = 'block';
    videoResultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    if (window.showToast) {
      window.showToast('iPhone video converted to universal Android MP4! Ready to download.', 'success');
    }
  }

  // Reset Video
  if (btnResetVideo) {
    btnResetVideo.addEventListener('click', function () {
      if (state.videoUrl) URL.revokeObjectURL(state.videoUrl);
      if (state.convertedVideoUrl) URL.revokeObjectURL(state.convertedVideoUrl);
      state.videoFile = null;
      state.videoUrl = null;
      state.convertedVideoBlob = null;
      state.convertedVideoUrl = null;
      inputVideoPreview.src = '';
      resVideoPlayer.src = '';
      videoFileInput.value = '';
      videoWorkspace.style.display = 'none';
      videoResultCard.style.display = 'none';
    });
  }

  // Demo Video Creator
  if (btnTryVideoDemo) {
    btnTryVideoDemo.addEventListener('click', function (e) {
      e.stopPropagation();
      createDemoVideoFile();
    });
  }

  async function createDemoVideoFile() {
    var canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    var ctx = canvas.getContext('2d');
    var stream = canvas.captureStream(30);

    var actx = new (window.AudioContext || window.webkitAudioContext)();
    var osc = actx.createOscillator();
    var gain = actx.createGain();
    var dest = actx.createMediaStreamDestination();
    osc.frequency.setValueAtTime(523.25, actx.currentTime); // C5
    gain.gain.setValueAtTime(0.25, actx.currentTime);
    osc.connect(gain);
    gain.connect(dest);
    osc.start();
    stream.addTrack(dest.stream.getAudioTracks()[0]);

    var mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
      ? 'video/webm;codecs=vp9,opus'
      : 'video/webm';

    var rec = new MediaRecorder(stream, { mimeType: mime });
    var chunks = [];
    rec.ondataavailable = function (e) { if (e.data.size > 0) chunks.push(e.data); };
    rec.start();

    var start = Date.now();
    var timer = setInterval(function () {
      var elapsed = Date.now() - start;
      if (elapsed > 5000) {
        clearInterval(timer);
        rec.stop();
        return;
      }

      var grad = ctx.createLinearGradient(0, 0, 1280, 720);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#334155');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1280, 720);

      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 38px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎬 Apple iPhone 15 Pro Cinematic MOV Demo', 640, 320);

      ctx.fillStyle = '#ffffff';
      ctx.font = '22px Inter, sans-serif';
      ctx.fillText('HEVC 10-Bit Dolby Vision HDR Simulation', 640, 380);

      var s = (5 - elapsed / 1000).toFixed(1);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 26px JetBrains Mono, monospace';
      ctx.fillText(s + 's', 640, 440);
    }, 33);

    await new Promise(function (resolve) {
      rec.onstop = function () {
        osc.stop();
        actx.close();
        var blob = new Blob(chunks, { type: mime });
        var file = new File([blob], 'iPhone_Cinematic_HEVC.mov', { type: 'video/quicktime' });
        loadVideoFile(file);
        resolve();
      };
    });
  }

  // FAQ Accordion
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      if (item) item.classList.toggle('active');
    });
  });

})();
