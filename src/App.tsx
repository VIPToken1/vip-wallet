import React from 'react';
import { LogBox, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NativeBaseProvider } from 'native-base';
import { Provider } from 'react-redux';

import { PersistGate } from 'redux-persist/integration/react';
import * as Sentry from '@sentry/react-native';
import { AuthContextProvider, LoaderContextProvider } from 'contexts';
import config from './config/nativeBase.config';
import vipTheme from './theme/nativeBaseTheme';
import Naivgation from 'navigation';
import { Colors } from 'theme/colors';
import { store, persistor } from 'store/store';

LogBox.ignoreLogs(['NativeBase:']);

const App = () => {
  const backgroundStyle = {
    backgroundColor: Colors.BG,
    flex: 1
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={styles.container}>
          <NativeBaseProvider theme={vipTheme} config={config}>
            <LoaderContextProvider>
              <AuthContextProvider>
                <SafeAreaView
                  style={backgroundStyle}
                  edges={['top', 'left', 'right']}
                >
                  <StatusBar
                    backgroundColor={Colors.BG}
                    barStyle="light-content"
                  />
                  <Naivgation />
                </SafeAreaView>
              </AuthContextProvider>
            </LoaderContextProvider>
          </NativeBaseProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Sentry.wrap(App);
