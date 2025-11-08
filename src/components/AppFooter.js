
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

const AppFooter = ({ navigate, active }) => (
    <View style={styles.footer}>
        <TouchableOpacity style={styles.footerIcon} onPress={() => navigate('Home')}>
            <FontAwesome name="home" size={28} color={active === 'Home' ? COLORS.white : COLORS.gray} />
            <Text style={[styles.footerText, {color: active === 'Home' ? COLORS.white : COLORS.gray}]}>Home</Text>
            {active === 'Home' && <View style={styles.notificationBadgeFooter}><Text style={styles.notificationText}>1</Text></View>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerIcon} onPress={() => navigate('Profile')}> 
            <FontAwesome name="user" size={28} color={active === 'Profile' ? COLORS.white : COLORS.gray} />
            <Text style={[styles.footerText, {color: active === 'Profile' ? COLORS.white : COLORS.gray}]}>Profile</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
  footer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: COLORS.lightBg,
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: COLORS.lightGray
  },
  footerIcon: {
      alignItems: 'center',
  },
  footerText: {
      fontSize: 12,
      marginTop: 4,
  },
  notificationBadgeFooter: {
      position: 'absolute',
      right: 15,
      top: 0,
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

export default AppFooter;