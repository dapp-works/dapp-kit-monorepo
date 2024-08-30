import { Icon } from "@iconify/react";
import { Card } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import React from "react";
import { RootStore } from "../../../store";
import { DialogStore } from "../../../module/Dialog";
interface IProps {
  msg: string,
  hash: string,
}

const SuccessTxDialog = observer((props: IProps) => {
  return <div className='flex-col gap-4 py-10'>
    <div className='w-full flex items-center justify-center'>
      <Icon icon="icon-park-solid:check-one" width="48" height="48" className='text-green-500' /></div>
    <div className='text-2xl font-[900] text-center mt-4'>{props.msg}</div>
    <div className='flex items-center justify-center text-green-500 text-sm mt-6 gap-2 cursor-pointer hover:text-green-600 transition'
      onClick={e => window.open(`https://iotexscan.io/tx/${props.hash}`, '_blank')}>View on IoTeXScan <Icon icon="material-symbols:chip-extraction-rounded" width="18" height="18" /></div>
  </div>
})
export const ShowSuccessTxDialog = ({ msg, hash }) => {
  RootStore.Get(DialogStore).setData({
    title: '',
    content: <SuccessTxDialog msg={msg} hash={hash} />,
    isOpen: true,
  })
}