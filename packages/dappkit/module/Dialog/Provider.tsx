import React from "react";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import { DialogStore } from ".";
import { useStore } from "../../store/index";

const Dialog = observer(() => {
  const rootStore = useStore();
  const modal = rootStore.get(DialogStore);
  const { className, classNames, isOpen, title, size, content, isDismissable } = modal;
  const Content = typeof content === 'function' ? content : () => content;
  return (
    <Modal
      isOpen={isOpen}
      size={size}
      onOpenChange={(open: boolean) => {
        if (!open) {
          modal.close();
        }
      }}
      className={className}
      classNames={classNames}
      isDismissable={isDismissable}
    >
      <ModalContent className="max-h-screen overflow-auto">
        {() => (
          <>
            {title && <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>}
            <ModalBody>
              <Content />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal >
  );
});

export default Dialog;