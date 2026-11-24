import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { Fonts, Palette } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1D4ED8',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          paddingTop: 8,
          elevation: 6,
          shadowColor: '#1D4ED8',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
        },
        tabBarLabelStyle: {
          fontFamily: Fonts.medium,
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'የጤና ካርድ',
          tabBarIcon: ({ color, focused }: any) => (
            <Ionicons name={focused ? 'card' : 'card-outline'} size={22} color={color || '#1D4ED8'} />
          ),
        }}
      />
      <Tabs.Screen
        name="verify"
        options={{
          title: 'ማረጋገጫ (Triage)',
          tabBarIcon: ({ color, focused }: any) => (
            <Ionicons name={focused ? 'qr-code' : 'qr-code-outline'} size={22} color={color || '#1D4ED8'} />
          ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'አገልግሎቶች',
          tabBarIcon: ({ color, focused }: any) => (
            <Ionicons name={focused ? 'medical' : 'medical-outline'} size={22} color={color || '#1D4ED8'} />
          ),
        }}
      />
      <Tabs.Screen
        name="complaint"
        options={{
          title: 'ቅሬታ (Form 001)',
          tabBarIcon: ({ color, focused }: any) => (
            <Ionicons name={focused ? 'document-text' : 'document-text-outline'} size={22} color={color || '#1D4ED8'} />
          ),
        }}
      />
    </Tabs>
  );
}
