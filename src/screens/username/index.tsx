import React from 'react';
import { View } from 'react-native';
import { Input, Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Layout, GradientButton } from 'components';
import { useTranslations } from 'hooks';

type UsernameScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Username'
>;

const Username = () => {
  const navigation = useNavigation<UsernameScreenNavigationProp>();
  const { strings } = useTranslations();

  return (
    <Layout alignItems="center" justifyContent="space-between">
      <View>
        <Text fontSize="2xl" fontWeight="bold">
          {strings.sign_in}
        </Text>
        <Text fontSize="md" fontWeight="normal" py="2">
          {strings.username_description}
        </Text>
        <Input
          size="xl"
          variant="unstyled"
          placeholder="pick a username"
          color="white"
          selectionColor="white"
          px="2"
          py="8"
          fontWeight="extrabold"
          fontSize={20}
          keyboardAppearance="dark"
          InputLeftElement={
            <Text fontWeight="extrabold" fontSize={20}>
              @
            </Text>
          }
        />
      </View>
      {/* TODO: Change navigation */}
      <GradientButton
        title={strings.next}
        onPress={() => navigation.navigate('Profile')}
      />
    </Layout>
  );
};

export default Username;
