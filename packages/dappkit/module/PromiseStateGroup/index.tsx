import React from 'react';
import { PromiseState } from '../../store/standard/PromiseState';
import { DialogStore } from '../Dialog';
import { DialogContentUI, DialogContentUIProps, GroupOptions, StepUI, StepUIProps } from './ui';
import { makeObservable } from 'mobx';
import { ToastPlugin } from '../Toast/Toast';
import { RootStore } from '../../store';

export class PromiseStateGroup {
  group: PromiseState<any, any>[] = [];
  groupOptions: GroupOptions = [];
  currentCallStepNo = 1;

  constructor({ group, groupOptions = [] }: { group: PromiseState<any, any>[]; groupOptions: GroupOptions }) {
    group.forEach((p) => {
      Object.assign(p, {
        autoAlert: false,
        value: p.defaultValue,
        errMsg: '',
      });
    });
    Object.assign(this, {
      group,
      groupOptions
    });
    makeObservable(this, {
      currentCallStepNo: true,
    });
  }

  async call() {
    let result: any[] = [];
    let errMsg: string = '';
    for (let i = 0; i < this.group.length; i++) {
      this.currentCallStepNo = i + 1;
      const promiseState = this.group[i];
      if (promiseState) {
        try {
          const options = this.groupOptions[i];
          const args = options?.args || [];
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

  async callWithDialog(
    dialogOptions?: Partial<DialogStore>,
    dialogContentOptions?: DialogContentUIProps,
    successMsg?: string,
    autoClose: boolean = true
  ) {
    this.showDialog(dialogOptions, dialogContentOptions);
    const {
      result,
      errMsg,
    } = await this.call()
    if (errMsg) {
      RootStore.Get(ToastPlugin).error(errMsg)
      this.closeDialog()
      return {
        result,
        errMsg,
      }
    }
    if (successMsg) {
      RootStore.Get(ToastPlugin).success(successMsg)
    }
    if (autoClose) {
      this.closeDialog()
    }
    return {
      result,
      errMsg,
    }
  }

  showDialog(
    dialogOptions?: Partial<DialogStore>,
    dialogContentOptions?: DialogContentUIProps) {
    DialogStore.show({
      title: '',
      size: 'md',
      isDismissable: false,
      content:
        <DialogContentUI
          group={this.group}
          groupOptions={this.groupOptions}
          {...dialogContentOptions}
        />,
      ...dialogOptions,
    });
    return this;
  }



  closeDialog() {
    DialogStore.close();
  }

  async stepCall(stepNo: number) {
    const index = stepNo - 1;
    if (index < 0 || index >= this.group.length) {
      return {
        result: null,
        errMsg: 'Invalid step number',
      };
    }

    const prePromiseState = this.group[index - 1];
    if (prePromiseState && prePromiseState.errMsg) {
      return {
        result: null,
        errMsg: prePromiseState.errMsg,
      };
    }

    this.currentCallStepNo = stepNo;

    const promiseState = this.group[index];
    if (promiseState && !promiseState.loading.value) {
      const options = this.groupOptions[index];
      const args = options?.args || [];
      try {
        const result = await promiseState.call(...args);
        return {
          result,
          errMsg: '',
        };
      } catch (e) {
        let errMsg = e.message;
        if (errMsg?.includes('User rejected the request') || String(e).toLowerCase().includes('user rejected')) {
          errMsg = 'User rejected the request';
        }
        promiseState.errMsg = errMsg;
        return {
          result: null,
          errMsg,
        };
      }
    }
  }

  onNext() {
    if (this.currentCallStepNo < this.group.length) {
      this.currentCallStepNo += 1;
    }
  }

  onPrevious() {
    if (this.currentCallStepNo > 1) {

      // reset value and errMsg of the current promiseState
      const index = this.currentCallStepNo - 1;
      const promiseState = this.group[index];
      if (promiseState) {
        promiseState.value = '';
        promiseState.errMsg = '';
      }

      // go to the previous step
      this.currentCallStepNo -= 1;
    }
  }

  render(props?: StepUIProps) {
    return (
      <StepUI
        group={this.group}
        groupOptions={this.groupOptions}
        currentCallStepNo={this.currentCallStepNo}
        {...props}
      />
    )
  }
}
