import { _ } from "../lib/lodash";
import { Contracts } from ".";
import { zeroAddress } from "viem";
import BigNumber from "bignumber.js";
import { cache } from "@dappworks/kit/utils";

export class MapSet<T> {
  map: Record<string, T>;
  set: T[];
  constructor(args: T[], key: string) {
    this.set = args;
    this.map = _.keyBy(args, key);
  }
}

interface provider {
  name: string;
  address: `0x${string}`;
}

export interface pair {
  amount: string;
  path: `0x${string}`[];
  provider?: provider;
}

export type UniswapServiceConfig =
  {
    eTokens: MapSet<{
      name: string;
      symbol: string;
      address: string;
      isNativeToken?: boolean;
      isStableCoin?: boolean;
    }>;
    provider: MapSet<provider>;
  }

export class UniswapService {
  Config: UniswapServiceConfig;

  static config: Record<number, UniswapService['Config']> = {
    1: {
      provider: new MapSet(
        [
          {
            name: 'Uniswap',
            address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
          },
          {
            name: 'SushiSwap',
            address: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F'
          }
        ],
        'name'
      ),
      eTokens: new MapSet(
        [
          {
            name: 'Ether',
            symbol: 'ETH',
            address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            isNativeToken: true
          },
          {
            name: 'Wrapped Ether',
            symbol: 'WETH',
            address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
          },
          {
            name: 'USDCoin',
            symbol: 'USDC',
            address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
          },
          {
            name: 'Tether USD',
            symbol: 'USDT',
            address: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
          },
          {
            name: 'Dai Stablecoin',
            address: '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735',
            symbol: 'DAI'
          },
          {
            name: 'Wrapped BTC',
            address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
            symbol: 'WBTC'
          }
        ],
        'symbol'
      )
    },
    42: {
      provider: new MapSet(
        [
          {
            name: 'uniswap',
            address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
          }
        ],
        'name'
      ),
      eTokens: new MapSet(
        [
          {
            name: 'Ether',
            symbol: 'ETH',
            address: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
            isNativeToken: true
          },
          {
            name: 'Wrapped Ether',
            symbol: 'WETH',
            address: '0xd0a1e359811322d97991e03f863a0c30c2cf029c'
          },
          {
            name: 'USDCoin',
            symbol: 'USDC',
            address: '0x88E9D0155725A34D2834D90edfeb18a1249308bC'
          },
          {
            name: 'Tether USD',
            symbol: 'USDT',
            address: '0xc05e19Bf3a5f3DD85CE9C1352e261dEA8e2bce29'
          }
        ],
        'symbol'
      )
    },
    56: {
      provider: new MapSet(
        [
          {
            name: 'PancakeSwap',
            address: '0x10ED43C718714eb63d5aA57B78B54704E256024E'
          },
          {
            name: 'SushiSwap',
            address: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'
          }
        ],
        'name'
      ),
      eTokens: new MapSet(
        [
          {
            name: 'Binance Coin',
            symbol: 'BNB',
            address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
            isNativeToken: true
          },
          {
            name: 'WBNB Token',
            symbol: 'WBNB',
            address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
          },
          {
            name: 'USDCoin',
            symbol: 'USDC',
            address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d'
          },
          {
            name: 'Tether USD',
            symbol: 'USDT',
            address: '0x55d398326f99059fF775485246999027B3197955'
          },
          {
            name: 'Binance Pegged BUSD',
            symbol: 'BUSD',
            address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'
          },
          {
            name: 'PancakeSwap Token',
            symbol: 'Cake',
            address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'
          },
          {
            name: 'Binance Pegged ETH',
            symbol: 'ETH',
            address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8'
          }
        ],
        'symbol'
      )
    },
    137: {
      provider: new MapSet(
        [
          {
            name: 'polygonRouter',
            address: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff'
          },
          {
            name: 'SushiSwap',
            address: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'
          }
        ],
        'name'
      ),
      eTokens: new MapSet(
        [
          {
            name: 'MATIC Coin',
            symbol: 'MATIC',
            address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
            isNativeToken: true
          },
          {
            name: 'Wrapped Matic',
            symbol: 'WMATIC',
            address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'
          },
          {
            name: 'USDCoin',
            symbol: 'USDC',
            address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
          },
          {
            name: 'Tether USD',
            symbol: 'USDT',
            address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'
          },
          {
            name: 'Binance Pegged ETH',
            symbol: 'ETH',
            address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619'
          }
        ],
        'symbol'
      )
    },
    4689: {
      provider: new MapSet(
        [
          {
            name: 'MimoSwap',
            address: '0x147CdAe2BF7e809b9789aD0765899c06B361C5cE'
          }
        ],
        'name'
      ),
      eTokens: new MapSet(
        [
          {
            name: 'IOTX',
            symbol: 'IOTX',
            address: '0xa00744882684c3e4747faefd68d283ea44099d03',
            isNativeToken: true
          },
          {
            name: 'Wrapped IOTX',
            symbol: 'WIOTX',
            address: '0xa00744882684c3e4747faefd68d283ea44099d03'
          },
          {
            name: 'IoTeX Binance USD',
            symbol: 'BUSD_b',
            address: '0x84abcb2832be606341a50128aeb1db43aa017449',
            isStableCoin: true
          },
          {
            name: 'Crosschain IOTX',
            symbol: 'CIOTX',
            address: '0x99b2b0efb56e62e36960c20cd5ca8ec6abd5557a'
          },
          {
            name: 'IoTeX Tether USD',
            symbol: 'USDT',
            address: '0x6fbcdc1169b5130c59e72e51ed68a84841c98cd1'
          },
          {
            name: 'IoTeX USDC',
            symbol: 'USDC',
            address: '0x3b2bf2b523f54c4e454f08aa286d03115aff326c'
          },
          {
            name: 'WEN',
            symbol: 'WEN',
            address: '0x6c0bf4b53696b5434a0d21c7d13aa3cbf754913e'
          }
        ],
        'symbol'
      )
    },
    4690: {
      provider: new MapSet(
        [
          {
            name: 'mimoswap',
            address: '0x147CdAe2BF7e809b9789aD0765899c06B361C5cE'
          }
        ],
        'name'
      ),
      eTokens: new MapSet(
        [
          {
            name: 'IOTX',
            symbol: 'IOTX',
            address: '0xff5Fae9FE685B90841275e32C348Dc4426190DB0',
            isNativeToken: true
          },
          {
            name: 'Wrapped Ether',
            symbol: 'ioETH',
            address: '0x93b59C5b2EF3bB6F525E608Df6b69bE9cf3284d6'
          },
          {
            name: 'Binance USD',
            symbol: 'ioBUSD',
            address: '0x9AEf5ADa7FcdcD49CFa7C89A1cE654C7e7255068'
          },
          {
            name: 'TKN',
            symbol: 'TKN',
            address: '0x51f5946372a6F08c8E2C35DD46F6Fa8f0e990950'
          }
        ],
        'symbol'
      )
    }
  };
  
  static sortToken(tokenA, tokenB) {
    return tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA];
  }

  static async getReserves({ address, path, chainId }: { address: `0x${string}`; path: `0x${string}`[]; chainId: number }) {
    const [token0] = this.sortToken(path[0], path[1]);

    const factoryAddress = await cache.wrap(`factorAddress-${address}`, async () => await Contracts.UniswapRouter.get(address, chainId).read.factory())

    const lpAddress = await UniswapService.getPair({ address: factoryAddress, chainId, token0Address: path[0] as `0x${string}`, token1Address: path[1] as `0x${string}` });
    if (lpAddress == zeroAddress || !lpAddress) return null;

    const reserves = await Contracts.LPToken.get(lpAddress, chainId).read.getReserves();
    const reserve0 = reserves[0].toString();
    const reserve1 = reserves[1].toString();

    return path[0] == token0 ? [reserve0, reserve1] : [reserve1, reserve0];
  }


  static async getMidPrice({ address, chainId, path }: { address: `0x${string}`; chainId: number; path: `0x${string}`[] }): Promise<BigNumber> {
    const call: any = [];

    for (let i = 0; i < path.length - 1; i++) {
      call.push(
        UniswapService.getReserves({
          address,
          chainId,
          path: [path[i] as `0x${string}`, path[i + 1] as `0x${string}`]
        }).then((res) => ({ reserve0: res?.[0], reserve1: res?.[1] }))
      );
    }

    const amounts = await Promise.all(call);

    return amounts.reduce((p, c) => p.multipliedBy(c.reserve1).dividedBy(c.reserve0), new BigNumber(1));
  }

  static async getPair({
    address,
    chainId,
    token0Address,
    token1Address,
    noCache = false
  }: {
    address?: `0x${string}`;
    chainId: number;
    token0Address: `0x${string}`;
    token1Address: `0x${string}`;
    noCache?: Boolean;
  }) {
    try {
      let _factoryAddress = address
      if (!_factoryAddress) {
        _factoryAddress = Contracts.current.UniswapFactory.address
      }
      if (!noCache) {
        return cache.wrap(`pair-${address}-${token0Address}-${token1Address}`,
          async () => await Contracts.UniswapFactory.get(_factoryAddress as `0x${string}`, chainId).read.getPair([token0Address, token1Address])
          ,
          {
            ttl: 31536000 * 1000
          }
        )
      } else {
        const res = await Contracts.UniswapFactory.get(_factoryAddress as `0x${string}`, chainId).read.getPair([token0Address, token1Address])
        return res
      }
    } catch (error) {
      return null
    }
  }

  static async getBestTrade({
    isSell,
    amount,
    pairs,
    swapAddress,
    provider,
    chainId
  }: {
    amount: string;
    isSell: boolean;
    provider?: provider;
    pairs: { amount?: any; path: string[] }[];
    swapAddress: `0x${string}`;
    chainId: number;
  }): Promise<{ amount: string; path: string[]; provider?: provider }> {
    const method = isSell ? 'getAmountsOut' : 'getAmountsIn';
    let prices: any[];
    // console.log(pairs)
    const _prices = await Promise.all(pairs.map(i => Contracts.UniswapRouter.get(swapAddress, chainId).read[method]([BigInt(amount), i.path as any]).catch(e => {
      return [BigInt(0), BigInt(0)]
    })));
    prices = _prices.map((i) => i.map(t => t.toString()));
    console.log(prices)
    prices.forEach((i, index) => {
      const valid = Array.isArray(i) && i.every((i) => Number(i) > 1);
      //@ts-ignore
      pairs[index].amount = valid ? Number(isSell ? i[i.length - 1].toString() : i[0].toString()) : 0;
    });

    pairs = pairs.filter((i) => Number(i.amount) > 1);
    let bestPair;
    if (isSell) {
      bestPair = _.maxBy(pairs, (i) => i.amount);
    } else {
      bestPair = _.minBy(pairs, (i) => i.amount);
    }
    console.log(bestPair)
    return { ...bestPair, provider };
  }
}
