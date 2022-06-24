import { Dimensions, PixelRatio } from 'react-native';

export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;

//widthPercentage to DP
const wpToDp = widthPercent => {
  // Convert string input to decimal number
  const elemWidth = parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};

//height Percentage to DP
const hpToDp = heightPercent => {
  // Convert string input to decimal number
  const elemHeight = parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};

const IPHONE_6_HEIGHT = 1334;
const IPHONE_6_WIDTH = 750;
export const pixH = (pixel: number): number =>
  hpToDp((pixel / IPHONE_6_HEIGHT) * 100);
export const pixW = (pixel: number): number =>
  wpToDp((pixel / IPHONE_6_WIDTH) * 100);

const ptToPx = 1.11;

export const pt = (val: number): number => pixH(val * ptToPx); // hpToDp(pixH(val*ptToPx))

export const h1 = pt(50);
export const h2 = pt(46);
export const h3 = pt(32);
export const h4 = pt(26);
export const h5 = pt(20);

export const CHART_HEIGHT = screenHeight / 3;
