import React, { FC } from 'react';
import { ImageSourcePropType, TouchableOpacity } from 'react-native';
import { Box, HStack, Image, Text, VStack } from 'native-base';
import * as Humanize from 'humanize-plus';
import { Colors } from 'theme/colors';
import { useAppDispatch, useAppSelector, useFiatPrice } from 'hooks';
import { actions } from 'store';
import { Icons } from 'theme';

type WalletTokenProps = {
  token: {
    icon: ImageSourcePropType;
    title: string;
    balance: string;
    currentPrice: string;
    slope: string;
    balanceInUSD: string;
    symbol?: string;
    type: string;
    price_change_24h?: string;
  };
  currencySign: string;
  navigateToDetails: () => void;
};

const WalletToken: FC<WalletTokenProps> = ({
  token,
  navigateToDetails,
  currencySign
}) => {
  const isContract = token.type === 'contract';
  const dispatch = useAppDispatch();
  const { activeWallet } = useAppSelector(state => state.crypto);

  const { getConversionRate } = useFiatPrice();

  React.useEffect(() => {
    if (isContract) {
      dispatch(actions.getERCTokenBalanceAction(token));
    }
  }, [dispatch, isContract, token, activeWallet]);

  const isBNB = ['BNB', 'WBNB'].includes(
    token?.symbol?.toUpperCase() as string
  );
  // @ts-ignore
  const priceChangeNegative = token?.price_change_24h < 0;

  return (
    <TouchableOpacity onPress={navigateToDetails}>
      <HStack my="5" justifyContent="center">
        <Image
          // @ts-ignore
          source={Icons[token.icon]}
          alt="icon"
          size="40px"
          resizeMode="contain"
        />
        <VStack w="90%" alignSelf="center">
          <HStack pl="4" justifyContent="space-between" alignItems="center">
            <Text
              fontSize="lg"
              fontWeight="bold"
              textTransform="uppercase"
              adjustsFontSizeToFit
            >
              {token.symbol}
            </Text>
            <Text fontSize="md" fontWeight="medium" adjustsFontSizeToFit>
              {!isNaN(Number(token.balance))
                ? isBNB
                  ? token.balance
                  : Humanize.formatNumber(token.balance || 0, 2)
                : 0}
            </Text>
          </HStack>
          <HStack pl="4" justifyContent="space-between" alignItems="center">
            <Box flexDirection="row">
              <Text
                fontSize="sm"
                fontWeight="medium"
                color={Colors.PLACEHOLDER}
                adjustsFontSizeToFit
              >
                {getConversionRate(token.currentPrice)
                  ? `${currencySign}${getConversionRate(token.currentPrice)}`
                  : 'N/A'}
              </Text>
              <Text
                fontSize="sm"
                fontWeight="medium"
                color={priceChangeNegative ? '#CF4D4D' : Colors.FLORENCE_GREEN}
                pl="1"
                textAlign="right"
                adjustsFontSizeToFit
              >
                {token.price_change_24h
                  ? `${priceChangeNegative ? '' : '+'}${
                      Number(token.price_change_24h)?.toFixed?.(2) ?? ''
                    }%`
                  : ''}
              </Text>
            </Box>
            <Text
              fontSize="sm"
              fontWeight="medium"
              color={Colors.PLACEHOLDER}
              textAlign="right"
              adjustsFontSizeToFit
            >
              {!isNaN(token.balanceInUSD)
                ? `~ ${currencySign}${token.balanceInUSD || 0}`
                : ''}
            </Text>
          </HStack>
        </VStack>
      </HStack>
    </TouchableOpacity>
  );
};

export default WalletToken;
