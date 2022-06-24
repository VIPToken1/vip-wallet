import React from 'react';
import { HStack, Input, View, Text, VStack, Stack } from 'native-base';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Layout, GradientButton } from 'components';
import { useTranslations } from 'hooks';
import { Colors } from 'theme/colors';

type ReceiveVIPScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ReceiveVIP'
>;

type ReceiveVIPScreenRouteProp = RouteProp<RootStackParamList, 'ReceiveVIP'>;

const ReceiveVIP = () => {
  const [amount, setAmount] = React.useState('');

  const navigation = useNavigation<ReceiveVIPScreenNavigationProp>();
  const { params } = useRoute<ReceiveVIPScreenRouteProp>();

  const { token } = params;
  const { strings } = useTranslations();

  React.useEffect(() => {
    let headerTitle = strings.receive;
    if (token.symbol.toUpperCase() === 'BNB') {
      headerTitle = 'Receive BNB';
    } else if (token.symbol.toUpperCase() === 'WBNB') {
      headerTitle = 'Receive WBNB';
    } else if (token.symbol.toUpperCase() === 'VIP') {
      headerTitle = 'Receive VIP Token';
    }
    navigation.setOptions({ headerTitle });
  }, [navigation, token, strings]);

  const onChangeAmount = (value: string) => setAmount(value.replace(/,/g, '.'));

  const onSubmit = () => {
    if (!amount) {
      return;
    }
    navigation.navigate('SendLink', { token, amount });
  };

  return (
    <Layout flex={1} pb="40px">
      <VStack alignSelf={'flex-start'} mt="130px">
        <Text color={Colors.PLACEHOLDER} fontSize={'18px'}>
          {strings.set_amount.toUpperCase()}
        </Text>
        <HStack mt="24px">
          <View w="70%" borderRadius={10} bg={Colors.BG_LIGHT}>
            <Input
              fontSize="24px"
              borderWidth={0}
              _ios={{ py: '24px' }}
              _android={{ py: '16px' }}
              py="16px"
              textAlign={'center'}
              color={Colors.WHITE}
              selectionColor={Colors.WHITE}
              placeholder="Amount"
              placeholderTextColor={Colors.PLACEHOLDER}
              keyboardType="numeric"
              maxLength={10}
              value={amount}
              onChangeText={onChangeAmount}
            />
          </View>
          <View
            alignItems={'center'}
            backgroundColor="red"
            justifyContent={'center'}
            w="30%"
          >
            <Text
              color={Colors.PLACEHOLDER}
              fontSize={'18px'}
              textTransform="uppercase"
            >
              {token.symbol}
            </Text>
          </View>
        </HStack>
        <Stack mt="80px">
          <GradientButton
            title={strings.next}
            disabled={!amount}
            onPress={onSubmit}
          />
        </Stack>
      </VStack>
    </Layout>
  );
};

export default ReceiveVIP;
