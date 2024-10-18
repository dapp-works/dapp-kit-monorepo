import React from 'react';
import { Icon } from "@iconify/react";
import { RootStore } from "../../store";
import { Store } from "../../store/standard/base";
import { StorageState } from '../../store/standard/StorageState';
import { ToastPlugin } from "../Toast/Toast";
import { WalletTransactionHistoryType } from "./type";
import { WalletStore } from ".";
import { helper } from "../../lib/helper";
import { Chain, toHex } from 'viem';
import { WalletConfigStore } from './walletConfigStore';

const defaultRPCList = [
  { name: 'https://babel-api.fastblocks.io', latency: 0, height: 0, custom: false },
  { name: 'https://babel-api.mainnet.iotex.one', latency: 0, height: 0, },
  { name: 'https://babel-api.mainnet.iotex.io', latency: 0, height: 0, },
  { name: 'https://iotex-network.rpc.thirdweb.com', latency: 0, height: 0, },
  // { name: 'https://iotexrpc.com', latency: 0, height: 0, },
  { name: 'https://iotex.api.onfinality.io/public', latency: 0, height: 0, },
  { name: 'https://rpc.ankr.com/iotex', latency: 0, height: 0, },
]
export class WalletRpcStore implements Store {
  sid = 'WalletPluginStore';
  autoObservable = true
  curRpc = new StorageState({ default: 'https://babel-api.mainnet.iotex.one', key: 'curRPC-v2', value: 'https://babel-api.mainnet.iotex.one' });
  isAutoSelectRpc = new StorageState({ key: 'isAutoSelectRpc', default: true });
  customRpc = '';
  rpcList = new StorageState({ key: 'customRpcList-v2', default: defaultRPCList, value: [] })
  showCustomRpc = false;
  get currentRpc() {
    console.log(this.rpcList.value?.find(i => i.name == this.curRpc))
    return this.rpcList.value?.find(i => i.name == this.curRpc.value) || null
  }
  addCustomRpc() {
    const item = { name: this.customRpc, latency: 0, height: 0, custom: true }
    if (defaultRPCList.find(i => i.name === item.name)) {
      return RootStore.Get(ToastPlugin).error('Rpc already exists')
    }
    if (this.rpcList.value) {
      this.rpcList.save([...this.rpcList.value, item])
      this.refresh()
      return
    }
    this.rpcList.save([...defaultRPCList, item])
    this.refresh()
  }
  async addToMetamask(url) {
    try {
      if (typeof window == 'undefined') return;
      await window?.ethereum?.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${(4689).toString(16)}`,
          chainName: 'IoTeX Mainnet',
          nativeCurrency: {
            name: 'IoTeX',
            symbol: 'IOTX',
            decimals: 18,
          },
          rpcUrls: [url],
          blockExplorerUrls: ['https://iotexscan.io'],
        }]
      });
      RootStore.Get(ToastPlugin).success('Network added');
      console.log('Network added');
    } catch (error) {
      console.error('Failed to add network', error);
    }
  }
  async switchOrAddChain(chainId: number) {
    return new Promise(async (resolve, reject) => {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: toHex(chainId) }],
        });
        resolve(true)
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await this.addToMetamaskById(chainId)
          } catch (addError) {
            reject(addError)
          }
        } else {
          reject(switchError)
        }
      }
    })
  }
  async addToMetamaskById(id: number) {
    return new Promise(async (resolve, reject) => {
      try {
        if (typeof window == 'undefined') return;
        const chain = RootStore.Get(WalletConfigStore).supportedChains.find(i => i.id == id)
        const res = await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            "chainId": toHex(chain.id),
            "chainName": chain.name,
            "nativeCurrency": {
              "name": chain.nativeCurrency.name,
              "symbol": chain.nativeCurrency.symbol,
              "decimals": chain.nativeCurrency.decimals,
            },
            "rpcUrls": JSON.parse(JSON.stringify(chain.rpcUrls.default.http)),
            "blockExplorerUrls": [chain.blockExplorers.default.url],
          }]
        });
        console.log(res)
        resolve(res)
      } catch (switchError) {
        reject(false)
      }
    })
  }
  refresh() {
    this.showCustomRpc = false
    this.customRpc = ''
    setTimeout(() => {
      this.testRpc()
    }, 500)
  }
  latencyColor(latency: number) {
    if (latency < 0) {
      return 'text-red-500'
    }
    if (latency < 1) {
      return 'text-green-500'
    }
    if (latency < 2) {
      return 'text-yellow-500'
    }
    return 'text-red-500'
  }
  async testRpcFunction(url: string): Promise<{ url: string, lentency: number, height: number }> {
    const start = performance.now();
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getBlockByNumber',
          params: ["latest", false],
          id: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error from server: ${response.status}`);
      }
      const res = await response.json();
      console.log(res)
      const end = performance.now();
      return { url, lentency: Number(helper.number.numberFormat(((end - start) / 1000), '0.000', { fallback: '-1' })), height: parseInt(res.result.number, 16) };
    } catch (error) {
      console.error('RPC Latency Test Failed:', error);
      return { url, lentency: -1, height: -1 };
    }
  }
  testRpc() {
    this.rpcList?.value.forEach(i => {
      this.testRpcFunction(i.name).then(res => {
        i.latency = res.lentency
        i.height = res.height
      })
    })
    this.rpcList.save(this.rpcList.value)
  }
  removeRpc(name: string) {
    this.rpcList.save(this.rpcList.value.filter(i => i.name !== name))
  }
  scoreIcon(score: number) {
    if (score < 0) {
      return <Icon icon="codicon:error" width="18" height="18" style={{ color: "#FF0000" }} />
    }
    if (score < 1) {
      return <Icon icon="icon-park-solid:check-one" width="18" height="18" style={{ color: "#289726" }} />
    }
    if (score < 2) {
      return <Icon icon="bxs:error" width="18" height="18" style={{ color: "#FFA500" }} />
    }
    return <Icon icon="codicon:error" width="18" height="18" style={{ color: "#FF0000" }} />
  }
  get wallet() {
    return RootStore.Get(WalletStore)
  }
  // debounceAutoSelectRpc = pDebounce(this.autoSelectRpc, 3000)
  async autoSelectRpc() {
    console.log('autoSelectRpc')
    for (let i = 0; i < this.rpcList.value.length; i++) {
      const item = this.rpcList.value[i]
      const res = await this.testRpcFunction(item.name)
      if (res.lentency != -1 || res.height > 0) {
        this.curRpc.save(item.name)
        break;
      }
    }
  }
}

export class WalletHistoryStore implements Store {
  sid = 'WalletHistoryStore';
  isRender = false
  autoObservable = true
  set(params: Partial<WalletHistoryStore>) {
    Object.assign(this, params);
  }
  private history = new StorageState<WalletTransactionHistoryType[] | null>({ value: [], key: 'history' });
  get historyList(): WalletTransactionHistoryType[] {
    if (this.isRender) {
      return this.history.value
    }
    return []
  }
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
