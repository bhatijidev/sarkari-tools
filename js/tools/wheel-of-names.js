// Wheel of Names - Canvas Physics, Audio Synthesis & Confetti
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('wheelCanvas');
  const ctx = canvas.getContext('2d');
  const namesInput = document.getElementById('namesInput');
  const btnSpin = document.getElementById('btnSpin');
  const dispCount = document.getElementById('dispCount');
  const btnShuffle = document.getElementById('btnShuffle');
  const btnSort = document.getElementById('btnSort');
  const chkRemoveWinner = document.getElementById('chkRemoveWinner');
  const chkSound = document.getElementById('chkSound');
  const btnFullscreen = document.getElementById('btnFullscreen');
  const presetBtns = document.querySelectorAll('.preset-btn');

  const winnerModal = document.getElementById('winnerModal');
  const winnerName = document.getElementById('winnerName');
  const btnCloseWinner = document.getElementById('btnCloseWinner');
  const btnRemoveWinner = document.getElementById('btnRemoveWinner');
  const confettiCanvas = document.getElementById('confettiCanvas');
  const confCtx = confettiCanvas.getContext('2d');

  const colors = [
    '#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#ec4899', '#f97316', '#14b8a6', '#6366f1'
  ];

  let items = [];
  let currentAngle = 0;
  let isSpinning = false;
  let spinVelocity = 0;
  let lastSoundSlice = -1;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx && window.AudioContext) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playTick() {
    if (!chkSound.checked || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {}
  }

  function updateItems() {
    items = namesInput.value.split('\n').map(s => s.trim()).filter(Boolean);
    dispCount.textContent = items.length;
    drawWheel();
  }

  function drawWheel() {
    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = cx - 15;

    ctx.clearRect(0, 0, width, height);

    if (items.length === 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#f1f5f9';
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Add names to spin!', cx, cy);
      return;
    }

    const arc = (2 * Math.PI) / items.length;

    for (let i = 0; i < items.length; i++) {
      const angle = currentAngle + i * arc;
      ctx.beginPath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angle, angle + arc);
      ctx.lineTo(cx, cy);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = items.length > 20 ? 'bold 12px sans-serif' : 'bold 16px sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 3;

      let label = items[i];
      if (label.length > 18) label = label.substring(0, 16) + '…';
      ctx.fillText(label, radius - 20, 5);
      ctx.restore();
    }

    // Center hub
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SPIN', cx, cy);
  }

  function spin() {
    if (isSpinning || items.length === 0) return;
    initAudio();
    isSpinning = true;
    btnSpin.disabled = true;

    const startAngle = currentAngle;
    const extraSpins = (Math.floor(Math.random() * 4) + 6) * 2 * Math.PI; // 6 to 9 full spins
    const randomStop = Math.random() * 2 * Math.PI;
    const totalRotation = extraSpins + randomStop;
    const duration = 3800; // 3.8 seconds
    const startTime = performance.now();

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(progress);

      currentAngle = (startAngle + totalRotation * eased) % (2 * Math.PI);

      // Sound trigger on slice change
      const arc = (2 * Math.PI) / items.length;
      const normalized = (2 * Math.PI - (currentAngle % (2 * Math.PI))) % (2 * Math.PI);
      const activeSlice = Math.floor(normalized / arc) % items.length;
      if (activeSlice !== lastSoundSlice) {
        playTick();
        lastSoundSlice = activeSlice;
      }

      drawWheel();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        isSpinning = false;
        btnSpin.disabled = false;
        announceWinner(items[activeSlice]);
      }
    }
    requestAnimationFrame(animate);
  }

  function announceWinner(winner) {
    winnerName.textContent = winner;
    winnerModal.style.display = 'flex';
    triggerConfetti();
  }

  function triggerConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    confettiCanvas.style.display = 'block';

    const particles = [];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 16,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        spin: (Math.random() - 0.5) * 10
      });
    }

    let frames = 0;
    function animConf() {
      if (frames++ > 150) {
        confettiCanvas.style.display = 'none';
        return;
      }
      confCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3; // Gravity
        p.rotation += p.spin;
        confCtx.save();
        confCtx.translate(p.x, p.y);
        confCtx.rotate((p.rotation * Math.PI) / 180);
        confCtx.fillStyle = p.color;
        confCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        confCtx.restore();
      });
      requestAnimationFrame(animConf);
    }
    requestAnimationFrame(animConf);
  }

  btnSpin.addEventListener('click', spin);
  canvas.addEventListener('click', spin);

  namesInput.addEventListener('input', updateItems);

  btnShuffle.addEventListener('click', () => {
    items.sort(() => Math.random() - 0.5);
    namesInput.value = items.join('\n');
    updateItems();
  });

  btnSort.addEventListener('click', () => {
    items.sort((a, b) => a.localeCompare(b));
    namesInput.value = items.join('\n');
    updateItems();
  });

  presetBtns.forEach(b => {
    b.addEventListener('click', () => {
      const p = b.dataset.preset;
      if (p === 'numbers') namesInput.value = '1\n2\n3\n4\n5\n6\n7\n8\n9\n10';
      else if (p === 'yesno') namesInput.value = 'Yes\nNo';
      else if (p === 'dice') namesInput.value = '1\n2\n3\n4\n5\n6';
      else if (p === 'weekdays') namesInput.value = 'Monday\nTuesday\nWednesday\nThursday\nFriday\nSaturday\nSunday';
      updateItems();
    });
  });

  btnCloseWinner.addEventListener('click', () => {
    winnerModal.style.display = 'none';
  });

  btnRemoveWinner.addEventListener('click', () => {
    const w = winnerName.textContent;
    items = items.filter(n => n !== w);
    namesInput.value = items.join('\n');
    updateItems();
    winnerModal.style.display = 'none';
  });

  btnFullscreen.addEventListener('click', () => {
    const cont = document.querySelector('.wheel-canvas-container');
    if (!document.fullscreenElement) {
      cont.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  });

  updateItems();
});
