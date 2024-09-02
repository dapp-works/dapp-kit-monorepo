import { RootStore } from "@dappworks/kit";
import { WalletProvider, WalletStore } from "@dappworks/kit/wallet";
import { Button } from "@nextui-org/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
// import { observer } from "mobx-react-lite";
const Test = (() => {
  const wallet = RootStore.Get(WalletStore)
  return <>
    <ConnectButton />
    <Button
      onClick={e => {
        wallet.sendRawTx({
          chainId: 4689,
          address: "0x610CBDa6f0037B4141A5B949f56479106BeCb1E9",
          data: "0x",
          value: 1e17.toString(),
        })
      }}>Send Raw Tx</Button>
    <Button>Send Tx</Button>
    <Button>Wrong chain & send tx</Button>
  </>
})

export default Test;