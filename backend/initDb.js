const mongoose = require('mongoose');
require('dotenv').config();

// Modèles (copiés du server.js)
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
  specialty: { type: String, required: true },
  difficulty: { type: String, enum: ['facile', 'moyen', 'difficile'], default: 'moyen' },
  questionCount: { type: Number, required: true },
  timePerQuestion: { type: Number, required: true },
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true },
    explanation: { type: String, required: true },
    specialty: { type: String, required: true }
  }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Exam = mongoose.model('Exam', examSchema);

// QCM basés sur le programme R2C des EDN
const cardiologyQuestions = [
  {
    question: "Quel est le signe électrocardiographique le plus spécifique d'un infarctus du myocarde ?",
    options: [
      "Onde Q pathologique",
      "Inversion de l'onde T",
      "Élargissement du QRS",
      "Prolongement du QT",
      "Onde P pointue"
    ],
    correctAnswer: 0,
    explanation: "L'onde Q pathologique est le signe le plus spécifique d'un infarctus du myocarde. Elle indique une nécrose myocardique transmurale.",
    specialty: "cardiologie"
  },
  {
    question: "Quelle est la première ligne de traitement d'une fibrillation auriculaire avec réponse ventriculaire rapide ?",
    options: [
      "Amiodarone IV",
      "Digoxine",
      "Bêta-bloquants",
      "Calcium",
      "Héparine"
    ],
    correctAnswer: 2,
    explanation: "Les bêta-bloquants sont la première ligne de traitement pour ralentir la réponse ventriculaire en cas de FA.",
    specialty: "cardiologie"
  },
  {
    question: "Quel est le critère principal pour poser le diagnostic d'hypertension artérielle ?",
    options: [
      "Pression systolique > 140 mmHg",
      "Pression diastolique > 90 mmHg",
      "Pression systolique > 140 ET diastolique > 90 mmHg",
      "Pression moyenne > 100 mmHg",
      "Pression différentielle > 40 mmHg"
    ],
    correctAnswer: 2,
    explanation: "L'HTA est définie par une pression systolique ≥ 140 mmHg ET/OU une pression diastolique ≥ 90 mmHg.",
    specialty: "cardiologie"
  }
];

const neurologyQuestions = [
  {
    question: "Quel est le signe le plus précoce d'une hémorragie méningée ?",
    options: [
      "Céphalée brutale",
      "Vomissements",
      "Rigidité nucale",
      "Troubles de conscience",
      "Convulsions"
    ],
    correctAnswer: 0,
    explanation: "La céphalée brutale en coup de tonnerre est le signe le plus précoce et caractéristique d'une hémorragie méningée.",
    specialty: "neurologie"
  },
  {
    question: "Quel est le traitement de première intention d'une crise d'épilepsie tonico-clonique ?",
    options: [
      "Diazépam IV",
      "Phénobarbital",
      "Carbamazépine",
      "Lévétiracétam",
      "Valproate"
    ],
    correctAnswer: 0,
    explanation: "Le diazépam IV est le traitement de première intention pour arrêter une crise d'épilepsie tonico-clonique.",
    specialty: "neurologie"
  },
  {
    question: "Quel est le signe de Babinski ?",
    options: [
      "Extension du gros orteil lors du raclage plantaire",
      "Flexion des orteils lors du raclage plantaire",
      "Extension de tous les orteils",
      "Flexion de la cheville",
      "Extension du genou"
    ],
    correctAnswer: 0,
    explanation: "Le signe de Babinski est l'extension du gros orteil lors du raclage plantaire, signe de lésion du faisceau pyramidal.",
    specialty: "neurologie"
  }
];

const pneumologyQuestions = [
  {
    question: "Quel est le diagnostic le plus probable devant une dyspnée d'installation brutale avec douleur thoracique ?",
    options: [
      "Pneumonie",
      "Embolie pulmonaire",
      "Asthme",
      "Bronchite chronique",
      "Pleurésie"
    ],
    correctAnswer: 1,
    explanation: "Une dyspnée d'installation brutale avec douleur thoracique évoque en premier lieu une embolie pulmonaire.",
    specialty: "pneumologie"
  },
  {
    question: "Quel est le traitement de première intention d'une crise d'asthme ?",
    options: [
      "Bêta-2 mimétiques de courte durée d'action",
      "Corticoïdes inhalés",
      "Anticholinergiques",
      "Théophylline",
      "Antileucotriènes"
    ],
    correctAnswer: 0,
    explanation: "Les bêta-2 mimétiques de courte durée d'action sont le traitement de première intention d'une crise d'asthme.",
    specialty: "pneumologie"
  }
];

const gastroenterologyQuestions = [
  {
    question: "Quel est le signe le plus spécifique d'une péritonite ?",
    options: [
      "Douleur abdominale",
      "Contracture abdominale",
      "Nausées et vomissements",
      "Fièvre",
      "Arrêt des matières et gaz"
    ],
    correctAnswer: 1,
    explanation: "La contracture abdominale est le signe le plus spécifique d'une péritonite, traduisant l'irritation du péritoine.",
    specialty: "gastroenterologie"
  },
  {
    question: "Quel est le traitement de première intention d'une hémorragie digestive haute ?",
    options: [
      "Transfusion",
      "Endoscopie digestive",
      "Inhibiteurs de la pompe à protons",
      "Antibiotiques",
      "Chirurgie"
    ],
    correctAnswer: 2,
    explanation: "Les inhibiteurs de la pompe à protons sont le traitement de première intention d'une hémorragie digestive haute.",
    specialty: "gastroenterologie"
  }
];

async function initializeDatabase() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medquiz', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connecté à MongoDB');
    
    // Nettoyer la base de données
    await User.deleteMany({});
    await Exam.deleteMany({});
    console.log('🗑️ Base de données nettoyée');
    
    // Créer des utilisateurs de test
    const testUsers = [
      {
        username: 'medecin1',
        email: 'medecin1@test.com',
        password: 'password123',
        totalScore: 0
      },
      {
        username: 'medecin2',
        email: 'medecin2@test.com',
        password: 'password123',
        totalScore: 0
      },
      {
        username: 'etudiant1',
        email: 'etudiant1@test.com',
        password: 'password123',
        totalScore: 0
      }
    ];
    
    const createdUsers = await User.insertMany(testUsers);
    console.log(`👥 ${createdUsers.length} utilisateurs créés`);
    
    // Créer des épreuves
    const exams = [
      {
        title: "Quiz Cardiologie - Niveau Facile",
        specialty: "cardiologie",
        difficulty: "facile",
        questionCount: 5,
        timePerQuestion: 60,
        questions: cardiologyQuestions.slice(0, 2)
      },
      {
        title: "Quiz Cardiologie - Niveau Moyen",
        specialty: "cardiologie",
        difficulty: "moyen",
        questionCount: 10,
        timePerQuestion: 60,
        questions: cardiologyQuestions
      },
      {
        title: "Quiz Neurologie - Niveau Facile",
        specialty: "neurologie",
        difficulty: "facile",
        questionCount: 5,
        timePerQuestion: 60,
        questions: neurologyQuestions.slice(0, 2)
      },
      {
        title: "Quiz Neurologie - Niveau Moyen",
        specialty: "neurologie",
        difficulty: "moyen",
        questionCount: 10,
        timePerQuestion: 60,
        questions: neurologyQuestions
      },
      {
        title: "Quiz Pneumologie - Niveau Moyen",
        specialty: "pneumologie",
        difficulty: "moyen",
        questionCount: 8,
        timePerQuestion: 60,
        questions: pneumologyQuestions
      },
      {
        title: "Quiz Gastro-entérologie - Niveau Moyen",
        specialty: "gastroenterologie",
        difficulty: "moyen",
        questionCount: 8,
        timePerQuestion: 60,
        questions: gastroenterologyQuestions
      },
      {
        title: "Quiz Mixte - Toutes Spécialités",
        specialty: "mixte",
        difficulty: "difficile",
        questionCount: 20,
        timePerQuestion: 45,
        questions: [
          ...cardiologyQuestions,
          ...neurologyQuestions,
          ...pneumologyQuestions,
          ...gastroenterologyQuestions
        ]
      }
    ];
    
    const createdExams = await Exam.insertMany(exams);
    console.log(`📝 ${createdExams.length} épreuves créées`);
    
    console.log('\n🎯 Base de données initialisée avec succès !');
    console.log('📊 Spécialités disponibles :');
    console.log('   - Cardiologie');
    console.log('   - Neurologie');
    console.log('   - Pneumologie');
    console.log('   - Gastro-entérologie');
    console.log('   - Quiz mixte');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation :', error);
    process.exit(1);
  }
}

initializeDatabase();
