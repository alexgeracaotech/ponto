
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { auth, firestore, ServerTimestamp } from '../services/firebaseConfig';
import { collection, getDocs, query, orderBy, limit, addDoc } from 'firebase/firestore';

const FrequencyScreen = ({ navigate }) => {
  const [punches, setPunches] = useState([]);
  const [loadingPunches, setLoadingPunches] = useState(false);
  const [groupedPunches, setGroupedPunches] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [justificationDate, setJustificationDate] = useState('');
  const [justificationText, setJustificationText] = useState('');
  const [savingJustification, setSavingJustification] = useState(false);

  // Função para buscar os pontos do Firestore
  const fetchPunches = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      setLoadingPunches(true);
      const punchesRef = collection(firestore, 'users', user.uid, 'punches');
      
      let querySnapshot;
      try {
        const q = query(punchesRef, orderBy('timestamp', 'desc'), limit(100));
        querySnapshot = await getDocs(q);
      } catch (orderError) {
        console.warn('Erro ao ordenar por timestamp, buscando sem ordenação:', orderError);
        querySnapshot = await getDocs(punchesRef);
      }
      
      const punchesList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const timestamp = data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp || data.createdAt?.toDate || data.createdAt);
        
        punchesList.push({
          id: doc.id,
          time: data.time || 'N/A',
          timestamp: timestamp,
          createdAt: timestamp,
        });
      });
      
      // Ordena localmente por timestamp
      punchesList.sort((a, b) => {
        const timeA = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
        const timeB = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);
        return timeB - timeA; // Mais recente primeiro
      });
      
      setPunches(punchesList);
      
      // Agrupa os pontos por dia
      const grouped = {};
      punchesList.forEach((punch) => {
        const date = punch.timestamp instanceof Date ? punch.timestamp : new Date(punch.timestamp);
        const dateKey = date.toLocaleDateString('pt-BR', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        });
        
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        
        grouped[dateKey].push(punch);
      });
      
      // Ordena os pontos dentro de cada dia e calcula posição
      Object.keys(grouped).forEach(dateKey => {
        // Ordena por timestamp (mais recente primeiro)
        grouped[dateKey].sort((a, b) => {
          const timeA = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
          const timeB = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);
          return timeB - timeA;
        });
        
        // Calcula posição e tipo para cada ponto do dia
        grouped[dateKey] = grouped[dateKey].map((punch, index) => {
          const positionInDay = grouped[dateKey].length - index; // Posição reversa (1, 2, 3...)
          const isEntry = positionInDay % 2 === 1; // Ímpar = ENTRADA
          
          return {
            ...punch,
            positionInDay,
            isEntry,
          };
        });
      });
      
      setGroupedPunches(grouped);
      console.log('Pontos agrupados por dia:', Object.keys(grouped).length, 'dias');
    } catch (error) {
      console.error('Erro ao buscar pontos:', error);
    } finally {
      setLoadingPunches(false);
    }
  };

  // Carrega os pontos quando a tela é montada
  useEffect(() => {
    fetchPunches();
  }, []);

  // Formata a data para exibição
  const formatDateHeader = (dateString) => {
    const [day, month, year] = dateString.split('/');
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.toLocaleDateString('pt-BR', { weekday: 'short' });
    return `${dayOfWeek}, ${dateString}`;
  };

  // Formata data DD/MM/YYYY
  const formatDate = (text) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  };

  // Abre o modal de justificativa
  const openJustificationModal = () => {
    // Define a data padrão como hoje
    const today = new Date();
    const todayFormatted = today.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    setJustificationDate(todayFormatted);
    setJustificationText('');
    setModalVisible(true);
  };

  // Fecha o modal
  const closeModal = () => {
    setModalVisible(false);
    setJustificationDate('');
    setJustificationText('');
  };

  // Salva a justificativa no Firestore
  const handleSaveJustification = async () => {
    // Validação
    if (!justificationDate.trim()) {
      Alert.alert('Erro', 'Por favor, informe a data da falta/atraso.');
      return;
    }

    // Valida formato da data
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(justificationDate.trim())) {
      Alert.alert('Erro', 'Por favor, informe a data no formato DD/MM/AAAA.');
      return;
    }

    if (!justificationText.trim()) {
      Alert.alert('Erro', 'Por favor, informe o motivo da justificativa.');
      return;
    }

    try {
      setSavingJustification(true);
      const user = auth.currentUser;

      if (!user) {
        Alert.alert('Erro', 'Usuário não autenticado.');
        return;
      }

      // Converte a data para Date object
      const [day, month, year] = justificationDate.split('/');
      const dateObj = new Date(year, month - 1, day);

      // Salva a justificativa no Firestore
      const justificationsRef = collection(firestore, 'users', user.uid, 'justifications');
      await addDoc(justificationsRef, {
        date: justificationDate,
        dateTimestamp: dateObj,
        text: justificationText.trim(),
        createdAt: ServerTimestamp(),
        updatedAt: ServerTimestamp(),
      });

      console.log('Justificativa salva com sucesso');

      Alert.alert(
        '✅ Justificativa Salva!',
        'Sua justificativa foi registrada com sucesso.',
        [
          {
            text: 'OK',
            onPress: () => {
              closeModal();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Erro ao salvar justificativa:', error);
      Alert.alert('Erro', 'Falha ao salvar a justificativa. Tente novamente.');
    } finally {
      setSavingJustification(false);
    }
  };

  return (
  <SafeAreaView style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigate('Home')}>
        <Feather name="chevron-left" size={28} color={COLORS.gray} />
      </TouchableOpacity>
      <Text style={styles.title}>Frequência</Text>
      <View style={{ width: 28 }} />
    </View>
    <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Histórico de Pontos</Text>
        
        {loadingPunches ? (
          <Text style={styles.loadingText}>Carregando pontos...</Text>
        ) : Object.keys(groupedPunches).length === 0 ? (
          <Text style={styles.emptyText}>Nenhum ponto registrado ainda.</Text>
        ) : (
          Object.keys(groupedPunches)
            .sort((a, b) => {
              // Ordena as datas do mais recente para o mais antigo
              const [dayA, monthA, yearA] = a.split('/');
              const [dayB, monthB, yearB] = b.split('/');
              const dateA = new Date(yearA, monthA - 1, dayA);
              const dateB = new Date(yearB, monthB - 1, dayB);
              return dateB - dateA;
            })
            .map((dateKey) => (
            <View key={dateKey} style={styles.dayContainer}>
              <Text style={styles.dayHeader}>{formatDateHeader(dateKey)}</Text>
              {groupedPunches[dateKey].map((punch, index) => {
                const isEntry = punch.isEntry;
                const type = isEntry ? 'ENTRADA' : 'SAÍDA';
                const typeColor = isEntry ? COLORS.green : COLORS.red;
                const backgroundColor = isEntry ? COLORS.darkGreen : COLORS.darkRed;
                
                return (
                  <View 
                    key={punch.id || index} 
                    style={[
                      styles.punchItem,
                      { backgroundColor: backgroundColor, borderLeftWidth: 4, borderLeftColor: typeColor }
                    ]}
                  >
                    <View style={styles.punchItemLeft}>
                      <Feather 
                        name={isEntry ? "log-in" : "log-out"} 
                        size={18} 
                        color={typeColor} 
                      />
                      <View style={styles.punchInfo}>
                        <Text style={styles.punchTime}>{punch.time}</Text>
                        <Text style={[styles.punchType, { color: typeColor }]}>{type}</Text>
                      </View>
                    </View>
                    <Text style={styles.punchIndex}>#{punch.positionInDay}</Text>
                  </View>
                );
              })}
              {Object.keys(groupedPunches).indexOf(dateKey) < Object.keys(groupedPunches).length - 1 && (
                <View style={styles.daySeparator} />
              )}
            </View>
          ))
        )}

        <View style={{borderBottomWidth: 1, borderBottomColor: COLORS.lightGray, marginVertical: 20}} />

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigate('Summary')}
        >
          <Text style={styles.menuItemText}>Resumo</Text>
          <Feather name="chevron-right" size={24} color={COLORS.gray} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigate('Statistics')}
        >
          <Text style={styles.menuItemText}>Estatísticas</Text>
          <Feather name="chevron-right" size={24} color={COLORS.gray} />
        </TouchableOpacity>
    </ScrollView>
    <View style={styles.footerButtonContainer}>
        <TouchableOpacity 
          style={styles.buttonPrimary}
          onPress={openJustificationModal}
        >
          <Text style={styles.buttonTextPrimary}>Justificar Falta/Atraso</Text>
        </TouchableOpacity>
    </View>

    {/* Modal de Justificativa */}
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Justificar Falta/Atraso</Text>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Feather name="x" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Data da Falta/Atraso *</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/AAAA"
                placeholderTextColor={COLORS.gray}
                value={justificationDate}
                onChangeText={(text) => setJustificationDate(formatDate(text))}
                maxLength={10}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Motivo da Justificativa *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descreva o motivo da falta ou atraso..."
                placeholderTextColor={COLORS.gray}
                value={justificationText}
                onChangeText={setJustificationText}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={closeModal}
              disabled={savingJustification}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton, savingJustification && styles.disabledButton]}
              onPress={handleSaveJustification}
              disabled={savingJustification}
            >
              <Text style={styles.saveButtonText}>
                {savingJustification ? 'Salvando...' : 'Salvar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.darkBg, padding: 15 },
  content: { flex: 1, paddingHorizontal: 10, },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 15 },
  title: { fontSize: 22, fontWeight: 'bold', color: COLORS.white },
  chartContainer: { height: 150, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', marginBottom: 30 },
  barContainer: { alignItems: 'center' },
  bar: { backgroundColor: COLORS.white, width: 25, borderRadius: 8 },
  barLabel: { color: COLORS.gray, marginTop: 5 },
  sectionTitle: { color: COLORS.white, fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  logItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, alignItems: 'center' },
  logDate: { color: COLORS.white, fontSize: 16 },
  logTime: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15 },
  menuItemText: { color: COLORS.white, fontSize: 16 },
  footerButtonContainer: { padding: 10 },
  buttonPrimary: { backgroundColor: COLORS.primary, borderRadius: 30, paddingVertical: 18, alignItems: 'center' },
  buttonTextPrimary: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  dayContainer: {
    marginBottom: 20,
  },
  dayHeader: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  daySeparator: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: 15,
  },
  punchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.darkBg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  punchItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  punchInfo: {
    marginLeft: 10,
  },
  punchTime: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  punchType: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  punchIndex: {
    color: COLORS.gray,
    fontSize: 14,
    fontWeight: '600',
  },
  loadingText: {
    color: COLORS.gray,
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },
  emptyText: {
    color: COLORS.gray,
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.darkBg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  modalTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
    maxHeight: 400,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    backgroundColor: COLORS.lightBg,
    borderRadius: 10,
    padding: 15,
    color: COLORS.white,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 15,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: COLORS.lightBg,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  cancelButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default FrequencyScreen;