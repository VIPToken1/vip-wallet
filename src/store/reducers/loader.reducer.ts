import { START_LOADER, STOP_LOADER } from '../actionTypes';

const loaderStatus = (state = { isLoading: false }, action = {}) => {
  const { type, isLoading } = action;
  switch (type) {
    case START_LOADER:
      return { ...state, isLoading };
    case STOP_LOADER:
      return { ...state, isLoading };
    default:
      return state;
  }
};

export default loaderStatus;
