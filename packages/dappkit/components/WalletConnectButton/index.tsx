import { observer, useLocalObservable } from 'mobx-react-lite';
import { Button } from '../ui/button';
import { WalletStore } from '../../store/wallet';
import { helper } from '../../lib/helper';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { ExitIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { Copy } from '../Common/Copy';
import SelectNetworkDialog from './SelectNetworkDialog';
import { useStore } from '../../store';
import { cn } from '../../lib/utils';
import SelectWalletDialog from './SelectWalletDialog';
import React from 'react';

type IProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export const WalletConnectButton = observer(({ size = 'lg', className }: IProps) => {
  const rootStore = useStore();
  const walletStore = rootStore.get(WalletStore);
  const { wallet, isConnected, isConnecting, account, balance, currentNetwork, chainId } = walletStore;

  const store = useLocalObservable(() => ({
    isShowWalletDetail: false,
  }));

  const WalletButton = () => {
    if (size == 'sm') {
      return (
        <Button className={cn('flex h-12', className)} onClick={() => (store.isShowWalletDetail = true)}>
          <img src={helper.img.parse(currentNetwork?.icon?.url)} alt="" className="w-6 h-6 mr-2" />
          <div className="flex-col">
            <div className="">{helper.string.truncate(account, 14, '...')}</div>
          </div>
        </Button>
      );
    }
    if (size == 'md') {
      return (
        <Button className={cn('flex h-13', className)} onClick={() => (store.isShowWalletDetail = true)}>
          <img src={helper.img.parse(currentNetwork?.icon?.url)} alt="" className="w-6 h-6 mr-2" />
          <div className="flex-col">
            <div>
              <span>{balance.format}</span>
              <span>{currentNetwork?.nativeCurrency?.symbol}</span>
            </div>
            <div className="mt-1 text-muted-foreground text-xs">{helper.string.truncate(account, 14, '...')}</div>
          </div>
        </Button>
      );
    }
    if (size == 'lg') {
      return (
        <Button className={cn('flex h-14', className)} onClick={() => (store.isShowWalletDetail = true)}>
          <img src={helper.img.parse(currentNetwork?.icon?.url)} alt="" className="w-6 h-6 mr-2" />
          <div className="flex-col">
            <div>
              <span>{balance.format}</span>
              <span className="ml-1">{currentNetwork?.nativeCurrency?.symbol}</span>
            </div>
            <div className="mt-1 text-muted-foreground text-xs">{helper.string.truncate(account, 14, '...')}</div>
          </div>
          <img src={helper.img.parse(wallet.getMeta().iconURL)} alt="" className="w-6 h-6 mr-2 ml-4" />
        </Button>
      );
    }
  };

  if (isConnected && chainId) {
    return (
      <>
        <SelectNetworkDialog />
        <DropdownMenu
          open={store.isShowWalletDetail}
          onOpenChange={(open) => {
            store.isShowWalletDetail = open;
          }}
        >
          <DropdownMenuTrigger  asChild>{WalletButton()}</DropdownMenuTrigger>
          <DropdownMenuContent className="flex-col px-6 py-6 bg-background shadow-xl" style={{ minWidth: '350px' }}>
            <div className="flex items-center">
              <img src={helper.img.parse(wallet?.getMeta()?.iconURL)} alt="" className="w-12 h-12 mr-2" />
              <div className="flex-col">
                <div className="flex items-center">
                  <div className="mr-2 mt-1 text-primary">{helper.string.truncate(account, 14, '...')}</div>
                  <Copy value={account} />
                </div>

                <div className="mt-1 text-xs ">
                  <span>{balance?.format}</span>
                  <span className="ml-1">{currentNetwork?.nativeCurrency?.symbol}</span>
                </div>
              </div>
              <ExitIcon onClick={() => wallet.disconnect()} className="font-blod ml-auto  hover:text-red-500 transition delay-100 cursor-pointer"></ExitIcon>
            </div>

            <div className="mt-4 text-sm">Current Network</div>
            <div
              onClick={() => {
                walletStore.set({
                  isSelectNetworkDialogOpen: true,
                });
                store.isShowWalletDetail = false;
              }}
              className="mt-2 flex bg-muted p-2 rounded-md items-center border border-2 hover:border-primary transition delay-100 cursor-pointer"
            >
              <img src={helper.img.parse(currentNetwork?.icon?.url)} alt="" className="w-6 h-6 mr-2" />
              <div className="flex-col ">
                <div>{currentNetwork?.name}</div>
              </div>
              <ChevronRightIcon className="ml-auto " />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
  }
  return (
    <>
      <SelectWalletDialog />
      <Button
        className={cn(className)}
        loading={isConnecting}
        onClick={() => {
          walletStore.set({
            isSelectWalletDialogOpen: true,
          });
        }}
      >
        Connect Wallet
      </Button>
    </>
  );
});
