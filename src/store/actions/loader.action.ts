import * as type from '../actionTypes';

export const startLoader = () => ({
  type: type.START_LOADER,
  isLoading: true
});

export const stopLoader = () => ({
  type: type.STOP_LOADER,
  isLoading: false
});
