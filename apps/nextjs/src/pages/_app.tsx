import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { ClientLayout } from './clientLayout';
import { AppProvider } from '@dappworks/kit';

const App = ({ Component, pageProps }) => {
  return (
    <ClientLayout>
      <Component {...pageProps} />
    </ClientLayout>
  );
};

export default App;
