import React from "react";
import { observer } from "mobx-react-lite";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { useStore } from "../../store";
import { ConfirmStore } from ".";
import { cn } from "../../lib/utils";

const ConfirmModal = observer(() => {
  const rootStore = useStore();
  const confirmStore = rootStore.get(ConfirmStore);
  const { isOpen, title, description, size, className, cancelText, okText } = confirmStore;
  return (
    <Modal
      isOpen={isOpen}
      size={size}
      onOpenChange={(open: boolean) => {
        if (!open) {
          confirmStore.close();
        }
      }}
    >
      <ModalContent className={cn("max-h-screen overflow-auto", className)}>
        {() => (
          <>
            {title && <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>}
            <ModalBody>
              <div>{description}</div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                variant="flat"
                onClick={() => {
                  confirmStore.close();
                  confirmStore.onCancel();
                }}
              >
                {cancelText}
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  confirmStore.close();
                  confirmStore.onOk();
                }}
              >
                {okText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
});

export default ConfirmModal;