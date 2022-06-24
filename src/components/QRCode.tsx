import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import FastImage, { Source } from 'react-native-fast-image';
import Colors from 'theme/colors';

type QRCodeProps = {
  data: string;
  size: number;
};

export const QR_GENERATOR_API =
  'https://api.qrserver.com/v1/create-qr-code/?size=150x150&margin=10';

export const getQrCodeUrl = (data: string): string =>
  `${QR_GENERATOR_API}&data=${data}`;

const QRCode: React.FC<QRCodeProps> = ({ data, size }) => {
  const [qrImage, setQrImage] = React.useState<Source>({
    uri: ''
  });
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (data) {
      const qrCode = getQrCodeUrl(data);
      setQrImage({ uri: qrCode });
    }
  }, [data]);

  const dimensions = React.useMemo(() => {
    return size ? { width: size, height: size } : {};
  }, [size]);

  if (!data) {
    return null;
  }

  return (
    <View style={dimensions}>
      {/* {isLoading && (
        <View style={[dimensions, styles.spinnerContainer]}>
          <ActivityIndicator color={Colors.PRIMARY} size="small" animating />
        </View>
      )} */}
      {!!qrImage.uri && (
        <FastImage
          source={qrImage}
          style={[dimensions]}
          fallback
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  spinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default QRCode;
