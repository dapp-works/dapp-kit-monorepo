import React from 'react';
import { PromiseState } from '../../store/standard/PromiseState';
import { Spinner, SpinnerProps } from '@nextui-org/react';
import { Check, X } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { cn } from '../../lib/utils';

export type GroupOptions = {
  args?: any[];
  title: React.ReactNode;
}[];


export type DialogContentUIProps = {
  className?: string;
  itemClassName?: string;
  numberClassName?: string;
  spinnerProps?: SpinnerProps;
  SuccessIcon?: React.ReactNode;
  FailureIcon?: React.ReactNode;
};

export const DialogContentUI = observer(({
  group,
  groupOptions,
  className,
  itemClassName,
  numberClassName,
  spinnerProps = {
    size: 'sm'
  },
  SuccessIcon,
  FailureIcon
}: {
  group: PromiseState<any, any>[];
  groupOptions: GroupOptions;
} & DialogContentUIProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      {group.map((promiseState, index) => {
        const uiOptions = groupOptions[index];
        const no = index + 1;
        return (
          <div key={index} className={cn("w-full flex items-center justify-between", itemClassName)}>
            <div className='flex items-center justify-between'>
              <div className={cn('w-6 h-6 flex items-center justify-center text-sm rounded-full border-2 border-[#000000] dark:border-[#cacbcb] mr-2', numberClassName)}>{no}</div>
              {uiOptions?.title}
            </div>
            {promiseState.loading.value ? (
              <Spinner {...spinnerProps} />
            ) : (
              <>
                {promiseState.value && (SuccessIcon || <Check size={20} color="#605BFF" />)}
                {promiseState.errMsg && (FailureIcon || <X size={20} color="red" />)}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
});


export type StepUIProps = {
  className?: string;
  itemClassName?: string;
  activatedItemClassName?: string;
  numberClassName?: string;
  activatedNumberClassName?: string;
  spinnerProps?: SpinnerProps;
  SuccessIcon?: React.ReactNode;
  FailureIcon?: React.ReactNode;
};

export const StepUI = observer(({
  group,
  groupOptions,
  currentCallStepNo,
  className,
  itemClassName,
  activatedItemClassName = '',
  numberClassName,
  activatedNumberClassName = '',
  spinnerProps = {
    size: 'sm'
  },
  SuccessIcon,
  FailureIcon
}: {
  group: PromiseState<any, any>[];
  groupOptions: GroupOptions;
  currentCallStepNo?: number;
} & StepUIProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      {group.map((promiseState, index) => {
        const uiOptions = groupOptions[index];
        const no = index + 1;
        return (
          <div
            key={index}
            className={cn("w-full flex items-center justify-between text-[#909091] dark:text-[#6b6c6c]",
              no <= currentCallStepNo ? `text-[#000] dark:text-[#fff] ${activatedItemClassName}` : '',
              itemClassName
            )}
          >
            <div className='flex items-center justify-between'>
              <div
                className={cn('w-6 h-6 flex items-center justify-center text-sm rounded-full border-2 border-[#909091] dark:border-[#6b6c6c] mr-2',
                  no <= currentCallStepNo ? `border-[#000] dark:border-[#fff] ${activatedNumberClassName}` : '',
                  numberClassName
                )}
              >
                {no}
              </div>
              {uiOptions?.title}
            </div>
            {promiseState.loading.value ? (
              <Spinner {...spinnerProps} />
            ) : (
              <>
                {promiseState.value && no <= currentCallStepNo && (SuccessIcon || <Check size={20} color="#605BFF" />)}
                {promiseState.errMsg && no <= currentCallStepNo && (FailureIcon || <X size={20} color="red" />)}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
});
