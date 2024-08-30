import { Store } from "../../store/standard/base";
import { StorageState } from '../../store/standard/StorageState';
import { WalletTransactionHistoryType } from "./type";


export class WalletRpcStore implements Store {
  sid = 'WalletPluginStore';

  curRpc = new StorageState({ default: 'https://babel-api.mainnet.iotex.one', key: 'curRPC-v2', value: 'https://babel-api.mainnet.iotex.one' });
}

export class WalletHistoryStore implements Store {
  sid = 'WalletPluginStore';

  history = new StorageState<WalletTransactionHistoryType[] | null>({ value: [], key: 'history' });

  recordHistory(item: WalletTransactionHistoryType) {
    let value: WalletTransactionHistoryType[] | null = this.history.load();
    if (!value) {
      value = [item];
    } else {
      value = [...value, item];
    }
    this.history.setValue(value);
  }
  updateHistoryStatusByTx(tx: string | null, status: 'loading' | 'success' | 'fail') {
    let value: WalletTransactionHistoryType[] | null = this.history.load();
    if (!value) {
      return;
    }
    value = value.map((i) => {
      if (i.tx == tx) {
        i.status = status;
        return i;
      }
      if (!tx) {
        i.status = status;
      }
      return i;
    });
    this.history.setValue(value);
  }
  clearHistory() {
    this.history.setValue(null);
  }
}
