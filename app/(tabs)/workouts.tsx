import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { WORKOUT_TEMPLATES } from '../../data/workoutDB';

export default function WorkoutsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Central de Treinos</Text>
        <Text style={styles.headerSub}>Escolha o seu caminho para a hipertrofia.</Text>
      </View>

      <ScrollView style={styles.listContainer}>
        
        {/* CTAs de Ação (Manual ou IA) */}
        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: '#1a1919', borderColor: '#CCFF00', borderWidth: 1 }]}
            onPress={() => router.push('/coach')}
          >
            <FontAwesome5 name="robot" size={24} color="#CCFF00" style={{ marginBottom: 12 }} />
            <Text style={styles.actionTitle}>IA Treinador</Text>
            <Text style={styles.actionSub}>Deixe o Agente montar o treino sob medida.</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: '#1a1919' }]}
            onPress={() => router.push('/workout-builder')}
          >
            <MaterialCommunityIcons name="weight-lifter" size={28} color="#fff" style={{ marginBottom: 10 }} />
            <Text style={styles.actionTitle}>Construir Manual</Text>
            <Text style={styles.actionSub}>Selecione livremente do banco científico.</Text>
          </TouchableOpacity>
        </View>

        {/* Templates Científicos */}
        <Text style={styles.sectionTitle}>Templates Baseados em Ciência</Text>
        
        {WORKOUT_TEMPLATES.map((prog, idx) => (
          <TouchableOpacity 
            key={prog.id} 
            style={[styles.card, { backgroundColor: idx % 2 === 0 ? '#1a1919' : '#141414' }]}
            onPress={() => {
              router.push({ pathname: '/workout-builder', params: { templateId: prog.id } });
            }}
          >
            <View style={styles.cardHeader}>
              <View style={styles.diffBadge}>
                <Text style={styles.cardDiff}>{prog.title.split(':')[0]}</Text>
              </View>
            </View>
            <Text style={styles.cardTitle}>{prog.title.split(':')[1]?.trim() || prog.title}</Text>
            <Text style={styles.cardDescription}>{prog.description}</Text>
            
            <View style={styles.playButton}>
              <Text style={styles.playText}>CARREGAR PLANO</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e0e', paddingTop: 60 },
  header: { paddingHorizontal: 16, marginBottom: 20 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  headerSub: { fontSize: 14, color: '#adaaaa' },
  
  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  actionCard: { flex: 1, padding: 16, borderRadius: 16, marginHorizontal: 8, minHeight: 140 },
  actionTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  actionSub: { color: '#adaaaa', fontSize: 12 },
  
  listContainer: { paddingHorizontal: 8, flex: 1 },
  sectionTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginLeft: 8, marginBottom: 16 },
  
  card: { padding: 20, borderRadius: 20, marginBottom: 16, marginHorizontal: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  diffBadge: { backgroundColor: 'rgba(204, 255, 0, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  cardDiff: { color: '#CCFF00', fontWeight: 'bold', fontSize: 12 },
  cardDuration: { color: '#adaaaa', fontSize: 12, fontWeight: 'bold' },
  cardTitle: { fontSize: 22, fontWeight: 'bold', color: '#ffffff', marginBottom: 8 },
  cardDescription: { color: '#adaaaa', fontSize: 14, marginBottom: 20, lineHeight: 20 },
  
  playButton: { backgroundColor: 'rgba(255, 255, 255, 0.1)', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, alignSelf: 'flex-start' },
  playText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12, letterSpacing: 1 },
});
