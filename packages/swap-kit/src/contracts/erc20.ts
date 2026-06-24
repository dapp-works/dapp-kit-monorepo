import { BigNumberInputState, PromiseState, RootStore } from '@dappworks/kit';
import { WalletStore } from '@dappworks/ui-kit/wallet';
import axios from 'axios';
import { _ } from '../lib/lodash';
import { hooks } from '../lib/hooks';
import BigNumber from 'bignumber.js';
import DataLoader from 'dataloader';
import { Contracts } from '.';
import { PromiseHook } from '../contract';
import { zeroAddress } from 'viem';
import { makeAutoObservable } from 'mobx';
import { helper } from '../lib/helper';
import { Token } from '@uniswap/sdk-core';
import { cache } from "@dappworks/kit/utils";
import { publicConfig } from '../config/public';

export const wrappedToken = {
  1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  56: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  137: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
  4689: '0xa00744882684c3e4747faefd68d283ea44099d03',
  4690: '0xff5fae9fe685b90841275e32c348dc4426190db0',
};
export class ERC20 {
  address: `0x${string}` = '0x';
  wrappedAddress?: `0x${string}` = '0x';
  is_depin_token = false;
  is_official = false;
  rank_point = 0;
  isLocal = false;
  logo: string = '';
  price: string | number | null = null;
  total_liquidity_usd: number = 0;
  custom: {
    [key: string]: any;
  } = {};
  _symbol: string = '';
  _name: string = '';
  decimalsValue: number | null = null;
  balanceValue: any = null;

  chainId = 4689;
  get id() {
    return `ERC20-${this.chainId}-${this.address}`;
  }
  get isEther() {
    return this.address === zeroAddress;
  }
  get isWrapped() {
    const wrappedAddress = Object.values(wrappedToken);
    return wrappedAddress.some((i) => i.toLowerCase() == this.address.toLowerCase());
  }
  get wrappedToMainTokenSymbol() {
    if (this.isWrapped) {
      switch (this.chainId) {
        case 1:
          return 'ETH';
        case 56:
          return 'BNB';
        case 137:
          return 'MATIC';
        case 4689:
          return 'IOTX';
      }
      return 'IOTX';
    } else {
      return this.symbol.value;
    }
  }
  get wrappedToMainTokenUrl() {
    if (this.isWrapped) {
      switch (this.chainId) {
        case 1:
          return 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png';
        case 56:
          return 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png';
        case 137:
          return 'https://coingecko-proxy.iopay.me/coins/images/4713/large/polygon.png?1698233745';
        case 4689:
          return 'https://cdn.iotex.io/tokens/iotex.svg';
      }
      return 'https://cdn.iotex.io/tokens/iotex.svg';
    } else {
      return this.tokenUrl;
    }
  }

  get isDepinToken() {
    return this.is_depin_token;
  }

  get tokenUrl() {
    try {
      const LogoMap = {
        1: {
          '0x0000000000000000000000000000000000000000': 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        },
        56: {
          '0x0000000000000000000000000000000000000000': 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
        },
        137: {
          '0x0000000000000000000000000000000000000000': 'https://coingecko-proxy.iopay.me/coins/images/4713/large/polygon.png?1698233745',
        },
        4689: {
          '0x0000000000000000000000000000000000000000': 'https://cdn.iotex.io/tokens/iotex.svg',
        },
        4690: {
          '0x0000000000000000000000000000000000000000': 'https://cdn.iotex.io/tokens/iotex.svg',
        },
      };
      if (this.logo && this.chainId != 4689) {
        return this.logo;
      }
      return LogoMap[this.chainId][this.address] || `https://gateway.mimo.exchange/api/image/${this.address}`;
    } catch (error) {
      return 'https://cdn.iotex.io/tokens/iotex.svg'; // https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png
    }
  }

  get UniswapSDKTokenInstance() {
    if (this.isEther) {
      const wrappedAddress = wrappedToken?.[this.chainId];
      return new Token(this.chainId, wrappedAddress, this.decimals.value, this.symbol.value, this.name.value);
    }
    return new Token(this.chainId, this.address, this.decimals.value, this.symbol.value, this.name.value);
  }

  constructor(args: Partial<ERC20>) {
    Object.assign(this, args);
    makeAutoObservable(this);
  }

  name = PromiseHook.wrap({
    func: async () => {
      if (this._name) return this._name;
      if (this.address === zeroAddress) {
        switch (this.chainId) {
          case 1:
            return 'ETH';
          case 56:
            return 'BNB';
          case 137:
            return 'MATIC';
          case 4689:
            return 'IoTeX';
        }
        return 'IoTeX';
      }
      return cache.wrap(
        `erc20-${this.chainId}-${this.address}-name`,
        async () => {
          try {
            return await Contracts.ERC20.get(this.address, this.chainId).read.name();
          } catch (error) {
            return '';
          }
        },
        { ttl: 31536000 * 1000 },
      );
    },
  });

  priceUSD = PromiseHook.wrap({
    func: async (useRealTime = false) => {
      if (useRealTime) {
        const res = await axios.get(`${publicConfig.MIMO_GATEWAY_API_URL}/v2_token_price?token=${this.isEther ? this.UniswapSDKTokenInstance.address.toLowerCase() : this.address.toLowerCase()}`);
        if (!res.data) {
          const v3Res = await axios.get(`${publicConfig.MIMO_GATEWAY_API_URL}/v3_token_price?token=${this.isEther ? this.UniswapSDKTokenInstance.address.toLowerCase() : this.address.toLowerCase()}`);
          return v3Res.data
        }
        return res.data
      }
      return this.price || ERC20Service.getToken({ address: this.address.toLowerCase() }).then((i) => i?.current_price);
    },
  });

  symbol = PromiseHook.wrap({
    func: async () => {
      if (this._symbol) return this._symbol;
      if (this.address === zeroAddress) {
        switch (this.chainId) {
          case 1:
            return 'ETH';
          case 56:
            return 'BNB';
          case 137:
            return 'MATIC';
          case 4689:
            return 'IOTX';
        }
        return 'IOTX';
      }
      // console.log(`erc20-${wallet.curRpc.value}-${this.chainId}-${this.address}-symbol`)
      const res = await cache.wrap(
        `erc20-${this.chainId}-${this.address}-symbol`,
        async () => {
          try {
            return await Contracts.ERC20.get(this.address, this.chainId).read.symbol();
          } catch (error) {
            console.log(error);
            return '';
          }
        },
        { ttl: 31536000 * 1000 },
      );
      return res;
    },
  });

  decimals = PromiseHook.wrap({
    func: async () => {
      if (this.decimalsValue !== null) return this.decimalsValue;
      return cache.wrap(
        `erc20-${this.chainId}-${this.address}-decimals`,
        async () => {
          const useMainToken = this.address === zeroAddress;
          if (useMainToken) {
            return 18;
          }
          try {
            return await Contracts.ERC20.get(this.address, this.chainId).read.decimals();
          } catch (error) {
            return 18;
          }
        },
        { ttl: 31536000 * 1000 },
      );
    },
  });

  balance = PromiseHook.wrap({
    func: async () => {
      if (this.balanceValue !== null) return this.balanceValue;
      const wallet = RootStore.Get(WalletStore);
      if (!wallet.account) return helper.number.warpBigNumber('0', 18);
      const useMainToken = this.address === zeroAddress;
      if (useMainToken) {
        const balance = await wallet.balance.get();
        return helper.number.warpBigNumber(balance?.value?.toString() ?? '0', 18, { format: '0,0.000' });
      }

      try {
        const res = await Contracts.ERC20.get(this.address, this.chainId).read.balanceOf([wallet.account]);
        const decimals = await this.decimals.get();
        return helper.number.warpBigNumber(res?.toString(), Number(decimals), { format: '0,0.000' });
      } catch (error) {
        // console.log(error)
        return helper.number.warpBigNumber('0', 18);
      }
    },
  });

  balanceUSD = PromiseHook.wrap({
    func: async () => {
      const wallet = RootStore.Get(WalletStore);
      if (!wallet.account) return '0';

      const [balance, priceUSD] = await Promise.all([this.balance.get(), this.priceUSD.get()]);
      return helper.number.numberFormat(Number(balance.originFormat) * Number(priceUSD), '0,0.000', { fallback: '0' });
    },
  });

  approve = new PromiseState({
    function: async (spender: `0x${string}`, amount: string, tokenAddress?: `0x${string}`) => {
      console.log('approve', spender, amount.toString(), tokenAddress);
      try {
        if (!tokenAddress) {
          tokenAddress = this.address;
        }
        const useMainToken = tokenAddress === zeroAddress;
        if (useMainToken) {
          return true;
        }
        await hooks.waitAccount(this.chainId);
        const ERC20 = Contracts.ERC20.get(tokenAddress);
        const account = RootStore.Get(WalletStore).account;
        const [allowance, decimals] = await Promise.all([ERC20.read.allowance([account, spender]), ERC20.read.decimals()]);
        // Ensure amount is an integer string without decimals
        const _amount = BigInt(new BigNumber(amount).toFixed(0))
        console.log(allowance, _amount, allowance == _amount, allowance < _amount);
        if (allowance > BigInt(11579208923731619542357098500868790785326)) {
          return true
        }
        if (allowance == _amount) {
          return true;
        }
        if (allowance < _amount) {
          await WalletStore.SendTx({
            autoAlert: false,
            chainId: this.chainId,
            historyItem: {
              msg: 'Approve for ' + this.symbol.value,
              type: 'Approve',
            },
            tx: () => ERC20.write.approve([spender, BigInt(new BigNumber(amount).toFixed(0))]),
          });
          return true;
        }
        return true;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  });

  transfer = new PromiseState({
    function: async (to: `0x${string}`, amount: string) => {
      if (this.address === zeroAddress) {
        await WalletStore.SendRawTx({
          chainId: this.chainId,
          historyItem: {
            msg: `Transfer ${new BigNumber(amount).dividedBy(10 ** 18).toString()} ${this.symbol.value}`,
            type: 'Transfer',
          },
          loadingText: `Transfering ${new BigNumber(amount).dividedBy(10 ** 18).toString()} ${this.symbol.value}`,
          data: null,
          value: amount,
          address: to,
        });
        return;
      }
      await hooks.waitAccount(this.chainId);
      const ERC20 = Contracts.ERC20.get(this.address, this.chainId);
      await this.decimals.get();
      await WalletStore.SendTx({
        chainId: this.chainId,
        historyItem: {
          msg: `Transfer ${new BigNumber(amount).dividedBy(10 ** this.decimals.value).toString()} ${this.symbol.value}`,
          type: 'Transfer',
        },
        loadingText: `Transfering ${new BigNumber(amount).dividedBy(10 ** this.decimals.value).toString()} ${this.symbol.value}`,
        tx: () => ERC20.write.transfer([to, BigInt(amount)]),
      });
    },
  });

  static Get = PromiseHook.Get(ERC20);
}

export class ERC20Service {

  static tokenList = async ({ network = 'iotex' }) => {
    return cache.wrap(
      `tokenList-${network}`,
      async () => {
        try {
          const res = await axios.get(`https://api.iopay.me/api/rest/token_list/${network}`);
          return res.data.token_list_v4;
        } catch (error) {
          console.log(error);
          return [];
        }
      },
      { ttl: 15 * 1000 },
    );
  };

  static tokenLoader = new DataLoader(async (ids: string[]) => {
    const res: any = await ERC20Service.tokenList({ network: 'iotex' });
    const data = _.keyBy(res, 'address');
    return ids.map((i) => data[i] || ({} as (typeof data)[0]));
  });
  static async getToken({ address }: { address: string }) {
    // for test
    const addressMap = {
      '0x0000000000000000000000000000000000000000': '0xa00744882684c3e4747faefd68d283ea44099d03',
      '0x180dC617701A507239659215D19FA142eD3B91A7': '0x236f8c0a61da474db21b693fb2ea7aab0c803894',
      '0x96dC256Ea343ae8b13999C73562e5D6B457a8501': '0xa00744882684c3e4747faefd68d283ea44099d03',
    };

    address = addressMap[address] || address;
    return this.tokenLoader.load(address);
  }

  static async getLiquidityPrice({ address }: { address: `0x${string}` }) {
    return cache.wrap(
      `liquidity-${address}-price`,
      async () => {
        try {
          const lpToken = Contracts.LPToken.get(address, 4689);
          const [token0, token1, getReserves, _totalSupply] = await Promise.all([lpToken.read.token0(), lpToken.read.token1(), lpToken.read.getReserves(), lpToken.read.totalSupply()]);
          const [reseve0, reserve1] = getReserves;
          const token0ERC20 = await ERC20.Get({ args: { address: token0, chainId: 4689 } });
          const token1ERC20 = await ERC20.Get({ args: { address: token1, chainId: 4689 } });
          Promise.all([token0ERC20.priceUSD.get, token1ERC20.priceUSD.get]);
          const price0 = token0ERC20.priceUSD.value;
          const price1 = token1ERC20.priceUSD.value;
          const decimals0 = token0ERC20.decimals.value;
          const decimals1 = token1ERC20.decimals.value;

          const [price, reserve, decimals, totalSupply] = new BigNumber(price0).isGreaterThan(price1)
            ? [price0, reseve0.toString(), decimals0, _totalSupply.toString()]
            : [price1, reserve1.toString(), decimals1, _totalSupply.toString()];

          const token0Reserve = new BigNumber(price)
            .multipliedBy(reserve)
            .dividedBy(10 ** decimals)
            .multipliedBy(2);
          const totalSupplyPrice = new BigNumber(totalSupply.toString()).dividedBy(10 ** 18);
          return token0Reserve.dividedBy(totalSupplyPrice).toFixed();
        } catch (e) {
          return '0';
        }
      },
      { ttl: 60 * 1000 },
    );
  }
}
