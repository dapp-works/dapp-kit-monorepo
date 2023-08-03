import { Dialog, DialogCloseButton, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/dappkit/components/ui/dialog';
import { observer } from 'mobx-react-lite';
import { JSONSchemaForm } from '@/dappkit/components/JSONSchemaForm';
import { useStore } from '@/store/index';
import Draggable from 'react-draggable';
import { cn } from '@/dappkit/lib/utils';
import { FormModalStore } from '.';

const JSONFormModal = observer(() => {
  const rootStore = useStore();
  const formModal = rootStore.get(FormModalStore);
  const { form, className, closeOnOverlayClick } = formModal;
  if (!form) {
    return null;
  }
  return (
    <Dialog
      open={formModal.isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          formModal.event.emit('abort');
        }
      }}
    >
      <div className="z-50 fixed top-0 left-0 w-screen h-screen flex items-center justify-center">
        <DialogOverlay
          onClick={() => {
            if (!closeOnOverlayClick) {
              formModal.event.emit('abort');
            }
          }}
        />
        <Draggable handle=".draggable-handle">
          <div
            className={cn(
              'fixed z-50 grid w-fit gap-4 rounded-b-lg border bg-background px-6 py-4 shadow-lg animate-in dark:border-gray-700',
              'data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-bottom-10 sm:rounded-lg sm:zoom-in-90 data-[state=open]:sm:slide-in-from-bottom-0',
              className,
            )}
          >
            <DialogCloseButton />
            <DialogHeader className="draggable-handle cursor-move">{formModal.title && <DialogTitle>{formModal.title}</DialogTitle>}</DialogHeader>
            <JSONSchemaForm formState={form} />
          </div>
        </Draggable>
      </div>
    </Dialog>
  );
});

export default JSONFormModal;
