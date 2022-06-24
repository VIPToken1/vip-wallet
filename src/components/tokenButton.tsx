import * as React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Box, Image, Text } from 'native-base';
import { Colors } from 'theme/colors';

interface TokenButtonrops {
  onPress: () => void;
  source: any;
  label: string;
}

export const TokenButton = ({ onPress, source, label }: TokenButtonrops) => {
  return (
    <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
      <Box alignItems="center" minW="100px" mx="2" px="1">
        <Image source={source} alt={label} />
        <Text color={Colors.PLACEHOLDER} py="2">
          {label}
        </Text>
      </Box>
    </TouchableOpacity>
  );
};

export const TransButton = () => {
  return (
    <View style={styles.container}>
      <Text>TokenButton</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {}
});
