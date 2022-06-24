import React, { FC, useEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { Box, Button, HStack, Stack, Text, useToast } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GradientButton, Layout } from 'components';
import { useAppDispatch, useAppSelector, useTranslations } from 'hooks';
import { Colors } from 'theme/colors';
import { validatePhrase } from 'utils';
import { actions } from 'store';
import { BackupType } from 'types';

type ManualBackupScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ManualBackupFields'
>;

type ManualBackupProps = {
  is24Words?: boolean;
};

const shuffle = (array: string[]) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex]
    ];
  }

  return array;
};

const getArrayPhrase = (phrase: string) =>
  shuffle(phrase.split(' ')).map(word => ({ word, isPicked: false }));

const ManualBackup: FC<ManualBackupProps> = ({ is24Words }) => {
  const phraseLength = 12;
  const { strings } = useTranslations();
  const { phrase } = useAppSelector(state => state.crypto);
  const [recoveryPhrase, setRecoveryPhrase] = useState(getArrayPhrase(phrase));
  const [answeredPhrase, setAnsweredPhrase] = useState<Array<string>>(
    Array(phraseLength).fill('')
  );
  const [isFinished, setFinished] = useState(false);

  const toast = useToast();
  const dispatch = useAppDispatch();

  const scrollViewRef = useRef<ScrollView>();

  const navigation = useNavigation<ManualBackupScreenNavigationProp>();

  useEffect(() => {
    if (answeredPhrase.filter(item => item).length === phraseLength) {
      // @ts-ignore
      scrollViewRef.current?.scrollToEnd();
      setFinished(true);
    } else {
      setFinished(false);
    }
  }, [answeredPhrase, navigation]);

  const onSubmit = () => {
    const answer = answeredPhrase.join(' ');
    if (answer === phrase && validatePhrase(answer)) {
      dispatch(
        actions.setWalletBackup({
          isBackup: true,
          backupAt: Date.now(),
          backupType: BackupType.MANUAL
        })
      );
      dispatch(actions.login());
      navigation.navigate('Home');
    } else {
      // setErrorMessage(strings.invalid_phrase);
      toast.show({
        id: 'error',
        title: strings.invalid_phrase,
        status: 'error',
        variant: 'subtle'
      });
    }
  };

  const onTapWord = (
    { word, isPicked }: { word: string; isPicked: boolean },
    index: number
  ) => {
    setRecoveryPhrase(prev => {
      return prev.map((item, i) => {
        if (i === index) {
          return { ...item, isPicked: !item.isPicked };
        }
        return item;
      });
    });
    setAnsweredPhrase((prev): string[] => {
      if (isPicked) {
        const updated = [...prev];
        const wordIndex = updated.indexOf(word);
        updated.splice(wordIndex, 1);
        updated.length = is24Words ? 24 : 12;
        const lastIndex = updated.length - 1;
        updated[lastIndex] = '';
        return updated;
      } else {
        const updatedAnswer = [...prev];
        const emptyIndex = updatedAnswer.filter(item => item).length;
        updatedAnswer[emptyIndex] = word;
        return updatedAnswer;
      }
    });
  };

  return (
    <Layout scrollEnabled={true}>
      <ScrollView alwaysBounceVertical={false} ref={scrollViewRef}>
        <Text
          fontSize="md"
          color={Colors.PLACEHOLDER}
          fontWeight="normal"
          py="2"
          textAlign={'center'}
        >
          {strings.manual_backup_description}
        </Text>
        <Stack my="7">
          <Box
            alignItems="center"
            borderRadius={20}
            borderColor="#212121"
            borderWidth={2}
            flex={1}
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="space-evenly"
            px="4"
            mb="4"
          >
            {answeredPhrase.map((word, index) => (
              <HStack
                key={index}
                width="28%"
                alignSelf={'center'}
                alignItems="center"
                my="1"
              >
                {!!word && (
                  <Text
                    textAlign={'center'}
                    w="28px"
                    px={'2px'}
                    color={Colors.GRAY}
                    adjustsFontSizeToFit
                  >
                    {index + 1}.{' '}
                  </Text>
                )}
                <Text fontSize="md" fontWeight="medium" adjustsFontSizeToFit>
                  {word}
                </Text>
              </HStack>
            ))}
          </Box>
          <Box
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="space-evenly"
            mt="4"
          >
            {recoveryPhrase.map((item, index) => (
              <Button
                key={index}
                size="md"
                minWidth="30%"
                bgColor={item.isPicked ? Colors.BG_LIGHT : Colors.TRANSPARENT}
                borderRadius={20}
                borderColor="#212121"
                borderWidth={1}
                opacity={item.isPicked ? 0.5 : 1}
                my="1"
                p="2"
                _text={{
                  fontSize: 'md',
                  fontWeight: 'medium',
                  textAlign: 'center'
                }}
                onPress={() => onTapWord(item, index)}
              >
                {item.word}
              </Button>
            ))}
          </Box>
        </Stack>
      </ScrollView>
      <>
        {!!isFinished && (
          <GradientButton
            title={strings.done}
            disabled={!isFinished}
            onPress={onSubmit}
          />
        )}
      </>
    </Layout>
  );
};

ManualBackup.defaultProps = {
  is24Words: false
};

export default ManualBackup;
