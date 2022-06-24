import React, { FC } from 'react';
import { HStack, Image, View, Text, VStack } from 'native-base';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BackIcon } from 'components';
import { useAppSelector, useFiatPrice, useTranslations } from 'hooks';
import { Icons } from 'theme';
import { Colors } from 'theme/colors';
import { FlatList, TouchableOpacity } from 'react-native';

type PayingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Send' | 'Receive'
>;
type PayingScreenRouteProp = RouteProp<RootStackParamList, 'Send' | 'Receive'>;
const List = [
  {
    name: 'BNB',
    image: Icons.bnbIcon
  },
  {
    name: 'WBNB',
    image: Icons.bnbIcon
  },
  {
    name: 'VIP',
    image: Icons.vipIcon
  }
];

const Send: FC = () => {
  const navigation = useNavigation<PayingScreenNavigationProp>();
  const route = useRoute<PayingScreenRouteProp>();
  const params = route.params;

  const { activeWallet, tokens } = useAppSelector(state => state.crypto);
  const { currencySign = '$' } = useAppSelector(
    state => state.user.defaultCurrency
  );

  const { strings } = useTranslations();

  const { calculateCryptoToFiat } = useFiatPrice();

  return (
    <>
      <VStack backgroundColor={Colors.BG_LIGHT} w="full" p="4">
        <HStack justifyContent="space-between" alignItems="center" w="full">
          <BackIcon onPress={() => navigation.goBack()} />
          <Text fontSize="2xl" fontWeight="bold">
            {route.name}
          </Text>
          <View w={30} />
        </HStack>
        <Text fontSize="40px" mt="44px" textAlign="center" fontWeight="bold">
          {currencySign}
          {activeWallet.totalBalance?.toFixed(2)}
        </Text>
        <Text
          fontSize="16px"
          mt="15px"
          textAlign="center"
          color={Colors.PLACEHOLDER}
          fontWeight="bold"
          mb="32px"
        >
          {activeWallet.name || 'Account 1'}
        </Text>
      </VStack>
      <View mt="4">
        <FlatList
          data={tokens}
          keyExtractor={(_, index) => index.toString()}
          ItemSeparatorComponent={() => (
            <View mx="4" backgroundColor={'#0F1225'} h="1px" />
          )}
          renderItem={({ item: token }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(
                    route.name === 'Send' ? 'SendToken' : 'ReceiveQr',
                    { token, scannedAddress: params?.scannedAddress }
                  )
                }
              >
                <HStack
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  px="4"
                  py="4"
                >
                  <HStack alignItems={'center'}>
                    <Image
                      w="50px"
                      h="50px"
                      source={Icons[token.icon as keyof typeof Icons]}
                      alt="coin"
                    />
                    <Text fontSize={'20px'} ml="4">
                      {token.name}
                    </Text>
                  </HStack>
                  <Image
                    mx="4"
                    source={Icons.rightChevronIcon}
                    alt="rightChevron"
                  />
                </HStack>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </>
  );
};

export default Send;
