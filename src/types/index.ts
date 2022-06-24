export type PhraseType = '12' | '24';

export type EntropyType = 16 | 32; // 12 words or 24 words

export type Preference = 'public' | 'private';

export type WalletProtectionType =
  | 'pin'
  | 'fingerprint'
  | 'faceid'
  | 'biometrics'
  | null
  | undefined;

export enum WalletProtectionTypeEnum {
  PIN = 'pin',
  FINGERPRINT = 'fingerprint',
  FACEID = 'faceid',
  BIOMETRICS = 'biometrics'
}

export enum BackupType {
  NONE = 'none',
  MANUAL = 'manual',
  ICLOUD = 'icloud',
  GOOGLE = 'google'
}

export type IAppLockPreferences = {
  lockMethod: WalletProtectionType;
  isBiometricEnabled: boolean;
  appLock: boolean;
  transactionLock: boolean;
  biometricChangeProtection: boolean;
};

export type WalletBackupType = {
  isBackup: boolean;
  backupAt: number;
  backupType: BackupType | null;
};

export enum SwapSpeeds {
  STD = 'STD',
  FAST = 'FAST',
  LIGHTNING = 'LIGHTNING'
}

export type ISwapData = {
  contractAddress: string;
  amount?: string;
  name?: string;
  symbol?: string;
  decimals?: number;
  balance?: string;
  currentPrice?: string;
};

// ************************ REDUCER TYPES ************************ //
export type ISwapState = {
  isLoading: boolean;
  error: any;
  timestamp: number;
  slippage: number;
  speed: SwapSpeeds;
  txnTime: number;
};

// ************************ API RESPONSE ************************ //
export type RegisterRequest = {
  username: string;
  deviceId: string;
};

export type IBEPToken = {
  address: string;
  symbol: string;
  name?: string;
  decimals: number;
  balance?: string;
  totalSupply?: number;
  type?: 'contract' | 'coin';
};
