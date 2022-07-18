import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Image, Stack, Text, VStack, View, Button } from 'native-base';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Layout, GradientButton, CustomCheckbox } from 'components';
import {
  useAppDispatch,
  useAppSelector,
  useLoader,
  useTranslations
} from 'hooks';
import { Icons } from 'theme';
import { Colors } from 'theme/colors';
import { actions } from 'store';

type BackupWalletScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'BackupWallet'
>;

const BackupWallet = () => {
  const navigation = useNavigation<BackupWalletScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { setLoader } = useLoader();
  const { strings } = useTranslations();
  const isFocused = useIsFocused();
  const [isAccepted, setIsAccepted] = useState(false);
  const { phrase } = useAppSelector(state => state.crypto);

  const onBackupLater = () => {
    Alert.alert(
      strings.backup_later_title,
      strings.backup_later_desc,
      [
        { text: strings.cancel },
        {
          text: strings.confirm,
          style: 'default',
          onPress: () => {
            setLoader(true);
            setTimeout(() => dispatch(actions.generateRecoveryPhrase(16)), 1e3);
          }
        }
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    if (phrase && isFocused) {
      setTimeout(() => {
        setLoader(false);
        dispatch(actions.login());
        navigation.navigate('Home');
      }, 2e3);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phrase, isFocused]);

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
        <Button
          size="lg"
          variant="link"
          mt="4"
          mb="2"
          onPress={onBackupLater}
          _text={{ color: Colors.WHITE }}
        >
          {strings.backup_later}
        </Button>
        {/* <Text
          mt="4"
          fontSize={18}
          textDecorationLine="underline"
          textAlign="center"
          onPress={onBackupLater}
        >
          {strings.later}
        </Text> */}
      </VStack>
    </Layout>
  );
};

export default BackupWallet;
