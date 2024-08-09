import BN, { BigNumber } from "bignumber.js";
import JSONFormat from "json-format";
import { _ } from "./lodash";
import copy from "copy-to-clipboard";
import numeral from "numeral";
import { from } from "@iotexproject/iotex-address-ts";

const valMap = {
  undefined: "",
  null: "",
  false: false,
};

export const helper = {
  env: {
    isIopayMobile: () => navigator.userAgent && (navigator.userAgent.includes("IoPayAndroid") || navigator.userAgent.includes("IoPayiOs")),
    isBrowser: () => typeof window === "object",
    onBrowser(func) {
      if (this.isBrowser()) {
        func();
      }
    },
  },
  promise: {
    async sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    async runAsync<T, U = Error>(promise: Promise<T>): Promise<[U | null, T | null]> {
      return promise.then<[null, T]>((data: T) => [null, data]).catch<[U, null]>((err) => [err, null]);
    },
  },
  object: {
    crawlObject(object, options) {
      const newObj = JSON.parse(JSON.stringify(object));
      return helper.object.crawl(newObj, options);
    },
    crawl(object, options) {
      Object.keys(object).forEach((i) => {
        if (typeof object[i] === "object") {
          helper.object.crawl(object[i], options);
        } else {
          const handler = options[typeof object[i]];
          if (handler) {
            object[i] = handler(object[i]);
          }
        }
      });
      return object;
    },
  },
  json: {
    isJsonString(str: string) {
      if (!str || typeof str !== "string") return false;
      if (!str?.includes("{")) return false;
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },
    safeParse(val: any) {
      try {
        return JSON.parse(val);
      } catch (error) {
        return val;
      }
    },
  },
  deepAssign(target, ...sources) {
    sources.forEach((source) => {
      Object.keys(source).forEach((key) => {
        let descriptor = Object.getOwnPropertyDescriptor(source, key);
        if (descriptor && descriptor?.get) {
          return Object.defineProperty(target, key, descriptor);
        }
        const targetValue = target[key];
        let sourceValue = source[key];
        if (helper.isObject(targetValue) && helper.isObject(sourceValue)) {
          try {
            target[key] = helper.deepAssign(targetValue, sourceValue);
          } catch (e) {
            target[key] = Object.assign(targetValue, sourceValue);
          }
        } else {
          target[key] = sourceValue;
        }
      });
    });
    return target;
  },
  isObject(value) {
    return value != null && typeof value === "object";
  },
  deepMerge(obj, newObj) {
    const newVal = _.mergeWith(obj, newObj, (...args) => {
      const [objValue, srcValue] = args;
      if (typeof srcValue === "object") {
        return helper.deepMerge(objValue, srcValue);
      }
      return srcValue || valMap[srcValue];
    });
    return newVal;
  },
  img: {
    parse(src: string | undefined) {
      if (!src) return "/img-404.svg";
      if (src?.startsWith("ipfs")) {
        return "https://ipfs.io/ipfs/" + src.split("://")[1];
      }
      return src;
    },
  },
  string: {
    copy(str: string) {
      copy(str);
    },
    fristUpper(str: string) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    firstUpperCase(str: string) {
      return str.replace(/^\S/, (s) => s.toUpperCase());
    },
    toFixString(str, length) {
      if (str && str.length > length) {
        return str.substr(0, length) + "...";
      } else {
        return str;
      }
    },
    truncate(fullStr = "", strLen, separator) {
      if (fullStr.length <= strLen) return fullStr;

      separator = separator || "...";

      var sepLen = separator.length,
        charsToShow = strLen - sepLen,
        frontChars = Math.ceil(charsToShow / 2),
        backChars = Math.floor(charsToShow / 2);

      return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
    },
    validAbi(abi: string): { abi: any[]; address: string } {
      try {
        JSON.parse(abi);
        const _abi = helper.json.safeParse(abi);
        if (!_abi) {
          return { abi: [], address: "" };
        }
        if (Array.isArray(_abi)) {
          return { abi: _abi, address: "" };
        } else if (_abi.abi && _abi.address) {
          return { abi: _abi.abi, address: _abi.address };
        } else if (_abi.abi && !_abi.addresses) {
          return { abi: _abi.abi, address: "" };
        }
        return { abi: [], address: "" };
      } catch (error) {
        return { abi: [], address: "" };
      }
    },
    random(count: number) {
      const chars = "abcdefghijklmnopqrstuvwxyz";
      let result = "";
      for (let i = 0; i < count; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    },
  },
  download: {
    downloadByBlob(name: string, blob: Blob) {
      const a = document.createElement("a");
      const href = window.URL.createObjectURL(blob);
      a.href = href;
      a.download = name;
      a.click();
    },
    downloadJSON(name: string, jsonObj: object) {
      try {
        const jsonStr: string = JSONFormat(jsonObj);
        const blob = new Blob([jsonStr], { type: "application/json" });
        this.downloadByBlob(name + ".json", blob);
      } catch (error) {
        console.error(error);
      }
    },
  },
  number: {
    countNonZeroNumbers: (str: string) => {
      let index = 0;
      const length = str.length;
      for (; index < length && (str[index] === "0" || str[index] === "."); index += 1);
      return length - index - Number(str.includes("."));
    },
    numberWithCommas(num: number) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    getBN: (value: number | string | BN) => {
      return value instanceof BN ? value : typeof value === "string" ? new BN(Number(value)) : new BN(value);
    },
    toPrecisionFloor: (str: number | string, options?: { decimals?: number; format?: string; toLocalString?: boolean }) => {
      const { decimals = 6, format = "", toLocalString = false } = options || {};
      if (!str || isNaN(Number(str))) return "";

      if (helper.number.countNonZeroNumbers(String(str)) <= decimals) return String(str);
      const numStr = new BN(str).toFixed();
      let result = "";
      let index = 0;
      const numLength = numStr.length;

      for (; numStr[index] === "0" && index < numLength; index += 1);

      if (index === numLength) return "0";

      if (numStr[index] === ".") {
        // number < 0
        result = "0";
        for (; (numStr[index] === "0" || numStr[index] === ".") && index < numLength; index += 1) {
          result = result + numStr[index];
        }
      }
      let resultNumLength = 0;
      for (; index < numLength && (resultNumLength < decimals || !result.includes(".")); index += 1) {
        result = result + numStr[index];

        if (numStr[index] !== ".") resultNumLength += 1;
      }
      if (format) {
        return numeral(Number(result)).format(format);
      }

      if (toLocalString) {
        return helper.number.numberWithCommas(Number(new BN(result).toFixed()));
      }

      return new BN(result).toFixed();
    },

    //format: '0,0'
    warpBigNumber(value: string, decimals = 18, options?: { format?: string; fallback?: string; min?: number }) {
      const { format = "0.0", fallback = "0.000", min } = options || {};
      if (!value) {
        return {
          value: "...",
          format: "...",
          originFormat: "...",
          decimals: "0",
          isZero: true,
        };
      }
      const BigNumberResponse = { value: new BigNumber(value), decimals };
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
    numberFormat(str: string | number, format: string = "0,0", options: { min?: number; fallback?: string } = {}): string {
      const { fallback = "0.00" } = options || {};

      if (!str || isNaN(Number(str))) return fallback;
      const numStr = new BigNumber(str).toFixed();
      const countNonZeroNumbers = (_str: string) => {
        const decimalPointIndex = _str.indexOf(".");
        if (decimalPointIndex === -1) {
          return 0;
        }
        const decimalPart = _str.substring(decimalPointIndex + 1);
        let trailingZerosCount = 0;
        for (let i = 0; i < decimalPart.length; i++) {
          if (decimalPart[i] === "0") {
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
      let preStr = numeral(fullStr.split(".")[0]).format(format.split(".")[0]);
      const fractionStr = fullStr.split(".")?.[1]?.slice(0, fractionDigits + numberFractionDigits);

      if (numberFractionDigits >= fractionDigits) {
        return (preStr + "." + fractionStr).replace(/\.?0+$/, "");
      }

      if (fractionStr?.[fractionDigits - 1] == "9") {
        return (preStr + "." + fractionStr.slice(0, fractionDigits - 1) + "9").replace(/\.?0+$/, "");
      }

      const resultStr = numeral(new BigNumber(numStr).toString()).format(format);
      return resultStr.replace(/\.?0+$/, "");
    },
  },
  address: {
    convertAddress: (addressMode: "io" | "0x", address: string = ""): string => {
      try {
        if (addressMode == "0x" && helper.address.validateIoAddress(address)) {
          return from(address).stringEth();
        }
        if (addressMode == "io" && helper.address.validateEthAddress(address)) {
          return from(address).string();
        }
      } catch (error) {}
      return address;
    },
    validateEthAddress: (address: string) => /^0x[a-fA-F0-9]{40}$/.test(address),
    validateIoAddress: (address: string) => /^io[a-zA-Z0-9]{39}$/.test(address),
    validateAddress: (address: string) => helper.address.validateEthAddress(address) || helper.address.validateIoAddress(address),
  },
};
