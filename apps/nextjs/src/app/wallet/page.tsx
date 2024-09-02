"use client";

import { Button } from "@nextui-org/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { observer } from "mobx-react-lite";
import "~/store/index";
import { WalletProvider } from "@dappworks/kit/wallet"
const Test = observer(() => {
  return <>
    {/* <WalletProvider theme='light'> */}
    {/* <ConnectButton /> */}
    <Button>Send Raw Tx</Button>
    <Button>Send Tx</Button>
    <Button>Wrong chain & send tx</Button>
    {/* </WalletProvider> */}

  </>
})

export default Test;