import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from 'styled-components';
import './index.css';
import App from './App';
import GlobalStyles from './globalStyles';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import './i18n'
import LoadingComponent from './components/LodingComponent/LoadingComponent';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
  );

const theme = {
  dark: "#121616"
}

root.render(
  <React.StrictMode>
    <Suspense fallback={<LoadingComponent/>}>
      {/* <TonConnectUIProvider manifestUrl="https://ton-connect.github.io/demo-dapp/tonconnect-manifest.json"> */}
        <RecoilRoot>
          <ThemeProvider theme={theme}>
            <GlobalStyles/>
            <App />
          </ThemeProvider>
        </RecoilRoot>
      {/* </TonConnectUIProvider> */}
    </Suspense>
  </React.StrictMode>
);

