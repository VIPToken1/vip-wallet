import React, { useState } from 'react';
import { Image, Stack, Text, VStack, View } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Layout, GradientButton, CustomCheckbox } from 'components';
import { useTranslations } from 'hooks';
import { Icons } from 'theme';
import { Colors } from 'theme/colors';

type BackupWalletScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'BackupWallet'
>;

const BackupWallet = () => {
  const navigation = useNavigation<BackupWalletScreenNavigationProp>();
  const { strings } = useTranslations();
  const [isAccepted, setIsAccepted] = useState(false);

  return (
    <Layout flex={1}>
      <View flex={1}>
        <Text
          color={Colors.PLACEHOLDER}
          fontSize="md"
          fontWeight="normal"
          py="2"
          textAlign={'center'}
        >
          {strings.backup_wallet_description}
        </Text>
        <Stack flex={1} justifyContent={'center'} alignItems="center">
          <Image
            source={Icons.backupWalletIcon}
            px="2"
            resizeMode="contain"
            alt="backupWallet"
          />
        </Stack>
      </View>
      <VStack alignSelf="center">
        {/* I HAVE REAAD ADDED IN VIP TOKEN */}
        <CustomCheckbox
          position="left"
          isChecked={isAccepted}
          onChange={isSelected => setIsAccepted(isSelected)}
        >
          <Text color={Colors.PLACEHOLDER} fontSize="md" p="4">
            {strings.agree_to_terms}
          </Text>
        </CustomCheckbox>
        <GradientButton
          title={strings.backup_now}
          disabled={!isAccepted}
          onPress={() => navigation.navigate('RecoveryPhraseWords')}
        />
        {/* <Text
          mt="2"
          fontSize={18}
          textDecorationLine="underline"
          textAlign="center"
          onPress={() => navigation.navigate('Home')}
        >
          {strings.later}
        </Text> */}
      </VStack>
    </Layout>
  );
};

export default BackupWallet;
