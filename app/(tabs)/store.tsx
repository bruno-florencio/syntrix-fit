import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';

const PRODUCTS = [
  { id: '1', name: 'Whey Protein Isolado - Gold', price: 'R$ 149.99', category: 'Suplementos' },
  { id: '2', name: 'Pré-Treino Blitz', price: 'R$ 89.99', category: 'Suplementos' },
  { id: '3', name: 'Cinto de Levantamento Pro', price: 'R$ 120.00', category: 'Acessórios' },
  { id: '4', name: 'Coqueteleira Neon', price: 'R$ 29.99', category: 'Acessórios' },
];

export default function StoreScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Loja</Text>
        <TouchableOpacity style={styles.cartBtn}>
          <Text style={styles.cartIcon}>🛒</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>2</Text></View>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Promo Banner */}
        <View style={styles.promoBanner}>
          <Text style={styles.promoText}>20% OFF</Text>
          <Text style={styles.promoSub}>Whey Concentrado Integral</Text>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          <TouchableOpacity style={[styles.chip, styles.chipActive]}><Text style={styles.chipTextActive}>Suplementos</Text></TouchableOpacity>
          <TouchableOpacity style={styles.chip}><Text style={styles.chipText}>Roupas</Text></TouchableOpacity>
          <TouchableOpacity style={styles.chip}><Text style={styles.chipText}>Acessórios</Text></TouchableOpacity>
          <TouchableOpacity style={styles.chip}><Text style={styles.chipText}>Equipamentos</Text></TouchableOpacity>
        </ScrollView>

        {/* Products Grid */}
        <View style={styles.gridContainer}>
          {PRODUCTS.map((prod) => (
            <View key={prod.id} style={styles.productCard}>
              <View style={styles.productImagePlaceholder} />
              <Text style={styles.productName}>{prod.name}</Text>
              <Text style={styles.productPrice}>{prod.price}</Text>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addText}>+ ADICIONAR</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e0e', paddingTop: 60 },
  header: { paddingHorizontal: 16, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#ffffff' },
  cartBtn: { position: 'relative', backgroundColor: '#1a1919', padding: 12, borderRadius: 24 },
  cartIcon: { fontSize: 18, color: '#ffffff' },
  badge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#CCFF00', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#0e0e0e', fontSize: 10, fontWeight: 'bold' },
  promoBanner: { marginHorizontal: 16, backgroundColor: '#201f1f', padding: 32, borderRadius: 16, marginBottom: 24, minHeight: 150, justifyContent: 'center' },
  promoText: { fontSize: 32, fontWeight: '900', color: '#CCFF00' },
  promoSub: { fontSize: 16, color: '#ffffff', fontWeight: 'bold' },
  chipScroll: { paddingLeft: 16, marginBottom: 24 },
  chip: { backgroundColor: '#1a1919', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginRight: 8 },
  chipActive: { backgroundColor: '#CCFF00' },
  chipText: { color: '#adaaaa', fontWeight: 'bold' },
  chipTextActive: { color: '#0e0e0e', fontWeight: 'bold' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 },
  productCard: { width: '50%', padding: 8, marginBottom: 16 },
  productImagePlaceholder: { backgroundColor: '#1a1919', height: 160, borderRadius: 16, marginBottom: 12 },
  productName: { color: '#ffffff', fontWeight: 'bold', fontSize: 14, marginBottom: 4 },
  productPrice: { color: '#adaaaa', fontSize: 14, marginBottom: 12 },
  addButton: { borderWidth: 1, borderColor: '#CCFF00', paddingVertical: 8, borderRadius: 20, alignItems: 'center' },
  addText: { color: '#CCFF00', fontWeight: 'bold', fontSize: 12 }
});
