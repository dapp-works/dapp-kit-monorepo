import { ConnectButton } from "@rainbow-me/rainbowkit"
import Link from "next/link"

const MyButton = () => {
  return <>
    <ConnectButton showBalance={true} chainStatus={'full'} accountStatus={'full'} />
  </>
}
export default MyButton