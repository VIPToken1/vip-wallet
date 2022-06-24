import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Image, Modal, Text, TextArea, useToast, View } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Layout, GradientButton } from 'components';
import { useAppDispatch, useLoader, useTranslations } from 'hooks';
import { screenWidth } from 'theme/dimensions';
import { Icons } from 'theme';
import { Colors } from 'theme/colors';
import { validatePhrase } from 'utils';
import { actions } from 'store';

type ImportAccountScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ImportAccount'
>;

// ACTIVATE: display this component with `isSuccess` state
const ImportAccountSuccess: FC<{ onClose: () => void }> = ({ onClose }) => {
  const { strings } = useTranslations();

  return (
    <Modal flex={1} mt={5} isOpen animationPreset="slide">
      <Layout flex={0}>
        <TouchableOpacity onPress={onClose} style={styles.closeIconContainer}>
          <Image
            source={Icons.closeIcon}
            width="30"
            height="30"
            alignSelf="flex-end"
            resizeMode="contain"
            alt="close"
          />
        </TouchableOpacity>
        <View pt="4">
          <Text fontSize="2xl" fontWeight="bold">
            {strings.account_imported_successfully}
          </Text>
          <Text fontSize="md" fontWeight="normal" py="2">
            {strings.account_imported_description}
          </Text>
        </View>
      </Layout>
    </Modal>
  );
};

const ImportAccount = () => {
  const navigation = useNavigation<ImportAccountScreenNavigationProp>();
  const { strings } = useTranslations();
  const [isSuccess, setIsSuccess] = useState(false);
  const [recoveryPhrase, setRecoveryPhrase] = useState('');

  const toast = useToast();
  const { setLoader } = useLoader();

  const dispatch = useAppDispatch();

  useEffect(() => {
    navigation.setOptions({ headerShown: !isSuccess });
  }, [isSuccess, navigation]);

  const navigateToHome = () => {
    setIsSuccess(false);
    dispatch(actions.login());
    setLoader(true);
    navigation.navigate('Home');
  };

  const handleChange = (value: string) => {
    setRecoveryPhrase(value);
    toast.closeAll();
  };

  const onSubmitPhrase = () => {
    if (validatePhrase(recoveryPhrase)) {
      dispatch(actions.setRecoveryPhrase(recoveryPhrase?.toLowerCase()));
      navigateToHome();
    } else {
      toast.show({
        id: 'error',
        title: strings.invalid_phrase,
        status: 'error',
        variant: 'subtle'
      });

      setTimeout(() => setRecoveryPhrase(''), 1e3);
    }
  };

  if (isSuccess) {
    return <ImportAccountSuccess onClose={navigateToHome} />;
  }
  return (
    <Layout>
      <View>
        <Text
          fontSize="md"
          textAlign={'center'}
          color={Colors.PLACEHOLDER}
          fontWeight="normal"
          py="2"
        >
          {strings.import_wallet_desc}
        </Text>
        <TextArea
          h="120px"
          width={screenWidth - 60}
          fontSize={16}
          alignSelf="center"
          borderRadius={10}
          borderColor="#444444"
          selectionColor="#FFFFFF"
          _focus={{ borderColor: '#999999' }}
          autoCompleteType="off"
          autoCorrect={false}
          autoCapitalize="none"
          color="white"
          keyboardAppearance="dark"
          p="4"
          mb="6"
          mt="8"
          value={recoveryPhrase}
          onChangeText={handleChange}
        />
      </View>
      <GradientButton title={strings.confirm} onPress={onSubmitPhrase} />
    </Layout>
  );
};

const styles = StyleSheet.create({
  closeIconContainer: {
    alignSelf: 'flex-end',
    marginTop: 24
  }
});

export default ImportAccount;
