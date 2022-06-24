/**
 * @format
 */

import './global';
import './shim';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { AppRegistry, LogBox } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { configAxios } from 'config/api.config';

// Promise polyfill
Promise.allSettled =
  Promise.allSettled ||
  (promises =>
    Promise.all(
      promises.map(p =>
        p
          .then(value => ({
            status: 'fulfilled',
            value
          }))
          .catch(reason => ({
            status: 'rejected',
            reason
          }))
      )
    ));

LogBox.ignoreAllLogs();

AppRegistry.registerComponent(appName, () => App);

configAxios();
