import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';

const MenuScreen = ({ navigate }) => (
    <SafeAreaView style={styles.container}>
        <AppHeader navigate={navigate} title="Olá Estagiário!" backScreen="Home" />
        <View style={styles.content}>
            <View style={styles.menuSection}>
                <Text style={styles.menuSectionTitle}>Menu</Text>
                <Ionicons name="caret-down" size={24} color={COLORS.primary} />
            </View>
            <TouchableOpacity style={styles.menuLink} onPress={() => navigate('Notifications')}>
                <Text style={styles.menuLinkText}>Notificações</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuLink} onPress={() => navigate('Settings')}>
                <Text style={styles.menuLinkText}>Configurações</Text>
            </TouchableOpacity>
        </View>
        <AppFooter navigate={navigate} active="Profile" />
    </SafeAreaView>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.darkBg, paddingHorizontal: 15 },
  content: { flex: 1, paddingHorizontal: 10, paddingTop: 20 },
  menuSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.lightGray, paddingBottom: 10, marginBottom: 10 },
  menuSectionTitle: { color: COLORS.white, fontSize: 20, fontWeight: 'bold' },
  menuLink: { paddingVertical: 15 },
  menuLinkText: { color: COLORS.gray, fontSize: 18 },
});

export default MenuScreen;