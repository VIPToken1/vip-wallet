import React, { useEffect, useMemo, useState } from 'react';
import { Stack, Text } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomCheckbox, Layout, GradientButton } from 'components';
import {
  useAppDispatch,
  useAppSelector,
  useLoader,
  useTranslations
} from 'hooks';
import { actions } from 'store';
import { screenWidth } from 'theme';
import Colors from 'theme/colors';
import RenderHTML from 'react-native-render-html';

type PrivacyPolicyScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PrivacyPolicy'
>;

const PrivacyPolicy = () => {
  const { name } = useRoute();
  const { setLoader } = useLoader();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);
  const { terms_policy, privacy_policy } = user.legal || {};

  const { strings } = useTranslations();

  const fetchTerms = async () => {
    try {
      if (name === 'PrivacyPolicy') {
        setLoader(!privacy_policy);
        await dispatch(actions.getPrivacyPolicy());
      } else {
        setLoader(!terms_policy);
        await dispatch(actions.getTerms());
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log('errorss', error);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  return (
    <>
      <Layout flex={0} justifyContent="center" px="30px">
        <Stack mb="2.5" mt="1.5" direction="column" space={3}>
          <RenderHTML
            contentWidth={screenWidth - 60}
            source={{
              html: name === 'PrivacyPolicy' ? privacy_policy : terms_policy
            }}
            baseStyle={{ color: Colors.WHITE }}
          />
          {/* <Text py="4">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply
            dummy text of the printing and typesetting industry. Lorem Ipsum has
            been the industry's standard dummy text ever since the 1500s, when
            an unknown printer took a galley of type and scrambled it to make a
            type specimen book. It has survived not only five centuries, but
            also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum.
          </Text>
          <Text py="2">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply
            dummy text of the printing and typesetting industry. Lorem Ipsum has
            been the industry's standard dummy text ever since the 1500s, when
            an unknown printer took a galley of type and scrambled it to make a
            type specimen book. It has survived not only five centuries, but
            also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum.
          </Text> */}
        </Stack>
      </Layout>
    </>
  );
};

export default PrivacyPolicy;
