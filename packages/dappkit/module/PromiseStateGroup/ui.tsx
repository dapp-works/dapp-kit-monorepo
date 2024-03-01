import React from 'react';
import { PromiseState } from '../../store/standard/PromiseState';
import { Spinner } from '@nextui-org/react';
import { Check, X } from 'lucide-react';
import { observer } from 'mobx-react-lite';

export type GroupOptions = {
  args?: any[];
  title: React.ReactNode;
}[];

export const DialogContent = observer(({ group, groupOptions }: { group: PromiseState<any, any>[]; groupOptions: GroupOptions }) => {
  return (
    <div className="pb-4 space-y-4">
      {group.map((promiseState, index) => {
        const uiOptions = groupOptions[index];
        return (
          <div key={index} className="w-full flex items-center justify-between">
            {uiOptions?.title}
            <div>
              {promiseState.loading.value ? (
                <Spinner size="sm" />
              ) : (
                <>
                  {promiseState.value && <Check size={20} color="#605BFF" />}
                  {promiseState.errMsg && <X size={20} color="red" />}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
});
