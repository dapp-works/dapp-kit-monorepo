import '../styles/globals.css';
import React from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import { ClientLayout } from './clientLayout';
import { initStore } from '~/store';

const App = ({ Component, pageProps }) => {
  initStore()
  return (
    <ClientLayout>
      <Component {...pageProps} />
    </ClientLayout>
  );
};

export default App;
