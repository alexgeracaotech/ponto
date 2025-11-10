import React, { useCallback, useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Image, Alert, Platform, ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import { auth } from '../services/firebaseConfig';
import { signOut } from 'firebase/auth';
import { getCurrentUserData } from '../services/userService';

const ProfileScreen = ({ navigate }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      navigate('Login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      Alert.alert('Erro', 'Não foi possível fazer logout. Tente novamente.');
    }
  }, [navigate]);

  const confirmLogout = useCallback(() => {
    // Web: usa window.confirm; Mobile: Alert nativo
    if (Platform.OS === 'web') {
      if (window.confirm('Deseja realmente sair?')) {
        handleLogout();
      }
    } else {
      Alert.alert(
        'Sair da conta',
        'Deseja realmente sair?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Sim, sair', style: 'destructive', onPress: handleLogout },
        ],
        { cancelable: true }
      );
    }
  }, [handleLogout]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const data = await getCurrentUserData();
      if (data) {
        setUserData(data);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentUser = auth.currentUser;
  const displayName = userData?.username || currentUser?.displayName || 'Usuário';
  const email = userData?.email || currentUser?.email || 'email@exemplo.com';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader navigate={navigate} title="Meu Perfil" backScreen="Home" />

      {/* paddingBottom para não ficar sob o footer e perder o toque */}
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 120 }}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Carregando dados...</Text>
          </View>
        ) : (
          <>
            <View style={styles.profileHeader}>
              <View style={styles.profileImageContainer}>
                <Text style={styles.profileInitials}>{initials}</Text>
              </View>
              <Text style={styles.profileName}>{displayName}</Text>
              <Text style={styles.profileEmail}>{email}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Informações Pessoais</Text>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Nome Completo:</Text>
                <Text style={styles.infoValue}>{userData?.username || 'N/A'}</Text>
              </View>
              {userData?.birthDate && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Data de Nascimento:</Text>
                  <Text style={styles.infoValue}>{userData.birthDate}</Text>
                </View>
              )}
              {userData?.gender && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Sexo:</Text>
                  <Text style={styles.infoValue}>{userData.gender}</Text>
                </View>
              )}
              {userData?.phone && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Telefone:</Text>
                  <Text style={styles.infoValue}>{userData.phone}</Text>
                </View>
              )}
              {userData?.country && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>País:</Text>
                  <Text style={styles.infoValue}>{userData.country}</Text>
                </View>
              )}
              {userData?.role && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Cargo:</Text>
                  <Text style={styles.infoValue}>{userData.role === 'estagiario' ? 'Estagiário' : userData.role}</Text>
                </View>
              )}
            </View>

            {(userData?.address || userData?.location) && (
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Endereço</Text>
                {userData?.address && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Logradouro:</Text>
                    <Text style={styles.infoValue}>{userData.address}</Text>
                  </View>
                )}
                {userData?.location && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Localização:</Text>
                    <Text style={styles.infoValue}>{userData.location}</Text>
                  </View>
                )}
              </View>
            )}
          </>
        )}

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigate('Settings')}
        >
          <Feather name="edit" size={20} color={COLORS.darkBg} />
          <Text style={styles.editButtonText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.editButton, { backgroundColor: COLORS.red, marginBottom: 50 }]}
          onPress={confirmLogout}
          activeOpacity={0.8}
        >
          <Feather name="log-out" size={20} color={COLORS.white} />
          <Text style={[styles.editButtonText, { color: COLORS.white }]}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>

      <AppFooter navigate={navigate} active="Profile" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.darkBg, paddingHorizontal: 15 },
  content: { flex: 1, paddingHorizontal: 10, paddingTop: 20 },

  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileInitials: {
    color: COLORS.white,
    fontSize: 36,
    fontWeight: 'bold',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.gray,
    marginTop: 10,
  },
  profileName: { fontSize: 24, fontWeight: 'bold', color: COLORS.white },
  profileEmail: { fontSize: 16, color: COLORS.gray },

  infoSection: { marginBottom: 25, backgroundColor: COLORS.lightBg, borderRadius: 15, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary, marginBottom: 15 },
  infoItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  infoLabel: { fontSize: 16, color: COLORS.gray },
  infoValue: { fontSize: 16, color: COLORS.white, fontWeight: '500' },

  editButton: {
    backgroundColor: COLORS.white, borderRadius: 30, paddingVertical: 15,
    alignItems: 'center', marginTop: 20, flexDirection: 'row', justifyContent: 'center',
  },
  editButtonText: { color: COLORS.darkBg, fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
});

export default ProfileScreen;
