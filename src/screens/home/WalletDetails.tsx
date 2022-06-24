import React, { FC, useState } from 'react';
import { TouchableOpacity, ScrollView } from 'react-native';
import { Box, HStack, Image, Stack, Text } from 'native-base';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Humanize from 'humanize-plus';
import { BackIcon, CoinDetails, Layout } from 'components';
import {
  useAppDispatch,
  useAppSelector,
  useFiatPrice,
  useTranslations
} from 'hooks';
import { Icons } from 'theme';
import { Colors } from 'theme/colors';
import { RLineCharts } from 'components/graph';
import { actions } from 'store';

type WalletDetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'WalletDetails'
>;

type WalletDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  'WalletDetails'
>;

const getFormattedBalance = (balance: number, symbol: string) => {
  if (symbol?.toUpperCase() === 'VIP') {
    return Humanize.formatNumber(balance, 2);
  }
  return balance;
};

const WalletDetails: FC = () => {
  const navigation = useNavigation<WalletDetailsScreenNavigationProp>();
  const route = useRoute<WalletDetailsScreenRouteProp>();

  const dispatch = useAppDispatch();
  const { charts } = useAppSelector(state => state.crypto);
  const { strings } = useTranslations();

  const [selectedTime, setSelectedTime] = useState('1');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [graphData, setGraphData] = useState<any[]>([]);
  const [coinDetails, setCoinDetails] = useState<any>();

  const { currencySign, getConversionRate } = useFiatPrice();

  const { token } = route.params;

  React.useEffect(() => {
    if (token) {
      getCoinDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  React.useEffect(() => {
    if (token) {
      getChartData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, selectedTime]);

  React.useEffect(() => {
    if (charts) {
      const timeSpan = selectedTime == 0 ? 1 : selectedTime;
      let data = charts[token?.id]?.[timeSpan] || [];
      setGraphData(data);
    }
  }, [charts, selectedTime, token]);

  const getChartData = async () => {
    await dispatch(actions.getMarketDataAction(token?.id, selectedTime));
  };

  const getCoinDetails = async () => {
    try {
      const response = await dispatch(actions.getCoinDetails(token?.id));
      setCoinDetails(response);
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const onChangeDuration = (duration: string) => {
    if (duration !== selectedTime) {
      setSelectedTime(duration);
    }
  };

  const isBNB = ['BNB', 'WBNB'].includes(token.symbol?.toUpperCase());
  const priceChange = getConversionRate(
    coinDetails?.price_change_24h_in_currency
  );
  const priceChangeNegative = priceChange < 0;

  return (
    <>
      <HStack justifyContent="space-between" alignItems="center" w="full" p="4">
        <HStack alignItems="center">
          <BackIcon />
          <HStack alignItems="center">
            <Image source={isBNB ? Icons.bnbIcon : Icons.vipIcon} alt="icon" />
            <Text
              fontSize="16px"
              fontWeight="bold"
              px="4"
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {`${
                token.balance
                  ? getFormattedBalance(token.balance, token.symbol)
                  : 0
              } ${token.symbol?.toUpperCase()}`}
            </Text>
          </HStack>
        </HStack>
        <Text color={Colors.PLACEHOLDER} fontSize="md" fontWeight="medium">
          {token.balanceInUSD ? `${currencySign}${token.balanceInUSD}` : ''}
        </Text>
      </HStack>
      <ScrollView alwaysBounceVertical={false}>
        <Layout pt="0">
          <Stack w="full" flex={1} py="1">
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              alignSelf="center"
              w="80%"
              py="2"
            >
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => navigation.navigate('SendToken', { token })}
              >
                <Box alignItems="center" w="85px">
                  <Image source={Icons.sentRoundIcon} alt="send" />
                  <Text fontSize="xs" color="#777777" py="4">
                    {strings.send}
                  </Text>
                </Box>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => navigation.navigate('ReceiveQr', { token })}
              >
                <Box alignItems="center" w="85px">
                  <Image source={Icons.receivedRoundIcon} alt="receive" />
                  <Text fontSize="xs" color="#777777" py="4">
                    {strings.receive}
                  </Text>
                </Box>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() =>
                  navigation.navigate('Transactions', {
                    token
                  })
                }
              >
                <Box alignItems="center" w="85px">
                  <Image
                    source={Icons.transactionRoundIcon}
                    alt="transaction"
                  />
                  <Text fontSize="xs" color="#777777" py="4">
                    {strings.transactions}
                  </Text>
                </Box>
              </TouchableOpacity>
            </Box>
            <Box
              mb="4"
              flexDirection="row"
              alignItems="flex-end"
              w="full"
              flexWrap="wrap"
            >
              <Text
                fontSize="40px"
                fontWeight="700"
                adjustsFontSizeToFit
                numberOfLines={1}
                mr="2"
              >
                {currencySign}
                {getConversionRate(coinDetails?.current_price)}
              </Text>
              <Text
                fontSize="md"
                color={priceChangeNegative ? '#CF4D4D' : '#44FF62'}
                ml="2"
                py="10px"
              >
                {currencySign}
                {priceChange}
              </Text>
              <Box
                bg={priceChangeNegative ? '#CF4D4D' : '#44FF62'}
                rounded="sm"
                borderWidth="0.1px"
                px="1"
                ml="1"
                my="12px"
              >
                <Text
                  fontSize="xs"
                  fontWeight="500"
                  color="black"
                  textAlign="center"
                >
                  {coinDetails?.price_change_percentage_24h?.toFixed?.(2)}%
                </Text>
              </Box>
            </Box>
          </Stack>
          <Box>
            <RLineCharts
              graphData={graphData}
              onChangeDuration={onChangeDuration}
              activeLabel={selectedIndex}
              setActiveLabel={setSelectedIndex}
            />
          </Box>
          <Box height="100px" bg="gray.400" />
        </Layout>
      </ScrollView>
      <CoinDetails coinDetails={coinDetails} />
    </>
  );
};

export default WalletDetails;
