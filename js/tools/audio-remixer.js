/* ═══════════════════════════════════════════════════════════
   AllToolsInOne — Shorts & Reels Audio Anti-Claim Remixer
   100% Client-Side WebAudio Processing. Zero Server Upload.
   Transforms Background Music via Pitch, Tempo, EQ & Reverb
   for YouTube Shorts, Instagram Reels, and TikTok Creators.
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  // State
  var state = {
    file: null,
    audioBuffer: null,
    previewCtx: null,
    previewSource: null,
    previewGain: null,
    isPlaying: false,
    previewStartTime: 0,
    previewPauseOffset: 0,
    activePreset: 'shorts_shield',
    speed: 1.05,
    pitch: 1.2,
    bass: 3,
    treble: 2,
    reverb: 12,
    stereoWidth: 40,
    noiseFloor: true,
    outputFormat: 'mp3',
    outputBitrate: 320,
    outputBlob: null,
    outputUrl: null,
    isProcessing: false
  };

  // Preset Configurations
  var PRESETS = {
    shorts_shield: {
      name: 'Shorts Anti-Claim Shield',
      speed: 1.05,
      pitch: 1.2,
      bass: 3,
      treble: 2,
      reverb: 12,
      stereoWidth: 40,
      noiseFloor: true,
      desc: 'Subtle frequency & tempo shift (+5% speed, +1.2 semitones, light room reverb). Sounds natural to viewers while disrupting Content ID hashes.'
    },
    nightcore: {
      name: 'Nightcore Energy',
      speed: 1.18,
      pitch: 3.0,
      bass: 2,
      treble: 5,
      reverb: 18,
      stereoWidth: 60,
      noiseFloor: false,
      desc: 'High-energy upbeat mod (+18% speed, +3 semitones, crisp highs). Popular for gaming clips and dance trends.'
    },
    slowed_reverb: {
      name: 'Slowed + Reverb (Lo-Fi)',
      speed: 0.86,
      pitch: -2.5,
      bass: 6,
      treble: -2,
      reverb: 38,
      stereoWidth: 70,
      noiseFloor: true,
      desc: 'Dreamy aesthetic mood (86% speed, deep bass, cathedral reverb, subtle tape texture). Viral for emotional shorts.'
    },
    eight_d: {
      name: '8D Binaural Space',
      speed: 1.02,
      pitch: 0.5,
      bass: 4,
      treble: 3,
      reverb: 26,
      stereoWidth: 90,
      noiseFloor: false,
      desc: 'Expansive wide-stereo Haas modulation with spatial hall reverb. Creates an immersive headphone experience.'
    },
    custom: {
      name: 'Custom Studio Mod',
      desc: 'Fine-tune every acoustic parameter manually using the sliders below.'
    }
  };

  // DOM Elements
  var uploadZone = $('remixerUploadZone');
  var fileInput = $('remixerFileInput');
  var btnSelectFile = $('btnSelectFile');
  var btnTryDemo = $('btnTryDemo');
  var workspace = $('remixerWorkspace');

  // Metadata Display
  var metaFileName = $('metaFileName');
  var metaDuration = $('metaDuration');
  var metaFileSize = $('metaFileSize');
  var metaSampleRate = $('metaSampleRate');

  // Preview Controls
  var btnPlayPreview = $('btnPlayPreview');
  var previewTimeDisplay = $('previewTimeDisplay');
  var previewProgress = $('previewProgress');
  var previewWaveform = $('previewWaveform');

  // Sliders & Value Badges
  var sliderSpeed = $('sliderSpeed');
  var badgeSpeed = $('badgeSpeed');
  var sliderPitch = $('sliderPitch');
  var badgePitch = $('badgePitch');
  var sliderBass = $('sliderBass');
  var badgeBass = $('badgeBass');
  var sliderTreble = $('sliderTreble');
  var badgeTreble = $('badgeTreble');
  var sliderReverb = $('sliderReverb');
  var badgeReverb = $('badgeReverb');
  var sliderStereo = $('sliderStereo');
  var badgeStereo = $('badgeStereo');
  var checkNoise = $('checkNoise');

  // Format & Export
  var selectFormat = $('selectFormat');
  var selectBitrate = $('selectBitrate');
  var bitrateGroup = $('bitrateGroup');
  var btnRender = $('btnRender');
  var progressWrap = $('progressWrap');
  var progressBar = $('progressBar');
  var progressPercent = $('progressPercent');
  var progressTitle = $('progressTitle');
  var progressSubtitle = $('progressSubtitle');

  // Result Card
  var resultCard = $('resultCard');
  var resultPlayer = $('resultPlayer');
  var resultMeta = $('resultMeta');
  var btnDownload = $('btnDownload');

  // Initialize
  initEventListeners();

  function initEventListeners() {
    if (uploadZone && fileInput) {
      uploadZone.addEventListener('click', function () { fileInput.click(); });
      uploadZone.addEventListener('dragover', function (e) { e.preventDefault(); uploadZone.classList.add('dragover'); });
      uploadZone.addEventListener('dragleave', function () { uploadZone.classList.remove('dragover'); });
      uploadZone.addEventListener('drop', function (e) {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) handleIncomingFile(e.dataTransfer.files[0]);
      });
      fileInput.addEventListener('change', function (e) {
        if (e.target.files && e.target.files[0]) handleIncomingFile(e.target.files[0]);
      });
    }

    if (btnSelectFile) {
      btnSelectFile.addEventListener('click', function (e) {
        e.stopPropagation();
        fileInput.click();
      });
    }

    if (btnTryDemo) {
      btnTryDemo.addEventListener('click', function (e) {
        e.stopPropagation();
        loadDemoTrack();
      });
    }

    // Preset Buttons
    var presetCards = document.querySelectorAll('.remixer-preset-btn');
    presetCards.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var presetKey = btn.getAttribute('data-preset');
        applyPreset(presetKey);
      });
    });

    // Slider Changes
    if (sliderSpeed) sliderSpeed.addEventListener('input', onSliderChange);
    if (sliderPitch) sliderPitch.addEventListener('input', onSliderChange);
    if (sliderBass) sliderBass.addEventListener('input', onSliderChange);
    if (sliderTreble) sliderTreble.addEventListener('input', onSliderChange);
    if (sliderReverb) sliderReverb.addEventListener('input', onSliderChange);
    if (sliderStereo) sliderStereo.addEventListener('input', onSliderChange);
    if (checkNoise) checkNoise.addEventListener('change', onSliderChange);

    // Format selector
    if (selectFormat) {
      selectFormat.addEventListener('change', function () {
        state.outputFormat = selectFormat.value;
        if (bitrateGroup) {
          bitrateGroup.style.display = state.outputFormat === 'wav' ? 'none' : 'block';
        }
      });
    }

    // Preview play/pause
    if (btnPlayPreview) {
      btnPlayPreview.addEventListener('click', togglePreviewPlayback);
    }

    // Render Button
    if (btnRender) {
      btnRender.addEventListener('click', renderExportAudio);
    }
  }

  function applyPreset(key) {
    if (!PRESETS[key]) return;
    state.activePreset = key;

    document.querySelectorAll('.remixer-preset-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-preset') === key);
    });

    if (key !== 'custom') {
      var p = PRESETS[key];
      state.speed = p.speed;
      state.pitch = p.pitch;
      state.bass = p.bass;
      state.treble = p.treble;
      state.reverb = p.reverb;
      state.stereoWidth = p.stereoWidth;
      state.noiseFloor = p.noiseFloor;

      sliderSpeed.value = p.speed;
      sliderPitch.value = p.pitch;
      sliderBass.value = p.bass;
      sliderTreble.value = p.treble;
      sliderReverb.value = p.reverb;
      sliderStereo.value = p.stereoWidth;
      checkNoise.checked = p.noiseFloor;

      updateBadgeDisplays();
    }

    // If currently previewing, restart with new parameters
    if (state.isPlaying) {
      restartPreview();
    }
  }

  function onSliderChange() {
    state.activePreset = 'custom';
    document.querySelectorAll('.remixer-preset-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-preset') === 'custom');
    });

    state.speed = parseFloat(sliderSpeed.value);
    state.pitch = parseFloat(sliderPitch.value);
    state.bass = parseFloat(sliderBass.value);
    state.treble = parseFloat(sliderTreble.value);
    state.reverb = parseFloat(sliderReverb.value);
    state.stereoWidth = parseFloat(sliderStereo.value);
    state.noiseFloor = checkNoise.checked;

    updateBadgeDisplays();

    if (state.isPlaying) {
      restartPreview();
    }
  }

  function updateBadgeDisplays() {
    if (badgeSpeed) {
      var pct = Math.round((state.speed - 1) * 100);
      badgeSpeed.textContent = state.speed.toFixed(2) + 'x (' + (pct >= 0 ? '+' : '') + pct + '%)';
    }
    if (badgePitch) {
      var sem = state.pitch;
      badgePitch.textContent = (sem >= 0 ? '+' : '') + sem.toFixed(1) + ' st';
    }
    if (badgeBass) {
      badgeBass.textContent = (state.bass >= 0 ? '+' : '') + state.bass + ' dB';
    }
    if (badgeTreble) {
      badgeTreble.textContent = (state.treble >= 0 ? '+' : '') + state.treble + ' dB';
    }
    if (badgeReverb) {
      badgeReverb.textContent = state.reverb + '%';
    }
    if (badgeStereo) {
      badgeStereo.textContent = state.stereoWidth + '%';
    }
  }

  // --- FILE HANDLING & DECODING ---
  function handleIncomingFile(file) {
    state.file = file;
    state.outputBlob = null;
    if (resultCard) resultCard.style.display = 'none';

    stopPreview();

    // Show metadata
    if (metaFileName) metaFileName.textContent = file.name;
    if (metaFileSize) metaFileSize.textContent = formatBytes(file.size);
    if (metaDuration) metaDuration.textContent = 'Decoding…';
    if (metaSampleRate) metaSampleRate.textContent = 'Analyzing…';
    if (workspace) workspace.style.display = 'block';

    showProgress(true, 'Decoding Audio with WebAudio Engine…', 25, 'Reading binary stream into memory', '100% Client-Side');

    var reader = new FileReader();
    reader.onload = async function (e) {
      try {
        var actx = new (window.AudioContext || window.webkitAudioContext)();
        var arrayBuffer = e.target.result;
        var decodedBuffer = await actx.decodeAudioData(arrayBuffer);
        actx.close();

        state.audioBuffer = decodedBuffer;

        if (metaDuration) metaDuration.textContent = formatTime(decodedBuffer.duration);
        if (metaSampleRate) metaSampleRate.textContent = decodedBuffer.sampleRate + ' Hz (' + decodedBuffer.numberOfChannels + ' Ch)';

        drawWaveform(decodedBuffer);
        showProgress(false);

        // Apply default preset
        applyPreset(state.activePreset);

        if (window.showToast) window.showToast('Audio decoded successfully! Ready to remix.', 'success');
      } catch (err) {
        console.error('Decode Error:', err);
        showProgress(false);
        alert('Could not decode audio. Please ensure the file is a valid MP3, WAV, M4A, or MP4 video.');
      }
    };
    reader.readAsArrayBuffer(file);
  }

  // Generate synthetic high-quality demo track
  function loadDemoTrack() {
    showProgress(true, 'Generating Studio Beats Demo Track…', 40, 'Synthesizing melodic chords & drum sequence', 'Live Synthesis');

    var sampleRate = 44100;
    var duration = 12; // 12 seconds loop
    var actx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: sampleRate });
    var buffer = actx.createBuffer(2, sampleRate * duration, sampleRate);
    var left = buffer.getChannelData(0);
    var right = buffer.getChannelData(1);

    // Chords progression (Am - F - C - G)
    var chordFreqs = [
      [220, 261.63, 329.63], // A minor
      [174.61, 220, 261.63], // F major
      [130.81, 164.81, 196.00], // C major
      [196.00, 246.94, 293.66]  // G major
    ];

    for (let i = 0; i < buffer.length; i++) {
      var t = i / sampleRate;
      var chordIndex = Math.floor((t % 8) / 2);
      var chord = chordFreqs[chordIndex];

      var sample = 0;
      for (var k = 0; k < chord.length; k++) {
        sample += 0.15 * Math.sin(2 * Math.PI * chord[k] * t);
        sample += 0.08 * Math.sin(4 * Math.PI * chord[k] * t); // Harmonics
      }

      // Add kick & snare pulse
      var beatTime = t % 0.5;
      if (beatTime < 0.1) {
        sample += 0.3 * Math.sin(2 * Math.PI * (120 - beatTime * 600) * beatTime);
      }

      left[i] = sample;
      right[i] = sample * 0.95;
    }
    actx.close();

    state.file = { name: 'demo_creator_beat.wav', size: buffer.length * 4 };
    state.audioBuffer = buffer;

    if (metaFileName) metaFileName.textContent = 'demo_creator_beat.wav (Synthetic Creator Beat)';
    if (metaFileSize) metaFileSize.textContent = '2.1 MB';
    if (metaDuration) metaDuration.textContent = formatTime(duration);
    if (metaSampleRate) metaSampleRate.textContent = '44100 Hz (Stereo)';
    if (workspace) workspace.style.display = 'block';

    drawWaveform(buffer);
    showProgress(false);
    applyPreset('shorts_shield');

    if (window.showToast) window.showToast('Demo track loaded! Press Preview to hear the anti-claim mod.', 'info');
  }

  // --- WAVEFORM DRAWING ---
  function drawWaveform(buffer) {
    if (!previewWaveform) return;
    var canvas = previewWaveform;
    var ctx = canvas.getContext('2d');
    var w = canvas.width = canvas.offsetWidth * 2;
    var h = canvas.height = canvas.offsetHeight * 2;

    ctx.clearRect(0, 0, w, h);

    var data = buffer.getChannelData(0);
    var step = Math.ceil(data.length / w);
    var amp = h / 2;

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    // Wave bars
    ctx.fillStyle = '#ff9933';
    for (var i = 0; i < w; i++) {
      var min = 1.0;
      var max = -1.0;
      for (var j = 0; j < step; j++) {
        var datum = data[(i * step) + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      var barH = Math.max(2, (max - min) * amp * 0.9);
      ctx.fillRect(i, (h - barH) / 2, 1.5, barH);
    }
  }

  // --- REAL-TIME AUDIO PREVIEW GRAPH ---
  function togglePreviewPlayback() {
    if (!state.audioBuffer) return;
    if (state.isPlaying) {
      stopPreview();
    } else {
      startPreview();
    }
  }

  function startPreview() {
    if (!state.audioBuffer) return;
    stopPreview();

    state.previewCtx = new (window.AudioContext || window.webkitAudioContext)();
    var ctx = state.previewCtx;

    var source = ctx.createBufferSource();
    source.buffer = state.audioBuffer;

    // Calculate effective playback rate from speed and pitch
    var semitoneRatio = Math.pow(2, state.pitch / 12);
    source.playbackRate.value = state.speed * semitoneRatio;

    // EQ Nodes
    var bassFilter = ctx.createBiquadFilter();
    bassFilter.type = 'lowshelf';
    bassFilter.frequency.value = 150;
    bassFilter.gain.value = state.bass;

    var trebleFilter = ctx.createBiquadFilter();
    trebleFilter.type = 'highshelf';
    trebleFilter.frequency.value = 7500;
    trebleFilter.gain.value = state.treble;

    var highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 45;

    // Master Gain
    var masterGain = ctx.createGain();
    masterGain.gain.value = 0.9;

    // Connect Primary Chain
    source.connect(highpass);
    highpass.connect(bassFilter);
    bassFilter.connect(trebleFilter);
    trebleFilter.connect(masterGain);

    // Reverb Blend (Convolver with synthetic impulse)
    if (state.reverb > 0) {
      var convolver = ctx.createConvolver();
      convolver.buffer = createReverbImpulse(ctx, 1.8, 2.5);
      var reverbGain = ctx.createGain();
      reverbGain.gain.value = (state.reverb / 100) * 0.7;

      trebleFilter.connect(convolver);
      convolver.connect(reverbGain);
      reverbGain.connect(masterGain);
    }

    // Connect to Speakers
    masterGain.connect(ctx.destination);

    source.start(0, state.previewPauseOffset);
    state.previewStartTime = ctx.currentTime - state.previewPauseOffset;
    state.previewSource = source;
    state.isPlaying = true;

    btnPlayPreview.innerHTML = '<span>⏸️ Pause Preview</span>';
    btnPlayPreview.classList.add('btn-active');

    source.onended = function () {
      if (state.isPlaying) {
        stopPreview();
        state.previewPauseOffset = 0;
      }
    };
  }

  function stopPreview() {
    if (state.previewSource) {
      try { state.previewSource.stop(); } catch (e) {}
      state.previewSource.disconnect();
      state.previewSource = null;
    }
    if (state.previewCtx) {
      try { state.previewCtx.close(); } catch (e) {}
      state.previewCtx = null;
    }
    state.isPlaying = false;
    if (btnPlayPreview) {
      btnPlayPreview.innerHTML = '<span>▶️ Play Remixed Preview</span>';
      btnPlayPreview.classList.remove('btn-active');
    }
  }

  function restartPreview() {
    stopPreview();
    startPreview();
  }

  // Algorithmic Reverb Impulse Buffer
  function createReverbImpulse(actx, durationSec, decay) {
    var rate = actx.sampleRate;
    var length = Math.floor(rate * durationSec);
    var impulse = actx.createBuffer(2, length, rate);
    var left = impulse.getChannelData(0);
    var right = impulse.getChannelData(1);

    for (var i = 0; i < length; i++) {
      var t = i / length;
      var envelope = Math.pow(1 - t, decay);
      left[i] = (Math.random() * 2 - 1) * envelope;
      right[i] = (Math.random() * 2 - 1) * envelope;
    }
    return impulse;
  }

  // --- FULL AUDIO EXPORT & RENDERING ---
  async function renderExportAudio() {
    if (!state.audioBuffer || state.isProcessing) return;
    state.isProcessing = true;
    btnRender.disabled = true;
    btnRender.innerHTML = '<span>⏳ Processing Audio…</span>';

    stopPreview();

    try {
      showProgress(true, 'Rendering Acoustic Transformation…', 10, 'Initializing high-speed OfflineAudioContext', 'Stage 1/3');

      var inputBuffer = state.audioBuffer;
      var sampleRate = inputBuffer.sampleRate;

      var semitoneRatio = Math.pow(2, state.pitch / 12);
      var effectiveRate = state.speed * semitoneRatio;

      var outputDuration = inputBuffer.duration / effectiveRate;
      var outputFrames = Math.ceil(outputDuration * sampleRate);

      var offlineCtx = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(
        2, outputFrames, sampleRate
      );

      var source = offlineCtx.createBufferSource();
      source.buffer = inputBuffer;
      source.playbackRate.value = effectiveRate;

      // Processing graph
      var bassFilter = offlineCtx.createBiquadFilter();
      bassFilter.type = 'lowshelf';
      bassFilter.frequency.value = 150;
      bassFilter.gain.value = state.bass;

      var trebleFilter = offlineCtx.createBiquadFilter();
      trebleFilter.type = 'highshelf';
      trebleFilter.frequency.value = 7500;
      trebleFilter.gain.value = state.treble;

      var highpass = offlineCtx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 45;

      var masterGain = offlineCtx.createGain();
      masterGain.gain.value = 0.95;

      source.connect(highpass);
      highpass.connect(bassFilter);
      bassFilter.connect(trebleFilter);
      trebleFilter.connect(masterGain);

      // Reverb in offline render
      if (state.reverb > 0) {
        var convolver = offlineCtx.createConvolver();
        convolver.buffer = createReverbImpulse(offlineCtx, 1.8, 2.5);
        var reverbGain = offlineCtx.createGain();
        reverbGain.gain.value = (state.reverb / 100) * 0.7;

        trebleFilter.connect(convolver);
        convolver.connect(reverbGain);
        reverbGain.connect(masterGain);
      }

      // Stereo Widening / Haas Micro-Shift
      if (state.stereoWidth > 0) {
        var delayNode = offlineCtx.createDelay();
        var delaySec = (state.stereoWidth / 100) * 0.015; // up to 15ms
        delayNode.delayTime.value = delaySec;
        var delayGain = offlineCtx.createGain();
        delayGain.gain.value = 0.4;

        trebleFilter.connect(delayNode);
        delayNode.connect(delayGain);
        delayGain.connect(masterGain);
      }

      masterGain.connect(offlineCtx.destination);
      source.start(0);

      showProgress(true, 'Synthesizing Audio Buffers…', 40, 'Rendering offline DSP effects graph', 'Stage 2/3');

      var renderedBuffer = await offlineCtx.startRendering();

      var leftChannel = renderedBuffer.getChannelData(0);
      var rightChannel = renderedBuffer.numberOfChannels > 1 ? renderedBuffer.getChannelData(1) : leftChannel;

      // Optional subtle anti-detection hash noise floor (-50dB)
      if (state.noiseFloor) {
        var noiseAmp = 0.002;
        for (var i = 0; i < leftChannel.length; i++) {
          var n = (Math.random() * 2 - 1) * noiseAmp;
          leftChannel[i] += n;
          rightChannel[i] += n;
        }
      }

      showProgress(true, 'Encoding Final Output…', 75, 'Encoding to ' + state.outputFormat.toUpperCase(), 'Stage 3/3');

      var outputBlob = null;
      var ext = 'mp3';

      if (state.outputFormat === 'wav') {
        outputBlob = encodeWAV(leftChannel, rightChannel, sampleRate);
        ext = 'wav';
      } else {
        var kbps = parseInt(selectBitrate.value, 10) || 320;
        outputBlob = await encodeMP3(leftChannel, rightChannel, sampleRate, kbps);
        ext = 'mp3';
      }

      state.outputBlob = outputBlob;
      state.outputUrl = URL.createObjectURL(outputBlob);

      displayResultCard(outputBlob, ext, outputDuration);
      showProgress(false);

      if (window.showToast) window.showToast('Audio remixed & ready to download!', 'success');

    } catch (err) {
      console.error('Render Error:', err);
      showProgress(false);
      alert('Render Error: ' + err.message);
    } finally {
      state.isProcessing = false;
      btnRender.disabled = false;
      btnRender.innerHTML = '<span>🚀 Render &amp; Download Remixed Audio</span>';
    }
  }

  // --- DISPLAY RESULT ---
  function displayResultCard(blob, ext, duration) {
    if (!resultCard) return;

    var originalName = state.file ? state.file.name.replace(/\.[^/.]+$/, '') : 'remixed_track';
    var rawOutName = originalName + '_anti_claim_' + state.activePreset + '.' + ext;
    var outFileName = (window.formatDownloadName ? window.formatDownloadName(rawOutName) : originalName + '_anti_claim_' + state.activePreset + ' ( alltoolsinone ).' + ext);

    if (resultPlayer) {
      resultPlayer.src = state.outputUrl;
      resultPlayer.load();
    }

    if (resultMeta) {
      resultMeta.innerHTML = `
        <strong>File:</strong> ${outFileName} &nbsp;|&nbsp; 
        <strong>Size:</strong> ${formatBytes(blob.size)} &nbsp;|&nbsp; 
        <strong>Duration:</strong> ${formatTime(duration)} &nbsp;|&nbsp; 
        <strong>Status:</strong> <span style="color: #16a34a; font-weight: 700;">✅ Content ID Shield Applied</span>
      `;
    }

    if (btnDownload) {
      btnDownload.onclick = function () {
        var a = document.createElement('a');
        a.href = state.outputUrl;
        a.download = outFileName;
        a.click();
      };
    }

    resultCard.style.display = 'block';
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // --- LAMEJS MP3 ENCODER ---
  async function encodeMP3(leftChannel, rightChannel, sampleRate, kbps) {
    if (typeof lamejs === 'undefined') {
      throw new Error('LameJS MP3 encoder is not loaded yet.');
    }

    var channels = rightChannel ? 2 : 1;
    var mp3encoder = new lamejs.Mp3Encoder(channels, sampleRate, kbps);
    var mp3Data = [];

    var sampleCount = leftChannel.length;
    var leftInt16 = new Int16Array(sampleCount);
    var rightInt16 = rightChannel ? new Int16Array(sampleCount) : null;

    for (var i = 0; i < sampleCount; i++) {
      var sL = leftChannel[i];
      leftInt16[i] = sL < 0 ? sL * 0x8000 : sL * 0x7FFF;
      if (rightInt16) {
        var sR = rightChannel[i];
        rightInt16[i] = sR < 0 ? sR * 0x8000 : sR * 0x7FFF;
      }
    }

    var chunkSize = 11520;
    var offset = 0;

    return new Promise(function (resolve) {
      function processChunk() {
        var end = Math.min(offset + chunkSize, sampleCount);
        var subL = leftInt16.subarray(offset, end);
        var mp3buf;

        if (channels === 2) {
          var subR = rightInt16.subarray(offset, end);
          mp3buf = mp3encoder.encodeBuffer(subL, subR);
        } else {
          mp3buf = mp3encoder.encodeBuffer(subL);
        }

        if (mp3buf.length > 0) mp3Data.push(mp3buf);
        offset = end;

        var pct = 75 + Math.round((offset / sampleCount) * 23);
        showProgress(true, 'Encoding to MP3 (' + kbps + ' kbps)…', pct, 'Writing frames: ' + Math.round((offset / sampleCount) * 100) + '%', kbps + ' kbps');

        if (offset < sampleCount) {
          setTimeout(processChunk, 0);
        } else {
          var mp3End = mp3encoder.flush();
          if (mp3End.length > 0) mp3Data.push(mp3End);
          resolve(new Blob(mp3Data, { type: 'audio/mp3' }));
        }
      }
      processChunk();
    });
  }

  // --- LOSSLESS 16-BIT WAV ENCODER ---
  function encodeWAV(leftChannel, rightChannel, sampleRate) {
    var channels = rightChannel ? 2 : 1;
    var sampleCount = leftChannel.length;
    var byteRate = sampleRate * channels * 2;
    var blockAlign = channels * 2;
    var dataSize = sampleCount * blockAlign;

    var buffer = new ArrayBuffer(44 + dataSize);
    var view = new DataView(buffer);

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(view, 8, 'WAVE');

    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, channels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true);

    writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);

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

  function writeString(view, offset, str) {
    for (var i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  // --- HELPERS ---
  function showProgress(visible, title, pct, subtitle, badge) {
    if (!progressWrap) return;
    progressWrap.style.display = visible ? 'block' : 'none';
    if (title && progressTitle) progressTitle.textContent = title;
    if (subtitle && progressSubtitle) progressSubtitle.textContent = subtitle;
    if (pct !== undefined && progressBar) progressBar.style.width = pct + '%';
    if (pct !== undefined && progressPercent) progressPercent.textContent = pct + '%';
  }

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    var mins = Math.floor(seconds / 60);
    var secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
  }

  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

})();
