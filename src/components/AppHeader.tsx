import React, { FC } from 'react';
import { HStack, Text, View } from 'native-base';
import { StackHeaderProps } from '@react-navigation/stack';
import BackIcon from './BackIcon';
import { Colors } from 'theme/colors';

interface HeaderProps extends StackHeaderProps {}

const AppHeader: FC<HeaderProps> = ({ navigation, options }) => {
  return (
    <HStack
      justifyContent="space-between"
      backgroundColor={Colors.BG}
      alignItems="center"
      w="full"
      p="4"
    >
      {options.headerLeft ? (
        <View w={30}>{options.headerLeft?.({})}</View>
      ) : (
        <BackIcon onPress={() => navigation.goBack()} />
      )}
      <Text fontSize="2xl" fontWeight="bold">
        {options.headerTitle}
      </Text>
      {options.headerRight ? options.headerRight?.({}) : <View w={30} />}
      {/* <CloseIcon /> */}
    </HStack>
  );
};

export default AppHeader;
