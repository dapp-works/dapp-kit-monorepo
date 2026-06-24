import { WalletStore } from "@dappworks/ui-kit/wallet"
import { RootStore } from "@dappworks/kit"

export const hooks = {
  async waitAccount(chainId: number) {
    const wallet = RootStore.Get(WalletStore)
    return await wallet.prepare(chainId)
  },
  wait(time: number) {
    return new Promise<void>((res, rej) => {
      setTimeout(() => {
        res()
      }, time)
    })
  }
}
