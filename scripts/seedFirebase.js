const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, writeBatch } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyA7cWgjgIhQGjEmpPd-5npd4_gd61PtXzI",
  projectId: "syntrix-fit",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const muscleMap = {
  abdominals: 'Core',
  abductors: 'Pernas',
  adductors: 'Pernas',
  biceps: 'Bíceps',
  calves: 'Panturrilhas',
  chest: 'Peito',
  forearms: 'Antebraço',
  glutes: 'Glúteos',
  hamstrings: 'Pernas',
  lats: 'Costas',
  lower_back: 'Costas',
  middle_back: 'Costas',
  neck: 'Ombros', 
  quadriceps: 'Pernas',
  traps: 'Costas',
  triceps: 'Tríceps'
};

const levelMap = {
  beginner: 'Iniciante',
  intermediate: 'Intermediário',
  expert: 'Avançado'
};

async function seed() {
  console.log("Fetching exercises from Github...");
  const res = await fetch("https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json");
  const data = await res.json();
  
  console.log(`Fetched ${data.length} exercises. Seeding...`);
  
  const chunks = [];
  const chunkSize = 400; // Firebase max batch is 500
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }

  const collRef = collection(db, 'exercises');

  let totalSeeded = 0;
  for (const chunk of chunks) {
    const batch = writeBatch(db);
    chunk.forEach(ex => {
      const internalId = ex.id.replace(/\//g, '_'); // valid firestore id
      
      const mappedMuscle = muscleMap[ex.primaryMuscles?.[0]] || 'Core';
      const mappedLevel = levelMap[ex.level] || 'Intermediário';
      const isHome = ex.equipment === 'body only' ? 'Casa' : 'Academia';

      const exerciseDef = {
        id: internalId,
        name: ex.name,
        force: ex.force || null,
        muscle: mappedMuscle,
        cues: ex.category ? [ex.category] : [],
        level: mappedLevel,
        environment: isHome,
        instructions: ex.instructions || [],
        freeDbId: ex.id,
        equipment: ex.equipment || 'none'
      };

      const docRef = doc(collRef, internalId);
      batch.set(docRef, exerciseDef);
    });
    
    await batch.commit();
    totalSeeded += chunk.length;
    console.log(`Committed chunk of size ${chunk.length}... Total: ${totalSeeded}`);
  }
  
  console.log("Seeding complete! Quitting.");
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
