/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {
  FC,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  Alert,
  BackHandler,
  Linking,
  RefreshControl,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity
} from 'react-native';
import {
  Box,
  Heading,
  HStack,
  Image,
  ScrollView,
  Stack,
  Text,
  View
} from 'native-base';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Layout, WalletToken } from 'components';
import {
  useAppDispatch,
  useAppSelector,
  useFiatPrice,
  useLoader,
  useTranslations
} from 'hooks';
import { BINANCE_COIN, VIPToken, WrappedBNB } from 'constants/index';
import { Icons } from 'theme';
import { Colors } from 'theme/colors';
import { TokenButton } from 'components/tokenButton';
import { actions } from 'store';
import { chain, getVIPLevel } from 'utils';
import { IUserState } from 'types';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

const Home: FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { strings } = useTranslations();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [backClickCount, setBackClickCount] = useState(0);

  const { setLoader } = useLoader();
  const { calculateCryptoToFiat, getConversionRate } = useFiatPrice();

  // useBackPreventer();
  const dispatch = useAppDispatch();
  const { activeWallet, loading, tokens } = useAppSelector(
    state => state.crypto
  );
  const { currencySign = '$' } = useAppSelector(
    (state: any) => state.user.defaultCurrency
  );
  const { walletBackup } = useAppSelector<IUserState>(state => state.user);

  const timeoutRef = useRef<NodeJS.Timeout>();

  const isFocused = useIsFocused();

  useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        if (isFocused) {
          console.info('"goBack": blocked', navigation.getState());
          e.preventDefault();
        }
      }),
    [isFocused, navigation]
  );

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

  useLayoutEffect(() => {
    setLoader(true);
    setTimeout(() => {
      dispatch(actions.initializeChain());
    }, 5e2);
  }, [dispatch]);

  useLayoutEffect(() => {
    dispatch(actions.getAllCoinDetails([BINANCE_COIN, WrappedBNB, VIPToken]));
  }, [dispatch]);

  useEffect(() => {
    if (activeWallet?.address) {
      setTimeout(() => {
        dispatch(actions.updateWalletBalance());
      }, 5e3);
    }
  }, [activeWallet?.address]);

  useEffect(() => {
    setLoader(loading);
  }, [loading]);

  const onRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    dispatch(actions.getAllCoinDetails([BINANCE_COIN, WrappedBNB, VIPToken]));
    await dispatch(actions.updateWalletBalance());
    setTimeout(() => setIsRefreshing(false), 1e3);
  }, []);

  const onPressBuy = () => {
    if (!walletBackup?.isBackup) {
      Alert.alert(
        strings.backup_now,
        strings.backup_now_desc,
        [
          {
            text: strings.later,
            onPress: () => Linking.openURL('https://buy.viptoken.io')
          },
          {
            text: 'Yes',
            onPress: () => {
              navigation.navigate('Biometrics', {
                nextRoute: 'RecoveryPhraseWords'
              });
            }
          }
        ],
        { cancelable: false }
      );
    } else {
      Linking.openURL('https://buy.viptoken.io');
    }
  };

  const bnbBalance = calculateCryptoToFiat(activeWallet?.balance);

  const tokenList = useMemo(() => {
    return tokens.map((token: any) => {
      if (token.symbol?.toLowerCase() === 'bnb') {
        const bal = chain.parseBigNumber(activeWallet?.balance) / 1e18;
        token = {
          ...token,
          balance: bal?.toFixed(6) || 0,
          balanceInUSD:
            bnbBalance ||
            (Number(bal) * Number(token.currentPrice)).toFixed(2) ||
            0
        };
      } else if (token.symbol?.toLowerCase() === 'wbnb') {
        token = {
          ...token,
          balance: Number(token.balance)?.toFixed(6) || 0,
          balanceInUSD:
            (Number(token.balance) * Number(token.currentPrice)).toFixed(2) || 0
        };
      } else if (token.symbol?.toLowerCase() === 'vip') {
        const usdBalance =
          Number(token.balance || 0) * Number(token.currentPrice);
        token = {
          ...token,
          balanceInUSD: getConversionRate(usdBalance) || 0
        };
      }
      return {
        ...token
      };
    });
  }, [tokens, activeWallet?.balance, bnbBalance]);

  const totalWalletBalance = useMemo(() => {
    return tokenList.reduce((acc: any, token: any) => {
      const totalBal =
        acc + (token.balanceInUSD ? Number(token.balanceInUSD) : 0);
      dispatch(actions.setTotalWalletBalance(totalBal));
      return totalBal;
    }, 0);
  }, [dispatch, tokenList]);

  return (
    <>
      <HStack justifyContent="space-between" w="full" px="4" pt="4">
        <HStack>
          <Text fontSize="3xl" fontWeight="bold">
            {strings.my_vip_wallet}
          </Text>
        </HStack>
        <HStack alignItems="center">
          <TouchableOpacity
            style={{
              paddingHorizontal: 6,
              paddingVertical: 5,
              marginRight: 4
            }}
            onPress={() => navigation.navigate('QrTicket')}
          >
            <Image
              source={Icons.ticketIcon}
              size="25px"
              resizeMode="contain"
              alt="ticketIcon"
            />
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={{
              paddingHorizontal: 6,
              paddingVertical: 5,
              marginRight: 4
            }}
            onPress={() => navigation.navigate('Notification')}
          >
            <Image
              source={Icons.notificationIcon}
              size="25px"
              resizeMode="contain"
              alt="notification"
            />
          </TouchableOpacity> */}
          <TouchableOpacity
            style={{
              paddingHorizontal: 6,
              paddingVertical: 5,
              marginLeft: 4,
              marginRight: -5
            }}
            onPress={() => navigation.navigate('QRScanner')}
          >
            <Image
              source={Icons.scanIcon}
              size="26px"
              resizeMode="contain"
              alt="scan"
            />
          </TouchableOpacity>
        </HStack>
      </HStack>
      <Layout w="100%" alignItems="center" flex={1} pb="100px" pt="0" px="0">
        <ScrollView
          w="full"
          flex={1}
          px="20px"
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={'#D3D3D3'}
            />
          }
        >
          <Box my="8" justifyContent="flex-start">
            <Heading size="2xl" color="white" textAlign="center">
              {`${currencySign}${
                isNaN(totalWalletBalance) ? 0 : totalWalletBalance?.toFixed(2)
              }`}
            </Heading>
            <Text color={Colors.PLACEHOLDER} textAlign="center" fontSize="sm">
              {strings.estimate_balance}
            </Text>
            <Text
              color={Colors.WHITE}
              textAlign="center"
              mt="33px"
              fontSize="18px"
            >
              {strings.vip_level}: {getVIPLevel(tokenList[0].balance)}
            </Text>
            {/* <Text
              color={Colors.PLACEHOLDER}
              textAlign="center"
              mt="9px"
              fontSize="18px"
            >
              {strings.days_at_current}: 30 {strings.days}
            </Text> */}
            <View
              style={styles.horizontalLine}
              justifyContent="center"
              alignItems="center"
              alignSelf="center"
            >
              <TokenButton
                onPress={() => navigation.navigate('Send')}
                source={Icons.sentRoundIcon}
                label={strings.send}
              />
              <TokenButton
                onPress={() => navigation.navigate('Receive')}
                source={Icons.receivedRoundIcon}
                label={strings.receive}
              />
              <TokenButton
                onPress={() => navigation.navigate('Transactions')}
                source={Icons.transactionRoundIcon}
                label={strings.transactions}
              />
            </View>
          </Box>
          <HStack
            justifyContent="space-between"
            alignItems="center"
            w="full"
            mt="4"
          >
            <Text fontSize="lg" fontWeight="medium">
              {strings.holdings}
            </Text>
            <TouchableOpacity
              style={styles.buyBtn}
              // onPress={() => navigation.navigate('PurchaseToken')}
              // onPress={() => Linking.openURL('https://buy.viptoken.io')}
              onPress={onPressBuy}
            >
              <Text fontSize="18" color={Colors.WHITE}>
                {strings.buy.toUpperCase()}
              </Text>
            </TouchableOpacity>
          </HStack>
          <Stack
            flex={1}
            pt="4"
            pb="1"
            px="2"
            justifyContent="center"
            alignItems="center"
            alignSelf="center"
          >
            {tokenList.map((token: any, index: number) => (
              <WalletToken
                key={index}
                token={token}
                currencySign={currencySign}
                navigateToDetails={() =>
                  navigation.navigate('WalletDetails', { token })
                }
              />
            ))}
          </Stack>
        </ScrollView>
      </Layout>
    </>
  );
};

const styles = StyleSheet.create({
  horizontalLine: {
    flexDirection: 'row',
    top: 25
  },
  buyBtn: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 35,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 20
  }
});

export default Home;
