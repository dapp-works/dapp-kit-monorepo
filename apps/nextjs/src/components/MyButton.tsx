import { RootStore } from "@dappworks/kit";
import { ConnectLedger, DisconnectLedger, WalletStore } from "@dappworks/kit/wallet";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { observer } from "mobx-react-lite";
import Link from "next/link"

const MyButton = observer(() => {
  const wallet = RootStore.Get(WalletStore);
  return <>
    <div className="flex items-center gap-2">
      {
        (!wallet.isLedger || (!wallet.isConnect && wallet.isLedger)) && <ConnectButton showBalance={true} chainStatus={'full'} accountStatus={'full'} />
      }

      {
        wallet.isLedger && wallet.isConnect
        &&
        <Button onClick={e => {
          ConnectLedger()
        }}>{wallet.account}</Button>
      }

      <Dropdown backdrop="blur">
        <DropdownTrigger>
          <Button variant="light" className="flex items-center justify-center" isIconOnly >
            <div className="mb-2">...</div>
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions" variant="faded">
          {wallet.isConnect && <DropdownItem onClick={e => { DisconnectLedger() }} key="disconnect">Disconnet</DropdownItem>}
          {!wallet.isConnect && <DropdownItem onClick={e => { ConnectLedger() }} startContent={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path fill="#000" d="M0 0h28v28H0z" /><path fill="#fff" fill-rule="evenodd" d="M11.65 4.4H4.4V9h1.1V5.5l6.15-.04V4.4Zm.05 5.95v7.25h4.6v-1.1h-3.5l-.04-6.15H11.7ZM4.4 23.6h7.25v-1.06L5.5 22.5V19H4.4v4.6ZM16.35 4.4h7.25V9h-1.1V5.5l-6.15-.04V4.4Zm7.25 19.2h-7.25v-1.06l6.15-.04V19h1.1v4.6Z" clip-rule="evenodd" /></svg>} key="new">Ledger</DropdownItem>}
        </DropdownMenu>
      </Dropdown>
    </div>
  </>
})
export default MyButton
