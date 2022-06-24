import React, { FC } from 'react';
import { Actionsheet, Box, HStack, Input, Stack, Text } from 'native-base';
import CloseIcon from './CloseIcon';
import GradientButton from './GradientButton';
import { useTranslations } from 'hooks';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type GasInputProps = {
  label: string;
  defaultValue: string;
};

type Props = {
  isOpen: boolean;
  totalAmount: string;
  onOpen: () => void;
  onClose: () => void;
};

const GasInput: FC<GasInputProps> = ({ defaultValue, label }) => {
  return (
    <Stack w="48%">
      <Text fontSize="md" fontWeight="400" color="#FFF6F6" py="3">
        {label}
      </Text>
      <Input
        variant="filled"
        fontSize="sm"
        py="2"
        px="4"
        rounded="lg"
        bg="#121212"
        textAlign="center"
        color="#FFFFFF"
        selectionColor="#FFFFFF"
        borderWidth={0}
        h={50}
        w="full"
        defaultValue={defaultValue}
        keyboardAppearance="dark"
      />
    </Stack>
  );
};

const EditGasFee: FC<Props> = ({ isOpen, totalAmount, onClose }) => {
  const { strings } = useTranslations();

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content bg="#222222" px="4" minHeight="60%">
        <KeyboardAwareScrollView style={{ width: '100%' }}>
          <HStack justifyContent="space-between" w="full" px="4">
            <Text fontSize="lg" fontWeight="400" color="white">
              {strings.edit_gas_fee}
            </Text>
            <CloseIcon onPress={onClose} />
          </HStack>
          <Box p="4" my="4" w="full">
            <Text color="#777777">{strings.total}</Text>
            <Text fontSize="lg" fontWeight="medium">
              {totalAmount}
            </Text>
            <HStack my="8" w="full" justifyContent="space-between">
              <GasInput label={strings.gas_limit} defaultValue="20000" />
              <GasInput label={strings.gas_price} defaultValue="2" />
            </HStack>
          </Box>
          <GradientButton title={strings.save} onPress={onClose} />
        </KeyboardAwareScrollView>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default EditGasFee;
