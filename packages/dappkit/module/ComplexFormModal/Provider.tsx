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
  const gridColumn = complexFormModal.layoutConfig?.gridColumn as number;
  const store = useLocalObservable(() => ({
    gridColumn: undefined,
    setGridColumn(v: number | undefined) {
      // @ts-ignore
      store.gridColumn = v;
    },
  }));
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        store.setGridColumn(1);
      } else {
        store.setGridColumn(gridColumn);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [gridColumn]);

  if (!formData) {
    return null;
  }

  const layoutConfig = {
    ...complexFormModal.layoutConfig,
  };

  if (store.gridColumn) {
    // @ts-ignore
    layoutConfig.gridColumn = store.gridColumn;
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
                // @ts-ignore
                layoutConfig={layoutConfig}
                onBatchSubmit={
                  complexFormModal.isAutomaticallyClose
                    ? (data) => {
                      complexFormModal.event.emit('batchSubmit', data);
                    }
                    : complexFormModal.onBatchSubmit
                }
                onSubmit={complexFormModal.onSubmit}
                onSet={complexFormModal.onSet}
              />
            </ModalBody>
          </ModalContent>
        </Draggable>
      </div>
    </Modal>
  );
});

export default JSONViewModal;
