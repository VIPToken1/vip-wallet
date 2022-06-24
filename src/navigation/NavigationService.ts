import React, { MutableRefObject } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

export const isReadyRef = React.createRef<MutableRefObject<boolean>>();

export const navigationRef =
  React.createRef<NavigationContainerRef<RootStackParamList>>();

export const navigate = (
  name: keyof RootStackParamList,
  params: { [key: string]: any }
): void => {
  if (isReadyRef.current && navigationRef.current) {
    // @ts-ignore
    navigationRef.current.navigate(name, params);
  } else {
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
  }
};
