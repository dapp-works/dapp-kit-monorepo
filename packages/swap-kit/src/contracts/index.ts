import { RootStore } from '@dappworks/kit';
import {
  WETH,
  UniswapFactory,
  ERC20,
  UniswapRouter,
  LPToken,
  MimoBasedCashier,
  UniswapV3Factory,
  SwapRouter02,
  UniswapV3Pool,
  NonfungiblePositionManager,
  SmartChefInitializable,
  XCashier,
  USDCSwapper,
  Permit2,
} from './abi';
import { Account, Chain, getContract, Transport, WalletClient } from 'viem';
import { WalletStore } from '@dappworks/kit/wallet';
import { AIem } from '@dappworks/kit/aiem';

export class Contracts {
  constructor() {}
  static get contractParams(): any {
    return {
      client: {
        public: AIem.PubClient('4689', {
          pollingInterval: 2500,
          multicall: {
            batchSize: 4_096,
            wait: 2000
          },
        }),
        wallet: RootStore.Get(WalletStore).walletClient as WalletClient<Transport, Chain, Account>,
      },
    };
  }
  static getContractParams(chainId?: number) {
    return {
      client: {
        public: AIem.PubClient('4689', {
          pollingInterval: 2500,
          multicall: {
            batchSize: 4_096,
            wait: 2000,
          }
        }),
        wallet: RootStore.Get(WalletStore).walletClient as WalletClient<Transport, Chain, Account>,
      },
    };
  }

  static 4689 = {
    UniswapFactory: { abi: UniswapFactory, address: '0xda257cBe968202Dea212bBB65aB49f174Da58b9D' as `0x${string}` },
    UniswapRouter: { abi: UniswapRouter, address: '0x147CdAe2BF7e809b9789aD0765899c06B361C5cE' as `0x${string}` },
    WETH: { abi: WETH, address: '0xA00744882684C3e4747faEFD68D283eA44099D03' as `0x${string}` },
    LPToken: { abi: LPToken, address: '0x68bf247e1F763cB157b2B5F1B927DFf4522723D5' as `0x${string}` },
    ERC20: { abi: ERC20, address: '0xdd62D172a0A5bfBbF0a44a4391907C470EDEa287' as `0x${string}` },
    MimoBasedCashier: { abi: MimoBasedCashier, address: '0x86Ad1621CCf4342fCdA9B8bEDdC4CEb9c844e0C2' as `0x${string}` },
    UniswapV3Factory: { abi: UniswapV3Factory, address: '0xF36788bF206f75F29f99Aa9d418fD8164b3B8198' as `0x${string}` },
    SwapRouter02: { abi: SwapRouter02, address: '0x850ceF3be10EaC2128D3959A9E2C8b9bcFFacb5b' as `0x${string}` },
    UniswapV3Pool: { abi: UniswapV3Pool, address: '0x81615407762c778e73BA56e7E3f5AbA7752e9d05' as `0x${string}` },
    NonfungiblePositionManager: { abi: NonfungiblePositionManager, address: '0x6aFD2d627cb163d1916d8Ca84BF9796294044ADf' as `0x${string}` },
    SmartChefInitializable: { abi: SmartChefInitializable, address: '0x9df1fe6ee31f991b2fcf9fc47497ad013afb4a00' as `0x${string}` },
    USDCSwapper: { abi: USDCSwapper, address: '0x47b9985f071b7127263dd5438c8b02aad47c16bd' as `0x${string}` },
    Permit2: { abi: Permit2, address: '0x000000000022D473030F116dDEE9F6B43aC78BA3' as `0x${string}` },
  };
  static 4690 = {
    UniswapFactory: { abi: UniswapFactory, address: '0xda257cBe968202Dea212bBB65aB49f174Da58b9D' as `0x${string}` },
    UniswapRouter: { abi: UniswapRouter, address: '0x95cB18889B968AbABb9104f30aF5b310bD007Fd8' as `0x${string}` },
    WETH: { abi: WETH, address: '0xff5fae9fe685b90841275e32c348dc4426190db0' as `0x${string}` },
    LPToken: { abi: LPToken, address: '' as `0x${string}` },
    ERC20: { abi: ERC20, address: '' as `0x${string}` },
    MimoBasedCashier: { abi: MimoBasedCashier, address: '' as `0x${string}` },
    UniswapV3Factory: { abi: UniswapV3Factory, address: '0x609bF2069652B6045A0eeb18224b44dD945929C9' as `0x${string}` },
    SwapRouter02: { abi: SwapRouter02, address: '' as `0x${string}` },
    UniswapV3Pool: { abi: UniswapV3Pool, address: '' as `0x${string}` },
    NonfungiblePositionManager: { abi: NonfungiblePositionManager, address: '0x9A7092444C42953213866e163A558FD8c704B30A' as `0x${string}` },
  };
  static 1 = {
    UniswapRouter: { abi: UniswapRouter, address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D' as `0x${string}` },
    ERC20: { abi: ERC20, address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' as `0x${string}` },
    UniswapV3Pool: { abi: UniswapV3Pool, address: '' as `0x${string}` },
    UniswapV3Factory: { abi: UniswapV3Factory, address: '0x1F98431c8aD98523631AE4a59f267346ea31F984' as `0x${string}` },
    NonfungiblePositionManager: { abi: NonfungiblePositionManager, address: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88' as `0x${string}` },
    XCashier: { abi: XCashier, address: '0xE58997B72cf7115701FC3302F36D38670924006B' as `0x${string}` },
  };
  static 137 = {
    UniswapRouter: { abi: UniswapRouter, address: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff' as `0x${string}` },
    ERC20: { abi: ERC20, address: '' as `0x${string}` },
    UniswapV3Pool: { abi: UniswapV3Pool, address: '' as `0x${string}` },
    UniswapV3Factory: { abi: UniswapV3Factory, address: '0x1F98431c8aD98523631AE4a59f267346ea31F984' as `0x${string}` },
    NonfungiblePositionManager: { abi: NonfungiblePositionManager, address: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88' as `0x${string}` },
    XCashier: { abi: XCashier, address: '0x6Ccf305A21DEFfF295e616bA5aa423eB563FC8dB' as `0x${string}` },
  };

  static 56 = {
    UniswapRouter: { abi: UniswapRouter, address: '0x10ED43C718714eb63d5aA57B78B54704E256024E' as `0x${string}` },
    ERC20: { abi: ERC20, address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' as `0x${string}` },
    UniswapV3Pool: { abi: UniswapV3Pool, address: '' as `0x${string}` },
    UniswapV3Factory: { abi: UniswapV3Factory, address: '0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7' as `0x${string}` },
    NonfungiblePositionManager: { abi: NonfungiblePositionManager, address: '0x7b8A01B39D58278b5DE7e48c8449c9f4F5170613' as `0x${string}` },
    XCashier: { abi: XCashier, address: '0xbe67986317Be59d0D031C28EA09d206aD16e2c57' as `0x${string}` },
  };

  static get current(): any {
    // const currentChainId = RootStore.Get(WalletStore).chain?.id;
    // if (currentChainId != 4690 && currentChainId != 4689 && currentChainId != 1 && currentChainId != 56) return Contracts[4689]
    return Contracts[4689];
  }

  static getContract = (chainId?: number) => {
    // console.log(Contracts[chainId || 4689])
    // if (!Contracts[chainId || 4689]) {
    //   return Contracts[4689];
    // }
    return Contracts[chainId || 4689];
  };

  static get xSwapCurrent(): any {
    const currentChainId = RootStore.Get(WalletStore).chain?.id;
    if (currentChainId == 4689) return Contracts[1];
    return Contracts[currentChainId || 1];
  }

  static get UniswapRouter(): any {
    return {
      ...getContract({ ...Contracts.current.UniswapRouter, ...Contracts.contractParams }),
      get: (address: `0x${string}`, chainId?: number) => {
        return getContract({ abi: Contracts.current.UniswapRouter.abi, address, ...this.getContractParams(chainId) });
      },
    };
  }

  static get SmartChefInitializable(): any {
    return {
      get: (address: `0x${string}`, chainId?: number) => {
        return getContract({ abi: SmartChefInitializable, address, ...this.getContractParams(chainId) });
      },
    };
  }

  static get UniswapV3Pool(): any {
    //only 4689
    return {
      get: (address: `0x${string}`, chainId: number = 4689) => {
        return getContract({ abi: UniswapV3Pool, address, ...this.getContractParams(chainId) });
      },
    };
  }

  static get UniswapV3Factory(): any {
    return {
      ...getContract({ ...Contracts[4689].UniswapV3Factory, ...this.getContractParams(4689) }),
      get: (address: `0x${string}`) => {
        return getContract({ abi: UniswapV3Factory, address, ...this.getContractParams(4689) });
      },
    };
  }

  static get NonfungiblePositionManager(): any {
    //only 4689
    return {
      ...getContract({ ...Contracts[4689].NonfungiblePositionManager, ...this.getContractParams(4689) }),
    };
  }

  static get UniswapFactory(): any {
    return {
      ...getContract({ ...Contracts.current.UniswapFactory, ...Contracts.contractParams }),
      get: (address: `0x${string}`, chainId?: number) => {
        return getContract({ abi: Contracts.current.UniswapFactory.abi, address, ...this.getContractParams(chainId) });
      },
    };
  }

  static get LPToken(): any {
    return {
      get: (address: `0x${string}`, chainId: number = 4689) => {
        return getContract({ abi: LPToken, address, ...this.getContractParams(chainId) });
      },
    };
  }

  static get WETH(): any {
    return {
      get: (address: `0x${string}`, chainId?: number) => {
        return getContract({ abi: WETH, address, ...this.getContractParams(chainId) });
      },
    };
  }

  static get USDCSwapper(): any {
    return {
      ...getContract({ ...Contracts.current.USDCSwapper, ...Contracts.contractParams }),
    };
  }

  static get ERC20(): any {
    return {
      ...getContract({ ...Contracts.current.ERC20, ...Contracts.contractParams }),
      get: (address: `0x${string}`, chainId?: number) => {
        return getContract({ abi: ERC20, address, ...this.getContractParams(chainId) });
      },
    };
  }

  static get Permit2(): any {
    return {
      ...getContract({ ...Contracts.current.Permit2, ...Contracts.contractParams }),
    };
  }

  static get XCashier(): any {
    return {
      ...getContract({ ...Contracts.xSwapCurrent.XCashier, ...Contracts.contractParams }),
      get: (chainId: number) => {
        return getContract({ abi: XCashier, address: this[chainId].XCashier.address, ...this.getContractParams(chainId) });
      },
    };
  }
}
