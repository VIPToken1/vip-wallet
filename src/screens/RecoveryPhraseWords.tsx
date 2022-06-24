import React, { FC, useEffect, useMemo } from 'react';
import { Text, View, VStack } from 'native-base';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Layout, GradientButton, Phrase } from 'components';
import {
  useAppDispatch,
  useAppSelector,
  useLoader,
  useTranslations
} from 'hooks';
import { generateRecoveryPhrase } from 'store/actions';
import { Colors } from 'theme/colors';

type RecoveryPhraseWordsScreenRouteProp = RouteProp<
  RootStackParamList,
  'RecoveryPhraseWords' | 'ShowRecoveryPhrase'
>;

type RecoveryPhraseWordsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'RecoveryPhraseWords'
>;

const RecoveryPhraseWords: FC = () => {
  const { strings } = useTranslations();
  const navigation = useNavigation<RecoveryPhraseWordsScreenNavigationProp>();
  const { name } = useRoute<RecoveryPhraseWordsScreenRouteProp>();
  const { setLoader } = useLoader();

  const isShowing = name === 'ShowRecoveryPhrase';

  const dispatch = useAppDispatch();
  const { phrase, activeWallet } = useAppSelector(state => state.crypto);

  useEffect(() => {
    setLoader(true);
    setTimeout(() => dispatch(generateRecoveryPhrase(16)), 1e3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const isReady = useMemo(() => !!phrase, [phrase]);
  // const isReady = useMemo(
  //   () => !!phrase && !!activeWallet?.address,
  //   [phrase, activeWallet]
  // );

  useEffect(() => {
    if (isReady) {
      setTimeout(() => setLoader(false), 2e3);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  return (
    <Layout pb="20px">
      <View flex={1}>
        <Text
          fontSize="md"
          my="4"
          mx="4px"
          textAlign="center"
          color={Colors.PLACEHOLDER}
        >
          {strings.do_not_share}
        </Text>
        <Phrase phrase={phrase} showFooter />
      </View>
      <>
        {!isShowing && (
          <VStack alignSelf="center">
            <Text mt="4" color={Colors.PLACEHOLDER}>
              {strings.recovery_phrase_description}
            </Text>
            <GradientButton
              title={strings.continue}
              onPress={() => navigation.navigate('ManualBackupFields')}
            />
          </VStack>
        )}
      </>
    </Layout>
  );
};

export default RecoveryPhraseWords;
