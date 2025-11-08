import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, FlatList, View, TouchableOpacity } from 'react-native';
import { listPunches } from '../services/punchService';

export default function HistoryScreen({ navigate }) {
  const [items, setItems] = useState([]);

  useEffect(() => setItems(listPunches()), []);

  function renderItem({ item }) {
    const date = new Date(item.tsServer);
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return (
      <View style={styles.row}>
        <Text style={styles.tipo}>{item.tipo}</Text>
        <Text style={styles.time}>{hh}:{mm}:{ss}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Histórico</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(it) => it.id}
        ListEmptyComponent={<Text style={styles.empty}>Sem registros ainda.</Text>}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
      <TouchableOpacity onPress={() => navigate('BaterPonto')}>
        <Text style={styles.link}>Voltar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const DARK = '#0C0F14';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DARK, padding: 20 },
  title: { color: 'white', fontSize: 20, fontWeight: '800', marginBottom: 12 },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: '#141922', padding: 14, borderRadius: 10, marginBottom: 10,
  },
  tipo: { color: '#9BB5FF', fontWeight: '700' },
  time: { color: '#E6ECFF' },
  empty: { color: '#AAB7D6', marginTop: 10 },
  link: { color: '#9BB5FF', fontWeight: '700', textAlign: 'center', marginTop: 16 },
});
