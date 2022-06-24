import React, { FC, useState } from 'react';
import { Image } from 'react-native';
import { Button, IInputProps, Input } from 'native-base';
import { Icons } from 'theme';

interface PasswordInputProps extends IInputProps {}

const PasswordInput: FC<PasswordInputProps> = ({ isInvalid, ...props }) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <Input
      width="100%"
      size="lg"
      variant="unstyled"
      color="white"
      secureTextEntry={!isVisible}
      px="2"
      py="8"
      mt="8"
      selectionColor="white"
      keyboardAppearance="dark"
      isInvalid={isInvalid}
      InputRightElement={
        <Button
          variant="ghost"
          _pressed={{ backgroundColor: '#333333' }}
          onPress={() => setIsVisible(prev => !prev)}
          rounded="lg"
        >
          <Image source={isVisible ? Icons.eyeHideIcon : Icons.eyeShowIcon} />
        </Button>
      }
      {...props}
    />
  );
};

export default PasswordInput;
