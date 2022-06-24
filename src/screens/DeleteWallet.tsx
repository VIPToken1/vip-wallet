import * as React from 'react';
import { HStack, Image, Stack, Text } from 'native-base';
import { BackIcon } from 'components';
import { Icons } from 'theme';
import { Colors } from 'theme/colors';

const DeleteWallet = () => {
  return (
    <>
      <HStack justifyContent="space-between" alignItems="center" w="full" p="4">
        <BackIcon />
        <Text fontSize="2xl" fontWeight="bold" px="4">
          Wallet
        </Text>
        <Image source={Icons.deleteIcon} alt="delete" />
      </HStack>
      <Stack>
        <Text color={Colors.PLACEHOLDER} fontSize="18px" px={'24px'} mt="10px">
          Wallet 1
        </Text>
        <HStack
          alignItems={'center'}
          py={'25px'}
          px={'25px'}
          justifyContent="space-between"
          bg={Colors.BG_LIGHT}
          mt={'10px'}
        >
          <Text fontSize={20}>Show recovery pharase</Text>
          <Image
            source={Icons.rightChevronIcon}
            alt="rightChevron"
            size="10px"
          />
        </HStack>
      </Stack>
    </>
  );
};
export default DeleteWallet;
