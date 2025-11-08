import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { getCurrentMonthStatistics, getPunchesGroupedByDay } from '../services/statisticsService';
import { calculateDayHours } from '../services/statisticsService';

const SummaryScreen = ({ navigate }) => {
  const [loading, setLoading] = useState(true);
  const [monthStats, setMonthStats] = useState(null);
  const [todayStats, setTodayStats] = useState(null);
  const [recentDays, setRecentDays] = useState([]);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      setLoading(true);
      
      // Get current month statistics
      const stats = await getCurrentMonthStatistics();
      setMonthStats(stats);

      // Get today's statistics
      const groupedPunches = await getPunchesGroupedByDay();
      const today = new Date();
      const todayKey = today.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      
      const todayPunches = groupedPunches[todayKey] || [];
      const todayHours = calculateDayHours(todayPunches);
      setTodayStats({
        ...todayHours,
        punches: todayPunches.length,
      });

      // Get recent days (last 7 days)
      const recentDaysList = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        
        const dayPunches = groupedPunches[dateKey] || [];
        if (dayPunches.length > 0) {
          const dayHours = calculateDayHours(dayPunches);
          recentDaysList.push({
            date: dateKey,
            dateObj: date,
            ...dayHours,
            punches: dayPunches.length,
          });
        }
      }
      setRecentDays(recentDaysList);
    } catch (error) {
      console.error('Error loading summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateHeader = (dateString) => {
    const [day, month, year] = dateString.split('/');
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.toLocaleDateString('pt-BR', { weekday: 'short' });
    return `${dayOfWeek}, ${dateString}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigate('Frequency')}>
            <Feather name="chevron-left" size={28} color={COLORS.gray} />
          </TouchableOpacity>
          <Text style={styles.title}>Resumo</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Carregando resumo...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigate('Frequency')}>
          <Feather name="chevron-left" size={28} color={COLORS.gray} />
        </TouchableOpacity>
        <Text style={styles.title}>Resumo</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Today's Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Hoje</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Feather name="clock" size={24} color={COLORS.primary} />
              <Text style={styles.statValue}>
                {todayStats?.totalHours || 0}h {todayStats?.totalMinutes || 0}min
              </Text>
              <Text style={styles.statLabel}>Horas Trabalhadas</Text>
            </View>
            <View style={styles.statItem}>
              <Feather name="check-circle" size={24} color={COLORS.green} />
              <Text style={styles.statValue}>{todayStats?.punches || 0}</Text>
              <Text style={styles.statLabel}>Pontos Batidos</Text>
            </View>
          </View>
        </View>

        {/* Monthly Summary */}
        {monthStats && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Resumo do Mês ({new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })})
            </Text>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Feather name="clock" size={28} color={COLORS.primary} />
                <Text style={styles.statBoxValue}>
                  {monthStats.totalHours}h {monthStats.totalMinutes}min
                </Text>
                <Text style={styles.statBoxLabel}>Total de Horas</Text>
              </View>
              <View style={styles.statBox}>
                <Feather name="calendar" size={28} color={COLORS.green} />
                <Text style={styles.statBoxValue}>{monthStats.workedDays}</Text>
                <Text style={styles.statBoxLabel}>Dias Trabalhados</Text>
              </View>
              <View style={styles.statBox}>
                <Feather name="x-circle" size={28} color={COLORS.red} />
                <Text style={styles.statBoxValue}>{monthStats.absentDays}</Text>
                <Text style={styles.statBoxLabel}>Dias Ausentes</Text>
              </View>
              <View style={styles.statBox}>
                <Feather name="file-text" size={28} color={COLORS.gray} />
                <Text style={styles.statBoxValue}>{monthStats.justifiedDays}</Text>
                <Text style={styles.statBoxLabel}>Justificados</Text>
              </View>
            </View>
          </View>
        )}

        {/* Recent Days */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Últimos 7 Dias</Text>
          {recentDays.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum registro nos últimos 7 dias</Text>
          ) : (
            recentDays.map((day, index) => (
              <View key={index} style={styles.dayRow}>
                <View style={styles.dayInfo}>
                  <Text style={styles.dayDate}>{formatDateHeader(day.date)}</Text>
                  <Text style={styles.dayPunches}>{day.punches} pontos</Text>
                </View>
                <Text style={styles.dayHours}>
                  {day.totalHours}h {day.totalMinutes}min
                </Text>
              </View>
            ))
          )}
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
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  statLabel: {
    color: COLORS.gray,
    fontSize: 14,
    marginTop: 5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statBox: {
    width: '48%',
    backgroundColor: COLORS.darkBg,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  statBoxValue: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  statBoxLabel: {
    color: COLORS.gray,
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  dayInfo: {
    flex: 1,
  },
  dayDate: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  dayPunches: {
    color: COLORS.gray,
    fontSize: 12,
    marginTop: 2,
  },
  dayHours: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    color: COLORS.gray,
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
  },
});

export default SummaryScreen;

