import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView, Alert, Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { auth } from '../services/firebaseConfig';
import { createUserDocument, verifyUserDocumentExists } from '../services/userService';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const RegisterScreen = ({ navigate }) => {
  const [gender, setGender] = useState('Masculino');
  const [username, setUsername] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Format phone number
  const formatPhone = (text) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, (match, p1, p2, p3) => {
        if (p3) return `(${p1}) ${p2}-${p3}`;
        if (p2) return `(${p1}) ${p2}`;
        if (p1) return `(${p1}`;
        return numbers;
      });
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, (match, p1, p2, p3) => {
      if (p3) return `(${p1}) ${p2}-${p3}`;
      if (p2) return `(${p1}) ${p2}`;
      return `(${p1}`;
    });
  };

  // Format date DD/MM/YYYY
  const formatDate = (text) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  };

  // Validate email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validate date format
  const validateDate = (date) => {
    if (!date) return true; // Optional field
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(date)) return false;
    const [, day, month, year] = date.match(dateRegex);
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    if (d < 1 || d > 31 || m < 1 || m > 12 || y < 1900 || y > new Date().getFullYear()) {
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    // Clear previous errors
    setErrors({});
    const newErrors = {};

    // Validate required fields
    if (!username.trim()) {
      newErrors.username = 'Nome de usuário é obrigatório.';
    }

    if (!country.trim()) {
      newErrors.country = 'País é obrigatório.';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório.';
    } else if (phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Telefone inválido.';
    }

    if (!email.trim()) {
      newErrors.email = 'E-mail é obrigatório.';
    } else if (!validateEmail(email.trim())) {
      newErrors.email = 'E-mail inválido.';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória.';
    } else if (password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirme sua senha.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem.';
    }

    if (birthDate && !validateDate(birthDate)) {
      newErrors.birthDate = 'Data inválida. Use o formato DD/MM/AAAA.';
    }

    // If there are errors, show them
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.values(newErrors)[0];
      Alert.alert('Erro de Validação', firstError);
      return;
    }

    try {
      setLoading(true);
      
      // Step 1: Create user in Firebase Authentication
      console.log('Creating user in Firebase Auth...');
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      console.log('User created in Auth:', user.uid);

      // Step 2: Prepare user data for Firestore
      const userData = {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        country: country.trim(),
        phone: phone.trim(),
        gender: gender || 'Masculino',
        birthDate: birthDate || null,
        address: address.trim() || null,
        location: location.trim() || null,
        role: 'estagiario', // Default role
      };

      // Step 3: Save user data to Firestore using service
      console.log('=== REGISTRATION: Saving to Firestore ===');
      console.log('User UID:', user.uid);
      console.log('User Data:', userData);
      
      const savedUserData = await createUserDocument(user.uid, userData);
      console.log('=== REGISTRATION: Data Saved Successfully ===');
      console.log('Saved User Data:', savedUserData);
      
      // Verify the data was actually saved
      const exists = await verifyUserDocumentExists(user.uid);
      if (!exists) {
        throw new Error('Falha ao verificar se os dados foram salvos. Tente novamente.');
      }
      console.log('=== REGISTRATION: Verification Complete - Data is in Firebase ===');

      // Step 4: Update user profile in Auth (optional but good practice)
      try {
        await updateProfile(user, {
          displayName: username.trim(),
        });
        console.log('User profile updated in Auth');
      } catch (profileError) {
        console.warn('Could not update user profile:', profileError);
        // Don't fail registration if profile update fails
      }

      // Step 5: Success - Show alert and navigate to Login
      Alert.alert(
        'Sucesso!',
        'Conta criada com sucesso! Seus dados foram salvos no banco de dados. Agora você pode fazer login.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to login screen after successful registration
              navigate('Login');
            }
          }
        ]
      );

    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Full error:', JSON.stringify(error, null, 2));
      
      let errorMessage = 'Erro ao criar conta.';
      let shouldDeleteUser = false;

      // Handle Firebase Auth errors
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este e-mail já está em uso.';
        setErrors({ ...errors, email: errorMessage });
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'E-mail inválido.';
        setErrors({ ...errors, email: errorMessage });
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Senha muito fraca. Use pelo menos 6 caracteres.';
        setErrors({ ...errors, password: errorMessage });
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Erro de conexão com o Firebase. Verifique:\n1. Sua conexão com a internet\n2. Se o Firebase está acessível\n3. Se há bloqueadores de anúncio ou extensões bloqueando requisições\n\nTente novamente ou verifique o console do navegador (F12) para mais detalhes.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = '⚠️ AUTENTICAÇÃO NÃO HABILITADA ⚠️\n\nO método de autenticação por Email/Senha não está habilitado no Firebase Console.\n\nPara corrigir:\n1. Acesse: https://console.firebase.google.com/\n2. Selecione o projeto: estagio-13e16\n3. Vá em Authentication → Sign-in method\n4. Clique em "Email/Password"\n5. Habilite "Enable" e clique em "Save"\n\nDepois disso, tente registrar novamente.';
      } else if (error.code === 'permission-denied' || error.code?.includes('permission')) {
        errorMessage = 'Permissão negada. Verifique as regras de segurança do Firestore no Firebase Console.';
        shouldDeleteUser = true;
      } else if (error.code === 'unavailable') {
        errorMessage = 'Serviço temporariamente indisponível. Tente novamente mais tarde.';
      } else if (error.message) {
        errorMessage = `${error.message}. Código: ${error.code || 'N/A'}`;
      }

      // If user was created in Auth but Firestore save failed, delete the Auth user
      if (shouldDeleteUser && auth.currentUser) {
        try {
          const { deleteUser } = await import('firebase/auth');
          await deleteUser(auth.currentUser);
          console.log('Deleted Auth user due to Firestore error');
        } catch (deleteError) {
          console.error('Error deleting Auth user:', deleteError);
        }
      }

      Alert.alert('Erro ao Criar Conta', errorMessage);
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

        <Text style={styles.title}>Registrar</Text>

        <TouchableOpacity>
          <Feather name="bell" size={24} color={COLORS.white} />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>1</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View>
          <TextInput
            placeholder="Nome Usuário *"
            placeholderTextColor={COLORS.gray}
            style={[styles.inputLine, errors.username && styles.inputError]}
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              if (errors.username) setErrors({ ...errors, username: null });
            }}
          />
          {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ width: '48%' }}>
            <TextInput
              placeholder="País *"
              placeholderTextColor={COLORS.gray}
              style={[styles.inputLine, errors.country && styles.inputError]}
              value={country}
              onChangeText={(text) => {
                setCountry(text);
                if (errors.country) setErrors({ ...errors, country: null });
              }}
            />
            {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}
          </View>
          <View style={{ width: '48%' }}>
            <TextInput
              placeholder="Telefone *"
              placeholderTextColor={COLORS.gray}
              style={[styles.inputLine, errors.phone && styles.inputError]}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(text) => {
                const formatted = formatPhone(text);
                setPhone(formatted);
                if (errors.phone) setErrors({ ...errors, phone: null });
              }}
              maxLength={15}
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>
        </View>

        <View>
          <TextInput
            placeholder="Email *"
            placeholderTextColor={COLORS.gray}
            style={[styles.inputLine, errors.email && styles.inputError]}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors({ ...errors, email: null });
            }}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        {/* --- Sexo (Rádio) --- */}
        <View style={styles.radioContainer}>
          <Text style={{ color: COLORS.gray }}>Sexo</Text>

          <TouchableOpacity
            style={styles.radioOptions}
            onPress={() => setGender('Masculino')}
            accessibilityRole="radio"
            accessibilityState={{ selected: gender === 'Masculino' }}
          >
            <Feather
              name={gender === 'Masculino' ? 'check-circle' : 'circle'}
              size={20}
              color={gender === 'Masculino' ? COLORS.primary : COLORS.gray}
            />
            <Text style={{ color: COLORS.white, marginLeft: 8 }}>Masculino</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioOptions}
            onPress={() => setGender('Feminino')}
            accessibilityRole="radio"
            accessibilityState={{ selected: gender === 'Feminino' }}
          >
            <Feather
              name={gender === 'Feminino' ? 'check-circle' : 'circle'}
              size={20}
              color={gender === 'Feminino' ? COLORS.primary : COLORS.gray}
            />
            <Text style={{ color: COLORS.white, marginLeft: 8 }}>Feminino</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dateContainer}>
          <TextInput
            placeholder="Data de Nascimento (DD/MM/AAAA)"
            placeholderTextColor={COLORS.gray}
            style={[styles.inputLine, errors.birthDate && styles.inputError]}
            value={birthDate}
            onChangeText={(text) => {
              const formatted = formatDate(text);
              setBirthDate(formatted);
              if (errors.birthDate) setErrors({ ...errors, birthDate: null });
            }}
            keyboardType="numeric"
            maxLength={10}
          />
          <Feather name="calendar" size={20} color={COLORS.gray} style={styles.calendarIcon} />
        </View>
        {errors.birthDate && <Text style={styles.errorText}>{errors.birthDate}</Text>}

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Senha *"
            placeholderTextColor={COLORS.gray}
            style={[styles.inputLine, styles.passwordInput, errors.password && styles.inputError]}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors({ ...errors, password: null });
            }}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Feather
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={COLORS.gray}
            />
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Confirmar Senha *"
            placeholderTextColor={COLORS.gray}
            style={[styles.inputLine, styles.passwordInput, errors.confirmPassword && styles.inputError]}
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
            }}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Feather
              name={showConfirmPassword ? 'eye-off' : 'eye'}
              size={20}
              color={COLORS.gray}
            />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

        <TextInput
          placeholder="Endereço"
          placeholderTextColor={COLORS.gray}
          style={styles.inputLine}
          value={address}
          onChangeText={setAddress}
        />

        <TextInput
          placeholder="Localização"
          placeholderTextColor={COLORS.gray}
          style={styles.inputLine}
          value={location}
          onChangeText={setLocation}
        />

        <TouchableOpacity
          style={[
            styles.buttonPrimary,
            { marginTop: 30, opacity: loading ? 0.6 : 1 },
            loading && { pointerEvents: 'none' }
          ]}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonTextPrimary}>
            {loading ? 'Criando conta...' : 'Registrar'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.darkBg, padding: 15 },
  content: { flex: 1, paddingHorizontal: 10 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 10, paddingVertical: 15
  },
  title: { fontSize: 22, fontWeight: 'bold', color: COLORS.white },
  inputLine: {
    borderBottomWidth: 1, borderBottomColor: COLORS.gray,
    color: COLORS.white, paddingVertical: 15, fontSize: 16, marginBottom: 20
  },
  rowBetween: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary, borderRadius: 30,
    paddingVertical: 18, alignItems: 'center', marginBottom: 15
  },
  buttonTextPrimary: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  notificationBadge: {
    position: 'absolute', right: -5, top: -5, backgroundColor: COLORS.red,
    borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center'
  },
  notificationText: { color: 'white', fontSize: 12, fontWeight: 'bold' },

  radioContainer: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 20
  },
  radioOptions: {
    flexDirection: 'row', alignItems: 'center', marginLeft: 20
  },
  dateContainer: {
    position: 'relative',
    marginBottom: 20
  },
  calendarIcon: {
    position: 'absolute',
    right: 0,
    top: 15,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 0,
    top: 15,
    padding: 5,
  },
  inputError: {
    borderBottomColor: COLORS.red,
  },
  errorText: {
    color: COLORS.red,
    fontSize: 12,
    marginTop: -15,
    marginBottom: 15,
    marginLeft: 5,
  },
});

export default RegisterScreen;
