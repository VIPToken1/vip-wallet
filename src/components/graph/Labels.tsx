import { Image } from 'native-base';
import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';
import { screenWidth } from 'theme';
import { Colors } from 'theme/colors';
import { graphs } from './Model';

export type Label = { label: string; value: number | string };

interface LabelsProps {
  labels: Label[];
  labelIndex: number;
  onPressLabel: (index: number) => void;
}

const { width } = Dimensions.get('window');

const SELECTION_WIDTH = width - 32;

const getStyles = (w: number) =>
  StyleSheet.create({
    container: {
      flex: 1
    },
    backgroundSelection: {
      ...StyleSheet.absoluteFillObject,
      width: w,
      borderRadius: 8
    },
    selection: {
      flexDirection: 'row',
      alignSelf: 'center',
      marginTop: 10,
      width: screenWidth,
      justifyContent: 'space-between',
      paddingHorizontal: 10
    },
    labelContainer: {
      paddingHorizontal: 6
    },
    label: {
      color: 'black',
      textAlign: 'center',
      textTransform: 'uppercase'
    },
    lableActive: {
      color: Colors.PRIMARY,
      fontSize: 18,
      fontWeight: 'bold',
      bottom: 4
    },
    lableInactive: {
      color: '#FFFFFF',
      fontSize: 14,
      bottom: 0
    }
  });
export const Labels = ({ onPressLabel, labels, labelIndex }: LabelsProps) => {
  const BUTTON_WIDTH = (width - 60) / labels.length;
  const styles = getStyles(BUTTON_WIDTH);

  return (
    <View style={styles.selection}>
      <View style={StyleSheet.absoluteFill} />
      {labels.map((item: Label, index: number) => {
        return (
          <TouchableWithoutFeedback
            key={item.label}
            onPress={() => onPressLabel(index)}
          >
            <View style={[styles.labelContainer]}>
              <Text
                style={[
                  styles.label,
                  {
                    color: index === labelIndex ? Colors.PRIMARY : Colors.WHITE
                  },
                  index === labelIndex
                    ? styles.lableActive
                    : styles.lableInactive
                ]}
                adjustsFontSizeToFit
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );
};
