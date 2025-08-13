// Configuration de l'API
const API_BASE_URL = 'https://medquiz-app.herokuapp.com/api';

// Variables globales
let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let timer = null;
let timeRemaining = 0;
let socket = null;

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 MedQuiz - Application initialisée');
    initializeSocket();
});

// Initialisation de Socket.io pour le mode multijoueur
function initializeSocket() {
    socket = io('https://medquiz-app.herokuapp.com');
    
    socket.on('connect', () => {
        console.log('🔌 Connecté au serveur multijoueur');
    });
    
    socket.on('disconnect', () => {
        console.log('❌ Déconnecté du serveur multijoueur');
    });
}

// Navigation entre les vues
function showSpecialties() {
    hideAllViews();
    document.getElementById('specialtiesGrid').classList.remove('hidden');
}

function showMultiplayer() {
    alert('🎮 Mode multijoueur en cours de développement !\n\nRevenez bientôt pour affronter d\'autres étudiants en temps réel.');
}

function showLeaderboard() {
    hideAllViews();
    document.getElementById('leaderboardContainer').classList.remove('hidden');
    loadLeaderboard();
}

function goBack() {
    hideAllViews();
    document.getElementById('mainMenu').classList.remove('hidden');
    resetQuiz();
}

function hideAllViews() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('specialtiesGrid').classList.add('hidden');
    document.getElementById('quizContainer').classList.add('hidden');
    document.getElementById('resultsContainer').classList.add('hidden');
    document.getElementById('leaderboardContainer').classList.add('hidden');
}

// Gestion des quiz
async function startQuiz(specialty) {
    try {
        // Récupérer une épreuve disponible pour cette spécialité
        const response = await fetch(`${API_BASE_URL}/exams?specialty=${specialty}&difficulty=moyen`);
        const exams = await response.json();
        
        if (exams.length === 0) {
            alert('Aucune épreuve disponible pour cette spécialité pour le moment.');
            return;
        }
        
        // Sélectionner une épreuve aléatoire
        const randomExam = exams[Math.floor(Math.random() * exams.length)];
        
        // Récupérer l'épreuve complète
        const examResponse = await fetch(`${API_BASE_URL}/exams/${randomExam._id}`);
        const exam = await examResponse.json();
        
        // Initialiser le quiz
        currentQuiz = exam;
        currentQuestionIndex = 0;
        userAnswers = [];
        
        // Afficher le quiz
        hideAllViews();
        document.getElementById('quizContainer').classList.remove('hidden');
        document.getElementById('quizTitle').textContent = exam.title;
        
        // Démarrer la première question
        displayQuestion();
        
    } catch (error) {
        console.error('Erreur lors du démarrage du quiz:', error);
        alert('Erreur lors du démarrage du quiz. Veuillez réessayer.');
    }
}

function displayQuestion() {
    if (!currentQuiz || currentQuestionIndex >= currentQuiz.questions.length) {
        endQuiz();
        return;
    }
    
    const question = currentQuiz.questions[currentQuestionIndex];
    const questionNumber = currentQuestionIndex + 1;
    const totalQuestions = currentQuiz.questions.length;
    
    // Afficher la question
    document.getElementById('questionText').textContent = `Question ${questionNumber}/${totalQuestions}: ${question.question}`;
    
    // Générer les options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.onclick = () => selectOption(index);
        optionsContainer.appendChild(optionElement);
    });
    
    // Démarrer le timer
    startTimer();
    
    // Réinitialiser le bouton suivant
    document.getElementById('nextBtn').disabled = true;
}

function selectOption(optionIndex) {
    // Désélectionner toutes les options
    const options = document.querySelectorAll('.option');
    options.forEach(option => option.classList.remove('selected'));
    
    // Sélectionner l'option cliquée
    options[optionIndex].classList.add('selected');
    
    // Enregistrer la réponse
    const timeSpent = currentQuiz.timePerQuestion - timeRemaining;
    userAnswers[currentQuestionIndex] = {
        selectedAnswer: optionIndex,
        timeSpent: timeSpent
    };
    
    // Activer le bouton suivant
    document.getElementById('nextBtn').disabled = false;
    
    // Arrêter le timer
    stopTimer();
}

function startTimer() {
    timeRemaining = currentQuiz.timePerQuestion;
    updateTimerDisplay();
    
    timer = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        if (timeRemaining <= 0) {
            stopTimer();
            // Forcer une réponse si aucune n'a été sélectionnée
            if (userAnswers[currentQuestionIndex] === undefined) {
                userAnswers[currentQuestionIndex] = {
                    selectedAnswer: -1, // Pas de réponse
                    timeSpent: currentQuiz.timePerQuestion
                };
            }
            // Passer automatiquement à la question suivante
            setTimeout(nextQuestion, 1000);
        }
    }, 1000);
}

function stopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function nextQuestion() {
    // Vérifier qu'une réponse a été donnée
    if (userAnswers[currentQuestionIndex] === undefined) {
        alert('Veuillez sélectionner une réponse avant de continuer.');
        return;
    }
    
    currentQuestionIndex++;
    
    if (currentQuestionIndex >= currentQuiz.questions.length) {
        endQuiz();
    } else {
        displayQuestion();
    }
}

async function endQuiz() {
    try {
        // Soumettre les réponses au serveur
        const response = await fetch(`${API_BASE_URL}/exams/${currentQuiz._id}/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: 'test-user', // En production, utiliser l'ID de l'utilisateur connecté
                answers: userAnswers
            })
        });
        
        const results = await response.json();
        
        // Afficher les résultats
        hideAllViews();
        document.getElementById('resultsContainer').classList.remove('hidden');
        
        document.getElementById('finalScore').textContent = `${results.score}/${results.totalQuestions}`;
        
        const percentage = Math.round((results.score / results.totalQuestions) * 100);
        let message = '';
        
        if (percentage >= 80) {
            message = '🎉 Excellent ! Vous maîtrisez parfaitement cette spécialité.';
        } else if (percentage >= 60) {
            message = '👍 Bien joué ! Vous avez de bonnes connaissances dans ce domaine.';
        } else if (percentage >= 40) {
            message = '📚 Pas mal ! Continuez à réviser pour améliorer vos résultats.';
        } else {
            message = '📖 Continuez à travailler ! La pratique rend parfait.';
        }
        
        document.getElementById('scoreMessage').textContent = message;
        
    } catch (error) {
        console.error('Erreur lors de la soumission des réponses:', error);
        alert('Erreur lors de la soumission des réponses. Veuillez réessayer.');
    }
}

function resetQuiz() {
    currentQuiz = null;
    currentQuestionIndex = 0;
    userAnswers = [];
    stopTimer();
    timeRemaining = 0;
}

// Gestion du classement
async function loadLeaderboard() {
    try {
        const response = await fetch(`${API_BASE_URL}/exams/leaderboard`);
        const leaderboard = await response.json();
        
        const leaderboardList = document.getElementById('leaderboardList');
        leaderboardList.innerHTML = '';
        
        if (leaderboard.length === 0) {
            leaderboardList.innerHTML = '<p style="text-align: center; color: #666;">Aucun classement disponible pour le moment.</p>';
            return;
        }
        
        leaderboard.forEach((user, index) => {
            const rank = index + 1;
            const rankClass = rank <= 3 ? 'rank top-' + rank : 'rank';
            const rankIcon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
            
            const leaderboardItem = document.createElement('div');
            leaderboardItem.className = 'leaderboard-item';
            leaderboardItem.innerHTML = `
                <span class="${rankClass}">${rankIcon}</span>
                <span class="username">${user.username}</span>
                <span class="score-value">${user.totalScore} points</span>
            `;
            
            leaderboardList.appendChild(leaderboardItem);
        });
        
    } catch (error) {
        console.error('Erreur lors du chargement du classement:', error);
        document.getElementById('leaderboardList').innerHTML = 
            '<p style="text-align: center; color: #e74c3c;">Erreur lors du chargement du classement.</p>';
    }
}

// Fonctions utilitaires
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Gestion des erreurs globales
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
});

// Gestion des promesses non gérées
window.addEventListener('unhandledrejection', function(e) {
    console.error('Promesse rejetée non gérée:', e.reason);
});

// Export des fonctions pour le débogage
window.MedQuiz = {
    startQuiz,
    showSpecialties,
    showMultiplayer,
    showLeaderboard,
    goBack,
    loadLeaderboard
};
