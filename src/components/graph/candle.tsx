import React from 'react';
import { Dimensions, View } from 'react-native';
import { scaleLinear } from 'd3-scale';
import { Line, Rect, Svg } from 'react-native-svg';
import { Labels } from './Labels';

const MARGIN = 2;
export const { width: size } = Dimensions.get('window');

export interface Candle {
  date: string;
  day: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CandleProps {
  candle: Candle;
  index: number;
  width: number;
  scaleY: any;
  scaleBody: any;
}

interface ChartProps {
  candles: Candle[];
  domain: [number, number];
  onChangeGraph: () => void;
}

export const CandleStick = ({
  candle,
  index,
  width,
  scaleY,
  scaleBody
}: CandleProps) => {
  const { close, open, high, low } = candle;
  const fill = close > open ? '#CFF761' : '#ED6688';
  const x = index * width;
  const max = Math.max(open, close);
  const min = Math.min(open, close);
  return (
    <>
      <Line
        x1={x + width / 2}
        y1={scaleY(low)}
        x2={x + width / 2}
        y2={scaleY(high)}
        stroke={'#8E899C'}
        strokeWidth={1}
      />
      <Rect
        x={x + MARGIN}
        y={scaleY(max)}
        width={width - MARGIN * 2}
        height={scaleBody(max - min)}
        {...{ fill }}
      />
    </>
  );
};

export const CandleChart = ({ candles, domain, onChangeGraph }: ChartProps) => {
  const width = size / candles.length;
  const scaleY = scaleLinear().domain(domain).range([350, 0]);
  const scaleBody = scaleLinear()
    .domain([0, Math.max(...domain) - Math.min(...domain)])
    .range([0, 350]);
  return (
    <View>
      <Svg width={size} height={350}>
        {candles.map((candle, index) => (
          <CandleStick
            key={candle.date}
            {...{ candle, index, width, scaleY, scaleBody }}
          />
        ))}
      </Svg>
      <Labels
        onPressLabel={(index: number) => {
          console.log('index', index);
        }}
        selected="candle"
        onChangeGraph={onChangeGraph}
      />
    </View>
  );
};
