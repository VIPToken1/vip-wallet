import React, { FC } from 'react';
import { HStack, Text, View } from 'native-base';
import PinEllipse from './PinEllipse';

const DEFAULT_LENGTH = 6;
const defaultPin = Array(DEFAULT_LENGTH).fill('');

type PinInputProps = {
  pin?: string;
  pinLength?: number;
  color?: string;
  isSecured?: boolean;
};

const PinInput: FC<PinInputProps> = ({ pin, pinLength, color, isSecured }) => {
  const pinStr = pin
    ? pin.split('').concat(defaultPin)
    : Array(pinLength).fill('');
  pinStr.length = pinLength || DEFAULT_LENGTH;

  return (
    <HStack
      justifyContent="space-between"
      alignItems="center"
      alignSelf="center"
    >
      {pinStr.map((digit, index) => (
        <View
          key={index}
          w="32px"
          mx="2"
          alignItems="center"
          justifyContent="center"
        >
          {!isSecured && digit ? (
            <Text fontSize="28px" fontWeight="bold" color={color || '#FFFFFF'}>
              {digit}
            </Text>
          ) : (
            <PinEllipse
              size="18px"
              bgColor={isSecured && digit ? '#FFFFFF' : '#101324'}
            />
          )}
        </View>
      ))}
    </HStack>
  );
};

PinInput.defaultProps = {
  pinLength: DEFAULT_LENGTH
};

export default PinInput;
