import Web3 from 'web3';
import { ethers } from 'ethers';
import ContractWBNBABI from './token/wbnbAbi.json';
import ContractVIPABI from './token/vipTokenAbi.json';
import ContractTestABI from './token/abi.json';
import ContractRouterABI from './token/routerAbi.json';
import ContractNewRouterABI from './token/newRouterAbi.json';
import {
  WBNB_ADDRESS,
  TEST_TOKEN_ADDRESS,
  VIP_TOKEN_ADDRESS,
  ROUTER
} from '../constants/index';
import NETWORKS from 'config/networks';

export type IAvaialablePair = keyof typeof CONTRACTS;

export enum SwapType {
  WBNB_VIP = 'WBNB_VIP',
  VIP_WBNB = 'VIP_WBNB',
  WBNB_TEST = 'WBNB_TEST',
  TEST_WBNB = 'TEST_WBNB'
}

const CONTRACTS = {
  [WBNB_ADDRESS]: {
    abi: ContractWBNBABI,
    address: WBNB_ADDRESS,
    decimals: 18
  },
  [TEST_TOKEN_ADDRESS]: {
    abi: ContractTestABI,
    address: VIP_TOKEN_ADDRESS,
    decimals: 18
  },
  [VIP_TOKEN_ADDRESS]: {
    abi: ContractVIPABI,
    address: VIP_TOKEN_ADDRESS,
    decimals: 9
  }
};

let web3 = new Web3(
  new Web3.providers.HttpProvider(NETWORKS.get('BSC_MAINNET').rpcUrl)
);
const provider = new ethers.providers.Web3Provider(web3.currentProvider as any);

export const getRouterContract = (signer: ethers.Signer): ethers.Contract => {
  const routerContract = new ethers.Contract(ROUTER, ContractRouterABI, signer);
  return routerContract;
};

export const getWBNBContract = (signer: ethers.Signer): ethers.Contract => {
  const wbnbContract = new ethers.Contract(
    WBNB_ADDRESS,
    ContractWBNBABI,
    signer
  );
  return wbnbContract;
};

export const getVIPContract = (signer: ethers.Signer): ethers.Contract => {
  const vipContract = new ethers.Contract(
    VIP_TOKEN_ADDRESS,
    ContractVIPABI,
    signer
  );
  return vipContract;
};

export const getTestContract = (signer: ethers.Signer): ethers.Contract => {
  const testContract = new ethers.Contract(
    TEST_TOKEN_ADDRESS,
    ContractTestABI,
    signer
  );
  return testContract;
};

export const getSwapPairs = (
  pair: [IAvaialablePair, IAvaialablePair],
  privateKey: string
) => {
  try {
    const wallet = new ethers.Wallet(privateKey, provider);
    const signer = wallet.connect(provider);

    const wbnbIndex = pair.indexOf(WBNB_ADDRESS);

    const token0 = CONTRACTS[pair[0]] as any;
    const token1 = CONTRACTS[pair[1]] as any;

    token0.contract = new ethers.Contract(token0.address, token0.abi, signer);
    token1.contract = new ethers.Contract(token1.address, token1.abi, signer);
    return [token0, token1];
  } catch (error) {
    console.log('error gettings swap pairs ', error);
    return [];
  }
};

export const calculateDeadline = (minutes: number) =>
  Date.now() + 1000 * 60 * minutes;

export const getAmountsOut = async (
  privateKey: string,
  pair: any,
  amount: string,
  slippage: number = 12
) => {
  try {
    const [token0, token1] = pair;
    if (!amount || Number(amount) === 0) {
      // return [];
      return { result: [amount, '0'] };
    }

    const wallet = new ethers.Wallet(privateKey, provider);
    const signer = wallet.connect(provider);

    const amountIn = ethers.utils.parseUnits(amount, token0.decimals);
    console.log('amountIn', amount, token0.decimals, amountIn);

    const routerContract = getRouterContract(signer);
    const amountOut = await routerContract.getAmountsOut(amountIn, [
      token0.address,
      token1.address
    ]);
    const amountOutMin = amountOut[1].sub(amountOut[1].div(slippage));

    console.log('IN amount :', ethers.utils.formatEther(amountIn));
    console.log('OUT min amount :', ethers.utils.formatEther(amountOutMin));

    const result = [
      (amountOut[0].toString() / 10 ** token0.decimals).toFixed(6),
      (amountOut[1].toString() / 10 ** token1.decimals).toFixed(12)
    ];
    console.log('OUT result :', result);
    return { result };
  } catch (error: any) {
    console.log('error calculating amountsOut ', error.reason, error);
    return { message: error.reason, isError: true };
  }
};

const getNewRouterContract = (signer: ethers.Signer) => {
  const routerContract = new ethers.Contract(
    ROUTER,
    ContractNewRouterABI,
    signer
  );
  return routerContract;
};

export const swapNewBNBtoVIP = async (
  privateKey: string,
  pair: any[],
  amount: string,
  config: { deadline: number; gasLimit: number; slippage: number } = {
    deadline: 10,
    gasLimit: 450000,
    slippage: 12
  }
) => {
  try {
    const BNBAmount = ethers.utils.parseEther(amount).toHexString();

    const wallet = new ethers.Wallet(privateKey);
    const account = wallet.connect(provider);

    const router = getNewRouterContract(account);

    const path = [WBNB_ADDRESS, VIP_TOKEN_ADDRESS];

    const amounts = await router.getAmountsOut(BNBAmount, path);
    const amountOutMin = amounts[1].sub(amounts[1].div(config.slippage ?? 12));
    const tx = await router.swapExactETHForTokens(
      amountOutMin, // need to pass in a value that will reflect a slippage tolerance
      path,
      wallet.address,
      calculateDeadline(config.deadline),
      {
        // gasLimit: config.gasLimit,
        value: BNBAmount
      }
    );
    console.log('Swapping BNB for tokens...');
    const receipt = await tx.wait();
    console.log(`Transaction hash: ${receipt.transactionHash}`);

    console.log('===============================');
    console.log();
    console.log('[SUCCESS] swap BNB to VIP receipt:', receipt);
    console.log();
    console.log('===============================');
    return { receipt };
  } catch (error: any) {
    console.log('[ERROR] swap BNB to VIP receipt:', error.reason, error);
    return { message: error?.reason, isError: true, error };
  }
};

export const swapNewVIPtoBNB = async (
  privateKey: string,
  pair: any[],
  amount: string,
  config: { deadline: number; gasLimit: number; slippage: number } = {
    deadline: 10,
    gasLimit: 450000,
    slippage: 12
  }
) => {
  try {
    const VIPAmount = ethers.BigNumber.from(String(amount)).mul(10 ** 9);

    const wallet = new ethers.Wallet(privateKey);
    const account = wallet.connect(provider);

    const router = getNewRouterContract(account);

    const path = [VIP_TOKEN_ADDRESS, WBNB_ADDRESS];

    const amounts = await router.getAmountsOut(VIPAmount, path);
    const amountOutMin = amounts[1].sub(amounts[1].div(config.slippage ?? 12));

    const vipContract = getVIPContract(account);

    const approveTx = await vipContract.approve(ROUTER, VIPAmount);
    let receipt = await approveTx.wait();
    console.log('===============================');
    console.log();
    console.log(receipt);
    console.log();
    console.log('===============================');

    const tx = await router.swapExactTokensForETHSupportingFeeOnTransferTokens(
      VIPAmount,
      amountOutMin,
      path,
      wallet.address,
      calculateDeadline(config.deadline),
      { gasLimit: config.gasLimit }
    );
    console.log('Swapping VIP for BNB...');
    receipt = await tx.wait();
    console.log(`Transaction hash: ${receipt.transactionHash}`);

    console.log('===============================');
    console.log();
    console.log('[SUCCESS] swap VIP to BNB receipt: ', receipt);
    console.log();
    console.log('===============================');

    return { receipt };
  } catch (error: any) {
    console.log('[ERROR] executing swap for BNB....... ', error);
    return { message: error.reason, isError: true, error };
  }
};
