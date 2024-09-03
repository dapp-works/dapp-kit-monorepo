export type NetworkObject = {
  name: string;
  chainId: number;
  rpcUrl: string;
  logoUrl: string;
  explorerUrl: string;
  explorerName: string;
  nativeCoin: string;
  type: 'mainnet' | 'testnet';
};

export type WalletTransactionHistoryType = {
  chainId: number;
  tx?: string;
  msg: string;
  timestamp: number;
  type: 'Approve' | 'Swap' | 'Liquidity' | 'Transfer';
  status: 'loading' | 'success' | 'fail';
};

export type AddressMode = 'io' | '0x';
