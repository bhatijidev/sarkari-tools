// Mock & Fake Data Generator
document.addEventListener('DOMContentLoaded', () => {
  const localeSelect = document.getElementById('localeSelect');
  const recordCount = document.getElementById('recordCount');
  const chkAddress = document.getElementById('chkAddress');
  const chkPhone = document.getElementById('chkPhone');
  const chkCompany = document.getElementById('chkCompany');
  const chkCard = document.getElementById('chkCard');
  const btnGenerate = document.getElementById('btnGenerate');

  const tabTable = document.getElementById('tabTable');
  const tabJson = document.getElementById('tabJson');
  const tabCsv = document.getElementById('tabCsv');
  const btnCopyData = document.getElementById('btnCopyData');
  const btnDownloadData = document.getElementById('btnDownloadData');

  const tableViewWrap = document.getElementById('tableViewWrap');
  const tableHeadRow = document.getElementById('tableHeadRow');
  const tableBody = document.getElementById('tableBody');
  const codeViewArea = document.getElementById('codeViewArea');

  let currentView = 'table';
  let generatedRecords = [];

  const datasets = {
    firstNames: ['James', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'William', 'Mia', 'Lucas', 'Charlotte', 'Benjamin', 'Amelia'],
    lastNames: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas'],
    companies: ['Apex Technologies', 'Nexus Health', 'Starlight Logistics', 'BluePeak Capital', 'Summit Media', 'Quantum Labs', 'Vanguard Retail', 'Horizon Software'],
    jobs: ['Software Engineer', 'Product Manager', 'Data Analyst', 'UX Designer', 'Marketing Director', 'Sales Account Executive', 'DevOps Specialist'],
    usCities: [
      { city: 'Austin', state: 'TX', zip: '78701' },
      { city: 'Seattle', state: 'WA', zip: '98101' },
      { city: 'Denver', state: 'CO', zip: '80202' },
      { city: 'Boston', state: 'MA', zip: '02108' },
      { city: 'Atlanta', state: 'GA', zip: '30303' },
      { city: 'Chicago', state: 'IL', zip: '60601' }
    ],
    ukCities: [
      { city: 'London', state: 'Greater London', zip: 'EC1A 1BB' },
      { city: 'Manchester', state: 'Greater Manchester', zip: 'M1 1AD' },
      { city: 'Birmingham', state: 'West Midlands', zip: 'B1 1AA' },
      { city: 'Edinburgh', state: 'Midlothian', zip: 'EH1 1YZ' }
    ]
  };

  function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function generate() {
    const count = parseInt(recordCount.value) || 10;
    const loc = localeSelect.value;
    const cities = loc === 'uk' ? datasets.ukCities : datasets.usCities;

    generatedRecords = [];

    for (let i = 1; i <= count; i++) {
      const fn = rand(datasets.firstNames);
      const ln = rand(datasets.lastNames);
      const domain = rand(['example.com', 'testmail.org', 'demoqa.net']);
      const email = `${fn.toLowerCase()}.${ln.toLowerCase()}@${domain}`;

      const c = rand(cities);
      const stNum = Math.floor(Math.random() * 899) + 100;
      const street = `${stNum} ${rand(['Main St', 'Oak Ave', 'Maple Rd', 'Pine Blvd', 'Cedar Ln'])}`;

      let phone = '';
      if (loc === 'uk') {
        phone = `+44 7${Math.floor(Math.random() * 899999999 + 100000000)}`;
      } else {
        phone = `+1 (${Math.floor(Math.random() * 800 + 200)}) 555-${Math.floor(Math.random() * 8999 + 1000)}`;
      }

      const rec = {
        id: i,
        name: `${fn} ${ln}`,
        email: email
      };

      if (chkPhone.checked) rec.phone = phone;
      if (chkAddress.checked) {
        rec.address = `${street}, ${c.city}, ${c.state} ${c.zip}`;
      }
      if (chkCompany.checked) {
        rec.company = rand(datasets.companies);
        rec.jobTitle = rand(datasets.jobs);
      }
      if (chkCard.checked) {
        rec.dummyCard = `4111-2222-3333-${Math.floor(Math.random() * 8999 + 1000)} (Test Only)`;
      }

      generatedRecords.push(rec);
    }

    renderOutput();
  }

  function renderOutput() {
    if (generatedRecords.length === 0) return;

    // 1. Table View
    const keys = Object.keys(generatedRecords[0]);
    tableHeadRow.innerHTML = keys.map(k => `<th style="padding:8px 10px; border-bottom:1px solid #e2e8f0; text-align:left; text-transform:capitalize;">${k}</th>`).join('');
    tableBody.innerHTML = generatedRecords.map(r => `
      <tr>
        ${keys.map(k => `<td style="padding:6px 10px; border-bottom:1px solid #e2e8f0;">${r[k]}</td>`).join('')}
      </tr>
    `).join('');

    // 2. Code View
    if (currentView === 'json') {
      codeViewArea.value = JSON.stringify(generatedRecords, null, 2);
    } else if (currentView === 'csv') {
      const csvRows = [];
      csvRows.push(keys.join(','));
      generatedRecords.forEach(r => {
        csvRows.push(keys.map(k => `"${(r[k] || '').toString().replace(/"/g, '""')}"`).join(','));
      });
      codeViewArea.value = csvRows.join('\n');
    }
  }

  function switchTab(view) {
    currentView = view;
    [tabTable, tabJson, tabCsv].forEach(b => {
      b.className = 'btn btn-sm btn-outline';
    });
    if (view === 'table') {
      tabTable.className = 'btn btn-sm btn-primary';
      tableViewWrap.style.display = 'block';
      codeViewArea.style.display = 'none';
    } else if (view === 'json') {
      tabJson.className = 'btn btn-sm btn-primary';
      tableViewWrap.style.display = 'none';
      codeViewArea.style.display = 'block';
    } else if (view === 'csv') {
      tabCsv.className = 'btn btn-sm btn-primary';
      tableViewWrap.style.display = 'none';
      codeViewArea.style.display = 'block';
    }
    renderOutput();
  }

  tabTable.addEventListener('click', () => switchTab('table'));
  tabJson.addEventListener('click', () => switchTab('json'));
  tabCsv.addEventListener('click', () => switchTab('csv'));

  btnGenerate.addEventListener('click', generate);

  btnCopyData.addEventListener('click', () => {
    let text = '';
    if (currentView === 'table' || currentView === 'json') {
      text = JSON.stringify(generatedRecords, null, 2);
    } else {
      text = codeViewArea.value;
    }
    navigator.clipboard.writeText(text).then(() => {
      if (window.showToast) window.showToast('Data copied to clipboard!', 'success');
      else alert('Data copied to clipboard!');
    });
  });

  btnDownloadData.addEventListener('click', () => {
    const isCsv = currentView === 'csv';
    const content = isCsv ? codeViewArea.value : JSON.stringify(generatedRecords, null, 2);
    const blob = new Blob([content], { type: isCsv ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mock_data_${Date.now()}.${isCsv ? 'csv' : 'json'}`;
    a.click();
    URL.revokeObjectURL(url);
  });

  generate();
});
