import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { Image, Text, View } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { BarCodeReadEvent } from 'react-native-camera';
import { CloseIcon, ThemeButton } from 'components';
import { useTranslations } from 'hooks';
import { Icons, screenHeight, screenWidth } from 'theme';
import { Colors } from 'theme/colors';
import { formatCopiedAddress } from 'screens/sendToken';

type QRScannerScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'QRScanner'
>;

type Props = {
  onSuccess: (data: BarCodeReadEvent) => void;
};

const QRScanner: FC<Props> = () => {
  const navigation = useNavigation<QRScannerScreenNavigationProp>();
  const route = useRoute<any>();
  const { strings } = useTranslations();

  const nextRoute = route.params?.from === 'Send' ? 'SendToken' : 'Send';

  const onScanSuccess = (scannedValue: string) => {
    console.log('route.params ', route.params);
    navigation.navigate(nextRoute, {
      ...(route.params?.from === 'Send' ? route.params : {}),
      scannedAddress: formatCopiedAddress(scannedValue),
      from: undefined
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.closeIconContainer}>
        <CloseIcon />
      </View>
      <QRCodeScanner
        reactivate
        reactivateTimeout={10000}
        cameraStyle={styles.camera}
        onRead={data => {
          console.log('scanned data:', data);
          onScanSuccess(data.data);
        }}
        cameraProps={{
          captureAudio: false,
          ratio: '1:1',
          playSoundOnCapture: true
        }}
      />
      {/* </ImageBackground> */}
      <Image source={Icons.qrScannerSqIcon} style={styles.qrBg} alt="qrFrame" />
      <ThemeButton
        title=""
        style={styles.btn}
        onPress={() => navigation.navigate('ShowQR')}
      >
        <Text
          fontSize={20}
          fontWeight="semibold"
          color={Colors.PLACEHOLDER}
          textAlign="center"
        >
          {strings.scan_qr_code}
        </Text>
      </ThemeButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 20,
    paddingTop: 0
  },
  closeIconContainer: {
    position: 'absolute',
    top: '3%',
    left: '5%',
    zIndex: 9
  },
  qrBg: {
    // width: '100%',
    // height: '100%',
    // marginTop: '42%',
    width: screenWidth - 60,
    height: screenWidth - 60,
    position: 'absolute',
    top: '22%'
  },
  camera: {
    width: screenWidth,
    height: screenHeight,
    // width: screenWidth * 0.75,
    // height: screenWidth * 0.75,
    alignSelf: 'center'
  },
  btn: {
    bottom: '15%',
    backgroundColor: 'transparent'
  }
});

export default QRScanner;
