import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from 'styled-components';
import './index.css';
import App from './App';
import GlobalStyles from './globalStyles';
import './i18n'
import LoadingComponent from './components/LodingComponent/LoadingComponent';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
  );

const theme = {
  white: "#FFFFFF",
  black: "#080A0E",
  blue: "#0381C5",
  light: "#F9FAFB",
  grayLight: "rgba(101, 119, 134, 0.8)",
  grayLighter: "rgba(101, 119, 134, 0.6)",
  gray: "#657786",
  blackText: "#2C2D3B"
}

root.render(
  <React.StrictMode>
    <Suspense fallback={<LoadingComponent/>}>
        <RecoilRoot>
          <ThemeProvider theme={theme}>
            <GlobalStyles/>
            <App />
          </ThemeProvider>
        </RecoilRoot>
    </Suspense>
  </React.StrictMode>
);

