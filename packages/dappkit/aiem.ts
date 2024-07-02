import { type Chain, type GetContractReturnType, createPublicClient, getContract, http, type Abi, PublicClient, HttpTransport, WalletClient } from 'viem'
import QuickLRU from 'quick-lru';
import md5 from "md5"
import { iotex, mainnet, bsc, polygon } from 'viem/chains'


//@ts-ignore
mainnet.rpcUrls.default.http = ['https://rpc.ankr.com/eth']
//@ts-ignore
mainnet.rpcUrls.default.webSocket = ["wss://ethereum-rpc.publicnode.com"]




export class Cache {
  kv = new QuickLRU<string, any>({ maxSize: 10000 });

  wrap<T>(key: string, fn: () => T | Promise<T>): T | Promise<T> {
    if (this.kv.has(key)) {
      return this.kv.get(key);
    }

    const result = fn();
    if (result instanceof Promise) {
      const promiseResult = result.then(res => {
        this.kv.set(key, res);
        return res;
      });
      this.kv.set(key, promiseResult);
      return promiseResult;
    } else {
      this.kv.set(key, result);
      return result;
    }
  }
}

export class AIem<Contracts extends Record<string, Abi>, Chains extends Record<string, Chain>, Addrs extends { [K in keyof Contracts]?: { [key: string]: `${string}-0x${string}` } }> {
  static cache?: Cache = new Cache()
  contractMap: Contracts
  //@ts-ignore
  chainMap?: Chains = {
    [iotex.id]: iotex,
    [mainnet.id]: mainnet,
    [bsc.id]: bsc,
    [polygon.id]: polygon
  }
  nameMap: Addrs
  contracts: {
    [K in keyof Addrs & keyof Contracts]: {
      //@ts-ignore
      [KK in keyof Addrs[K]]: GetContractReturnType<Contracts[K], PublicClient<HttpTransport, Chain, any, any>, any, any>
    }
  }

  get cache() {
    return AIem.cache
  }

  getWallet?: () => WalletClient

  constructor(args: Pick<AIem<Contracts, Chains, Addrs>, "contractMap" | "chainMap" | "nameMap" | "getWallet">) {

    const { chainMap = {}, contractMap = {}, ...rest } = args || {}
    //@ts-ignore
    this.chainMap = Object.assign({}, this.chainMap || {}, chainMap)
    //@ts-ignore
    this.contractMap = Object.assign({}, this.contractMap || {}, contractMap)

    Object.assign(this, rest)


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
    return this.cache.wrap(`publicClient-${String(chainId)}`, () => {
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
    return this.cache.wrap(cacheKey, () => {
      //@ts-ignore
      const contract = this.contractMap[contractName];
      //@ts-ignore
      const pubClient = this.PubClient(chainId)

      //@ts-ignore
      return getContract({
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
    return aiem.cache.wrap(cacheKey, () => {
      //@ts-ignore
      const pubClient = aiem.PubClient(chainId)

      //@ts-ignore
      return getContract({
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
