import { type Chain, type GetContractReturnType, createPublicClient, getContract, http, type Abi, PublicClient, HttpTransport, WalletClient, AbiFunction } from 'viem'
import md5 from "md5"
import { iotex, mainnet, bsc, polygon, iotexTestnet, } from 'viem/chains'
import TTLCache from '@isaacs/ttlcache'

//@ts-ignore
mainnet.rpcUrls.default.http = ['https://rpc.ankr.com/eth']
//@ts-ignore
mainnet.rpcUrls.default.webSocket = ["wss://ethereum-rpc.publicnode.com"]




export class Cache {
  kv = new TTLCache<string, any>({ max: 10000, ttl: 1000 * 60, });

  wrap<T>(key: string, fn: () => T | Promise<T>, config: TTLCache.Options<any, any> = {}): T | Promise<T> {
    if (this.kv.has(key)) {
      console.log(`load ${key} from cache`)
      return this.kv.get(key);
    }

    const result = fn();
    if (result instanceof Promise) {
      const promiseResult = result.then(res => {
        this.kv.set(key, res, config);
        return res;
      });
      this.kv.set(key, promiseResult, config);
      return promiseResult;
    } else {
      this.kv.set(key, result, config);
      return result;
    }
  }
}


export class AIem<Contracts extends Record<string, Abi>, Chains extends Record<string, Chain>, Addrs extends { [K in keyof Contracts]?: { [key: string]: `${string}-0x${string}` } }> {
  static cache?: Cache = new Cache()
  cache?: Cache = new Cache()
  contractMap?: Contracts
  //@ts-ignore
  chainMap?: Chains = {
    [iotex.id]: iotex,
    [mainnet.id]: mainnet,
    [bsc.id]: bsc,
    [polygon.id]: polygon,
    [iotexTestnet.id]: iotexTestnet,
  }
  nameMap?: Addrs
  contracts: {
    [K in keyof Addrs & keyof Contracts]: {
      //@ts-ignore
      [KK in keyof Addrs[K]]: GetContractReturnType<Contracts[K], PublicClient<HttpTransport, Chain, any, any>, any, any>
    }
  }
  static _defaultFuncMap = {
    "totalSupply": { ttl: 15 * 1000 },
    "symbol": { ttl: 60 * 1000 },
    "name": { ttl: 60 * 1000 },
    "decimals": { ttl: 60 * 1000 },
    "balanceOf": { ttl: 5 * 1000 }
  }
  funcMap?: { [key: string]: { ttl?: number } } = {}


  get _cache() {
    return AIem.cache
  }


  //@ts-ignore
  getWallet?: () => WalletClient

  static Set<Contracts extends Record<string, Abi>, Chains extends Record<string, Chain>, Addrs extends { [K in keyof Contracts]?: { [key: string]: `${string}-0x${string}` } }>(args: Pick<AIem<Contracts, Chains, Addrs>, "contractMap" | "chainMap" | "nameMap" | "getWallet" | "cache" | "funcMap">) {
    return this.init().Set(args)
  }

  Set<Contracts extends Record<string, Abi>, Chains extends Record<string, Chain>, Addrs extends { [K in keyof Contracts]?: { [key: string]: `${string}-0x${string}` } }>(args: Pick<AIem<Contracts, Chains, Addrs>, "contractMap" | "chainMap" | "nameMap" | "getWallet" | "cache" | "funcMap">): AIem<Contracts, Chains, Addrs> {
    const { chainMap = {}, contractMap = {}, funcMap, ...rest } = args || {}
    //@ts-ignore
    this.chainMap = Object.assign({}, this.chainMap || {}, chainMap)
    //@ts-ignore
    this.contractMap = Object.assign({}, this.contractMap || {}, contractMap)
    //@ts-ignore
    this.funcMap = Object.assign({}, this.funcMap || {}, funcMap)

    Object.assign(this, rest)
    return this as any
  }


  constructor(args: Pick<AIem<Contracts, Chains, Addrs>, "contractMap" | "chainMap" | "nameMap" | "getWallet" | "cache" | "funcMap"> = {}) {


    this.Set(args)

    this.contracts = new Proxy({}, {
      //@ts-ignore
      get: (target: any, contractName: keyof Addrs & keyof Contracts) => {
        if (target[contractName]) return target[contractName]

        if (!this.nameMap[contractName]) {
          throw new Error(`Contract ${String(contractName)} not found`);
        }

        target[contractName] = new Proxy({}, {
          //@ts-ignore
          get: (innerTarget: any, contractAlias: keyof Addrs[keyof Addrs]) => {
            const addressStr = this.nameMap[contractName]?.[contractAlias];
            if (!addressStr) {
              throw new Error(`Alias ${String(contractAlias)} for contract ${String(contractName)} not found`);
            }
            const [chainId, address] = addressStr.split('-');


            // Assuming getContractInstance is a function that retrieves a contract instance
            return this.Get(contractName, String(chainId), address as `0x${string}`);
          }
        });
        return target[contractName];
      }
    }) as any;

  }

  // WsClient<C extends keyof Chains>(chainId: C): PublicClient<WebSocketTransport, Chain, any, any> {
  //     //@ts-ignore
  //     return this.cache.wrap(`wsClient-${String(chainId)}`, () => {
  //         // const wsUrl = this.chainMap[chainId]?.rpcUrls?.default?.webSocket?.[0]
  //         // if (!wsUrl) throw new Error(`rpcUrls.default.webSocket[0] is not defined for chainId ${String(chainId)}`)
  //         // //@ts-ignore
  //         return createPublicClient({
  //             //@ts-ignore
  //             chain: this.chainMap[chainId],
  //             transport: webSocket()
  //         }) as PublicClient<WebSocketTransport, Chain, any, any>
  //     })
  // }


  PubClient<C extends keyof Chains>(chainId: C): PublicClient<HttpTransport, Chain, any, any> {
    //@ts-ignore
    return this._cache.wrap(`publicClient-${String(chainId)}`, () => {
      //@ts-ignore
      return createPublicClient({
        //@ts-ignore
        chain: this.chainMap[chainId],
        transport: http()
      }) as PublicClient<HttpTransport, Chain, any, any>
    })
  }


  //@ts-ignore
  Get<K extends keyof Contracts, C extends keyof Chains, Addr extends `0x${string}`>(contractName: K, chainId: C, address: Addr): GetContractReturnType<Contracts[K], PublicClient<HttpTransport, Chain, any, any>> {
    const wallet = this.getWallet ? this.getWallet() : null
    //@ts-ignore
    const cacheKey = `contract: ${contractName}-${chainId}-${address}-${wallet ? wallet.account.address : wallet}`
    return this._cache.wrap(cacheKey, () => {
      //@ts-ignore
      const contract = this.contractMap[contractName];
      //@ts-ignore
      const pubClient = this.PubClient(chainId)

      //@ts-ignore
      return this.getContract({
        client: {
          //@ts-ignore
          public: pubClient,
          //@ts-ignore
          wallet
        },
        address,
        abi: contract
      })
    }) as any
  }

  getContract({
    client,
    address,
    abi
  }: {
    client: {
      public: PublicClient<HttpTransport, Chain, any, any>
      wallet?: WalletClient
    }
    address: `0x${string}`
    abi: any,
  }) {
    const handler = {
      get: (target: any, funcName: any) => {
        if (typeof target[funcName] === 'function') {
          return async (...args: any[]) => {
            const methodConfig = this.funcMap?.[funcName as string];
            const cacheKey = `method:${client.public.chain.id}-${address}-${String(funcName)}-${JSON.stringify(args)}`;

            if (methodConfig) {
              return this.cache.wrap(cacheKey, () => {
                return target[funcName](...args);
              }, methodConfig);
            }

            return target[funcName](...args);
          };
        }
        return new Proxy(target[funcName], handler)
      }
    }

    //@ts-ignore
    const contract = getContract({
      //@ts-ignore
      client,
      address,
      abi
    })
    return new Proxy(contract, handler) as any
  }


  static init(): AIem<any, any, any> {
    if (!globalThis.aiem) {
      //@ts-ignore
      globalThis.aiem = new AIem();
    }

    return globalThis.aiem;
  }

  //@ts-ignore
  static Get<TAbi extends Abi = any>(abi: TAbi, chainId: any, address: any, wallet?: WalletClient): GetContractReturnType<TAbi, PublicClient<HttpTransport, Chain, any, any>> {
    const aiem = this.init()

    const cacheKey = `contract ${md5(JSON.stringify(abi))}-${chainId}-${address}-${wallet ? wallet.account.address : null}`
    return aiem._cache.wrap(cacheKey, () => {
      //@ts-ignore
      const pubClient = aiem.PubClient(chainId)

      //@ts-ignore
      return aiem.getContract({
        client: {
          //@ts-ignore
          public: pubClient,
          //@ts-ignore
          wallet
        },
        address,
        abi
      })
    }) as any
  }
}


export type ReadFunctionKeys<T extends Abi> = T[number] extends infer U
  ? U extends AbiFunction
  ? U['stateMutability'] extends 'view' | 'pure'
  ? U['name']
  : never
  : never
  : never;
