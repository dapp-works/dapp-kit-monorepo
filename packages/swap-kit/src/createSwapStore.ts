import type { CreateSwapStoreOptions, SwapFeatures } from './types'

const DEFAULT_FEATURES: Required<SwapFeatures> = {
  quoteCacheMs: 0,
  usdcWrapper: false,
  v3: true,
  universalRouter: false,
  permit2: false,
}

/**
 * Create the shared swap store.
 *
 * Phase 0 scaffold: wires the injection points and resolves feature defaults.
 * The swap orchestration (quote/onSwap/wrap/Permit2), the contract layer and
 * the UI are ported from mimo's full-featured fork in Phase 1.
 */
export function createSwapStore(options: CreateSwapStoreOptions) {
  const { wallet, tokenData, config } = options
  const features: Required<SwapFeatures> = { ...DEFAULT_FEATURES, ...config.features }

  return {
    wallet,
    tokenData,
    config,
    features,
    // TODO(phase-1): port MimoStore swap orchestration here
    //   - updatePrice / quote (POST config.quoteApiUrl, honour features.quoteCacheMs)
    //   - onSwap / onDepositeETH / onWithdrawETH (wrap/unwrap)
    //   - tokenList sourced via the tokenData injection point
    //   - Permit2 approvals via wallet.signTypedData
  }
}

export type SwapStore = ReturnType<typeof createSwapStore>
