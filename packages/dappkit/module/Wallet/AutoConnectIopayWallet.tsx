import { useEffect, useRef } from 'react';
import { useConnect, useAccount } from 'wagmi';
import { helper } from '../../utils';

// Auto connect iopayWallet when available
export const AutoConnectIopayWallet = () => {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const hasTriedRef = useRef(false);

  useEffect(() => {
    // Skip if already tried or connected
    if (hasTriedRef.current || isConnected) return;

    // Check if we're in iopay environment
    const isIopayEnvironment = helper.env.isIopayMobile() && typeof window !== 'undefined' && !!window.ethereum;
    if (!isIopayEnvironment) {
      hasTriedRef.current = true;
      return;
    }

    // Find iopay connector
    const iopayConnector = connectors.find(connector =>
      connector.id?.toLowerCase().includes('iopay') ||
      connector.name?.toLowerCase().includes('iopay')
    );

    if (!iopayConnector) {
      hasTriedRef.current = true;
      return;
    }

    // Auto connect with small delay
    const timer = setTimeout(() => {
      try {
        connect({ connector: iopayConnector });
      } catch (error) {
        console.debug('Auto connect iopayWallet failed:', error);
      }
      hasTriedRef.current = true;
    }, 500);

    return () => clearTimeout(timer);
  }, [isConnected, connect, connectors]);

  return null;
};

