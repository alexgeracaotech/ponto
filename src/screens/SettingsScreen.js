import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

const SettingsScreen = ({ navigate }) => (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigate('Menu')}>
          <Feather name="chevron-left" size={28} color={COLORS.gray} />
        </TouchableOpacity>
        <Text style={styles.title}>Configurações</Text>
        <View style={{ width: 28 }} />
      </View>
      <View style={styles.content}>
        <TouchableOpacity style={styles.settingsButton} onPress={() => navigate('Notifications')}>
            <Text style={styles.settingsButtonText}>Notificações</Text>
        </TouchableOpacity>
         <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => navigate('Privacy')}
         >
            <Text style={styles.settingsButtonText}>Privacidade</Text>
        </TouchableOpacity>
         <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => navigate('Help')}
         >
            <Text style={styles.settingsButtonText}>Ajuda</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.darkBg, padding: 15 },
  content: { flex: 1, paddingHorizontal: 10, paddingTop: 30 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 15 },
  title: { fontSize: 22, fontWeight: 'bold', color: COLORS.white },
  settingsButton: { backgroundColor: COLORS.white, padding: 20, borderRadius: 20, alignItems: 'center', marginBottom: 15 },
  settingsButtonText: { color: '#603030', fontSize: 18, fontWeight: 'bold' },
});

export default SettingsScreen;