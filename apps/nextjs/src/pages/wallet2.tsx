import { ConnectButton } from "@rainbow-me/rainbowkit"
import Link from "next/link"
import MyButton from "~/components/MyButton"

const Page = () => {
  return <>
    <Link href='/wallet' >Wallet page2</Link>
    <MyButton />
  </>
}
export default Page