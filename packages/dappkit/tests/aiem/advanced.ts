BigInt.prototype.toJSON = function () {
  return this.toString();
};
import { AIem } from '../../aiem';
import { Fields } from '../../lib/decorators';

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
    // new Promise(async () => {
    //   this.posts = posts.filter(i => i.user_Id === this.data.id).map(i => new Post({ ...i, user: this }))
    // })
  }

}



const test = new User({ data: { id: 2, firstName: "test", lastName: "test" } })

const test1 = await AIem.Query(User, {
  data: true,
  posts: {
    user: true
  }
})({})
console.log(test.fullName, test.posts)
console.log(test1.fullName, test1.posts)
