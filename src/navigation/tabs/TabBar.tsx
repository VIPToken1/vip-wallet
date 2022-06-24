import React, { FC } from 'react';
import {
  TouchableOpacity,
  ImageSourcePropType,
  StyleSheet,
  Platform,
  Image
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { HStack } from 'native-base';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icons } from 'theme';

const tabIcons: Record<string, ImageSourcePropType> = {
  HomeTab: Icons.walletTabIcon,
  SwapTab: Icons.swapTabIcon,
  SettingsTab: Icons.settingsIcon,
  HomeTabActive: Icons.walletTabIconActiveIcon,
  SwapTabActive: Icons.swapTabIconActiveIcon,
  SettingsTabActive: Icons.settingsActiveIcon
};

const TabBar: FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const barHeight = insets.bottom + 65;
  return (
    <HStack
      justifyContent="space-evenly"
      pt="4"
      w="100%"
      bgColor="#0F1224"
      h={`${barHeight}px`}
      pb={`${insets.bottom}px`}
      borderTopLeftRadius={'24'}
      borderTopRightRadius={'24'}
      position="absolute"
      bottom={0}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true
          });
          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key
          });
        };
        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            <Image
              source={
                isFocused
                  ? tabIcons[`${route.name}Active`]
                  : tabIcons[route.name]
              }
              style={{ height: 28, width: 28 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        );
      })}
    </HStack>
  );
};

export default TabBar;
