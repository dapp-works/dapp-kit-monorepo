import { AppProvider, RootStore } from "@dappworks/kit";
import { RpcList, WalletConfigStore, WalletHistoryStore, WalletStore, WalletTransactionHistoryType } from "@dappworks/kit/wallet";
import { AIem } from '@dappworks/kit/aiem'
import { Button } from "@nextui-org/react";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { bsc, iotex, iotexTestnet, mainnet, polygon } from "viem/chains";
import { ERC20Abi } from "~/lib/abi";
import { observer } from "mobx-react-lite";
import { DialogStore } from "@dappworks/kit/plugins";
import { useEffect } from "react";
import { getComplexFormData } from "@dappworks/kit/form";

const Test = observer(() => {
  return <div className="flex flex-col gap-2">
    <AppProvider />
    <Button onClick={e => {
      try {
        getComplexFormData({
          title: 'test',
          modalSize: '5xl',
          formData: {
            form: {
              name: '',
              image: '',
              tags: '',
              price: 20
            }
          },
          formConfig: {
            form: {
            }
          },
          onBatchSubmit: async (formData, setLoading) => {
            console.log(formData)
          }
        })
      } catch (error) {
        console.log(error)
      }
    }}>getComplexFormData</Button>
  </div>
})

export default Test;