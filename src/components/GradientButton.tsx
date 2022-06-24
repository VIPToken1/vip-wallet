import React, { FC } from 'react';
import { Platform, StyleSheet, ViewStyle } from 'react-native';
import { Button, IButtonProps } from 'native-base';
import { Colors } from 'theme/colors';
import { screenWidth } from 'theme';

type GradientButtonProps = {
  title?: string;
  isGradient?: boolean;
  style?: Pick<IButtonProps, 'style'> & ViewStyle;
  disabled?: boolean;
  onPress?: () => void;
};

const GradientButton: FC<GradientButtonProps> = ({
  children,
  title,
  style,
  disabled,
  onPress
}) => {
  return (
    <Button
      variant="unstyled"
      mt="3"
      alignSelf="center"
      onPress={disabled ? undefined : onPress}
      bg={Colors.PRIMARY}
      opacity={disabled ? (Platform.OS === 'ios' ? 0.2 : 0.5) : 1}
      w={screenWidth * 0.84}
      px="6"
      py="4"
      rounded="lg"
      _text={{
        color: Colors.WHITE,
        fontSize: 'md',
        fontWeight: 'bold',
        textAlign: 'center',
        numberOfLines: 1,
        ellipsizeMode: 'tail',
        adjustsFontSizeToFit: true
      }}
      style={[styles.btn, style]}
    >
      {children || title}
    </Button>
  );
};

const styles = StyleSheet.create({
  btn: {
    borderRadius: 10
  }
});

GradientButton.defaultProps = {
  isGradient: true
};

export default GradientButton;
