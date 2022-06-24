import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'native-base';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { mixPath } from 'react-native-redash';

import { getGraphs, GraphIndex, SIZE } from './Model';
import { Labels } from './Labels';
import { CHART_HEIGHT, Icons } from 'theme';

const { width } = Dimensions.get('window');
const AnimatedPath = Animated.createAnimatedComponent(Path);

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
  onChangeGraph: () => void;
  graphData: any;
  onChangeDuration: (duration: string) => void;
  activeLabel: number;
  setActiveLabel: (index: number) => void;
};

export const LineGraph = ({
  onChangeGraph,
  graphData,
  onChangeDuration,
  activeLabel,
  setActiveLabel
}: IProps) => {
  const graphs = getGraphs(graphData);
  const BUTTON_WIDTH = (width - 32) / graphs?.length;

  const transition = useSharedValue(0);

  const previous = useSharedValue<GraphIndex>(0);

  const current = useSharedValue<GraphIndex>(0);

  const animatedProps = useAnimatedProps(() => {
    const previousPath = graphs[previous.value].data.path;
    const currentPath = graphs[current.value].data.path;
    return {
      d: mixPath(transition.value, previousPath, currentPath)
    };
  });

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(BUTTON_WIDTH * current.value) }]
  }));

  return (
    <View style={getStyles(BUTTON_WIDTH).container}>
      <View style={{ marginBottom: 16 }}>
        {graphData.length ? (
          <Svg width={SIZE} height={CHART_HEIGHT}>
            <AnimatedPath
              animatedProps={animatedProps}
              fill="transparent"
              stroke="#38FE3F"
              strokeWidth={3}
            />
          </Svg>
        ) : (
          <Image
            source={Icons.refreshIcon}
            size={25}
            tintColor="white"
            alt="refresh"
          />
        )}
      </View>
      <Labels
        onPressLabel={(index: number) => {
          previous.value = current.value;
          transition.value = 0;
          current.value = index as GraphIndex;
          transition.value = withTiming(1);
          setActiveLabel(index);
          onChangeDuration?.(graphs[index].value as string);
        }}
        labelIndex={activeLabel}
        style={style}
        selected="line"
        labels={graphs}
        onChangeGraph={onChangeGraph}
      />
    </View>
  );
};
