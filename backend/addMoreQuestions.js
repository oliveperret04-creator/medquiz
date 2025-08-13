const mongoose = require('mongoose');
require('dotenv').config();

// Modèles
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

const Exam = mongoose.model('Exam', examSchema);

// QCM supplémentaires basés sur le programme R2C
const additionalQuestions = {
  endocrinologie: [
    {
      question: "Quel est le critère diagnostique du diabète de type 2 ?",
      options: [
        "Glycémie à jeun ≥ 7 mmol/L",
        "Glycémie à jeun ≥ 6,1 mmol/L",
        "Glycémie à jeun ≥ 8 mmol/L",
        "Glycémie post-prandiale ≥ 11,1 mmol/L",
        "HbA1c ≥ 6,5%"
      ],
      correctAnswer: 0,
      explanation: "Le diabète de type 2 est diagnostiqué par une glycémie à jeun ≥ 7 mmol/L (1,26 g/L) ou une glycémie ≥ 11,1 mmol/L 2h après charge orale en glucose.",
      specialty: "endocrinologie"
    },
    {
      question: "Quel est le traitement de première intention d'une hypothyroïdie ?",
      options: [
        "Lévothyroxine",
        "Liotironine",
        "Propylthiouracile",
        "Méthimazole",
        "Iode radioactif"
      ],
      correctAnswer: 0,
      explanation: "La lévothyroxine (T4) est le traitement de référence de l'hypothyroïdie, permettant de normaliser la TSH.",
      specialty: "endocrinologie"
    }
  ],
  
  nephrologie: [
    {
      question: "Quel est le critère de gravité d'une insuffisance rénale chronique ?",
      options: [
        "Créatininémie > 150 µmol/L",
        "DFG < 60 mL/min/1,73m²",
        "Protéinurie > 0,5 g/24h",
        "Hématurie microscopique",
        "Hypertension artérielle"
      ],
      correctAnswer: 1,
      explanation: "L'insuffisance rénale chronique est définie par un DFG < 60 mL/min/1,73m² pendant plus de 3 mois.",
      specialty: "nephrologie"
    },
    {
      question: "Quel est le traitement de première intention d'une infection urinaire basse ?",
      options: [
        "Fosfomycine trométamol",
        "Ciprofloxacine",
        "Amoxicilline",
        "Céfixime",
        "Nitrofurantoïne"
      ],
      correctAnswer: 0,
      explanation: "La fosfomycine trométamol en dose unique est le traitement de première intention des cystites aiguës simples.",
      specialty: "nephrologie"
    }
  ],
  
  dermatologie: [
    {
      question: "Quel est le signe de Nikolsky ?",
      options: [
        "Décollement cutané au frottement",
        "Éruption en cocarde",
        "Lésions en cible",
        "Vésicules groupées",
        "Papules prurigineuses"
      ],
      correctAnswer: 0,
      explanation: "Le signe de Nikolsky est le décollement de l'épiderme au frottement, caractéristique des épidermolyses bulleuses et du syndrome de Lyell.",
      specialty: "dermatologie"
    },
    {
      question: "Quel est le traitement de première intention d'un psoriasis modéré ?",
      options: [
        "Dermocorticoïdes",
        "Photothérapie UVB",
        "Méthotrexate",
        "Ciclosporine",
        "Biothérapies"
      ],
      correctAnswer: 0,
      explanation: "Les dermocorticoïdes sont le traitement de première intention du psoriasis modéré, en association avec des émollients.",
      specialty: "dermatologie"
    }
  ],
  
  rhumatologie: [
    {
      question: "Quel est le critère de classification de la polyarthrite rhumatoïde ?",
      options: [
        "Arthrite de plus de 3 articulations",
        "Arthrite symétrique",
        "Facteur rhumatoïde positif",
        "Score ACR/EULAR ≥ 6",
        "Raideur matinale > 1h"
      ],
      correctAnswer: 3,
      explanation: "Le diagnostic de PR repose sur le score ACR/EULAR ≥ 6 points, combinant critères cliniques, biologiques et d'imagerie.",
      specialty: "rhumatologie"
    },
    {
      question: "Quel est le traitement de première intention d'une polyarthrite rhumatoïde ?",
      options: [
        "Méthotrexate",
        "Hydroxychloroquine",
        "Sulfasalazine",
        "Léflunomide",
        "Biothérapies"
      ],
      correctAnswer: 0,
      explanation: "Le méthotrexate est le traitement de fond de première intention de la polyarthrite rhumatoïde.",
      specialty: "rhumatologie"
    }
  ],
  
  pediatrie: [
    {
      question: "Quel est le signe de Kernig ?",
      options: [
        "Résistance à l'extension du genou",
        "Flexion involontaire des hanches",
        "Rigidité nucale",
        "Photophobie",
        "Céphalée"
      ],
      correctAnswer: 0,
      explanation: "Le signe de Kernig est la résistance douloureuse à l'extension du genou en position assise, signe de méningite.",
      specialty: "pediatrie"
    },
    {
      question: "Quel est le traitement de première intention d'une otite moyenne aiguë ?",
      options: [
        "Amoxicilline",
        "Amoxicilline + acide clavulanique",
        "Céfuroxime",
        "Azithromycine",
        "Surveillance simple"
      ],
      correctAnswer: 0,
      explanation: "L'amoxicilline est le traitement de première intention de l'otite moyenne aiguë à pneumocoque.",
      specialty: "pediatrie"
    }
  ],
  
  gynecologie: [
    {
      question: "Quel est le signe de Chadwick ?",
      options: [
        "Coloration bleutée du col utérin",
        "Mouvement du fœtus",
        "Ballottement fœtal",
        "Souffle utéro-placentaire",
        "Contractions utérines"
      ],
      correctAnswer: 0,
      explanation: "Le signe de Chadwick est la coloration bleutée du col utérin, signe précoce de grossesse.",
      specialty: "gynecologie"
    },
    {
      question: "Quel est le traitement de première intention d'une infection vaginale à Candida ?",
      options: [
        "Clotrimazole",
        "Métronidazole",
        "Clindamycine",
        "Fluconazole oral",
        "Nystatine"
      ],
      correctAnswer: 0,
      explanation: "Le clotrimazole en ovules ou crème est le traitement de première intention des candidoses vulvo-vaginales.",
      specialty: "gynecologie"
    }
  ],
  
  psychiatrie: [
    {
      question: "Quel est le critère de durée pour le diagnostic d'un épisode dépressif majeur ?",
      options: [
        "Plus de 2 semaines",
        "Plus de 1 semaine",
        "Plus de 1 mois",
        "Plus de 6 mois",
        "Plus de 3 mois"
      ],
      correctAnswer: 0,
      explanation: "L'épisode dépressif majeur nécessite des symptômes présents pendant plus de 2 semaines.",
      specialty: "psychiatrie"
    },
    {
      question: "Quel est le traitement de première intention d'un trouble panique ?",
      options: [
        "ISRS",
        "Benzodiazépines",
        "Antipsychotiques",
        "Anticonvulsivants",
        "Lithium"
      ],
      correctAnswer: 0,
      explanation: "Les inhibiteurs sélectifs de la recapture de la sérotonine (ISRS) sont le traitement de première intention du trouble panique.",
      specialty: "psychiatrie"
    }
  ],
  
  oncologie: [
    {
      question: "Quel est le signe de Trousseau ?",
      options: [
        "Spasme carpopédal",
        "Signe de Chvostek",
        "Tétanie",
        "Convulsions",
        "Tremblements"
      ],
      correctAnswer: 0,
      explanation: "Le signe de Trousseau est le spasme carpopédal provoqué par l'occlusion du bras, signe d'hypocalcémie.",
      specialty: "oncologie"
    },
    {
      question: "Quel est le marqueur tumoral le plus spécifique du cancer de la prostate ?",
      options: [
        "PSA",
        "ACE",
        "CA 19-9",
        "CA 125",
        "AFP"
      ],
      correctAnswer: 0,
      explanation: "L'antigène prostatique spécifique (PSA) est le marqueur tumoral le plus spécifique du cancer de la prostate.",
      specialty: "oncologie"
    }
  ]
};

async function addMoreQuestions() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medquiz', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connecté à MongoDB');
    
    // Créer de nouvelles épreuves pour chaque spécialité
    const newExams = [];
    
    for (const [specialty, questions] of Object.entries(additionalQuestions)) {
      const exam = {
        title: `Quiz ${specialty.charAt(0).toUpperCase() + specialty.slice(1)} - Niveau Moyen`,
        specialty: specialty,
        difficulty: "moyen",
        questionCount: questions.length,
        timePerQuestion: 60,
        questions: questions
      };
      
      newExams.push(exam);
    }
    
    // Ajouter des épreuves mixtes avec plus de questions
    const allQuestions = Object.values(additionalQuestions).flat();
    const mixedExam = {
      title: "Quiz Mixte Avancé - Toutes Spécialités",
      specialty: "mixte",
      difficulty: "difficile",
      questionCount: allQuestions.length,
      timePerQuestion: 45,
      questions: allQuestions
    };
    
    newExams.push(mixedExam);
    
    // Créer les épreuves
    const createdExams = await Exam.insertMany(newExams);
    console.log(`📝 ${createdExams.length} nouvelles épreuves créées`);
    
    console.log('\n🎯 Nouvelles spécialités ajoutées :');
    Object.keys(additionalQuestions).forEach(specialty => {
      console.log(`   - ${specialty.charAt(0).toUpperCase() + specialty.slice(1)}`);
    });
    
    console.log('\n📊 Total des épreuves disponibles :');
    const totalExams = await Exam.countDocuments();
    console.log(`   ${totalExams} épreuves au total`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des questions :', error);
    process.exit(1);
  }
}

addMoreQuestions();
