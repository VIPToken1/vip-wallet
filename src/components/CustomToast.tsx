import React from 'react';
import { Alert, HStack, Text } from 'native-base';
import { VariantType } from 'native-base/lib/typescript/components/types';

type Props = {
  id: string;
  message: string;
  variant?: VariantType<'Alert'>;
  status?: 'info' | 'warning' | 'success' | 'error';
};

const CustomToast: React.FC<Props> = ({ variant, status, message }) => {
  return (
    <Alert w="100%" variant={variant} colorScheme={status} status={status}>
      <HStack
        flexShrink={1}
        space={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <HStack space={2} flexShrink={1} alignItems="center">
          <Alert.Icon />
          <Text color="black" numberOfLines={2} ellipsizeMode="tail">
            {message}
          </Text>
        </HStack>
      </HStack>
    </Alert>
  );
};

export default CustomToast;
