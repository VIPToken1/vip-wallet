import React, { FC } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

type SpacerProps = {
  style?: ViewStyle;
  spacing?: number | string;
  direction?: 'row' | 'column';
};

const Spacer: FC<SpacerProps> = ({ style, spacing, direction }) => {
  const margin =
    direction === 'row'
      ? { marginHorizontal: spacing }
      : { marginVertical: spacing };
  return <View style={[styles.spacer, margin, style]} />;
};

const styles = StyleSheet.create({
  spacer: {
    marginVertical: '5%'
  }
});

export default Spacer;
