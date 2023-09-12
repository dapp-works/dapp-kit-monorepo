import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { observer, useLocalObservable } from "mobx-react-lite";
import { useStore } from "../../store/index";
import Draggable from "react-draggable";
import { JSONForm } from "../../components/JSONForm";
import { useEffect } from "react";
import { cn } from "../../lib/utils";
import { ComplexFormModalStore } from ".";
import React from "react";

const JSONViewModal = observer(() => {
  const rootStore = useStore();
  const complexFormModal = rootStore.get(ComplexFormModalStore);
  const { formData, isOpen } = complexFormModal;
  const store = useLocalObservable(() => ({
    isMobile: false,
  }));

  useEffect(() => {
    const handleResize = () => {
      store.isMobile = window.innerWidth < 600;
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!formData) {
    return null;
  }

  const layoutConfig: any = { ...complexFormModal.layoutConfig };
  if (store.isMobile && layoutConfig.type === 'GridLayout') {
    layoutConfig.gridColumn = 1;
    Object.keys(layoutConfig).forEach((key) => {
      if (typeof layoutConfig[key] === 'object') {
        // @ts-ignore
        layoutConfig[key].colSpan = 1;
      }
    });
  }

  return (
    <Modal
      className={complexFormModal.className}
      isOpen={isOpen}
      size={complexFormModal.modalSize}
      onOpenChange={(open: boolean) => {
        if (!open) {
          complexFormModal.event.emit('abort');
        }
      }}
    >
      <div className="z-50 fixed top-0 left-0 w-screen h-screen">
        <Draggable handle=".draggable-handle">
          <ModalContent>
            {complexFormModal.title && <ModalHeader className="flex flex-col gap-1 draggable-handle cursor-move">{complexFormModal.title}</ModalHeader>}
            <ModalBody className={cn('max-h-[90vh] overflow-auto')}>
              <JSONForm
                formData={formData}
                formConfig={complexFormModal.formConfig}
                layoutConfig={layoutConfig}
                onBatchSubmit={
                  complexFormModal.onBatchSubmit
                    ? complexFormModal.onBatchSubmit
                    : (data) => {
                      complexFormModal.event.emit('batchSubmit', data);
                    }
                }
                onSet={complexFormModal.onSet}
                onChange={complexFormModal.onChange}
                batchSubmitButtonProps={complexFormModal.batchSubmitButtonProps}
              />
            </ModalBody>
          </ModalContent>
        </Draggable>
      </div>
    </Modal>
  );
});


export default JSONViewModal;
