import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, StyleSheet, ToastAndroid, View } from 'react-native';
import { Stack, Text } from 'native-base';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import VirtualKeyboard from 'react-native-virtual-keyboard';
import { PinInput } from 'components';
import {
  useAppDispatch,
  useAppSelector,
  useErrorState,
  useTranslations
} from 'hooks';
import { setWalletProtection } from 'store/actions';
import { Icons } from 'theme';
import { Colors } from 'theme/colors';
import { security } from 'utils';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import { WalletProtectionTypeEnum } from 'types';

type BiometricsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Biometrics'
>;

type BiometricsRouteProp = RouteProp<RootStackParamList, 'Biometrics'>;

const PIN_LENGTH = 6;

const Biometrics = () => {
  const keypadRef = useRef();
  const { strings } = useTranslations();
  const [pin, setPin] = useState('');
  const [isSupported, setSupported] = useState(false);
  const [backClickCount, setBackClickCount] = useState(0);
  const [errorMessage, setErrorMessage] = useErrorState();
  const navigation = useNavigation<BiometricsNavigationProp>();
  const route = useRoute<BiometricsRouteProp>();
  const dispatch = useAppDispatch();

  const { nextRoute } = route.params || {};

  const { isBiometricEnabled, lockMethod } = useAppSelector(
    state => state.user.appLockPreferences
  );

  const isBiometric =
    isBiometricEnabled || lockMethod === WalletProtectionTypeEnum.BIOMETRICS;

  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const isFocused = useIsFocused();

  useEffect(() => {
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

  const handleBackPress = () => {
    if (isFocused) {
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

  useEffect(() => {
    if (isFocused) {
      setPin('');
      // @ts-ignore
      keypadRef.current?.onPress?.('clear');
      checkBiometricType();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  useEffect(() => {
    (async () => {
      if (pin.length === PIN_LENGTH) {
        if (await security.verifyPin(pin)) {
          navigation.replace(nextRoute ? nextRoute : 'Home');
        } else {
          onClear(); // clear pin from virtual keypad
          setErrorMessage(strings.incorrect_pin);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, pin]);

  const checkBiometricType = async () => {
    try {
      const type = await FingerprintScanner.isSensorAvailable();
      console.log('type', type);
      // setBioMetryType(type);
      setSupported(true);
      // automatically show biometric prompt if biometric is enabled
      isBiometric && showAuthenticationDialog(type);
    } catch (error) {
      console.log('isSensorAvailable error => ', error);
    }
  };

  const showAuthenticationDialog = useCallback(
    async type => {
      if (type !== null && type !== undefined) {
        const message =
          type === 'Face ID'
            ? 'Scan your Face on the device to continue'
            : strings.finger_print_description;
        try {
          await FingerprintScanner.authenticate({
            description: message,
            fallbackEnabled: true,
            onAttempt: () => {}
          });
          console.log('Matched');
          navigation.replace(nextRoute ? nextRoute : 'Home');
        } catch (error) {
          console.log('Authentication error is => ', error);
        }
      } else {
        console.log('biometric authentication is not available');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [strings]
  );

  const onClear = () => {
    setTimeout(() => {
      // @ts-ignore
      keypadRef.current?.onPress?.('clear');
    }, 500);
  };

  return (
    <View style={styles.container}>
      <Stack
        w="full"
        px="10"
        flex="1"
        justifyContent="center"
        alignSelf="center"
      >
        <PinInput pin={pin} pinLength={PIN_LENGTH} isSecured />
        {!!errorMessage && (
          <Stack alignSelf="center" position="absolute" bottom="90px">
            <Text fontSize="md" color={Colors.LIGHT_RED}>
              {errorMessage}
            </Text>
          </Stack>
        )}
      </Stack>
      <Stack justifyContent="center" alignItems="center" mb="30px">
        <VirtualKeyboard
          ref={keypadRef}
          color="white"
          pressMode="string"
          decimal
          clearOnLongPress
          onPress={(val: string) => setPin(val)}
          cellStyle={styles.cellStyle}
          pressableStyle={styles.keypadPressableStyle}
          pressedStyle={styles.keypadPressedStyle}
          rowStyle={styles.keypadRowStyle}
          style={styles.keypadStyle}
          backspaceImg={Icons.backspaceIcon}
        />
      </Stack>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  keypadStyle: {
    marginLeft: 0,
    marginRight: 0
  },
  keypadRowStyle: {
    marginTop: 0
  },
  cellStyle: {
    alignItems: 'center'
  },
  keypadPressableStyle: {
    width: 70,
    height: 70,
    padding: 15,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center'
  },
  keypadPressedStyle: {
    backgroundColor: '#101323'
  }
});

export default Biometrics;
