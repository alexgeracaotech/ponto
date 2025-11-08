import React, { useState } from 'react';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import HomeScreen from './src/screens/HomeScreen';
import FrequencyScreen from './src/screens/FrequencyScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import MenuScreen from './src/screens/MenuScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PrivacyScreen from './src/screens/PrivacyScreen';
import HelpScreen from './src/screens/HelpScreen';
import BaterPontoScreen from './src/screens/BaterPontoScreen';
import PontoBatidoScreen from './src/screens/PontoBatidoScreen';
import SummaryScreen from './src/screens/SummaryScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';

export default function App() {
  const [screen, setScreen] = useState('Welcome');  // Inicializa com a tela Welcome

  const navigate = (screenName) => setScreen(screenName);

  const screens = {
    Welcome:       <WelcomeScreen navigate={navigate} />,
    Login:         <LoginScreen navigate={navigate} />,
    Register:      <RegisterScreen navigate={navigate} />,
    ForgotPassword:<ForgotPasswordScreen navigate={navigate} />,
    Home:          <HomeScreen navigate={navigate} />,
    Frequency:     <FrequencyScreen navigate={navigate} />,
    Notifications: <NotificationsScreen navigate={navigate} />,
    Settings:      <SettingsScreen navigate={navigate} />,
    Menu:          <MenuScreen navigate={navigate} />,
    Profile:       <ProfileScreen navigate={navigate} />,
    Privacy:       <PrivacyScreen navigate={navigate} />,
    Help:          <HelpScreen navigate={navigate} />,
    BaterPonto:    <BaterPontoScreen navigate={navigate} />,
    PontoBatido:   <PontoBatidoScreen navigate={navigate} />,
    Summary:       <SummaryScreen navigate={navigate} />,
    Statistics:    <StatisticsScreen navigate={navigate} />,
  };

  return screens[screen] || <WelcomeScreen navigate={navigate} />;
}
