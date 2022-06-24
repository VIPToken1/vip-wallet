import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import {
  HStack,
  Text,
  ScrollView,
  Switch,
  Pressable,
  Menu,
  Box
} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import { startCase } from 'lodash';
import { useAppDispatch, useAppSelector, useTranslations } from 'hooks';
import { Colors } from 'theme/colors';
import { IAppLockPreferences, WalletProtectionTypeEnum } from 'types';
import { actions } from 'store';

type AppLockRowProps = {
  label: string;
  value?: string;
  right?: React.ReactNode;
  isChecked?: boolean;
  onPress?: () => void;
};

const AppLockRow: FC<AppLockRowProps> = ({
  label,
  right,
  isChecked,
  onPress
}) => {
  return (
    <HStack
      alignItems="center"
      px={'24px'}
      justifyContent="space-between"
      my="6px"
      py={'15px'}
      bg={Colors.BG_LIGHT}
    >
      <Text fontSize={20}>{label}</Text>
      {right ? (
        right
      ) : (
        <Switch
          alignSelf={'flex-end'}
          size="md"
          onTrackColor={Colors.PRIMARY}
          offThumbColor={'#070915'}
          offTrackColor={'#656880'}
          onThumbColor={Colors.WHITE}
          isChecked={isChecked}
          onToggle={onPress}
        />
      )}
    </HStack>
  );
};

const AppLock = () => {
  const [isSupported, setSupported] = React.useState(false);
  const [biometricType, setBiometricType] = React.useState('');
  const { strings } = useTranslations();
  const dispatch = useAppDispatch();
  const { walletProtection, appLockPreferences } = useAppSelector<any>(
    state => state.user
  );

  React.useEffect(() => {
    checkBiometricType();
  }, []);

  const checkBiometricType = async () => {
    try {
      const type = await FingerprintScanner.isSensorAvailable();
      console.log('biometric type', type);
      setBiometricType(type);
      setSupported(true);
    } catch (error) {
      console.log('isSensorAvailable error => ', error);
      setPreferences('lockMethod', WalletProtectionTypeEnum.PIN);
    }
  };

  const showAuthenticationDialog = async () => {
    const type = biometricType;
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
        return true;
      } catch (error) {
        console.log('Authentication error is => ', error);
        return false;
      }
    } else {
      console.log('biometric authentication is not available');
      return false;
    }
  };

  const setPreferences = async (
    type: keyof IAppLockPreferences,
    value: any
  ) => {
    let authentication = true;
    if (value === WalletProtectionTypeEnum.BIOMETRICS) {
      authentication = await showAuthenticationDialog();
    }
    authentication &&
      dispatch(actions.setAppLockPreferences({ [type]: value }));
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      {/* <AppLockRow label={'Passcode'} /> */}
      <AppLockRow
        label={strings.lock_method}
        right={
          <Box>
            <Menu
              // w="100"
              bg="#09001D"
              // bg={Colors.GRAY}
              borderWidth={0}
              trigger={triggerProps => {
                return (
                  <Pressable
                    flexDirection="row"
                    accessibilityLabel="menu"
                    hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
                    _pressed={{
                      opacity: 0.5
                    }}
                    {...triggerProps}
                  >
                    <Text fontSize="md" fontWeight="500" px="2">
                      {startCase(appLockPreferences.lockMethod)}
                    </Text>
                    <MaterialIcons
                      name="arrow-drop-down"
                      size={24}
                      color={Colors.WHITE}
                    />
                  </Pressable>
                );
              }}
            >
              <Menu.Item
                // p="3"
                _pressed={{
                  bg: Colors.PRIMARY
                }}
                isDisabled={!isSupported}
                onPress={() =>
                  setPreferences(
                    'lockMethod',
                    WalletProtectionTypeEnum.BIOMETRICS
                  )
                }
              >
                Biometrics
              </Menu.Item>
              <Menu.Item
                // p="3"
                _pressed={{
                  bg: Colors.PRIMARY
                }}
                onPress={() => setPreferences('lockMethod', 'pin')}
              >
                PIN
              </Menu.Item>
            </Menu>
          </Box>
        }
      />
      <AppLockRow
        label={strings.require_to_open_app}
        isChecked={appLockPreferences.appLock}
        onPress={() => setPreferences('appLock', !appLockPreferences.appLock)}
      />
      <AppLockRow
        label={strings.require_for_transaction}
        isChecked={appLockPreferences.transactionLock}
        onPress={() =>
          setPreferences('transactionLock', !appLockPreferences.transactionLock)
        }
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1
  },
  container: {
    paddingTop: 20,
    paddingBottom: '25%'
  }
});

export default AppLock;
