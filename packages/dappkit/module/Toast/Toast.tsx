import { Store } from '@/dappkit/store/standard/base';
import toast, { Toaster } from 'react-hot-toast';

export class ToastPlugin implements Store {
  sid = 'ToastPlugin';
  provider = () => <Toaster />;

  success = toast.success;
  error = toast.error;
  loading = toast.loading;
  custom = toast.custom;
  dismiss = toast.dismiss;
  remove = toast.remove;
  promise = toast.promise;
}
