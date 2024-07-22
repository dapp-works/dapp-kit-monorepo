import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { observer, useLocalObservable } from "mobx-react-lite";
import { useStore } from "../../store/index";
import Draggable from "react-draggable";
import { JSONForm } from "../../components/JSONForm";
import { useEffect, useMemo } from "react";
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
      store.isMobile = window.innerWidth < 991;
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isMobile = store.isMobile;

  const ModalMemo = useMemo(() => {
    if (!formData) {
      return null;
    }

    const layoutConfig = { ...complexFormModal.layoutConfig };
    if (isMobile && layoutConfig.$type === 'GridLayout') {
      layoutConfig.$gridColumn = 1;
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
        classNames={complexFormModal.classNames}
        scrollBehavior={complexFormModal.scrollBehavior}
        isDismissable={complexFormModal.isDismissable}
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
                  theme={complexFormModal.theme}
                  formData={formData}
                  formConfig={complexFormModal.formConfig}
                  layoutConfig={layoutConfig}
                  onBatchSubmit={complexFormModal.onBatchSubmit
                    ? complexFormModal.onBatchSubmit
                    : (data) => {
                      complexFormModal.event.emit('batchSubmit', data);
                    }
                  }
                  onSet={complexFormModal.onSet}
                  onChange={complexFormModal.onChange}
                  onReady={complexFormModal.onReady}
                  batchSubmitButtonProps={complexFormModal.batchSubmitButtonProps}
                />
              </ModalBody>
            </ModalContent>
          </Draggable>
        </div>
      </Modal>
    );
  }, [isOpen, formData, isMobile]);

  return ModalMemo;
});

export default JSONViewModal;
