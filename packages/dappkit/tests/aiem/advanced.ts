
import { AIem } from '../../aiem';
import { Fields } from '../../lib/decorators';
import { ERC20, UniswapV2LPToken } from './abi';


class UniswapV2LPEntity {
  address: `0x${string}` = '0x';
  chainId: string = "1"
  static abi = UniswapV2LPToken

  get contract() {
    return AIem.Get(UniswapV2LPToken, this.chainId, this.address)
  }

  @Fields.read()
  totalSupply: any

  @Fields.read()
  decimals: any

  @Fields.read()
  token0: any

  @Fields.contract<UniswapV2LPEntity, ERC20Entity>(() => ERC20Entity, 'token0')
  Token0: ERC20Entity
}

class ERC20Entity {
  address: `0x${string}` = '0x';
  chainId: string = "1"
  static abi = ERC20

  get contract() {
    return AIem.Get(ERC20, this.chainId, this.address)
  }

  @Fields.read()
  balanceOf: (address: string) => Promise<any>

  @Fields.read()
  totalSupply: any

  @Fields.write()
  approve: (receiver: string, amount: string) => Promise<any>
}

class IUniswapV2LPEntity extends UniswapV2LPEntity {
  @Fields.contract<UniswapV2LPEntity, IERC20Entity>(() => IERC20Entity, 'token0')
  Token0: IERC20Entity
}

class IERC20Entity extends ERC20Entity {

  @Fields.custom()
  async _totalSupply() {
    const [totalSupply, decimals] = await Promise.all([this.contract.read.totalSupply(), this.contract.read.decimals()])
    return AIem.utils.autoFormat({ value: totalSupply.toString(), decimals, chainId: this.chainId, address: this.address })
  }
  @Fields.custom()
  async _balanceOf(address: `0x${string}`) {
    const [totalSupply, decimals] = await Promise.all([this.contract.read.balanceOf([address]), this.contract.read.decimals()])
    return AIem.utils.autoFormat({ value: totalSupply.toString(), decimals, chainId: this.chainId, address: this.address })
  }
  foo() {
    return 123
  }
}

const res = await AIem.Query(IUniswapV2LPEntity, {
  totalSupply: true,
  Token0: {
    _totalSupply: true,
    _balanceOf: ["0xa41412dafd1f1c0ae90f9fe7f137ea10a1bb5daa"],
    approve: ["0xa41412dafd1f1c0ae90f9fe7f137ea10a1bb5daa", "1000000000000000000000000"],
  }
})({ address: "0xa41412dafd1f1c0ae90f9fe7f137ea10a1bb5daa", chainId: "4689", })

console.log(res.Token0, res.Token0.foo())