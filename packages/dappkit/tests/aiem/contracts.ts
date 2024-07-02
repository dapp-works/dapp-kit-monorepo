
import { BigNumber } from "bignumber.js"
import { AIem } from "../../aiem";
import { PromiseHook } from "../../store/standard/PromiseHook";
import { ERC20, UniswapV2LPToken } from "./abi"



export class UniswapV2LPEntity {
  address: `0x${string}` = '0x';
  chainId = "1" as const


  constructor(args: Partial<UniswapV2LPEntity>) {
    Object.assign(this, args)
  }

  get contract() {
    return AIem.Get(UniswapV2LPToken, this.chainId, this.address)
  }

  Token0 = PromiseHook.wrap({
    func: async () => {
      return ERC20Entity.Get({ args: { address: await this.contract.read.token0(), chainId: this.chainId } })
    },
  });

  Token1 = PromiseHook.wrap({
    func: async () => {
      return ERC20Entity.Get({ args: { address: await this.contract.read.token1(), chainId: this.chainId } })
    },
  });

  totalSupply = PromiseHook.wrap({
    func: async () => {
      return this.contract.read.totalSupply()
    },
  });

  reverse = PromiseHook.wrap({
    func: async () => {
      return this.contract.read.getReserves()
    },
  });

  userInfo = PromiseHook.wrap({
    lazy: true,
    func: async (address: `0x${string}`) => {
      // if (this.userInfo.errorRetry < 5) {
      //   throw new Error("test")
      // }
      const [reverse, lpBalance, totalSupply, Token0, Token1] = await Promise.all([this.reverse.get(), this.contract.read.balanceOf([address]), this.totalSupply.get(), this.Token0.get(), this.Token1.get()])
      const lpShare = new BigNumber(lpBalance.toString()).dividedBy(totalSupply.toString())
      const [reverse0, reverse1] = reverse
      // console.log(reverse0, reverse1, lpShare, Token0.symbol.value, Token1.symbol.value, Token0.decimals.value, Token1.decimals.value)
      const lpBalance0 = lpShare.multipliedBy(reverse0.toString()).dividedBy(10 ** Token0.decimals.value)
      const lpBalance1 = lpShare.multipliedBy(reverse1.toString()).dividedBy(10 ** Token1.decimals.value)
      //
      return { lpShare, lpBalance0: `${lpBalance0} ${Token0.symbol.value}`, lpBalance1: `${lpBalance1} ${Token1.symbol.value}` }
    }
  })

  static Get = PromiseHook.Get(UniswapV2LPEntity);
}

export class ERC20Entity {
  address: `0x${string}` = '0x';
  chainId = "1" as const

  get contract() {
    return AIem.Get(ERC20, this.chainId, this.address)
  }

  symbol = PromiseHook.wrap({
    func: async () => {
      return this.contract.read.symbol()
    },
  });

  decimals = PromiseHook.wrap({
    func: async () => {
      return this.contract.read.decimals()
    },
  });

  constructor(args: Partial<ERC20Entity>) {
    Object.assign(this, args)
  }
  static Get = PromiseHook.Get(ERC20Entity);
}