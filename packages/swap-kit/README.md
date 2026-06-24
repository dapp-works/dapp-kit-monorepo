# @dappworks/swap-kit

Shared IoTeX swap **engine** consumed by **mimo** (and **hub**, pending).
Eliminates the two same-origin swap forks: one copy of the swap store, contract
layer and shared utils lives here; each frontend keeps its own UI, routes and
branding and imports this package as a compile-time dependency (no cross-project
runtime calls).

## Status

**Shipped — `@dappworks/swap-kit@0.0.1` (published to npm).** The full swap engine
is in place and **mimo consumes it** in place of its deleted local copies
(real-wallet verified: swap, wrap/unwrap, UniversalRouter + Permit2 signing).
**hub integration is pending** (Phase 3). Full plan: `swap-shared-lib-plan.md`
at the workspace root.

## What's in the package

- **Engine**: `MimoStore` + `TokenInputStore` — pricing orchestration (smart-router
  & v2 quote), swap execution, wrap/unwrap, token list.
- **Contract layer**: `Contracts` (addresses + factory), `ERC20` / `ERC20Service`,
  `UniswapService`, `Permit2`, ABIs.
- **Shared utils**: `PromiseHook`, `StorageState`, `helper`, `lodash`, `hooks`, etc.

## Design

`@dappworks/kit` is a **peer dependency** — `RootStore` / `PromiseState` /
`WalletStore` / `cache` / `AIem` resolve to the consumer's single framework
instance, so the MobX store graph is preserved. App-specific glue stays in the
app and is wired via injection at init:

- **`setSwapUI({ SettingModal, ImportTokenModal })`** — the engine opens dialogs
  through these without owning a component library.
- **`setSwapConfig({ quoteApiUrl })`** — the quote API endpoint.

Next.js routing and liquidity-page navigation stay app-side (not in the package).

```ts
import { RootStore } from '@dappworks/kit'
import { MimoStore, setSwapUI, setSwapConfig } from '@dappworks/swap-kit'

// once at app init:
setSwapUI({ SettingModal, ImportTokenModal })
setSwapConfig({ quoteApiUrl: 'https://swap-api.mimo.exchange/api/trade' })

// then drive the engine via the shared RootStore:
const swap = RootStore.Get(MimoStore)
```
