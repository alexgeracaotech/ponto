
import React, { useState, useEffect } from 'react'; 
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import AppHeader from '../components/AppHeader';
import { auth, firestore } from '../services/firebaseConfig';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { getPunchesGroupedByDay } from '../services/statisticsService';

const NotificationsScreen = ({ navigate }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const user = auth.currentUser;
            if (!user) return;

            const notifs = [];

            // Check for missing punches (no exit today)
            const groupedPunches = await getPunchesGroupedByDay();
            const today = new Date();
            const todayKey = today.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });

            const todayPunches = groupedPunches[todayKey] || [];
            if (todayPunches.length > 0) {
                const sortedPunches = [...todayPunches].sort((a, b) => {
                    const timeA = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
                    const timeB = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);
                    return timeB - timeA;
                });

                const lastPunch = sortedPunches[0];
                const lastPunchTime = lastPunch.timestamp instanceof Date 
                    ? lastPunch.timestamp 
                    : new Date(lastPunch.timestamp);
                
                // Check if last punch was an entry (odd number of punches)
                if (todayPunches.length % 2 === 1) {
                    const hoursSinceLastPunch = (new Date() - lastPunchTime) / (1000 * 60 * 60);
                    if (hoursSinceLastPunch > 8) {
                        notifs.push({
                            id: 'missing-exit',
                            text: 'Você ainda não bateu o ponto de saída hoje!',
                            time: formatNotificationTime(lastPunchTime),
                            type: 'warning',
                        });
                    }
                }

                // Add notification for last punch
                const isEntry = todayPunches.length % 2 === 1;
                notifs.push({
                    id: 'last-punch',
                    text: isEntry ? 'Entrada registrada' : 'Saída registrada',
                    time: formatNotificationTime(lastPunchTime),
                    type: 'info',
                });
            } else {
                // No punches today
                const now = new Date();
                const hours = now.getHours();
                if (hours >= 8 && hours < 18) {
                    notifs.push({
                        id: 'no-punch-today',
                        text: 'Você ainda não bateu o ponto hoje!',
                        time: 'HOJE',
                        type: 'warning',
                    });
                }
            }

            // Check for recent justifications
            try {
                const justificationsRef = collection(firestore, 'users', user.uid, 'justifications');
                const q = query(justificationsRef, orderBy('createdAt', 'desc'), limit(3));
                const snapshot = await getDocs(q);
                
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    const createdAt = data.createdAt?.toDate || new Date(data.createdAt);
                    notifs.push({
                        id: `justification-${doc.id}`,
                        text: `Justificativa registrada para ${data.date}`,
                        time: formatNotificationTime(createdAt),
                        type: 'success',
                    });
                });
            } catch (error) {
                console.warn('Error loading justifications for notifications:', error);
            }

            // Sort by time (most recent first)
            notifs.sort((a, b) => {
                const timeA = a.timeObj || new Date(0);
                const timeB = b.timeObj || new Date(0);
                return timeB - timeA;
            });

            setNotifications(notifs);
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatNotificationTime = (date) => {
        if (!date) return 'AGORA';
        
        const dateObj = date instanceof Date ? date : new Date(date);
        const now = new Date();
        const diffMs = now - dateObj;
        const diffHours = diffMs / (1000 * 60 * 60);
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (diffHours < 1) {
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            return diffMinutes < 1 ? 'AGORA' : `${diffMinutes}min atrás`;
        } else if (diffHours < 24) {
            const hours = Math.floor(diffHours);
            return hours === 1 ? '1h atrás' : `${hours}h atrás`;
        } else if (diffDays < 2) {
            return `ONTEM ${dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            return dateObj.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    };

    const handleClearNotifications = () => {
        setNotifications([]); 
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'warning':
                return 'alert-circle';
            case 'success':
                return 'check-circle';
            default:
                return 'info';
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'warning':
                return COLORS.red;
            case 'success':
                return COLORS.green;
            default:
                return COLORS.primary;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
          <AppHeader navigate={navigate} title="Notificações" backScreen="Menu" />
          <ScrollView style={styles.content}>
              {loading ? (
                  <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color={COLORS.primary} />
                      <Text style={styles.loadingText}>Carregando notificações...</Text>
                  </View>
              ) : notifications.length > 0 ? (
                  <>
                    {notifications.map((notif) => (
                        <View key={notif.id} style={styles.notificationCard}>
                            <View style={styles.notificationIconContainer}>
                                <Feather 
                                    name={getNotificationIcon(notif.type)} 
                                    size={20} 
                                    color={getNotificationColor(notif.type)} 
                                />
                            </View>
                            <View style={styles.notificationContent}>
                                <Text style={styles.notificationCardText}>{notif.text}</Text>
                                <Text style={styles.notificationCardTime}>{notif.time}</Text>
                            </View>
                        </View>
                    ))}
                    <TouchableOpacity style={styles.clearButton} onPress={handleClearNotifications}>
                        <Text style={styles.clearButtonText}>Limpar notificações</Text>
                        <Feather name="trash-2" size={20} color="#603030" style={{marginLeft: 10}} />
                    </TouchableOpacity>
                  </>
              ) : (
                  <View style={styles.emptyContainer}>
                      <Feather name="bell-off" size={48} color={COLORS.gray} />
                      <Text style={styles.noNotificationsText}>Nenhuma notificação no momento.</Text>
                  </View>
              )}
          </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.darkBg, paddingHorizontal: 15 },
  content: { flex: 1, paddingHorizontal: 10, paddingTop: 20 },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.gray,
    marginTop: 10,
  },
  notificationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  notificationIconContainer: {
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationCardText: {
    color: COLORS.darkBg,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationCardTime: {
    color: COLORS.gray,
    fontSize: 12,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: COLORS.white,
    marginTop: 30,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#603030',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 50,
  },
  noNotificationsText: {
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default NotificationsScreen;