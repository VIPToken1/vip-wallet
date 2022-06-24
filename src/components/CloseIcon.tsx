import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';
import { Image } from 'native-base';
import { Icons } from 'theme';
import { navigationRef } from 'navigation/NavigationService';

const CloseIcon: FC<{ onPress?: () => void }> = ({ onPress }) => {
  const onPressHandler = () => {
    if (onPress) {
      onPress();
    } else {
      navigationRef.current?.goBack();
    }
  };

  return (
    <TouchableOpacity onPress={onPressHandler}>
      <Image
        source={Icons.closeIcon}
        width="30"
        height="30"
        alignSelf="flex-end"
        resizeMode="contain"
        alt="close"
      />
    </TouchableOpacity>
  );
};

export default CloseIcon;
