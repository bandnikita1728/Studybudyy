// Global variables
let goals = JSON.parse(localStorage.getItem('studyBuddyGoals') || '[]');
let waterGlasses = parseInt(localStorage.getItem('studyBuddyWaterGlasses') || '0');
let lastWaterReminder = parseInt(localStorage.getItem('studyBuddyLastWaterReminder') || '0');
let alarms = JSON.parse(localStorage.getItem('studyBuddyAlarms') || '[]');

// Navigation Functions
window.navigateTo = function(sectionId) {
    console.log('Navigating to section:', sectionId); // Log the section being navigated to
    console.log('Selected section:', document.getElementById(sectionId)); // Log the selected section
    console.log('Navigation links:', document.querySelectorAll('.nav-link')); // Log the navigation links
    
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        console.log('Hiding section:', section); // Log the section being hidden
        section.classList.remove('active');
    });
    
    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        console.log('Showing section:', selectedSection); // Log the section being shown
        selectedSection.classList.add('active');
        // Update active state in navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            console.log('Updating navigation link:', link); // Log the navigation link being updated
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                console.log('Activating navigation link:', link); // Log the navigation link being activated
                link.classList.add('active');
            }
        });
    } else {
        console.log('Section not found:', sectionId); // Log if the section is not found
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

// Enhanced AI Assistant with Natural Language Processing
const aiResponses = {
    study_tips: [
        {
            text: "Try the Pomodoro Technique: 25 minutes of focused study followed by a 5-minute break.",
            followUp: "Would you like me to set up a Pomodoro timer for you?"
        },
        {
            text: "Create mind maps to visualize complex topics and their relationships.",
            followUp: "I can help you organize your thoughts into a structured format."
        },
        {
            text: "Use active recall by testing yourself instead of just re-reading materials.",
            followUp: "Would you like to create some practice questions?"
        },
        {
            text: "Take regular breaks to maintain focus and productivity.",
            followUp: "I can remind you to take breaks at optimal intervals."
        }
    ],
    motivation: [
        {
            text: "Remember why you started this journey! Every step counts.",
            followUp: "What inspired you to start studying this subject?"
        },
        {
            text: "You've already made progress! Let's build on that momentum.",
            followUp: "Would you like to review your recent achievements?"
        },
        {
            text: "Success is built on daily habits and consistent effort.",
            followUp: "Shall we set up some daily study goals?"
        },
        {
            text: "Visualize your success and the benefits of mastering this material.",
            followUp: "What's your main goal for this study session?"
        }
    ],
    time_management: [
        {
            text: "Break large tasks into smaller, manageable chunks.",
            followUp: "Let me help you break down your current task."
        },
        {
            text: "Prioritize tasks based on importance and deadlines.",
            followUp: "Would you like to create a prioritized task list?"
        },
        {
            text: "Use time-blocking to allocate specific periods for different subjects.",
            followUp: "I can help you create a study schedule."
        },
        {
            text: "Start with the most challenging task when your energy is highest.",
            followUp: "When do you feel most productive during the day?"
        }
    ],
    subject_specific: {
        math: [
            "Practice solving problems step by step",
            "Focus on understanding concepts rather than memorizing formulas",
            "Work through example problems before attempting exercises"
        ],
        science: [
            "Connect theoretical concepts to real-world applications",
            "Create visual representations of processes and systems",
            "Review fundamental principles before advanced topics"
        ],
        language: [
            "Immerse yourself in the language through media and practice",
            "Focus on common phrases and practical usage",
            "Practice speaking and writing regularly"
        ]
    }
};

function getAIResponse(query) {
    query = query.toLowerCase();
    let response = {
        text: "",
        followUp: "",
        suggestions: []
    };

    // Analyze query intent
    const intents = {
        study: query.match(/study|learn|remember|understand|focus|concentrate/g),
        motivation: query.match(/motivate|tired|give up|hard|difficult|stuck/g),
        time: query.match(/time|schedule|plan|organize|when|how long/g),
        subject: query.match(/math|science|language|physics|chemistry|biology|english/g)
    };

    // Determine primary intent
    let primaryIntent = Object.entries(intents)
        .filter(([, matches]) => matches)
        .sort((a, b) => (b[1] ? b[1].length : 0) - (a[1] ? a[1].length : 0))[0];

    if (!primaryIntent) {
        // Default response for unclear queries
        response.text = "I'm your AI study assistant! I can help with:";
        response.suggestions = [
            "Study techniques and focus",
            "Motivation and encouragement",
            "Time management",
            "Subject-specific tips"
        ];
        return response;
    }

    // Get relevant response based on intent
    switch (primaryIntent[0]) {
        case 'study':
            const studyTip = aiResponses.study_tips[Math.floor(Math.random() * aiResponses.study_tips.length)];
            response.text = studyTip.text;
            response.followUp = studyTip.followUp;
            response.suggestions = [
                "Set up a study timer",
                "Create study notes",
                "Take a practice quiz"
            ];
            break;

        case 'motivation':
            const motivationTip = aiResponses.motivation[Math.floor(Math.random() * aiResponses.motivation.length)];
            response.text = motivationTip.text;
            response.followUp = motivationTip.followUp;
            response.suggestions = [
                "View your progress",
                "Set a new goal",
                "Take a short break"
            ];
            break;

        case 'time':
            const timeTip = aiResponses.time_management[Math.floor(Math.random() * aiResponses.time_management.length)];
            response.text = timeTip.text;
            response.followUp = timeTip.followUp;
            response.suggestions = [
                "Create a schedule",
                "Set reminders",
                "Track study time"
            ];
            break;

        case 'subject':
            const subject = query.match(/math|science|language/)[0];
            const subjectTips = aiResponses.subject_specific[subject];
            response.text = subjectTips[Math.floor(Math.random() * subjectTips.length)];
            response.followUp = "Would you like more specific tips for " + subject + "?";
            response.suggestions = [
                `More ${subject} tips`,
                "Practice exercises",
                "Study resources"
            ];
            break;
    }

    return response;
}

// Enhanced chat interface
function addMessage(text, isUser = false, suggestions = []) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'} mb-2`;
    
    let messageContent = `
        <div class="message-content p-2 rounded">
            <strong>${isUser ? 'You' : 'Study Buddy'}:</strong> ${text}
        </div>
    `;

    if (!isUser && suggestions.length > 0) {
        messageContent += `
            <div class="suggestions mt-2">
                ${suggestions.map(suggestion => `
                    <button class="btn btn-sm btn-outline-primary me-2 mb-2 suggestion-btn">
                        ${suggestion}
                    </button>
                `).join('')}
            </div>
        `;
    }

    messageDiv.innerHTML = messageContent;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Add click handlers for suggestion buttons
    if (!isUser) {
        messageDiv.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                aiQueryInput.value = btn.textContent;
                askAIBtn.click();
            });
        });
    }
}

// Enhanced AI interaction
document.addEventListener('DOMContentLoaded', () => {
    const askAIBtn = document.getElementById('askAI');
    const aiQueryInput = document.getElementById('aiQuery');
    const chatContainer = document.createElement('div');
    chatContainer.id = 'chatContainer';
    chatContainer.className = 'chat-container';
    document.querySelector('.ai-card .card-body').appendChild(chatContainer);

    if (askAIBtn && aiQueryInput) {
        askAIBtn.addEventListener('click', () => {
            const query = aiQueryInput.value.trim();
            if (!query) return;

            // Add user message
            addMessage(query, true);

            // Get AI response
            const response = getAIResponse(query);
            
            // Add AI response with suggestions
            addMessage(response.text, false, response.suggestions);
            
            // Clear input
            aiQueryInput.value = '';
        });

        // Allow pressing Enter to send message
        aiQueryInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                askAIBtn.click();
            }
        });
    }
});

// Theme switching functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeButtons = document.querySelectorAll('.theme-btn');
    
    // Load saved theme
    const savedTheme = localStorage.getItem('studyBuddyTheme') || 'default';
    toggleTheme(savedTheme);

    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');
            toggleTheme(theme);
        });
    });
});

// Navigation event listeners
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            if (sectionId) {
                navigateTo(sectionId);
            }
        });
    });

    // Set initial active section
    const defaultSection = 'dashboard';
    navigateTo(defaultSection);
});

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
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
