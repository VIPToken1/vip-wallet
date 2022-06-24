import React from 'react';
import { View } from 'react-native';
import { Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Layout, PasswordInput, GradientButton } from 'components';
import { useAuthentication, useTranslations } from 'hooks';

type EnterPasswordScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'EnterPassword'
>;

const EnterPassword = () => {
  const { setIsLoggedIn } = useAuthentication();
  const { strings } = useTranslations();
  const navigation = useNavigation<EnterPasswordScreenNavigationProp>();

  const navigateToHome = () => {
    navigation.navigate('Home');
    setIsLoggedIn(true);
  };

  return (
    <Layout>
      <View>
        <Text fontSize="2xl" fontWeight="bold" textTransform="capitalize">
          {strings.password}
        </Text>
        <PasswordInput placeholder={strings.enter_password} py="6" />
      </View>
      <View>
        <Text fontSize="sm" p="4">
          {strings.enter_password_description}
        </Text>
        <GradientButton title={strings.continue} onPress={navigateToHome} />
      </View>
    </Layout>
  );
};

export default EnterPassword;
