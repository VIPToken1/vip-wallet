import * as React from 'react';
import { Image as RNImage, StyleSheet, TouchableOpacity } from 'react-native';
import {
  View,
  Text,
  HStack,
  VStack,
  Box,
  Input,
  useToast,
  Spinner
} from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Humanize from 'humanize-plus';
import numeral from 'numeral';
import { CustomToast, GradientButton, RoundIcon, SwapModal } from 'components';
import { VIP_TOKEN_ADDRESS, WBNB_ADDRESS } from 'constants/index';
import {
  useAppDispatch,
  useAppSelector,
  useFiatPrice,
  useLoader,
  useTranslations
} from 'hooks';
import { Colors } from 'theme/colors';
import { Icons } from 'theme';
import { ISwapData } from 'types';
import { chain } from 'utils';
import * as swapUtils from 'utils/newSwap';
import type { IAvaialablePair } from 'utils/newSwap';
import { actions } from 'store';

type SwapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Swap'>;

type SwapBoxProps = {
  title: string;
  tokenName: string;
  balance: string;
  conversion: string;
  amount: string;
  slippage: number;
  isComputing?: boolean;
  onChangeAmount: (text: string) => void;
  mt?: string;
  isOutput?: boolean;
  maxButton?: JSX.Element;
};

const SwapBox: React.FC<SwapBoxProps> = ({
  title,
  tokenName,
  amount,
  conversion,
  balance,
  slippage,
  isComputing,
  maxButton,
  isOutput,
  onChangeAmount,
  ...rest
}) => {
  const onChange = (value: string) =>
    isOutput ? onChangeAmount(value) : onChangeAmount(value.replace(/,/g, '.'));
  return (
    <Box {...rest} bg={Colors.BG_LIGHT} py="14px" px="14px" borderRadius="20px">
      <VStack>
        <Text
          alignSelf={'center'}
          color={Colors.PLACEHOLDER}
          mb="17px"
          fontSize="12px"
          fontWeight={'700'}
        >
          {title}
        </Text>
        <HStack justifyContent={'space-between'}>
          <HStack>
            <RNImage
              source={tokenName === 'BNB' ? Icons.bnbIcon : Icons.vipIcon}
            />
            <VStack ml="12px">
              <Text fontSize="20px" fontWeight={'500'}>
                {tokenName}
              </Text>
              <Text fontSize="12px" fontWeight={'700'}>
                {conversion}
              </Text>
            </VStack>
          </HStack>
        </HStack>
        <HStack alignItems="center" justifyContent="space-between">
          <View>{maxButton}</View>
          <HStack
            alignItems="center"
            justifyContent="flex-end"
            alignSelf="flex-end"
          >
            {isComputing && <Spinner color={Colors.WHITE} size="sm" />}
            <Input
              borderWidth={0}
              minW="50px"
              fontSize="22px"
              fontWeight="bold"
              textAlign="right"
              color={Colors.WHITE}
              selectionColor={Colors.WHITE}
              alignSelf="flex-end"
              placeholder="0.00"
              value={
                Number(amount)
                  ? isOutput
                    ? numeral(amount).format('0,0.00[00000000]').toString()
                    : numeral(amount).format('0.[00000000]').toString()
                  : amount
              }
              onChangeText={onChange}
              keyboardAppearance="dark"
              keyboardType="decimal-pad"
              returnKeyType="done"
              maxLength={isOutput ? undefined : 12}
              editable={!isOutput}
            />
          </HStack>
        </HStack>
        <HStack mt="15px" justifyContent={'space-between'}>
          <Text color={Colors.PLACEHOLDER} fontSize="14px" fontWeight={'500'}>
            Balance : {balance}
          </Text>
          <Text color={Colors.PLACEHOLDER} fontSize="14px" fontWeight={'500'}>
            {/* 25% 50% 75% 100% */}
            {slippage}%
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
};

const Swap = () => {
  const { activeWallet, privateKey, tokens } = useAppSelector(
    state => state.crypto
  );
  const { txnTime, slippage } = useAppSelector(state => state.swap);

  const { currencySign, getConversionRate } = useFiatPrice();

  const bnbData = React.useMemo(
    () => ({
      contractAddress: WBNB_ADDRESS,
      amount: '',
      name: 'BNB',
      symbol: 'BNB',
      balance:
        (chain.parseBigNumber(activeWallet?.balance) / 1e18).toFixed(6) || '0',
      // balance: tokens?.[2]?.balance || '0',
      currentPrice: `1 BNB = ${currencySign}${getConversionRate(
        tokens?.[1]?.currentPrice || '0'
      )}`
    }),
    [activeWallet?.balance, currencySign, tokens, getConversionRate]
  );

  const vipData = React.useMemo(
    () => ({
      contractAddress: VIP_TOKEN_ADDRESS,
      amount: '',
      name: 'VIP',
      symbol: 'VIP',
      balance: Humanize.formatNumber(tokens?.[0]?.balance, 2) || '0',
      currentPrice: `1 VIP = ${currencySign}${getConversionRate(
        tokens?.[0]?.currentPrice || '0'
      )}`
    }),
    [currencySign, tokens, getConversionRate]
  );

  const toast = useToast();
  const navigation = useNavigation<SwapScreenNavigationProp>();
  const { setLoader } = useLoader();
  const { strings } = useTranslations();
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();

  const [modalType, setModalType] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [interchanged, setInterchanged] = React.useState(false);
  const [swapFrom, setSwapFrom] = React.useState<ISwapData>(bnbData);
  const [swapTo, setSwapTo] = React.useState<ISwapData>(vipData);
  const [isComputingMax, setIsComputingMax] = React.useState(false);
  const [isComputing, setIsComputing] = React.useState(false);
  const [, setAmountsOut] = React.useState<string[]>([]);

  const maxBalance =
    swapFrom.name === 'VIP'
      ? tokens?.[0]?.balance || 0
      : chain.parseBigNumber(activeWallet?.balance) / 1e18;

  React.useEffect(() => {
    if (isFocused) {
      setIsSubmitting(false);
    }
  }, [dispatch, isFocused]);

  const swapPair = React.useMemo(() => {
    const addresses: any = [
      swapFrom.contractAddress as IAvaialablePair,
      swapTo.contractAddress as IAvaialablePair
    ];
    return swapUtils.getSwapPairs(addresses, privateKey);
  }, [privateKey, swapFrom, swapTo]);

  const onInterchange = () => {
    setInterchanged(prev => !prev);
    setSwapFrom({
      ...swapTo,
      amount: numeral(swapTo.amount).value()?.toString()
    });
    setSwapTo(swapFrom);
  };

  const onChangeAmount = async (value: string, type: string) => {
    if (type === 'to') {
      setSwapTo({
        ...swapTo,
        amount: value
      });
      const _amounts = await getAmountsOut(value, 'to');
      if (_amounts) {
        setSwapFrom({
          ...swapFrom,
          amount: _amounts[1]
        });
      }
    } else if (type === 'from') {
      setSwapFrom({
        ...swapFrom,
        amount: value
      });
      const _amounts = await getAmountsOut(value, 'from');
      if (_amounts) {
        setSwapTo({
          ...swapTo,
          amount: _amounts[1]
        });
      }
    }
  };

  const getAmountsOut = async (value: string, type: 'from' | 'to') => {
    if (activeWallet) {
      setIsComputing(true);
      const {
        result: _amountsOut,
        isError,
        message,
        error
      }: any = await swapUtils.getAmountsOut(
        activeWallet.privateKey,
        type === 'from' ? swapPair : swapPair.reverse(),
        numeral(value).value()?.toString() || '0',
        slippage
      );
      setIsComputing(false);
      if (isError) {
        showErrorToast(
          message || error.toString() || 'Unable to calculate output amount',
          'error'
        );
        return;
      }
      setAmountsOut(_amountsOut);
      return _amountsOut;
    }
  };

  const onPressMax = async () => {
    if (swapFrom.name === 'VIP') {
      onChangeAmount(maxBalance.toString(), 'from');
    } else {
      setIsComputingMax(true);
      const extraGas = 0.005; // hard coded value to let transactions through
      const maximumAmount =
        (await chain.calculateMaxAmount(activeWallet?.balance)) - extraGas;
      if (Number(maximumAmount) > 0) {
        onChangeAmount(maximumAmount?.toString(), 'from');
      }
      setIsComputingMax(false);
    }
  };

  const onSwap = async () => {
    if (activeWallet) {
      setIsSubmitting(true);
      const amountToSwap =
        numeral(interchanged ? swapTo.amount : swapFrom.amount).value() || 0;
      if (!interchanged) {
        // @ts-ignore
        if (amountToSwap > tokens[2]?.balance) {
          showErrorToast('Insufficient funds.', 'error');
          setIsSubmitting(false);
          return;
        }
      }
      try {
        setLoader(true);
        let response: any = {};
        const payload: any = [
          activeWallet.privateKey,
          swapPair,
          swapFrom.amount as string,
          { deadline: txnTime, gasLimit: 450000, slippage }
        ];
        if (interchanged) {
          response = await swapUtils.swapNewVIPtoBNB.apply(null, payload);
        } else {
          response = await swapUtils.swapNewBNBtoVIP.apply(null, payload);
        }
        setLoader(false);
        if (!response?.isError) {
          showErrorToast('Swap Successful', 'success');
          setIsSubmitting(false);
          // save tx on backend
          dispatch(
            actions.saveTransactionAction({
              txHash: response?.receipt?.transactionHash,
              address: activeWallet.address
            })
          );

          // refresh wallet after 10 seconds when swap is successful
          setTimeout(() => {
            dispatch(actions.initializeChain());
            dispatch(actions.updateWalletBalance());
          }, 1e4);

          navigation.popToTop();
        } else {
          setIsSubmitting(false);
          showErrorToast(response.message, 'error');
        }
      } catch (e) {
        setIsSubmitting(false);
        console.log('Swap error ', e);
        showErrorToast(strings.transaction_failed, 'error');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const showErrorToast = (msg: string, status: any) => {
    toast.show({
      duration: 3000,
      isClosable: true,
      render: ({ id }) => (
        <CustomToast
          id={id}
          variant="left-accent"
          status={status}
          message={msg}
        />
      )
    });
  };

  const isDisabled =
    isSubmitting ||
    Number(swapFrom.amount) <= 0 ||
    Number(swapTo.amount) <= 0 ||
    Number(swapFrom.amount) >= maxBalance ||
    activeWallet?.balance <= 0;

  return (
    <>
      <HStack alignItems={'center'} py="4" justifyContent={'center'}>
        <Text fontSize="22px" fontWeight={'700'}>
          Swap
        </Text>
      </HStack>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <View px={'18px'} flex={1}>
          <HStack justifyContent={'space-evenly'}>
            <TouchableOpacity
              onPress={() => setModalType('SLIPPAGE')}
              style={styles.btnContainer}
            >
              <Text>SLIPPAGE</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => setModalType('SPEED')}
            >
              <Text>SPEED</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => setModalType('TXT_TIME')}
            >
              <Text>TXT TIME</Text>
            </TouchableOpacity> */}
          </HStack>
          <SwapBox
            title="YOU PAY"
            tokenName={swapFrom.name as string}
            conversion={swapFrom.currentPrice as string}
            amount={swapFrom.amount as string}
            onChangeAmount={(text: string) => onChangeAmount(text, 'from')}
            balance={`${swapFrom.balance} ${swapFrom.name}`}
            mt={'27px'}
            slippage={slippage}
            isComputing={isComputingMax}
            maxButton={
              <TouchableOpacity
                style={styles.maxContainer}
                onPress={onPressMax}
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                disabled={!maxBalance}
              >
                <Text fontSize={'16px'} mx="2" color={Colors.PLACEHOLDER}>
                  {strings.max.toUpperCase()}
                </Text>
              </TouchableOpacity>
            }
          />
          <View alignItems={'center'} my="10px">
            <RoundIcon
              source={Icons.swapIcon}
              onPress={onInterchange}
              disabled={isComputing}
            />
          </View>
          <SwapBox
            title="YOU GET"
            tokenName={swapTo.name as string}
            conversion={swapTo.currentPrice as string}
            amount={swapTo.amount as string}
            onChangeAmount={(text: string) => onChangeAmount(text, 'to')}
            balance={`${swapTo.balance} ${swapTo.name}`}
            slippage={slippage}
            isComputing={isComputing}
            isOutput
          />
          <View mt={'20px'} mb="80px">
            <GradientButton
              title="Swap"
              onPress={onSwap}
              disabled={isDisabled}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
      {!!modalType && (
        <SwapModal
          closeModal={() => setModalType('')}
          visible={!!modalType}
          modalType={modalType}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    backgroundColor: Colors.BG_LIGHT,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 20
  },
  maxContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Swap;
