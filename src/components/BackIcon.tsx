import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';
import { Image } from 'native-base';
import { Icons } from 'theme';
import { navigationRef } from 'navigation/NavigationService';

const BackIcon: FC<{ onPress?: () => void }> = ({ onPress }) => {
  const onPressHandler = () => {
    if (onPress) {
      onPress();
    } else {
      navigationRef.current?.goBack();
    }
  };

  return (
    <TouchableOpacity
      style={{
        paddingRight: 10,
        paddingVertical: 10
      }}
      onPress={onPressHandler}
    >
      <Image
        source={Icons.backIcon}
        width="10.5px"
        height="18px"
        alignSelf="flex-end"
        resizeMode="contain"
        alt="close"
      />
    </TouchableOpacity>
  );
};

export default BackIcon;
