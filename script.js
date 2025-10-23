// Dummy data
let sensors = [
    { name: 'Temperature Sensor', status: true, lastUpdate: '2023-10-01 14:30:00' },
    { name: 'Motion Sensor', status: false, lastUpdate: '2023-10-01 14:25:00' },
    { name: 'Humidity Sensor', status: true, lastUpdate: '2023-10-01 14:20:00' },
    { name: 'Light Sensor', status: true, lastUpdate: '2023-10-01 14:15:00' }
];

let activityData = [5, 10, 8, 12, 15, 20, 18, 22, 25, 30, 28, 35, 40, 38, 45, 50, 48, 55, 60, 58, 65, 70, 68, 75]; // Simulated detections over 24 hours

let logs = [
    { time: '12:30', user: 'admin', action: 'Login', details: 'Accessed dashboard' },
    { time: '12:45', user: 'admin', action: 'Updated sensor status', details: 'Temperature sensor activated' },
    { time: '13:00', user: 'admin', action: 'Viewed logs', details: 'Checked recent activity' }
];

// Update current time
function updateTime() {
    const now = new Date();
    document.getElementById('currentTime').textContent = now.toLocaleTimeString();
}
setInterval(updateTime, 1000);
updateTime();

// Render sensor cards
function renderSensors() {
    const grid = document.getElementById('sensorGrid');
    grid.innerHTML = '';
    sensors.forEach(sensor => {
        const card = document.createElement('div');
        card.className = 'sensor-card';
        card.innerHTML = `
            <h3>${sensor.name}</h3>
            <div class="status">
                <span class="${sensor.status ? 'active' : 'off'}">${sensor.status ? '🟢 Active' : '🔴 Off'}</span>
            </div>
            <p class="last-update">Last update: ${sensor.lastUpdate}</p>
        `;
        grid.appendChild(card);
    });
}

// Custom line chart on Canvas
function drawChart() {
    const canvas = document.getElementById('activityChart');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const maxVal = Math.max(...activityData);
    const minVal = Math.min(...activityData);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw axes
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw grid lines
    ctx.strokeStyle = '#f0f0f0';
    for (let i = 0; i <= 5; i++) {
        const y = padding + (height - 2 * padding) * (i / 5);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }

    // Draw line
    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    activityData.forEach((val, i) => {
        const x = padding + (width - 2 * padding) * (i / (activityData.length - 1));
        const y = height - padding - ((val - minVal) / (maxVal - minVal)) * (height - 2 * padding);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Poppins';
    ctx.fillText('Detections', 10, 20);
    ctx.fillText('Hours', width - 50, height - 10);
}

// Render logs table
function renderLogs() {
    const tbody = document.getElementById('logsBody');
    tbody.innerHTML = '';
    logs.forEach(log => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${log.time}</td>
            <td>${log.user}</td>
            <td>${log.action}</td>
            <td>${log.details}</td>
        `;
        tbody.appendChild(row);
    });
}

// Clear logs
document.getElementById('clearLogsBtn').addEventListener('click', () => {
    logs = [];
    renderLogs();
});

// Simulate data updates
function updateData() {
    // Update sensor statuses randomly
    sensors.forEach(sensor => {
        sensor.status = Math.random() > 0.5;
        sensor.lastUpdate = new Date().toISOString().replace('T', ' ').substring(0, 19);
    });

    // Update activity data (add new random value, keep last 24)
    activityData.push(Math.floor(Math.random() * 100));
    if (activityData.length > 24) activityData.shift();

    // Add a new log entry occasionally
    if (Math.random() > 0.7) {
        const actions = ['Login', 'Updated sensor', 'Viewed chart', 'Cleared logs'];
        const details = ['Accessed dashboard', 'Sensor status changed', 'Checked activity', 'Logs cleared'];
        logs.unshift({
            time: new Date().toLocaleTimeString(),
            user: 'admin',
            action: actions[Math.floor(Math.random() * actions.length)],
            details: details[Math.floor(Math.random() * details.length)]
        });
        if (logs.length > 10) logs.pop(); // Keep only 10 logs
    }

    // Re-render everything
    renderSensors();
    drawChart();
    renderLogs();
}

// Initial render
renderSensors();
drawChart();
renderLogs();

// Auto-update every 30 seconds
setInterval(updateData, 30000);

// Mobile sidebar toggle
document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
});
