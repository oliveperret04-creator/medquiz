const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques depuis le dossier public
app.use(express.static('public'));

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medquiz', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion MongoDB:'));
db.once('open', () => {
  console.log('✅ Connecté à MongoDB');
});

// Modèles de données
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  totalScore: { type: Number, default: 0 },
  completedExams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }],
  createdAt: { type: Date, default: Date.now }
});

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  specialty: { type: String, required: true }, // cardiologie, neurologie, etc.
  difficulty: { type: String, enum: ['facile', 'moyen', 'difficile'], default: 'moyen' },
  questionCount: { type: Number, required: true },
  timePerQuestion: { type: Number, required: true }, // en secondes
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true }, // index de la bonne réponse
    explanation: { type: String, required: true },
    specialty: { type: String, required: true }
  }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const gameSessionSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  players: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String,
    score: { type: Number, default: 0 },
    answers: [{
      questionIndex: Number,
      selectedAnswer: Number,
      isCorrect: Boolean,
      timeSpent: Number
    }],
    isFinished: { type: Boolean, default: false }
  }],
  status: { type: String, enum: ['waiting', 'active', 'finished'], default: 'waiting' },
  currentQuestion: { type: Number, default: 0 },
  questionStartTime: Date,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Exam = mongoose.model('Exam', examSchema);
const GameSession = mongoose.model('GameSession', gameSessionSchema);

// Routes API
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Route pour récupérer les épreuves disponibles
app.get('/api/exams', async (req, res) => {
  try {
    const { specialty, difficulty } = req.query;
    let filter = { isActive: true };
    
    if (specialty) filter.specialty = specialty;
    if (difficulty) filter.difficulty = difficulty;
    
    const exams = await Exam.find(filter).select('title specialty difficulty questionCount timePerQuestion');
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des épreuves' });
  }
});

// Route pour récupérer une épreuve spécifique (sans les réponses)
app.get('/api/exams/:id', async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ error: 'Épreuve non trouvée' });
    }
    
    // Retourner l'épreuve sans les bonnes réponses
    const examForPlayer = {
      _id: exam._id,
      title: exam.title,
      specialty: exam.specialty,
      difficulty: exam.difficulty,
      questionCount: exam.questionCount,
      timePerQuestion: exam.timePerQuestion,
      questions: exam.questions.map(q => ({
        question: q.question,
        options: q.options,
        specialty: q.specialty
      }))
    };
    
    res.json(examForPlayer);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'épreuve' });
  }
});

// Route pour soumettre les réponses d'un joueur
app.post('/api/exams/:id/submit', async (req, res) => {
  try {
    const { userId, answers } = req.body;
    const examId = req.params.id;
    
    // Vérifier que l'utilisateur n'a pas déjà fait cette épreuve
    const user = await User.findById(userId);
    if (user.completedExams.includes(examId)) {
      return res.status(400).json({ error: 'Vous avez déjà complété cette épreuve' });
    }
    
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ error: 'Épreuve non trouvée' });
    }
    
    // Calculer le score
    let score = 0;
    const correctedAnswers = answers.map((answer, index) => {
      const isCorrect = answer.selectedAnswer === exam.questions[index].correctAnswer;
      if (isCorrect) score++;
      return {
        questionIndex: index,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
        timeSpent: answer.timeSpent,
        correctAnswer: exam.questions[index].correctAnswer,
        explanation: exam.questions[index].explanation
      };
    });
    
    // Marquer l'épreuve comme complétée
    user.completedExams.push(examId);
    user.totalScore += score;
    await user.save();
    
    res.json({
      score,
      totalQuestions: exam.questionCount,
      correctedAnswers,
      finalScore: user.totalScore
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la soumission des réponses' });
  }
});

// Route pour récupérer le classement d'une épreuve
app.get('/api/exams/:id/leaderboard', async (req, res) => {
  try {
    const examId = req.params.id;
    
    // Récupérer tous les utilisateurs qui ont complété cette épreuve
    const users = await User.find({ completedExams: examId })
      .select('username totalScore')
      .sort({ totalScore: -1 })
      .limit(100);
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du classement' });
  }
});

// Gestion des connexions Socket.io pour le mode multijoueur
const waitingPlayers = new Map(); // specialty -> [socketId]
const activeGames = new Map(); // gameId -> gameData

io.on('connection', (socket) => {
  console.log(`Nouveau joueur connecté: ${socket.id}`);
  
  // Rejoindre une file d'attente pour une spécialité
  socket.on('joinQueue', async ({ specialty, username, userId }) => {
    if (!waitingPlayers.has(specialty)) {
      waitingPlayers.set(specialty, []);
    }
    
    const queue = waitingPlayers.get(specialty);
    queue.push({ socketId: socket.id, username, userId });
    
    // Si on a au moins 2 joueurs, créer un match
    if (queue.length >= 2) {
      const player1 = queue.shift();
      const player2 = queue.shift();
      
      // Créer une nouvelle session de jeu
      const gameSession = new GameSession({
        examId: null, // Sera défini plus tard
        players: [
          { userId: player1.userId, username: player1.username },
          { userId: player2.userId, username: player2.userId }
        ],
        status: 'waiting'
      });
      
      await gameSession.save();
      
      // Notifier les deux joueurs
      io.to(player1.socketId).emit('gameFound', { 
        gameId: gameSession._id, 
        opponent: player2.username 
      });
      io.to(player2.socketId).emit('gameFound', { 
        gameId: gameSession._id, 
        opponent: player1.username 
      });
      
      // Ajouter le jeu à la liste des jeux actifs
      activeGames.set(gameSession._id.toString(), {
        session: gameSession,
        sockets: [player1.socketId, player2.socketId]
      });
    }
    
    socket.emit('joinedQueue', { specialty, position: queue.length });
  });
  
  // Démarrer le jeu quand les deux joueurs sont prêts
  socket.on('readyToPlay', async ({ gameId }) => {
    const gameData = activeGames.get(gameId);
    if (!gameData) return;
    
    // Sélectionner une épreuve aléatoire pour cette spécialité
    const specialty = gameData.session.players[0].specialty || 'cardiologie';
    const exam = await Exam.findOne({ 
      specialty, 
      isActive: true,
      questionCount: { $lte: 20 } // Épreuves courtes pour le multijoueur
    });
    
    if (!exam) {
      // Créer une épreuve par défaut si aucune n'existe
      const defaultExam = new Exam({
        title: `Quiz ${specialty} - Mode Multijoueur`,
        specialty,
        questionCount: 10,
        timePerQuestion: 60,
        questions: [] // À remplir avec des questions réelles
      });
      await defaultExam.save();
      gameData.session.examId = defaultExam._id;
    } else {
      gameData.session.examId = exam._id;
    }
    
    gameData.session.status = 'active';
    gameData.session.currentQuestion = 0;
    gameData.session.questionStartTime = new Date();
    await gameData.session.save();
    
    // Démarrer le jeu
    io.to(gameId).emit('gameStarted', {
      examId: gameData.session.examId,
      questionCount: exam ? exam.questionCount : 10,
      timePerQuestion: exam ? exam.timePerQuestion : 60
    });
    
    // Démarrer la première question
    startNextQuestion(gameId);
  });
  
  // Réception d'une réponse
  socket.on('submitAnswer', async ({ gameId, questionIndex, selectedAnswer, timeSpent }) => {
    const gameData = activeGames.get(gameId);
    if (!gameData) return;
    
    // Enregistrer la réponse
    const playerIndex = gameData.session.players.findIndex(p => p.userId === socket.data.userId);
    if (playerIndex !== -1) {
      gameData.session.players[playerIndex].answers.push({
        questionIndex,
        selectedAnswer,
        timeSpent,
        isCorrect: false // Sera vérifié à la fin
      });
    }
    
    // Vérifier si tous les joueurs ont répondu
    const allAnswered = gameData.session.players.every(p => 
      p.answers.length > gameData.session.currentQuestion
    );
    
    if (allAnswered) {
      // Passer à la question suivante
      setTimeout(() => startNextQuestion(gameId), 2000);
    }
  });
  
  // Déconnexion
  socket.on('disconnect', () => {
    console.log(`Joueur déconnecté: ${socket.id}`);
    
    // Retirer de toutes les files d'attente
    for (const [specialty, queue] of waitingPlayers.entries()) {
      const index = queue.findIndex(p => p.socketId === socket.id);
      if (index !== -1) {
        queue.splice(index, 1);
      }
    }
    
    // Gérer la déconnexion des jeux actifs
    for (const [gameId, gameData] of activeGames.entries()) {
      const socketIndex = gameData.sockets.indexOf(socket.id);
      if (socketIndex !== -1) {
        // Marquer le joueur comme déconnecté
        gameData.session.players[socketIndex].isFinished = true;
        gameData.session.save();
        
        // Notifier l'autre joueur
        const otherSocket = gameData.sockets[1 - socketIndex];
        io.to(otherSocket).emit('opponentDisconnected');
        
        // Terminer le jeu
        activeGames.delete(gameId);
      }
    }
  });
});

// Fonction pour démarrer la question suivante
function startNextQuestion(gameId) {
  const gameData = activeGames.get(gameId);
  if (!gameData) return;
  
  gameData.session.currentQuestion++;
  gameData.session.questionStartTime = new Date();
  gameData.session.save();
  
  if (gameData.session.currentQuestion >= gameData.session.questionCount) {
    // Fin du jeu
    endGame(gameId);
  } else {
    // Démarrer la question suivante
    io.to(gameId).emit('nextQuestion', {
      questionIndex: gameData.session.currentQuestion,
      timeRemaining: gameData.session.timePerQuestion
    });
    
    // Timer pour la question
    setTimeout(() => {
      const currentGameData = activeGames.get(gameId);
      if (currentGameData && currentGameData.session.currentQuestion === gameData.session.currentQuestion) {
        // Forcer la fin de la question si le temps est écoulé
        forceQuestionEnd(gameId);
      }
    }, gameData.session.timePerQuestion * 1000);
  }
}

// Fonction pour forcer la fin d'une question
function forceQuestionEnd(gameId) {
  const gameData = activeGames.get(gameId);
  if (!gameData) return;
  
  // Marquer les joueurs qui n'ont pas répondu
  gameData.session.players.forEach(player => {
    if (player.answers.length <= gameData.session.currentQuestion) {
      player.answers.push({
        questionIndex: gameData.session.currentQuestion,
        selectedAnswer: -1, // Pas de réponse
        timeSpent: gameData.session.timePerQuestion,
        isCorrect: false
      });
    }
  });
  
  // Passer à la question suivante
  setTimeout(() => startNextQuestion(gameId), 1000);
}

// Fonction pour terminer le jeu
async function endGame(gameId) {
  const gameData = activeGames.get(gameId);
  if (!gameData) return;
  
  // Calculer les scores finaux
  const exam = await Exam.findById(gameData.session.examId);
  if (exam) {
    gameData.session.players.forEach(player => {
      player.score = player.answers.reduce((total, answer) => {
        if (answer.isCorrect) return total + 1;
        return total;
      }, 0);
    });
  }
  
  gameData.session.status = 'finished';
  await gameData.session.save();
  
  // Envoyer les résultats finaux
  io.to(gameId).emit('gameFinished', {
    players: gameData.session.players.map(p => ({
      username: p.username,
      score: p.score,
      totalQuestions: gameData.session.questionCount
    }))
  });
  
  // Nettoyer
  activeGames.delete(gameId);
}

// Lancement du serveur
server.listen(port, () => {
  console.log(`✅ MedQuiz Server running on http://localhost:${port}`);
  console.log('🎯 Mode: Quiz médical compétitif R2C/EDN');
});
