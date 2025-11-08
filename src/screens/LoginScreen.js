import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { auth } from '../services/firebaseConfig';
import { getUserDocument } from '../services/userService';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

const LoginScreen = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    // Validation
    if (!email.trim() || !password) {
      return Alert.alert('Erro', 'Preencha e-mail e senha');
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return Alert.alert('Erro', 'E-mail inválido');
    }

    try {
      setLoading(true);
      console.log('=== INÍCIO DO LOGIN ===');
      console.log('Email:', email.trim().toLowerCase());

      // Step 1: Authenticate user with Firebase Auth
      console.log('Passo 1: Autenticando usuário no Firebase Auth...');
      const userCredential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      const user = userCredential.user;
      console.log('✅ Usuário autenticado com sucesso!');
      console.log('UID:', user.uid);
      console.log('Email verificado:', user.emailVerified);

      // Step 2: Fetch user data from Firestore
      console.log('Passo 2: Buscando dados do usuário no Firestore...');
      const userData = await getUserDocument(user.uid);

      // Step 3: Verify user data exists in database
      console.log('Passo 3: Verificando se o usuário existe no banco de dados...');
      if (!userData) {
        console.error('❌ ERRO: Usuário não encontrado no Firestore!');
        console.log('O usuário foi autenticado no Firebase Auth, mas não existe documento no Firestore.');
        await signOut(auth);
        Alert.alert(
          'Login Não Realizado',
          'Usuário não encontrado no banco de dados. Por favor, verifique suas credenciais ou registre-se novamente.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Stay on login screen
              }
            }
          ]
        );
        setLoading(false);
        return;
      }
      console.log('✅ Usuário encontrado no banco de dados!');
      console.log('Dados do usuário:', {
        username: userData.username,
        email: userData.email,
        role: userData.role,
        isActive: userData.isActive
      });

      // Step 4: Verify user is active
      console.log('Passo 4: Verificando se a conta está ativa...');
      if (userData.isActive === false) {
        console.error('❌ ERRO: Conta desativada!');
        await signOut(auth);
        Alert.alert(
          'Login Não Realizado',
          'Sua conta foi desativada. Entre em contato com o suporte.'
        );
        setLoading(false);
        return;
      }
      console.log('✅ Conta está ativa!');

      // Step 5: Verify email matches (additional security check)
      console.log('Passo 5: Verificando correspondência de email...');
      if (userData.email && userData.email.toLowerCase() !== email.trim().toLowerCase()) {
        console.error('❌ ERRO: Email não corresponde!');
        await signOut(auth);
        Alert.alert(
          'Login Não Realizado',
          'Os dados não correspondem ao banco de dados. Verifique suas credenciais.'
        );
        setLoading(false);
        return;
      }
      console.log('✅ Email corresponde!');

      // Step 6: All validations passed - User exists in database
      console.log('=== TODAS AS VERIFICAÇÕES PASSARAM ===');
      console.log('✅ Usuário autenticado no Firebase Auth');
      console.log('✅ Usuário encontrado no Firestore');
      console.log('✅ Conta está ativa');
      console.log('✅ Email corresponde');
      console.log('Dados do usuário:', {
        username: userData.username,
        email: userData.email,
        role: userData.role
      });

      // Step 7: Navigate to Home screen
      console.log('Passo 7: Redirecionando para a tela Home...');
      
      // Reset loading state before navigation
      setLoading(false);
      
      // Navigate to Home screen immediately
      if (navigate && typeof navigate === 'function') {
        navigate('Home');
        console.log('✅ Navegação para Home realizada com sucesso!');
        console.log('=== LOGIN CONCLUÍDO COM SUCESSO ===');
      } else {
        console.error('❌ ERRO: Função de navegação não disponível!');
        Alert.alert('Erro', 'Erro ao navegar para a tela inicial.');
        return;
      }
      
      // Show success alert after navigation
      setTimeout(() => {
        Alert.alert(
          'Login Realizado com Sucesso!',
          `Bem-vindo, ${userData.username || user.email}!\n\nSeus dados foram verificados no banco de dados do Firebase.`
        );
      }, 300);

    } catch (error) {
      console.error('Login error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);

      let errorMessage = 'Login não realizado. Verifique suas credenciais.';
      
      // Handle Firebase Auth errors
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Login não realizado. Usuário não encontrado. Verifique seu e-mail ou registre-se.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Login não realizado. Senha incorreta. Tente novamente.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Login não realizado. E-mail inválido.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'Login não realizado. Esta conta foi desativada. Entre em contato com o suporte.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Login não realizado. Muitas tentativas falhadas. Tente novamente mais tarde.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Login não realizado. Erro de conexão. Verifique sua internet.';
      } else if (error.code === 'permission-denied') {
        errorMessage = 'Login não realizado. Erro ao acessar dados do usuário. Verifique as permissões do banco de dados.';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Login não realizado. Credenciais inválidas. Verifique seu e-mail e senha.';
      } else if (error.message) {
        errorMessage = `Login não realizado. ${error.message}`;
      }

      Alert.alert('Login Não Realizado', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigate('Welcome')}>
          <Feather name="chevron-left" size={28} color={COLORS.gray} />
        </TouchableOpacity>
        <Text style={styles.title}>Log in</Text>
        <View style={{ width: 28 }} />
      </View>
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Feather name="user" size={20} color={COLORS.gray} style={styles.inputIcon} />
          <TextInput
            placeholder="E-mail"
            placeholderTextColor={COLORS.gray}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Feather name="lock" size={20} color={COLORS.gray} style={styles.inputIcon} />
          <TextInput
            placeholder="Senha"
            placeholderTextColor={COLORS.gray}
            style={styles.input}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Feather
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={COLORS.gray}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <MaterialCommunityIcons
              name={rememberMe ? 'checkbox-marked' : 'checkbox-blank-outline'}
              size={24}
              color={rememberMe ? COLORS.primary : COLORS.gray}
            />
            <Text style={styles.optionsText}>Lembre de mim</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigate('ForgotPassword')}>
            <Text style={[styles.optionsText, { color: COLORS.primary }]}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.buttonPrimary, { opacity: loading ? 0.6 : 1 }]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonTextPrimary}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigate('Register')}>
          <Text style={styles.buttonTextSecondary}>Criar uma conta</Text>
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
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.lightBg, 
    borderRadius: 10, 
    paddingHorizontal: 15, 
    marginBottom: 15,
    position: 'relative'
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: COLORS.white, paddingVertical: 15, fontSize: 16, paddingRight: 40 },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    padding: 5,
  },
  optionsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, paddingHorizontal: 5 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
  optionsText: { color: COLORS.gray, marginLeft: 5 },
  buttonPrimary: { backgroundColor: COLORS.primary, borderRadius: 30, paddingVertical: 18, alignItems: 'center', marginBottom: 15 },
  buttonTextPrimary: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  buttonSecondary: { borderColor: COLORS.primary, borderWidth: 2, borderRadius: 30, paddingVertical: 16, alignItems: 'center' },
  buttonTextSecondary: { color: COLORS.primary, fontSize: 18, fontWeight: 'bold' },
});

export default LoginScreen;
