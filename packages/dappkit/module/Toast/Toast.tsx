import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { type Store } from "../../store/standard/base";

export class ToastPlugin implements Store {
  sid = "ToastPlugin";
  provider = () => (
    <Toaster
      toastOptions={{
        className: '!bg-[#fff] !text-[#000] dark:!bg-[#333] dark:!text-[#fff] !rounded-md !shadow-md',
      }}
    />
  );

  success = toast.success;
  error = toast.error;
  loading = toast.loading;
  custom = toast.custom;
  dismiss = toast.dismiss;
  remove = toast.remove;
  promise = toast.promise;
}
