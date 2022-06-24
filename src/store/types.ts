import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { store } from './store';

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;
