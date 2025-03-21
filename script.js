// ==================== VARIABEL GLOBAL ====================
let currentPlayer = null;
let position = 1;
const maxPosition = 50;
let isAnimating = false;

// ==================== SISTEM SUARA ====================
const soundEffects = {
    dice: new Audio('sounds/dice.mp3'),
    move: new Audio('sounds/move.mp3'),
    back: new Audio('sounds/back.mp3'),
    challenge: new Audio('sounds/challenge.mp3'),
    finish: new Audio('sounds/finish.mp3')
};

// ==================== INISIALISASI SUARA ====================
document.addEventListener('click', () => {
    // Memastikan suara bisa diputar setelah interaksi user
    Object.values(soundEffects).forEach(sound => {
        sound.play().then(() => sound.pause()).catch(() => {});
    });
}, { once: true });

// ==================== FUNGSI UTAMA ====================
function selectCharacter(gender) {
    currentPlayer = gender;
    document.getElementById('character-selection').classList.add('hidden');
    document.getElementById('game-container').classList.remove('hidden');
    initializeBoard();
}

function initializeBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    
    for(let i = 1; i <= maxPosition; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.id = `cell-${i}`;
        cell.textContent = i;
        board.appendChild(cell);
    }
    updatePion();
}

function updatePion() {
    document.querySelectorAll('.player').forEach(el => el.remove());
    const currentCell = document.getElementById(`cell-${position}`);
    if(currentCell) {
        const playerImg = document.createElement('img');
        playerImg.className = 'player';
        playerImg.src = `images/${currentPlayer}.png`;
        playerImg.alt = 'Player';
        currentCell.appendChild(playerImg);
    }
}

// ==================== ANIMASI & GERAKAN ====================
function animateMovement(start, end, callback) {
    isAnimating = true;
    let current = start;
    
    const interval = setInterval(() => {
        current += (end > start) ? 1 : -1;
        position = current;
        updatePion();
        
        // Putar suara gerakan
        playSound(end > start ? 'move' : 'back');
        
        if((end > start && current >= end) || (end < start && current <= end)) {
            clearInterval(interval);
            isAnimating = false;
            callback();
        }
    }, 200);
}

// ==================== SISTEM DADU ====================
function rollDice() {
    if(isAnimating) return;
    
    playSound('dice');
    const dice = Math.floor(Math.random() * 6) + 1;
    const newPosition = position + dice;
    
    animateMovement(position, newPosition, () => {
        position = Math.min(newPosition, maxPosition);
        if(position === maxPosition) {
            playSound('finish');
            showMessage('Selamat! Anda Menang! 🏆');
        } else {
            playSound('challenge');
            showQuestion();
        }
    });
}

// ==================== SISTEM PERTANYAAN ====================
function showQuestion() {
    const q = questions[Math.floor(Math.random() * questions.length)];
    document.getElementById('question-text').textContent = q.question;
    const answersDiv = document.getElementById('answers');
    answersDiv.innerHTML = '';
    
    q.answers.forEach((answer, index) => {
        const btn = document.createElement('button');
        btn.textContent = answer;
        btn.onclick = () => checkAnswer(index + 1, q.correct);
        answersDiv.appendChild(btn);
    });
    
    document.getElementById('question-area').classList.remove('hidden');
}

function checkAnswer(selected, correct) {
    document.getElementById('question-area').classList.add('hidden');
    
    if(selected !== correct) {
        const penalty = Math.floor(Math.random() * 3) + 2;
        const newPosition = Math.max(position - penalty, 1);
        animateMovement(position, newPosition, () => {
            position = newPosition;
            showMessage(`Salah! ❌ Mundur ${penalty} langkah`);
        });
    } else {
        playSound('move');
        showMessage('Benar! ✅ Lanjutkan permainan');
    }
}

// ==================== FUNGSI BANTUAN ====================
function playSound(soundName) {
    try {
        const sound = soundEffects[soundName];
        sound.currentTime = 0;
        sound.play();
    } catch(e) {
        console.log('Error memainkan suara:', e);
    }
}

function showMessage(text) {
    document.getElementById('message-text').textContent = text;
    document.getElementById('message-modal').classList.remove('hidden');
}

function closeMessage() {
    document.getElementById('message-modal').classList.add('hidden');
}

function resetGame() {
    position = 1;
    currentPlayer = null;
    document.getElementById('game-container').classList.add('hidden');
    document.getElementById('character-selection').classList.remove('hidden');
    initializeBoard();
}

// ==================== DAFTAR PERTANYAAN ====================
const questions = [
    { question: "Apa tujuan utama dari branding?", answers: ["Meningkatkan penjualan", "Menciptakan identitas produk", "Menurunkan harga"], correct: 2 },
    { question: "Logo Nike dikenal dengan simbol apa?", answers: ["Bintang", "Lingkaran", "Swoosh"], correct: 3 },
    { question: "Apa yang dimaksud dengan tagline dalam branding?", answers: ["Nama produk", "Slogan singkat yang mudah diingat", "Logo perusahaan"], correct: 2 },
    // ... (daftar pertanyaan lengkap sama seperti sebelumnya)
];

// ==================== INISIALISASI AWAL ====================
initializeBoard();