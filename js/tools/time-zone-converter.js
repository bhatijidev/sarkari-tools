// World Time Zone Converter & Meeting Planner
document.addEventListener('DOMContentLoaded', () => {
  const citiesContainer = document.getElementById('citiesContainer');
  const addCitySelect = document.getElementById('addCitySelect');
  const btnCopyInvite = document.getElementById('btnCopyInvite');

  const cityDatabase = {
    'New York': { label: 'New York (EDT)', offset: -4, flag: '🇺🇸' },
    'San Francisco': { label: 'San Francisco (PDT)', offset: -7, flag: '🇺🇸' },
    'Chicago': { label: 'Chicago (CDT)', offset: -5, flag: '🇺🇸' },
    'London': { label: 'London (BST)', offset: 1, flag: '🇬🇧' },
    'Berlin': { label: 'Berlin (CEST)', offset: 2, flag: '🇩🇪' },
    'Dubai': { label: 'Dubai (GST)', offset: 4, flag: '🇦🇪' },
    'Mumbai': { label: 'Mumbai (IST)', offset: 5.5, flag: '🇮🇳' },
    'Singapore': { label: 'Singapore (SGT)', offset: 8, flag: '🇸🇬' },
    'Tokyo': { label: 'Tokyo (JST)', offset: 9, flag: '🇯🇵' },
    'Sydney': { label: 'Sydney (AEST)', offset: 10, flag: '🇦🇺' }
  };

  let activeCities = ['New York', 'San Francisco', 'London', 'Mumbai'];
  let selectedBaseHour = 14; // Default 2 PM in first city

  function getHourClass(h) {
    if (h >= 9 && h < 17) return 'hour-work';
    if (h >= 7 && h < 22) return 'hour-social';
    return 'hour-sleep';
  }

  function formatTime(h24) {
    const period = h24 >= 12 ? 'PM' : 'AM';
    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;
    return `${h12} ${period}`;
  }

  function render() {
    citiesContainer.innerHTML = '';

    const baseCity = activeCities[0];
    const baseOffset = cityDatabase[baseCity] ? cityDatabase[baseCity].offset : 0;

    activeCities.forEach((cName, idx) => {
      const data = cityDatabase[cName];
      if (!data) return;

      const card = document.createElement('div');
      card.className = 'tz-card';

      // Current hour in this city corresponding to selectedBaseHour in baseCity
      const offsetDiff = data.offset - baseOffset;
      let targetHour = Math.floor(selectedBaseHour + offsetDiff);
      let dayShift = '';
      if (targetHour >= 24) {
        targetHour %= 24;
        dayShift = '<span style="color:#2563eb; font-size:11px; font-weight:700;"> (+1 Day)</span>';
      } else if (targetHour < 0) {
        targetHour = (targetHour + 24) % 24;
        dayShift = '<span style="color:#d97706; font-size:11px; font-weight:700;"> (-1 Day)</span>';
      }

      card.innerHTML = `
        <div class="tz-card-header">
          <div>
            <strong style="font-size:16px;">${data.flag} ${data.label}</strong>
            <span style="margin-left:8px; font-size:14px; color:#1e3a8a; font-weight:700;">${formatTime(targetHour)}${dayShift}</span>
          </div>
          <div>
            ${idx > 0 ? `<button type="button" class="btn btn-sm btn-outline del-city-btn" data-city="${cName}" style="color:#ef4444;">Remove</button>` : '<span style="font-size:11px; color:#64748b; font-weight:600;">BASE TIME</span>'}
          </div>
        </div>
        <div class="tz-timeline"></div>
      `;

      const timeline = card.querySelector('.tz-timeline');
      for (let h = 0; h < 24; h++) {
        const localH = (Math.floor(h + offsetDiff) + 48) % 24;
        const cell = document.createElement('div');
        cell.className = `tz-hour-cell ${getHourClass(localH)} ${h === selectedBaseHour ? 'hour-selected' : ''}`;
        cell.textContent = localH === 0 ? '12a' : (localH === 12 ? '12p' : (localH > 12 ? (localH - 12) + 'p' : localH + 'a'));
        cell.title = `${formatTime(localH)}`;
        cell.addEventListener('click', () => {
          selectedBaseHour = h;
          render();
        });
        timeline.appendChild(cell);
      }

      const delBtn = card.querySelector('.del-city-btn');
      if (delBtn) {
        delBtn.addEventListener('click', () => {
          activeCities = activeCities.filter(c => c !== cName);
          render();
        });
      }

      citiesContainer.appendChild(card);
    });
  }

  addCitySelect.addEventListener('change', () => {
    const val = addCitySelect.value;
    if (val && !activeCities.includes(val)) {
      activeCities.push(val);
      addCitySelect.value = '';
      render();
    }
  });

  btnCopyInvite.addEventListener('click', () => {
    const baseCity = activeCities[0];
    const baseOffset = cityDatabase[baseCity].offset;

    let text = `📅 Proposed Meeting Times:\n`;
    activeCities.forEach(cName => {
      const data = cityDatabase[cName];
      const offsetDiff = data.offset - baseOffset;
      let targetHour = Math.floor(selectedBaseHour + offsetDiff);
      let dayShift = '';
      if (targetHour >= 24) { targetHour %= 24; dayShift = ' (+1 Day)'; }
      else if (targetHour < 0) { targetHour = (targetHour + 24) % 24; dayShift = ' (-1 Day)'; }

      text += `• ${data.label}: ${formatTime(targetHour)}${dayShift}\n`;
    });
    text += `Generated with AllToolsInOne (https://alltoolsinone.com/tools/time-zone-converter.html)`;

    navigator.clipboard.writeText(text).then(() => {
      if (window.showToast) window.showToast('Meeting invite copied!', 'success');
      else alert('Meeting invite copied!');
    });
  });

  render();
});
