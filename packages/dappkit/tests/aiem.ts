import { iotex, mainnet } from 'viem/chains'
import { UniswapV2LPToken, ERC20 } from "./abi"
import { AIem } from '../aiem';
import { getContract } from 'viem';

//@ts-ignore
mainnet.rpcUrls.default.http = ['https://eth-mainnet.g.alchemy.com/v2/98OrGEtrNEQ0ZDs953HdB0l39NZaDTXb']
//@ts-ignore
mainnet.rpcUrls.default.webSocket = ["wss://eth-mainnet.g.alchemy.com/v2/98OrGEtrNEQ0ZDs953HdB0l39NZaDTXb"]


export const aiem = new AIem({
  chainMap: {
    "4689": iotex,
    "1": mainnet
  },
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
  }
});


aiem.Get("UniswapV2LPToken", "1", "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852").read.name().then(console.log)


aiem.contracts.UniswapV2LPToken.test.read.symbol().then(console.log)