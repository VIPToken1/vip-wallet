import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';
import { HStack, Image, Text, View } from 'native-base';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Icons } from 'theme';

interface HeaderProps extends NativeStackHeaderProps {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
}

const CustomHeader: FC<HeaderProps> = ({ left, center, right }) => {
  return (
    <HStack justifyContent="space-between" w="full" px="6">
      {left}
      {center}
      {right}
      {/* <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={Icons.backIcon}
          width="30"
          height="30"
          alignSelf="flex-end"
          resizeMode="contain"
          alt="close"
        />
      </TouchableOpacity>
      <Text fontSize="2xl" fontWeight="bold">
        {options.headerTitle}
      </Text>
      {options.headerRight ? options.headerRight?.({}) : <View w={30} />} */}
    </HStack>
  );
};

export default CustomHeader;
