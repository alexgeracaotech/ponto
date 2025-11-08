
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

const PrivacyScreen = ({ navigate }) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigate('Settings')}>
        <Feather name="chevron-left" size={28} color={COLORS.gray} />
      </TouchableOpacity>
      <Text style={styles.title}>Privacidade</Text>
      <View style={{ width: 28 }} />
    </View>
    <ScrollView style={styles.content}>
      <Text style={styles.sectionTitle}>Política de Privacidade</Text>
      <Text style={styles.paragraph}>
        A sua privacidade é importante para nós. É política do The Ponto Estagiário respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no nosso aplicativo.
      </Text>
      <Text style={styles.paragraph}>
        Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.
      </Text>
      
      <Text style={styles.sectionTitle}>Uso de Dados</Text>
      <Text style={styles.paragraph}>
        Os dados coletados incluem informações de registro (nome, email, telefone), dados de ponto (horários de entrada e saída) e justificativas de faltas/atrasos. Todos os dados são utilizados exclusivamente para o controle de frequência e gestão de ponto.
      </Text>

      <Text style={styles.sectionTitle}>Armazenamento</Text>
      <Text style={styles.paragraph}>
        Seus dados são armazenados de forma segura no Firebase, utilizando criptografia e seguindo as melhores práticas de segurança. Os dados de frequência e horários são acessíveis apenas por você e pela administração autorizada.
      </Text>

      <Text style={styles.sectionTitle}>Seus Direitos</Text>
      <Text style={styles.paragraph}>
        Você tem o direito de acessar, corrigir ou solicitar a exclusão dos seus dados pessoais a qualquer momento. Para isso, entre em contato com a administração através do aplicativo ou diretamente com o suporte.
      </Text>

      <Text style={styles.sectionTitle}>Alterações na Política</Text>
      <Text style={styles.paragraph}>
        Podemos atualizar esta política de privacidade periodicamente. Recomendamos que você revise esta página ocasionalmente para se manter informado sobre como protegemos suas informações.
      </Text>
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.darkBg, padding: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 15, marginBottom: 10 },
  title: { fontSize: 22, fontWeight: 'bold', color: COLORS.white },
  content: { flex: 1, paddingHorizontal: 10 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    color: COLORS.gray,
    lineHeight: 24,
    textAlign: 'justify',
    marginBottom: 15,
  },
});

export default PrivacyScreen;