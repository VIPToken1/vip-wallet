import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Box, Image, Pressable, Text, useToast, View } from 'native-base';
import { useClipboard } from '@react-native-clipboard/clipboard';
import { QRCode } from 'components';
import { useAppSelector } from 'hooks';
import { Icons } from 'theme';
import { Colors } from 'theme/colors';

const Tickets = () => {
  const { activeWallet } = useAppSelector(state => state.crypto);

  const toast = useToast();
  const [, setClipboard] = useClipboard();

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
      <Box
        bg={Colors.BG_LIGHT}
        w="90%"
        alignSelf={'center'}
        alignItems={'center'}
        py={30}
        px={30}
        // mt={120}
        rounded={20}
      >
        {/* <Image source={Icons.dummyQrIcon} alt="dummyQrIcon" /> */}
        <QRCode data={activeWallet?.address} size={200} />
        <Text color={Colors.PLACEHOLDER} textAlign={'center'} mt="37px">
          {activeWallet?.address}
        </Text>
        <Pressable mt="18px" alignSelf={'flex-end'} onPress={onCopyAddress}>
          <Image source={Icons.copyIcon} alt="copyIcon" />
        </Pressable>
      </Box>
    </View>
  );
};

export default Tickets;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: '20%'
  }
});
