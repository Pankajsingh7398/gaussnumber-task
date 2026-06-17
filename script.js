/**
 * NEON GUESS - PROTOCOL CORE
 * Logic for the interactive number guessing game
 */

const GAME_STATE = {
    targetNumber: null,
    attemptsRemaining: 0,
    maxAttempts: 0,
    difficulty: 'medium',
    timer: 60,
    timerInterval: null,
    isPlaying: false,
    hintsUsed: 0,
    guessHistory: [],
    isMuted: false
};

const LEADERBOARD_KEY = 'neon_guess_leaderboard';
const DEFAULT_LEADERBOARD = [
    { name: "QUANTUM_VOID", score: 2450, level: 42 },
    { name: "ZERO_ONE", score: 1820, level: 31 },
    { name: "CYBER_FOX", score: 1550, level: 25 },
    { name: "NOX_STALKER", score: 1200, level: 18 }
];

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadLeaderboard();
    
    // Enter key shortcut for guessing
    document.getElementById('guessInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleGuess();
    });

    // Volume Toggle
    document.getElementById('toggleAudio').addEventListener('click', () => {
        GAME_STATE.isMuted = !GAME_STATE.isMuted;
        const icon = document.getElementById('toggleAudio').querySelector('span');
        icon.textContent = GAME_STATE.isMuted ? 'volume_off' : 'volume_up';
        icon.setAttribute('data-icon', GAME_STATE.isMuted ? 'volume_off' : 'volume_up');
    });
});

/**
 * Starts a new game session
 * @param {string} difficulty - 'easy', 'medium', 'hard'
 */
function startGame(difficulty) {
    GAME_STATE.difficulty = difficulty;
    GAME_STATE.targetNumber = Math.floor(Math.random() * 100) + 1;
    GAME_STATE.isPlaying = true;
    GAME_STATE.hintsUsed = 0;
    GAME_STATE.guessHistory = [];
    GAME_STATE.timer = 60;
    
    const settings = {
        easy: { attempts: 10, baseXP: 100 },
        medium: { attempts: 7, baseXP: 300 },
        hard: { attempts: 5, baseXP: 1000 }
    };

    GAME_STATE.attemptsRemaining = settings[difficulty].attempts;
    GAME_STATE.maxAttempts = settings[difficulty].attempts;

    // UI Transitions
    document.getElementById('setupView').classList.add('hidden');
    document.getElementById('activeGameView').classList.remove('hidden');
    document.getElementById('resultView').classList.add('hidden');
    
    updateHUD();
    startTimer();
    clearFeedback();
    renderHistory();
}

/**
 * Primary guess handling logic
 */
function handleGuess() {
    if (!GAME_STATE.isPlaying) return;

    const input = document.getElementById('guessInput');
    const val = parseInt(input.value);

    if (isNaN(val) || val < 1 || val > 100) {
        showFeedback("INPUT OUTSIDE PARAMETERS (1-100)", "feedback-error");
        return;
    }

    if (GAME_STATE.guessHistory.includes(val)) {
        showFeedback("SEQUENCE ALREADY ANALYZED", "feedback-secondary");
        return;
    }

    GAME_STATE.guessHistory.unshift(val);
    GAME_STATE.attemptsRemaining--;
    
    if (val === GAME_STATE.targetNumber) {
        endGame(true);
    } else if (GAME_STATE.attemptsRemaining <= 0) {
        endGame(false);
    } else {
        const hint = val < GAME_STATE.targetNumber ? "HIGHER" : "LOWER";
        showFeedback(`INTEL: TARGET IS ${hint}`, "feedback-primary");
        updateHUD();
        renderHistory();
    }

    input.value = '';
    input.focus();
}

/**
 * Hint generation logic
 */
function requestHint() {
    if (GAME_STATE.hintsUsed >= 2) {
        showFeedback("MAXIMUM HINTS DEPLOYED", "feedback-error");
        return;
    }

    GAME_STATE.hintsUsed++;
    let hintMsg = "";
    
    if (GAME_STATE.hintsUsed === 1) {
        hintMsg = GAME_STATE.targetNumber % 2 === 0 ? "TARGET IS EVEN" : "TARGET IS ODD";
    } else {
        const rangeStart = Math.max(1, GAME_STATE.targetNumber - 10);
        const rangeEnd = Math.min(100, GAME_STATE.targetNumber + 10);
        hintMsg = `TARGET LOCATED BETWEEN ${rangeStart}-${rangeEnd}`;
    }

    showFeedback(`ENCRYPTED DATA: ${hintMsg}`, "feedback-secondary");
    updateXP();
}

/**
 * Global HUD Update
 */
function updateHUD() {
    document.getElementById('attemptsDisplay').textContent = 
        GAME_STATE.attemptsRemaining.toString().padStart(2, '0');
    
    const timerLabel = document.getElementById('timerDisplay');
    timerLabel.textContent = `00:${GAME_STATE.timer.toString().padStart(2, '0')}`;
    
    if (GAME_STATE.timer < 10) {
        timerLabel.classList.add('text-error');
    } else {
        timerLabel.classList.remove('text-error');
    }

    updateXP();
}

/**
 * Calculate XP based on time and attempts
 */
function updateXP() {
    const baseXP = { easy: 100, medium: 300, hard: 1000 }[GAME_STATE.difficulty];
    const multiplier = (GAME_STATE.attemptsRemaining / GAME_STATE.maxAttempts) + (GAME_STATE.timer / 60);
    const penalty = GAME_STATE.hintsUsed * 50;
    const potential = Math.max(0, Math.floor(baseXP * multiplier) - penalty);
    document.getElementById('xpPotential').textContent = potential;
    return potential;
}

/**
 * Timer logic
 */
function startTimer() {
    clearInterval(GAME_STATE.timerInterval);
    GAME_STATE.timerInterval = setInterval(() => {
        GAME_STATE.timer--;
        updateHUD();
        if (GAME_STATE.timer <= 0) {
            endGame(false, "TEMPORAL BREACH: MISSION FAILED");
        }
    }, 1000);
}

/**
 * End game cleanup
 */
function endGame(won, customMsg) {
    GAME_STATE.isPlaying = false;
    clearInterval(GAME_STATE.timerInterval);
    
    const activeView = document.getElementById('activeGameView');
    const resultView = document.getElementById('resultView');
    const resultTitle = document.getElementById('resultTitle');
    const resultMsg = document.getElementById('resultMsg');
    const resultIcon = document.getElementById('resultIcon');
    const xpAwarded = document.getElementById('xpAwarded');

    activeView.classList.add('hidden');
    resultView.classList.remove('hidden');

    if (won) {
        const finalXP = updateXP();
        resultTitle.textContent = "ACCESS GRANTED";
        resultTitle.className = "result-title result-success";
        resultMsg.textContent = `Decryption successful. Code ${GAME_STATE.targetNumber} captured in ${GAME_STATE.maxAttempts - GAME_STATE.attemptsRemaining} cycles.`;
        resultIcon.textContent = "check_circle";
        resultIcon.className = "material-symbols-outlined result-icon result-icon-success";
        xpAwarded.textContent = `+${finalXP} XP`;
        saveToLeaderboard(finalXP);
        triggerWinEffects();
    } else {
        resultTitle.textContent = "SYSTEM LOCKED";
        resultTitle.className = "result-title result-error";
        resultMsg.textContent = customMsg || `Protocol failed. The correct sequence was ${GAME_STATE.targetNumber}.`;
        resultIcon.textContent = "error";
        resultIcon.className = "material-symbols-outlined result-icon result-icon-error";
        xpAwarded.textContent = "0 XP";
    }
}

/**
 * Confetti & Visual effects
 */
function triggerWinEffects() {
    const count = 200;
    const defaults = { origin: { y: 0.7 }, zIndex: 1000 };

    function fire(particleRatio, opts) {
        confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
            colors: ['#00dbe7', '#d1bcff', '#fface8']
        });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
}

/**
 * History Rendering
 */
function renderHistory() {
    const container = document.getElementById('guessHistory');
    if (GAME_STATE.guessHistory.length === 0) {
        container.innerHTML = `<div class="history-empty">Waiting for transmission...</div>`;
        return;
    }

    container.innerHTML = GAME_STATE.guessHistory.map(g => {
        const diff = g - GAME_STATE.targetNumber;
        const colorClass = diff === 0 ? 'text-primary' : (diff > 0 ? 'text-error' : 'text-secondary');
        const icon = diff === 0 ? 'done_all' : (diff > 0 ? 'arrow_upward' : 'arrow_downward');
        
        return `
            <div class="history-item">
                <span class="history-num ${colorClass}">${g.toString().padStart(2, '0')}</span>
                <span class="material-symbols-outlined history-icon ${colorClass}" data-icon="${icon}">${icon}</span>
            </div>
        `;
    }).join('');
}

/**
 * Feedback text with transition
 */
function showFeedback(text, colorClass) {
    const el = document.getElementById('feedbackText');
    el.textContent = text;
    el.className = `feedback-text show ${colorClass}`;
    
    setTimeout(() => {
        el.className = `feedback-text fade ${colorClass}`;
    }, 2000);
}

function clearFeedback() {
    const el = document.getElementById('feedbackText');
    el.textContent = '';
    el.className = 'feedback-text';
}

/**
 * Leaderboard Management
 */
function loadLeaderboard() {
    let data = JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || DEFAULT_LEADERBOARD;
    data.sort((a, b) => b.score - a.score);
    
    const container = document.getElementById('leaderboardList');
    container.innerHTML = data.slice(0, 5).map((entry, idx) => `
        <div class="leaderboard-item">
            <div class="leaderboard-info">
                <span class="leaderboard-rank">0${idx+1}</span>
                <span class="leaderboard-name">${entry.name}</span>
            </div>
            <span class="leaderboard-score">${entry.score}</span>
        </div>
    `).join('');
}

function saveToLeaderboard(score) {
    if (score <= 0) return;
    let data = JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || DEFAULT_LEADERBOARD;
    data.push({ name: "CYBER_GUEST_01", score: score, level: 24 });
    data.sort((a, b) => b.score - a.score);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(data.slice(0, 10)));
    loadLeaderboard();
}

function resetGame() {
    document.getElementById('setupView').classList.remove('hidden');
    document.getElementById('activeGameView').classList.add('hidden');
    document.getElementById('resultView').classList.add('hidden');
    document.getElementById('guessInput').value = '';
}

/**
 * View Routing Logic
 */
function navigateTo(viewId) {
    // Hide all view sections
    document.querySelectorAll('.view-section').forEach(el => {
        el.classList.add('hidden');
    });
    
    // Show target view
    const target = document.getElementById(viewId);
    if (target) {
        target.classList.remove('hidden');
    }

    // Update active state in sidebar nav
    document.querySelectorAll('.sidebar-nav .nav-btn').forEach(btn => {
        if (btn.getAttribute('data-target') === viewId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Special handling for views
    if (viewId === 'view-leaderboard' || viewId === 'view-rankings') {
        renderFullLeaderboard();
    }
}

// Attach event listeners to all nav buttons
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = btn.getAttribute('data-target');
            if (target) {
                navigateTo(target);
            }
        });
    });
});

let rankingChartInstance = null;

function renderFullLeaderboard() {
    const container = document.getElementById('fullLeaderboardList');
    if (!container) return;
    
    let data = JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || DEFAULT_LEADERBOARD;
    data.sort((a, b) => b.score - a.score);
    
    container.innerHTML = data.map((entry, idx) => `
        <div class="leaderboard-item" style="padding: 12px 0;">
            <div class="leaderboard-info">
                <span class="leaderboard-rank" style="font-size: 14px; width: 24px;">${(idx+1).toString().padStart(2, '0')}</span>
                <span class="leaderboard-name" style="font-size: 16px;">${entry.name}</span>
                <span class="text-xs text-on-surface-variant ml-4">LVL ${entry.level}</span>
            </div>
            <span class="leaderboard-score" style="font-size: 18px;">${entry.score} XP</span>
        </div>
    `).join('');

    renderRankingsChart(data);
}

function renderRankingsChart(data) {
    const canvas = document.getElementById('rankingChart');
    if (!canvas) return;

    if (rankingChartInstance) {
        rankingChartInstance.destroy();
    }

    const ctx = canvas.getContext('2d');
    const labels = data.map(entry => entry.name);
    const scores = data.map(entry => entry.score);

    const gradient = ctx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, 'rgba(0, 219, 231, 0.4)');
    gradient.addColorStop(1, 'rgba(209, 188, 255, 0.05)');

    rankingChartInstance = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Operative XP',
                data: scores,
                backgroundColor: gradient,
                borderColor: '#00dbe7',
                borderWidth: 2,
                borderRadius: 6,
                hoverBackgroundColor: 'rgba(0, 219, 231, 0.8)',
                hoverBorderColor: '#e1fdff',
                hoverBorderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#0b1326',
                    titleColor: '#e1fdff',
                    bodyColor: '#dae2fd',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `Score: ${context.parsed.y} XP`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#b9cacb',
                        font: {
                            family: "'Geist', sans-serif",
                            size: 10
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#b9cacb',
                        font: {
                            family: "'Geist', sans-serif",
                            size: 10
                        }
                    }
                }
            }
        }
    });
}
