import { Store } from '@/dappkit/store/standard/base';
import { makeAutoObservable } from 'mobx';
import Provider from './Provider';

export class ConfirmStore implements Store {
  sid = 'ConfirmStore';
  provider = () => <Provider />;

  isOpen: boolean = false;
  title?: string = '';
  description?: string = '';
  cancelText?: string = 'Cancel';
  okText?: string = 'Apply';

  constructor() {
    makeAutoObservable(this);
  }

  toggleOpen(val: boolean) {
    this.isOpen = val;
  }

  onOk() {}

  onCancel() {}

  show(confirmProps: Partial<ConfirmStore>) {
    Object.assign(this, confirmProps);
    this.toggleOpen(true);
  }
}
