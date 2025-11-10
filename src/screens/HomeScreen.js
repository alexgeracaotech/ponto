import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import { auth, firestore, ServerTimestamp } from '../services/firebaseConfig';
import { getPunchesGroupedByDay } from '../services/statisticsService';

const HomeScreen = ({ navigate }) => {
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const [currentDate, setCurrentDate] = useState('');
  const [delay, setDelay] = useState(null); // Atraso do dia

  // Calcula o atraso do dia (comparando primeira entrada com horário padrão 08:00)
  const calculateDelay = useCallback(async () => {
    try {
      const groupedPunches = await getPunchesGroupedByDay();
      const today = new Date();
      const todayKey = today.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      const todayPunches = groupedPunches[todayKey] || [];
      if (todayPunches.length > 0) {
        // Ordena por timestamp (mais antigo primeiro)
        const sortedPunches = [...todayPunches].sort((a, b) => {
          const timeA = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
          const timeB = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);
          return timeA - timeB;
        });

        // Primeira entrada do dia
        const firstEntry = sortedPunches[0];
        if (firstEntry) {
          const entryTime = firstEntry.timestamp instanceof Date 
            ? firstEntry.timestamp 
            : new Date(firstEntry.timestamp);
          
          // Horário padrão de entrada: 08:00
          const standardEntryTime = new Date(entryTime);
          standardEntryTime.setHours(8, 0, 0, 0);

          if (entryTime > standardEntryTime) {
            const diffMs = entryTime - standardEntryTime;
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            setDelay(diffMinutes);
          } else {
            setDelay(0);
          }
        }
      } else {
        setDelay(null);
      }
    } catch (error) {
      console.error('Error calculating delay:', error);
    }
  }, []);

  // Atualiza a data atual e calcula atraso
  useEffect(() => {
    const updateDate = () => {
      const today = new Date();
      const formattedDate = today.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
      setCurrentDate(formattedDate);
    };
    updateDate();
    // Atualiza a cada minuto para manter a data/hora atualizada
    const interval = setInterval(updateDate, 60000);
    
    // Calcula atraso
    calculateDelay();
    
    return () => clearInterval(interval);
  }, [calculateDelay]);

  const handlePunchClock = async () => {
    setLoading(true); // Ativa o estado de carregamento

    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    try {
      const user = auth.currentUser;  // Usando a variável 'auth' corretamente agora

      if (!user) {
        Alert.alert('Erro', 'Usuário não autenticado.');
        setLoading(false); // Desativa o carregamento
        return;
      }

      console.log('Usuário autenticado:', user.uid); // Log do UID do usuário

      // Salva o "batimento de ponto" no Firestore
      const punchesRef = firestore.collection('users').doc(user.uid).collection('punches');
      const docRef = await punchesRef.add({
        timestamp: ServerTimestamp(), // Salva o timestamp no Firestore
        time: timeString, // Hora do ponto
        createdAt: ServerTimestamp(), // Hora de criação
      });

      console.log('Ponto salvo com sucesso:', docRef.id); // Log de sucesso

      // Recalcula atraso após bater ponto
      await calculateDelay();

      // Mostra alerta de sucesso
      Alert.alert(
        '✅ Ponto Batido!',
        `Seu ponto foi registrado com sucesso!\n\nHorário: ${timeString}\n\nO registro foi salvo no banco de dados.\n\nVerifique o histórico na aba Frequência.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Erro ao salvar no Firestore:', error); // Log de erro
      Alert.alert('Erro', 'Falha ao registrar o ponto.');
    } finally {
      setLoading(false); // Desativa o carregamento
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader navigate={navigate} />
      <View style={styles.content}>
        <Text style={styles.title}>
          {currentDate || new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          })}
        </Text>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={handlePunchClock}
          disabled={loading} // Desativa o botão enquanto está carregando
        >
          <Text style={styles.homeButtonText}>
            {loading ? 'Carregando...' : 'Bater Ponto'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeButton} onPress={() => navigate('Frequency')}>
          <Text style={styles.homeButtonText}>Frequência</Text>
        </TouchableOpacity>

        <View style={styles.homeInfoBox}>
          <Feather name="clock" size={24} color={delay && delay > 0 ? COLORS.red : COLORS.green} />
          <Text style={[styles.homeButtonText, delay && delay > 0 && { color: COLORS.red }]}>
            {delay !== null 
              ? delay > 0 
                ? `Atraso: ${delay}min` 
                : 'No horário'
              : 'Sem registro hoje'}
          </Text>
        </View>
      </View>
      <AppFooter navigate={navigate} active="Home" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.darkBg, paddingHorizontal: 15 },
  content: { flex: 1, paddingHorizontal: 10, paddingTop: 20 },
  title: { color: COLORS.white, fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  homeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    paddingVertical: 30,
    marginBottom: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  homeInfoBox: {
    backgroundColor: COLORS.lightBg,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 15,
    paddingVertical: 30,
    marginBottom: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  homeButtonText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default HomeScreen;
