import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  ViewStyle,
  ActivityIndicator
} from 'react-native';
import { pixW } from 'theme';
import Colors from 'theme/colors';

type themeType = 'Dark' | 'light';
interface LoaderProps {
  style?: ViewStyle;
  isLoaderVisible?: boolean;
  // theme?: themeType;
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  contentContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: pixW(80),
    height: pixW(80),
    borderRadius: pixW(10),
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  }
});

export const Loader = (props: LoaderProps) => {
  const { isLoaderVisible } = props;
  return (
    <Modal
      {...props}
      visible={isLoaderVisible}
      transparent={true}
      onRequestClose={() => console.log('true ')}
    >
      <View style={styles.mainContainer}>
        <View style={[styles.contentContainer]}>
          <ActivityIndicator size={'large'} color={Colors.WHITE} />
        </View>
      </View>
    </Modal>
  );
};
