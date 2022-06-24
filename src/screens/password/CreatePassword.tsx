import React from 'react';
import { Text, View } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Layout, GradientButton } from 'components';
import { useTranslations } from 'hooks';

type CreatePasswordScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CreatePassword'
>;

const CreatePassword = () => {
  const navigation = useNavigation<CreatePasswordScreenNavigationProp>();
  const { strings } = useTranslations();
  return (
    <Layout>
      <View alignSelf="flex-start">
        <Text fontSize="2xl" fontWeight="bold" textTransform="capitalize">
          {strings.create_password}
        </Text>
        <Text fontSize="md" fontWeight="normal" py="2">
          {strings.to_encrypt_backup}
        </Text>
      </View>
      <View>
        <Text fontSize="md" fontWeight="normal" py="2">
          {strings.create_password_info}
        </Text>
        <GradientButton
          style={{ alignSelf: 'center' }}
          title={strings.i_understand}
          onPress={() => navigation.navigate('CreatePasswordForm')}
        />
      </View>
    </Layout>
  );
};

export default CreatePassword;
