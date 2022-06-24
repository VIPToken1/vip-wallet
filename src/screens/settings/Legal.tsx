import React, { FC, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { HStack, Image, Text, View, Stack } from 'native-base';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import { CustomCheckbox, GradientButton, Layout } from 'components';
import { useTranslations } from 'hooks';
import { Icons } from 'theme';
import { Colors } from 'theme/colors';

type LegalScreenNavigationProp = NavigationProp<RootStackParamList, 'Legal'>;

type LegalScreenRouteProp = RouteProp<RootStackParamList, 'Legal'>;

type LegalRowProps = {
  label: string;
  onPress?: () => void;
};

const styles = StyleSheet.create({
  legalRowCont: {
    backgroundColor: Colors.BG_LIGHT,
    paddingHorizontal: 30,
    marginBottom: 10
  }
});

const LegalRow: FC<LegalRowProps> = ({ label, onPress }) => {
  return (
    <TouchableOpacity style={styles.legalRowCont} onPress={onPress}>
      <HStack
        alignItems="center"
        justifyContent="space-between"
        w="full"
        my="5"
      >
        <Text fontSize={20}>{label}</Text>
        <Image source={Icons.rightChevronIcon} alt="rightChevron" />
      </HStack>
    </TouchableOpacity>
  );
};

const Legal = () => {
  const navigation = useNavigation<LegalScreenNavigationProp>();
  const { params } = useRoute<LegalScreenRouteProp>();
  const { strings } = useTranslations();
  const [isAccepted, setIsAccepted] = useState(false);

  return (
    <>
      <Layout flex={1} style={{ paddingHorizontal: 0 }}>
        <View w="full">
          <Text px="30px" mb="39px" color={Colors.PLACEHOLDER} fontSize="md" />
          <LegalRow
            label={strings.privacy_policy}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          />
          <LegalRow
            label={strings.terms_of_service}
            onPress={() => navigation.navigate('TermsOfService')}
          />
        </View>
      </Layout>
      <Stack py="10">
        <CustomCheckbox
          position="left"
          style={{ paddingHorizontal: 30 }}
          isChecked={isAccepted}
          onChange={isSelected => setIsAccepted(isSelected)}
        >
          <Text color={Colors.PLACEHOLDER} fontSize="md" p="4">
            {strings.accept_terms}
          </Text>
        </CustomCheckbox>
        <GradientButton
          title={strings.accept}
          disabled={!isAccepted}
          // onPress={() => isAccepted && navigation.navigate('Username')}
          onPress={() =>
            isAccepted &&
            navigation.navigate(
              params?.from === 'SignIn' ? 'RestoreWallet' : 'CreatePin',
              { alreadyAccount: false }
            )
          }
        />
      </Stack>
    </>
  );
};

export default Legal;
