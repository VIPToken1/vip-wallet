import React, { FC, memo } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Button, HStack, Image, Text } from 'native-base';
import { Icons } from 'theme';
import { screenWidth } from 'theme/dimensions';
import { Platform } from 'react-native';

const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'backspace'];

type VirtualKeypadProps = {
  maxLength?: number;
  onPress: (key: string) => void;
};

const VirtualKeypad: FC<VirtualKeypadProps> = ({ onPress }) => {
  const renderItem = ({ item }: { item: string | number }) => {
    return (
      <Button
        variant="ghost"
        width={Platform.OS === 'ios' ? screenWidth * 0.225 : screenWidth * 0.18}
        height={
          Platform.OS === 'ios' ? screenWidth * 0.225 : screenWidth * 0.18
        }
        borderRadius={100}
        _pressed={{
          backgroundColor: '#1D1D1D'
        }}
        onPress={() => onPress(String(item))}
      >
        {item === 'backspace' ? (
          <Image
            source={Icons.backspaceIcon}
            resizeMode="contain"
            alt="backspace"
            size={'26px'}
          />
        ) : (
          <Text key={item} fontSize={26} textAlign="center">
            {item}
          </Text>
        )}
      </Button>
    );
  };
  return (
    <HStack alignSelf="center" alignItems="center" w="full">
      <FlatList
        data={keys}
        renderItem={renderItem}
        keyExtractor={item => item.toString()}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapperStyle}
        alwaysBounceVertical={false}
      />
    </HStack>
  );
};

const styles = StyleSheet.create({
  columnWrapperStyle: {
    justifyContent: 'space-between',
    width: screenWidth - 42,
    alignSelf: 'center'
  }
});

VirtualKeypad.defaultProps = {
  onPress: () => null
};

export default memo(VirtualKeypad);
