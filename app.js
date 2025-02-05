// Global variables
let goals = JSON.parse(localStorage.getItem('studyBuddyGoals') || '[]');
let waterGlasses = parseInt(localStorage.getItem('studyBuddyWaterGlasses') || '0');
let lastWaterReminder = parseInt(localStorage.getItem('studyBuddyLastWaterReminder') || '0');
let alarms = JSON.parse(localStorage.getItem('studyBuddyAlarms') || '[]');

// Navigation Functions
window.navigateTo = function(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
        // Update active state in navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });
    }
};

window.toggleSidebar = function() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    if (sidebar && mainContent) {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    }
};

window.toggleTheme = function(theme) {
    document.body.className = theme;
    localStorage.setItem('studyBuddyTheme', theme);
    // Update active state of theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-theme') === theme) {
            btn.classList.add('active');
        }
    });
};

// Goals Functions
window.addGoal = function(text) {
    const goal = {
        id: Date.now(),
        text,
        completed: false
    };
    goals.push(goal);
    saveGoals();
    renderGoals();
    showNotification('New goal added! 🎯', 'success');
};

window.toggleGoal = function(id) {
    const goal = goals.find(g => g.id === parseInt(id));
    if (goal) {
        goal.completed = !goal.completed;
        if (goal.completed) {
            showCelebration();
            showNotification('Goal completed! 🎉', 'success');
        }
        saveGoals();
        renderGoals();
    }
};

window.deleteGoal = function(id) {
    goals = goals.filter(g => g.id !== parseInt(id));
    saveGoals();
    renderGoals();
    showNotification('Goal deleted', 'info');
};

function saveGoals() {
    localStorage.setItem('studyBuddyGoals', JSON.stringify(goals));
}

function renderGoals() {
    const container = document.getElementById('goalsList');
    if (!container) return;

    container.innerHTML = goals.map(goal => `
        <div class="goal-item" data-id="${goal.id}">
            <div class="goal-checkbox ${goal.completed ? 'checked' : ''}" onclick="window.toggleGoal(${goal.id})">
                ${goal.completed ? '<i class="bi bi-check"></i>' : ''}
            </div>
            <div class="goal-text ${goal.completed ? 'text-muted' : ''}">${goal.text}</div>
            <button class="btn btn-sm btn-outline-danger" onclick="window.deleteGoal(${goal.id})">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `).join('');
}

// Water Functions
window.logWater = function() {
    if (waterGlasses < 8) {
        waterGlasses++;
        localStorage.setItem('studyBuddyWaterGlasses', waterGlasses);
        updateWaterUI();
        showNotification('Great job staying hydrated! 💧', 'success');
        if (waterGlasses === 8) {
            showCelebration();
            showNotification('Daily water goal achieved! 🌊', 'success');
        }
    }
};

function updateWaterUI() {
    const glassCount = document.getElementById('glassCount');
    const waterWave = document.getElementById('waterWave');
    const waterProgress = document.getElementById('waterProgress');
    const waterStatus = document.getElementById('waterStatus');
    
    if (glassCount) glassCount.textContent = waterGlasses;
    if (waterWave) waterWave.style.height = `${(waterGlasses / 8) * 100}%`;
    if (waterProgress) waterProgress.style.width = `${(waterGlasses / 8) * 100}%`;
    if (waterStatus) waterStatus.textContent = `${waterGlasses}/8 glasses`;
}

function checkWaterReminder() {
    const now = Date.now();
    const thirtyMinutes = 30 * 60 * 1000;
    
    if (now - lastWaterReminder >= thirtyMinutes && waterGlasses < 8) {
        showNotification('Time to drink water! 💧', 'info');
        lastWaterReminder = now;
        localStorage.setItem('studyBuddyLastWaterReminder', now);
    }
}

// Alarm Functions
window.addAlarm = function(time, label = 'Study Session') {
    const alarm = {
        id: Date.now(),
        time,
        label,
        active: true
    };
    alarms.push(alarm);
    saveAlarms();
    renderAlarms();
    showNotification(`Alarm set for ${time}! ⏰`, 'success');
};

window.toggleAlarm = function(id) {
    const alarm = alarms.find(a => a.id === parseInt(id));
    if (alarm) {
        alarm.active = !alarm.active;
        saveAlarms();
        renderAlarms();
        showNotification(
            alarm.active ? 'Alarm activated! ⏰' : 'Alarm deactivated ⏰',
            alarm.active ? 'success' : 'info'
        );
    }
};

window.deleteAlarm = function(id) {
    alarms = alarms.filter(a => a.id !== parseInt(id));
    saveAlarms();
    renderAlarms();
    showNotification('Alarm deleted! ⏰', 'info');
};

function saveAlarms() {
    localStorage.setItem('studyBuddyAlarms', JSON.stringify(alarms));
}

function renderAlarms() {
    const container = document.getElementById('alarmList');
    const sidebarContainer = document.getElementById('activeAlarms');
    
    if (container) {
        container.innerHTML = alarms.map(alarm => `
            <div class="alarm-item">
                <div class="alarm-info">
                    <div class="alarm-time">${alarm.time}</div>
                    <div class="alarm-label">${alarm.label}</div>
                </div>
                <div class="alarm-controls">
                    <button class="btn btn-sm ${alarm.active ? 'btn-primary' : 'btn-outline-primary'}"
                            onclick="window.toggleAlarm(${alarm.id})">
                        <i class="bi bi-${alarm.active ? 'bell-fill' : 'bell'}"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="window.deleteAlarm(${alarm.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    if (sidebarContainer) {
        sidebarContainer.innerHTML = alarms
            .filter(a => a.active)
            .map(alarm => `
                <div class="active-alarm-item">
                    <i class="bi bi-bell-fill"></i>
                    <span>${alarm.time}</span>
                </div>
            `).join('');
    }
}

function checkAlarms() {
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    
    alarms.forEach(alarm => {
        if (alarm.active && alarm.time === currentTime) {
            showNotification(`Time for ${alarm.label}! ⏰`, 'success');
            new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg').play().catch(() => {});
        }
    });
}

// Global functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} animated bounceIn`;
    
    let emoji = '✨';
    switch(type) {
        case 'success': emoji = '✅'; break;
        case 'warning': emoji = '⚠️'; break;
        case 'error': emoji = '❌'; break;
        case 'info': emoji = 'ℹ️'; break;
    }
    
    notification.innerHTML = `
        <div class="notification-icon">${emoji}</div>
        <div class="notification-message">${message}</div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.remove('bounceIn');
        notification.classList.add('bounceOut');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

function showCelebration() {
    const colors = ['#FF6B8B', '#4FC3F7', '#2C3E50'];
    const celebrationContainer = document.createElement('div');
    celebrationContainer.className = 'celebration-container';
    document.body.appendChild(celebrationContainer);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'celebration-particle';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.animationDuration = (Math.random() * 1 + 0.5) + 's';
        particle.style.animationDelay = (Math.random() * 0.2) + 's';
        celebrationContainer.appendChild(particle);
    }

    setTimeout(() => {
        celebrationContainer.remove();
    }, 3000);
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Set initial section
    const defaultSection = 'dashboard';
    window.navigateTo(defaultSection);
    
    // Set up navigation event listeners
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            const sectionId = e.currentTarget.getAttribute('data-section');
            if (sectionId) {
                window.navigateTo(sectionId);
            }
        });
    });
    
    // Initialize Goals
    renderGoals();
    
    // Initialize Water Tracking
    updateWaterUI();
    setInterval(checkWaterReminder, 60000); // Check every minute
    
    // Initialize Alarms
    renderAlarms();
    setInterval(checkAlarms, 30000); // Check every 30 seconds
    
    // Add Goal Button
    const addGoalBtn = document.getElementById('addGoalBtn');
    if (addGoalBtn) {
        addGoalBtn.addEventListener('click', () => {
            const text = prompt('Enter your goal:');
            if (text) window.addGoal(text);
        });
    }
    
    // Water Button
    const drinkWaterBtn = document.getElementById('drinkWaterBtn');
    if (drinkWaterBtn) {
        drinkWaterBtn.addEventListener('click', window.logWater);
    }
    
    // Add Alarm Button
    const addAlarmBtn = document.getElementById('addAlarmBtn');
    if (addAlarmBtn) {
        addAlarmBtn.addEventListener('click', () => {
            const time = prompt('Enter alarm time (HH:MM):');
            if (time) {
                const label = prompt('Enter alarm label:', 'Study Session');
                window.addAlarm(time, label || 'Study Session');
            }
        });
    }
    
    // Reset water count at midnight
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const timeToMidnight = midnight - new Date();
    
    setTimeout(() => {
        waterGlasses = 0;
        localStorage.setItem('studyBuddyWaterGlasses', '0');
        updateWaterUI();
        setInterval(() => {
            waterGlasses = 0;
            localStorage.setItem('studyBuddyWaterGlasses', '0');
            updateWaterUI();
        }, 24 * 60 * 60 * 1000);
    }, timeToMidnight);
});
