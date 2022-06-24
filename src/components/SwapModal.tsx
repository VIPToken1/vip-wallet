import * as React from 'react';
import { Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, Image, Input, HStack, Modal, Pressable } from 'native-base';
import { Icons } from 'theme';
import {
  useAppDispatch,
  useAppSelector,
  useErrorState,
  useTranslations
} from 'hooks';
import { Colors } from 'theme/colors';
import { WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import { actions } from 'store';
import { SwapSpeeds } from 'types';

type Props = {
  closeModal: () => void;
};

interface SwapModalProps {
  visible: boolean;
  closeModal: () => void;
  modalType: string;
}

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
    width: WINDOW_WIDTH - 40,
    borderRadius: 20,
    paddingBottom: 25
  },
  closeContainer: {
    alignSelf: 'flex-end',
    marginRight: 10,
    marginTop: 10,
    paddingHorizontal: 10
  },
  tolleranceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 30,
    alignSelf: 'center',
    width: WINDOW_WIDTH - 40
  },
  paddings: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: Colors.BG,
    borderRadius: 20,
    width: 80,
    alignItems: 'center'
  },
  selectedItem: {
    backgroundColor: Colors.PRIMARY
  },
  paddings2: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.BG,
    borderRadius: 20,
    alignItems: 'center'
  },
  text: { fontSize: 14, color: Colors.WHITE }
});

const SLIPPAGE = [
  { label: '12%', value: 12 },
  { label: '15%', value: 15 },
  { label: '20%', value: 20 }
];

const SetSlippingTolerance: React.FC<Props> = ({ closeModal }) => {
  const { strings } = useTranslations();
  const dispatch = useAppDispatch();
  const { slippage } = useAppSelector(state => state.swap);
  const [slippageValue, setSlippageValue] = React.useState(slippage);
  const [errorMessage, setErrorMessage] = useErrorState('', { timeout: 5e3 });

  const onSubmit = () => {
    if (slippageValue >= 12 && slippageValue.length < 100) {
      setErrorMessage('');
      onChangeSlippage(parseFloat(slippageValue));
    } else {
      setErrorMessage(strings.slippage_error);
    }
  };

  const onChangeSlippage = (value: number) => {
    dispatch(actions.setSwapSlippage(value));
    closeModal();
  };

  return (
    <View>
      <Text fontSize="18px" textAlign="center" color={Colors.PLACEHOLDER}>
        {strings.set_slippage_tolerance.toUpperCase()}
      </Text>
      <View style={styles.tolleranceContainer}>
        {SLIPPAGE.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => onChangeSlippage(item.value)}
            _pressed={{ opacity: 0.5 }}
          >
            <View
              style={[
                styles.paddings,
                item.value === slippage && styles.selectedItem
              ]}
            >
              <Text style={styles.text}>{item.label}</Text>
            </View>
          </Pressable>
        ))}
      </View>
      <Text
        mt={30}
        alignSelf={'center'}
        fontSize="18px"
        color={Colors.PLACEHOLDER}
      >
        {strings.set_manually.toUpperCase()}
      </Text>
      <HStack mt="20px" alignItems={'center'} justifyContent={'center'}>
        <Input
          placeholder="12"
          bg={Colors.BG}
          color={Colors.WHITE}
          selectionColor={Colors.WHITE}
          borderWidth={0}
          width={'100px'}
          textAlign={'center'}
          borderRadius={'20px'}
          fontSize="18px"
          py={'10px'}
          maxLength={7}
          keyboardType="decimal-pad"
          keyboardAppearance="dark"
          returnKeyType="done"
          value={slippageValue?.toString()}
          onChangeText={setSlippageValue}
          onBlur={onSubmit}
          onSubmitEditing={onSubmit}
        />
        <Text ml={2}>%</Text>
      </HStack>
      {!!errorMessage && (
        <Text color={Colors.LIGHT_RED} px="2" py="1">
          {errorMessage}
        </Text>
      )}
    </View>
  );
};

const SetTransactionSpeed: React.FC<Props> = ({ closeModal }) => {
  const { strings } = useTranslations();
  const dispatch = useAppDispatch();
  const { speed } = useAppSelector(state => state.swap);

  const onChangeSpeed = (value: SwapSpeeds) => {
    dispatch(actions.setSwapSpeed(value));
    closeModal();
  };

  return (
    <View>
      <Text fontSize="18px" textAlign="center" color={Colors.PLACEHOLDER}>
        {strings.set_transaction_speed.toUpperCase()}
      </Text>
      <View style={styles.tolleranceContainer}>
        <Pressable onPress={() => onChangeSpeed(SwapSpeeds.STD)}>
          <View
            style={[
              styles.paddings2,
              speed === SwapSpeeds.STD && styles.selectedItem
            ]}
          >
            <Text style={styles.text}>STD</Text>
          </View>
        </Pressable>
        <Pressable onPress={() => onChangeSpeed(SwapSpeeds.FAST)}>
          <View
            style={[
              styles.paddings2,
              speed === SwapSpeeds.FAST && styles.selectedItem
            ]}
          >
            <Text style={styles.text}>Fast</Text>
          </View>
        </Pressable>
        <Pressable onPress={() => onChangeSpeed(SwapSpeeds.LIGHTNING)}>
          <View
            style={[
              styles.paddings2,
              speed === SwapSpeeds.LIGHTNING && styles.selectedItem
            ]}
          >
            <Text style={styles.text}>Lightning</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const SetTimeLimit: React.FC<Props> = ({ closeModal }) => {
  const [value, setValue] = React.useState('5');
  const { strings } = useTranslations();
  const dispatch = useAppDispatch();
  const { txnTime } = useAppSelector(state => state.swap);

  React.useEffect(() => {
    setValue(String(txnTime));
  }, [txnTime]);

  const onChangeTxnTime = (payload: number) =>
    dispatch(actions.setSwapTxnTime(Number(payload)));

  const onSubmitEditing = () => {
    Keyboard.dismiss();
    closeModal();
    onChangeTxnTime(Number(value));
  };

  return (
    <View>
      <Text fontSize="18px" color={Colors.PLACEHOLDER}>
        {strings.set_transaction_time_limit.toUpperCase()}
      </Text>
      <HStack mt="20px" alignItems={'center'} justifyContent={'center'}>
        <Input
          placeholder="5"
          bg={Colors.BG}
          borderWidth={0}
          width={'100px'}
          textAlign={'center'}
          borderRadius={'20px'}
          fontSize="18px"
          py={'10px'}
          keyboardType="number-pad"
          color={Colors.WHITE}
          selectionColor={Colors.WHITE}
          maxLength={2}
          value={value}
          onChangeText={setValue}
          keyboardAppearance="dark"
          returnKeyType="done"
          onSubmitEditing={onSubmitEditing}
        />
        <Text ml={2}>Minutes</Text>
      </HStack>
    </View>
  );
};

const modalTypes: any = {
  SLIPPAGE: SetSlippingTolerance,
  SPEED: SetTransactionSpeed,
  TXT_TIME: SetTimeLimit
};

const SwapModal = ({ visible, closeModal, modalType }: SwapModalProps) => {
  return (
    <Modal
      isKeyboardDismissable={false}
      avoidKeyboard={true}
      style={styles.modalStyle}
      isOpen={visible}
    >
      <View style={styles.innerContainer}>
        <TouchableOpacity style={styles.closeContainer} onPress={closeModal}>
          <Image source={Icons.closeIcon} alt="closeIcon" />
        </TouchableOpacity>
        {!!modalTypes[modalType] &&
          React.createElement(modalTypes[modalType], { closeModal })}
      </View>
    </Modal>
  );
};

export default SwapModal;
