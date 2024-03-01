import React from 'react';
import { PromiseState } from '../../store/standard/PromiseState';
import { DialogStore } from '../Dialog';
import { DialogContent, GroupOptions } from './ui';

class PromiseStateGroup {
  group: PromiseState<any, any>[] = [];
  groupOptions: GroupOptions = [];

  constructor({ group, groupOptions = [] }: { group: PromiseState<any, any>[]; groupOptions: GroupOptions }) {
    Object.assign(this, {
      group,
      groupOptions,
    });
  }

  async call() {
    let result: any[] = [];
    let errMsg: string = '';
    this.group.forEach((p) => {
      Object.assign(p, {
        autoAlert: false,
        value: p.defaultValue,
        errMsg: '',
      });
    });
    for (let i = 0; i < this.group.length; i++) {
      const promiseState = this.group[i];
      const options = this.groupOptions[i];
      if (promiseState && options) {
        try {
          const args = options.args || [];
          const data = await promiseState.call(...args);
          result.push(data);
        } catch (e) {
          errMsg = e.message;
          if (errMsg?.includes('User rejected the request') || String(e).toLowerCase().includes('user rejected')) {
            errMsg = 'User rejected the request';
          }
          promiseState.errMsg = errMsg;
          break;
        }
      }
    }
    return {
      result,
      errMsg,
    };
  }

  async ui(dialogOptions?: Partial<DialogStore>) {
    DialogStore.show({
      title: '',
      size: 'md',
      content: <DialogContent group={this.group} groupOptions={this.groupOptions} />,
      isDismissable: false,
      ...(dialogOptions || {}),
    });

    const res = await this.call();
    return res;
  }

  closeUI() {
    DialogStore.close();
  }
}

export default PromiseStateGroup;
