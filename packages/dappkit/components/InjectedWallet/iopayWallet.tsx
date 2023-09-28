import { injectedWallet } from './injectedWallet'

const iopayWallet = injectedWallet()
iopayWallet.meta.name = 'IoPay Wallet'

export { iopayWallet }