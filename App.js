import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import TodayScreen from './src/screens/TodayScreen';
import StatsScreen from './src/screens/StatsScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Today') {
                iconName = focused ? 'today' : 'today-outline';
              } else if (route.name === 'Stats') {
                iconName = focused ? 'stats-chart' : 'stats-chart-outline';
              } else if (route.name === 'History') {
                iconName = focused ? 'time' : 'time-outline';
              } else if (route.name === 'Settings') {
                iconName = focused ? 'settings' : 'settings-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#c4b5fd',
            tabBarInactiveTintColor: '#94a3b8',
            tabBarStyle: {
              backgroundColor: '#16213e',
              borderTopColor: 'rgba(196, 181, 253, 0.2)',
              borderTopWidth: 1,
              height: 60,
              paddingBottom: 8,
              paddingTop: 8,
            },
            headerStyle: {
              backgroundColor: '#1a1a2e',
            },
            headerTintColor: '#c4b5fd',
            headerTitleStyle: {
              fontWeight: '600',
              fontSize: 20,
            },
          })}
        >
          <Tab.Screen 
            name="Today" 
            component={TodayScreen}
            options={{ headerShown: false }}
          />
          <Tab.Screen 
            name="Stats" 
            component={StatsScreen}
            options={{ title: 'Your Progress' }}
          />
          <Tab.Screen 
            name="History" 
            component={HistoryScreen}
            options={{ title: 'Past Entries' }}
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}