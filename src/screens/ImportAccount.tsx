import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Image, Modal, Text, TextArea, useToast, View } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import bip39 from 'react-native-bip39';
import { Layout, GradientButton } from 'components';
import { useAppDispatch, useLoader, useTranslations } from 'hooks';
import { screenWidth } from 'theme/dimensions';
import { Icons } from 'theme';
import { Colors } from 'theme/colors';
import { validatePhrase } from 'utils';
import { actions } from 'store';
import { BackupType } from 'types';

type ImportAccountScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ImportAccount'
>;

const getSuggestions = (value: string) => {
  if (!value) {
    return [];
  }
  const wordlists = bip39.wordlists.EN as string[];
  return wordlists
    .filter((w: string) => w.startsWith(value.toLowerCase()))
    .slice(0, 3);
};

const getPhraseWords = (
  phrase: string
): { lastWord: string; index: number; words: string[] } => {
  const phraseWords = phrase.split(' ').map(w => w.trim());
  const lastIndex = phraseWords.length - 1;
  if (lastIndex > -1) {
    return {
      lastWord: phraseWords[lastIndex],
      index: lastIndex,
      words: phraseWords
    };
  }
  return { lastWord: '', index: -1, words: [] };
};

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
  const [suggestions, setSuggestions] = useState<string[]>([]);

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
    const { lastWord } = getPhraseWords(value);
    setSuggestions(lastWord ? getSuggestions(lastWord) : []);
    toast.closeAll();
  };

  const onPressSuggestion = (value: string) => {
    const { words, index } = getPhraseWords(recoveryPhrase);
    if (index > -1) {
      words[index] = value;
      setRecoveryPhrase(words.join(' ') + ' ');
      setSuggestions([]);
    }
  };

  const onSubmitPhrase = () => {
    if (validatePhrase(recoveryPhrase.trim())) {
      dispatch(
        actions.setRecoveryPhrase(recoveryPhrase?.trim()?.toLowerCase())
      );
      dispatch(
        actions.setWalletBackup({
          isBackup: true,
          backupAt: Date.now(),
          backupType: BackupType.MANUAL
        })
      );
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
        <View flexDirection="row" flexWrap="wrap" alignItems="center">
          {suggestions.map((word: string) => (
            <Text
              key={word}
              m="2"
              px="2"
              py="1"
              fontSize="18px"
              borderRadius={10}
              borderWidth={0.5}
              borderColor={Colors.PLACEHOLDER}
              bg={Colors.BG_LIGHT}
              onPress={() => onPressSuggestion(word)}
            >
              {word}
            </Text>
          ))}
        </View>
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
