import { PromiseState, Store } from "@dappworks/kit";

export class AutoManTest implements Store {
  sid = 'AutoManTest';

  testList = new PromiseState({
    function: async () => {
      return [1, 2, 3]
    }
  })

  noCallList = new PromiseState({
    function: async () => {
      return [4, 5, 6]
    }
  })
}