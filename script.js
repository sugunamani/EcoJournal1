// document.addEventListener('DOMContentLoaded', () => {
//     const navLinks = document.getElementById('nav-links');
//     const guestView = document.getElementById('guest-view');
//     const welcomeSection = document.getElementById('welcome-section');
//     const userGreeting = document.getElementById('user-greeting');

//     function updatePage() {
//         const user = localStorage.getItem('loggedInUser');

//          // script.js kulla user login-ana block
// if (user) {
//     navLinks.innerHTML = `
//         <li><a href="index.html">Home</a></li>
//         <li><a href="journal.html">Journal</a></li>
//         <li><a href="stats.html">Stats</a></li> 
//         <li><a href="#" id="logout" class="logout-btn">Logout</a></li>
//     `;
//     // ... matha dashboard code ...
// }




function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  event.target.closest('.nav-btn').classList.add('active');
}

const dailyData = { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], data: [5.2,4.8,6.1,3.9,4.2,7.3,3.1] };
const weeklyData = { labels: ['Wk1','Wk2','Wk3','Wk4'], data: [32,28,35,25] };
const monthlyData = { labels: ['Jan','Feb','Mar','Apr','May'], data: [145,132,158,121,138] };
let chartData = dailyData;
let trendChart;

function buildChart() {
  const ctx = document.getElementById('trendChart');
  if (!ctx) return;
  if (trendChart) trendChart.destroy();
  trendChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: chartData.labels,
      datasets: [{
        label: 'CO₂ (kg)',
        data: chartData.data,
        backgroundColor: chartData.data.map(v => v > 6 ? '#D85A30' : v > 4 ? '#EF9F27' : '#639922'),
        borderRadius: 4
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11 } } },
        x: { grid: { display: false }, ticks: { font: { size: 11 } } }
      }
    }
  });
}

function setWeekView(btn, view) {
  document.querySelectorAll('.week-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  chartData = view === 'daily' ? dailyData : view === 'weekly' ? weeklyData : monthlyData;
  buildChart();
}

const logEntries = [];
const factors = { car: 0.14, bus: 0.05, flight: 0.19, bike: 0 };
let todayCO2 = 4.7;

function addEntry() {
  const cat = document.getElementById('logCat').value;
  const act = document.getElementById('logActivity').value;
  const amt = parseFloat(document.getElementById('logAmount').value) || 0;
  const unit = document.getElementById('logUnit').value;
  const co2 = (factors[act] || 0.1) * amt;
  todayCO2 += co2;
  document.getElementById('todayCO2').textContent = todayCO2.toFixed(1);

  const entry = document.createElement('div');
  entry.className = 'log-entry';
  const catClass = { travel: 'cat-travel', food: 'cat-food', energy: 'cat-energy', waste: 'cat-waste' }[cat] || 'cat-travel';
  const catLabel = cat.charAt(0).toUpperCase() + cat.slice(1);
  entry.innerHTML = `<div class="log-entry-left"><span class="log-cat ${catClass}">${catLabel}</span><span>${act} — ${amt} ${unit}</span></div><span class="log-co2">${co2.toFixed(2)} kg</span>`;
  document.getElementById('logEntries').prepend(entry);
  document.getElementById('logAmount').value = '';
}

function calcElec() {
  const bill = parseFloat(document.getElementById('elecBill').value) || 0;
  const units = (bill / 8).toFixed(1);
  const co2 = (units * 0.82).toFixed(2);
  const box = document.getElementById('elecResult');
  box.style.display = 'block';
  box.textContent = `Estimated usage: ~${units} kWh → ~${co2} kg CO₂ this month`;
}

function addGoal() {
  const t = document.getElementById('goalText').value;
  if (!t) return;
  document.getElementById('goalText').value = '';
  alert('Goal added: ' + t);
}

setTimeout(() => buildChart(), 300);