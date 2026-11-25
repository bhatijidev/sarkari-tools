// Sleep Calculator Logic
document.addEventListener('DOMContentLoaded', () => {
  const modeRadios = document.querySelectorAll('input[name="sleepMode"]');
  const wakeTimeInputWrap = document.getElementById('wakeTimeInputWrap');
  const wakeTime = document.getElementById('wakeTime');
  const fallAsleepTime = document.getElementById('fallAsleepTime');
  const dispResultTitle = document.getElementById('dispResultTitle');
  const dispResultDesc = document.getElementById('dispResultDesc');
  const cyclesContainer = document.getElementById('cyclesContainer');

  function formatTime(d) {
    let h = d.getHours();
    const m = d.getMinutes();
    const period = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    const mStr = m < 10 ? '0' + m : m;
    return `${h}:${mStr} ${period}`;
  }

  function calculate() {
    let mode = 'wakeup';
    modeRadios.forEach(r => { if (r.checked) mode = r.value; });
    const latency = parseInt(fallAsleepTime.value) || 14;

    cyclesContainer.innerHTML = '';

    if (mode === 'wakeup') {
      wakeTimeInputWrap.style.display = 'block';
      const timeParts = wakeTime.value.split(':');
      const targetH = parseInt(timeParts[0]) || 7;
      const targetM = parseInt(timeParts[1]) || 0;

      const targetDate = new Date();
      targetDate.setHours(targetH, targetM, 0, 0);

      dispResultTitle.textContent = `Recommended Bedtimes for ${formatTime(targetDate)}:`;
      dispResultDesc.textContent = `To wake up refreshed without sleep inertia, plan to get in bed at one of these times (includes ${latency} min to fall asleep):`;

      // 6, 5, 4, 3 cycles (each 90 min = 1.5 hr)
      const cycleCounts = [6, 5, 4, 3];
      cycleCounts.forEach(c => {
        const sleepMinutes = (c * 90) + latency;
        const bedtime = new Date(targetDate.getTime() - (sleepMinutes * 60 * 1000));

        const card = document.createElement('div');
        const isBest = c >= 5;
        card.className = `cycle-card ${isBest ? 'best' : (c === 4 ? 'good' : '')}`;
        card.innerHTML = `
          <div>
            <div class="cycle-time">${formatTime(bedtime)}</div>
            <div style="font-size:12px; color:#64748b;">${c} Cycles (${(c * 1.5)} Hours of Sleep)</div>
          </div>
          <div style="text-align:right;">
            ${isBest ? '<span style="background:#2563eb; color:#fff; font-size:11px; font-weight:700; padding:4px 8px; border-radius:4px;">OPTIMAL</span>' : (c === 4 ? '<span style="background:#16a34a; color:#fff; font-size:11px; font-weight:700; padding:4px 8px; border-radius:4px;">GOOD</span>' : '<span style="color:#d97706; font-size:11px; font-weight:700;">MINIMUM</span>')}
          </div>
        `;
        cyclesContainer.appendChild(card);
      });
    } else {
      wakeTimeInputWrap.style.display = 'none';
      const now = new Date();
      dispResultTitle.textContent = 'If You Sleep Right Now:';
      dispResultDesc.textContent = `Going to bed now at ${formatTime(now)} (accounting for ${latency} min to fall asleep), set your alarm for:`;

      const cycleCounts = [3, 4, 5, 6];
      cycleCounts.forEach(c => {
        const sleepMinutes = (c * 90) + latency;
        const wakeAlarm = new Date(now.getTime() + (sleepMinutes * 60 * 1000));

        const card = document.createElement('div');
        const isBest = c >= 5;
        card.className = `cycle-card ${isBest ? 'best' : (c === 4 ? 'good' : '')}`;
        card.innerHTML = `
          <div>
            <div class="cycle-time">${formatTime(wakeAlarm)}</div>
            <div style="font-size:12px; color:#64748b;">${c} Cycles (${(c * 1.5)} Hours of Sleep)</div>
          </div>
          <div style="text-align:right;">
            ${isBest ? '<span style="background:#2563eb; color:#fff; font-size:11px; font-weight:700; padding:4px 8px; border-radius:4px;">SUGGESTED</span>' : ''}
          </div>
        `;
        cyclesContainer.appendChild(card);
      });
    }
  }

  modeRadios.forEach(r => r.addEventListener('change', calculate));
  [wakeTime, fallAsleepTime].forEach(el => el.addEventListener('input', calculate));

  calculate();
});
