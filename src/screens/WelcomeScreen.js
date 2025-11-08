import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

const WelcomeScreen = ({ navigate }) => (
  <View style={styles.container}>
    <View style={styles.logoContainer}>
      <Text style={styles.logoTextSmall}>THE</Text>
      <Text style={styles.logoTextLarge}>PONTO</Text>
      <Text style={styles.logoTextLarge}>ESTAGIÁRIO</Text>
    </View>
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={() => navigate('Login')}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigate('Register')}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 100,
  },
  logoTextSmall: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#00000020',
    paddingHorizontal: 8,
  },
  logoTextLarge: {
    color: COLORS.white,
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 60,
    width: '90%',
  },
  button: {
    backgroundColor: COLORS.white,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;