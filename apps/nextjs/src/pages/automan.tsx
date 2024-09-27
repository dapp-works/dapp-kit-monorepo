import { AutoMan, RootStore } from "@dappworks/kit";
import { observer } from "mobx-react-lite";
import { AutoManTest } from "~/store/autoManTest";

const Page = observer(() => {
  const { autoManTest } = AutoMan.use({ autoManTest: RootStore.Get(AutoManTest) }, {
    autoManTest: {
      testList: true,
      noCallList: false
    }
  })
  return <div className="flex flex-col gap-2">
    {autoManTest.testList?.value?.map(i => <div key={i}>{i}</div>)}
    {autoManTest.noCallList?.value?.map(i => <div key={i}>{i}</div>)}
  </div>
})

export default Page;