import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { auth } from '../services/firebaseConfig';
import { getCurrentUserData } from '../services/userService';

const AppHeader = ({ navigate, title, backScreen }) => {
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    loadUserName();
  }, []);

  const loadUserName = async () => {
    try {
      const userData = await getCurrentUserData();
      if (userData?.username) {
        setUserName(userData.username);
      } else if (auth.currentUser?.displayName) {
        setUserName(auth.currentUser.displayName);
      }
    } catch (error) {
      console.error('Error loading user name:', error);
    }
  };

  const displayTitle = title || (userName ? `Olá, ${userName.split(' ')[0]}` : "Olá, Usuário");

  return (
    <View style={styles.header}>
      {backScreen ? (
        <TouchableOpacity onPress={() => navigate(backScreen)}>
          <Feather name="chevron-left" size={28} color={COLORS.gray} />
        </TouchableOpacity>
      ) : (
        <View style={{width: 28}} />
      )}
      <Text style={styles.headerTitle}>{displayTitle}</Text>
      <TouchableOpacity onPress={() => navigate('Menu')}>
        <Feather name="menu" size={24} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 20,
    color: COLORS.white,
  },
  notificationBadge: {
      position: 'absolute',
      right: -5,
      top: -5,
      backgroundColor: COLORS.red,
      borderRadius: 10,
      width: 18,
      height: 18,
      justifyContent: 'center',
      alignItems: 'center'
  },
  notificationText: {
      color: 'white',
      fontSize: 12,
      fontWeight: 'bold',
  },
});

export default AppHeader;