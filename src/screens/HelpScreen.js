
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

const HelpScreen = ({ navigate }) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigate('Settings')}>
        <Feather name="chevron-left" size={28} color={COLORS.gray} />
      </TouchableOpacity>
      <Text style={styles.title}>Ajuda</Text>
      <View style={{ width: 28 }} />
    </View>
    <ScrollView style={styles.content}>
      <Text style={styles.sectionTitle}>Perguntas Frequentes (FAQ)</Text>
      
      <View style={styles.faqItem}>
        <Text style={styles.question}>1. Como eu bato o ponto?</Text>
        <Text style={styles.answer}>
          Na tela inicial, clique no botão "Bater Ponto". O aplicativo registrará o horário e, se habilitado, sua localização.
        </Text>
      </View>

      <View style={styles.faqItem}>
        <Text style={styles.question}>2. Como posso justificar uma falta ou atraso?</Text>
        <Text style={styles.answer}>
          Acesse a tela de "Frequência" e clique no botão "Justificar Falta/Atraso". Você poderá anexar um documento e uma descrição.
        </Text>
      </View>

      <View style={styles.faqItem}>
        <Text style={styles.question}>3. Como funciona o sistema de ENTRADA e SAÍDA?</Text>
        <Text style={styles.answer}>
          O sistema alterna automaticamente entre ENTRADA e SAÍDA. A primeira batida do dia é sempre ENTRADA (verde), a segunda é SAÍDA (vermelha), e assim por diante. Cada dia tem sua própria sequência.
        </Text>
      </View>

      <View style={styles.faqItem}>
        <Text style={styles.question}>4. Como vejo meu histórico de pontos?</Text>
        <Text style={styles.answer}>
          Acesse a aba "Frequência" para ver todos os seus pontos batidos, organizados por dia. Você também pode ver um resumo e estatísticas detalhadas.
        </Text>
      </View>

      <View style={styles.faqItem}>
        <Text style={styles.question}>5. Como funciona o resumo e estatísticas?</Text>
        <Text style={styles.answer}>
          Na tela de Frequência, você pode acessar "Resumo" para ver horas trabalhadas e "Estatísticas" para ver gráficos de frequência, faltas e justificativas do mês.
        </Text>
      </View>

      <View style={styles.faqItem}>
        <Text style={styles.question}>6. Meus dados estão seguros?</Text>
        <Text style={styles.answer}>
          Sim. Seus dados são criptografados e armazenados de forma segura no Firebase. Apenas você e a administração têm acesso aos seus dados. Para mais detalhes, consulte nossa Política de Privacidade.
        </Text>
      </View>
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.darkBg, padding: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 15, marginBottom: 10 },
  title: { fontSize: 22, fontWeight: 'bold', color: COLORS.white },
  content: { flex: 1, paddingHorizontal: 10 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary, marginTop: 20, marginBottom: 20, },
  faqItem: { marginBottom: 25 },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  answer: {
    fontSize: 16,
    color: COLORS.gray,
    lineHeight: 24,
  },
});

export default HelpScreen;