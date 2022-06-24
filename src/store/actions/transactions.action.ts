import * as api from 'config/api';
import { BigNumber } from 'ethers';
import { last } from 'lodash';
import abiDecoder from 'abi-decoder';
import {
  GET_TRANSACTION_HISTORY_FAILED,
  GET_TRANSACTION_HISTORY_REQUEST,
  GET_TRANSACTION_HISTORY_SUCCESS
} from 'store/actionTypes';
import routerAbi from 'utils/token/routerAbi.json';

abiDecoder.addABI(routerAbi);

export const parseTxnData = (tx: any, walletAddress: string) => {
  const decodedValue = abiDecoder.decodeMethod(tx.input);
  const methodName = decodedValue?.name;

  const isSent = BigNumber.from(tx.from).eq(BigNumber.from(walletAddress));

  tx.isSent = isSent;
  tx.isContractTx = tx.contractTx?.length > 0;

  if (methodName) {
    if (methodName === 'swapExactTokensForETHSupportingFeeOnTransferTokens') {
      tx.txMethod = 'Swap VIP to BNB';
      tx.txAmount = decodedValue?.params[0].value;
      tx.credit = 'BNB';
      tx.txType = 'Swap';
    } else if (methodName === 'swapExactETHForTokens') {
      tx.txMethod = 'Swap BNB to VIP';
      tx.txAmount = decodedValue?.params[0].value;
      tx.credit = 'VIP';
      tx.txType = 'Swap';
    }
  } else {
    tx.txMethod = isSent ? 'Transfer' : 'Received';
    tx.txType = isSent ? 'Transfer' : 'Received';
    tx.txAmount = tx.value;
    tx.credit = tx.contractTx?.length ? 'VIP' : 'BNB';
  }

  return tx;
};

export const parseTxnHistory = (txn: any, walletAddress: string) => {
  let result: any = [];

  txn.forEach((tx: any) => {
    const decodedValue = abiDecoder.decodeMethod(tx.input);
    const txValue = tx.value;
    const isSent = BigNumber.from(tx.from).eq(BigNumber.from(walletAddress));

    const methodName = decodedValue?.name;

    tx.isSent = isSent;
    tx.isContractTx = tx.contractTxn?.length > 0;
    // tx = { ...tx, ...contractTx }; // merge contractTx to tx

    if (methodName) {
      if (methodName === 'swapExactTokensForETHSupportingFeeOnTransferTokens') {
        const lastInternalTxn = last(tx.internalTxn) as any;
        tx.txMethod = 'Swap VIP to BNB';

        tx.txAmount = decodedValue?.params[0].value;
        tx.swapAmount = lastInternalTxn?.value;
        // tx.txAmount = lastInternalTxn?.value ?? decodedValue?.params[0].value;
        tx.credit = 'BNB';
        tx.txType = 'Swap';
        tx.isSent = isSent;

        result.push(tx);
      } else if (methodName === 'swapExactETHForTokens') {
        const lastInternalTxn = last(tx.contractTxn) as any;
        tx.txMethod = 'Swap BNB to VIP';
        tx.txAmount = txValue;
        tx.swapAmount = lastInternalTxn?.value;
        // tx.txAmount = decodedValue?.params[0].value;
        tx.credit = 'VIP';
        tx.txType = 'Swap';
        tx.isSent = isSent;

        result.push(tx);
      }
    } else {
      tx.isSent = isSent;
      tx.txMethod = isSent ? 'Transfer' : 'Received';
      tx.txType = isSent ? 'Transfer' : 'Received';
      tx.txAmount = tx.value;
      // tx.credit = contractTx ? 'VIP' : 'BNB';
      tx.credit = tx.contractTxn?.length ? 'VIP' : 'BNB';

      result.push(tx);
    }
  });

  // result = result.filter((item: any) => item.value > 0);

  return result.sort((a: any, b: any) => b.timeStamp - a.timeStamp);
};

/**
 * @deprecated use parseTxnHistory instead
 * @param txn
 * @param contractTxn
 * @param walletAddress
 * @returns
 */
const mergeTransactions = (
  txn: any[],
  contractTxn: any[],
  walletAddress: string
): any[] => {
  let result: any = [];

  txn.forEach(tx => {
    const contractTx = contractTxn.find(ct => ct.hash === tx.hash) || {};
    const decodedValue = abiDecoder.decodeMethod(tx.input);
    const txValue = tx.value;
    const isSent = BigNumber.from(tx.from).eq(BigNumber.from(walletAddress));

    const methodName = decodedValue?.name;
    tx = { ...tx, ...contractTx }; // merge contractTx to tx

    if (methodName) {
      if (methodName === 'swapExactTokensForETHSupportingFeeOnTransferTokens') {
        tx.txMethod = 'Swap VIP to BNB';
        tx.txAmount = decodedValue?.params[0].value;
        tx.credit = 'BNB';
        tx.txType = 'Swap';
        tx.isSent = isSent;

        result.push(tx);
      } else if (methodName === 'swapExactETHForTokens') {
        tx.txMethod = 'Swap BNB to VIP';
        tx.txAmount = txValue;
        tx.credit = 'VIP';
        tx.txType = 'Swap';
        tx.isSent = isSent;

        result.push(tx);
      }
    } else {
      tx.isSent = isSent;
      tx.txMethod = isSent ? 'Transfer' : 'Received';
      tx.txType = isSent ? 'Transfer' : 'Received';
      tx.txAmount = tx.value;
      tx.credit = contractTx ? 'VIP' : 'BNB';

      result.push(tx);
    }
  });

  result = result.filter((item: any) => item.value > 0);

  return result.sort((a: any, b: any) => b.blockNumber - a.blockNumber);
};

export const getTransactionHistoryAction =
  (walletAddress: string, contractAddress?: string) =>
  async (dispatch: any) => {
    try {
      dispatch({ type: GET_TRANSACTION_HISTORY_REQUEST });
      const responseTx = await api.getTransactionHistoryApi(
        walletAddress,
        contractAddress,
        'coin'
      );
      const responseToken = await api.getTransactionHistoryApi(
        walletAddress,
        contractAddress,
        'contract'
      );
      const allTransactions = mergeTransactions(
        responseTx.data.result,
        responseToken.data.result,
        walletAddress
      );
      if (responseTx.data.status !== '1') {
        throw new Error('Error in fetching transaction history');
      }
      dispatch({
        type: GET_TRANSACTION_HISTORY_SUCCESS,
        payload: { [walletAddress]: allTransactions }
      });
    } catch (error) {
      console.log('error getting txn history', error);
      dispatch({ type: GET_TRANSACTION_HISTORY_FAILED, payload: { error } });
    }
  };

// BACKEND API
export const saveTransactionAction = (data: any) => async () => {
  try {
    const response = await api.saveTxApi(data);
    console.log('Transaction saved successfully', response.data);
  } catch (error: any) {
    console.log('Error while saving txn', error);
  }
};

export const getTransactionsAction =
  (walletAddress: string) => async (dispatch: any) => {
    try {
      dispatch({
        type: GET_TRANSACTION_HISTORY_REQUEST,
        payload: { walletAddress }
      });
      const response = await api.getTxApi(walletAddress);

      const allTransactions = parseTxnHistory(response.data, walletAddress);
      dispatch({
        type: GET_TRANSACTION_HISTORY_SUCCESS,
        payload: { [walletAddress]: allTransactions }
      });
    } catch (error: any) {
      console.log('Error while saving txn', error);
      dispatch({
        type: GET_TRANSACTION_HISTORY_FAILED,
        payload: { error: error?.response?.data ?? error?.toString() }
      });
    }
  };
