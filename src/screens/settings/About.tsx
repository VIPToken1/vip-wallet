import React from 'react';
import { TouchableOpacity } from 'react-native';
import { HStack, Image, Text, View } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getVersion } from 'react-native-device-info';
import { Layout } from 'components';
import { useTranslations } from 'hooks';
import { Icons } from 'theme';

type AboutScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'About'
>;

type AboutRowProps = {
  label: string;
  onPress?: () => void;
};

const About = () => {
  const navigation = useNavigation<AboutScreenNavigationProp>();
  const { strings } = useTranslations();
  return (
    <>
      <Layout flex={1} px="20px">
        <View w="full">
          <TouchableOpacity
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            <HStack
              justifyContent={'space-between'}
              alignItems={'center'}
              py="4"
              my="1"
            >
              <Text fontSize={'20px'}>{strings.privacy_policy}</Text>
              <Image
                source={Icons.rightChevronIcon}
                resizeMode="contain"
                alt="rightChevron"
                size="10px"
              />
            </HStack>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('TermsOfService')}
          >
            <HStack
              justifyContent={'space-between'}
              alignItems={'center'}
              py="4"
              my="1"
            >
              <Text fontSize={'20px'}>{strings.terms_of_service}</Text>
              <Image
                source={Icons.rightChevronIcon}
                resizeMode="contain"
                alt="rightChevron"
                size="10px"
              />
            </HStack>
          </TouchableOpacity>
          <TouchableOpacity disabled>
            <HStack
              justifyContent={'space-between'}
              alignItems={'center'}
              py="4"
              my="1"
            >
              <Text fontSize={'20px'}>{strings.version}</Text>
              <Text fontSize={'16px'} pr="0.5">
                {getVersion() || '1.0'}
              </Text>
            </HStack>
          </TouchableOpacity>
        </View>
      </Layout>
    </>
  );
};

export default About;
