import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const PROS = [
  { id: '1', name: 'Dra. Sarah Lopez', role: 'Nutricionista Esportiva', rating: '4.9 (120)', status: 'Disponível' },
  { id: '2', name: 'Mark Evans', role: 'Treinador de Elite', rating: '4.8 (85)', status: 'Ocupado' },
  { id: '3', name: 'Dr. John Doe', role: 'Fisioterapeuta', rating: '5.0 (42)', status: 'Disponível' },
];

export default function NutritionScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nutrição & Especialistas</Text>
      </View>

      {/* Segmented Control */}
      <View style={styles.segmentedControl}>
        <TouchableOpacity style={styles.segment}><Text style={styles.segmentText}>Meus Macros</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.segment, styles.segmentActive]}><Text style={styles.segmentTextActive}>Buscar Profissionais</Text></TouchableOpacity>
      </View>

      {/* Banner para Adesão de Nutricionistas */}
      <View style={styles.partnerBanner}>
        <Text style={styles.bannerTitle}>É Nutricionista ou Coach?</Text>
        <Text style={styles.bannerDesc}>
          Nosso plano oficial de assinaturas para profissionais de saúde será lançado em breve. Preencha a lista de interesse para aparecer em destaque no nosso app!
        </Text>
        <TouchableOpacity style={styles.bannerButton} onPress={() => console.log('Link para WhatsApp ou Form')}>
          <Text style={styles.bannerButtonText}>Entrar em Contato</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Encontrar Nutricionista ou Coach..."
          placeholderTextColor="#adaaaa"
        />
      </View>

      {/* Pros List */}
      <ScrollView style={styles.listContainer}>
        {PROS.map((pro) => (
          <View key={pro.id} style={styles.proCard}>
            <View style={styles.proAvatarPlaceholder} />
            <View style={styles.proInfo}>
              <Text style={styles.proName}>{pro.name}</Text>
              <Text style={styles.proRole}>{pro.role}</Text>
              <Text style={styles.proRating}>★ {pro.rating}</Text>
            </View>
            <TouchableOpacity style={styles.bookButton}>
              <Text style={styles.bookText}>AGENDAR</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e0e', paddingTop: 60 },
  header: { paddingHorizontal: 16, marginBottom: 16 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#ffffff' },
  segmentedControl: { flexDirection: 'row', marginHorizontal: 16, backgroundColor: '#1a1919', borderRadius: 20, padding: 4, marginBottom: 16 },
  segment: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 16 },
  segmentActive: { backgroundColor: '#262626' },
  segmentText: { color: '#adaaaa', fontWeight: 'bold' },
  segmentTextActive: { color: '#ffffff', fontWeight: 'bold' },
  searchContainer: { paddingHorizontal: 16, marginBottom: 16 },
  searchInput: { backgroundColor: '#1a1919', color: '#ffffff', padding: 14, borderRadius: 12, fontSize: 16 },
  listContainer: { paddingHorizontal: 16, flex: 1 },
  proCard: { backgroundColor: '#1a1919', padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  proAvatarPlaceholder: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#262626', marginRight: 16 },
  proInfo: { flex: 1 },
  proName: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  proRole: { fontSize: 14, color: '#adaaaa', marginBottom: 4 },
  proRating: { fontSize: 12, color: '#CCFF00', fontWeight: 'bold' },
  bookButton: { borderWidth: 1, borderColor: '#CCFF00', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  bookText: { color: '#CCFF00', fontWeight: 'bold', fontSize: 12 },
  partnerBanner: {
    backgroundColor: '#CCFF00',
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0e0e0e',
    marginBottom: 8,
  },
  bannerDesc: {
    fontSize: 14,
    color: '#222',
    lineHeight: 20,
    marginBottom: 16,
  },
  bannerButton: {
    backgroundColor: '#0e0e0e',
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  bannerButtonText: {
    color: '#CCFF00',
    fontWeight: 'bold',
    fontSize: 14,
  }
});
