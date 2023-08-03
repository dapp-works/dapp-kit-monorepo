import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/dappkit/components/ui/dialog';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/store/index';
import { cn } from '@/dappkit/lib/utils';
import { DialogStore } from '.';

const Modal = observer(() => {
  const rootStore = useStore();
  const modal = rootStore.get(DialogStore);
  const { className, isOpen, title, description, content } = modal;
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          modal.close();
        }
      }}
    >
      <DialogContent className={cn("max-h-screen overflow-auto", className)}>
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
});

export default Modal;