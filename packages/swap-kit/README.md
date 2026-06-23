# @iotexproject/swap-kit

Shared IoTeX swap engine consumed by **hub** and **mimo**. Eliminates the two
same-origin swap forks: one copy of the store, contract layer and UI lives here;
each frontend keeps its own shell, routes and branding and just imports this
package as a compile-time dependency (no cross-project runtime calls).

## Status

**Phase 0 — scaffold only.** The injection-point interfaces and `createSwapStore`
boundary are defined; the swap orchestration, contract layer and UI are ported
from mimo's full-featured fork in Phase 1. Full plan: `swap-shared-lib-plan.md`
at the workspace root.

## Design

The package never imports a wallet or a data source directly. The app injects:

- **`SwapWalletAdapter`** — `account` / `chainId` / `sendRawTx` / `signTypedData`.
  hub backs it with `@dappworks/ui-kit/wallet`, mimo with `@dappworks/kit/wallet`.
- **`TokenDataSource`** — `getTokenList` / `getTokenDetail` / `getTokenPrice?`.
  hub routes through `KitService.mimo`, mimo through its `ERC20Service`.

Fork differences collapse into `features`: `quoteCacheMs` (mimo 30000 / hub 0),
`usdcWrapper` (mimo true / hub false), `v3`, `universalRouter`, `permit2`.

```ts
import { createSwapStore } from '@iotexproject/swap-kit'

const store = createSwapStore({
  wallet,        // SwapWalletAdapter
  tokenData,     // TokenDataSource
  config: {
    quoteApiUrl: 'https://swap-api.mimo.exchange/api/trade',
    chainId: 4689,
    features: { quoteCacheMs: 30000, usdcWrapper: true },
  },
})
```
