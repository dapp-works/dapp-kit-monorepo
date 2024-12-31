import { PromiseState } from "@dappworks/kit";
import { Button } from "@nextui-org/react";
import { observer, useLocalStore } from "mobx-react-lite";

const PromiseStateTest = observer(() => {
  const store = useLocalStore(() => ({
    promiseState: new PromiseState({
      defaultValue: [],
      autoAlert: false,
      function: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        throw new Error("test");
      },
      onError: (error) => {
        console.log('onError=>', error);
      },
    })
  }));
  return (
    <div className="mt-4 p-4">
      <Button
        color="primary"
        isLoading={store.promiseState.loading.value}
        onClick={() => {
          store.promiseState.call();
        }}
      >
        PromiseStateTest
      </Button>
    </div>
  )
})

export default PromiseStateTest;
