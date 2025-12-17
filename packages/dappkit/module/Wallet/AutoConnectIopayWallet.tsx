import { useEffect, useState, useCallback, useMemo } from 'react';
import { useConnect, useAccount } from 'wagmi';
import { helper } from '../../utils';

// Auto connect iopayWallet when available
export const AutoConnectIopayWallet = () => {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const [hasTriedAutoConnect, setHasTriedAutoConnect] = useState(false);

  // Memoize iopay detection to avoid repeated calculations
  const isIopayEnvironment = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return helper.env.isIopayMobile() && !!window.ethereum;
  }, []);

  // Memoize iopay connector lookup
  const iopayConnector = useMemo(() => {
    return connectors.find(
      (connector) =>
        connector.id?.toLowerCase().includes('iopay') ||
        connector.name?.toLowerCase().includes('iopay')
    );
  }, [connectors]);

  // Memoized auto connect function
  const attemptAutoConnect = useCallback(async () => {
    if (!iopayConnector || !isIopayEnvironment) {
      return;
    }

    try {
      await connect({ connector: iopayConnector });
    } catch (error) {
      // Silently handle connection failures (user rejection, etc.)
      console.debug('Auto connect iopayWallet failed:', error);
    }
  }, [connect, iopayConnector, isIopayEnvironment]);

  useEffect(() => {
    // Skip if already tried, already connected, or conditions not met
    if (hasTriedAutoConnect || isConnected || !isIopayEnvironment || !iopayConnector) {
      if (!hasTriedAutoConnect && (!isIopayEnvironment || !iopayConnector)) {
        setHasTriedAutoConnect(true);
      }
      return;
    }

    // Small delay to ensure wallet is fully initialized
    const timer = setTimeout(async () => {
      await attemptAutoConnect();
      setHasTriedAutoConnect(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [hasTriedAutoConnect, isConnected, isIopayEnvironment, iopayConnector, attemptAutoConnect]);

  return null;
};

