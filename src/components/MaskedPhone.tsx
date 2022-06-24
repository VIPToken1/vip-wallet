import React, { FC, useMemo } from 'react';
import { Box, IBoxProps, Text, View } from 'native-base';
import PinEllipse from './PinEllipse';

interface IMaskedPhoneProps extends IBoxProps {
  text: string;
  color?: string;
  isVerified?: boolean;
}

const MaskedPhone: FC<IMaskedPhoneProps> = ({
  text,
  color,
  isVerified,
  ...props
}) => {
  const defaultColor = useMemo(
    () => (color ? color : isVerified ? '#FFFFFF' : '#CDF460'),
    [color, isVerified]
  );

  const maskedText = useMemo(() => text.slice(7), [text]);

  return (
    <Box flexDirection="row" alignItems="center" {...props}>
      {Array(3)
        .fill('*')
        .map((_, index) => (
          <PinEllipse
            key={index}
            bgColor={defaultColor}
            size="14px"
            spacing="2px"
          />
        ))}
      <View px="1" />
      {Array(3)
        .fill('*')
        .map((_, index) => (
          <PinEllipse
            key={index}
            bgColor={defaultColor}
            size="14px"
            spacing="2px"
          />
        ))}
      <View px="1" />
      <PinEllipse bgColor={defaultColor} size="14px" spacing="2px" />
      <Text
        px="1"
        fontSize="lg"
        fontWeight="medium"
        color={defaultColor}
        letterSpacing={2}
      >
        {maskedText}
      </Text>
    </Box>
  );
};

export default MaskedPhone;
