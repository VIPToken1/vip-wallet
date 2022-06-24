import React, { FC } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Button, IButtonProps } from 'native-base';

type ThemeButtonProps = {
  title?: string;
  style?: Pick<IButtonProps, 'style'> & ViewStyle;
  disabled?: boolean;
  onPress?: () => void;
};

const ThemeButton: FC<ThemeButtonProps> = ({
  children,
  title,
  style,
  disabled,
  onPress
}) => {
  return (
    <Button
      size="sm"
      variant={'solid'}
      alignSelf="center"
      _text={{
        color: '#1F2937',
        fontSize: 'lg',
        fontWeight: 'bold'
      }}
      w="72"
      px="8"
      py="4"
      mt="3"
      opacity={disabled ? 0.5 : 1}
      style={[styles.btn, style]}
      onPress={disabled ? undefined : onPress}
    >
      {children || title}
    </Button>
  );
};

const styles = StyleSheet.create({
  btn: {
    borderRadius: 40,
    backgroundColor: '#CCAB2E'
  }
});

export default ThemeButton;
