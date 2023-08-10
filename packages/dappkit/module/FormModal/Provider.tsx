import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { observer } from "mobx-react-lite";
import { JSONSchemaForm } from "../../components/JSONSchemaForm";
import { useStore } from "../../store/index";
import Draggable from "react-draggable";
import { cn } from "../../lib/utils";
import { FormModalStore } from ".";

const JSONFormModal = observer(() => {
  const rootStore = useStore();
  const formModal = rootStore.get(FormModalStore);
  const { form, closeOnOverlayClick } = formModal;
  if (!form) {
    return null;
  }
  return (
    <Modal
      className={formModal.className}
      isOpen={formModal.isOpen}
      size={formModal.modalSize}
      isDismissable={!closeOnOverlayClick}
      onOpenChange={(open: boolean) => {
        if (!open) {
          formModal.event.emit('abort');
        }
      }}
    >
      <div className="z-50 fixed top-0 left-0 w-screen h-screen flex items-center justify-center">
        <Draggable handle=".draggable-handle">
          <ModalContent>
            {formModal.title && <ModalHeader className="flex flex-col gap-1 draggable-handle cursor-move">{formModal.title}</ModalHeader>}
            <ModalBody className='max-h-[90vh] overflow-auto'>
              <JSONSchemaForm formState={form} />
            </ModalBody>
          </ModalContent>
        </Draggable>
      </div>
    </Modal>
  );
});

export default JSONFormModal;

