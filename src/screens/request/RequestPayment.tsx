import React, { FC, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { HStack, Image, Stack, Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Layout, GradientButton, VirtualKeypad } from 'components';
import { useTranslations } from 'hooks';
import { Icons } from 'theme';

type RequestPaymentScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'RequestPayment'
>;

const RequestPayment: FC = () => {
  const navigation = useNavigation<RequestPaymentScreenNavigationProp>();
  const { strings } = useTranslations();
  const [isInterchanged, setIsInterchanged] = useState(true);
  const [amount] = useState<string>('1.75');
  const [amountInUsd] = useState<string>('7,808.00');

  const onInterchangePress = () => setIsInterchanged(prev => !prev);

  return (
    <Layout alignItems="center" flexGrow={1} pb="40px">
      <Stack w="full" alignSelf="flex-start" flexGrow={1} bgColor="red" pt="4">
        <Text mb="10%" fontSize="md" fontWeight="500">
          {strings.enter_amount}
        </Text>
        <HStack justifyContent="space-between" alignItems="center" mt="5%">
          <Image source={Icons.ethGrayIcon} alt="coin" />
          {isInterchanged ? (
            <Text color="#0DC92B" fontSize={40} fontWeight="semibold">
              ${amountInUsd}
            </Text>
          ) : (
            <Text fontSize={40} fontWeight="semibold" color="white">
              {amount}{' '}
              <Text fontSize={18} fontWeight="semibold" color="white">
                ETH
              </Text>
            </Text>
          )}
          <TouchableOpacity onPress={onInterchangePress}>
            <Image source={Icons.interchangeIcon} alt="interchange" />
          </TouchableOpacity>
        </HStack>
        {isInterchanged ? (
          <Text
            textAlign="center"
            fontSize="md"
            fontWeight="bold"
            color="white"
          >
            {amount}{' '}
            <Text fontSize={18} fontWeight="bold" color="white">
              ETH
            </Text>
          </Text>
        ) : (
          <Text
            color="#0DC92B"
            textAlign="center"
            fontSize="md"
            fontWeight="bold"
          >
            ${amountInUsd}
          </Text>
        )}
      </Stack>
      <VirtualKeypad onPress={console.log} />
      <GradientButton
        title={strings.next}
        onPress={() => navigation.navigate('SendLink')}
      />
    </Layout>
  );
};

export default RequestPayment;
