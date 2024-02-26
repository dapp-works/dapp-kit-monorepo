import React from "react"
import { Store } from "../../store/standard/base";
import { useRouter } from "next/navigation";

export class RouterStore implements Store {
  sid = "RouterStore";
  autoObservable?: boolean = false;
  //@ts-ignore
  router: any = null;

  use() {
    const router = useRouter();
    this.router = router;
  }
  constructor(args: Partial<RouterStore> = {}) {
    Object.assign(this, args);
  }
}
