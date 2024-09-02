BigInt.prototype.toJSON = function () {
  return this.toString();
};
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
  balanceOf: (address: any) => Promise<any>

  @Fields.read()
  totalSupply: any

  @Fields.read()
  decimals: any

  @Fields.read()
  token0: any
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
  approve: (receiver: string, amount: string) => Promise<string>


}

class IUniswapV2LPEntity extends UniswapV2LPEntity {

  @Fields.contract(() => IERC20Entity, 'token0')
  Token0: IERC20Entity

  @Fields.contract(() => IERC20Entity, async (e: UniswapV2LPEntity) => ({ address: await e.contract.read.token0(), chainId: e.chainId }))
  TokenOne: IERC20Entity

  @Fields.contract(() => IERC20Entity, async (e: UniswapV2LPEntity) => ([{ address: await e.contract.read.token0(), chainId: e.chainId }]))
  TokenMany: IERC20Entity[]
}

class IERC20Entity extends ERC20Entity {

  async _totalSupply(a: string) {
    const [value, decimals] = await Promise.all([this.contract.read.totalSupply(), this.contract.read.decimals()])
    return AIem.utils.autoFormat({ value: value.toString(), decimals, chainId: this.chainId, address: this.address })
  }
  async _balanceOf(address: any) {
    const [value, decimals] = await Promise.all([this.contract.read.balanceOf([address]), this.contract.read.decimals()])
    return AIem.utils.autoFormat({ value: value.toString(), decimals, chainId: this.chainId, address: this.address })
  }
  async foo() {
    return 123
  }
}



const main = async () => {
  // let user = null
  // const res = await Promise.all(["0xa41412dafd1f1c0ae90f9fe7f137ea10a1bb5daa", "0x123"].map(i => AIem.Query(IUniswapV2LPEntity, {
  //   totalSupply: true,
  //   balanceOf: user ? [user] : false,
  //   TokenMany: {
  //     _totalSupply: ["test"],
  //     _balanceOf: ["0xa41412dafd1f1c0ae90f9fe7f137ea10a1bb5daa"],
  //     approve: ["0xa41412dafd1f1c0ae90f9fe7f137ea10a1bb5daa", "1000000000000000000000000"],
  //     foo: true
  //   }
  // })({ address: i, chainId: "4689", })))

  // console.log(JSON.stringify(res, null, 2))


}

// setInterval(() => {
// main()
// }, 100)
// const resArr = await AIem.QueryMany(IUniswapV2LPEntity, {
//   totalSupply: true,
//   Token0: {
//     _totalSupply: ["test"],
//     _balanceOf: ["0xa41412dafd1f1c0ae90f9fe7f137ea10a1bb5daa"],
//     approve: ["0xa41412dafd1f1c0ae90f9fe7f137ea10a1bb5daa", "1000000000000000000000000"],
//   }
// })([{ address: "0xa41412dafd1f1c0ae90f9fe7f137ea10a1bb5daa", chainId: "4689", }])
// console.log(resArr[0])


const users = [
  { id: 1, firstName: "test1", lastName: "test1" },
  { id: 2, firstName: "test2", lastName: "test2" },
]
const posts = [
  { title: "Test Post", user_Id: 1 },
  { title: "Test Post 2", user_Id: 2 },
]

class Post {
  title: string
  user_Id: number

  @Fields.relation(() => User, async (e: Post) => new Promise(res => setTimeout(() => res({ data: users.find(i => i.id === e.user_Id) }), 1000)))
  user: User

  constructor(args: Partial<Post>) {
    Object.assign(this, args)
    this.user = new User({ data: users.find(i => i.id === this.user_Id) })
  }
}

class User {
  @Fields.custom(async (e: User) => new Promise(res => setTimeout(() => res(users.find(i => i.id === e.data.id)), 1000)))
  data = {
    id: 1,
    firstName: "",
    lastName: "",
  }

  @Fields.relation(() => Post, async (e: User) => new Promise(res => setTimeout(() => res(posts.filter(i => i.user_Id === e.data.id)), 1000)))
  posts: Post[] = []

  get fullName() {
    return `${this.data.firstName} ${this.data.lastName}`
  }

  constructor(args: Partial<User>) {
    Object.assign(this, args)
  }

}



const test = new User({ data: { id: 2, firstName: "test", lastName: "test" }, posts: [new Post({ title: "Test Post", user_Id: 2 })] })

const test1 = await AIem.Query(User, {
  data: true,
  posts: {
    user: true
  }
})({})
console.log(test.fullName, test.posts)
console.log(test1.fullName, test1.posts)
