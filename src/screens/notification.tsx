import { VStack, Text } from 'native-base';
import * as React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Colors } from 'theme/colors';

const notification = [
  {
    title: 'Heading',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the.'
  },
  {
    title: 'Heading',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the.'
  },
  {
    title: 'Heading',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the.'
  }
];

const Notification = () => {
  return (
    <FlatList
      data={notification}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => {
        return (
          <VStack my={'6px'} px="24px" py="14px" bg={Colors.BG_LIGHT}>
            <Text fontSize={'18px'} mb="6px">
              {item.title}
            </Text>
            <Text color={Colors.PLACEHOLDER}>{item.description}</Text>
          </VStack>
        );
      }}
    />
  );
};

export default Notification;
