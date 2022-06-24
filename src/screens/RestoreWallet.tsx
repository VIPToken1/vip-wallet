import React from 'react';
import { StyleSheet } from 'react-native';
import { Image, Stack, Text, View, VStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GradientButton, Layout } from 'components';
import { useTranslations } from 'hooks';
import { Icons } from 'theme';
import { Colors } from 'theme/colors';

type RestoreWalletScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'RestoreWallet'
>;

const RestoreWallet = () => {
  const navigation = useNavigation<RestoreWalletScreenNavigationProp>();
  const { strings } = useTranslations();
  return (
    <Layout flex={1}>
      <View flex={1}>
        <Text
          textAlign={'center'}
          color={Colors.PLACEHOLDER}
          fontSize="md"
          fontWeight="normal"
          py="2"
        >
          {strings.restore_wallet_description}
        </Text>
        <Stack flex={1} justifyContent={'center'} alignItems="center">
          <Image
            source={Icons.backupWalletIcon}
            px="2"
            resizeMode="contain"
            alt="restoreWallet"
          />
        </Stack>
      </View>
      <VStack alignSelf="center">
        <GradientButton
          title={strings.restore_with_recovery_phrase}
          onPress={() =>
            navigation.navigate('CreatePin', { alreadyAccount: true })
          }
        />
      </VStack>
    </Layout>
  );
};

export default RestoreWallet;
