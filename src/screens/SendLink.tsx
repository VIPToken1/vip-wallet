import React from 'react';
import { StyleSheet } from 'react-native';
import { Box, HStack, Text, useToast } from 'native-base';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Share, { ShareOptions } from 'react-native-share';
import RNFS from 'react-native-fs';
import { Layout, RoundIcon } from 'components';
import { useAppSelector, useLoader, useTranslations } from 'hooks';
import { Icons, pixH } from 'theme';
import { Colors } from 'theme/colors';
import { useClipboard } from '@react-native-clipboard/clipboard';
import { getQrCodeUrl } from 'components/QRCode';

type RequestScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SendLink'
>;

type RequestScreenRouteProp = RouteProp<RootStackParamList, 'SendLink'>;

const SendLink = () => {
  const { strings } = useTranslations();
  const navigation = useNavigation<RequestScreenNavigationProp>();
  const { params } = useRoute<RequestScreenRouteProp>();
  const { activeWallet } = useAppSelector(state => state.crypto);
  const { amount, token } = params || {};
  const { setLoader } = useLoader();
  const toast = useToast();
  const [, setClipboard] = useClipboard();

  React.useEffect(() => {
    let headerTitle = strings.receive;
    if (token.symbol.toUpperCase() === 'BNB') {
      headerTitle = 'Receive BNB';
    } else if (token.symbol.toUpperCase() === 'WBNB') {
      headerTitle = 'Receive WBNB';
    } else if (token.symbol.toUpperCase() === 'VIP') {
      headerTitle = 'Receive VIP Token';
    }
    navigation.setOptions({ headerTitle });
  }, [navigation, token, strings]);

  const onCopyAddress = () => {
    setClipboard(activeWallet.address);
    if (!toast.isActive('copied')) {
      toast.show({
        id: 'copied',
        title: 'Copied to clipboard',
        status: 'success',
        variant: 'subtle',
        duration: 2000
      });
    }
  };

  const onShare = async () => {
    try {
      const qrImage = getQrCodeUrl(activeWallet.address);
      const imagePath = `${RNFS.DocumentDirectoryPath}/qr.png`;
      await RNFS.downloadFile({
        fromUrl: qrImage,
        toFile: imagePath
      }).promise;

      const imageData = await RNFS.readFile(imagePath, 'base64');

      await Promise.resolve(setTimeout(() => {}, 1000));
      const shareOptions: ShareOptions = {
        message: `My Public Address to Receive ${token.symbol?.toUpperCase()} is ${
          activeWallet.address
        }.`
      };
      if (amount) {
        shareOptions.message = `My Public Address to Receive ${token.symbol?.toUpperCase()} is ${
          activeWallet.address
        }. I would like to receive ${amount} ${token.symbol?.toUpperCase()}`;
      }
      if (imageData) {
        shareOptions.url = `data:image/png;base64,${imageData}`;
      }

      const result = await Share.open(shareOptions);
      console.log('is dismissed ', result.dismissedAction);
    } catch (error) {
      console.log(error.message);
    }
  };

  const onShowQr = () => {
    navigation.navigate('ShowQR', { token, amount });
  };

  const isVIP = token.symbol.toUpperCase() === 'VIP';

  return (
    <Layout justifyContent="flex-start">
      <Box
        mt={pixH(98)}
        alignSelf="center"
        justifyContent="center"
        alignItems="center"
      >
        <Text fontSize="30px" color={Colors.PRIMARY} textAlign="center" mb="6">
          {strings.send_link}
        </Text>
        <Text
          mt="10px"
          fontSize="md"
          color={Colors.PLACEHOLDER}
          textAlign="center"
          mb="6"
        >
          {isVIP ? strings.receive_vip_desc : strings.receive_bnb_desc}
        </Text>
      </Box>
      <HStack justifyContent="space-around" w="full" my="8" px="4">
        <RoundIcon source={Icons.uploadIcon} onPress={onShare} />
        <RoundIcon source={Icons.copyIcon} onPress={onCopyAddress} />
        <RoundIcon source={Icons.qrIcon} onPress={onShowQr} />
      </HStack>
    </Layout>
  );
};

const styles = StyleSheet.create({
  title: {
    marginTop: 15,
    marginBottom: 30
  }
});

export default SendLink;
