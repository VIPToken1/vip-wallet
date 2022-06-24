import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  BottomTabBarProps,
  createBottomTabNavigator
} from '@react-navigation/bottom-tabs';
import TabBar from './TabBar';
import Home from 'screens/home';
import Settings from 'screens/settings';
import Swap from 'screens/Swap/index';

const styles = StyleSheet.create({
  investmentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: 'white'
  }
});

const BottomTab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <BottomTab.Navigator
      tabBar={(props: BottomTabBarProps) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
      initialRouteName="HomeTab"
    >
      <BottomTab.Screen
        name="HomeTab"
        component={Home}
        options={{
          headerShown: false
        }}
      />
      <BottomTab.Screen
        name="SwapTab"
        component={Swap}
        options={{ headerTitle: 'Swap' }}
      />
      <BottomTab.Screen
        name="SettingsTab"
        component={Settings}
        options={{
          headerShown: false
        }}
      />
    </BottomTab.Navigator>
  );
}

export default TabNavigator;
