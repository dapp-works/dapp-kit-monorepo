import React from "react";
import { observer } from "mobx-react-lite";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { useStore } from "../../store";
import { ConfirmStore } from ".";

const ConfirmModal = observer(() => {
  const rootStore = useStore();
  const confirmStore = rootStore.get(ConfirmStore);
  const { isOpen, title, description, size, className, classNames, cancelBtnProps, okBtnProps } = confirmStore;
  return (
    <Modal
      isOpen={isOpen}
      size={size}
      className={className}
      classNames={classNames}
      onOpenChange={(open: boolean) => {
        if (!open) {
          confirmStore.close();
        }
      }}
    >
      <ModalContent className="max-h-screen overflow-auto">
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
                size="sm"
                children="Cancel"
                {...cancelBtnProps}
                onClick={() => {
                  confirmStore.close();
                  confirmStore.onCancel();
                }}
              />
              <Button
                color="primary"
                size="sm"
                children="Apply"
                {...okBtnProps}
                onPress={() => {
                  confirmStore.close();
                  confirmStore.onOk();
                }}
              />
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
});

export default ConfirmModal;