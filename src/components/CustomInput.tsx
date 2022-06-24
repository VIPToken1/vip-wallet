import React, { FC } from 'react';
import { Box, IInputProps, Input } from 'native-base';

interface ICustomInputProps extends IInputProps {
  bgColor?: string;
}

const CustomInput: FC<ICustomInputProps> = ({
  children,
  placeholder,
  value,
  bgColor,
  onChangeText,
  ...rest
}) => {
  return (
    <Box
      flexDirection="row"
      rounded={50}
      bgColor={bgColor || '#1D1D1D'}
      p="2"
      w="100%"
      alignSelf="center"
      alignItems="center"
      justifyContent="space-between"
    >
      <Input
        placeholder={placeholder}
        variant="unstyled"
        fontSize="md"
        color="#FFFFFF"
        px="4"
        value={value}
        onChangeText={onChangeText}
        selectionColor="#FFFFFF"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardAppearance="dark"
        {...rest}
      />
      {children}
    </Box>
  );
};

export default CustomInput;
