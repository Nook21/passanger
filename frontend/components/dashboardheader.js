import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const logoImage = require('../assets/logo.png'); 

const COLORS = {
  BACKGROUND_DARK: '#FFFFFF',
  ACCENT_GOLD: '#FFB733',
  TEXT_LIGHT: '#2D4B46',
};

export default function DashboardHeader({ user }) {
  const navigation = useNavigation();

  // ✅ Functional logout
  const handleLogout = async () => {
    try {
      // Remove the same keys that App.js uses
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');

      // Reset navigation stack
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      });
    } catch (error) {
      console.log('Logout Error:', error);
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        <Image source={logoImage} style={styles.logo} resizeMode="contain" />
      </View>
      <View style={styles.rightSection}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('SupportChat', { userId: user?._id })}
        />
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Landing')}
        >
          <Text style={styles.actionText}>Home</Text>
        </TouchableOpacity>

        {/* ✅ Updated Logout */}
        <TouchableOpacity
          style={[styles.actionButton, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: COLORS.BACKGROUND_DARK, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: Platform.OS === 'web' ? 40 : 20 },
  leftSection: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 45, height: 45, borderRadius: 128, marginRight: 10 },
  rightSection: { flexDirection: 'row', alignItems: 'center' },
  actionButton: { marginHorizontal: 10 },
  actionText: { color: COLORS.TEXT_LIGHT, fontWeight: '600', fontSize: 14 },
  logoutButton: { backgroundColor: COLORS.ACCENT_GOLD, paddingVertical: 6, paddingHorizontal: 15, borderRadius: 8 },
  logoutText: { color: COLORS.TEXT_LIGHT, fontWeight: 'bold' },
});
