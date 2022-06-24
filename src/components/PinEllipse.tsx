import React, { FC } from 'react';
import { View } from 'native-base';

type Props = {
  bgColor?: string;
  size?: number | string;
  spacing?: number | string;
};

const PinEllipse: FC<Props> = ({ bgColor, size, spacing }) => {
  return <View bg={bgColor} w={size} h={size} rounded="10px" mx={spacing} />;
};

PinEllipse.defaultProps = {
  bgColor: '#FFFFFF',
  size: '20px',
  spacing: '1px'
};

export default PinEllipse;
