import * as React from 'react';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LandingPage from './components/LandingPage';
import SignUpScreen from './components/auth pages/SignUpScreen';
import SignInScreen from './components/auth pages/SignInScreen';
import VerifyOtpScreen from './components/auth pages/VerifyOtpScreen';
import CarrierDashboard from './components/carrier/CarrierDashboard';
import senderDashboard from './components/sender/senderDashboard';
import RecieverDashboard from './components/receiver/ReceiverDashboard';
import SupportChat from './components/ChatScreen';
import AgentDashboard from './components/agent/AgentChat';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null); // null while checking login

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userData = await AsyncStorage.getItem('userData');

        if (token && userData) {
          const user = JSON.parse(userData);

          // Navigate based on role
          if (user.role === 'carrier') setInitialRoute('CarrierDashboard');
          else if (user.role === 'sender') setInitialRoute('senderDashboard');
          else if (user.role === 'receiver') setInitialRoute('ReceiverDashboard');
          else if (user.role === 'agent') setInitialRoute('AgentDashboard');
          else setInitialRoute('Landing'); // fallback
        } else {
          setInitialRoute('Landing');
        }
      } catch (error) {
        console.log('Error checking login:', error);
        setInitialRoute('Landing');
      }
    };

    checkLogin();
  }, []);

  // Show loader while checking AsyncStorage
  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
        <Stack.Screen name="Landing" component={LandingPage} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
        <Stack.Screen name="CarrierDashboard" component={CarrierDashboard} />
        <Stack.Screen name="senderDashboard" component={senderDashboard} />
        <Stack.Screen name="ReceiverDashboard" component={RecieverDashboard} />
        <Stack.Screen name="SupportChat" component={SupportChat} />
        <Stack.Screen name="AgentDashboard" component={AgentDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
