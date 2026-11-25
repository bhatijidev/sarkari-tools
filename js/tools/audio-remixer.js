/**
 * AllToolsInOne — Copyright Remover (Video & Audio)
 * Real-time synchronized Video + Waveform timeline scrubber,
 * Original Voice Remover / Mute, Live Mic & File Voiceover Dubbing,
 * Speed-Synced Video Re-encoding (MP4/WebM) & Offline MP3/WAV Master Export.
 */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  var state = {
    file: null,
    isVideo: false,
    videoUrl: null,
    videoWidth: 0,
    videoHeight: 0,
    videoDuration: 0,
    hasOriginalAudio: true,
    audioBuffer: null,

    voiceFileName: '',
    voiceBuffer: null,
    origAudioMode: 'remix', // 'remix' | 'vocal_remove' | 'mute'
    origVol: 1.0,
    voiceVol: 1.25,
    voiceOffset: 0.0,
    voiceEnhance: true,

    compareOriginal: false,

    previewCtx: null,
    previewSources: [],
    previewRafId: null,
    isPlaying: false,
    isScrubbing: false,
    previewStartTime: 0,
    previewPauseOffset: 0,

    isRecordingVoice: false,
    mediaRecorder: null,
    micStream: null,
    recChunks: [],
    recTimerId: null,
    recStartMs: 0,

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
    outputExt: 'mp3',
    impulseCache: {}
  };

  var PRESETS = {
    shorts_shield: { speed: 1.05, pitch: 1.2, bass: 3, treble: 2, reverb: 12, stereoWidth: 40, noiseFloor: true, origAudioMode: 'remix' },
    voice_dub:     { speed: 1.00, pitch: 0.0, bass: 0, treble: 0, reverb: 0,  stereoWidth: 0,  noiseFloor: false, origAudioMode: 'mute' },
    nightcore:     { speed: 1.18, pitch: 3.0, bass: 2, treble: 5, reverb: 8,  stereoWidth: 30, noiseFloor: true, origAudioMode: 'remix' },
    slowed_reverb: { speed: 0.86, pitch: -2.5, bass: 6, treble: -2, reverb: 42, stereoWidth: 65, noiseFloor: true, origAudioMode: 'remix' },
    eight_d:       { speed: 1.00, pitch: 0.0, bass: 4, treble: 3, reverb: 30, stereoWidth: 100, noiseFloor: true, origAudioMode: 'remix' },
    custom: null
  };

  // DOM References
  var uploadZone = $('remixerUploadZone');
  var fileInput = $('remixerFileInput');
  var btnSelectFile = $('btnSelectFile');
  var btnTryDemo = $('btnTryDemo');
  var btnTryAudioDemo = $('btnTryAudioDemo');
  var workspace = $('remixerWorkspace');

  var metaFileName = $('metaFileName');
  var metaDuration = $('metaDuration');
  var metaFileSize = $('metaFileSize');
  var metaSampleRate = $('metaSampleRate');

  var previewVideoBox = $('previewVideoBox');
  var previewVideoPlayer = $('previewVideoPlayer');
  var previewWaveform = $('previewWaveform');
  var previewTimelineSlider = $('previewTimelineSlider');
  var previewTimeDisplay = $('previewTimeDisplay');
  var previewSyncInfo = $('previewSyncInfo');
  var btnPlayPreview = $('btnPlayPreview');
  var btnRestartPreview = $('btnRestartPreview');
  var btnToggleCompare = $('btnToggleCompare');

  var origModeBtns = document.querySelectorAll('#origModeGrid .voice-mode-btn');
  var sliderOrigVol = $('sliderOrigVol');
  var badgeOrigVol = $('badgeOrigVol');

  var voiceFileInput = $('voiceFileInput');
  var btnRecordVoice = $('btnRecordVoice');
  var btnStopVoiceRec = $('btnStopVoiceRec');
  var btnUploadVoice = $('btnUploadVoice');
  var btnClearVoice = $('btnClearVoice');
  var voiceStatusPill = $('voiceStatusPill');
  var voiceControlsWrap = $('voiceControlsWrap');
  var sliderVoiceVol = $('sliderVoiceVol');
  var badgeVoiceVol = $('badgeVoiceVol');
  var sliderVoiceOffset = $('sliderVoiceOffset');
  var badgeVoiceOffset = $('badgeVoiceOffset');
  var checkVoiceEnhance = $('checkVoiceEnhance');

  var sliderSpeed = $('sliderSpeed');
  var badgeSpeed = $('badgeSpeed');
  var speedSyncReadout = $('speedSyncReadout');
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

  var selectFormat = $('selectFormat');
  var optFormatVideo = $('optFormatVideo');
  var bitrateGroup = $('bitrateGroup');
  var selectBitrate = $('selectBitrate');
  var btnRender = $('btnRender');
  var progressWrap = $('progressWrap');
  var progressTitle = $('progressTitle');
  var progressPercent = $('progressPercent');
  var progressBar = $('progressBar');
  var progressSubtitle = $('progressSubtitle');

  var resultCard = $('resultCard');
  var resultHeading = $('resultHeading');
  var resultMeta = $('resultMeta');
  var resultVideoPlayer = $('resultVideoPlayer');
  var resultPlayer = $('resultPlayer');
  var btnDownload = $('btnDownload');

  // ───────── Helper Calculations ─────────
  function getEffectiveVideoSpeed() {
    if (state.compareOriginal) return 1.0;
    var rate = state.origAudioMode === 'mute'
      ? state.speed
      : state.speed * Math.pow(2, state.pitch / 12);
    return Math.max(0.5, Math.min(2.0, rate));
  }

  function getBaseDuration() {
    if (state.isVideo && state.videoDuration > 0) return state.videoDuration;
    if (state.audioBuffer) return state.audioBuffer.duration;
    return 0;
  }

  function getOutputDuration() {
    var base = getBaseDuration();
    if (!base) return 0;
    return base / getEffectiveVideoSpeed();
  }

  function formatTimePrecise(sec) {
    if (!sec || !isFinite(sec) || sec < 0) sec = 0;
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    var d = Math.floor((sec % 1) * 10);
    return m + ':' + (s < 10 ? '0' : '') + s + '.' + d;
  }

  function formatBytes(b) {
    if (b < 1024) return b + ' B';
    if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1048576).toFixed(2) + ' MB';
  }

  function createSilenceBuffer(durationSec, sampleRate) {
    var sr = sampleRate || 44100;
    var len = Math.max(1, Math.floor(durationSec * sr));
    return new AudioBuffer({ length: len, numberOfChannels: 2, sampleRate: sr });
  }

  // ───────── Presets & Controls ─────────
  function initControls() {
    var presetBtns = document.querySelectorAll('.remixer-preset-btn');
    presetBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        presetBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var p = PRESETS[btn.dataset.preset];
        if (p) applyPresetValues(p);
      });
    });

    origModeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setOrigAudioMode(btn.dataset.origmode);
      });
    });

    if (sliderOrigVol) {
      sliderOrigVol.addEventListener('input', function () {
        state.origVol = parseInt(sliderOrigVol.value, 10) / 100;
        badgeOrigVol.textContent = Math.round(state.origVol * 100) + '%';
        refreshPlaybackOnParamChange();
      });
    }

    if (sliderVoiceVol) {
      sliderVoiceVol.addEventListener('input', function () {
        state.voiceVol = parseInt(sliderVoiceVol.value, 10) / 100;
        badgeVoiceVol.textContent = Math.round(state.voiceVol * 100) + '%';
        refreshPlaybackOnParamChange();
      });
    }

    if (sliderVoiceOffset) {
      sliderVoiceOffset.addEventListener('input', function () {
        state.voiceOffset = parseFloat(sliderVoiceOffset.value) || 0;
        badgeVoiceOffset.textContent = state.voiceOffset.toFixed(1) + 's';
        drawWaveform();
        refreshPlaybackOnParamChange();
      });
    }

    if (checkVoiceEnhance) {
      checkVoiceEnhance.addEventListener('change', function () {
        state.voiceEnhance = !!checkVoiceEnhance.checked;
        refreshPlaybackOnParamChange();
      });
    }

    var sliders = [
      { el: sliderSpeed, key: 'speed', parser: parseFloat },
      { el: sliderPitch, key: 'pitch', parser: parseFloat },
      { el: sliderBass, key: 'bass', parser: function (v) { return parseInt(v, 10); } },
      { el: sliderTreble, key: 'treble', parser: function (v) { return parseInt(v, 10); } },
      { el: sliderReverb, key: 'reverb', parser: function (v) { return parseInt(v, 10); } },
      { el: sliderStereo, key: 'stereoWidth', parser: function (v) { return parseInt(v, 10); } }
    ];

    sliders.forEach(function (s) {
      if (!s.el) return;
      s.el.addEventListener('input', function () {
        state[s.key] = s.parser(s.el.value);
        markCustomPreset();
        updateSliderDisplays();
        refreshPlaybackOnParamChange();
      });
    });

    if (checkNoise) {
      checkNoise.addEventListener('change', function () {
        state.noiseFloor = !!checkNoise.checked;
        markCustomPreset();
      });
    }

    if (selectFormat) {
      selectFormat.addEventListener('change', function () {
        state.outputFormat = selectFormat.value;
        updateExportUiState();
      });
    }

    if (selectBitrate) {
      selectBitrate.addEventListener('change', function () {
        state.outputBitrate = parseInt(selectBitrate.value, 10);
      });
    }
  }

  function setOrigAudioMode(mode) {
    state.origAudioMode = mode || 'remix';
    origModeBtns.forEach(function (b) {
      b.classList.toggle('active', b.dataset.origmode === state.origAudioMode);
    });
    if (state.origAudioMode === 'mute') {
      if (sliderOrigVol) sliderOrigVol.disabled = true;
      if (badgeOrigVol) badgeOrigVol.textContent = 'Muted (0%)';
    } else {
      if (sliderOrigVol) sliderOrigVol.disabled = false;
      if (badgeOrigVol) badgeOrigVol.textContent = Math.round(state.origVol * 100) + '%';
    }
    updateSliderDisplays();
    refreshPlaybackOnParamChange();
  }

  function markCustomPreset() {
    document.querySelectorAll('.remixer-preset-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.preset === 'custom');
    });
  }

  function applyPresetValues(p) {
    state.speed = p.speed;
    state.pitch = p.pitch;
    state.bass = p.bass;
    state.treble = p.treble;
    state.reverb = p.reverb;
    state.stereoWidth = p.stereoWidth;
    state.noiseFloor = p.noiseFloor;
    state.origAudioMode = p.origAudioMode || 'remix';

    if (sliderSpeed) sliderSpeed.value = p.speed;
    if (sliderPitch) sliderPitch.value = p.pitch;
    if (sliderBass) sliderBass.value = p.bass;
    if (sliderTreble) sliderTreble.value = p.treble;
    if (sliderReverb) sliderReverb.value = p.reverb;
    if (sliderStereo) sliderStereo.value = p.stereoWidth;
    if (checkNoise) checkNoise.checked = p.noiseFloor;

    setOrigAudioMode(state.origAudioMode);
  }

  function updateSliderDisplays() {
    var spdPct = Math.round((state.speed - 1) * 100);
    if (badgeSpeed) badgeSpeed.textContent = state.speed.toFixed(2) + 'x (' + (spdPct >= 0 ? '+' : '') + spdPct + '%)';
    if (badgePitch) badgePitch.textContent = (state.pitch >= 0 ? '+' : '') + state.pitch.toFixed(1) + ' st';
    if (badgeBass) badgeBass.textContent = (state.bass >= 0 ? '+' : '') + state.bass + ' dB';
    if (badgeTreble) badgeTreble.textContent = (state.treble >= 0 ? '+' : '') + state.treble + ' dB';
    if (badgeReverb) badgeReverb.textContent = state.reverb + '%';
    if (badgeStereo) badgeStereo.textContent = state.stereoWidth + '%';

    var eff = getEffectiveVideoSpeed();
    var outDur = getOutputDuration();
    if (speedSyncReadout) {
      if (state.isVideo) {
        speedSyncReadout.textContent = 'Synced Video Speed: ' + eff.toFixed(2) + 'x (Output duration: ' + formatTimePrecise(outDur) + ')';
      } else {
        speedSyncReadout.textContent = 'Effective output speed: ' + eff.toFixed(2) + 'x';
      }
    }
    if (previewSyncInfo) {
      previewSyncInfo.textContent = (state.compareOriginal ? 'Bypass (Original 1.00x)' : 'Speed: ' + eff.toFixed(2) + 'x') +
        (state.voiceBuffer ? ' • Voice Dub Active' : '') +
        (state.isVideo ? ' • Video Synced' : '');
    }
    if (btnToggleCompare) {
      btnToggleCompare.textContent = state.compareOriginal ? '👂 Hearing: Original (Raw)' : '🎧 Hearing: Mixed Output';
      btnToggleCompare.style.borderColor = state.compareOriginal ? '#f97316' : '#475569';
    }
    updateTimelineUI(state.previewPauseOffset);
  }

  function updateExportUiState() {
    var fmt = selectFormat ? selectFormat.value : 'mp3';
    state.outputFormat = fmt;
    if (bitrateGroup) bitrateGroup.style.display = fmt === 'mp3' ? 'block' : 'none';
    if (btnRender) {
      if (fmt === 'video') {
        btnRender.innerHTML = '<span>🚀 Render &amp; Download Merged Video</span>';
      } else {
        btnRender.innerHTML = '<span>🚀 Render &amp; Download ' + fmt.toUpperCase() + ' Audio</span>';
      }
    }
  }

  function refreshPlaybackOnParamChange() {
    if (state.isPlaying) {
      var cur = getCurrentPreviewOffset();
      stopPreview(false);
      state.previewPauseOffset = Math.min(cur, Math.max(0, getOutputDuration() - 0.05));
      startPreview();
    } else {
      updateTimelineUI(state.previewPauseOffset);
    }
  }

  // ───────── File & Demo Ingestion ─────────
  function initFileHandlers() {
    if (btnSelectFile && fileInput) {
      btnSelectFile.addEventListener('click', function (e) {
        e.stopPropagation();
        fileInput.click();
      });
    }

    if (uploadZone && fileInput) {
      uploadZone.addEventListener('click', function (e) {
        if (e.target.closest('button')) return;
        fileInput.click();
      });
      uploadZone.addEventListener('dragover', function (e) {
        e.preventDefault();
        uploadZone.style.borderColor = 'var(--saffron)';
        uploadZone.style.background = '#fff9f2';
      });
      uploadZone.addEventListener('dragleave', function (e) {
        e.preventDefault();
        uploadZone.style.borderColor = 'var(--gray-300)';
        uploadZone.style.background = '';
      });
      uploadZone.addEventListener('drop', function (e) {
        e.preventDefault();
        uploadZone.style.borderColor = 'var(--gray-300)';
        uploadZone.style.background = '';
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleIncomingFile(e.dataTransfer.files[0]);
        }
      });
      fileInput.addEventListener('change', function () {
        if (fileInput.files && fileInput.files[0]) {
          handleIncomingFile(fileInput.files[0]);
        }
      });
    }

    if (btnTryDemo) {
      btnTryDemo.addEventListener('click', function (e) {
        e.stopPropagation();
        loadDemoVideo();
      });
    }
    if (btnTryAudioDemo) {
      btnTryAudioDemo.addEventListener('click', function (e) {
        e.stopPropagation();
        loadDemoTrack();
      });
    }
  }

  async function handleIncomingFile(file) {
    stopPreview(true);
    state.file = file;
    state.isVideo = (file.type && file.type.startsWith('video/')) || /\.(mp4|webm|mov|m4v|mkv|avi)$/i.test(file.name);
    state.hasOriginalAudio = true;

    if (metaFileName) metaFileName.textContent = file.name.length > 28 ? file.name.substring(0, 26) + '…' : file.name;
    if (metaFileSize) metaFileSize.textContent = formatBytes(file.size);
    if (resultCard) resultCard.style.display = 'none';

    if (state.videoUrl) {
      URL.revokeObjectURL(state.videoUrl);
      state.videoUrl = null;
    }

    if (state.isVideo) {
      state.videoUrl = URL.createObjectURL(file);
      previewVideoBox.style.display = 'block';
      previewVideoPlayer.src = state.videoUrl;
      previewVideoPlayer.muted = true;
      await waitForVideoMetadata(previewVideoPlayer);
      state.videoWidth = previewVideoPlayer.videoWidth || 640;
      state.videoHeight = previewVideoPlayer.videoHeight || 360;
      state.videoDuration = isFinite(previewVideoPlayer.duration) && previewVideoPlayer.duration > 0 ? previewVideoPlayer.duration : 0;
    } else {
      previewVideoBox.style.display = 'none';
      previewVideoPlayer.removeAttribute('src');
      previewVideoPlayer.load();
      state.videoWidth = 0;
      state.videoHeight = 0;
      state.videoDuration = 0;
    }

    try {
      var arrayBuf = await file.arrayBuffer();
      var actx = new (window.AudioContext || window.webkitAudioContext)();
      var decoded = null;
      try {
        decoded = await actx.decodeAudioData(arrayBuf.slice(0));
        state.hasOriginalAudio = true;
      } catch (decodeErr) {
        if (state.isVideo && state.videoDuration > 0) {
          decoded = createSilenceBuffer(state.videoDuration, 44100);
          state.hasOriginalAudio = false;
        } else {
          await actx.close();
          throw decodeErr;
        }
      }
      await actx.close();

      if (state.isVideo && (!state.videoDuration || state.videoDuration <= 0)) {
        state.videoDuration = decoded.duration;
      }
      onAudioBufferReady(decoded);
    } catch (err) {
      if (window.showToast) window.showToast('Unable to decode media file. Try standard MP4, WebM, MP3, or WAV.', 'error');
    }
  }

  function waitForVideoMetadata(videoEl) {
    return new Promise(function (resolve) {
      if (videoEl.readyState >= 1 && isFinite(videoEl.duration) && videoEl.duration > 0) {
        resolve();
        return;
      }
      var done = false;
      function finish() {
        if (done) return;
        done = true;
        videoEl.removeEventListener('loadedmetadata', finish);
        videoEl.removeEventListener('error', finish);
        resolve();
      }
      videoEl.addEventListener('loadedmetadata', finish);
      videoEl.addEventListener('error', finish);
      setTimeout(finish, 3000);
    });
  }

  function onAudioBufferReady(buffer) {
    state.audioBuffer = buffer;
    state.previewPauseOffset = 0;

    var baseDur = getBaseDuration();
    if (metaDuration) metaDuration.textContent = formatTimePrecise(baseDur);
    if (metaSampleRate) {
      if (state.isVideo) {
        metaSampleRate.textContent = state.videoWidth + '×' + state.videoHeight + ' Video' + (state.hasOriginalAudio ? ' + Audio' : ' (Silent)');
      } else {
        metaSampleRate.textContent = buffer.sampleRate + ' Hz (' + buffer.numberOfChannels + 'ch)';
      }
    }

    if (optFormatVideo) {
      optFormatVideo.disabled = !state.isVideo;
      optFormatVideo.hidden = !state.isVideo;
    }
    if (selectFormat) {
      selectFormat.value = state.isVideo ? 'video' : 'mp3';
    }
    if (sliderVoiceOffset) {
      sliderVoiceOffset.max = Math.max(5, Math.floor(baseDur * 10) / 10).toString();
    }

    workspace.style.display = 'block';
    updateExportUiState();
    updateSliderDisplays();
    drawWaveform(0);
    workspace.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Generate 3.5s Animated Demo Video WITH Music + Centered Voice-like Lead
  async function loadDemoVideo() {
    if (window.showToast) window.showToast('Generating demo video clip with soundtrack…', 'info');
    var canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 360;
    var ctx = canvas.getContext('2d');
    var stream = canvas.captureStream(30);

    var actx = new (window.AudioContext || window.webkitAudioContext)();
    var dest = actx.createMediaStreamDestination();
    var oscL = actx.createOscillator();
    var oscR = actx.createOscillator();
    var oscVox = actx.createOscillator();
    var gMusic = actx.createGain();
    var gVox = actx.createGain();
    var merger = actx.createChannelMerger(2);

    oscL.type = 'sawtooth';
    oscR.type = 'triangle';
    oscVox.type = 'sine';
    oscL.frequency.setValueAtTime(220, actx.currentTime);
    oscR.frequency.setValueAtTime(329.63, actx.currentTime);
    oscVox.frequency.setValueAtTime(440, actx.currentTime);

    gMusic.gain.setValueAtTime(0.18, actx.currentTime);
    gVox.gain.setValueAtTime(0.22, actx.currentTime);

    // Stereo music + dead-center "original voice" so Vocal Remover demo works audibly
    oscL.connect(gMusic);
    oscR.connect(gMusic);
    gMusic.connect(merger, 0, 0);
    oscR.connect(merger, 0, 1);
    oscVox.connect(gVox);
    gVox.connect(merger, 0, 0);
    gVox.connect(merger, 0, 1);
    merger.connect(dest);

    oscL.start();
    oscR.start();
    oscVox.start();

    dest.stream.getAudioTracks().forEach(function (t) { stream.addTrack(t); });

    var mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')
      ? 'video/webm;codecs=vp8,opus'
      : (MediaRecorder.isTypeSupported('video/mp4') ? 'video/mp4' : 'video/webm');
    var rec = new MediaRecorder(stream, { mimeType: mime });
    var chunks = [];
    rec.ondataavailable = function (ev) { if (ev.data.size > 0) chunks.push(ev.data); };

    rec.onstop = async function () {
      try { oscL.stop(); oscR.stop(); oscVox.stop(); await actx.close(); } catch (e) {}
      var blob = new Blob(chunks, { type: mime });
      var ext = mime.includes('mp4') ? 'mp4' : 'webm';
      var demoFile = new File([blob], 'Shorts_Demo_Video.' + ext, { type: mime });
      handleIncomingFile(demoFile);
    };

    rec.start();
    var frame = 0;
    var totalFrames = 105; // 3.5 seconds @ 30fps
    function renderDemoFrame() {
      if (frame >= totalFrames) {
        rec.stop();
        return;
      }
      var t = frame / 30;
      var grad = ctx.createLinearGradient(0, 0, 640, 360);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#1e3a8a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 640, 360);

      // Animated equalizer bars & timecode counter so speed changes are visibly clear!
      ctx.fillStyle = '#f97316';
      var ballX = 90 + ((frame / totalFrames) * 460);
      var ballY = 175 + Math.sin(frame * 0.22) * 55;
      ctx.beginPath();
      ctx.arc(ballX, ballY, 26, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('Shorts & Reels Demo Clip', 32, 52);
      ctx.font = 'bold 34px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('TIME: ' + t.toFixed(2) + 's', 32, 315);

      frame++;
      setTimeout(renderDemoFrame, 33);
    }
    renderDemoFrame();
  }

  function loadDemoTrack() {
    stopPreview(true);
    state.isVideo = false;
    state.videoUrl = null;
    state.videoDuration = 0;
    state.hasOriginalAudio = true;
    previewVideoBox.style.display = 'none';
    previewVideoPlayer.removeAttribute('src');

    var sampleRate = 44100;
    var dur = 6;
    var buf = new AudioBuffer({ length: sampleRate * dur, numberOfChannels: 2, sampleRate: sampleRate });
    var L = buf.getChannelData(0);
    var R = buf.getChannelData(1);
    var chords = [[261.63, 329.63, 392.0], [220.0, 261.63, 329.63], [174.61, 220.0, 261.63], [196.0, 246.94, 293.66]];
    for (var i = 0; i < L.length; i++) {
      var t = i / sampleRate;
      var cIdx = Math.floor(t / 1.5) % chords.length;
      var ch = chords[cIdx];
      var beatEnv = Math.exp(-(t % 0.5) * 6);
      var kick = Math.sin(2 * Math.PI * (60 * Math.exp(-(t % 0.5) * 14) + 38) * t) * 0.35 * beatEnv;
      var musicL = Math.sin(2 * Math.PI * ch[0] * t) * 0.2 + Math.sin(2 * Math.PI * ch[1] * t) * 0.14;
      var musicR = Math.sin(2 * Math.PI * ch[0] * t) * 0.18 + Math.sin(2 * Math.PI * ch[2] * t) * 0.16;
      var centerVocal = Math.sin(2 * Math.PI * 523.25 * t) * 0.12 * (0.5 + 0.5 * Math.sin(t * 6));
      L[i] = kick + musicL + centerVocal;
      R[i] = kick + musicR + centerVocal;
    }

    state.file = { name: 'Shorts_Demo_Beat.wav', size: 1058400 };
    if (metaFileName) metaFileName.textContent = 'Shorts_Demo_Beat.wav (Demo)';
    if (metaFileSize) metaFileSize.textContent = '1.01 MB';
    onAudioBufferReady(buf);
    if (window.showToast) window.showToast('Demo audio loaded! Press Play Preview or add your own voice.', 'info');
  }

  // ───────── Custom Voice Recording & File Upload ─────────
  function initVoiceHandlers() {
    if (btnUploadVoice && voiceFileInput) {
      btnUploadVoice.addEventListener('click', function () {
        voiceFileInput.click();
      });
      voiceFileInput.addEventListener('change', async function () {
        if (!voiceFileInput.files || !voiceFileInput.files[0]) return;
        var vFile = voiceFileInput.files[0];
        try {
          var ab = await vFile.arrayBuffer();
          var actx = new (window.AudioContext || window.webkitAudioContext)();
          var decoded = await actx.decodeAudioData(ab);
          await actx.close();
          setLoadedVoice(decoded, vFile.name);
        } catch (err) {
          if (window.showToast) window.showToast('Could not read audio file. Try MP3, WAV, or M4A.', 'error');
        }
        voiceFileInput.value = '';
      });
    }

    if (btnRecordVoice) {
      btnRecordVoice.addEventListener('click', startVoiceRecording);
    }
    if (btnStopVoiceRec) {
      btnStopVoiceRec.addEventListener('click', stopVoiceRecording);
    }
    if (btnClearVoice) {
      btnClearVoice.addEventListener('click', function () {
        state.voiceBuffer = null;
        state.voiceFileName = '';
        if (voiceControlsWrap) voiceControlsWrap.style.display = 'none';
        if (btnClearVoice) btnClearVoice.style.display = 'none';
        if (voiceStatusPill) voiceStatusPill.textContent = 'No custom voice added (Optional — record live mic or upload MP3/WAV)';
        updateSliderDisplays();
        drawWaveform();
        refreshPlaybackOnParamChange();
      });
    }
  }

  function setLoadedVoice(audioBuf, name) {
    state.voiceBuffer = audioBuf;
    state.voiceFileName = name;
    if (voiceControlsWrap) voiceControlsWrap.style.display = 'grid';
    if (btnClearVoice) btnClearVoice.style.display = 'inline-flex';
    if (voiceStatusPill) {
      voiceStatusPill.innerHTML = '<strong style="color:#15803d;">✅ Voice Added:</strong> ' + name + ' (' + formatTimePrecise(audioBuf.duration) + ')';
    }
    updateSliderDisplays();
    drawWaveform();
    refreshPlaybackOnParamChange();
    if (window.showToast) window.showToast('Your voiceover track is ready! Press Play Preview to hear both combined.', 'success');
  }

  async function startVoiceRecording() {
    if (state.isRecordingVoice) return;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (window.showToast) window.showToast('Microphone API unavailable here. Use "Upload Voice File" instead.', 'error');
      return;
    }
    stopPreview(true);
    try {
      var stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      state.micStream = stream;
      state.recChunks = [];
      state.isRecordingVoice = true;
      state.recStartMs = Date.now();

      var rec = new MediaRecorder(stream);
      state.mediaRecorder = rec;
      rec.ondataavailable = function (ev) {
        if (ev.data && ev.data.size > 0) state.recChunks.push(ev.data);
      };
      rec.onstop = async function () {
        clearInterval(state.recTimerId);
        state.isRecordingVoice = false;
        if (state.micStream) {
          state.micStream.getTracks().forEach(function (t) { t.stop(); });
          state.micStream = null;
        }
        if (state.isVideo && previewVideoPlayer) {
          previewVideoPlayer.pause();
        }
        btnRecordVoice.style.display = 'inline-flex';
        btnStopVoiceRec.style.display = 'none';

        var blob = new Blob(state.recChunks, { type: rec.mimeType || 'audio/webm' });
        try {
          var ab = await blob.arrayBuffer();
          var actx = new (window.AudioContext || window.webkitAudioContext)();
          var decoded = await actx.decodeAudioData(ab);
          await actx.close();
          setLoadedVoice(decoded, 'Mic_Voiceover.webm');
        } catch (err) {
          if (window.showToast) window.showToast('Recording decode failed. Try uploading a WAV/MP3 voice file.', 'error');
        }
      };

      rec.start();
      btnRecordVoice.style.display = 'none';
      btnStopVoiceRec.style.display = 'inline-flex';

      // Play muted video along in sync while user records their voiceover!
      if (state.isVideo && previewVideoPlayer && previewVideoPlayer.src) {
        var eff = getEffectiveVideoSpeed();
        previewVideoPlayer.muted = true;
        previewVideoPlayer.playbackRate = eff;
        previewVideoPlayer.currentTime = Math.min(state.videoDuration || 0, state.previewPauseOffset * eff);
        previewVideoPlayer.play().catch(function () {});
      }

      state.recTimerId = setInterval(function () {
        var sec = (Date.now() - state.recStartMs) / 1000;
        if (voiceStatusPill) {
          voiceStatusPill.innerHTML = '<strong style="color:#dc2626;">🔴 Recording Voice:</strong> ' + formatTimePrecise(sec) + ' (Click Stop when finished)';
        }
      }, 150);
    } catch (err) {
      if (window.showToast) window.showToast('Microphone permission denied or unavailable. Use "Upload Voice File" instead.', 'error');
    }
  }

  function stopVoiceRecording() {
    if (state.mediaRecorder && state.mediaRecorder.state === 'recording') {
      state.mediaRecorder.stop();
    }
  }

  // ───────── Interactive Waveform & Timeline Scrubber ─────────
  function drawWaveform(progressFraction) {
    if (!previewWaveform || !state.audioBuffer) return;
    var ctx = previewWaveform.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var rect = previewWaveform.getBoundingClientRect();
    var w = Math.max(300, rect.width || 600);
    var h = Math.max(80, rect.height || 104);

    if (previewWaveform.width !== Math.round(w * dpr) || previewWaveform.height !== Math.round(h * dpr)) {
      previewWaveform.width = Math.round(w * dpr);
      previewWaveform.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    if (progressFraction === undefined || progressFraction === null) {
      var outDur = getOutputDuration() || 1;
      progressFraction = Math.max(0, Math.min(1, getCurrentPreviewOffset() / outDur));
    }

    var data = state.audioBuffer.getChannelData(0);
    var barWidth = 3;
    var gap = 2;
    var totalBars = Math.floor(w / (barWidth + gap));
    var step = Math.max(1, Math.floor(data.length / totalBars));
    var playX = progressFraction * w;

    for (var i = 0; i < totalBars; i++) {
      var peak = 0;
      var start = i * step;
      for (var j = 0; j < step && start + j < data.length; j += Math.max(1, Math.floor(step / 10))) {
        var amp = Math.abs(data[start + j]);
        if (amp > peak) peak = amp;
      }
      var x = i * (barWidth + gap);
      var barH = state.origAudioMode === 'mute' ? 3 : Math.max(4, peak * (h - 26));
      var y = (h - 14 - barH) / 2 + 4;
      ctx.fillStyle = (x <= playX) ? '#f97316' : (state.origAudioMode === 'mute' ? '#334155' : '#475569');
      ctx.fillRect(x, y, barWidth, barH);
    }

    // Secondary custom voiceover timeline track indicator along the bottom
    if (state.voiceBuffer) {
      var totalOut = Math.max(0.01, getOutputDuration());
      var vStartFrac = Math.min(1, state.voiceOffset / totalOut);
      var vEndFrac = Math.min(1, (state.voiceOffset + state.voiceBuffer.duration) / totalOut);
      var vx = vStartFrac * w;
      var vw = Math.max(6, (vEndFrac - vStartFrac) * w);
      ctx.fillStyle = 'rgba(34, 197, 94, 0.28)';
      ctx.fillRect(vx, h - 14, vw, 10);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(vx, h - 5, vw, 3);
    }

    // Vertical moving Playhead cursor
    var headX = Math.max(2, Math.min(w - 2, playX));
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(headX, 0);
    ctx.lineTo(headX, h);
    ctx.stroke();

    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(headX, 7, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  function updateTimelineUI(offsetOutSec) {
    var dur = getOutputDuration();
    if (!dur) return;
    var clamped = Math.max(0, Math.min(dur, offsetOutSec || 0));
    var frac = clamped / dur;

    if (previewTimelineSlider && !state.isScrubbing) {
      previewTimelineSlider.value = Math.round(frac * 1000);
    }
    if (previewTimeDisplay) {
      previewTimeDisplay.textContent = formatTimePrecise(clamped) + ' / ' + formatTimePrecise(dur);
    }
    drawWaveform(frac);
  }

  function seekToFraction(frac) {
    var dur = getOutputDuration();
    if (!dur) return;
    var clampedFrac = Math.max(0, Math.min(1, frac));
    var targetOut = clampedFrac * dur;
    state.previewPauseOffset = targetOut;

    if (state.isVideo && previewVideoPlayer && previewVideoPlayer.src) {
      var eff = state.compareOriginal ? 1.0 : getEffectiveVideoSpeed();
      previewVideoPlayer.currentTime = Math.min(state.videoDuration || 0, targetOut * eff);
    }

    if (state.isPlaying) {
      stopPreview(false);
      state.previewPauseOffset = targetOut;
      startPreview();
    } else {
      updateTimelineUI(targetOut);
    }
  }

  function initTimelineListeners() {
    if (previewTimelineSlider) {
      previewTimelineSlider.addEventListener('pointerdown', function () { state.isScrubbing = true; });
      previewTimelineSlider.addEventListener('pointerup', function () { state.isScrubbing = false; });
      previewTimelineSlider.addEventListener('input', function () {
        var frac = parseFloat(previewTimelineSlider.value) / 1000;
        var dur = getOutputDuration();
        state.previewPauseOffset = frac * dur;
        if (previewTimeDisplay) {
          previewTimeDisplay.textContent = formatTimePrecise(state.previewPauseOffset) + ' / ' + formatTimePrecise(dur);
        }
        drawWaveform(frac);
        if (state.isVideo && previewVideoPlayer && previewVideoPlayer.src) {
          var eff = state.compareOriginal ? 1.0 : getEffectiveVideoSpeed();
          previewVideoPlayer.currentTime = Math.min(state.videoDuration || 0, state.previewPauseOffset * eff);
        }
      });
      previewTimelineSlider.addEventListener('change', function () {
        state.isScrubbing = false;
        seekToFraction(parseFloat(previewTimelineSlider.value) / 1000);
      });
    }

    if (previewWaveform) {
      var draggingCanvas = false;
      function handleCanvasSeek(e) {
        var rect = previewWaveform.getBoundingClientRect();
        var frac = (e.clientX - rect.left) / Math.max(1, rect.width);
        seekToFraction(frac);
      }
      previewWaveform.addEventListener('pointerdown', function (e) {
        draggingCanvas = true;
        handleCanvasSeek(e);
      });
      window.addEventListener('pointermove', function (e) {
        if (!draggingCanvas) return;
        handleCanvasSeek(e);
      });
      window.addEventListener('pointerup', function () {
        draggingCanvas = false;
      });
    }

    if (btnPlayPreview) {
      btnPlayPreview.addEventListener('click', function () {
        if (state.isPlaying) stopPreview(false);
        else startPreview();
      });
    }

    if (btnRestartPreview) {
      btnRestartPreview.addEventListener('click', function () {
        seekToFraction(0);
      });
    }

    if (btnToggleCompare) {
      btnToggleCompare.addEventListener('click', function () {
        state.compareOriginal = !state.compareOriginal;
        updateSliderDisplays();
        refreshPlaybackOnParamChange();
      });
    }
  }

  // ───────── Shared DSP Graph (Real-Time Preview & Offline Export) ─────────
  function getImpulseResponse(ctx, seconds, decay) {
    var key = Math.round(ctx.sampleRate) + '_' + seconds + '_' + decay;
    if (state.impulseCache[key] && state.impulseCache[key].sampleRate === ctx.sampleRate) {
      return state.impulseCache[key];
    }
    var len = Math.floor(ctx.sampleRate * seconds);
    var ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var ch = 0; ch < 2; ch++) {
      var d = ir.getChannelData(ch);
      for (var i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    state.impulseCache[key] = ir;
    return ir;
  }

  function buildVocalRemoverNode(ctx, inputNode, targetNode) {
    var splitter = ctx.createChannelSplitter(2);
    var invR = ctx.createGain();
    invR.gain.value = -1;
    var sideSum = ctx.createGain();
    sideSum.gain.value = 0.85;

    // Preserve low-end bass frequencies below 140Hz so music stays punchy
    var bassLowpass = ctx.createBiquadFilter();
    bassLowpass.type = 'lowpass';
    bassLowpass.frequency.value = 140;
    var bassMix = ctx.createGain();
    bassMix.gain.value = 0.45;

    var merger = ctx.createChannelMerger(2);

    inputNode.connect(splitter);
    splitter.connect(sideSum, 0);
    splitter.connect(invR, 1);
    invR.connect(sideSum);

    inputNode.connect(bassLowpass);
    bassLowpass.connect(bassMix);

    sideSum.connect(merger, 0, 0);
    sideSum.connect(merger, 0, 1);
    bassMix.connect(merger, 0, 0);
    bassMix.connect(merger, 0, 1);
    merger.connect(targetNode);
  }

  function buildMasterMixGraph(ctx, destinationNode, startOffsetOutSec, isExportRender) {
    var activeSources = [];
    var now = ctx.currentTime;
    var masterLimiter = ctx.createDynamicsCompressor();
    masterLimiter.threshold.value = -1.5;
    masterLimiter.knee.value = 6;
    masterLimiter.ratio.value = 4;
    masterLimiter.connect(destinationNode);

    if (state.compareOriginal && !isExportRender) {
      if (state.audioBuffer && startOffsetOutSec < state.audioBuffer.duration) {
        var rawSrc = ctx.createBufferSource();
        rawSrc.buffer = state.audioBuffer;
        rawSrc.connect(masterLimiter);
        rawSrc.start(now, startOffsetOutSec);
        activeSources.push(rawSrc);
      }
      return activeSources;
    }

    var effSpeed = getEffectiveVideoSpeed();

    // 1. Original Audio Track (Remix / Vocal Remove / Mute)
    if (state.audioBuffer && state.origAudioMode !== 'mute' && state.origVol > 0) {
      var origStart = startOffsetOutSec * effSpeed;
      if (origStart < state.audioBuffer.duration) {
        var origSrc = ctx.createBufferSource();
        origSrc.buffer = state.audioBuffer;
        origSrc.playbackRate.value = effSpeed;

        var preEq = ctx.createGain();
        preEq.gain.value = state.origVol;

        if (state.origAudioMode === 'vocal_remove' && state.audioBuffer.numberOfChannels >= 2) {
          buildVocalRemoverNode(ctx, origSrc, preEq);
        } else if (state.origAudioMode === 'vocal_remove') {
          var vCut1 = ctx.createBiquadFilter();
          vCut1.type = 'peaking';
          vCut1.frequency.value = 1100;
          vCut1.Q.value = 1.2;
          vCut1.gain.value = -14;
          var vCut2 = ctx.createBiquadFilter();
          vCut2.type = 'peaking';
          vCut2.frequency.value = 2800;
          vCut2.Q.value = 1.2;
          vCut2.gain.value = -10;
          origSrc.connect(vCut1);
          vCut1.connect(vCut2);
          vCut2.connect(preEq);
        } else {
          origSrc.connect(preEq);
        }

        var lowShelf = ctx.createBiquadFilter();
        lowShelf.type = 'lowshelf';
        lowShelf.frequency.value = 100;
        lowShelf.gain.value = state.bass;

        var highShelf = ctx.createBiquadFilter();
        highShelf.type = 'highshelf';
        highShelf.frequency.value = 8000;
        highShelf.gain.value = state.treble;

        preEq.connect(lowShelf);
        lowShelf.connect(highShelf);

        var bus = highShelf;
        if (state.stereoWidth > 0) {
          var splitter = ctx.createChannelSplitter(2);
          var merger = ctx.createChannelMerger(2);
          var delay = ctx.createDelay();
          delay.delayTime.value = (state.stereoWidth / 100) * 0.015;
          bus.connect(splitter);
          splitter.connect(merger, 0, 0);
          splitter.connect(delay, 1);
          delay.connect(merger, 0, 1);
          bus = merger;
        }

        var dry = ctx.createGain();
        dry.gain.value = 1.0 - (state.reverb / 100) * 0.35;
        bus.connect(dry);
        dry.connect(masterLimiter);

        if (state.reverb > 0) {
          var conv = ctx.createConvolver();
          conv.buffer = getImpulseResponse(ctx, 1.5, 2.5);
          var wet = ctx.createGain();
          wet.gain.value = (state.reverb / 100) * 0.55;
          bus.connect(conv);
          conv.connect(wet);
          wet.connect(masterLimiter);
        }

        origSrc.start(now, origStart);
        activeSources.push(origSrc);
      }
    }

    // 2. Added Custom Voiceover Track (ALWAYS natural 1.0x pitch!)
    if (state.voiceBuffer && state.voiceVol > 0) {
      var voiceEndOut = state.voiceOffset + state.voiceBuffer.duration;
      if (startOffsetOutSec < voiceEndOut) {
        var vSrc = ctx.createBufferSource();
        vSrc.buffer = state.voiceBuffer;
        vSrc.playbackRate.value = 1.0;

        var vOut = vSrc;
        if (state.voiceEnhance) {
          var hp = ctx.createBiquadFilter();
          hp.type = 'highpass';
          hp.frequency.value = 85;
          var pres = ctx.createBiquadFilter();
          pres.type = 'peaking';
          pres.frequency.value = 3000;
          pres.Q.value = 0.85;
          pres.gain.value = 3.0;
          var comp = ctx.createDynamicsCompressor();
          comp.threshold.value = -16;
          comp.ratio.value = 3;
          vSrc.connect(hp);
          hp.connect(pres);
          pres.connect(comp);
          vOut = comp;
        }

        var vGain = ctx.createGain();
        vGain.gain.value = state.voiceVol;
        vOut.connect(vGain);
        vGain.connect(masterLimiter);

        var delaySec = state.voiceOffset - startOffsetOutSec;
        if (delaySec >= 0) {
          vSrc.start(now + delaySec, 0);
        } else {
          vSrc.start(now, -delaySec);
        }
        activeSources.push(vSrc);
      }
    }

    // 3. Sub-perceptual -50dB Acoustic Entropy Layer (Export only)
    if (isExportRender && state.noiseFloor && state.origAudioMode !== 'mute') {
      var outSamples = Math.max(1, Math.floor(getOutputDuration() * ctx.sampleRate));
      var noiseBuf = ctx.createBuffer(1, outSamples, ctx.sampleRate);
      var nd = noiseBuf.getChannelData(0);
      for (var n = 0; n < nd.length; n++) nd[n] = (Math.random() * 2 - 1) * 0.0028;
      var nSrc = ctx.createBufferSource();
      nSrc.buffer = noiseBuf;
      nSrc.connect(masterLimiter);
      nSrc.start(now);
      activeSources.push(nSrc);
    }

    return activeSources;
  }

  function getCurrentPreviewOffset() {
    if (!state.isPlaying || !state.previewCtx) return state.previewPauseOffset;
    return state.previewPauseOffset + (state.previewCtx.currentTime - state.previewStartTime);
  }

  function startPreview() {
    var outDur = getOutputDuration();
    if (!outDur) return;

    if (state.previewPauseOffset >= outDur - 0.04) {
      state.previewPauseOffset = 0;
    }

    stopPreview(false);

    var actx = new (window.AudioContext || window.webkitAudioContext)();
    state.previewCtx = actx;
    state.previewStartTime = actx.currentTime;
    state.previewSources = buildMasterMixGraph(actx, actx.destination, state.previewPauseOffset, false);
    state.isPlaying = true;

    if (btnPlayPreview) {
      btnPlayPreview.innerHTML = '<span>⏸️ Pause Preview</span>';
      btnPlayPreview.classList.add('btn-active');
    }

    if (state.isVideo && previewVideoPlayer && previewVideoPlayer.src) {
      var eff = state.compareOriginal ? 1.0 : getEffectiveVideoSpeed();
      previewVideoPlayer.muted = true;
      previewVideoPlayer.playbackRate = eff;
      previewVideoPlayer.currentTime = Math.min(state.videoDuration || 0, state.previewPauseOffset * eff);
      previewVideoPlayer.play().catch(function () {});
    }

    function tickTimeline() {
      if (!state.isPlaying) return;
      var cur = getCurrentPreviewOffset();
      var dur = getOutputDuration();
      if (cur >= dur) {
        stopPreview(true);
        return;
      }
      updateTimelineUI(cur);
      state.previewRafId = requestAnimationFrame(tickTimeline);
    }
    state.previewRafId = requestAnimationFrame(tickTimeline);
  }

  function stopPreview(resetToStart) {
    if (state.previewRafId) {
      cancelAnimationFrame(state.previewRafId);
      state.previewRafId = null;
    }

    var elapsed = state.isPlaying ? getCurrentPreviewOffset() : state.previewPauseOffset;

    state.previewSources.forEach(function (src) {
      try { src.stop(); } catch (e) {}
    });
    state.previewSources = [];

    if (state.previewCtx) {
      try { state.previewCtx.close(); } catch (e) {}
      state.previewCtx = null;
    }

    if (state.isVideo && previewVideoPlayer) {
      try { previewVideoPlayer.pause(); } catch (e) {}
    }

    state.isPlaying = false;
    state.previewPauseOffset = resetToStart ? 0 : Math.min(elapsed, getOutputDuration());
    if (resetToStart && state.isVideo && previewVideoPlayer && previewVideoPlayer.src) {
      previewVideoPlayer.currentTime = 0;
    }

    if (btnPlayPreview) {
      btnPlayPreview.innerHTML = '<span>▶️ Play Preview</span>';
      btnPlayPreview.classList.remove('btn-active');
    }
    updateTimelineUI(state.previewPauseOffset);
  }

  // ───────── Export Pipeline (Video + Mixed Audio OR MP3 / WAV) ─────────
  async function renderMixedAudioBuffer(progressCb) {
    var sr = state.audioBuffer ? state.audioBuffer.sampleRate : 44100;
    var outDur = Math.max(0.1, getOutputDuration());
    var totalSamples = Math.max(1, Math.floor(outDur * sr));

    if (progressCb) progressCb(12, 'Mixing original + voiceover master audio…');
    var offline = new OfflineAudioContext(2, totalSamples, sr);
    buildMasterMixGraph(offline, offline.destination, 0, true);
    var rendered = await offline.startRendering();
    if (progressCb) progressCb(38, 'Audio mix rendered (' + formatTimePrecise(rendered.duration) + ')');
    return rendered;
  }

  async function renderExportVideo(masterAudioBuf) {
    var effSpeed = getEffectiveVideoSpeed();
    var outDur = masterAudioBuf.duration;

    var exportVid = document.createElement('video');
    exportVid.muted = true;
    exportVid.playsInline = true;
    exportVid.src = state.videoUrl;
    await waitForVideoMetadata(exportVid);

    var srcW = exportVid.videoWidth || state.videoWidth || 640;
    var srcH = exportVid.videoHeight || state.videoHeight || 360;
    if (srcW > 1280) {
      srcH = Math.round(srcH * (1280 / srcW));
      srcW = 1280;
    }
    srcW = Math.max(2, srcW - (srcW % 2));
    srcH = Math.max(2, srcH - (srcH % 2));

    var canvas = document.createElement('canvas');
    canvas.width = srcW;
    canvas.height = srcH;
    var cctx = canvas.getContext('2d');

    exportVid.currentTime = 0;
    await new Promise(function (res) {
      if (exportVid.readyState >= 2) { res(); return; }
      exportVid.addEventListener('loadeddata', res, { once: true });
      setTimeout(res, 1500);
    });
    cctx.drawImage(exportVid, 0, 0, srcW, srcH);

    var canvasStream = canvas.captureStream(30);
    var actx = new (window.AudioContext || window.webkitAudioContext)();
    var dest = actx.createMediaStreamDestination();
    var aSrc = actx.createBufferSource();
    aSrc.buffer = masterAudioBuf;
    aSrc.connect(dest);

    var combinedTracks = [].concat(canvasStream.getVideoTracks(), dest.stream.getAudioTracks());
    var outStream = new MediaStream(combinedTracks);

    var candidates = [
      'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
      'video/mp4',
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm'
    ];
    var mimeType = 'video/webm';
    for (var i = 0; i < candidates.length; i++) {
      if (MediaRecorder.isTypeSupported(candidates[i])) {
        mimeType = candidates[i];
        break;
      }
    }

    var recorder = new MediaRecorder(outStream, {
      mimeType: mimeType,
      videoBitsPerSecond: 4500000
    });
    var chunks = [];
    recorder.ondataavailable = function (e) {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    return await new Promise(function (resolve, reject) {
      var finished = false;
      var rafId = null;
      var safetyTimer = null;

      function stopAll() {
        if (finished) return;
        finished = true;
        if (rafId) cancelAnimationFrame(rafId);
        if (safetyTimer) clearTimeout(safetyTimer);
        try { aSrc.stop(); } catch (e) {}
        try { exportVid.pause(); } catch (e) {}
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }

      recorder.onstop = async function () {
        try { await actx.close(); } catch (e) {}
        var blob = new Blob(chunks, { type: mimeType });
        var ext = mimeType.indexOf('mp4') !== -1 ? 'mp4' : 'webm';
        resolve({ blob: blob, ext: ext, duration: outDur });
      };
      recorder.onerror = function (err) {
        reject(err.error || new Error('MediaRecorder encoding error'));
      };

      exportVid.onended = function () {
        setTimeout(stopAll, 180);
      };

      safetyTimer = setTimeout(stopAll, (outDur + 3.0) * 1000);

      recorder.start(100);
      exportVid.playbackRate = effSpeed;
      exportVid.play().catch(function () {});
      aSrc.start(actx.currentTime);

      var t0 = performance.now();
      function pumpFrame() {
        if (finished) return;
        cctx.drawImage(exportVid, 0, 0, srcW, srcH);

        var elapsed = (performance.now() - t0) / 1000;
        var pct = Math.min(99, 40 + Math.round((elapsed / Math.max(0.1, outDur)) * 58));
        progressBar.style.width = pct + '%';
        progressPercent.textContent = pct + '%';
        progressSubtitle.textContent = 'Merging synced video + audio (' + formatTimePrecise(elapsed) + ' / ' + formatTimePrecise(outDur) + ')';

        if (elapsed >= outDur + 0.12 || exportVid.ended) {
          stopAll();
          return;
        }
        rafId = requestAnimationFrame(pumpFrame);
      }
      rafId = requestAnimationFrame(pumpFrame);
    });
  }

  async function renderExport() {
    if (!state.audioBuffer && !state.isVideo) return;
    stopPreview(false);

    btnRender.disabled = true;
    progressWrap.style.display = 'block';
    resultCard.style.display = 'none';
    progressBar.style.width = '5%';
    progressPercent.textContent = '5%';
    progressTitle.textContent = 'Rendering Master Track…';
    progressSubtitle.textContent = 'Preparing DSP & voiceover mix…';

    try {
      var masterBuf = await renderMixedAudioBuffer(function (pct, msg) {
        progressBar.style.width = pct + '%';
        progressPercent.textContent = pct + '%';
        progressSubtitle.textContent = msg;
      });

      var blob = null;
      var ext = 'mp3';

      if (state.outputFormat === 'video' && state.isVideo && state.videoUrl) {
        progressTitle.textContent = 'Merging Synced Video + Audio…';
        var videoOut = await renderExportVideo(masterBuf);
        blob = videoOut.blob;
        ext = videoOut.ext;
      } else if (state.outputFormat === 'wav') {
        progressTitle.textContent = 'Encoding WAV…';
        blob = encodeWAV(masterBuf);
        ext = 'wav';
      } else {
        progressTitle.textContent = 'Encoding MP3 (' + state.outputBitrate + ' kbps)…';
        blob = await encodeMP3(masterBuf, state.outputBitrate, function (p) {
          var pct = 40 + Math.round(p * 60);
          progressBar.style.width = pct + '%';
          progressPercent.textContent = pct + '%';
        });
        ext = 'mp3';
      }

      progressBar.style.width = '100%';
      progressPercent.textContent = '100%';
      progressSubtitle.textContent = 'Complete!';

      if (state.outputUrl) URL.revokeObjectURL(state.outputUrl);
      state.outputBlob = blob;
      state.outputUrl = URL.createObjectURL(blob);
      state.outputExt = ext;

      if (ext === 'mp4' || ext === 'webm') {
        resultVideoPlayer.src = state.outputUrl;
        resultVideoPlayer.style.display = 'block';
        resultPlayer.style.display = 'none';
        resultPlayer.removeAttribute('src');
        if (resultHeading) resultHeading.textContent = 'Merged Video Ready for Download!';
        if (btnDownload) btnDownload.textContent = '📥 Download Video (.' + ext + ')';
      } else {
        resultVideoPlayer.style.display = 'none';
        resultVideoPlayer.removeAttribute('src');
        resultPlayer.style.display = 'block';
        resultPlayer.src = state.outputUrl;
        if (resultHeading) resultHeading.textContent = 'Copyright-Removed Audio Ready!';
        if (btnDownload) btnDownload.textContent = '📥 Download Audio (.' + ext + ')';
      }

      var eff = getEffectiveVideoSpeed();
      var summaryParts = [
        ext.toUpperCase(),
        formatBytes(blob.size),
        'Speed ' + eff.toFixed(2) + 'x',
        'Duration ' + formatTimePrecise(masterBuf.duration)
      ];
      if (state.voiceBuffer) summaryParts.push('Voiceover Mixed');
      if (state.origAudioMode === 'mute') summaryParts.push('Original Audio Removed');
      else if (state.origAudioMode === 'vocal_remove') summaryParts.push('Original Vocals Attenuated');

      if (resultMeta) resultMeta.textContent = summaryParts.join(' • ');

      setTimeout(function () {
        progressWrap.style.display = 'none';
        resultCard.style.display = 'block';
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 250);
    } catch (err) {
      if (window.showToast) window.showToast('Render failed: ' + err.message, 'error');
      progressWrap.style.display = 'none';
    } finally {
      btnRender.disabled = false;
    }
  }

  function encodeWAV(audioBuffer) {
    var numChannels = audioBuffer.numberOfChannels;
    var sampleRate = audioBuffer.sampleRate;
    var samples = audioBuffer.length;
    var dataLen = samples * numChannels * 2;
    var ab = new ArrayBuffer(44 + dataLen);
    var v = new DataView(ab);
    function writeStr(off, s) { for (var i = 0; i < s.length; i++) v.setUint8(off + i, s.charCodeAt(i)); }
    writeStr(0, 'RIFF');
    v.setUint32(4, 36 + dataLen, true);
    writeStr(8, 'WAVEfmt ');
    v.setUint32(16, 16, true);
    v.setUint16(20, 1, true);
    v.setUint16(22, numChannels, true);
    v.setUint32(24, sampleRate, true);
    v.setUint32(28, sampleRate * numChannels * 2, true);
    v.setUint16(32, numChannels * 2, true);
    v.setUint16(34, 16, true);
    writeStr(36, 'data');
    v.setUint32(40, dataLen, true);

    var channels = [];
    for (var ch = 0; ch < numChannels; ch++) channels.push(audioBuffer.getChannelData(ch));
    var idx = 44;
    for (var i = 0; i < samples; i++) {
      for (var ch2 = 0; ch2 < numChannels; ch2++) {
        var s = Math.max(-1, Math.min(1, channels[ch2][i]));
        v.setInt16(idx, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        idx += 2;
      }
    }
    return new Blob([ab], { type: 'audio/wav' });
  }

  async function encodeMP3(audioBuffer, bitrate, progressCb) {
    if (typeof lamejs === 'undefined') return encodeWAV(audioBuffer);
    var chCount = audioBuffer.numberOfChannels;
    var sr = audioBuffer.sampleRate;
    var encoder = new lamejs.Mp3Encoder(chCount, sr, bitrate);
    var L = audioBuffer.getChannelData(0);
    var R = chCount > 1 ? audioBuffer.getChannelData(1) : L;

    function toI16(arr) {
      var res = new Int16Array(arr.length);
      for (var i = 0; i < arr.length; i++) {
        var s = Math.max(-1, Math.min(1, arr[i]));
        res[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }
      return res;
    }

    var left16 = toI16(L);
    var right16 = toI16(R);
    var blockSize = 1152;
    var chunks = [];
    for (var i = 0; i < left16.length; i += blockSize) {
      var lChunk = left16.subarray(i, i + blockSize);
      var rChunk = right16.subarray(i, i + blockSize);
      var buf = chCount === 2 ? encoder.encodeBuffer(lChunk, rChunk) : encoder.encodeBuffer(lChunk);
      if (buf.length > 0) chunks.push(buf);
      if (i % (blockSize * 45) === 0 && progressCb) {
        progressCb(i / left16.length);
        await new Promise(function (r) { setTimeout(r, 0); });
      }
    }
    var tail = encoder.flush();
    if (tail.length > 0) chunks.push(tail);
    return new Blob(chunks, { type: 'audio/mp3' });
  }

  // ───────── Boot ─────────
  function init() {
    initControls();
    initFileHandlers();
    initVoiceHandlers();
    initTimelineListeners();

    if (btnRender) btnRender.addEventListener('click', renderExport);
    if (btnDownload) {
      btnDownload.addEventListener('click', function () {
        if (!state.outputUrl) return;
        var baseName = (state.file ? state.file.name : 'media').replace(/\.[^/.]+$/, '');
        var a = document.createElement('a');
        a.href = state.outputUrl;
        a.download = baseName + '_copyright_removed.' + (state.outputExt || 'mp4');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    }

    updateSliderDisplays();
    updateExportUiState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
