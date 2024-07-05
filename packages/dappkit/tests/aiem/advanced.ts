
import { AIem } from '../../aiem';
import { Fields } from '../../lib/decorators';
import { ERC20, UniswapV2LPToken } from './abi';


class UniswapV2LPEntity {
  address: `0x${string}` = '0x';
  chainId = "1" as const
  abi = UniswapV2LPToken

  @Fields.read()
  totalSupply: number

  @Fields.read()
  token0: string

  @Fields.contract<UniswapV2LPEntity, ERC20Entity>(() => ERC20Entity, 'token0')
  Token0: ERC20Entity


  @Fields.custom()
  async totalSupplyUSD() {
    const totalSuppy = await AIem.Get(UniswapV2LPToken, this.chainId, this.address).read.totalSupply()
    const price = 1
    return Number(totalSuppy) * price
  }

}

class ERC20Entity {
  address: `0x${string}` = '0x';
  chainId = "1" as const
  abi = ERC20

  @Fields.read()
  balanceOf: (address: string) => Promise<string>

  @Fields.write()
  approve: (receiver: string, amount: string) => Promise<string>

  @Fields.custom()
  async test(...args: string[]) {
    return args
  }

  @Fields.read()
  totalSupply: number
}

const res = await AIem.Query(UniswapV2LPEntity, {
  totalSupply: true,
  totalSupplyUSD: [],
  Token0: {
    address: true,
    totalSupply: true,
    balanceOf: ["0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852"],
    approve: ["0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852", "1000000000000000000000000"],
    test: ["1", 2]
  }
})([{ address: "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852", chainId: "1" }])

console.log(res[0])