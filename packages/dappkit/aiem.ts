
import { Chain, type GetContractReturnType, createPublicClient, getContract, http, type Abi, PublicClient, HttpTransport } from 'viem'

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
export class AIem<Contracts extends Record<string, Abi> = {}, Chains extends Record<string, Chain> = {}> {
    private cache: Cache = new Cache()
    contractMap: { [K in keyof Contracts]: Contracts[K] };
    chainMap: { [K in keyof Chains]: Chains[K] };

    constructor(args: Pick<AIem<Contracts, Chains>, "contractMap" | "chainMap">) {
        // this.chains = args.chains;
        this.contractMap = args.contractMap;
        this.chainMap = args.chainMap
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
            return createPublicClient({
                //@ts-ignore
                chain: this.chainMap[chainId],
                transport: http()
            }) as PublicClient<HttpTransport, Chain, any, any>
        })
    }


    Get<K extends keyof Contracts, C extends keyof Chains>(contractName: K, chainId: C, address: `0x${string}`,): GetContractReturnType<Contracts[K], PublicClient<HttpTransport, Chain, any, any>> {
        //@ts-ignore
        return this.cache.wrap<GetContractReturnType<Contracts[K], PublicClient<HttpTransport, Chain, any, any>>>(`contract: ${contractName}-${chainId}-${address}`, () => {
            //@ts-ignore
            const contract = this.contractMap[contractName];
            //@ts-ignore
            const client = this.PubClient(chainId)

            return getContract({
                //@ts-ignore
                client,
                address,
                abi: contract
            })
        });
    }
}
