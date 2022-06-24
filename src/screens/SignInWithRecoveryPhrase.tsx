import React from 'react';
import { Center, Text, TextArea } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Layout, GradientButton } from 'components';
import { useTranslations } from 'hooks';
import { screenWidth } from 'theme/dimensions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type SignInWithRecoveryPhraseScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SignInWithRecoveryPhrase'
>;

const SignInWithRecoveryPhrase = () => {
  const navigation =
    useNavigation<SignInWithRecoveryPhraseScreenNavigationProp>();
  const { strings } = useTranslations();
  return (
    <Layout>
      <KeyboardAwareScrollView
        extraHeight={250}
        keyboardShouldPersistTaps="handled"
      >
        <Text fontSize="2xl" fontWeight="bold">
          {strings.sign_in_with_recovery_phrase}
        </Text>
        <Text fontSize="md" fontWeight="normal" py="2">
          {strings.sign_in_description}
        </Text>
        <Center width="80%" alignSelf="center">
          <TextArea
            h={'64'}
            width={screenWidth - 40}
            fontSize={20}
            borderRadius={20}
            borderColor="#444444"
            _focus={{
              borderColor: '#C4C4C4'
            }}
            color="white"
            selectionColor="white"
            p="4"
            my="6"
          />
        </Center>
        <GradientButton
          title={strings.next}
          onPress={() => navigation.navigate('ImportAccount')}
        />
      </KeyboardAwareScrollView>
    </Layout>
  );
};

export default SignInWithRecoveryPhrase;
