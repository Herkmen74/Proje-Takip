import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import PatientsScreen from '../screens/PatientsScreen';
import PatientDetailScreen from '../screens/PatientDetailScreen';
import AddPatientScreen from '../screens/AddPatientScreen';
import MealsScreen from '../screens/MealsScreen';
import MealDetailScreen from '../screens/MealDetailScreen';
import AddMealScreen from '../screens/AddMealScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import AddAppointmentScreen from '../screens/AddAppointmentScreen';
import AccountingScreen from '../screens/AccountingScreen';
import AddAccountingScreen from '../screens/AddAccountingScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const DashboardStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#6200ee' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' }
    }}>
    <Stack.Screen 
      name="Dashboard" 
      component={DashboardScreen}
      options={{ title: 'Ana Sayfa' }}
    />
  </Stack.Navigator>
);

const PatientsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#6200ee' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' }
    }}>
    <Stack.Screen 
      name="PatientsList" 
      component={PatientsScreen}
      options={{ title: 'Hastalarım' }}
    />
    <Stack.Screen 
      name="PatientDetail" 
      component={PatientDetailScreen}
      options={{ title: 'Hasta Detayı' }}
    />
    <Stack.Screen 
      name="AddPatient" 
      component={AddPatientScreen}
      options={{ title: 'Yeni Hasta' }}
    />
  </Stack.Navigator>
);

const MealsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#6200ee' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' }
    }}>
    <Stack.Screen 
      name="MealsList" 
      component={MealsScreen}
      options={{ title: 'Yemek Listesi' }}
    />
    <Stack.Screen 
      name="MealDetail" 
      component={MealDetailScreen}
      options={{ title: 'Yemek Detayı' }}
    />
    <Stack.Screen 
      name="AddMeal" 
      component={AddMealScreen}
      options={{ title: 'Yeni Yemek' }}
    />
  </Stack.Navigator>
);

const AppointmentsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#6200ee' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' }
    }}>
    <Stack.Screen 
      name="AppointmentsList" 
      component={AppointmentsScreen}
      options={{ title: 'Randevular' }}
    />
    <Stack.Screen 
      name="AddAppointment" 
      component={AddAppointmentScreen}
      options={{ title: 'Yeni Randevu' }}
    />
  </Stack.Navigator>
);

const AccountingStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#6200ee' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' }
    }}>
    <Stack.Screen 
      name="AccountingList" 
      component={AccountingScreen}
      options={{ title: 'Muhasebe' }}
    />
    <Stack.Screen 
      name="AddAccounting" 
      component={AddAccountingScreen}
      options={{ title: 'Yeni Kayıt' }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
              case 'DashboardTab':
                iconName = 'view-dashboard';
                break;
              case 'PatientsTab':
                iconName = 'account-multiple';
                break;
              case 'MealsTab':
                iconName = 'food-apple';
                break;
              case 'AppointmentsTab':
                iconName = 'calendar-clock';
                break;
              case 'AccountingTab':
                iconName = 'calculator';
                break;
              default:
                iconName = 'circle';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#6200ee',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            height: 60,
            paddingBottom: 8,
            paddingTop: 8
          }
        })}>
        <Tab.Screen 
          name="DashboardTab" 
          component={DashboardStack}
          options={{ title: 'Ana Sayfa' }}
        />
        <Tab.Screen 
          name="PatientsTab" 
          component={PatientsStack}
          options={{ title: 'Hastalar' }}
        />
        <Tab.Screen 
          name="MealsTab" 
          component={MealsStack}
          options={{ title: 'Yemekler' }}
        />
        <Tab.Screen 
          name="AppointmentsTab" 
          component={AppointmentsStack}
          options={{ title: 'Randevular' }}
        />
        <Tab.Screen 
          name="AccountingTab" 
          component={AccountingStack}
          options={{ title: 'Muhasebe' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
