import { _iotex, iotex } from '@/lib/chain';
import { helper } from '@/lib/helper';
import { DeviceDetectStore } from '@/store/deviceDetect';
import { RPCStore } from '@/store/rpc';
import { StorageState } from '@/store/standard/StorageState';
import { WalletStore } from '@/store/wallet';
import { RootStore } from '@dappworks/kit';
import { ToastPlugin } from '@dappworks/kit/plugins';
import { Icon } from '@iconify/react';
import { Button, Checkbox, Chip, Input, Listbox, ListboxItem, Popover, PopoverContent, PopoverTrigger, Radio, RadioGroup, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from '@nextui-org/react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect } from 'react';

const RpcList = observer(() => {
  const wallet = RootStore.Get(WalletStore)
  const deviceDetect = RootStore.Get(DeviceDetectStore)
  const rpc = RootStore.Get(RPCStore)
  useEffect(() => {
    rpc.testRpc()
  }, [])

  return (
    <div className='mb-3 mt-2'>
      <div className='w-full flex mb-2'>
        <div className='flex items-center justify-center gap-2'>
          <Checkbox size='sm' isSelected={deviceDetect.autoSelectRpc.value} onValueChange={e => deviceDetect.autoSelectRpc.save(e)}>Auto select rpc</Checkbox>
          <Tooltip content={<div className='w-[300px]'>Once selected, if the current RPC cannot send a request, an available RPC will be automatically chosen.</div>}>
            <Icon icon="ph:question" width="18" height="18" className='text-gray-500' />
          </Tooltip>
        </div>

        <Button startContent={<Icon icon="tabler:test-pipe" width="18" height="18" />} className='ml-auto' onClick={e => {
          rpc.testRpc()
        }}>Test</Button>
        <Popover placement="bottom" offset={20} showArrow isOpen={rpc.showCustomRpc} onOpenChange={(open) => rpc.showCustomRpc = (open)}>
          <PopoverTrigger>
            <Button color="primary" startContent={<Icon icon="basil:add-solid" width="18" height="18" />} className='ml-4'>Add custom rpc</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2">
              <Input
                type="url"
                className='mb-4'
                placeholder="https://rpc.com"
                value={rpc.customRpc}
                onValueChange={(value) => {
                  rpc.customRpc = value;
                }}
              />
              <Button color='primary' isDisabled={!rpc.customRpc} onClick={e => rpc.addCustomRpc()}>Save</Button>
            </div>
          </PopoverContent>
        </Popover>

      </div>

      <Table
        color="success"
        selectionMode="single"
        defaultSelectedKeys={[wallet.curRpc.value]}
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
            rpc.rpcList?.value?.map((item, index) => {
              return <TableRow className='cursor-pointer' key={item.name} onClick={e => {
                wallet.curRpc.save(item.name)
                RootStore.Get(ToastPlugin).success('Set rpc success')
              }} >
                <TableCell >{item.name}</TableCell>
                <TableCell >{rpc.scoreIcon(item.latency)}</TableCell>
                <TableCell>{item.height}</TableCell>
                <TableCell className={rpc.latencyColor(item.latency)}>{item.latency}s</TableCell>
                <TableCell>
                  <div className="relative flex items-center gap-2">
                    <Tooltip content="Add to metamask">
                      <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={e => {
                        e.stopPropagation()
                        rpc.addToMetamask(item.name)
                      }}>
                        <Icon icon="logos:metamask-icon" width="18" height="18" />
                      </span>
                    </Tooltip>
                    {
                      item.custom && <Tooltip content="Remove">
                        <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={e => {
                          e.stopPropagation()
                          rpc.removeRpc(item.name)
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
