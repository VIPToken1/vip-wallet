import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack, Text } from 'native-base';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import VirtualKeyboard from 'react-native-virtual-keyboard';
import { PinInput } from 'components';
import { useAppDispatch, useErrorState, useTranslations } from 'hooks';
import { setWalletProtection } from 'store/actions';
import { Icons } from 'theme';
import { Colors } from 'theme/colors';
import { savePin } from 'utils';

type CreatePinNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CreatePin' | 'ConfirmPin'
>;

type CreatePinRouteProp = RouteProp<
  RootStackParamList,
  'CreatePin' | 'ConfirmPin'
>;

const PIN_LENGTH = 6;

const CreatePin = () => {
  const keypadRef = useRef();
  const { strings } = useTranslations();
  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useErrorState();
  const navigation = useNavigation<CreatePinNavigationProp>();
  const route = useRoute<CreatePinRouteProp>();
  const dispatch = useAppDispatch();

  const alreadyAccount = route.params?.alreadyAccount;
  const isConfirmPin = route.name === 'ConfirmPin';

  useEffect(() => {
    (async () => {
      if (pin.length === PIN_LENGTH) {
        if (isConfirmPin) {
          // @ts-ignore
          if (pin === route.params?.newPin) {
            await savePin(pin);
            dispatch(setWalletProtection('pin'));
            setTimeout(
              () =>
                navigation.navigate(
                  alreadyAccount ? 'ImportAccount' : 'BackupWallet'
                ),
              1e2
            );
          } else {
            setErrorMessage(strings.pin_not_match);
            setTimeout(() => {
              setPin('');
              // @ts-ignore
              keypadRef.current?.onPress('clear');
            }, 5e2);
          }
        } else {
          setTimeout(() => {
            navigation.navigate('ConfirmPin', { newPin: pin, alreadyAccount });
          }, 1e2);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmPin, navigation, pin]);

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

export default CreatePin;
