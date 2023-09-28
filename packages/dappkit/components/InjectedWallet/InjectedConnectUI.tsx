import { ConnectUIProps, useConnect } from "@thirdweb-dev/react-core";
import { useCallback, useEffect, useRef, useState } from "react";
import { InjectedWallet, MetaMaskWallet } from "@thirdweb-dev/wallets";

// @ts-ignore 
export const InjectedConnectUI = (props: ConnectUIProps<InjectedWallet>) => {
  const [screen, setScreen] = useState<
    "connecting" | "scanning" | "get-started"
  >("connecting");
  const { walletConfig, close } = props;
  const connect = useConnect();
  const [errorConnecting, setErrorConnecting] = useState(false);

  const hideBackButton = props.supportedWallets.length === 1;

  const connectToExtension = useCallback(async () => {
    try {
      connectPrompted.current = true;
      setErrorConnecting(false);
      setScreen("connecting");
      //@ts-ignore
      await connect(walletConfig);
      close();
    } catch (e) {
      setErrorConnecting(true);
      console.error(e);
    }
  }, [close, connect, walletConfig]);

  const connectPrompted = useRef(false);
  useEffect(() => {
    if (connectPrompted.current) {
      return;
    }

    const isInstalled = walletConfig.isInstalled
      ? walletConfig.isInstalled()
      : false;

    // if loading
    (async () => {
      if (isInstalled) {
        connectToExtension();
      }
    })();
  }, [connectToExtension, walletConfig]);

  if (screen === "connecting") {
    return <div className="px-8 py-6 flex items-center justify-center">
      Connecting...
    </div>
  }

  if (screen === "get-started") {
    return (
      null
    );
  }


  return null;
};