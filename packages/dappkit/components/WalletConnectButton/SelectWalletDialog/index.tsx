import { observer } from "mobx-react-lite";
import { useStore } from "../../../store/index";
import Draggable from "react-draggable";
import { WalletStore } from "../../../store/wallet";
import { helper } from "../../../lib/helper";
import React from "react";
import { Modal, ModalContent, ModalHeader } from "@nextui-org/react";

const SelectWalletDialog = observer(() => {
  const rootStore = useStore();
  const walletStore = rootStore.get(WalletStore);
  return (
    <Modal
      isOpen={walletStore.isSelectWalletDialogOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          walletStore.isSelectWalletDialogOpen = false;
        }
      }}>
      <Draggable handle=".draggable-handle">
        <ModalContent className={"rounded-lg border-none"} style={{ minWidth: "400px" }}>
          <ModalHeader className="draggable-handle cursor-move">
            Choose your wallet
          </ModalHeader>
          {walletStore?.supportedWallets?.map((i, index) => {
            return (
              <div
                key={index}
                className=" flex bg-muted p-2 rounded-md items-center border border-2 hover:border-primary transition delay-100 cursor-pointer"
                onClick={async () => {
                  await walletStore.selectWallet.call(index);
                  walletStore.wallet.connect();
                }}>
                <img src={helper.img.parse(i?.getMeta()?.iconURL)} alt="" className="w-8 h-8 mr-2" />
                <div className="flex-col ">
                  <div>{i?.getMeta()?.name}</div>
                </div>
              </div>
            );
          })}
        </ModalContent>
      </Draggable>
    </Modal>
  );
});

export default SelectWalletDialog;
