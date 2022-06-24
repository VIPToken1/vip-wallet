import React from 'react';
import { Text, View } from 'native-base';
import WebView from 'react-native-webview';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import { Colors } from 'theme/colors';

type BlockExplorerScreenRouteProp = RouteProp<
  RootStackParamList,
  'BlockExplorer'
>;

type BlockExplorerScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'BlockExplorer'
>;

const BlockExplorer = () => {
  const navigation = useNavigation<BlockExplorerScreenNavigationProp>();
  const { params } = useRoute<BlockExplorerScreenRouteProp>();
  const [error, setError] = React.useState('');

  console.log('Explorer URL : ', params.url);

  return (
    <View flex={1}>
      {!!error && <Text color={Colors.LIGHT_RED}>{error}</Text>}
      <WebView
        source={{ uri: params.url }}
        style={styles.webView}
        onError={(e: any) => setError(e.toString)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  webView: {
    flex: 1,
    height: '100%',
    width: '100%'
  }
});

export default BlockExplorer;
