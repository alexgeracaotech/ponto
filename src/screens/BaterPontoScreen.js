import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLORS } from '../constants/colors';
import { firestore, auth, ServerTimestamp } from '../services/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const BaterPontoScreen = ({ navigate }) => {
  const [status, setStatus] = useState('FORA'); // FORA | DENTRO | INTERVALO

  const handlePunchClock = async () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    try {
      const user = auth.currentUser;

      if (!user) {
        Alert.alert('Erro', 'Usuário não autenticado.');
        return;
      }

      // Salva o batimento de ponto no Firestore
      const punchesRef = collection(firestore, 'users', user.uid, 'punches');
      await addDoc(punchesRef, {
        timestamp: ServerTimestamp(), // Salva o timestamp no Firestore
        time: timeString, // Hora do ponto
        createdAt: ServerTimestamp(), // Hora de criação
      });

      // Redireciona para a tela de Ponto Batido com Sucesso
      navigate('PontoBatido');  // Navega para a tela de sucesso
    } catch (error) {
      console.error('Erro ao salvar no Firestore:', error);
      Alert.alert('Erro', 'Falha ao registrar o ponto.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bater Ponto</Text>
      
      <TouchableOpacity style={styles.button} onPress={handlePunchClock}>
        <Text style={styles.buttonText}>Bater Ponto</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.darkBg,
  },
  title: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BaterPontoScreen;
