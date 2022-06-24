import React, { FC } from 'react';
import { HStack, Text, View } from 'native-base';
import CloseIcon from './CloseIcon';

type HeaderProps = {
  title?: string;
};

const HeaderWithCloseIcon: FC<HeaderProps> = ({ title }) => {
  return (
    <HStack justifyContent="space-between" w="full" p="4">
      <View w="30px" />
      <Text fontSize="2xl" fontWeight="bold">
        {title}
      </Text>
      <CloseIcon />
    </HStack>
  );
};

export default HeaderWithCloseIcon;
