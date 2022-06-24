import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Image, Spinner, View } from 'native-base';
import RCharts from './RCharts';
import { Labels } from './Labels';
import { Icons, CHART_HEIGHT } from 'theme';
import { Colors } from 'theme/colors';

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
      width: SELECTION_WIDTH,
      alignSelf: 'center',
      marginTop: 10
    },
    labelContainer: {
      padding: 6,
      width: w
    },
    label: {
      color: 'black',
      fontWeight: 'bold',
      textAlign: 'center'
    }
  });

type IProps = {
  graphData: any;
  onChangeDuration: (duration: string) => void;
  activeLabel: number;
  setActiveLabel: (index: number) => void;
};

const ChartIntervals = [
  {
    label: '1D',
    value: 1
  },
  {
    label: '1W',
    value: 7
  },
  {
    label: '1M',
    value: 30
  },
  {
    label: '3M',
    value: 90
  },
  {
    label: '1Y',
    value: 365
  },
  {
    label: 'All',
    value: 'max'
  }
];

const BUTTON_WIDTH = (width - 32) / ChartIntervals?.length;
const LineGraph = ({
  graphData,
  onChangeDuration,
  activeLabel,
  setActiveLabel
}: IProps) => {
  return (
    <View style={getStyles(BUTTON_WIDTH).container}>
      <View
        mb="16px"
        h={CHART_HEIGHT}
        justifyContent="center"
        alignItems="center"
      >
        {graphData.length ? (
          <RCharts data={graphData} />
        ) : (
          <View
            alignSelf="center"
            w={width}
            alignItems="center"
            justifyContent="center"
          >
            <Spinner color={Colors.PRIMARY} />
          </View>
        )}
      </View>
      <Labels
        onPressLabel={(index: number) => {
          setActiveLabel(index);
          onChangeDuration?.(ChartIntervals[index].value as string);
        }}
        labelIndex={activeLabel}
        labels={ChartIntervals}
      />
    </View>
  );
};

export default LineGraph;
