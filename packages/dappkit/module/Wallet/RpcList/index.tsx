import { Icon } from '@iconify/react';
import { Button, Checkbox, Chip, Input, Listbox, ListboxItem, Popover, PopoverContent, PopoverTrigger, Radio, RadioGroup, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from '@nextui-org/react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React from 'react';
import { useEffect } from 'react';
import { RootStore } from "../../../store";
import { WalletStore } from "..";
import { WalletRpcStore } from '../walletPluginStore';
import { ToastPlugin } from '../../Toast/Toast';


const RpcList = observer(() => {
  const wallet = RootStore.Get(WalletStore)
  const rpcStore = RootStore.Get(WalletRpcStore)
  useEffect(() => {
    rpcStore.testRpc()
  }, [])

  return (
    <div className='mb-3 mt-2'>
      <div className='w-full flex mb-2'>
        <div className='flex items-center justify-center gap-2'>
          <Checkbox size='sm' isSelected={rpcStore.isAutoSelectRpc.value} onValueChange={e => rpcStore.isAutoSelectRpc.save(e)}>Auto select rpc</Checkbox>
          <Tooltip content={<div className='w-[300px]'>Once selected, if the current RPC cannot send a request, an available RPC will be automatically chosen.</div>}>
            <Icon icon="ph:question" width="18" height="18" className='text-gray-500' />
          </Tooltip>
        </div>

        <Button startContent={<Icon icon="tabler:test-pipe" width="18" height="18" />} className='ml-auto' onClick={e => {
          rpcStore.testRpc()
        }}>Test</Button>
        <Popover placement="bottom" offset={20} showArrow isOpen={rpcStore.showCustomRpc} onOpenChange={(open) => rpcStore.showCustomRpc = (open)}>
          <PopoverTrigger>
            <Button color="primary" startContent={<Icon icon="basil:add-solid" width="18" height="18" />} className='ml-4'>Add custom rpc</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2">
              <Input
                type="url"
                className='mb-4'
                placeholder="https://rpc.com"
                value={rpcStore.customRpc}
                onValueChange={(value) => {
                  rpcStore.customRpc = value;
                }}
              />
              <Button color='primary' isDisabled={!rpcStore.customRpc} onClick={e => rpcStore.addCustomRpc()}>Save</Button>
            </div>
          </PopoverContent>
        </Popover>

      </div>

      <Table
        color="success"
        selectionMode="single"
        defaultSelectedKeys={[rpcStore.curRpc.value]}
        aria-label="Example static collection table"
      >
        <TableHeader>
          <TableColumn>RPC Server Address</TableColumn>
          <TableColumn align='center'>Score</TableColumn>
          <TableColumn align='center'>Height</TableColumn>
          <TableColumn align='center'>Latency</TableColumn>
          <TableColumn align='center'>Action</TableColumn>
        </TableHeader>
        <TableBody >
          {
            rpcStore.rpcList?.value?.map((item, index) => {
              return <TableRow className='cursor-pointer' key={item.name} onClick={e => {
                rpcStore.curRpc.save(item.name)
                RootStore.Get(ToastPlugin).success('Set rpc success')
              }} >
                <TableCell >{item.name}</TableCell>
                <TableCell >{rpcStore.scoreIcon(item.latency)}</TableCell>
                <TableCell>{item.height}</TableCell>
                <TableCell className={rpcStore.latencyColor(item.latency)}>{item.latency}s</TableCell>
                <TableCell>
                  <div className="relative flex items-center gap-2">
                    <Tooltip content="Add to metamask">
                      <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={e => {
                        e.stopPropagation()
                        rpcStore.addToMetamask(item.name)
                      }}>
                        <Icon icon="logos:metamask-icon" width="18" height="18" />
                      </span>
                    </Tooltip>
                    {
                      item.custom && <Tooltip content="Remove">
                        <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={e => {
                          e.stopPropagation()
                          rpcStore.removeRpc(item.name)
                        }}>
                          <Icon icon="solar:trash-bin-minimalistic-broken" width="20" height="20" />
                        </span>
                      </Tooltip>
                    }
                  </div>
                </TableCell>
              </TableRow>
            })
          }
        </TableBody>
      </Table>
    </div>
  );
});

export default RpcList;
