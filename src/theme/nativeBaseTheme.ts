import { extendTheme, themeTools } from 'native-base';
import { Colors } from './colors';

export const vipTheme = extendTheme({
  components: {
    Text: {
      baseStyle: props => {
        return {
          color: themeTools.mode('white', 'black')(props),
          selectionColor: themeTools.mode('white', 'black')(props),
          fontWeight: 'normal'
        };
      }
    },
    Checkbox: {
      baseStyle: {
        colorScheme: 'green'
      }
    },
    Input: {
      baseStyle: {
        placeholderTextColor: Colors.PLACEHOLDER
      }
    }
  }
});

export default vipTheme;
