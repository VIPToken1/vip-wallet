import React, { FC } from 'react';
import {
  Image,
  ImageBackground,
  ImageSourcePropType,
  ImageStyle,
  StyleSheet,
  TouchableOpacity,
  ViewStyle
} from 'react-native';
import { Icons } from 'theme';

type RoundIconProps = {
  source: ImageSourcePropType;
  containerStyle?: ViewStyle;
  imageStyle?: ImageStyle;
  disabled?: boolean;
  onPress?: () => void;
};

const RoundIcon: FC<RoundIconProps> = ({
  source,
  containerStyle,
  imageStyle,
  disabled,
  onPress
}) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <ImageBackground
        source={Icons.roundBaseIcon}
        style={[styles.iconContainer, containerStyle]}
      >
        <Image source={source} style={imageStyle} resizeMode="contain" />
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60
  }
});

export default RoundIcon;
