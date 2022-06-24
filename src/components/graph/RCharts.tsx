/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Dimensions } from 'react-native';
import { CHART_HEIGHT } from 'theme';
import {
  ChartDot,
  ChartPath,
  ChartPathProvider,
  ChartYLabel,
  monotoneCubicInterpolation
} from '../../../animated-charts';
const { width: SIZE } = Dimensions.get('window');

const getDataPoints = (data: [number, number][]) =>
  data.map(([x, y]) => ({ x, y }));

const formatUSD = (value: string) => {
  'worklet';
  if (value === '') {
    return '';
  }
  return value?.includes('e')
    ? `$${Number(value).toFixed(12)}`
    : `$${Number(value).toFixed(2)}`;
};

const RCharts: React.FC<{ data: any }> = ({ data }) => {
  if (data.length === 0) {
    return null;
  }
  return (
    <ChartPathProvider
      data={{
        points: monotoneCubicInterpolation({
          data: getDataPoints(data),
          range: 40
        }),
        smoothingFactor: 0,
        smoothingStrategy: 'none'
      }}
    >
      <ChartPath
        hapticsEnabled
        smoothingWhileTransitioningEnabled={false}
        fill="transparent"
        height={CHART_HEIGHT - 20}
        stroke="#38FE3F"
        strokeWidth={1}
        width={SIZE}
        data={undefined}
        children={undefined}
      />
      <ChartDot
        style={{
          backgroundColor: 'green'
        }}
      />
      <ChartYLabel
        format={formatUSD}
        style={{
          color: 'green',
          margin: 4,
          width: SIZE - 45,
          position: 'absolute',
          bottom: -20,
          left: 10
        }}
      />
    </ChartPathProvider>
  );
};

export default RCharts;
