import { RootStore } from "@dappworks/kit"
import { WalletStore } from "@dappworks/kit/wallet"
import { Button } from "@nextui-org/react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import Link from "next/link"
import MyButton from "~/components/MyButton"

const Page = () => {
  const wallet = RootStore.Get(WalletStore)
  return <>
    <Link href='/wallet' >Wallet page2</Link>
    <MyButton />
    <Button onClick={() => {
      wallet.sendRawTx({
        chainId: 4689,
        address: "0x610CBDa6f0037B4141A5B949f56479106BeCb1E9",
        data: "0x",
        value: "0x0de0b6b3a7640000",
        historyItem: {
          msg: 'Swap Test Msg',
          type: "Swap"
        },
        onError: (e) => {
          console.log(e)
        },
        showSuccessDialog: true
      })
    }}>Send Raw Tx</Button>
  </>
}
export default Page