"use client";

import React from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Chain } from "@thirdweb-dev/chains";
import { Loader2 } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import Draggable from "react-draggable";

import { helper } from "../../../lib/helper";
import { useStore } from "../../../store/index";
import RootStore from "../../../store/root";
import { PromiseState } from "../../../store/standard/PromiseState";
import { WalletStore } from "../../../store/wallet";
import { Input, Modal, ModalContent, ModalHeader, Tab, Tabs } from "@nextui-org/react";

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
          } catch (error) { }
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
    <Modal
      isOpen={walletStore.isSelectNetworkDialogOpen}
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
        <ModalContent className={"rounded-lg border-none px-4"}>
          <ModalHeader className="draggable-handle cursor-move">
            Select Network
          </ModalHeader>
          <div className="relative">
            <Input
              startContent={<MagnifyingGlassIcon />}
              value={store.searchText}
              onChange={(e) => (store.searchText = e.target.value)}
              className="mt-2"
              placeholder="Search Network or Chain ID"
            />
          </div>
          <Tabs
            defaultValue="Mainnets"
            className="w-[400px] mt-4"
          >
            <Tab key="Mainnets" title="Mainnets">
              <div className="mt-2 overflow-y-scroll pr-2" style={{ height: "300px" }}>
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
              </div>
            </Tab>
            <Tab key="Testnets" title="Testnets">
              <div className="mt-8 overflow-y-scroll pr-2" style={{ height: "300px" }}>
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
              </div>
            </Tab>
          </Tabs>
        </ModalContent>
      </Draggable>
    </Modal>
  );
});

export default SelectNetworkDialog;
