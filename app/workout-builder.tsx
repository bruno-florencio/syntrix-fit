import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Modal, Image, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { EXERCISE_DATABASE, WORKOUT_TEMPLATES, ExerciseDef, WorkoutTemplateDef } from '../data/workoutDB';
import { useAuth } from '../context/AuthContext';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WorkoutExercise {
  id: string; // Unique ID
  exerciseId: string;
  name: string;
  sets: string;
  reps: string;
  technique?: string;
  level: string;
}

interface WorkoutDay {
  dayId: string;
  label: string;
  exercises: WorkoutExercise[];
}

export default function WorkoutBuilderScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const templateId = params.templateId as string | undefined;

  const [activeTemplate, setActiveTemplate] = useState<WorkoutTemplateDef | null>(null);
  const [workoutTitle, setWorkoutTitle] = useState('Meu Treino Personalizado');
  const [days, setDays] = useState<WorkoutDay[]>([]);
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  
  // Controle do Execution Modal
  const [executionModalItem, setExecutionModalItem] = useState<ExerciseDef | null>(null);

  // Inicialização baseada no Template
  useEffect(() => {
    if (templateId) {
      const template = WORKOUT_TEMPLATES.find(t => t.id === templateId);
      if (template) {
        setActiveTemplate(template);
        setWorkoutTitle(template.title);
        
        // Cria as abas de Dias
        const initialDays: WorkoutDay[] = Array.from({ length: template.daysCount }).map((_, i) => {
          const letter = String.fromCharCode(65 + i); // 65 = 'A'
          return {
            dayId: letter,
            label: `Dia ${letter}`,
            exercises: []
          };
        });
        setDays(initialDays);
        return;
      }
    }
    
    // Fallback: Construtor Manual Livre (1 dia, sem limites)
    setDays([{ dayId: 'A', label: 'Treino Único', exercises: [] }]);
  }, [templateId]);

  const addExercise = (exercise: ExerciseDef) => {
    setDays(prev => {
      const newDays = [...prev];
      const currentDay = newDays[activeDayIdx];
      
      // Validação de limite
      if (activeTemplate && currentDay.exercises.length >= activeTemplate.maxExercisesPerDay) {
        Alert.alert('Limite Atingido', `Este plano permite no máximo ${activeTemplate.maxExercisesPerDay} exercícios por dia.`);
        return prev;
      }
      
      currentDay.exercises.push({
        id: Date.now().toString() + Math.random(),
        exerciseId: exercise.id,
        name: exercise.name,
        sets: '3',
        reps: '10-12',
        technique: 'Padrão',
        level: exercise.level
      });
      return newDays;
    });
    setIsPickerOpen(false);
  };

  const removeExercise = (instanceId: string, dayIdx: number) => {
    setDays(prev => {
      const newDays = [...prev];
      newDays[dayIdx].exercises = newDays[dayIdx].exercises.filter(e => e.id !== instanceId);
      return newDays;
    });
  };

  const toggleTechnique = (instanceId: string, dayIdx: number) => {
    const sequence = ['Padrão', 'Drop-set', 'Rest-Pause', 'Bi-set', 'Tri-set', 'Quadri-set'];
    setDays(prev => {
      const newDays = [...prev];
      newDays[dayIdx].exercises = newDays[dayIdx].exercises.map(e => {
        if (e.id === instanceId) {
          const currentIdx = sequence.indexOf(e.technique || 'Padrão');
          const nextIdx = (currentIdx + 1) % sequence.length;
          return { ...e, technique: sequence[nextIdx] };
        }
        return e;
      });
      return newDays;
    });
  };

  const handleSave = async () => {
    const totalExercises = days.reduce((acc, curr) => acc + curr.exercises.length, 0);
    if (totalExercises === 0) {
      Alert.alert('Ops', 'Você não adicionou nenhum exercício ao plano geral!');
      return;
    }
    
    setIsSaving(true);
    try {
      const workoutData = {
        title: workoutTitle,
        templateId: activeTemplate?.id || 'manual',
        days: days, // Matriz completa de dias
        createdAt: new Date().toISOString(),
      };

      if (user?.uid) {
        await firestore().collection('users').doc(user.uid).collection('workouts').add(workoutData);
      } else {
        const existing = await AsyncStorage.getItem('@workouts_cache');
        const parsed = existing ? JSON.parse(existing) : [];
        parsed.push(workoutData);
        await AsyncStorage.setItem('@workouts_cache', JSON.stringify(parsed));
      }
      
      Alert.alert('Plano Instalado!', 'Seu novo sistema de treinos foi carregado.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar o treino.');
    } finally {
      setIsSaving(false);
    }
  };

  // Filtragem de Banco de Dados baseada na dificuldade permitida pelo template
  const _availableExercises = EXERCISE_DATABASE.filter(ex => 
    !activeTemplate || activeTemplate.allowedLevels.includes(ex.level)
  );

  if (days.length === 0) return <View style={styles.container} />; // Loading

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TextInput 
          style={styles.titleInput} 
          placeholder="Nome do Treino" 
          placeholderTextColor="#adaaaa" 
          value={workoutTitle}
          onChangeText={setWorkoutTitle}
        />
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={isSaving}>
          {isSaving ? <ActivityIndicator color="#0e0e0e" /> : <Text style={styles.saveText}>SALVAR</Text>}
        </TouchableOpacity>
      </View>

      {/* Tabs Multi-Dias */}
      {!isPickerOpen && (
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {days.map((day, idx) => (
              <TouchableOpacity
                key={day.dayId}
                style={[styles.tabBtn, activeDayIdx === idx && styles.tabBtnActive]}
                onPress={() => setActiveDayIdx(idx)}
              >
                <Text style={[styles.tabText, activeDayIdx === idx && styles.tabTextActive]}>
                  {day.label}
                </Text>
                {day.exercises.length > 0 && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{day.exercises.length}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Selected Exercises do Dia Atual */}
      {!isPickerOpen && (
        <ScrollView style={styles.selectedWrapper} contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>ROUTINA: {days[activeDayIdx].label}</Text>
            {activeTemplate && (
              <Text style={styles.limitText}>
                {days[activeDayIdx].exercises.length} / {activeTemplate.maxExercisesPerDay} Limite
              </Text>
            )}
          </View>
          
          {days[activeDayIdx].exercises.map((item, index) => (
            <View key={item.id} style={styles.exerciseRow}>
              <View style={styles.indexCircle}>
                <Text style={styles.indexText}>{index + 1}</Text>
              </View>
              <View style={styles.exerciseDetails}>
                <Text style={styles.exerciseName}>{item.name}</Text>
                <View style={styles.setsWrapper}>
                  <Text style={styles.setsText}>{item.sets} SÉRIES x {item.reps} REPS</Text>
                  
                  <TouchableOpacity 
                    style={[styles.techniqueBadge, item.technique !== 'Padrão' && styles.techniqueActive]}
                    onPress={() => toggleTechnique(item.id, activeDayIdx)}
                  >
                    <Text style={[styles.techniqueText, item.technique !== 'Padrão' && styles.techniqueActiveText]}>
                      {item.technique || 'Padrão'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity onPress={() => removeExercise(item.id, activeDayIdx)} style={{ padding: 8 }}>
                <MaterialCommunityIcons name="trash-can-outline" size={24} color="#ff4444" />
              </TouchableOpacity>
            </View>
          ))}

          {(!activeTemplate || days[activeDayIdx].exercises.length < activeTemplate.maxExercisesPerDay) && (
            <TouchableOpacity style={styles.addExerciseBtn} onPress={() => setIsPickerOpen(true)}>
              <MaterialCommunityIcons name="plus-circle-outline" size={24} color="#adaaaa" style={{ marginBottom: 4 }} />
              <Text style={styles.addBtnText}>ADICIONAR DO BANCO</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}

      {/* Picker: Biomechanical Database Filtrado */}
      {isPickerOpen && (
        <View style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <View>
              <Text style={styles.sectionTitle}>BANCO COMPATÍVEL</Text>
              {activeTemplate && (
                <Text style={{color: '#adaaaa', fontSize: 12}}>Níveis: {activeTemplate.allowedLevels.join(', ')}</Text>
              )}
            </View>
            <TouchableOpacity onPress={() => setIsPickerOpen(false)}>
              <Text style={{ color: '#CCFF00', fontWeight: 'bold' }}>FECHAR</Text>
            </TouchableOpacity>
          </View>
          
           {_availableExercises.length === 0 ? (
            <Text style={{color: '#fff', marginTop: 20, textAlign: 'center'}}>Nenhum exercício do seu banco atende o filtro de dificuldade atual.</Text>
          ) : (
            <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
              {_availableExercises.map(ex => (
                <View key={ex.id} style={styles.bankRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bankName}>{ex.name}</Text>
                    <Text style={styles.bankGroup}>{ex.muscle} • Nível: {ex.level}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setExecutionModalItem(ex)} style={{ padding: 10, marginRight: 8 }}>
                    <MaterialCommunityIcons name="information" size={24} color="#adaaaa" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => addExercise(ex)} style={{ backgroundColor: '#262626', padding: 10, borderRadius: 12 }}>
                    <MaterialCommunityIcons name="plus" size={24} color="#CCFF00" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      )}

      {/* Execution Modal */}
      <Modal visible={!!executionModalItem} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setExecutionModalItem(null)}>
        <SafeAreaView style={styles.modalSafeContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{executionModalItem?.name}</Text>
            <TouchableOpacity onPress={() => setExecutionModalItem(null)}>
              <MaterialCommunityIcons name="close-circle" size={32} color="#adaaaa" />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1, padding: 16 }}>
            {/* Tag do Banco e Grupo */}
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
              <Text style={styles.limitText}>{executionModalItem?.muscle}</Text>
              <Text style={styles.limitText}>{executionModalItem?.level}</Text>
              <Text style={styles.limitText}>{executionModalItem?.environment}</Text>
            </View>

            {/* Imagens da API gringa ou local */}
            {(executionModalItem as any)?.freeDbId && (
              <View style={styles.imagesContainer}>
                <Image 
                  source={{ uri: `https://raw.githubusercontent.com/bruno-florencio/syntrix-fit/main/exercise-images/${(executionModalItem as any).freeDbId}/0.jpg` }} 
                  style={styles.executionImage} 
                  resizeMode="cover"
                />
                <Image 
                  source={{ uri: `https://raw.githubusercontent.com/bruno-florencio/syntrix-fit/main/exercise-images/${(executionModalItem as any).freeDbId}/1.jpg` }} 
                  style={styles.executionImage} 
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Dica de Ouro Cues */}
            <View style={styles.cueBox}>
              <MaterialCommunityIcons name="lightbulb-on-outline" size={20} color="#CCFF00" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                {executionModalItem?.cues.map((cue, i) => (
                  <Text key={i} style={styles.cueText}>{cue}</Text>
                ))}
              </View>
            </View>

            {/* Step-by-Step Instructions */}
            <Text style={styles.instructionTitle}>Passo a Passo</Text>
            <View style={styles.instructionsWrapper}>
              {(executionModalItem as any)?.instructions?.length > 0 ? (
                (executionModalItem as any).instructions.map((step: string, index: number) => (
                  <View key={index} style={styles.stepRow}>
                    <Text style={styles.stepNumber}>{index + 1}.</Text>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.stepText}>Nenhuma biomecânica técnica detalhada fornecida ainda. Foque no cue de ouro acima.</Text>
              )}
            </View>

            {/* Espaçamento final */}
            <View style={{ height: 60 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e0e' },
  header: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 20, marginBottom: 16, alignItems: 'center', justifyContent: 'space-between' },
  titleInput: { color: '#ffffff', fontSize: 24, fontWeight: 'bold', flex: 1, marginRight: 16, borderBottomWidth: 1, borderBottomColor: '#262626', paddingBottom: 4 },
  saveBtn: { backgroundColor: '#CCFF00', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, minWidth: 80, alignItems: 'center' },
  saveText: { color: '#0e0e0e', fontWeight: 'bold', fontSize: 14 },
  
  tabsContainer: { paddingHorizontal: 8, marginBottom: 16 },
  tabBtn: { paddingVertical: 8, paddingHorizontal: 16, marginHorizontal: 8, borderRadius: 20, backgroundColor: '#1a1919', borderWidth: 1, borderColor: '#262626', flexDirection: 'row', alignItems: 'center' },
  tabBtnActive: { backgroundColor: 'rgba(204, 255, 0, 0.1)', borderColor: '#CCFF00' },
  tabText: { color: '#adaaaa', fontWeight: 'bold', fontSize: 14 },
  tabTextActive: { color: '#CCFF00' },
  tabBadge: { backgroundColor: '#262626', borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  tabBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  selectedWrapper: { paddingHorizontal: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: '#adaaaa', fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },
  limitText: { color: '#CCFF00', fontWeight: 'bold', fontSize: 12, backgroundColor: 'rgba(204, 255, 0, 0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  
  exerciseRow: { flexDirection: 'row', backgroundColor: '#1a1919', padding: 16, borderRadius: 16, alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#262626' },
  indexCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#262626', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  indexText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  
  exerciseDetails: { flex: 1 },
  exerciseName: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  setsWrapper: { flexDirection: 'row', alignItems: 'center' },
  setsText: { color: '#CCFF00', fontWeight: 'bold', fontSize: 12 },
  techniqueBadge: { marginLeft: 12, backgroundColor: '#262626', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  techniqueActive: { backgroundColor: 'rgba(204, 255, 0, 0.15)', borderColor: '#CCFF00', borderWidth: 1 },
  techniqueText: { color: '#adaaaa', fontSize: 10, fontWeight: 'bold' },
  techniqueActiveText: { color: '#CCFF00' },
  
  addExerciseBtn: { borderWidth: 2, borderColor: '#262626', borderStyle: 'dashed', padding: 24, borderRadius: 16, alignItems: 'center', marginTop: 8 },
  addBtnText: { color: '#adaaaa', fontWeight: 'bold', fontSize: 12, letterSpacing: 1 },

  pickerContainer: { flex: 1, paddingHorizontal: 16, backgroundColor: '#141414', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20 },
  pickerHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  bankRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a1919', padding: 16, borderRadius: 12, marginBottom: 8 },
  bankName: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  bankGroup: { color: '#adaaaa', fontSize: 12, marginTop: 4 },

  modalSafeContainer: { flex: 1, backgroundColor: '#0e0e0e' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#262626' },
  modalTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', flex: 1 },
  imagesContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  executionImage: { flex: 1, height: 180, borderRadius: 12, backgroundColor: '#1a1919' },
  cueBox: { backgroundColor: 'rgba(204, 255, 0, 0.05)', padding: 16, borderRadius: 12, flexDirection: 'row', marginBottom: 24, borderWidth: 1, borderColor: 'rgba(204, 255, 0, 0.2)' },
  cueText: { color: '#CCFF00', fontSize: 14, fontWeight: '500', marginBottom: 4 },
  instructionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  instructionsWrapper: { backgroundColor: '#1a1919', padding: 16, borderRadius: 12 },
  stepRow: { flexDirection: 'row', marginBottom: 12 },
  stepNumber: { color: '#CCFF00', fontWeight: 'bold', fontSize: 16, marginRight: 12, width: 20 },
  stepText: { color: '#adaaaa', fontSize: 15, flex: 1, lineHeight: 22 }
});
