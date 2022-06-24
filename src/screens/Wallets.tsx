import * as React from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import {
  HStack,
  Text,
  Image,
  Center,
  Stack,
  Input,
  Button,
  Pressable,
  Menu,
  View,
  useToast
} from 'native-base';
import { useClipboard } from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAppDispatch, useAppSelector, useTranslations } from 'hooks';
import { Colors } from 'theme/colors';
import { Icons, pt } from 'theme';
import { actions } from 'store';
type WalletsNavigationProp = StackNavigationProp<RootStackParamList, 'Wallets'>;

type AddWalletModalProps = {
  isVisible: boolean;
  onClose: () => void;
  isEditingIndex?: number;
  wallet?: any;
  walletCount: number;
};

type WalletMenuProps = {
  wallet: any;
  walletIndex: number;
  onCopy: () => void;
  onEditWallet: () => void;
  onDeleteWallet: () => void;
};

const AddWalletModal: React.FC<AddWalletModalProps> = ({
  onClose,
  wallet,
  walletCount = 0
}) => {
  const { strings } = useTranslations();
  const cancelRef = React.useRef(null);
  const [name, setName] = React.useState(`Account ${walletCount + 1}`);
  const [errorMessage, setErrorMessage] = React.useState('');
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.crypto);

  React.useEffect(() => {
    setName(wallet?.name);
  }, [wallet]);

  const onChangeName = (value: string) => {
    setName(value);
    errorMessage && setErrorMessage('');
  };

  const onSubmit = () => {
    if (isEditing) {
      if (name) {
        onClose();
        dispatch(actions.renameWallet(wallet.address, name?.trim()));
      } else {
        setErrorMessage(strings.invalid_wallet_name);
      }
    } else {
      onClose();
      dispatch(actions.generateWallet(undefined, undefined, name?.trim()));
    }
  };

  const isEditing = !!wallet;

  return (
    <Modal visible transparent>
      <View flex={1} justifyContent="center" alignItems="center">
        <View w="3/4" alignSelf="center" bg={Colors.OTHER_BG} borderRadius={10}>
          <Center my="4">
            <Text fontSize={18} fontWeight="bold" color={Colors.WHITE}>
              {isEditing ? strings.rename_wallet : strings.create_account}
            </Text>
          </Center>
          <Stack mb="4" mx="4">
            <Input
              placeholder={`Account ${walletCount + 1}`}
              placeholderTextColor={Colors.GRAY}
              fontSize={16}
              borderWidth={0.5}
              borderColor={Colors.PLACEHOLDER}
              _focus={{ borderColor: Colors.PLACEHOLDER }}
              mx="2"
              color={Colors.WHITE}
              selectionColor={Colors.WHITE}
              value={name}
              onChangeText={onChangeName}
              maxLength={16}
              onSubmitEditing={onSubmit}
            />
            {!!errorMessage && (
              <Text
                px="3"
                py="1"
                textAlign="left"
                fontSize="xs"
                color={Colors.LIGHT_RED}
              >
                {errorMessage}
              </Text>
            )}
          </Stack>
          <Stack w="5/6" mb="2" alignSelf="center">
            <Button.Group justifyContent="space-evenly">
              <Button
                variant="ghost"
                colorScheme="coolGray"
                onPress={onClose}
                ref={cancelRef}
                w="24"
                _text={{
                  fontSize: 'md',
                  fontWeight: 'semibold'
                }}
                _pressed={{ bg: 'transparent', opacity: 0.5 }}
              >
                Cancel
              </Button>
              {/* <Divider orientation="vertical" /> */}
              <Button
                variant="ghost"
                colorScheme="coolGray"
                onPress={onSubmit}
                w="24"
                _text={{
                  color: Colors.PRIMARY,
                  fontSize: 'md',
                  fontWeight: 'semibold'
                }}
                _pressed={{ bg: 'transparent', opacity: 0.5 }}
                isLoading={loading}
              >
                {isEditing ? strings.ok : strings.create}
              </Button>
            </Button.Group>
          </Stack>
        </View>
      </View>
    </Modal>
  );
};

const MenuItem: React.FC<{
  label: string;
  icon: string;
  onPress: () => void;
}> = ({ icon, label, ...rest }) => (
  <Menu.Item
    p="3"
    _pressed={{
      bg: Colors.PRIMARY
    }}
    {...rest}
  >
    <HStack
      alignItems="center"
      borderColor={Colors.WHITE}
      borderY="1px solid white"
    >
      <MaterialIcons name={icon} size={24} color={Colors.WHITE} />
      <Text px="2" fontWeight="500">
        {label}
      </Text>
    </HStack>
  </Menu.Item>
);

const WalletMenu: React.FC<WalletMenuProps> = ({
  onCopy,
  onEditWallet,
  onDeleteWallet
}) => {
  const { strings } = useTranslations();
  return (
    <Menu
      w="170"
      bg="#111736"
      borderWidth={0}
      trigger={triggerProps => {
        return (
          <Pressable
            accessibilityLabel="More options menu"
            hitSlop={{ top: 5, bottom: 5, right: 5, left: 5 }}
            {...triggerProps}
          >
            <MaterialCommunityIcons
              name="dots-vertical"
              size={25}
              color={Colors.GRAY}
            />
          </Pressable>
        );
      }}
    >
      <MenuItem
        onPress={onCopy}
        label={strings.copy_address}
        icon="content-copy"
      />
      <MenuItem
        onPress={onEditWallet}
        label={strings.rename_wallet}
        icon="edit"
      />
      <MenuItem
        onPress={onDeleteWallet}
        label={strings.delete_wallet}
        icon="delete"
      />
    </Menu>
  );
};

const Wallets = () => {
  const navigation = useNavigation<WalletsNavigationProp>();
  const [isAddingWallet, setIsAddingWallet] = React.useState(false);
  const [isEditingIndex, setIsEditingIndex] = React.useState(-1);

  const { strings } = useTranslations();

  const [, setClipboard] = useClipboard();
  const toast = useToast();

  const dispatch = useAppDispatch();
  const { walletList, activeWallet } = useAppSelector(state => state.crypto);

  const activeWalletAddress = activeWallet?.address || walletList[0]?.address;

  const onWalletChange = (index: number, isActive?: boolean) => {
    if (!isActive) {
      dispatch(actions.setDefaultWallet(index));
    }
  };

  const onCopy = (address: string) => {
    setClipboard(address);
    if (!toast.isActive('copy-to-clipboard')) {
      toast.show({
        id: 'copy-to-clipboard',
        title: strings.copy_to_clipboard_success,
        duration: 2e3,
        status: 'success'
      });
    }
  };

  const onEditWallet = (index: number) => {
    setIsEditingIndex(index);
  };

  const onDeleteWallet = (address: string, index: number) => {
    if (index === 0) {
      if (!toast.isActive('delete-wallet')) {
        toast.show({
          id: 'delete-wallet',
          title: strings.cannot_delete_default_wallet,
          status: 'error'
        });
      }
    } else {
      dispatch(actions.deleteWallet(address));
    }
  };

  const onClose = () => {
    setIsEditingIndex(-1);
    setIsAddingWallet(false);
  };

  return (
    <View>
      <HStack justifyContent={'flex-end'} px="20px">
        <Pressable
          borderRadius="30px"
          backgroundColor={Colors.PRIMARY}
          onPress={() => setIsAddingWallet(true)}
        >
          <Text fontSize={'16px'} py="11px" px="19px">
            + Create Account
          </Text>
        </Pressable>
      </HStack>
      {(isAddingWallet || isEditingIndex > -1) && (
        <AddWalletModal
          isVisible
          onClose={onClose}
          wallet={walletList[isEditingIndex]}
          isEditingIndex={isEditingIndex}
          walletCount={walletList.length}
        />
      )}
      <FlatList
        data={walletList}
        style={{ marginTop: pt(30) }}
        renderItem={({ item, index }) => {
          const isActive = activeWalletAddress === item?.address;
          return (
            <TouchableOpacity
              onPress={() => onWalletChange(index, isActive)}
              style={styles.touchable}
            >
              <HStack alignItems="center">
                <Text fontSize={pt(32)}>{item.name}</Text>
                {/* {index === 0 && (
                  <Text
                    fontSize={pt(20)}
                    textAlign="center"
                    px="2"
                    mx="2"
                    color={Colors.MODAL_BG}
                    borderRadius={10}
                    borderWidth="1"
                    borderColor={Colors.MODAL_BG}
                  >
                    Default
                  </Text>
                )} */}
                {isActive && (
                  <View style={styles.checkIconContainer}>
                    <Image source={Icons.checkMarkWhiteIcon} alt="checked" />
                  </View>
                )}
              </HStack>
              <WalletMenu
                wallet={item}
                onCopy={() => onCopy(item.address)}
                onEditWallet={() => onEditWallet(index)}
                walletIndex={index}
                onDeleteWallet={() => onDeleteWallet(item.address, index)}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default Wallets;

const styles = StyleSheet.create({
  checkIconContainer: {
    backgroundColor: '#699F4C',
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    alignSelf: 'center',
    marginLeft: 10
  },
  touchable: {
    flexDirection: 'row',
    paddingVertical: 23,
    paddingHorizontal: 19,
    justifyContent: 'space-between',
    backgroundColor: '#090C1D',
    marginBottom: 10,
    alignItems: 'center'
  }
});
