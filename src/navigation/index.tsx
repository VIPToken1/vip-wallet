import React from 'react';
import { BackHandler, ToastAndroid } from 'react-native';
import {
  DefaultTheme,
  NavigationContainer,
  NavigationState
} from '@react-navigation/native';
import { View } from 'native-base';
import SplashScreen from 'react-native-splash-screen';
import { useAppSelector, useLoader, useTranslations } from 'hooks';
import { screenHeight, screenWidth } from 'theme';
import { Colors } from 'theme/colors';

import { isReadyRef, navigationRef } from './NavigationService';
import RootNavigator from './stacks/RootNavigator';

const isCurrentScreenInitialOne = (state: any): boolean => {
  const route = state.routes[state.index];
  if (route.state) {
    return isCurrentScreenInitialOne(route.state);
  }
  return state.index === 0 && route.name === 'Home';
};

function Naivgation() {
  const { strings } = useTranslations();
  // const [isLoading, setIsLoading] = React.useState(true);
  const [backClickCount, setBackClickCount] = React.useState(0);
  const [navigatorState, setNavigatorState] = React.useState<NavigationState>();
  const [isInitialized, setIsInitialized] = React.useState(false);

  const { setLoader } = useLoader();
  const reduxState = useAppSelector(state => state);

  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const handleBackPress = () => {
    const isInitialScreen = isCurrentScreenInitialOne(navigatorState);
    if (isInitialScreen) {
      timeoutRef.current = setTimeout(() => setBackClickCount(0), 2000);
      if (backClickCount === 0) {
        setBackClickCount(backClickCount + 1);
        ToastAndroid.show(strings.exit_app, ToastAndroid.SHORT);
      } else if (backClickCount === 1) {
        BackHandler.exitApp();
      }
      return true;
    }
    return false;
  };

  React.useEffect(() => {
    return () => {
      // @ts-ignore
      isReadyRef.current = false;
    };
  }, []);

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );
    return () => {
      // @ts-ignore
      clearTimeout(timeoutRef.current);
      backHandler.remove();
    };
  });

  React.useEffect(() => {
    setLoader(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    (async () => {
      if (reduxState) {
        setIsInitialized(true);
        setLoader(false);
        setTimeout(() => SplashScreen.hide(), 500);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxState]);

  if (!isInitialized) {
    return <View flex={1} bg={Colors.BG} h={screenHeight} w={screenWidth} />;
  }

  return (
    <NavigationContainer
      independent
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          // @ts-ignore
          background: Colors.BG
        }
      }}
      ref={navigationRef}
      onReady={() => {
        // @ts-ignore
        isReadyRef.current = true;
      }}
      onStateChange={setNavigatorState}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

export default Naivgation;
