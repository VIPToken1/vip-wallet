/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { View } from 'native-base';
import { useIsFocused } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp
} from '@react-navigation/stack';
import { AppHeader, BackIcon, CloseIcon } from 'components';
import {
  useAppDispatch,
  useAppSelector,
  useInterval,
  useTranslations
} from 'hooks';

import Onboarding from 'screens/onboarding';
import PrivacyPolicy from 'screens/privacyPolicy/privacyPolicy';
import CreatePassword from 'screens/password/CreatePassword';
import CreatePasswordForm from 'screens/password/CreatePasswordForm';
import SignInWithRecoveryPhrase from 'screens/SignInWithRecoveryPhrase';
import Biometrics from 'screens/biometrics';
import BackupWallet from 'screens/BackupWallet';
import RestoreWallet from 'screens/RestoreWallet';
import RecoveryPhraseWords from 'screens/RecoveryPhraseWords';
import ManualBackupFields from 'screens/ManualBackupFields';
import ImportAccount from 'screens/ImportAccount';
import EnterPassword from 'screens/password/EnterPassword';
import Settings from 'screens/settings';
import Legal from 'screens/settings/Legal';
import AppLock from 'screens/settings/AppLock';
import AdvancedSettings from 'screens/settings/AdvancedSettings';
import LocalCurrency from 'screens/settings/LocalCurrency';
import CreatePin from 'screens/createPin';
import ReceiveVIP from 'screens/receiveVIP';
import SecretRecoveryPhrase from 'screens/SecretRecoveryPhrase';
import RequestPayment from 'screens/request/RequestPayment';
import SendLink from 'screens/SendLink';
import Transactions from 'screens/transactions';
import Send from 'screens/transactions/Send';
import WalletDetails from 'screens/home/WalletDetails';
import QRScanner from 'screens/qrScanner/QRScanner';
import TabNavigator from 'navigation/tabs';
import SendToken from 'screens/sendToken';
import ReceiveQr from 'screens/receiveQr';
import PurchaseToken from 'components/purchaseToken';
import Wallets from 'screens/Wallets';
import DeleteWallet from 'screens/DeleteWallet';
import NotificationSettings from 'screens/settings/notificationSettings';
import Notification from 'screens/notification';
import Tickets from 'screens/tickets';
import ShowQR from 'screens/ShowQR';
import BlockExplorer from 'screens/transactions/BlockExplorer';
import ContactUs from 'screens/settings/ContactUs';
import About from 'screens/settings/About';

import Colors from 'theme/colors';
import { setAuthToken } from 'config/api.config';
import { screenHeight, screenWidth } from 'theme';
import { actions } from 'store';
import { BINANCE_COIN } from 'constants/index';

const RootStack = createStackNavigator<RootStackParamList>();

type LoadingProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Loading'>;
};

const LoadingScreen: React.FC<LoadingProps> = ({ navigation }) => {
  const { isLoggedIn } = useAppSelector(state => state.user);

  const {
    token,
    defaultCurrency,
    appLockPreferences: { appLock }
  } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  if (token !== null) {
    setAuthToken(token);
  }
  const isFocused = useIsFocused();

  useInterval(() => {
    console.log('[interval triggered]: ', Date.now());
    dispatch(
      actions.getCryptoToFiatAction(
        BINANCE_COIN,
        defaultCurrency?.currencyCode?.toLowerCase()
      )
    );
    dispatch(actions.listCurrenciesAction());
  }, 60 * 2000); // every 2 minutes

  React.useEffect(() => {
    dispatch(actions.getCryptoToFiatAction(BINANCE_COIN, 'usd'));
    dispatch(actions.listCurrenciesAction());
  }, []);

  React.useEffect(() => {
    navigation.navigate(
      isLoggedIn ? (appLock ? 'Biometrics' : 'Home') : 'Onboarding'
    );
  }, [isLoggedIn, isFocused]);

  return <View flex={1} bg={Colors.BG} h={screenHeight} w={screenWidth} />;
};

const RootNavigator = () => {
  const { strings } = useTranslations();
  return (
    <RootStack.Navigator
      screenOptions={{
        headerBackTitle: '',
        header: props => <AppHeader {...props} />,
        animationEnabled: false
      }}
    >
      <RootStack.Screen
        name="Loading"
        component={LoadingScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Onboarding"
        component={Onboarding}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{ headerTitle: strings.privacy_policy }}
      />
      <RootStack.Screen
        name="TermsOfService"
        component={PrivacyPolicy}
        options={{ headerTitle: strings.terms_of_service }}
      />
      <RootStack.Screen
        name="Legal"
        component={Legal}
        options={{ headerTitle: strings.legal }}
      />
      <RootStack.Screen name="CreatePassword" component={CreatePassword} />
      <RootStack.Screen
        name="CreatePasswordForm"
        component={CreatePasswordForm}
      />
      <RootStack.Screen
        name="SignInWithRecoveryPhrase"
        component={SignInWithRecoveryPhrase}
      />
      <RootStack.Screen
        name="Biometrics"
        component={Biometrics}
        options={{
          headerTitle: strings.enter_passcode,
          headerLeft: () => null
        }}
      />
      <RootStack.Screen
        name="BackupWallet"
        component={BackupWallet}
        options={{ headerTitle: strings.backup_your_wallet }}
      />
      <RootStack.Screen
        name="RestoreWallet"
        component={RestoreWallet}
        options={{ headerTitle: strings.restore_wallet }}
      />
      <RootStack.Screen
        name="RecoveryPhraseWords"
        component={RecoveryPhraseWords}
        options={{ headerTitle: strings.recovery_phrase }}
      />
      <RootStack.Screen
        name="ManualBackupFields"
        component={ManualBackupFields}
        options={{ headerTitle: strings.verify_recovery_pharse }}
      />
      <RootStack.Screen
        name="ImportAccount"
        component={ImportAccount}
        options={{ headerTitle: strings.import_wallet }}
      />
      <RootStack.Screen name="EnterPassword" component={EnterPassword} />
      <RootStack.Screen name="Settings" component={Settings} />
      <RootStack.Screen
        name="AppLock"
        component={AppLock}
        options={{ headerTitle: strings.app_lock }}
      />
      <RootStack.Screen
        name="AdvancedSettings"
        component={AdvancedSettings}
        options={{ headerTitle: strings.advanced_settings }}
      />
      <RootStack.Screen
        name="LocalCurrency"
        component={LocalCurrency}
        options={{ headerTitle: strings.local_currency }}
      />
      <RootStack.Screen
        name="CreatePin"
        component={CreatePin}
        options={{ headerTitle: strings.create_passcode }}
      />
      <RootStack.Screen
        name="ConfirmPin"
        component={CreatePin}
        options={{ headerTitle: strings.re_create_passcode }}
      />
      <RootStack.Screen
        name="QRScanner"
        component={QRScanner}
        options={{ headerShown: false }}
      />
      <RootStack.Screen name="SendLink" component={SendLink} />
      <RootStack.Screen
        name="RequestPayment"
        component={RequestPayment}
        options={({ navigation }) => ({
          headerTitle: strings.request,
          headerRight: () => (
            <CloseIcon onPress={() => navigation.navigate('WalletDetails')} />
          )
        })}
      />
      <RootStack.Screen
        name="Home"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="WalletDetails"
        component={WalletDetails}
        options={{ headerShown: false }}
      />
      <RootStack.Screen name="ReceiveVIP" component={ReceiveVIP} />
      <RootStack.Screen
        name="SecretRecoveryPhrase"
        component={SecretRecoveryPhrase}
      />
      <RootStack.Screen
        name="Send"
        component={Send}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Receive"
        component={Send}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Transactions"
        component={Transactions}
        options={({ navigation }) => ({
          headerTitle: strings.transactions,
          headerLeft: () => (
            <BackIcon onPress={() => navigation.navigate('Home')} />
          )
        })}
      />
      <RootStack.Screen name="SendToken" component={SendToken} />
      <RootStack.Screen
        name="ReceiveQr"
        component={ReceiveQr}
        options={{ headerTitle: strings.receive }}
      />
      <RootStack.Screen
        name="PurchaseToken"
        component={PurchaseToken}
        options={{ headerTitle: strings.purchase_token }}
      />
      <RootStack.Screen
        name="Wallets"
        component={Wallets}
        options={{ headerTitle: strings.accounts }}
      />
      <RootStack.Screen
        name="DeleteWallet"
        component={DeleteWallet}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="NotificationSettings"
        component={NotificationSettings}
        options={{ headerTitle: strings.notifications }}
      />
      <RootStack.Screen
        name="Notification"
        component={Notification}
        options={{ headerTitle: strings.notifications }}
      />
      <RootStack.Screen
        name="QrTicket"
        component={Tickets}
        options={{ headerTitle: strings.ticket }}
      />
      <RootStack.Screen
        name="ShowQR"
        component={ShowQR}
        options={{ headerTitle: strings.receive }}
      />
      <RootStack.Screen
        name="BlockExplorer"
        component={BlockExplorer}
        options={{ headerTitle: strings.block_explorer }}
      />
      <RootStack.Screen
        name="ContactUs"
        component={ContactUs}
        options={{ headerTitle: strings.contact_us }}
      />
      <RootStack.Screen
        name="About"
        component={About}
        options={{ headerTitle: strings.about }}
      />
      <RootStack.Screen
        name="ShowRecoveryPhrase"
        component={RecoveryPhraseWords}
        options={{ headerTitle: strings.recovery_phrase }}
      />
    </RootStack.Navigator>
  );
};

export default RootNavigator;
