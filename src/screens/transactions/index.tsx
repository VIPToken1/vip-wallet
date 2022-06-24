import React, { FC, useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { HStack, Image, Pressable, Text, View, VStack } from 'native-base';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import fromExponential from 'from-exponential';
import { useAppDispatch, useAppSelector, useTranslations } from 'hooks';
import NETWORKS from 'config/networks';
import { countDecimals } from 'utils/helpers';
import { actions } from 'store';
import { Icons, screenHeight } from 'theme';
import { Colors } from 'theme/colors';

type TransactionRowProp = {
  status: string;
  from: string;
  to: string;
  value: string;
  contractAddress: string;
  walletAddress: string;
  txType: string;
  txAmount: string;
  txMethod: string;
  credit: string;
  confirmations?: number;
  tokenDecimal?: number;
  swapAmount?: string;
  isContractTx?: boolean;
  isSent?: boolean;
  isError?: string | number;
  onPressTransaction: (tx: any) => void;
};

type TransactionsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Transactions'
>;

type TransactionsScreenRouteProp = RouteProp<
  RootStackParamList,
  'Transactions'
>;

const styles = StyleSheet.create({
  contentContainer: {
    marginTop: 14,
    paddingBottom: 14
  },
  image: {
    width: 48,
    height: 48
  }
});

const getFormattedValue = (
  value: string,
  tokenDecimal?: number,
  maxDecimals: number = 6
): string => {
  let val: any = Number(value) / 10 ** Number(tokenDecimal);
  val = fromExponential(val);
  const decimals = countDecimals(val);
  if (decimals > maxDecimals) {
    val = Number(val).toFixed(maxDecimals);
  }
  return val;
};

const TransactionRow: FC<TransactionRowProp> = props => {
  const { strings } = useTranslations();

  const sign = useMemo(() => {
    if (props.isSent) {
      return '-';
    } else {
      return '+';
    }
  }, [props.isSent]);

  const getSwapAmount = (
    amount: string,
    tokenDecimal: number,
    maxDecimals: number = 6
  ) => {
    if (amount) {
      return getFormattedValue(amount, tokenDecimal, maxDecimals);
    }
    return '';
  };

  const getAmount = () => {
    if (props.isContractTx) {
      return `${sign}${getFormattedValue(props.txAmount, 9)} VIP`;
    }
    return `${sign}${(Number(props.txAmount) / 1e18).toFixed(5)} BNB`;
  };

  return (
    <Pressable
      backgroundColor={Colors.BG_LIGHT}
      mb={2}
      pl="24px"
      pr="10px"
      py="20px"
      onPress={() => props.onPressTransaction(props)}
    >
      <HStack alignItems={'center'} justifyContent={'space-between'}>
        <VStack>
          <Text
            color={
              props.txType === 'Swap'
                ? '#eda726'
                : sign === '-'
                ? Colors.PRIMARY
                : Colors.FLORENCE_GREEN
            }
            fontSize="lg"
            fontWeight="semibold"
          >
            {props.txMethod}
          </Text>
          <Text fontSize="lg" fontWeight="semibold">
            {props.isError == 1 ? strings.failed : strings.confirmed}
          </Text>
        </VStack>
        <HStack alignItems="center">
          <VStack>
            <Text
              fontSize="lg"
              textAlign="right"
              mr="12px"
              fontWeight="semibold"
            >
              {props.txType === 'Swap'
                ? `-${getSwapAmount(
                    props.txAmount,
                    props.credit === 'VIP' ? 18 : 9,
                    props.credit === 'VIP' ? 6 : 2
                  )} ${props.credit === 'VIP' ? 'BNB' : 'VIP'}`
                : getAmount()}
            </Text>
            {!!props.swapAmount && (
              <Text
                fontSize="lg"
                textAlign="right"
                mr="12px"
                fontWeight="semibold"
              >
                {`+${getSwapAmount(
                  props.swapAmount,
                  props.credit === 'VIP' ? 9 : 18,
                  props.credit === 'VIP' ? 2 : 6
                )} ${props.credit}`}
              </Text>
            )}
          </VStack>
          {props.txType === 'Swap' ? (
            <View mx={2}>
              <MaterialIcon name="swap-horiz" color={Colors.WHITE} size={24} />
            </View>
          ) : (
            <Image
              mx={2}
              source={props.isSent ? Icons.sentIcon : Icons.receivedIcon}
              alt="uploadIcon"
            />
          )}
        </HStack>
      </HStack>
      <Text
        fontSize="12px"
        color={Colors.PLACEHOLDER}
        fontWeight="semibold"
        numberOfLines={1}
        ellipsizeMode="middle"
        width="80%"
      >
        From: {props.from}
      </Text>
      <Text
        fontSize="12px"
        color={Colors.PLACEHOLDER}
        fontWeight="semibold"
        ellipsizeMode="middle"
        numberOfLines={1}
        width="82%"
      >
        To: {props.to}
      </Text>
    </Pressable>
  );
};

const Transactions: FC = () => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const navigation = useNavigation<TransactionsScreenNavigationProp>();
  const { params = {} } = useRoute<TransactionsScreenRouteProp>();
  const isFocused = useIsFocused();
  const dispatch = useAppDispatch();
  const { strings } = useTranslations();
  const { activeWallet } = useAppSelector(state => state.crypto);
  const transactionHistory = useAppSelector(state => state.transactions.data);

  const token = params?.token;

  const history = React.useMemo(() => {
    const activeWalletHistory = transactionHistory[activeWallet?.address] || [];
    if (token?.address) {
      return activeWalletHistory.filter(
        (tx: Omit<TransactionRowProp, 'onPressTransaction'>) =>
          tx.txType === 'Swap' || tx.credit === token.symbol?.toUpperCase()
      );
    }
    if (token?.symbol?.toUpperCase() === 'BNB') {
      return activeWalletHistory.filter(
        (tx: Omit<TransactionRowProp, 'onPressTransaction'>) =>
          tx.txType === 'Swap' || tx.credit === 'BNB'
      );
    }
    return activeWalletHistory;
  }, [activeWallet?.address, transactionHistory, token]);

  React.useEffect(() => {
    if (activeWallet && isFocused) {
      dispatch(actions.getTransactionsAction(activeWallet.address));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeWallet, isFocused]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(actions.getTransactionsAction(activeWallet.address));
    setIsRefreshing(false);
  };

  const onPressTransaction = (tx: any) => viewOnBlockExplorer(`tx/${tx.hash}`);

  const viewOnBlockExplorer = (endpoint: string) => {
    const navParams = {
      url: `${NETWORKS.get('BSC_MAINNET')?.blockExplorerUrl}/${endpoint}`
    };
    navigation.navigate('BlockExplorer', navParams);
  };

  const renderEmptyList = () => {
    return (
      <View h={screenHeight * 0.6} justifyContent="center" alignItems="center">
        <Image
          source={Icons.transactionsIcon}
          size="50px"
          alt="transactions_icon"
        />
        <Text mt="8" mb="2" fontSize="md">
          {strings.no_transaction_history_found}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }: any) => (
    <TransactionRow
      {...item}
      walletAddress={activeWallet.address}
      onPressTransaction={onPressTransaction}
    />
  );

  return (
    <FlatList
      data={history}
      keyExtractor={(_, index) => index.toString()}
      contentContainerStyle={styles.contentContainer}
      renderItem={renderItem}
      extraData={history}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={Colors.PRIMARY}
        />
      }
      ListEmptyComponent={renderEmptyList}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      removeClippedSubviews
    />
  );
};

export default Transactions;
