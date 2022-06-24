import { io } from 'socket.io-client';
import { store } from 'store/store';
import * as actionTypes from 'store/actionTypes';

const socket = io('ws://127.0.0.1:8000');

socket.on('connect', () => {
  console.log('[SOCKET]: Connected ', socket.connected);

  setTimeout(() => {
    getCoinDetails();
  }, 5e2);
});

socket.on('ping', () => {
  console.log('[SOCKET]: Ping');
  socket.emit('pong');
});

socket.on('connect_error', error => {
  console.log('[SOCKET]: Connection Error ', error);
});

socket.on('disconnect', () => {
  console.log('[SOCKET]: Disconnected ');
});

socket.on('coin_details', data => {
  console.log('[SOCKET]: Coin details ', data);
  store.dispatch({
    type: actionTypes.GET_COIN_DETAILS_SUCCESS,
    payload: data
  });
});

socket.on('market_data', data => {
  console.log('[SOCKET]: Market data ', data);
  store.dispatch({
    type: actionTypes.GET_MARKET_DATA_SUCCESS,
    payload: data
  });
});

export const getMarketData = () =>
  socket.emit('market_data', {
    address: '0x6759565574De509b7725ABb4680020704B3F404e'
  });
export const getCoinDetails = () =>
  socket.emit('coin_details', {
    address: '0x6759565574De509b7725ABb4680020704B3F404e'
  });
