import React, { FC, useMemo } from 'react';
import { useTranslations } from 'hooks';
import { Box, HStack, Image, Text, View, Modal, VStack } from 'native-base';
import {
  Alert,
  FlatList,
  Linking,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import SearchInput from './SearchInput';
import { Icons, pixH, pixW, pt, screenWidth } from 'theme';
import { Colors } from 'theme/colors';

type Props = {
  visible: boolean;
  onModalClose: () => void;
};

const List = [
  {
    name: 'BNB',
    image: Icons.bnbIcon
  },
  {
    name: 'VIP',
    image: Icons.vipIcon
  }
];

const PurchaseButton = () => {
  return (
    <TouchableOpacity activeOpacity={0.5} style={styles.purchaseBtn}>
      <Text fontWeight="bold" fontSize={pt(28)}>
        PURCHASE
      </Text>
    </TouchableOpacity>
  );
};

const PurchaseModal: FC<Props> = ({ visible, onModalClose }) => {
  return (
    <Modal
      isKeyboardDismissable={false}
      avoidKeyboard={true}
      style={styles.modalStyle}
      isOpen={visible}
      closeOnOverlayClick={true}
      onClose={onModalClose}
    >
      <View style={styles.innerContainer}>
        <HStack px="30px" w="100%">
          <Image mt="5px" source={Icons.cardIcon} alt="icon" />
          <VStack mx="24px" w="90%">
            <Text fontSize="18px">Purchase Method 1</Text>
            <Text mt="9px" color={Colors.PLACEHOLDER} fontSize="12px">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              euismod .
            </Text>
          </VStack>
        </HStack>
        <PurchaseButton />
        <HStack px="30px" w="100%">
          <Image mt="5px" source={Icons.cardIcon} alt="icon" />
          <VStack mx="24px" w="90%">
            <Text fontSize="18px">Purchase Method 1</Text>
            <Text mt="9px" color={Colors.PLACEHOLDER} fontSize="12px">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              euismod .
            </Text>
          </VStack>
        </HStack>
        <PurchaseButton />
      </View>
    </Modal>
  );
};

const PurchaseToken = () => {
  const [search, setSearch] = React.useState('');
  const { strings } = useTranslations();
  const [isVisible, toggleModal] = React.useState(false);

  return (
    <View>
      {/* <Box mx={'25px'}>
        <SearchInput
          placeholder={strings.search_token}
          value={search}
          onChangeText={setSearch}
          onClearSearch={() => setSearch('')}
        />
      </Box> */}
      <FlatList
        data={List}
        keyExtractor={(_, index) => index.toString()}
        ItemSeparatorComponent={() => (
          <View mx="4" backgroundColor={'#0F1225'} h="1px" />
        )}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={styles.coinRow}
              // onPress={() => toggleModal(!isVisible)}
              // onPress={() => alert('Coming Soon')}
              onPress={() =>
                Alert.alert(
                  'Alert', // `Buy ${item.name}`,
                  `You can buy ${item.name} from PancakeSwap`,
                  [
                    {
                      text: 'Cancel'
                    },
                    {
                      text: 'OK',
                      onPress: () => Linking.openURL('https://buy.viptoken.io')
                    }
                  ]
                )
              }
            >
              <HStack alignItems={'center'}>
                <Image w="50px" h="50px" source={item.image} alt="coin_img" />
                <Text fontSize={'20px'} ml="4">
                  {item.name}
                </Text>
              </HStack>
              <Image
                mx="4"
                source={Icons.rightChevronIcon}
                alt="rightChevron"
              />
            </TouchableOpacity>
          );
        }}
      />
      <PurchaseModal
        visible={isVisible}
        onModalClose={() => toggleModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: '100%',
    justifyContent: 'center'
  },
  innerContainer: {
    backgroundColor: Colors.BG_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth - 40,
    borderRadius: 20,
    paddingVertical: 30
  },
  purchaseBtn: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 10,
    paddingHorizontal: pixW(15),
    paddingVertical: pixH(20),
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    alignSelf: 'center',
    marginVertical: 25
  },
  coinRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row'
  }
});

export default PurchaseToken;
