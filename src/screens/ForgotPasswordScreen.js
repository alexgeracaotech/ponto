import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { auth } from '../services/firebaseConfig';

const ForgotPasswordScreen = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      return Alert.alert('Erro', 'Por favor, insira seu e-mail.');
    }

    try {
      setLoading(true);
      await auth.sendPasswordResetEmail(email.trim());
      Alert.alert(
        'Sucesso',
        'Um e-mail de redefinição de senha foi enviado. Verifique sua caixa de entrada.',
        [{ text: 'OK', onPress: () => navigate('Login') }]
      );
    } catch (error) {
      let errorMessage = 'Erro ao enviar e-mail de redefinição.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuário não encontrado.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'E-mail inválido.';
      }
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigate('Login')}>
          <Feather name="chevron-left" size={28} color={COLORS.gray} />
        </TouchableOpacity>
        <Text style={styles.title}>Esqueci a senha</Text>
        <View style={{ width: 28 }} />
      </View>
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="email-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
          <TextInput
            placeholder="Insira seu email"
            placeholderTextColor={COLORS.gray}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={handleResetPassword}
          disabled={loading}
        >
          <Text style={styles.buttonTextPrimary}>
            {loading ? 'Enviando...' : 'Redefinir senha'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigate('Login')}>
          <Text style={{ color: COLORS.gray, marginTop: 20, textAlign: 'center' }}>← Voltar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.darkBg, padding: 15 },
  content: { flex: 1, paddingHorizontal: 10, justifyContent: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 15 },
  title: { fontSize: 22, fontWeight: 'bold', color: COLORS.white },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.lightBg, borderRadius: 10, paddingHorizontal: 15, marginBottom: 15 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: COLORS.white, paddingVertical: 15, fontSize: 16 },
  buttonPrimary: { backgroundColor: COLORS.primary, borderRadius: 30, paddingVertical: 18, alignItems: 'center', marginBottom: 15 },
  buttonTextPrimary: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
});

export default ForgotPasswordScreen;
