import * as React from 'react';
import { ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Switch } from 'native-base';
import { Colors } from 'theme/colors';
import { useTranslations } from 'hooks';
import { useNavigation } from '@react-navigation/native';
import { pt } from 'theme';

const NotificationSettings = () => {
  const { strings } = useTranslations();
  const navigation = useNavigation();
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      <TouchableOpacity style={styles.touchable}>
        <Text fontSize={pt(32)}>{strings.allow_push_notifications}</Text>
        <Switch
          alignSelf={'flex-end'}
          size="md"
          onTrackColor={Colors.PRIMARY}
          offThumbColor={'#070915'}
          offTrackColor={'#656880'}
          onThumbColor={Colors.WHITE}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.touchable}>
        <Text fontSize={pt(32)}>{strings.send_and_receive}</Text>
        <Switch
          alignSelf={'flex-end'}
          size="md"
          onTrackColor={Colors.PRIMARY}
          offThumbColor={'#070915'}
          offTrackColor={'#656880'}
          onThumbColor={Colors.WHITE}
        />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default NotificationSettings;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1
  },
  container: {
    paddingTop: 20,
    paddingBottom: '25%'
  },
  touchable: {
    flexDirection: 'row',
    paddingVertical: 23,
    paddingHorizontal: 19,
    justifyContent: 'space-between',
    backgroundColor: '#090C1D',
    marginBottom: 10
  }
});
