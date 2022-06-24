import React, { FC } from 'react';
import { ImageBackground, ImageSourcePropType, StyleSheet } from 'react-native';
import { Box, HStack, Image, Text } from 'native-base';
import { Icons } from 'theme';

type ReceiveQRProps = {
  qrImage?: ImageSourcePropType;
  address?: string;
};

const ReceiveQR: FC<ReceiveQRProps> = ({ qrImage, address }) => (
  <>
    <ImageBackground
      source={require('../assets/images/scanner/qr_border.png')}
      style={styles.qrContainer}
    >
      <Image source={qrImage} alt="qrCode" />
    </ImageBackground>
    <Box
      flexDirection="row"
      rounded={50}
      bgColor="#1D1D1D"
      p="4"
      w="full"
      alignSelf="center"
      alignItems="center"
    >
      <Text
        color="#777777"
        w="75%"
        fontSize="lg"
        ellipsizeMode="middle"
        numberOfLines={1}
      >
        {address}
      </Text>
      <HStack>
        <Image
          source={Icons.uploadIcon}
          style={styles.icons}
          alt="uploadIcon"
        />
        <Image source={Icons.copyIcon} style={styles.icons} alt="copyIcon" />
      </HStack>
    </Box>
  </>
);

const styles = StyleSheet.create({
  qrContainer: {
    marginVertical: 40,
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  icons: {
    marginHorizontal: 10
  }
});

ReceiveQR.defaultProps = {
  qrImage: require('../assets/images/scanner/qr.png'),
  address: 'Oxd5f6d655f6d655f6d655fehgj4585fehgj4585fehgj458'
};

export default ReceiveQR;
