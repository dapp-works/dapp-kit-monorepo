import React from "react";
import toast, { Toaster } from "react-hot-toast";

import { Store } from "../../store/standard/base";

export class ToastPlugin implements Store {
  sid = "ToastPlugin";
  stype = "Plugin";
  provider = () => <Toaster />;

  success = toast.success;
  error = toast.error;
  loading = toast.loading;
  custom = toast.custom;
  dismiss = toast.dismiss;
  remove = toast.remove;
  promise = toast.promise;
}
