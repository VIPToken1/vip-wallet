import React, { FC } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { FactoryComponentProps, ScrollView } from 'native-base';

interface ILayoutProps extends FactoryComponentProps {
  style?: ViewStyle;
  scrollEnabled?: boolean;
}

const Layout: FC<ILayoutProps> = ({
  children,
  style,
  scrollEnabled,
  ...rest
}) => {
  return (
    <ScrollView
      style={styles.scrollView}
      scrollEnabled={scrollEnabled}
      alwaysBounceVertical={false}
      _contentContainerStyle={{ ...styles.container, ...style, ...rest }}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 35
  }
});

Layout.defaultProps = {
  scrollEnabled: true,
  style: {}
};

export default Layout;
