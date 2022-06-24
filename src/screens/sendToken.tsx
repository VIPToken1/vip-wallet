import * as React from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { View, Text, Input, HStack, Image, useToast } from 'native-base';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CustomToast, GradientButton } from 'components';
import {
  useAppDispatch,
  useAppSelector,
  useLoader,
  useTranslations
} from 'hooks';
import { Colors } from 'theme/colors';
import { Icons, pixH } from 'theme';
import { chain } from 'utils';
import { useClipboard } from '@react-native-clipboard/clipboard';
import { actions } from 'store';

type SendTokenScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SendToken'
>;

type SendTokenScreenRouteProp = RouteProp<RootStackParamList, 'SendToken'>;

const ABIS = {
  VIP: require('../utils/token/vipTokenAbi.json'),
  WBNB: require('../utils/token/wbnbAbi.json')
};

const styles = StyleSheet.create({
  pasteContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%'
  },
  maxContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  }
});

export const formatCopiedAddress = (str: string) =>
  str?.includes(':') ? str.split(':')[1] : str;

const SendToken = () => {
  const navigation = useNavigation<SendTokenScreenNavigationProp>();
  const { params } = useRoute<SendTokenScreenRouteProp>();
  const isFocused = useIsFocused();

  const [toAddress, setToAddress] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [addressError, setAddressError] = React.useState('');
  const [amountError, setAmountError] = React.useState('');
  const [contractBalance, setContractBalance] = React.useState<any>(null);

  const dispatch = useAppDispatch();
  const toast = useToast();
  const [copiedText] = useClipboard();

  const { setLoader } = useLoader();
  const { strings } = useTranslations();
  const { activeWallet } = useAppSelector(state => state.crypto);

  const token = params?.token;
  const isContract = token.type === 'contract';

  React.useEffect(() => {
    let headerTitle = strings.send;
    if (token.symbol.toUpperCase() === 'BNB') {
      headerTitle = 'Send BNB';
    } else if (token.symbol.toUpperCase() === 'WBNB') {
      headerTitle = 'Send WBNB';
    } else if (token.symbol.toUpperCase() === 'VIP') {
      headerTitle = 'Send VIP Token';
    }
    navigation.setOptions({ headerTitle });
  }, [navigation, token, strings]);

  React.useEffect(() => {
    if (isContract) {
      (async () => {
        const balance = await dispatch(actions.getERCTokenBalanceAction(token));
        setContractBalance(balance);
      })();
    }
  }, [dispatch, isContract, token]);

  const maxBalance = isContract
    ? contractBalance
    : chain.parseBigNumber(activeWallet?.balance) / 1e18;

  const onPasteAddress = (value: string) => {
    if (!chain.validateWalletAddress(value)) {
      console.warn('Invalid address');
      toast.show({
        title: `Invalid address: "${value}"`,
        status: 'error',
        variant: 'subtle',
        duration: 2000
      });
      return;
    }
    setToAddress(value);
  };

  React.useEffect(() => {
    if (toAddress) {
      setAddressError('');
    }
    if (amount) {
      setAmountError('');
    }
  }, [amount, toAddress]);

  React.useEffect(() => {
    if (params?.scannedAddress) {
      onPasteAddress(params?.scannedAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.scannedAddress, isFocused]);

  const onChangeAmount = (value: string) => setAmount(value.replace(/,/g, '.'));

  const onPressMax = async () => {
    if (isContract) {
      setAmount(maxBalance.toString());
    } else {
      const maximumAmount = await chain.calculateMaxAmount(
        activeWallet?.balance
      );
      if (Number(maximumAmount) < 0) {
        setAmountError(strings.insufficient_funds);
      }
      setAmount(maximumAmount?.toString());
    }
  };

  const onSend = async () => {
    if (!chain.validateWalletAddress(toAddress)) {
      console.warn('Invalid address');
      setAddressError(strings.invalid_address);
      return;
    } else if (toAddress === activeWallet.address) {
      setAddressError(strings.enter_different_address);
      return;
    } else {
      setAddressError('');
    }

    if (!activeWallet) {
      console.warn('No active wallet');
      return;
    }

    if (!amount) {
      console.warn('Please enter amount to be sent');
      setAmountError(strings.enter_amount_to_send);
      return;
    } else if (Number(amount) < 0) {
      setAmountError(strings.insufficient_funds);
      return;
    } else if (Number(amount) > maxBalance) {
      setAmountError(strings.insufficient_funds);
      return;
    } else {
      setAmountError('');
    }

    setLoader(true);

    let transaction: any = null;

    if (isContract) {
      const contractAddress = token?.address;
      const contractAbi =
        ABIS[token?.symbol.toUpperCase() as keyof typeof ABIS];

      transaction = await chain.sendContract(
        contractAddress,
        contractAbi,
        amount,
        toAddress,
        token?.decimals,
        activeWallet?.address,
        activeWallet?.privateKey
      );

      console.info('[TOKEN TRANSAFERED]: ', transaction);
    } else {
      transaction = await chain.sendBNB(
        amount,
        toAddress,
        activeWallet.address,
        activeWallet.privateKey
      );

      console.info('[BNB TRANSFERED]', transaction);
    }
    // setTimeout(() => {
    setLoader(false);

    if (!transaction.isError) {
      toast.show({
        render: ({ id }) => (
          <CustomToast
            id={id}
            variant="left-accent"
            status="success"
            message={strings.transaction_submitted}
          />
        )
      });

      // save tx on backend
      dispatch(
        actions.saveTransactionAction({
          txHash: transaction.hash,
          address: activeWallet.address
        })
      );
      navigation.popToTop();

      // refresh wallet after 10 seconds when swap is successful
      setTimeout(() => {
        dispatch(actions.initializeChain());
        dispatch(actions.updateWalletBalance());
      }, 1e4);
    } else {
      toast.show({
        render: ({ id }) => (
          <CustomToast
            id={id}
            variant="left-accent"
            status="error"
            message={transaction.message || strings.transaction_failed}
          />
        )
      });
    }
    // }, 5e3);
  };

  return (
    <View flex={0}>
      <Text
        px="25px"
        mt={pixH(98)}
        alignSelf={'flex-start'}
        fontSize={'18px'}
        color={Colors.PLACEHOLDER}
      >
        {strings.send_to.toUpperCase()}
      </Text>
      <View px="25px">
        <HStack
          borderRadius="10px"
          justifyContent={'space-between'}
          bg={Colors.BG_LIGHT}
          mt="20px"
          w="100%"
        >
          <Input
            borderWidth={0}
            placeholder={strings.receipeint_address}
            placeholderTextColor={'#2E3247'}
            fontSize="16px"
            py={Platform.OS === 'ios' ? '24px' : '16px'}
            pl="12px"
            w={'60%'}
            color={Colors.WHITE}
            selectionColor={Colors.WHITE}
            value={toAddress}
            onChangeText={setToAddress}
          />
          <HStack w={'34%'} justifyContent="space-evenly">
            <View w={'0.3%'} h="60%" alignSelf={'center'} bgColor={'#ffffff'} />
            <TouchableOpacity
              style={[styles.pasteContainer, { paddingLeft: 10 }]}
              onPress={() => onPasteAddress(formatCopiedAddress(copiedText))}
            >
              <Text
                w="full"
                fontSize={'16px'}
                alignSelf={'center'}
                color={Colors.PLACEHOLDER}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {strings.paste}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pasteContainer, { width: '40%' }]}
              onPress={() =>
                navigation.navigate('QRScanner', { from: 'Send', ...params })
              }
            >
              <Image
                source={Icons.scanIcon}
                size="26px"
                resizeMode="contain"
                alt="scan"
                alignSelf={'center'}
              />
            </TouchableOpacity>
          </HStack>
        </HStack>

        {!!addressError && (
          <Text color={Colors.LIGHT_RED} px="2" py="1">
            {addressError}
          </Text>
        )}
        <HStack
          borderRadius="10px"
          justifyContent={'space-between'}
          bg={Colors.BG_LIGHT}
          mt="20px"
          w="100%"
        >
          <Input
            borderWidth={0}
            placeholder={'Amount'}
            placeholderTextColor={'#2E3247'}
            fontSize="16px"
            w={'60%'}
            pl="12px"
            py={Platform.OS === 'ios' ? '24px' : '16px'}
            color={Colors.WHITE}
            selectionColor={Colors.WHITE}
            keyboardType="numeric"
            returnKeyType="done"
            onSubmitEditing={() => onSend()}
            maxLength={12}
            value={amount}
            onChangeText={onChangeAmount}
          />
          <HStack w={'34%'}>
            <View w={'0.3%'} h="60%" alignSelf={'center'} bgColor={'#ffffff'} />
            <TouchableOpacity
              style={styles.maxContainer}
              onPress={onPressMax}
              disabled={maxBalance === null}
            >
              <Text
                fontSize={'16px'}
                alignSelf={'center'}
                color={Colors.PLACEHOLDER}
              >
                {strings.max.toUpperCase()}
              </Text>
            </TouchableOpacity>
          </HStack>
        </HStack>

        {!!amountError && (
          <Text color={Colors.LIGHT_RED} px="2" py="1">
            {amountError}
          </Text>
        )}
      </View>
      <View mt="40px">
        <GradientButton
          title={strings.send}
          onPress={onSend}
          disabled={Boolean(
            Number(amount) > Number(maxBalance) || amountError || addressError
          )}
        />
      </View>
    </View>
  );
};

export default SendToken;
