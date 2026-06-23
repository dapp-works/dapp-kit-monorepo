// swap-kit public boundary.
// Phase 0 defines the seams only; the swap engine itself is ported from mimo's
// full-featured fork in Phase 1. See ../../../../swap-shared-lib-plan.md.

/** A token as the swap engine sees it. Data sources map their own models onto this. */
export interface TokenItem {
  address: `0x${string}`
  symbol: string
  name: string
  decimals: number
  chainId: number
  logoURI?: string
  balance?: string
}

/**
 * Injection point #1 - wallet adapter.
 * hub backs this with @dappworks/ui-kit/wallet, mimo with @dappworks/kit/wallet;
 * behaviour is identical, only the import path differs.
 */
export interface SwapWalletAdapter {
  account: () => `0x${string}` | undefined
  chainId: () => number
  sendRawTx: (args: {
    chainId: number
    address: `0x${string}`
    data: `0x${string}`
    value?: string
    historyItem?: unknown
  }) => Promise<unknown>
  signTypedData: (args: {
    domain: Record<string, unknown>
    types: Record<string, unknown>
    primaryType: string
    message: Record<string, unknown>
  }) => Promise<`0x${string}`>
}

/**
 * Injection point #2 - token data source.
 * hub routes through KitService.mimo, mimo through its ERC20Service.
 */
export interface TokenDataSource {
  getTokenList: (opts: { account?: `0x${string}`; chainId: number }) => Promise<TokenItem[]>
  getTokenDetail: (address: `0x${string}`, chainId: number) => Promise<TokenItem>
  getTokenPrice?: (address: `0x${string}`, chainId: number) => Promise<string>
}

/** Behavioural toggles that collapse the two forks' differences into config. */
export interface SwapFeatures {
  /** Quote cache TTL in ms. mimo=30000, hub=0 (realtime). */
  quoteCacheMs?: number
  /** USDC.e <-> USDC wrapping. mimo=true, hub=false. */
  usdcWrapper?: boolean
  /** V3 routing. Defaults to true. */
  v3?: boolean
  /** UniversalRouter support. */
  universalRouter?: boolean
  /** Permit2 signature approvals. */
  permit2?: boolean
}

export interface SwapConfig {
  /** Quote API endpoint, e.g. https://swap-api.mimo.exchange/api/trade */
  quoteApiUrl: string
  chainId: number
  features?: SwapFeatures
}

export interface CreateSwapStoreOptions {
  wallet: SwapWalletAdapter
  tokenData: TokenDataSource
  config: SwapConfig
}
