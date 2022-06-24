import React, { FC } from 'react';
import {
  Alert,
  ImageSourcePropType,
  SectionList,
  TouchableOpacity
} from 'react-native';
import { AlertDialog, Button, HStack, Image, Text } from 'native-base';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppDispatch, useTranslations } from 'hooks';
import { Icons } from 'theme';
import { Colors } from 'theme/colors';
import { storage } from 'utils';
import { logout } from 'store/actions';

type SettingsRowProps = {
  leftIcon: ImageSourcePropType;
  label: string;
  value?: string;
  rightIcon?: boolean;
  onPress?: () => void;
};

type SettingsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Settings'
>;

const SettingsRow: FC<SettingsRowProps> = ({ leftIcon, label, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.5}>
      <HStack
        alignItems={'center'}
        py={'25px'}
        px={'25px'}
        justifyContent="space-between"
        // w="full"
        // my="5"
      >
        <HStack alignItems="center">
          {label === 'About' ? (
            <MaterialCommunityIcons
              name="information"
              color="#777777"
              size={22}
            />
          ) : (
            <Image
              source={leftIcon}
              width={5}
              height={5}
              resizeMode="contain"
              tintColor="#777777"
              alt="label"
            />
          )}
          <Text pl="20px" fontSize={20}>
            {label}
          </Text>
        </HStack>
        <Image
          source={Icons.rightChevronIcon}
          resizeMode="contain"
          alt="rightChevron"
          size="10px"
        />
      </HStack>
    </TouchableOpacity>
  );
};

const settingsList = [
  {
    title: 'Wallet',
    data: [
      {
        leftIcon: Icons.settingsWalletIcon,
        label: 'Accounts',
        value: 'wallet',
        navigateTo: 'Wallets'
      },
      {
        leftIcon: Icons.settingsWalletIcon,
        label: 'Recovery Phrase',
        value: 'wallet',
        navigateTo: 'Biometrics',
        params: { nextRoute: 'ShowRecoveryPhrase' }
      }
    ]
  },
  {
    title: 'Security',
    data: [
      {
        leftIcon: Icons.settingsNetworkIcon,
        label: 'Security',
        value: 'security',
        navigateTo: 'AppLock'
      }
      // {
      //   leftIcon: Icons.settingsIcon,
      //   label: 'Notifications',
      //   value: 'notifications',
      //   navigateTo: 'NotificationSettings'
      // }
    ]
  },
  {
    title: 'Other',
    data: [
      {
        leftIcon: Icons.settingsCurrencyIcon,
        label: 'Local currency',
        value: 'localCurrency',
        navigateTo: 'LocalCurrency'
      },
      {
        leftIcon: Icons.settingsTransactionHistoryIcon,
        label: 'Transaction history',
        value: 'transactionHistory',
        navigateTo: 'Transactions'
      },
      {
        leftIcon: Icons.settingsContactUsIcon,
        label: 'Contact us',
        value: 'contactUs',
        navigateTo: 'ContactUs'
      },
      {
        leftIcon: Icons.settingsLogoutIcon,
        label: 'Logout',
        value: 'logout',
        navigateTo: ''
      },
      {
        leftIcon: Icons.infoIcon,
        label: 'About',
        value: 'about',
        navigateTo: 'About'
      }
    ]
  }
];

const Settings = () => {
  const { strings } = useTranslations();
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [isLogoutAlert, setIsLogoutAlert] = React.useState(false);

  const cancelRef = React.useRef(null);

  const dispatch = useAppDispatch();

  const onClose = () => setIsLogoutAlert(false);

  const onLogoutPress = async () => {
    // setIsLogoutAlert(true);
    Alert.alert(
      'Are you sure you want to log out?',
      'Please make sure you have a backup of your recovery phrase. When you log out your current wallet will be removed from the app.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: async () => {
            await storage.clear();
            dispatch(logout());
            navigation.navigate('Loading');
          }
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <>
      <HStack alignItems={'center'} py="4" justifyContent={'center'}>
        <Text fontSize="22px" fontWeight={'700'}>
          {strings.settings}
        </Text>
      </HStack>

      <SectionList
        sections={settingsList}
        keyExtractor={(_, index) => index.toString()}
        style={{ marginBottom: 100 }}
        renderItem={({ item }) => (
          <SettingsRow
            leftIcon={item.leftIcon}
            label={item.label}
            value={item.value}
            onPress={() => {
              if (item.value === 'logout') {
                onLogoutPress();
                return;
              }
              if (item.navigateTo !== '') {
                navigation.navigate(item.navigateTo as any, item.params);
              }
            }}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <HStack
            alignItems={'center'}
            py={'16px'}
            px={'25px'}
            bg={Colors.BG_LIGHT}
          >
            <Text color={Colors.PLACEHOLDER} fontSize={'14px'}>
              {title}
            </Text>
          </HStack>
        )}
      />
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isLogoutAlert}
        onClose={onClose}
      >
        <AlertDialog.Content>
          <AlertDialog.Header>
            Are you sure you want to log out?
          </AlertDialog.Header>
          <AlertDialog.Body>
            Please make sure you have a backup of your recovery phrase. When you
            log out your current wallet will be removed from the app.
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onClose}
                ref={cancelRef}
              >
                Cancel
              </Button>
              <Button
                // variant="unstyled"
                color="red.600"
                colorScheme="danger"
                onPress={onClose}
              >
                Delete
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </>
  );
};

SettingsRow.defaultProps = {
  rightIcon: true
};

export default Settings;
