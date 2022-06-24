import React, { FC, useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { Image, Stack, Text, useToast } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import type { Biometrics } from 'react-native-fingerprint-scanner';
import { ThemeButton } from 'components';
import { useTranslations } from 'hooks';
import { Icons, screenWidth } from 'theme';
import Layout from './Layout';

type BiometricsProps = {
  biometryType: Biometrics;
  showAuthenticationDialog: (type: Biometrics) => Promise<void>;
};

type Props = {
  onAuthenticationSuccess: () => void;
};

const IosBiometrics: FC<BiometricsProps> = ({
  biometryType,
  showAuthenticationDialog
}) => {
  const { strings } = useTranslations();
  return (
    <>
      <Text fontSize="2xl" fontWeight="semibold">
        {biometryType}
      </Text>
      <Stack w="full" alignItems="center" py="4" pt="30%">
        <TouchableOpacity
          onPress={() => showAuthenticationDialog(biometryType)}
        >
          <Image
            source={Icons.faceIdIcon}
            alt="face-id"
            alignSelf="center"
            my="6"
          />
        </TouchableOpacity>
        <Text fontSize="2xl" fontWeight="semibold" py="2">
          {strings.increase_your_security}
        </Text>
        <Text fontSize="md" fontWeight="medium" textAlign="center">
          {strings.face_id_description}
        </Text>
      </Stack>
    </>
  );
};

const AndroidBiometrics: FC<BiometricsProps> = ({
  biometryType,
  showAuthenticationDialog
}) => {
  const { strings } = useTranslations();
  const navigation = useNavigation();
  return (
    <>
      <Stack
        w={screenWidth}
        alignItems="center"
        py="50%"
        flex="1"
        alignSelf="center"
      >
        <TouchableOpacity
          onPress={() => showAuthenticationDialog(biometryType)}
        >
          <Image
            source={Icons.fingerPrintIcon}
            alt="face-id"
            alignSelf="center"
            my="6"
          />
        </TouchableOpacity>
        <Text fontSize="md" fontWeight="medium" textAlign="center" py="6">
          {strings.finger_print_description}
        </Text>
        <ThemeButton
          title=""
          style={styles.btn}
          onPress={() => navigation.goBack()}
        >
          <Text fontSize={18} fontWeight="semibold" textAlign="center">
            {strings.cancel}
          </Text>
        </ThemeButton>
      </Stack>
    </>
  );
};

const BiometricScanner: FC<Props> = ({ onAuthenticationSuccess }) => {
  const [biometryType, setBioMetryType] = useState<Biometrics>('Biometrics');
  const toast = useToast();

  const showAuthenticationDialog = useCallback(async type => {
    if (type !== null && type !== undefined) {
      const message =
        type === 'Face ID'
          ? 'Scan your Face on the device to continue'
          : 'Scan your Fingerprint on the device scanner to continue';
      try {
        await FingerprintScanner.authenticate({
          description: message,
          fallbackEnabled: true
        });
        console.log('Matched');
        onAuthenticationSuccess();
      } catch (error) {
        console.log('Authentication error is => ', error);
        if (!toast.isActive('error')) {
          toast.show({
            id: 'error',
            title: 'Authentication Error',
            status: 'error',
            variant: 'subtle'
          });
        }
      }
    } else {
      console.log('biometric authentication is not available');
    }
  }, []);

  useEffect(() => {
    const getBiometrics = async () => {
      try {
        const type = await FingerprintScanner.isSensorAvailable();
        setBioMetryType(type);
      } catch (error) {
        console.log('isSensorAvailable error => ', error);
      }
    };
    getBiometrics();
  }, []);

  return (
    <Layout justifyContent="flex-start" pt="10px">
      {Platform.OS === 'ios' ? (
        <IosBiometrics
          biometryType={biometryType}
          showAuthenticationDialog={showAuthenticationDialog}
        />
      ) : (
        <AndroidBiometrics
          biometryType={biometryType}
          showAuthenticationDialog={showAuthenticationDialog}
        />
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  biometryText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 30
  },
  textStyle: {
    color: '#FFFFFF'
  },
  btn: {
    backgroundColor: '#1D1D1D'
  }
});

export default BiometricScanner;
