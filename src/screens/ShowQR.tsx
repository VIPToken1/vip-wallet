import React from 'react';
import { StyleSheet } from 'react-native';
import { Box, Image, Pressable, Text, useToast, View } from 'native-base';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useClipboard } from '@react-native-clipboard/clipboard';
import { QRCode } from 'components';
import { useAppSelector, useTranslations } from 'hooks';
import { Icons } from 'theme';
import { Colors } from 'theme/colors';

type ShowQRScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ShowQR'
>;

type ShowQRScreenRouteProp = RouteProp<RootStackParamList, 'ShowQR'>;

const ShowQR = () => {
  const navigation = useNavigation<ShowQRScreenNavigationProp>();
  const { params } = useRoute<ShowQRScreenRouteProp>();
  const { activeWallet } = useAppSelector(state => state.crypto);

  const { token } = params ?? {};
  const { strings } = useTranslations();

  const toast = useToast();
  const [, setClipboard] = useClipboard();

  React.useEffect(() => {
    let headerTitle = strings.receive;
    if (token) {
      if (token.symbol.toUpperCase() === 'BNB') {
        headerTitle = 'Receive BNB';
      } else if (token.symbol.toUpperCase() === 'WBNB') {
        headerTitle = 'Receive WBNB';
      } else if (token.symbol.toUpperCase() === 'VIP') {
        headerTitle = 'Receive VIP Token';
      }
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

  return (
    <View style={styles.container}>
      <Box w="full" alignItems="center" mt="25%" flex={1}>
        <View
          bg={Colors.BG_LIGHT}
          w="90%"
          alignSelf="center"
          alignItems="center"
          py={30}
          px={30}
          rounded={20}
        >
          {/* <Image source={Icons.dummyQrIcon} alt="dummyQrIcon" /> */}
          <QRCode data={activeWallet?.address} size={200} />
          <Text
            color={Colors.PLACEHOLDER}
            textAlign={'center'}
            mt="37px"
            numberOfLines={2}
            ellipsizeMode="middle"
            w="64"
          >
            {activeWallet?.address}
          </Text>
          <Pressable mt="18px" alignSelf="flex-end" onPress={onCopyAddress}>
            <Image source={Icons.copyIcon} alt="copyIcon" />
          </Pressable>
        </View>
      </Box>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 25
  }
});

export default ShowQR;
