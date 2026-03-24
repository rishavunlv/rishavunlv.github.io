(function(){
  // Navigation toggle for small screens
  const navToggle = document.querySelectorAll('.nav-toggle');
  navToggle.forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      document.body.classList.toggle('nav-open');
    });
  });

  // DOM elements
  const sectorSelect = document.getElementById('sectorSelect');
  const assetInput = document.getElementById('assetInput');
  const revenueInput = document.getElementById('revenueInput');
  const efSlider = document.getElementById('efSlider');
  const efValue = document.getElementById('efValue');
  const aroDisplay = document.getElementById('aroDisplay');
  const strategySelect = document.getElementById('strategySelect');
  const mfaCheckbox = document.getElementById('mfaCheckbox');
  const phishCheckbox = document.getElementById('phishCheckbox');
  const successionCheckbox = document.getElementById('successionCheckbox');
  const includeDrCost = document.getElementById('includeDrCost');
  const computeBtn = document.getElementById('computeBtn');
  const exportBtn = document.getElementById('exportBtn');

  const alePreEl = document.getElementById('alePre');
  const alePostEl = document.getElementById('alePost');
  const rosiVal = document.getElementById('rosiVal');
  const moneySavedEl = document.getElementById('moneySaved');
  const reportContent = document.getElementById('reportContent');
  const chartCanvas = document.getElementById('aleChart');

  function populateSelects(){
    Object.keys(window.SECTOR_DATA).forEach(s=>{
      const opt = document.createElement('option'); opt.value = s; opt.textContent = s; sectorSelect.appendChild(opt);
    });
    Object.keys(window.DR_STRATEGIES).forEach(s=>{
      const opt = document.createElement('option'); opt.value = s; opt.textContent = s; strategySelect.appendChild(opt);
    });
    // populate ARO display for initial selection
    const initial = sectorSelect.value || Object.keys(window.SECTOR_DATA)[0];
    if(window.SECTOR_DATA[initial]) {
      aroDisplay.value = window.SECTOR_DATA[initial].ARO;
    }
    // update ARO when sector changes
    sectorSelect.addEventListener('change', ()=>{
      const s = sectorSelect.value;
      aroDisplay.value = window.SECTOR_DATA[s] ? window.SECTOR_DATA[s].ARO : '';
    });
  }

  efSlider.addEventListener('input', ()=> efValue.textContent = efSlider.value);

  let chart=null;
  function renderChart(pre, post){
    const data = { labels: ['ALE Pre','ALE Post'], datasets:[{label:'Value', data:[pre, post], backgroundColor:['rgba(255,255,255,0.12)','rgba(10,138,10,0.6)'] }] };
    if(chart) { chart.data = data; chart.update(); return; }
    chart = new Chart(chartCanvas.getContext('2d'), { type:'bar', data:data, options:{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}} });
  }

  function computeAll(){
    const sector = sectorSelect.value || Object.keys(window.SECTOR_DATA)[0];
    const asset = parseFloat(assetInput.value) || 0;
    const ef = parseFloat(efSlider.value) || 0;
    const revenueRaw = revenueInput && revenueInput.value ? parseFloat(revenueInput.value) : NaN;
    const strategy = strategySelect.value || Object.keys(window.DR_STRATEGIES)[0];
    const mfa = mfaCheckbox.checked;
    const phish = phishCheckbox.checked;
    const succession = successionCheckbox.checked;
  // loss magnitude: use Revenue if provided else sector AvgBreachCost (matches Python CLI logic)
  const sectorAvg = window.SECTOR_DATA[sector] ? window.SECTOR_DATA[sector].AvgBreachCost : 0;
  const lossMagnitude = (!isNaN(revenueRaw) && revenueRaw > 0) ? revenueRaw : sectorAvg;

  const ale_pre = window.computeALEPre(sector, lossMagnitude, ef);
  const ale_post = window.computeALEPost(sector, lossMagnitude, ef, {mfa, phish});
    const downtime_cold = window.computeDowntimeLoss(sector, 'Cold Site', false);
    const downtime_selected = window.computeDowntimeLoss(sector, strategy, succession);
    const money_saved = Math.max(0, downtime_cold - downtime_selected);

    // expected annual breach cost: use Revenue if provided, otherwise use sector AvgBreachCost
  const avgBreach = sectorAvg;
  const aroForExpected = window.SECTOR_DATA[sector] ? window.SECTOR_DATA[sector].ARO : 0;
  const expectedBreach = window.computeExpectedAnnualBreachCost(avgBreach, aroForExpected);

    let cost_controls = (window.DR_STRATEGIES[strategy] ? window.DR_STRATEGIES[strategy].annual_cost : 0);
    if(mfa) cost_controls += window.CONTROL_COSTS.mfa || 0;
    if(phish) cost_controls += window.CONTROL_COSTS.phish || 0;
    if(succession) cost_controls += window.CONTROL_COSTS.succession || 0;

    const rosi_cost_basis = includeDrCost.checked ? cost_controls : (cost_controls - (window.DR_STRATEGIES[strategy] ? window.DR_STRATEGIES[strategy].annual_cost : 0));
    const rosi = window.computeROSI(ale_pre, ale_post, money_saved, rosi_cost_basis);

    // update UI
    alePreEl.textContent = window.formatCurrency(ale_pre);
    alePostEl.textContent = window.formatCurrency(ale_post);
    rosiVal.textContent = (rosi===Infinity)?'inf':( (rosi*100).toFixed(1)+'%');
    moneySavedEl.textContent = window.formatCurrency(money_saved);

    // report content
    // Sector and results detail
    const downtimePerHour = window.SECTOR_DATA[sector] ? window.SECTOR_DATA[sector].DowntimeCostPerHour : 0;
    const strategyInfo = window.DR_STRATEGIES[strategy] || { recovery_time_hours: 0, annual_cost: 0 };
    reportContent.innerHTML = `
      <h4>Inputs</h4>
      <p><strong>Sector</strong>: ${sector}</p>
      <p><strong>Asset value</strong>: ${window.formatCurrency(asset)}</p>
      <p><strong>Exposure Factor (EF)</strong>: ${ef}%</p>
      <p><strong>Annualized Rate of Occurrence (ARO)</strong>: ${aroDisplay.value} (per year)</p>
      <p><strong>Sector Avg. Breach Cost</strong>: ${window.formatCurrency(avgBreach)}</p>
      <p><strong>Sector Downtime Cost / hour</strong>: ${window.formatCurrency(downtimePerHour)}</p>

      <h4>Results</h4>
      <p><strong>Single Loss Expectancy (SLE)</strong>: ${window.formatCurrency(window.computeSLE(asset, ef))} (asset * EF)</p>
      <p><strong>Annual Loss Expectancy (ALE) — Inherent</strong>: ${window.formatCurrency(ale_pre)}</p>
      <p><strong>Annual Loss Expectancy (ALE) — Residual</strong>: ${window.formatCurrency(ale_post)}</p>
      <p><strong>Expected Annual Breach Cost (AvgBreachCost * ARO)</strong>: ${window.formatCurrency(expectedBreach)}</p>
      <p><strong>Selected BCDR</strong>: ${strategy} (recovery: ${strategyInfo.recovery_time_hours} hours, cost: ${window.formatCurrency(strategyInfo.annual_cost)})</p>
      <p><strong>Downtime loss — Cold Site (baseline)</strong>: ${window.formatCurrency(downtime_cold)}</p>
      <p><strong>Downtime loss — Selected strategy</strong>: ${window.formatCurrency(downtime_selected)}</p>
      <p><strong>Money saved by BCDR</strong>: ${window.formatCurrency(money_saved)}</p>
      <p><strong>Cost of controls (DR + selected controls)</strong>: ${window.formatCurrency(cost_controls)}</p>
      <p><strong>ROSI</strong>: ${(rosi===Infinity)?'inf':((rosi*100).toFixed(1)+'%')}</p>
    `;

    renderChart(ale_pre, ale_post);
  }

  computeBtn.addEventListener('click', computeAll);

  exportBtn.addEventListener('click', ()=>{
    // generate a PDF of the report card and chart
    const opt = {
      margin:       0.4,
      filename:     `smallbiz_report_${new Date().toISOString().replace(/[:.]/g,'')}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    const element = document.getElementById('reportCard');
    // include metrics and chart in the export by cloning a small wrapper
    const wrapper = element.cloneNode(true);
    wrapper.style.background = '#071a3a'; wrapper.style.color='#fff'; wrapper.style.padding='20px';
    document.body.appendChild(wrapper);
    html2pdf().set(opt).from(wrapper).save().then(()=> wrapper.remove());
  });

  // init
  populateSelects();
  // set defaults
  efValue.textContent = efSlider.value;
  // initial compute
  computeAll();
})();
