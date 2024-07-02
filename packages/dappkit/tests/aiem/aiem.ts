import { UniswapV2LPToken, ERC20 } from "./abi"
import { AIem } from '../../aiem';
import { UniswapV2LPEntity } from "./contracts"

// complex useage
export const aiem = new AIem({
  contractMap: {
    ERC20,
    UniswapV2LPToken
  },
  nameMap: {
    "UniswapV2LPToken": {
      "test": "1-0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852"
    },
    ERC20: {
      "foo": "4689-0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852"
    }
  },
  // getWallet: () => {
  //   return ???
  // }
});


aiem.Get("UniswapV2LPToken", "1", "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852").read.name().then(console.log)
aiem.contracts.UniswapV2LPToken.test.read.symbol().then(console.log)


// simple usage
AIem.Get(UniswapV2LPToken, "1", "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852").read.totalSupply().then(console.log)

UniswapV2LPEntity.Get({ args: { address: "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852", chainId: "1" } }).then(i => {
  console.log(i.Token0.value.symbol.value)
})