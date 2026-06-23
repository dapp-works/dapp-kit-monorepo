import { PromiseState, RootStore, Store } from '@dappworks/kit';
import { visibilityAwareInterval } from '../lib/visibility';
import { WalletStore } from '@dappworks/kit/wallet';
import axios from 'axios';
import { useEffect } from 'react';
import { ERC20, ERC20Service, wrappedToken } from '../contracts/erc20';
import { StorageState } from '../standard/StorageState';
import BigNumber from 'bignumber.js';
import { UniswapService, UniswapServiceConfig, pair } from '../contracts/uniswapService';
import { Contracts } from '../contracts';
import { isAddress, zeroAddress, maxUint256 } from 'viem';
import { _ } from '../lib/lodash';
import { DialogStore, PromiseStateGroup, ToastPlugin } from '@dappworks/kit/plugins';
import { SwapUI, SwapConfig } from './ui';
import pDebounce from 'p-debounce';
import { helper } from '../lib/helper';
import { TokenInputStore } from './tokenInput';
import { cache } from '@dappworks/kit/utils';
import { PromiseHook } from '../contract';
import { makeAutoObservable, reaction } from 'mobx';
import { Permit2 } from '../contracts/permit2';
import { publicConfig } from '../config/public';
type RemoteTokenType = {
  rank_point: number;
  is_official: boolean;
  total_liquidity_usd: number;
  weight: number;
  is_depin_token: boolean;
  address: `0x${string}`;
  logo: string;
  name: string;
  symbol: string;
  decimals: number;
  market_cap: number;
  current_price: number;
  tags: string[];
  custom: {
    [key: string]: any;
  };
};

export enum SWAP_SDK {
  UNISWAP_UNIVERSAL_ROUTER = 'UNISWAP_UNIVERSAL_ROUTER',
  UNISWAP_SMART_ROUTER = 'UNISWAP_SMART_ROUTER',
  UNISWAP_SMART_ROUTER_V2 = 'UNISWAP_SMART_ROUTER_V2',
  UNISWAP_SMART_ROUTER_V3 = 'UNISWAP_SMART_ROUTER_V3',
  UNISWAP_V2 = 'UNISWAP_V2',
}
export type SwapResponseBaseType = {
  amount: string;
  withSlippageAmount: string;
  path: `0x${string}`[];
  pathERC20: ERC20[];
  priceImpact: number;
  protocol: string;
  type?: string;
};
export type SmartRouterResponseType = SwapResponseBaseType & {
  originData: any | null;
};
export type UniswapV2ResponseType = SwapResponseBaseType & {
  value: bigint | null;
  swapMethod: string;
  swapParams: (bigint | `0x${string}` | `0x${string}`[])[];
};

export const SWAP_SDK_LIST = [
  {
    value: SWAP_SDK.UNISWAP_SMART_ROUTER,
    text: 'Mimo Smart Router',
  },
  {
    value: SWAP_SDK.UNISWAP_V2,
    text: 'Mimo v2',
  },
];

export class MimoStore implements Store {
  sid = 'MimoStore';
  debounceUpdatePrice = pDebounce(this.updatePrice, 300);
  priceRequestCounter = 0; // Track the latest price request
  private quoteCache = new Map<string, { data: SmartRouterResponseType | UniswapV2ResponseType; expiresAt: number }>();
  private static QUOTE_CACHE_TTL_MS = 30_000;
  localERC20Addresses = new StorageState({ key: 'localERC20Addresses' });
  recentSearches = new StorageState({
    key: 'recentSearches',
    default: [] as string[],
  });
  // swapSDK: SWAP_SDK = SWAP_SDK.UNISWAP_SMART_ROUTER;
  // v2,v3,mixed
  smartRouterProtocol = new StorageState({ key: 'smartRouterProtocol', default: 'v2,v3,mixed', value: 'v2,v3,mixed' });
  swapType = new StorageState({
    key: 'swapType-3',
    default: SWAP_SDK.UNISWAP_SMART_ROUTER,
    value: SWAP_SDK.UNISWAP_SMART_ROUTER
  });
  get isSmartRouter() {
    return this.swapType.value == SWAP_SDK.UNISWAP_SMART_ROUTER || this.swapType.value == SWAP_SDK.UNISWAP_SMART_ROUTER_V2 || this.swapType.value == SWAP_SDK.UNISWAP_SMART_ROUTER_V3 || this.swapType.value == SWAP_SDK.UNISWAP_UNIVERSAL_ROUTER
  }
  get swapResultParams() {
    if (this.isSmartRouter) {
      return this.onCalcPriceFromSmartRouter.value;
    }
    if (this.swapType.value == SWAP_SDK.UNISWAP_V2) {
      return this.onCalcPriceFromUniswapV2.value;
    }
  }
  get swapSDKText() {
    return SWAP_SDK_LIST.find((i) => i.value == this.swapType.value)?.text;
  }
  get tokenInput() {
    return RootStore.Get(TokenInputStore);
  }
  constructor(args?: Partial<MimoStore>) {
    Object.assign(this, args);
    makeAutoObservable(this, { quoteCache: false } as any);
  }
  get chainId() {
    return 4689;
  }
  get wallet() {
    return RootStore.Get(WalletStore);
  }
  get wrappedTokenAddress(): `0x${string}` {
    return wrappedToken[this.chainId];
  }
  get hasWToken() {
    if (this.tokenInput.fromToken?.isWrapped && this.tokenInput.toToken?.isEther) {
      return 'Unwrap-WIOTX';
    } else if (this.tokenInput.toToken?.isWrapped && this.tokenInput.fromToken?.isEther) {
      return 'Wrap-IOTX';
    } else if (this.tokenInput.fromToken?.address.toLowerCase() == '0x3b2bf2b523f54c4e454f08aa286d03115aff326c' && this.tokenInput.toToken?.address.toLowerCase() == '0xcdf79194c6c285077a58da47641d4dbe51f63542') {
      return 'Wrap-USDC'
    } else if (this.tokenInput.fromToken?.address.toLowerCase() == '0xcdf79194c6c285077a58da47641d4dbe51f63542' && this.tokenInput.toToken?.address.toLowerCase() == '0x3b2bf2b523f54c4e454f08aa286d03115aff326c') {
      return 'Unwrap-USDC.e'
    }
    else {
      return null;
    }
  }


  get priceA() {
    return helper.number.numberFormat(Number(this.tokenInput.toAmount.format) / Number(this.tokenInput.fromAmount.format), '0,0.0000', { fallback: '-' });
  }

  get priceB() {
    return helper.number.numberFormat(Number(this.tokenInput.fromAmount.format) / Number(this.tokenInput.toAmount.format), '0,0.0000', { fallback: '-' });
  }

  get minReceive() {
    return (
      helper.number.warpBigNumber(this.swapResultParams?.withSlippageAmount as string, this.tokenInput.toToken?.decimals.value, { format: '0,0.0000' }).format +
      ` ${this.tokenInput.toToken?.symbol.value}`
    );
  }

  get maxSold() {
    return (
      helper.number.warpBigNumber(this.swapResultParams?.withSlippageAmount as string, this.tokenInput.fromToken?.decimals.value, { format: '0,0.0000' }).format +
      ` ${this.tokenInput.fromToken?.symbol.value}`
    );
  }

  get liquidityFee() {
    return helper.number.warpBigNumber(this.tokenInput.fromAmount.value.times(0.003).toString(), this.tokenInput.fromToken?.decimals.value).format + ` ${this.tokenInput.fromToken?.symbol.value}`;
  }


  get swapState() {
    return this.tokenInput.baseCheckState(() => {
      const swapButtonText = (this.swapResultParams as SmartRouterResponseType)?.originData?.type == 'WRAP_CURRENCY' ? 'Wrap' : (this.swapResultParams as SmartRouterResponseType)?.originData?.type == 'UNWRAP_CURRENCY' ? 'Unwrap' : 'Swap';
      return {
        msg: swapButtonText,
        isDisabled: this.tokenInput.fromAmount.loading || this.tokenInput.toAmount.loading,
        onClick: async () => {
          let routerAddress;
          if (this.isSmartRouter) {
            const params = (this.swapResultParams as SmartRouterResponseType)?.originData?.methodParameters;
            routerAddress = params.to;
          } else {
            routerAddress = Contracts.getContract(this.chainId).UniswapRouter.address;
          }

          let group: PromiseState<any, any>[] = [this.tokenInput.fromToken!.approve, this.onSwap];
          let groupOptions = [
            {
              args: [routerAddress, this.tokenInput.fromAmount.value.toFixed(0)],
              title: <div>Approve {this.tokenInput.fromToken!.symbol.value}</div>,
            },
            {
              args: [],
              title: (
                <div>
                  {swapButtonText}ing {this.tokenInput.fromAmount.format} {this.tokenInput.fromToken?.symbol.value} for {this.tokenInput.toAmount.format} {this.tokenInput.toToken?.symbol.value} ...
                </div>
              ),
            },
          ];

          if (this.swapType.value == SWAP_SDK.UNISWAP_UNIVERSAL_ROUTER && !this.tokenInput.fromToken?.isEther) {
            group = [this.tokenInput.fromToken!.approve, Permit2.signPermit, this.onSwap];
            groupOptions = [
              {
                args: [Permit2.address, maxUint256.toString()],
                title: <div>Approve {this.tokenInput.fromToken!.symbol.value} to Permit</div>,
              },
              {
                args: [(this.swapResultParams as SmartRouterResponseType)?.originData?.permitData],
                title: <div>Sign Permit for {this.tokenInput.fromToken!.symbol.value}</div>,
              },
              {
                args: [],
                title: (
                  <div>
                    {swapButtonText}ing {this.tokenInput.fromAmount.format} {this.tokenInput.fromToken?.symbol.value} for {this.tokenInput.toAmount.format} {this.tokenInput.toToken?.symbol.value} ...
                  </div>
                ),
              },
            ];
          }

          const promiseStateGroup = new PromiseStateGroup({
            group,
            groupOptions
          });
          await promiseStateGroup.callWithDialog({
            size: 'sm',
            title: 'Swap',
          }, undefined, undefined, false);
        },
      };
    });
  }



  onSwapperUSDC = new PromiseState({
    function: async (type: 'wrap' | 'unwrap') => {
      let group: PromiseState<any, any>[] = []
      if (type == 'wrap') {
        group = [this.tokenInput.fromToken!.approve, this.onDepositeUSDC]
      } else {
        group = [this.tokenInput.fromToken!.approve, this.onWithdrawUSDC]
      }
      const promiseStateGroup = new PromiseStateGroup({
        group,
        groupOptions: [
          {
            args: [Contracts.USDCSwapper.address, this.tokenInput.fromAmount.value.toFixed(0)],
            title: <div>Approve {this.tokenInput.fromToken!.symbol.value}</div>,
          },
          {
            args: [this.tokenInput.fromAmount.value.toFixed(0)],
            title: (
              <div>
                {type == 'wrap' ? 'Wrapping' : 'Unwrapping'} {this.tokenInput.fromAmount.format} {this.tokenInput.fromToken?.symbol.value} for {this.tokenInput.toAmount.format} {this.tokenInput.toToken?.symbol.value} ...
              </div>
            ),
          },
        ],
      });
      await promiseStateGroup.callWithDialog({
        size: 'md',
        title: 'Swap',
      }, undefined, undefined, false);
    },
  });


  onDepositeUSDC = new PromiseState({
    function: async (amount: string) => {
      return await WalletStore.SendTx({
        showSuccessDialog: true,
        chainId: this.chainId,
        historyItem: {
          msg: `Wrapped ${this.tokenInput.fromToken?.symbol.value} to ${this.tokenInput.toToken?.symbol.value}`,
          type: 'Swap',
        },
        tx: async () => {
          return Contracts.USDCSwapper.write.deposit([BigInt(amount)]);
        },
      });
    },
  });

  onWithdrawUSDC = new PromiseState({
    function: async (amount: string) => {
      return await WalletStore.SendTx({
        showSuccessDialog: true,
        chainId: this.chainId,
        historyItem: {
          msg: `Unwrapped ${this.tokenInput.fromToken?.symbol.value} to ${this.tokenInput.toToken?.symbol.value}`,
          type: 'Swap',
        },
        tx: async () => {
          return Contracts.USDCSwapper.write.withdraw([BigInt(amount)]);
        },
      });
    },
  });

  onDepositeETH = new PromiseState({
    function: async (amount: string) => {
      return await WalletStore.SendTx({
        showSuccessDialog: true,
        chainId: this.chainId,
        historyItem: {
          msg: `Wrapped ${this.tokenInput.fromToken?.symbol.value} to ${this.tokenInput.toToken?.symbol.value}`,
          type: 'Swap',
        },
        loadingText: `Wrapping ${this.tokenInput.fromToken?.symbol.value} to ${this.tokenInput.toToken?.symbol.value}`,
        tx: async () => {
          return Contracts.WETH.get(this.wrappedTokenAddress, this.chainId).write.deposit({ value: BigInt(amount) });
        },
      });
    },
  });

  onWithdrawETH = new PromiseState({
    function: async (amount: string) => {
      return await WalletStore.SendTx({
        showSuccessDialog: true,
        chainId: this.chainId,
        historyItem: {
          msg: `Unwrapped ${this.tokenInput.toToken?.symbol.value} to ${this.tokenInput.fromToken?.symbol.value}`,
          type: 'Swap',
        },
        loadingText: `Unwrapping ${this.tokenInput.toToken?.symbol.value} to ${this.tokenInput.fromToken?.symbol.value}`,
        tx: async () => {
          return Contracts.WETH.get(this.wrappedTokenAddress, this.chainId).write.withdraw([BigInt(amount)]);
        },
      });
    },
  });

  tokenList = PromiseHook.wrap<() => Promise<ERC20[]>>({
    func: async () => {
      try {
        const res = await ERC20Service.tokenList({ network: 'iotex' });
        let token_list_v4: RemoteTokenType[];
        if (this.chainId == 4689) {
          token_list_v4 = res.filter((i) => i.is_depin_token || i.is_official || i.total_liquidity_usd > 1000);
        } else {
          token_list_v4 = res.filter((i) => i.address != '0x0000000000000000000000000000000000001010');
        }

        //@ts-ignore
        const tokenList = await Promise.all(
          token_list_v4
            .sort((a, b) => b.rank_point - a.rank_point)
            .slice(0, 100)
            .filter((i) => !!i.address)
            .map(
              async (i) =>
                await ERC20.Get({
                  args: {
                    chainId: this.chainId,
                    address: i.address,
                    is_depin_token: i.is_depin_token,
                    is_official: i.is_official,
                    logo: i.logo,
                    rank_point: isNaN(i.rank_point) ? 0 : i.rank_point,
                    price: i.current_price || null,
                    custom: i.custom,
                    _name: i.name,
                    _symbol: i.symbol,
                    total_liquidity_usd: i.total_liquidity_usd,
                  },
                }),
            ),
        );
        const mainToken = await ERC20.Get({ args: { chainId: this.chainId, address: zeroAddress, is_official: true } });
        let localTokens: ERC20[] = [];
        if (this.localERC20Addresses.value && this.localERC20Addresses.value?.[this.chainId]) {
          localTokens = await Promise.all(this.localERC20Addresses.value?.[this.chainId]?.map(async (i) => await ERC20.Get({ args: { chainId: this.chainId, address: i, isLocal: true } })));
        }
        const tokens = [mainToken, ...localTokens, ...tokenList];
        tokens
          .sort((a, b) => {
            // Always put native token (ETHER) at top
            if (a.isEther || b.isEther) {
              return a.isEther ? -1 : 1;
            }
            // Then sort by whether balance is greater than 0
            const aHasBalance = Number(a.balanceUSD.value) > 0;
            const bHasBalance = Number(b.balanceUSD.value) > 0;
            if (aHasBalance !== bHasBalance) {
              return bHasBalance ? 1 : -1;
            }
            // Then sort by rank point
            if (a.rank_point !== b.rank_point) {
              return b.rank_point - a.rank_point;
            }
            // Finally sort by balance USD
            return Number(b.balanceUSD.value) - Number(a.balanceUSD.value);
          });

        return tokens;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
  });


  async onLoadUrlAddress(address0: string, address1: string, callbackFn: (fromToken: ERC20 | undefined, toToken: ERC20 | undefined) => void) {
    return new Promise(async (resolve, reject) => {
      try {
        //fix issuse frist loading page ,force fresh
        if (this.tokenInput.isAmountLoading) return;
        const getExistToken = async (addressOrSymbol: string | `0x${string}`) => {
          await this.tokenList.get();
          let NativeToken = this.tokenList?.value?.filter((token) => {
            if (addressOrSymbol.startsWith('0x')) {
              return token.address.toLowerCase() == addressOrSymbol.toLowerCase();
            } else {
              return token.symbol.value.toLowerCase() == addressOrSymbol.toLowerCase();
            }
          })?.[0];
          return NativeToken;
        };
        if (!address0 && !address1) return;
        let unkownFromToken: ERC20 | null = null;
        let unkownToToken: ERC20 | null = null;
        let maybeFromToken: ERC20 | undefined;
        let maybeToToken: ERC20 | undefined;

        if (address0) {
          maybeFromToken = await getExistToken(address0);
          // Only fetch an unknown token on-chain when the URL segment is a real
          // address. A symbol (e.g. "IOTX") or any non-address value would be cast
          // straight into viem and throw InvalidAddressError from a fire-and-forget
          // priceUSD/balance read once the bogus token gets selected.
          if (!maybeFromToken && isAddress(address0)) {
            unkownFromToken = await ERC20.Get({ args: { address: address0, chainId: this.chainId } });
          }
        }

        if (address1) {
          maybeToToken = await getExistToken(address1);
          if (!maybeToToken && isAddress(address1)) {
            unkownToToken = await ERC20.Get({ args: { address: address1, chainId: this.chainId } });
          }
        }

        //todo: fix import unkowntoken
        if (unkownFromToken || unkownToToken) {
          const unkownTokens = [unkownFromToken, unkownToToken].filter((i) => i?.symbol.value) as ERC20[];
          const ImportTokenModal = SwapUI.components?.ImportTokenModal;
          if (unkownTokens.length > 0 && ImportTokenModal) {
            RootStore.Get(DialogStore).setData({
              title: 'Unknown Token',
              content: <ImportTokenModal tokens={unkownTokens} />,
              isOpen: true,
            });
          }
        }
        callbackFn(maybeFromToken ?? ((unkownFromToken ?? undefined) as ERC20), maybeToToken ?? ((unkownToToken ?? undefined) as ERC20));
        resolve(true);
      } catch (error) {
        console.log(error);
        reject(false);
      }
    });
  }

  onSaveTokenToLocal(tokenAddress: `0x${string}`) {
    if (!this.localERC20Addresses.value || this.localERC20Addresses.value?.[this.chainId]) {
      this.localERC20Addresses.setValue({ [this.chainId]: [tokenAddress] });
      return;
    }
    const v = this.localERC20Addresses.value;
    if (v?.[this.chainId]) {
      if (!v?.[this.chainId].includes(tokenAddress)) {
        this.localERC20Addresses.setValue({ [this.chainId]: [...v[this.chainId], tokenAddress] });
      }
    }
  }
  get handleToken() {
    if (this.isSmartRouter) {
      return {
        // https://github.com/Uniswap/v3-periphery/blob/main/contracts/base/PeripheryPayments.sol#L58
        from: this.tokenInput.fromToken?.isEther ? this.tokenInput.fromToken?.symbol.value : this.tokenInput.fromToken?.address,
        to: this.tokenInput.toToken?.isEther ? this.tokenInput.toToken?.symbol.value : this.tokenInput.toToken?.address,
        fromDecimals: this.tokenInput.fromToken?.decimals.value,
        toDecimals: this.tokenInput.toToken?.decimals.value,
      };
    } else {
      return {
        from: this.tokenInput.fromToken?.isEther ? this.tokenInput.fromToken?.symbol.value : this.tokenInput.fromToken?.address || this.tokenInput.fromToken?.symbol,
        to: this.tokenInput.toToken?.isEther ? this.tokenInput.toToken?.symbol.value : this.tokenInput.toToken?.address || this.tokenInput.toToken?.symbol,
        fromDecimals: this.tokenInput.fromToken?.decimals.value,
        toDecimals: this.tokenInput.toToken?.decimals.value,
      };
    }
  }

  async updatePrice() {
    const wallet = RootStore.Get(WalletStore);
    if (!this.tokenInput.fromToken || !this.tokenInput.toToken) return;
    if (this.tokenInput.amountSide == 'from' && this.tokenInput.fromAmount.format == '') {
      this.tokenInput.toAmount.setFormat('');
    }
    if (this.tokenInput.amountSide == 'to' && this.tokenInput.toAmount.format == '') {
      this.tokenInput.fromAmount.setFormat('');
    }

    // Increment request counter for this new request
    const currentRequestId = ++this.priceRequestCounter;

    try {
      if (this.tokenInput.amountSide == 'from' && this.tokenInput.fromAmount.value.isGreaterThan(0)) {
        // if (this.hasWToken) {
        //   this.tokenInput.toAmount.setValue(this.tokenInput.fromAmount.value);
        //   return;
        // }
        const sellParams = {
          //@ts-ignore
          sellToken: this.handleToken.from,
          //@ts-ignore
          buyToken: this.handleToken.to,
          sellTokenDecimals: this.handleToken?.fromDecimals,
          buyTokenDecimals: this.handleToken?.toDecimals,
          sellAmount: this.tokenInput.fromAmount.value.toFixed(0, 1),
          buyAmount: '',
          recipient: wallet.account ? wallet.account : zeroAddress,
          maxDelay: 120,
          slippagePercentage: 1 / 100,
          lpFee: 0,
        };
        let swapRes;
        this.tokenInput.toAmount.loading = true;
        if (this.isSmartRouter) {
          //@ts-ignore
          swapRes = await this.onCalcPriceFromSmartRouter.call(sellParams);
        } else {
          //@ts-ignore
          swapRes = await this.onCalcPriceFromUniswapV2.call(sellParams);
        }
        if (swapRes.amount) {
          this.tokenInput.toAmount.setDecimals(this.tokenInput.toToken.decimals.value);
          this.tokenInput.toAmount.setValue(new BigNumber(swapRes.amount));
        }
        return swapRes
      }
      if (this.tokenInput.amountSide == 'to' && this.tokenInput.toAmount.value.isGreaterThan(0)) {
        // if (this.hasWToken) {
        //   this.tokenInput.fromAmount.setValue(this.tokenInput.toAmount.value);
        //   return;
        // }
        this.tokenInput.fromAmount.loading = true;
        const buyParams = {
          //@ts-ignore
          sellToken: this.handleToken.from,
          //@ts-ignore
          buyToken: this.handleToken.to,
          sellTokenDecimals: this.handleToken?.fromDecimals,
          buyTokenDecimals: this.handleToken?.toDecimals,
          sellAmount: '',
          buyAmount: this.tokenInput.toAmount.value.toFixed(0, 1),
          recipient: wallet.account,
          maxDelay: 120,
          slippagePercentage: 1 / 100,
          lpFee: 0,
        };
        console.log('buyParams', buyParams);
        let swapRes;
        if (this.isSmartRouter) {
          try {
            //@ts-ignore
            swapRes = await this.onCalcPriceFromSmartRouter.call(buyParams);
          } catch (error) {
            console.log(error);
          }
        } else {
          //@ts-ignore
          swapRes = await this.onCalcPriceFromUniswapV2.call(buyParams);
        }
        if (swapRes.amount) {
          this.tokenInput.fromAmount.setValue(new BigNumber(swapRes.amount));
        }
        return swapRes
      }
      return null;
    } catch (err) {
      return null;
    }
  }

  onHandleSwapError() {
    this.tokenInput.clearFormatAndRefreshBalance();
    RootStore.Get(ToastPlugin).error('May be due to price fluctuations, please try to increase slippage percentage');
    const SettingModal = SwapUI.components?.SettingModal;
    RootStore.Get(DialogStore).setData({
      title: 'Settings',
      content: SettingModal ? <SettingModal /> : null,
      isOpen: true,
      className: 'bg-cardBg pb-4',
    });
  }

  onHandleUpdatePriceError() {
    this.tokenInput.clearFormat();
    // RootStore.Get(ToastPlugin).error('Price acquisition error, please check liquidity or network');
    this.tokenInput.toAmount.loading = false;
    this.tokenInput.fromAmount.loading = false;
    return
  }

  onSwap = new PromiseState({
    function: async () => {
      return new Promise(async (resolve, reject) => {
        switch (this.isSmartRouter) {
          case true:
            const smartRouterRes = this.swapResultParams as SmartRouterResponseType;
            let params = smartRouterRes?.originData?.methodParameters;
            if (!params) return;
            if (params.recipient.toLowerCase() != this.wallet.account?.toLowerCase()) {
              this.updatePrice()
              return RootStore.Get(ToastPlugin).error('Invalid recipient address.Please retry.');
            }
            try {
              const swapButtonText = (this.swapResultParams as SmartRouterResponseType)?.type == 'WRAP_CURRENCY' ? 'Wrap' : (this.swapResultParams as SmartRouterResponseType)?.originData?.type == 'UNWRAP_CURRENCY' ? 'Unwrap' : 'Swap';
              if (this.swapType.value == SWAP_SDK.UNISWAP_UNIVERSAL_ROUTER && !this.tokenInput.fromToken?.isEther) {
                params = (await this.updatePrice())?.originData?.methodParameters
              }
              console.log(params.calldata, 'params')
              await WalletStore.SendRawTx({
                showSuccessDialog: true,
                historyItem: {
                  msg: `${swapButtonText} ${this.tokenInput.fromAmount.format} ${this.tokenInput.fromToken?.symbol.value} for ${this.tokenInput.toAmount.format} ${this.tokenInput.toToken?.symbol.value}`,
                  type: 'Swap',
                },
                chainId: this.chainId,
                address: params?.to as string,
                value: params?.value,
                data: params?.calldata as string,
                autoAlert: false,
                onError: (error) => {
                  if (error.message.toLowerCase().includes('cancel') || error.message.toLowerCase().includes('rejected')) {
                    reject(new Error('Transaction Cancelled'));
                  } else {
                    reject(new Error(error.message));
                  }
                }
              });
              this.tokenInput.clearFormatAndRefreshBalance();
              Permit2.clearSignature()
              resolve(true);
              // } else {
              //   throw new Error('Transaction simulation failed');
              // }
            } catch (e) {
              console.log(e);
              this.onHandleSwapError();
              Permit2.clearSignature()
              reject(new Error("Swap Failed"));
            }
            break;
          case false:
            try {
              const res = this.onCalcPriceFromUniswapV2.value;
              await WalletStore.SendTx({
                showSuccessDialog: true,
                historyItem: {
                  msg: `Swapped ${this.tokenInput.fromAmount.format} ${this.tokenInput.fromToken?.symbol.value} for ${this.tokenInput.toAmount.format} ${this.tokenInput.toToken?.symbol.value}`,
                  type: 'Swap',
                },
                // loadingText: `Swaping ${this.tokenInput.fromAmount.format} ${this.tokenInput.fromToken?.symbol.value} for ${this.tokenInput.toAmount.format} ${this.tokenInput.toToken?.symbol.value} ...`,
                chainId: this.chainId,
                tx: () => Contracts.UniswapRouter.write[res?.swapMethod as string](res?.swapParams, res?.value ? { value: res.value } : null),
              });
              this.tokenInput.clearFormatAndRefreshBalance();
              resolve(true);
              break;
            } catch (e) {
              this.onHandleSwapError();
              resolve(false);
            }
        }
      });
    },
  });

  onCalcPriceFromSmartRouter = new PromiseState({
    loadingLock: false,
    function: async ({
      sellToken,
      buyToken,
      sellTokenDecimals,
      buyTokenDecimals,
      sellAmount,
      buyAmount,
      recipient,
    }: {
      sellToken: string;
      buyToken: string;
      sellTokenDecimals: number;
      buyTokenDecimals: number;
      sellAmount: string;
      buyAmount: string;
      recipient: `0x${string}`;
    }): Promise<SmartRouterResponseType | UniswapV2ResponseType | null> => {
      try {
        let swapTypeParams = {}
        if (this.swapType.value == SWAP_SDK.UNISWAP_UNIVERSAL_ROUTER) {
          swapTypeParams = {
            swapType: 'UNIVERSAL_ROUTER',
            ...(Permit2.signature ? { signature: Permit2.signature } : {}),
            ...(Permit2.permitData ? { permitData: Permit2.permitData } : {}),
          }
        }
        const requestBody = {
          chainId: this.chainId,
          protocols: this.smartRouterProtocol.value,
          ...swapTypeParams,
          token0: {
            address: sellAmount ? sellToken : buyToken,
            decimals: sellAmount ? sellTokenDecimals : buyTokenDecimals,
          },
          token1: {
            address: sellAmount ? buyToken : sellToken,
            decimals: sellAmount ? buyTokenDecimals : sellTokenDecimals,
          },
          recipient: recipient ?? zeroAddress,
          amount: sellAmount ? sellAmount : buyAmount,
          slippage: {
            numerator: this.tokenInput.settingModal.slippage.value * 100,
            denominator: 10000,
          },
          tradeType: sellAmount ? 'EXACT_INPUT' : 'EXACT_OUTPUT',
        };
        const cacheKey = JSON.stringify(requestBody);
        const now = Date.now();
        const cached = this.quoteCache.get(cacheKey);
        if (cached && cached.expiresAt > now) {
          return cached.data;
        }
        //https://github.com/Uniswap/smart-order-router/issues/484
        const { data: route } = await axios.post(SwapConfig.value.quoteApiUrl, requestBody);
        const path = route?.route?.[0]?.tokenPath.map((i) => i.address) as `0x${string}`[];

        const result: SmartRouterResponseType | UniswapV2ResponseType = {
          amount: route?.quote.numerator as string,
          withSlippageAmount: new BigNumber(route?.quote.numerator ?? 0).multipliedBy(sellAmount ? 1 - this.tokenInput.slippagePercent : 1 + this.tokenInput.slippagePercent).toFixed(3),
          path,
          pathERC20: await Promise.all(path?.map((i) => ERC20.Get({ args: { address: i, chainId: this.chainId }, select: { symbol: true, tokenUrl: true } }))),
          priceImpact: Number(route?.trade?.priceImpact),
          protocol: route?.route?.[0]?.protocol ?? '',
          originData: route,
        };
        this.quoteCache.set(cacheKey, { data: result, expiresAt: now + MimoStore.QUOTE_CACHE_TTL_MS });
        return result;
      } catch (e) {
        console.log(e, 'onCalcPriceFromSmartRouter error');
        this.onHandleUpdatePriceError();
        return null;
      }
    },
  });

  onCalcPriceFromUniswapV2 = new PromiseState({
    loadingLock: false,
    function: async ({
      sellToken,
      buyToken,
      sellAmount,
      buyAmount,
      recipient,
      maxDelay = 120,
      slippagePercentage,
      lpFee = 0.003,
    }: {
      sellToken: `0x${string}`;
      buyToken: `0x${string}`;
      sellAmount: string;
      buyAmount: string;
      recipient: `0x${string}`;
      maxDelay;
      slippagePercentage;
      lpFee;
    }): Promise<UniswapV2ResponseType | null> => {
      try {
        // console.log({
        //   sellToken,
        //   buyToken,
        //   sellAmount,
        //   buyAmount,
        //   recipient,
        //   maxDelay,
        //   slippagePercentage,
        //   lpFee,
        // });
        const { eTokens, provider } = UniswapService.config[this.chainId] as UniswapServiceConfig;
        let isFeeToken = false;
        const isSell = sellAmount ? true : false;
        let amount = new BigNumber(isSell ? sellAmount : buyAmount);
        const sellTokenAddress = eTokens.map[sellToken]?.address || (sellToken as `0x${string}`);
        const buyTokenAddress = eTokens.map[buyToken]?.address || (buyToken as `0x${string}`);
        if (slippagePercentage > 0.02) {
          isFeeToken = true;
        }
        //@ts-ignore
        // const [sellDecimals, buyDecimals] = await Promise.all([sellTokenAddress, buyTokenAddress].map((i) => Contracts.ERC20.get(i).read.decimals()));

        const path = [sellTokenAddress, buyTokenAddress];
        let pairs = [
          { path },
          ...eTokens.set.map((i) => ({
            path: _.uniq([path[0], i.address, path[1]]),
          })),
        ];

        let bestPair: pair;

        const bestPairs = await Promise.all(
          provider.set.map((i) =>
            //@ts-ignore
            UniswapService.getBestTrade({ provider: i, isSell, amount: amount.toFixed(0, 1), pairs, swapAddress: i.address, chainId: this.chainId }),
          ),
        );
        // console.log(bestPairs)
        if (isSell) {
          bestPair = _.maxBy(bestPairs, (i) => i.amount) as pair;
        } else {
          bestPair = _.minBy(bestPairs, (i) => i.amount) as pair;
        }

        const deadline = Math.floor(Date.now() / 1000) + maxDelay;
        const safetyAmount = isSell
          ? new BigNumber(bestPair.amount).multipliedBy(1 - slippagePercentage).toFixed(0, 1)
          : new BigNumber(bestPair.amount).multipliedBy(1 + slippagePercentage).toFixed(0, 1);

        const originAmount = new BigNumber(bestPair.amount).toFixed(0, 1);

        const amountIn = isSell ? sellAmount : safetyAmount;
        const amountOut = isSell ? safetyAmount : buyAmount;
        const bestPath = bestPair.path;

        let swapMethod = isSell ? 'swapExactTokensForTokens' : 'swapTokensForExactTokens';
        let swapParams = isSell ? [BigInt(amountIn), BigInt(amountOut), bestPath, recipient, BigInt(deadline)] : [BigInt(amountOut), BigInt(amountIn), bestPath, recipient, BigInt(deadline)];
        if (isFeeToken) {
          swapMethod = 'swapExactTokensForTokensSupportingFeeOnTransferTokens';
        }
        if (eTokens.map[sellToken]?.isNativeToken) {
          swapMethod = isSell ? 'swapExactETHForTokens' : 'swapETHForExactTokens';
          swapParams = isSell ? [amountOut, bestPath, recipient, deadline] : [amountOut, bestPath, recipient, deadline];
        }
        if (eTokens.map[buyToken]?.isNativeToken) {
          swapMethod = isSell ? 'swapExactTokensForETH' : 'swapTokensForExactETH';
          swapParams = isSell ? [amountIn, amountOut, bestPath, recipient, deadline] : [amountOut, amountIn, bestPath, recipient, deadline];
          //For special treatment requiring fee like ioShib
          if (isFeeToken) {
            swapMethod = isSell ? 'swapExactTokensForETHSupportingFeeOnTransferTokens' : 'swapTokensForExactETH';
          }
        }

        const midPrice = await UniswapService.getMidPrice({ address: bestPair?.provider?.address as `0x${string}`, path: bestPair.path, chainId: this.chainId });

        const exactQuote = midPrice.multipliedBy(isSell ? sellAmount : originAmount);

        const priceImpact = exactQuote
          .minus(isSell ? originAmount : buyAmount)
          .div(exactQuote)
          .minus(lpFee)
          .multipliedBy(100)
          .toFixed(5);

        return {
          // provider: { ...bestPair.provider },
          amount: originAmount,
          withSlippageAmount: safetyAmount,
          path: bestPath,
          pathERC20: await Promise.all(bestPath.map((i) => ERC20.Get({ args: { address: i, chainId: this.chainId } }))),
          priceImpact: Number(priceImpact),
          // sellTokenAddress,
          // buyTokenAddress,
          protocol: 'v2',
          value: eTokens.map[sellToken]?.isNativeToken ? BigInt(amountIn) : null,
          swapMethod,
          swapParams,
        };
      } catch (e) {
        console.log(e);
        this.onHandleUpdatePriceError();
        return null;
      }
    },
  });

  loadAllData() {
    this.tokenList.call();
  }

  use() {
    useEffect(() => {
      return visibilityAwareInterval(() => this.loadAllData(), 15000);
    }, []);

    useEffect(() => {
      this.debounceUpdatePrice()
    }, [RootStore.Get(WalletStore).account]);

    reaction(
      () => RootStore.Get(WalletStore).updateTicker,
      async (val) => {
        this.loadAllData();
        this.debounceUpdatePrice()
      },
    );
  }

  addToRecentSearches(token: ERC20) {
    const searches = this.recentSearches.value || [];
    const newSearches = [
      token.address,
      ...searches.filter(addr => addr.toLowerCase() !== token.address.toLowerCase())
    ].slice(0, 5); // Keep only last 5 searches
    this.recentSearches.setValue(newSearches);
  }
}
