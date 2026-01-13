import { UniswapV2LPToken, ERC20 } from "./abi";
import { AIem } from "../../aiem";

// complex useage
export const aiem = AIem.Set({
  // cache: dexie
  contractMap: {
    ERC20,
    UniswapV2LPToken,
  },
  nameMap: {
    UniswapV2LPToken: {
      test: "1-0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852",
    },
    ERC20: {
      foo: "4689-0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852",
    },
  },
  funcMap: {
    ...AIem.defaultFuncMap,
    name: {
      ttl: 1000,
    },
  },
});

await aiem
  .Get("UniswapV2LPToken", "1", "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852", { rpcUrls: { default: { http: ["https://eth.llamarpc.com"] } } })
  .read.name()
  .then(console.log);

// await Promise.all(new Array(2).fill(1).map(i => aiem.Get("UniswapV2LPToken", "1", "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f185").read.name().then(console.log)))

// aiem.contracts.UniswapV2LPToken.test.read.symbol().then(console.log)

// // simple usage
AIem.Get(UniswapV2LPToken, "1", "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852").read.totalSupply().then(console.log);

// // encode
// AIem.Get(ERC20, "1", "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852").encode.approve(["0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852", BigInt(100000)]).then(console.log)
