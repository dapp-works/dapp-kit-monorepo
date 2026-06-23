import './dayjs';
import { BigNumberState, RootStore } from '@dappworks/kit';
import { getAddress } from 'viem';
import numeral from 'numeral';
import BigNumber from 'bignumber.js';
import { WalletStore } from '@dappworks/kit/wallet';
import BN from 'bignumber.js';
import { cache } from '@dappworks/kit/utils';
import dayjs from 'dayjs';

export type TypeWarpBigNumber = {
  value: string;
  format: string;
  decimals: string;
};

export const helper = {
  env: {
    isBrower() {
      return typeof window !== 'undefined';
    },
    isIopayMobile() {
      return typeof window !== 'undefined' && window.navigator?.userAgent?.toLowerCase().includes('iopay');
    },
    isPc() {
      const userAgentInfo = typeof window === 'undefined' ? '' : window.navigator?.userAgent;
      const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
      let flag = true;
      for (let v = 0; v < Agents.length; v++) {
        if (userAgentInfo?.indexOf(Agents[v] || '') > 0) {
          flag = false;
          break;
        }
      }
      return flag;
    },
    isInIframe() {
      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }
    },
  },
  util: {
    async testRpc(url: string): Promise<{ url: string; lentency: number; height: number }> {
      const start = performance.now(); // 开始时间
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_getBlockByNumber',
            params: ['latest', false],
            id: 1,
          }),
        });

        if (!response.ok) {
          throw new Error(`Error from server: ${response.status}`);
        }
        const res = await response.json();
        console.log(res);
        const end = performance.now();
        return { url, lentency: Number(helper.number.numberFormat((end - start) / 1000, '0.000', { fallback: '-1' })), height: parseInt(res.result.number, 16) };
      } catch (error) {
        console.error('RPC Latency Test Failed:', error);
        return { url, lentency: -1, height: -1 }; // 在发生错误时返回 -1
      }
    },
    async getTimeByBlock(blockNumber: string, chainId: number = 4689) {
      return cache.wrap(
        `getTimeByBlock-${blockNumber}-${chainId}`,
        async () => {
          const blockHeight = parseInt(blockNumber);
          let currentBlock;
          currentBlock = await RootStore.Get(WalletStore).publicClient.getBlockNumber();
          const time = Date.now() + (blockHeight - Number(currentBlock)) * 5000;
          return time;
        },
        { ttl: 60 * 60 * 1000 },
      );
    },
    async addToMetaMask(token: { ethAddress: string; symbol: string; decimals: number; logo: string }) {
      try {
        const ethereum = (window as any).ethereum;
        if (+ethereum.chainId !== 4689) {
          await RootStore.Get(WalletStore).switchChain?.({ chainId: 4689 });
        }
        ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: { address: token.ethAddress, symbol: token.symbol, decimals: token.decimals, image: token.logo },
          },
        });
      } catch (e) {}
    },
  },
  json: {
    safeParse(val: any) {
      try {
        return JSON.parse(val);
      } catch (error) {
        return val;
      }
    },
  },
  address: {
    formatAddress(address) {
      if (!address) return;
      return address.replace(/^(.{4})(.*)(.{4})$/, '$1...$3');
    },
    validateEthAddress(address: string) {
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    },
    validateIoAddress(address: string) {
      return /^io[a-zA-Z0-9]{39}$/.test(address);
    },
    validateAddress(address: string) {
      return helper.address.validateEthAddress(address) || helper.address.validateIoAddress(address);
    },
    safeAddress(address): `0x${string}` | false {
      try {
        const parsedAddress = getAddress(address);
        return parsedAddress as `0x${string}`;
      } catch (error) {
        return false;
      }
    },
  },
  string: {
    shortString(fullStr = '', strLen, separator) {
      if (!fullStr || fullStr.length <= strLen) return fullStr;

      separator = separator || '...';

      var sepLen = separator.length,
        charsToShow = strLen - sepLen,
        frontChars = Math.ceil(charsToShow / 2),
        backChars = Math.floor(charsToShow / 2);
      return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
    },
    capitalizeFirstLetter(string) {
      if (string === null || string === undefined) return '';
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
  },
  number: {
    //format: '0,0'
    warpBigNumber(value: string, decimals = 18, options?: { format?: string; fallback?: string; min?: number }) {
      const { format = '0.0', fallback = '0.000', min } = options || {};
      if (!value) {
        return {
          value: '...',
          format: '...',
          decimals: '0',
          isZero: true,
        };
      }
      const BigNumberResponse = new BigNumberState({ value: new BigNumber(value), decimals });
      return {
        value: BigNumberResponse.value.toFixed(0),
        originFormat: BigNumberResponse.value.div(10 ** decimals).toFixed(),
        format: helper.number.numberFormat(BigNumberResponse.value.div(10 ** decimals).toFixed(), format, { fallback, min }),
        decimals: String(BigNumberResponse.decimals),
        isZero: BigNumberResponse.value.isZero(),
      };
    },
    //http://numeraljs.com/ format params does not need to deal with decimal places
    //format: '$0,0' '0a' '0,0' '0,0$'
    numberFormat(str: string | number, format: string = '0,0', options: { min?: number; fallback?: string } = {}): string {
      const { fallback = '0.00' } = options || {};

      if (!str || isNaN(Number(str))) return fallback;
      const numStr = new BigNumber(str).toFixed();
      const countNonZeroNumbers = (_str: string) => {
        const decimalPointIndex = _str.indexOf('.');
        if (decimalPointIndex === -1) {
          return 0;
        }
        const decimalPart = _str.substring(decimalPointIndex + 1);
        let trailingZerosCount = 0;
        for (let i = 0; i < decimalPart.length; i++) {
          if (decimalPart[i] === '0') {
            trailingZerosCount++;
          } else {
            break;
          }
        }
        return trailingZerosCount;
      };

      const fractionDigits = countNonZeroNumbers(format);
      const numberFractionDigits = countNonZeroNumbers(numStr);
      if (options?.min) {
        if (new BigNumber(numStr).isLessThan(new BigNumber(options?.min || 0))) {
          return `< ${numeral(options?.min).format(format)}`;
        }
      }
      const fullStr = new BigNumber(numStr).toFixed();
      let preStr = numeral(fullStr.split('.')[0]).format(format.split('.')[0]);
      const fractionStr = fullStr.split('.')?.[1]?.slice(0, fractionDigits + numberFractionDigits);

      if (numberFractionDigits >= fractionDigits) {
        return (preStr + '.' + fractionStr).replace(/\.?0+$/, '').replace('.undefined', '');
      }

      if (fractionStr?.[fractionDigits - 1] == '9') {
        return (preStr + '.' + fractionStr.slice(0, fractionDigits - 1) + '9').replace(/\.?0+$/, '').replace('.undefined', '');
      }

      const resultStr = numeral(new BigNumber(numStr).toString()).format(format);
      return resultStr.replace(/\.?0+$/, '').replace('.undefined', '');
    },
    formatShortNumber(str: string | number, isUnit: boolean = true, decimal: number = 2) {
      const num = Number(str);
      if (num >= 1000000) {
        return isUnit ? '$' + (num / 1000000).toFixed(2) + 'm' : (num / 1000000).toFixed(2) + 'm';
      } else if (num >= 1000) {
        return isUnit ? '$' + (num / 1000).toFixed(2) + 'k' : (num / 1000).toFixed(2) + 'k';
      } else {
        const res = num.toFixed(decimal);
        if (Number(res) <= 0) {
          return isUnit ? '$0' : '0';
        }
        return isUnit ? '$' + num.toFixed(decimal) : num.toFixed(decimal);
      }
    },
    countNonZeroNumbers: (str: string) => {
      let index = 0;
      const length = str.length;
      for (; index < length && (str[index] === '0' || str[index] === '.'); index += 1);
      return length - index - Number(str.includes('.'));
    },
    toPrecisionFloor: (str: number | string, options?: { decimals?: number; format?: string; toLocalString?: boolean }) => {
      const { decimals = 6, format = '', toLocalString = false } = options || {};
      if (!str || isNaN(Number(str))) return '';

      if (helper.number.countNonZeroNumbers(String(str)) <= decimals) return String(str);
      const numStr = new BN(str).toFixed();
      let result = '';
      let index = 0;
      const numLength = numStr.length;

      for (; numStr[index] === '0' && index < numLength; index += 1);

      if (index === numLength) return '0';

      if (numStr[index] === '.') {
        // number < 0
        result = '0';
        for (; (numStr[index] === '0' || numStr[index] === '.') && index < numLength; index += 1) {
          result = result + numStr[index];
        }
      }
      let resultNumLength = 0;
      for (; index < numLength && (resultNumLength < decimals || !result.includes('.')); index += 1) {
        result = result + numStr[index];

        if (numStr[index] !== '.') resultNumLength += 1;
      }
      if (format) {
        return numeral(Number(result)).format(format);
      }

      if (toLocalString) {
        console.log(helper.number.numberWithCommas(Number(new BN(result).toFixed())));
        return helper.number.numberWithCommas(Number(new BN(result).toFixed()));
      }

      return new BN(result).toFixed();
    },
    numberWithCommas(num: number) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
  },
  time: {
    fromNow(ts: string): string {
      if (!ts || dayjs.utc(ts).valueOf() <= 0) {
        return '--';
      }
      return dayjs.utc(ts).fromNow();
    },
    translateFn(ts: string): string {
      const keyMessage = ['years', 'year', 'months', 'month', 'days', 'day', 'hours', 'hour', 'minutes', 'minute', 'ago', 'just now'];
      let text = this.fromNow(ts);
      keyMessage.map((value) => {
        text = text.replace(value, value.replace(' ', ''));
      });
      if (
        text.includes('hour') ||
        text.includes('hours') ||
        text.includes('day') ||
        text.includes('days') ||
        text.includes('month') ||
        text.includes('months') ||
        text.includes('year') ||
        text.includes('years')
      ) {
        return text.replace(/^an?/, '1');
      }
      return text.replace(/^an?/, 'a');
    },
  },
};
