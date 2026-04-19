import { useAuth } from '@/context/AuthContext';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [workoutFinished, setWorkoutFinished] = useState(false);
  const [activeDays, setActiveDays] = useState(4); // Começa com 4 dias acessos de exemplo
  const { requireAuth, user } = useAuth();

  const handleFinishWorkout = () => {
    requireAuth(() => {
      if (!workoutFinished && activeDays < 7) {
        setWorkoutFinished(true);
        setActiveDays(prev => Math.min(prev + 1, 7));
      }
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Bom dia, {user ? user.displayName?.split(' ')[0] : 'Visitante'}!</Text>
        <TouchableOpacity
          onPress={() => requireAuth(() => console.log('Abrir Perfil no futuro'))}
          style={styles.profileIcon}
        >
          <FontAwesome5 name="user-circle" size={36} color={user ? "#CCFF00" : "#888"} />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>Ofensiva Semanal</Text>
          <Text style={styles.streakCount}>{activeDays} dias seguidos</Text>
        </View>

        <View style={styles.flamesContainer}>
          {[...Array(7)].map((_, i) => {
            const isLit = i < activeDays;
            return (
              <View key={i} style={[styles.flameWrapper, isLit && styles.flameWrapperLit]}>
                <FontAwesome5
                  name="fire-alt"
                  size={20}
                  color={isLit ? "#CCFF00" : "#444"}
                />
              </View>
            );
          })}
        </View>
      </View>

      {/* Ações Rápidas */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => requireAuth(() => router.push('/workouts'))}>
          <View style={styles.actionIconBg}>
            <MaterialCommunityIcons name="weight-lifter" size={28} color="#CCFF00" />
          </View>
          <Text style={styles.actionText}>Treinos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => requireAuth(() => router.push('/store'))}>
          <View style={styles.actionIconBg}>
            <FontAwesome5 name="shopping-bag" size={22} color="#CCFF00" />
          </View>
          <Text style={styles.actionText}>Loja Fit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => requireAuth(() => router.push('/coach'))}>
          <View style={styles.actionIconBg}>
            <MaterialCommunityIcons name="robot-outline" size={28} color="#CCFF00" />
          </View>
          <Text style={styles.actionText}>Coach IA</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => requireAuth(() => router.push('/nutrition'))}>
          <View style={styles.actionIconBg}>
            <MaterialCommunityIcons name="food-apple-outline" size={28} color="#CCFF00" />
          </View>
          <Text style={styles.actionText}>Nutrição</Text>
        </TouchableOpacity>
      </View>

      {/* Programas Populares */}
      <View style={styles.carouselSection}>
        <Text style={styles.sectionTitle}>Programas em Destaque</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselContainer}>

          <TouchableOpacity style={styles.programCard} onPress={() => requireAuth(() => { })}>
            <View style={styles.programIconWrapper}>
              <FontAwesome5 name="fire" size={32} color="#CCFF00" />
            </View>
            <View style={styles.programContent}>
              <Text style={styles.programTitle}>Mutação 90</Text>
              <Text style={styles.programSub}>Hipertrofia Extrema</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.programCard} onPress={() => requireAuth(() => { })}>
            <View style={styles.programIconWrapper}>
              <MaterialCommunityIcons name="run-fast" size={36} color="#CCFF00" />
            </View>
            <View style={styles.programContent}>
              <Text style={styles.programTitle}>Seca Barriga</Text>
              <Text style={styles.programSub}>HIIT & Cardio</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.programCard} onPress={() => requireAuth(() => { })}>
            <View style={styles.programIconWrapper}>
              <MaterialCommunityIcons name="yoga" size={36} color="#CCFF00" />
            </View>
            <View style={styles.programContent}>
              <Text style={styles.programTitle}>Mobilidade</Text>
              <Text style={styles.programSub}>Articulações zero dor</Text>
            </View>
          </TouchableOpacity>

        </ScrollView>
      </View>

      <View style={styles.workoutCard}>
        <Text style={styles.workoutTitle}>Treino do Dia</Text>
        <Text style={styles.workoutSubtitle}>Sessão de Hipertrofia</Text>
        <TouchableOpacity
          style={[styles.startButton, workoutFinished && styles.disabledButton]}
          onPress={handleFinishWorkout}
          disabled={workoutFinished}
        >
          <Text style={[styles.startButtonText, workoutFinished && styles.disabledButtonText]}>
            {workoutFinished ? 'TREINO CONCLUÍDO' : 'CONCLUIR TREINO (SIMULAR)'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e0e',
    padding: 16,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileIcon: {
    padding: 4,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  summaryCard: {
    backgroundColor: '#1a1919',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 16,
    color: '#adaaaa',
    fontWeight: 'bold',
  },
  streakCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#CCFF00',
  },
  flamesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flameWrapper: {
    width: 42,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#0e0e0e',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  flameWrapperLit: {
    borderColor: '#CCFF00',
    backgroundColor: 'rgba(204, 255, 0, 0.1)',
    shadowColor: '#CCFF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  actionButton: {
    alignItems: 'center',
    width: '22%',
  },
  actionIconBg: {
    backgroundColor: '#1a1919',
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#222',
  },
  actionText: {
    color: '#adaaaa',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  carouselSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  carouselContainer: {
    paddingRight: 16,
  },
  programCard: {
    backgroundColor: '#1a1919',
    width: 160,
    height: 200,
    borderRadius: 20,
    marginRight: 16,
    padding: 16,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#CCFF00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  programIconWrapper: {
    backgroundColor: 'rgba(204, 255, 0, 0.1)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  programContent: {
    marginTop: 'auto',
  },
  programTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  programSub: {
    color: '#CCFF00',
    fontSize: 12,
    fontWeight: '600',
  },
  workoutCard: {
    backgroundColor: '#201f1f',
    padding: 24,
    borderRadius: 16,
    minHeight: 200,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  workoutTitle: {
    fontSize: 14,
    color: '#CCFF00',
    marginBottom: 4,
    fontWeight: '600',
  },
  workoutSubtitle: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: '#CCFF00',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#333',
  },
  startButtonText: {
    color: '#0e0e0e',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButtonText: {
    color: '#aaa',
  },
});
