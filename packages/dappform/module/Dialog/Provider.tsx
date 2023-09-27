import React from "react";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import { DialogStore } from ".";
import { cn } from "../../lib/utils";
import { useStore } from "../../store/index";

const Dialog = observer(() => {
  const rootStore = useStore();
  const modal = rootStore.get(DialogStore);
  const { className, classNames, isOpen, title, size, content } = modal;
  return (
    <Modal
      isOpen={isOpen}
      size={size}
      onOpenChange={(open: boolean) => {
        if (!open) {
          modal.close();
        }
      }}
      classNames={classNames}
    >
      <ModalContent className={cn("max-h-screen overflow-auto", className)}>
        {() => (
          <>
            {title && <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>}
            <ModalBody>
              {content}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
});

export default Dialog;