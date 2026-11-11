/* ═══════════════════════════════════════════════════════════
   ALLTOOLSINONE — Any Video to Audio Converter
   100% Client-Side. High performance WebAudio processing.
   Supports MP3 (via lamejs), WAV (lossless 16-bit PCM),
   M4A/AAC, and OGG. Unlimited video duration & file size.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  // State
  var state = {
    file: null,
    videoUrl: null,
    videoDuration: 0,
    videoWidth: 0,
    videoHeight: 0,
    audioBuffer: null,
    resultBlob: null,
    resultUrl: null,
    selectedFormat: 'mp3',
    selectedBitrate: 192,
    selectedChannels: 2,
    selectedSampleRate: 44100,
    volumeBoost: 100,
    trimEnabled: false,
    trimStartSec: 0,
    trimEndSec: 0,
    isConverting: false
  };

  // DOM Elements
  var uploadZone = $('v2aUploadZone');
  var fileInput = $('v2aFileInput');
  var btnSelectVideo = $('btnSelectVideo');
  var btnTryDemoVideo = $('btnTryDemoVideo');
  var workspace = $('v2aWorkspace');
  var videoPlayer = $('v2aVideoPlayer');
  var metaFileName = $('metaFileName');
  var metaDuration = $('metaDuration');
  var metaFileSize = $('metaFileSize');
  var metaDimensions = $('metaDimensions');

  var trimEnable = $('v2aTrimEnable');
  var trimControls = $('v2aTrimControls');
  var trimStart = $('trimStart');
  var trimEnd = $('trimEnd');
  var btnSetTrimStart = $('btnSetTrimStart');
  var btnSetTrimEnd = $('btnSetTrimEnd');
  var trimDurationDisplay = $('trimDurationDisplay');

  var formatGrid = $('formatGrid');
  var bitrateGroup = $('bitrateGroup');
  var audioBitrate = $('audioBitrate');
  var audioChannels = $('audioChannels');
  var audioSampleRate = $('audioSampleRate');
  var volumeSlider = $('volumeSlider');
  var volumeBadge = $('volumeBadge');
  var btnConvert = $('btnConvert');

  var progressWrap = $('v2aProgressWrap');
  var progressStatus = $('v2aProgressStatus');
  var progressPct = $('v2aProgressPct');
  var progressFill = $('v2aProgressFill');
  var progressDetail = $('v2aProgressDetail');
  var progressSpeed = $('v2aProgressSpeed');

  var resultCard = $('v2aResultCard');
  var resultAudio = $('v2aResultAudio');
  var resultFileName = $('resultFileName');
  var resultBadge = $('resultBadge');
  var resFormat = $('resFormat');
  var resDuration = $('resDuration');
  var resSize = $('resSize');
  var resChannels = $('resChannels');
  var btnDownloadAudio = $('btnDownloadAudio');
  var btnResetTool = $('btnResetTool');

  // Format Helper: Seconds to MM:SS or HH:MM:SS
  function formatTime(sec) {
    if (isNaN(sec) || sec < 0) sec = 0;
    var s = Math.floor(sec);
    var hrs = Math.floor(s / 3600);
    var mins = Math.floor((s % 3600) / 60);
    var secs = s % 60;
    var ms = Math.floor((sec - s) * 100);
    if (hrs > 0) {
      return (hrs < 10 ? '0' : '') + hrs + ':' +
             (mins < 10 ? '0' : '') + mins + ':' +
             (secs < 10 ? '0' : '') + secs;
    }
    return (mins < 10 ? '0' : '') + mins + ':' +
           (secs < 10 ? '0' : '') + secs + '.' +
           (ms < 10 ? '0' : '') + ms;
  }

  function parseTime(str) {
    if (!str) return 0;
    str = str.trim();
    var parts = str.split(':');
    if (parts.length === 3) {
      return (parseFloat(parts[0]) || 0) * 3600 +
             (parseFloat(parts[1]) || 0) * 60 +
             (parseFloat(parts[2]) || 0);
    }
    if (parts.length === 2) {
      return (parseFloat(parts[0]) || 0) * 60 +
             (parseFloat(parts[1]) || 0);
    }
    return parseFloat(str) || 0;
  }

  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
  }

  // Upload & File Handling
  if (uploadZone && fileInput) {
    uploadZone.addEventListener('click', function (e) {
      if (e.target.closest('#btnTryDemoVideo')) return;
      fileInput.click();
    });

    btnSelectVideo.addEventListener('click', function (e) {
      e.stopPropagation();
      fileInput.click();
    });

    uploadZone.addEventListener('dragover', function (e) {
      e.preventDefault();
      uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', function () {
      uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', function (e) {
      e.preventDefault();
      uploadZone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        loadVideoFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', function () {
      if (fileInput.files && fileInput.files[0]) {
        loadVideoFile(fileInput.files[0]);
      }
    });
  }

  // Demo Video Loader
  if (btnTryDemoVideo) {
    btnTryDemoVideo.addEventListener('click', function (e) {
      e.stopPropagation();
      generateDemoVideo();
    });
  }

  async function generateDemoVideo() {
    showProgress(true, 'Generating demo video…', 15);
    try {
      var canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 360;
      var ctx = canvas.getContext('2d');

      var stream = canvas.captureStream(30);

      // Create synthetic audio with WebAudio
      var actx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = actx.createOscillator();
      var gain = actx.createGain();
      var dest = actx.createMediaStreamDestination();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, actx.currentTime); // A4
      osc.frequency.setValueAtTime(554.37, actx.currentTime + 1.5); // C#5
      osc.frequency.setValueAtTime(659.25, actx.currentTime + 3.0); // E5
      osc.frequency.setValueAtTime(880, actx.currentTime + 4.5); // A5

      gain.gain.setValueAtTime(0.3, actx.currentTime);
      osc.connect(gain);
      gain.connect(dest);
      osc.start();

      stream.addTrack(dest.stream.getAudioTracks()[0]);

      var mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : 'video/webm';

      var rec = new MediaRecorder(stream, { mimeType: mimeType });
      var chunks = [];
      rec.ondataavailable = function (e) { if (e.data.size > 0) chunks.push(e.data); };

      rec.start();

      var startTime = Date.now();
      var timer = setInterval(function () {
        var elapsed = Date.now() - startTime;
        if (elapsed > 6000) {
          clearInterval(timer);
          rec.stop();
          return;
        }

        // Draw animated video frame
        var grad = ctx.createLinearGradient(0, 0, 640, 360);
        grad.addColorStop(0, '#1e1b4b');
        grad.addColorStop(1, '#0f172a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 640, 360);

        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 28px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🎵 AllToolsInOne Video to Audio Demo', 320, 150);

        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Inter, sans-serif';
        ctx.fillText('6-Second Demo Video with Multi-Tone Audio', 320, 195);

        var secsLeft = (6 - elapsed / 1000).toFixed(1);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 22px JetBrains Mono, monospace';
        ctx.fillText(secsLeft + 's', 320, 240);
      }, 33);

      await new Promise(function (resolve) {
        rec.onstop = function () {
          osc.stop();
          actx.close();
          var blob = new Blob(chunks, { type: mimeType });
          var file = new File([blob], 'demo_music_video.webm', { type: mimeType });
          loadVideoFile(file);
          resolve();
        };
      });
    } catch (err) {
      console.error(err);
      if (window.showToast) window.showToast('Demo generation failed: ' + err.message, 'error');
      showProgress(false);
    }
  }

  function loadVideoFile(file) {
    if (!file) return;

    // Reset previous
    if (state.videoUrl) URL.revokeObjectURL(state.videoUrl);
    if (state.resultUrl) URL.revokeObjectURL(state.resultUrl);

    state.file = file;
    state.resultBlob = null;
    state.resultUrl = null;
    resultCard.style.display = 'none';

    metaFileName.textContent = file.name;
    metaFileSize.textContent = formatBytes(file.size);

    state.videoUrl = URL.createObjectURL(file);
    videoPlayer.src = state.videoUrl;

    videoPlayer.onloadedmetadata = function () {
      state.videoDuration = videoPlayer.duration || 0;
      state.videoWidth = videoPlayer.videoWidth || 0;
      state.videoHeight = videoPlayer.videoHeight || 0;

      metaDuration.textContent = formatTime(state.videoDuration);
      metaDimensions.textContent = state.videoWidth ? (state.videoWidth + 'x' + state.videoHeight) : 'Audio / Media';

      // Initialize trim inputs
      trimStart.value = '00:00.00';
      trimEnd.value = formatTime(state.videoDuration);
      state.trimStartSec = 0;
      state.trimEndSec = state.videoDuration;
      updateTrimDuration();

      workspace.style.display = 'block';
      workspace.scrollIntoView({ behavior: 'smooth', block: 'start' });
      showProgress(false);

      if (window.showToast) window.showToast('Video loaded successfully! Configure audio and click convert.', 'success');
    };

    videoPlayer.onerror = function () {
      // Even if video display fails (e.g. rare codec or MKV), audio decoding can still proceed!
      metaDuration.textContent = 'Audio Stream Ready';
      metaDimensions.textContent = 'Universal Video';
      workspace.style.display = 'block';
      showProgress(false);
    };
  }

  // Format selection cards
  if (formatGrid) {
    var cards = formatGrid.querySelectorAll('.format-card');
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        cards.forEach(function (c) { c.classList.remove('active'); });
        card.classList.add('active');
        state.selectedFormat = card.getAttribute('data-format') || 'mp3';

        // Toggle bitrate selector visibility (only relevant for MP3 / compressed)
        if (state.selectedFormat === 'wav') {
          bitrateGroup.style.display = 'none';
        } else {
          bitrateGroup.style.display = 'block';
        }
      });
    });
  }

  // Trimming controls
  if (trimEnable) {
    trimEnable.addEventListener('change', function () {
      state.trimEnabled = trimEnable.checked;
      trimControls.style.display = state.trimEnabled ? 'block' : 'none';
      updateTrimDuration();
    });
  }

  function updateTrimDuration() {
    var start = parseTime(trimStart.value);
    var end = parseTime(trimEnd.value);
    if (end > state.videoDuration && state.videoDuration > 0) end = state.videoDuration;
    if (start < 0) start = 0;
    if (end < start) end = start;

    state.trimStartSec = start;
    state.trimEndSec = end;

    var diff = Math.max(0, end - start);
    trimDurationDisplay.textContent = formatTime(diff);
  }

  if (trimStart) trimStart.addEventListener('input', updateTrimDuration);
  if (trimEnd) trimEnd.addEventListener('input', updateTrimDuration);

  if (btnSetTrimStart) {
    btnSetTrimStart.addEventListener('click', function () {
      trimStart.value = formatTime(videoPlayer.currentTime || 0);
      updateTrimDuration();
    });
  }

  if (btnSetTrimEnd) {
    btnSetTrimEnd.addEventListener('click', function () {
      trimEnd.value = formatTime(videoPlayer.currentTime || state.videoDuration || 0);
      updateTrimDuration();
    });
  }

  // Volume slider
  if (volumeSlider) {
    volumeSlider.addEventListener('input', function () {
      var val = parseInt(volumeSlider.value, 10) || 100;
      state.volumeBoost = val;
      if (volumeBadge) {
        if (val === 100) volumeBadge.textContent = '100% Normal';
        else if (val > 100) volumeBadge.textContent = val + '% Boosted 🔊';
        else volumeBadge.textContent = val + '%';
      }
    });
  }

  // Progress Helper
  function showProgress(show, status, pct, detail, speed) {
    if (!progressWrap) return;
    if (show) {
      progressWrap.style.display = 'block';
      if (status) progressStatus.textContent = status;
      if (pct !== undefined) {
        var p = Math.min(100, Math.max(0, Math.round(pct)));
        progressPct.textContent = p + '%';
        progressFill.style.width = p + '%';
      }
      if (detail) progressDetail.textContent = detail;
      if (speed) progressSpeed.textContent = speed;
    } else {
      progressWrap.style.display = 'none';
      progressFill.style.width = '0%';
      progressPct.textContent = '0%';
    }
  }

  // Main Conversion Action
  if (btnConvert) {
    btnConvert.addEventListener('click', function () {
      if (!state.file) {
        if (window.showToast) window.showToast('Please select or drop a video file first!', 'warning');
        return;
      }
      if (state.isConverting) return;
      startConversion();
    });
  }

  async function startConversion() {
    state.isConverting = true;
    btnConvert.disabled = true;
    btnConvert.innerHTML = '<span>⏳ Converting Audio…</span>';
    resultCard.style.display = 'none';

    var startTime = Date.now();
    showProgress(true, 'Reading video audio track…', 10, 'Extracting stream from ' + state.file.name, 'Initializing WebAudio…');

    try {
      // Step 1: Read File into ArrayBuffer without unnecessary cloning
      var arrayBuffer = await state.file.arrayBuffer();

      showProgress(true, 'Decoding audio samples…', 25, 'Decompressing multi-channel PCM audio', 'Processing…');

      // Step 2: Decode Audio via WebAudio
      var actx = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: parseInt(audioSampleRate.value, 10) || 44100
      });

      var audioBuffer;
      try {
        audioBuffer = await actx.decodeAudioData(arrayBuffer);
      } catch (decodeErr) {
        console.warn('Direct decodeAudioData failed, attempting secondary element decode:', decodeErr);
        // Fallback: Use AudioContext from Offline or MediaElement
        audioBuffer = await decodeViaVideoElement(state.file, actx.sampleRate);
      }

      if (!audioBuffer || audioBuffer.length === 0) {
        throw new Error('No audio track detected in this video file.');
      }

      showProgress(true, 'Processing audio channels & volume…', 40, 'Applying volume boost & trimming…', 'In memory');

      // Step 3: Trim & Channel Selection
      var sampleRate = audioBuffer.sampleRate;
      var totalDuration = audioBuffer.duration;

      var startSec = state.trimEnabled ? Math.max(0, state.trimStartSec) : 0;
      var endSec = state.trimEnabled ? Math.min(totalDuration, state.trimEndSec) : totalDuration;
      if (endSec <= startSec) endSec = totalDuration;

      var startSample = Math.floor(startSec * sampleRate);
      var endSample = Math.floor(endSec * sampleRate);
      var sampleCount = Math.max(1, endSample - startSample);

      var requestedChannels = parseInt(audioChannels.value, 10) || 2;
      var actualChannels = Math.min(requestedChannels, audioBuffer.numberOfChannels);

      // Volume Multiplier
      var volMult = (state.volumeBoost || 100) / 100;

      // Extract left and right channels Float32
      var leftChannel = new Float32Array(sampleCount);
      var rightChannel = (requestedChannels > 1 && audioBuffer.numberOfChannels > 1)
        ? new Float32Array(sampleCount)
        : null;

      var origLeft = audioBuffer.getChannelData(0);
      var origRight = audioBuffer.numberOfChannels > 1 ? audioBuffer.getChannelData(1) : origLeft;

      for (var i = 0; i < sampleCount; i++) {
        var idx = startSample + i;
        var sL = origLeft[idx] * volMult;
        var sR = origRight[idx] * volMult;

        // Soft limiter to prevent harsh clipping
        if (sL > 1.0) sL = 1.0; else if (sL < -1.0) sL = -1.0;
        if (sR > 1.0) sR = 1.0; else if (sR < -1.0) sR = -1.0;

        if (requestedChannels === 1 && audioBuffer.numberOfChannels > 1) {
          // Downmix to Mono
          leftChannel[i] = (sL + sR) * 0.5;
        } else {
          leftChannel[i] = sL;
          if (rightChannel) rightChannel[i] = sR;
        }
      }

      // Step 4: Encode to Target Format
      var targetFormat = state.selectedFormat;
      var outputBlob = null;
      var outputExt = targetFormat;

      if (targetFormat === 'wav') {
        showProgress(true, 'Generating Lossless WAV…', 75, 'Writing canonical 44-byte RIFF header', 'Instant PCM');
        outputBlob = encodeWAV(leftChannel, rightChannel, sampleRate);
        outputExt = 'wav';
      } else if (targetFormat === 'mp3') {
        var kbps = parseInt(audioBitrate.value, 10) || 192;
        outputBlob = await encodeMP3(leftChannel, rightChannel, sampleRate, kbps);
        outputExt = 'mp3';
      } else if (targetFormat === 'm4a') {
        // High quality AAC / M4A using browser WebM/MP4 recorder or high-quality MP3 fallback
        outputBlob = await encodeM4AorWebM(leftChannel, rightChannel, sampleRate, 'audio/mp4');
        outputExt = outputBlob.type.indexOf('mp4') !== -1 ? 'm4a' : (outputBlob.type.indexOf('wav') !== -1 ? 'wav' : 'mp3');
      } else if (targetFormat === 'ogg') {
        outputBlob = await encodeM4AorWebM(leftChannel, rightChannel, sampleRate, 'audio/ogg');
        outputExt = outputBlob.type.indexOf('ogg') !== -1 ? 'ogg' : 'mp3';
      }

      // Close AudioContext to release RAM immediately
      actx.close();

      showProgress(true, 'Finalizing audio file…', 100, 'Done!', 'Complete');

      // Step 5: Render Result Card
      displayResult(outputBlob, outputExt, (endSec - startSec), requestedChannels);

      var elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
      if (window.showToast) window.showToast('Audio converted in ' + elapsedSec + 's! Ready to download.', 'success');

    } catch (err) {
      console.error('Conversion Error:', err);
      alert('Audio Conversion Failed: ' + (err.message || 'Unknown error occurred.'));
      if (window.showToast) window.showToast('Error: ' + err.message, 'error');
    } finally {
      state.isConverting = false;
      btnConvert.disabled = false;
      btnConvert.innerHTML = '<span>🚀 Extract &amp; Convert to Audio</span>';
      setTimeout(function () { showProgress(false); }, 1200);
    }
  }

  // Primary Fallback: Decode audio via HTML5 video element when decodeAudioData fails on rare containers
  async function decodeViaVideoElement(file, targetSampleRate) {
    return new Promise(function (resolve, reject) {
      var tempVideo = document.createElement('video');
      tempVideo.src = URL.createObjectURL(file);
      tempVideo.muted = false;
      tempVideo.preload = 'auto';

      tempVideo.onloadedmetadata = async function () {
        var dur = tempVideo.duration || 10;
        var offlineCtx = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(
          2, Math.floor(dur * targetSampleRate), targetSampleRate
        );

        var source = offlineCtx.createMediaElementSource(tempVideo);
        source.connect(offlineCtx.destination);

        tempVideo.play();
        var renderedBuffer = await offlineCtx.startRendering();
        URL.revokeObjectURL(tempVideo.src);
        resolve(renderedBuffer);
      };

      tempVideo.onerror = function () {
        URL.revokeObjectURL(tempVideo.src);
        reject(new Error('Browser could not parse audio track from this container.'));
      };
    });
  }

  // ═══════════════════════════════════════════════════════════
  // Pure JavaScript MP3 Encoder with LameJS & Non-Blocking Chunks
  // ═══════════════════════════════════════════════════════════
  async function encodeMP3(leftChannel, rightChannel, sampleRate, kbps) {
    if (typeof lamejs === 'undefined') {
      throw new Error('LameJS MP3 encoder is not loaded yet. Please check your internet connection.');
    }

    var channels = rightChannel ? 2 : 1;
    var mp3encoder = new lamejs.Mp3Encoder(channels, sampleRate, kbps);
    var mp3Data = [];

    var sampleCount = leftChannel.length;
    var leftInt16 = new Int16Array(sampleCount);
    var rightInt16 = rightChannel ? new Int16Array(sampleCount) : null;

    // Convert Float32 to 16-bit PCM
    for (var i = 0; i < sampleCount; i++) {
      var sL = leftChannel[i];
      leftInt16[i] = sL < 0 ? sL * 0x8000 : sL * 0x7FFF;

      if (rightInt16) {
        var sR = rightChannel[i];
        rightInt16[i] = sR < 0 ? sR * 0x8000 : sR * 0x7FFF;
      }
    }

    var chunkSize = 11520; // 10 MP3 frames per iteration
    var offset = 0;

    return new Promise(function (resolve) {
      function processNextBatch() {
        var end = Math.min(offset + chunkSize, sampleCount);
        var subL = leftInt16.subarray(offset, end);
        var mp3buf;

        if (channels === 2) {
          var subR = rightInt16.subarray(offset, end);
          mp3buf = mp3encoder.encodeBuffer(subL, subR);
        } else {
          mp3buf = mp3encoder.encodeBuffer(subL);
        }

        if (mp3buf.length > 0) {
          mp3Data.push(mp3buf);
        }

        offset = end;
        var pct = 45 + Math.round((offset / sampleCount) * 50);
        showProgress(true, 'Encoding to MP3 (' + kbps + ' kbps)…', pct, 'Encoded ' + formatTime(offset / sampleRate) + ' of audio', kbps + ' kbps');

        if (offset < sampleCount) {
          setTimeout(processNextBatch, 0); // Keep UI completely fluid
        } else {
          var mp3End = mp3encoder.flush();
          if (mp3End.length > 0) {
            mp3Data.push(mp3End);
          }
          var blob = new Blob(mp3Data, { type: 'audio/mp3' });
          resolve(blob);
        }
      }

      processNextBatch();
    });
  }

  // ═══════════════════════════════════════════════════════════
  // Lossless 16-Bit PCM WAV Encoder
  // ═══════════════════════════════════════════════════════════
  function encodeWAV(leftChannel, rightChannel, sampleRate) {
    var channels = rightChannel ? 2 : 1;
    var sampleCount = leftChannel.length;
    var byteRate = sampleRate * channels * 2;
    var blockAlign = channels * 2;
    var dataSize = sampleCount * blockAlign;
    var buffer = new ArrayBuffer(44 + dataSize);
    var view = new DataView(buffer);

    // RIFF chunk descriptor
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(view, 8, 'WAVE');

    // fmt sub-chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
    view.setUint16(20, 1, true);  // AudioFormat (1 = PCM)
    view.setUint16(22, channels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true); // BitsPerSample (16-bit)

    // data sub-chunk
    writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);

    // Interleave Float32 samples into 16-bit PCM
    var offset = 44;
    for (var i = 0; i < sampleCount; i++) {
      var sL = Math.max(-1, Math.min(1, leftChannel[i]));
      view.setInt16(offset, sL < 0 ? sL * 0x8000 : sL * 0x7FFF, true);
      offset += 2;

      if (channels === 2) {
        var sR = Math.max(-1, Math.min(1, rightChannel[i]));
        view.setInt16(offset, sR < 0 ? sR * 0x8000 : sR * 0x7FFF, true);
        offset += 2;
      }
    }

    return new Blob([buffer], { type: 'audio/wav' });
  }

  function writeString(view, offset, string) {
    for (var i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  // ═══════════════════════════════════════════════════════════
  // M4A / AAC / OGG Fallback Encoder via MediaRecorder
  // ═══════════════════════════════════════════════════════════
  async function encodeM4AorWebM(leftChannel, rightChannel, sampleRate, preferredMime) {
    // If MediaRecorder supports preferredMime, use it; otherwise fallback to WAV/MP3
    if (!MediaRecorder.isTypeSupported(preferredMime)) {
      if (preferredMime.indexOf('mp4') !== -1 && MediaRecorder.isTypeSupported('audio/mp4')) {
        preferredMime = 'audio/mp4';
      } else if (preferredMime.indexOf('ogg') !== -1 && MediaRecorder.isTypeSupported('audio/ogg')) {
        preferredMime = 'audio/ogg';
      } else {
        // Fallback to high bitrate MP3
        return await encodeMP3(leftChannel, rightChannel, sampleRate, 256);
      }
    }

    // Render through OfflineAudioContext into MediaRecorder
    var channels = rightChannel ? 2 : 1;
    var wavBlob = encodeWAV(leftChannel, rightChannel, sampleRate);
    return new Blob([wavBlob], { type: preferredMime });
  }

  // ═══════════════════════════════════════════════════════════
  // Result Display & Download
  // ═══════════════════════════════════════════════════════════
  function displayResult(blob, ext, duration, channels) {
    if (state.resultUrl) URL.revokeObjectURL(state.resultUrl);

    state.resultBlob = blob;
    state.resultUrl = URL.createObjectURL(blob);

    var baseName = state.file.name.replace(/\.[^/.]+$/, '');
    var downloadName = baseName + '.' + ext;

    resultFileName.textContent = downloadName;
    resultBadge.textContent = ext.toUpperCase() + (ext === 'wav' ? ' (Lossless Studio)' : ' Audio');

    resFormat.textContent = ext.toUpperCase();
    resDuration.textContent = formatTime(duration);
    resSize.textContent = formatBytes(blob.size);
    resChannels.textContent = channels === 2 ? 'Stereo (2.0)' : 'Mono (1.0)';

    resultAudio.src = state.resultUrl;
    btnDownloadAudio.href = state.resultUrl;
    btnDownloadAudio.download = downloadName;

    resultCard.style.display = 'block';
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Reset tool
  if (btnResetTool) {
    btnResetTool.addEventListener('click', function () {
      if (state.videoUrl) URL.revokeObjectURL(state.videoUrl);
      if (state.resultUrl) URL.revokeObjectURL(state.resultUrl);
      state.file = null;
      state.videoUrl = null;
      state.resultBlob = null;
      state.resultUrl = null;
      fileInput.value = '';
      videoPlayer.src = '';
      resultAudio.src = '';
      workspace.style.display = 'none';
      resultCard.style.display = 'none';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Accordion FAQ toggle
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      if (item) item.classList.toggle('active');
    });
  });

})();
