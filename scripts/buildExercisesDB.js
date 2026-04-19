const fs = require('fs');

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
  console.log("Baixando e compilando exercícios do DB Aberto...");
  const res = await fetch("https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json");
  const data = await res.json();
  
  const mappedArray = [];
  
  data.forEach(ex => {
      const internalId = ex.id.replace(/\//g, '_'); // valid id
      
      const mappedMuscle = muscleMap[ex.primaryMuscles?.[0]] || 'Core';
      const mappedLevel = levelMap[ex.level] || 'Intermediário';
      const isHome = ex.equipment === 'body only' ? 'Casa' : 'Academia';

      mappedArray.push({
        id: internalId,
        name: ex.name,
        muscle: mappedMuscle,
        cues: ex.category ? [ex.category.charAt(0).toUpperCase() + ex.category.slice(1)] : [],
        level: mappedLevel,
        environment: isHome,
        instructions: ex.instructions || [],
        freeDbId: ex.id,
        equipment: ex.equipment || 'none'
      });
  });
  
  fs.writeFileSync('data/allExercises.json', JSON.stringify(mappedArray, null, 2));
  console.log(`Sucesso! Convertidos ${mappedArray.length} exercícios para data/allExercises.json`);
}

seed().catch(console.error);
