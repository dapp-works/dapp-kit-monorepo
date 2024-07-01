import { type Chain, type GetContractReturnType, createPublicClient, getContract, http, type Abi, PublicClient, HttpTransport, WalletClient } from 'viem'

export class Cache {
  kv: Record<string, any> = {};

  wrap<T>(key: string, fn: () => T | Promise<T>): T | Promise<T> {
    if (this.kv[key]) {
      return this.kv[key];
    }

    const result = fn();
    if (result instanceof Promise) {
      return result.then(res => {
        this.kv[key] = res;
        return res;
      });
    } else {
      this.kv[key] = result;
      return result;
    }
  }
}
export class AIem<Contracts extends Record<string, Abi>, Chains extends Record<string, Chain>, Addrs extends { [K in keyof Contracts]?: { [key: string]: `${string}-0x${string}` } }> {
  private cache: Cache = new Cache()
  contractMap: Contracts
  chainMap: Chains
  nameMap: Addrs
  contracts: {
    [K in keyof Addrs & keyof Contracts]: {
      //@ts-ignore
      [KK in keyof Addrs[K]]: GetContractReturnType<Contracts[K], PublicClient<HttpTransport, Chain, any, any>, any, any>
    }
  }

  getWallet?: () => WalletClient

  constructor(args: Pick<AIem<Contracts, Chains, Addrs>, "contractMap" | "chainMap" | "nameMap" | "getWallet">) {
    Object.assign(this, args);

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
    return this.cache.wrap(`contract: ${contractName}-${chainId}-${address}-${wallet ? wallet.account.address : wallet}`, () => {
      //@ts-ignore
      const contract = this.contractMap[contractName];
      //@ts-ignore
      const pubClient = this.PubClient(chainId)

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
}
