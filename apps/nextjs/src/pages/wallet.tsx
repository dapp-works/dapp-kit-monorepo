import { RootStore } from "@dappworks/kit";
import { RpcList, WalletConfigStore, WalletHistoryStore, WalletStore, WalletTransactionHistoryType } from "@dappworks/kit/wallet";
import { AIem } from '@dappworks/kit/aiem'
import { Button } from "@nextui-org/react";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { bsc, iotex, iotexTestnet, mainnet, polygon } from "viem/chains";
import { ERC20Abi } from "~/lib/abi";
import { observer } from "mobx-react-lite";
import { DialogStore } from "@dappworks/kit/plugins";
import { useEffect } from "react";
import Link from "next/link";
import MyButton from "~/components/MyButton";

const Test = observer(() => {
  const wallet = RootStore.Get(WalletStore)
  const config = RootStore.Get(WalletConfigStore)
  const history = RootStore.Get(WalletHistoryStore)
  useEffect(() => {
    store.changeChain(true)
  }, [])
  const store = RootStore.Local(() => {
    return {
      sendRawTx() {
        wallet.sendRawTx({
          chainId: 4689,
          address: "0x610CBDa6f0037B4141A5B949f56479106BeCb1E9",
          data: "0x",
          value: 1e17.toString(),
          historyItem: {
            msg: 'Swap Test Msg',
            type: "Swap"
          },
          showSuccessDialog: true
        })
      },
      sendTx() {
        wallet.sendTx({
          chainId: 4689,
          tx: async () => await AIem.Get(ERC20Abi, '4689', "0xa00744882684c3e4747faefd68d283ea44099d03", RootStore.Get(WalletStore).walletClient).write.approve(["0xa00744882684c3e4747faefd68d283ea44099d03", BigInt(1e18.toString())]),
          historyItem: {
            msg: 'Approve',
            type: "Swap"
          }
        })
      },
      changeChain(isIotex: boolean) {
        if (isIotex) {
          config.set({
            supportedChains: [iotex, iotexTestnet]
          })
        } else {
          config.set({
            supportedChains: [bsc, mainnet, polygon]
          })
        }
      },
    }
  })
  return <>
    <div suppressHydrationWarning>
      History List :
      {
        history.historyList?.map((i: WalletTransactionHistoryType) => {
          return <div suppressHydrationWarning>{i.chainId} - {i.msg} - {i.type} - {i.timestamp} - [{i.status}]</div>
        })
      }
    </div>
    <Link href='/wallet2'>Wallet page2</Link>
    <MyButton />
    <div className="flex flex-col gap-2">
      <Button onClick={e => { store.sendRawTx() }}>Send Raw Tx</Button>

      <Button onClick={e => { store.sendTx() }}>Send Tx</Button>

      <Button onClick={e => { store.changeChain(true) }}>Change Iotex Chain</Button>
      <Button onClick={e => { store.changeChain(false) }}>Change Other Chain</Button>

      <Button onClick={e => { wallet.disconnect() }}>DisConnect</Button>

      <Button onClick={async e => {
        console.log('prepare start')
        const res = await wallet.prepare()
        console.log(res)
        console.log('prepare end')
      }}>Prepare</Button>

      <Button disabled={wallet.isConnect} onClick={e => { wallet.prepare() }}>Open Connect Modal</Button>

      <Button onClick={e => {
        RootStore.Get(DialogStore).setData({
          isOpen: true,
          content: <RpcList />,
          size: '2xl'
        })
      }}>RPC Modal</Button>
    </div>
  </>
})

export default Test;