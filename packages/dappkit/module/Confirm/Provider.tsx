import React from 'react';
import { observer } from 'mobx-react-lite';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/dappkit/components/ui/alert-dialog';
import { useStore } from '@/store';
import { ConfirmStore } from '.';

const ConfirmModal = observer(() => {
  const rootStore = useStore();
  const confirmStore = rootStore.get(ConfirmStore);
  return (
    <AlertDialog open={confirmStore.isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmStore.title}</AlertDialogTitle>
          <AlertDialogDescription>{confirmStore.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              confirmStore.toggleOpen(false);
              confirmStore.onCancel();
            }}
          >
            {confirmStore.cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              confirmStore.onOk();
              confirmStore.toggleOpen(false);
            }}
          >
            {confirmStore.okText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});

export default ConfirmModal;