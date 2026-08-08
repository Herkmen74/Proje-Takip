import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { initDatabase } from './src/database/db';

export default function App() {
  useEffect(() => {
    setupDatabase();
  }, []);

  const setupDatabase = async () => {
    try {
      await initDatabase();
      console.log('Veritabanı başarıyla başlatıldı');
    } catch (error) {
      console.error('Veritabanı başlatma hatası:', error);
      Alert.alert(
        'Hata',
        'Veritabanı başlatılamadı. Uygulamayı yeniden başlatın.',
        [{ text: 'Tamam' }]
      );
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider>
          <StatusBar style="light" backgroundColor="#6200ee" />
          <AppNavigator />
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
