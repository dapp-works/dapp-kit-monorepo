import { iotex as _iotex, iotexTestnet as _iotexTestnet, type Chain } from "viem/chains";

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
  type: string;
  status: 'loading' | 'success' | 'fail';
};

export type AddressMode = 'io' | '0x';

export const iotex = {
  iconUrl: 'https://cdn-dapp-works.s3.us-east-1.amazonaws.com/1dd84d927ae959c508392be62e6eb549.png',
  ..._iotex,
} as Chain;
export const iotexTestnet = {
  iconUrl: 'https://cdn-dapp-works.s3.us-east-1.amazonaws.com/1dd84d927ae959c508392be62e6eb549.png',
  ..._iotexTestnet,
} as Chain;;