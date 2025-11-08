import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { getCurrentMonthStatistics, getJustifications } from '../services/statisticsService';

const StatisticsScreen = ({ navigate }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [justifications, setJustifications] = useState([]);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const monthlyStats = await getCurrentMonthStatistics();
      setStats(monthlyStats);
      
      const justs = await getJustifications();
      setJustifications(justs);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBarHeight = (value, maxValue) => {
    if (maxValue === 0) return 0;
    return Math.max((value / maxValue) * 100, 5); // Minimum 5% for visibility
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigate('Frequency')}>
            <Feather name="chevron-left" size={28} color={COLORS.gray} />
          </TouchableOpacity>
          <Text style={styles.title}>Estatísticas</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Carregando estatísticas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const maxHours = stats?.dailyStats.length > 0
    ? Math.max(...stats.dailyStats.map(d => d.hours + d.minutes / 60))
    : 8;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigate('Frequency')}>
          <Feather name="chevron-left" size={28} color={COLORS.gray} />
        </TouchableOpacity>
        <Text style={styles.title}>Estatísticas</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Attendance Chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Frequência do Mês</Text>
          <View style={styles.chartContainer}>
            {stats?.dailyStats.slice(0, 7).map((day, index) => {
              const hours = day.hours + day.minutes / 60;
              const height = getBarHeight(hours, maxHours);
              return (
                <View key={index} style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: `${height}%`,
                          backgroundColor: day.justified ? COLORS.gray : COLORS.primary,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>
                    {day.date.split('/')[0]}
                  </Text>
                </View>
              );
            })}
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: COLORS.primary }]} />
              <Text style={styles.legendText}>Trabalhado</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: COLORS.gray }]} />
              <Text style={styles.legendText}>Justificado</Text>
            </View>
          </View>
        </View>

        {/* Attendance Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resumo de Frequência</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Feather name="check-circle" size={24} color={COLORS.green} />
              <Text style={styles.summaryValue}>{stats?.workedDays || 0}</Text>
              <Text style={styles.summaryLabel}>Dias Presentes</Text>
            </View>
            <View style={styles.summaryItem}>
              <Feather name="x-circle" size={24} color={COLORS.red} />
              <Text style={styles.summaryValue}>{stats?.absentDays || 0}</Text>
              <Text style={styles.summaryLabel}>Dias Ausentes</Text>
            </View>
            <View style={styles.summaryItem}>
              <Feather name="file-text" size={24} color={COLORS.gray} />
              <Text style={styles.summaryValue}>{stats?.justifiedDays || 0}</Text>
              <Text style={styles.summaryLabel}>Justificados</Text>
            </View>
            <View style={styles.summaryItem}>
              <Feather name="alert-circle" size={24} color={COLORS.red} />
              <Text style={styles.summaryValue}>{stats?.unjustifiedDays || 0}</Text>
              <Text style={styles.summaryLabel}>Não Justificados</Text>
            </View>
          </View>
        </View>

        {/* Justifications List */}
        {justifications.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Justificativas Registradas</Text>
            {justifications.slice(0, 5).map((just, index) => (
              <View key={just.id || index} style={styles.justificationItem}>
                <View style={styles.justificationHeader}>
                  <Feather name="calendar" size={16} color={COLORS.primary} />
                  <Text style={styles.justificationDate}>{just.date}</Text>
                </View>
                <Text style={styles.justificationText} numberOfLines={2}>
                  {just.text}
                </Text>
              </View>
            ))}
            {justifications.length > 5 && (
              <Text style={styles.moreText}>
                +{justifications.length - 5} justificativa(s) adicional(is)
              </Text>
            )}
          </View>
        )}

        {/* Hours Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total de Horas</Text>
          <View style={styles.hoursContainer}>
            <Text style={styles.hoursValue}>
              {stats?.totalHours || 0}h {stats?.totalMinutes || 0}min
            </Text>
            <Text style={styles.hoursLabel}>Trabalhadas este mês</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.darkBg, padding: 15 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  title: { fontSize: 22, fontWeight: 'bold', color: COLORS.white },
  content: { flex: 1, paddingHorizontal: 10 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.gray,
    marginTop: 10,
  },
  card: {
    backgroundColor: COLORS.lightBg,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chartContainer: {
    height: 200,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 150,
    width: 30,
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  bar: {
    width: '100%',
    borderRadius: 5,
    minHeight: 5,
  },
  barLabel: {
    color: COLORS.gray,
    fontSize: 12,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 5,
  },
  legendText: {
    color: COLORS.gray,
    fontSize: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    backgroundColor: COLORS.darkBg,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryValue: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  summaryLabel: {
    color: COLORS.gray,
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  justificationItem: {
    backgroundColor: COLORS.darkBg,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  justificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  justificationDate: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  justificationText: {
    color: COLORS.white,
    fontSize: 14,
  },
  moreText: {
    color: COLORS.gray,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  hoursContainer: {
    alignItems: 'center',
    padding: 20,
  },
  hoursValue: {
    color: COLORS.primary,
    fontSize: 36,
    fontWeight: 'bold',
  },
  hoursLabel: {
    color: COLORS.gray,
    fontSize: 14,
    marginTop: 5,
  },
});

export default StatisticsScreen;

