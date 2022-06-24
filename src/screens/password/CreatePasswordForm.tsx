import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Stack, Text, View } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  CustomCheckbox,
  Layout,
  PasswordInput,
  GradientButton
} from 'components';
import { useTranslations } from 'hooks';

type CreatePasswordFormScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CreatePasswordForm'
>;

const CreatePasswordForm = () => {
  const navigation = useNavigation<CreatePasswordFormScreenNavigationProp>();
  const { strings } = useTranslations();
  const [isAgreed, setIsAgreed] = useState(false);
  return (
    <Layout alignItems="center">
      <Stack w="full">
        <Text
          fontSize="2xl"
          fontWeight="bold"
          textTransform="capitalize"
          numberOfLines={2}
        >
          {strings.create_password}
        </Text>
        <Text fontSize="md" fontWeight="normal" py="2">
          {strings.create_password_description}
        </Text>
        <View style={styles.fieldsContainer}>
          <PasswordInput mt="1" placeholder={strings.new_password} />
          <PasswordInput mt="1" placeholder={strings.confirm_password} />
        </View>
      </Stack>
      <View w="full">
        <View alignSelf="flex-start">
          <CustomCheckbox
            position="left"
            isChecked={isAgreed}
            onChange={setIsAgreed}
          >
            <Text fontSize="md" p="4">
              {strings.agree_to_terms}
            </Text>
          </CustomCheckbox>
        </View>
        <GradientButton
          title={strings.create_password}
          disabled={!isAgreed}
          onPress={() => navigation.navigate('Home')}
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 30
  },
  fieldsContainer: {
    marginTop: 20
  }
});

export default CreatePasswordForm;
