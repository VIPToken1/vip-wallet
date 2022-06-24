import React, { FC, ReactNode } from 'react';
import { TextStyle } from 'react-native';
import { Text, ITextProps } from 'native-base';
import MaskedView from '@react-native-community/masked-view';
import LinearGradient from 'react-native-linear-gradient';

interface IGradientTextProps extends ITextProps {
  children: string | ReactNode;
  style?: TextStyle;
}

const GradientText: FC<IGradientTextProps> = props => {
  return (
    <MaskedView maskElement={<Text {...props} />}>
      <LinearGradient
        colors={['#E60C8D', '#F4577E', '#FF905B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text {...props} style={[props.style, { opacity: 0 }]} />
      </LinearGradient>
    </MaskedView>
  );
};
export default GradientText;
