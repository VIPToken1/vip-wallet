/* eslint-disable camelcase */
import * as shape from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { Dimensions } from 'react-native';
import { parse } from 'react-native-redash';

// import data from './dataLine.json';
import { CHART_HEIGHT } from 'theme';

export const { width: SIZE } = Dimensions.get('window');

interface Amount {
  amount: string;
  currency: string;
  scale: string;
}

interface PercentChange {
  hour: number;
  day: number;
  week: number;
  month: number;
  year: number;
}

interface LatestPrice {
  amount: Amount;
  timestamp: string;
  percent_change: PercentChange;
}

type PriceList = [string, number][];

interface DataPoints {
  percent_change: number;
  prices: PriceList;
}

interface Prices {
  latest: string;
  latest_price: LatestPrice;
  hour: DataPoints;
  day: DataPoints;
  week: DataPoints;
  month: DataPoints;
  year: DataPoints;
  all: DataPoints;
  live: DataPoints;
}

const buildGraph = (datapoints: DataPoints, label: string) => {
  const priceList = datapoints;
  const formattedValues = priceList.map(
    price => [parseFloat(price[0]), price[1]] as [number, number]
  );
  const prices = formattedValues.map(value => value[0]);
  const dates = formattedValues.map(value => value[1]);
  const scaleX = scaleLinear()
    .domain([Math.min(...dates), Math.max(...dates)])
    .range([0, SIZE]);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const scaleY = scaleLinear()
    .domain([minPrice, maxPrice])
    .range([CHART_HEIGHT, 0]);
  return {
    label,
    minPrice,
    maxPrice,
    path: parse(
      shape
        .line()
        .x(([, x]) => scaleX(x) as number)
        .y(([y]) => scaleY(y) as number)
        .curve(shape.curveBasis)(formattedValues) as string
    )
  };
};

export const getGraphs = data =>
  [
    {
      label: 'LIVE',
      value: 0,
      data: buildGraph(data, 'Last Hour')
    },
    {
      label: '1D',
      value: 1,
      data: buildGraph(data, 'Last Hour')
    },
    {
      label: '1W',
      value: 7,
      data: buildGraph(data, 'Today')
    },
    {
      label: '1M',
      value: 30,
      data: buildGraph(data, 'Last Month')
    },
    {
      label: '3M',
      value: 90,
      data: buildGraph(data, 'Last Month')
    },
    {
      label: '1Y',
      value: 365,
      data: buildGraph(data, 'This Year')
    },
    {
      label: 'All',
      value: 'max',
      data: buildGraph(data, 'All time')
    }
  ] as const;

export type GraphIndex = 0 | 1 | 2 | 3 | 4;
