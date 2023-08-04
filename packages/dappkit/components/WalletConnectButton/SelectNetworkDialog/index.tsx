import React from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Chain } from "@thirdweb-dev/chains";
import { Loader2 } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import Draggable from "react-draggable";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { helper } from "../../../lib/helper";
import { useStore } from "../../../store/index";
import RootStore from "../../../store/root";
import { PromiseState } from "../../../store/standard/PromiseState";
import { WalletStore } from "../../../store/wallet";

const SignerNetworkCard = observer(
  ({ i, index }: { i: Chain; index: number }) => {
    const walletStore = RootStore.Get(WalletStore);
    const store = useLocalObservable(() => ({
      selectedChainId: 0,
      switchChain: new PromiseState({
        function: async (chainId: number) => {
          return await walletStore.wallet.switchChain(chainId);
        },
      }),
    }));
    return (
      <div
        onClick={async () => {
          store.selectedChainId = i.chainId;
          try {
            await store.switchChain.call(i.chainId);
          } catch (error) {}
        }}
        key={index}
        className="bg-muted border-muted hover:border-primary delay-80 mt-2 flex cursor-pointer rounded-md  border border-2 p-4 transition"
      >
        <img
          src={helper.img.parse(i?.icon?.url)}
          alt=""
          className="mr-4 h-6 w-6"
        />
        <div className="">{i?.name}</div>
        {i?.chainId == store?.selectedChainId &&
          store?.switchChain?.loading?.value && (
            <Loader2 size={24} className="ml-auto animate-spin" />
          )}
      </div>
    );
  },
);

const SelectNetworkDialog = observer(() => {
  const rootStore = useStore();
  const walletStore = rootStore.get(WalletStore);
  const store = useLocalObservable(() => ({
    searchText: "",
    selectedChainId: "",
    get searchMainnetNetwork() {
      return walletStore.mainnetNetworks.filter((i) =>
        i.name.toLowerCase().includes(store.searchText.toLowerCase()),
      );
    },
    get searchTestnetNetwork() {
      return walletStore.testnetNetworks.filter((i) =>
        i.name.toLowerCase().includes(store.searchText.toLowerCase()),
      );
    },
  }));

  return (
    <Dialog
      open={walletStore.isSelectNetworkDialogOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          // walletStore.toggleSelectNetworkDialog();
          walletStore.set({
            isSelectNetworkDialogOpen: false,
          });
        }
      }}
    >
      <Draggable handle=".draggable-handle">
        <DialogContent className={"rounded-lg border-none"}>
          <DialogHeader className="draggable-handle cursor-move">
            <DialogTitle className="">Select Network</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="Mainnets" className="w-[400px] ">
            <TabsList className="">
              <TabsTrigger value="Mainnets">Mainnets</TabsTrigger>
              <TabsTrigger value="Testnets">Testnets</TabsTrigger>
            </TabsList>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 text-2xl" />
              <Input
                value={store.searchText}
                onChange={(e) => (store.searchText = e.target.value)}
                className="bg-muted mt-6 border-none pl-8"
                placeholder="Search Network or Chain ID"
              />
            </div>
            <TabsContent
              value="Mainnets"
              className="mt-8 overflow-y-scroll pr-2"
              style={{ height: "300px" }}
            >
              {store.searchText ? (
                <>
                  {store?.searchMainnetNetwork?.map((i, index) => (
                    <SignerNetworkCard i={i} index={index} />
                  ))}
                </>
              ) : (
                <>
                  <div className="">Popular</div>
                  {walletStore?.popularNetworks?.map((i, index) => (
                    <SignerNetworkCard i={i} index={index} />
                  ))}
                  <div className="mt-4">All Networks</div>
                  {walletStore?.mainnetNetworks?.map((i, index) => (
                    <SignerNetworkCard i={i} index={index} />
                  ))}
                </>
              )}
            </TabsContent>
            <TabsContent
              value="Testnets"
              className="mt-8 overflow-y-scroll pr-2"
              style={{ height: "300px" }}
            >
              {store.searchText ? (
                <>
                  {store?.searchTestnetNetwork?.map((i, index) => (
                    <SignerNetworkCard i={i} index={index} />
                  ))}
                </>
              ) : (
                <>
                  <div className="">Popular</div>
                  {walletStore?.popularTestnetNetworks?.map((i, index) => (
                    <SignerNetworkCard i={i} index={index} />
                  ))}
                  <div className="mt-4">All Networks</div>
                  {walletStore?.testnetNetworks?.map((i, index) => (
                    <SignerNetworkCard i={i} index={index} />
                  ))}
                </>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Draggable>
    </Dialog>
  );
});

export default SelectNetworkDialog;
