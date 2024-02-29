"use client";

import GlobalStyle from "@/utils/GlobalStyle";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/store";
import { Provider } from "react-redux";
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'
import { ConfigProvider } from 'antd';
import { chain } from "@/common/config.js";
import StyledComponentsRegistry from "@/components/AntdRegistry";

createWeb3Modal({
    ethersConfig: defaultConfig({ 
      metadata: {
        name: 'My Website',
        description: 'My Website description',
        url: 'https://mywebsite.com', // origin must match your domain & subdomain
        icons: [],
      }
    }),
    chains: [chain],
    // Get projectId at https://cloud.walletconnect.com
    projectId: '00a2aff76270ce36b305c8c069d5c080',
    enableAnalytics: false,
    themeVariables: {
        // '--w3m-color-mix': '#ece2cf',
        // '--w3m-color-mix-strength': 40
    }
})

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StyledComponentsRegistry>
        <ConfigProvider
            theme={{
                token: {
                    colorText:"#fff",
                    colorIcon:"rgba(255,255,255,0.8)",
                    colorError:"#ff4d4f",
                    colorSuccess:"#52c41a",
                    colorBgElevated: '#303030',
                },
            }}
        >
          <PersistGate loading={null} persistor={persistor} >
              <Provider store={store}>
                {/* <Router>
                  <Routes>
                      <Route path={Path.Home} element={<Home />} />
                      <Route path={Path.MintGreat} element={<MintGreat />} />
                      <Route path={Path.MintBaby} element={<MintBaby />} />
                    </Routes>
                </Router> */}
                  {children}
                <GlobalStyle />
              </Provider>
          </PersistGate>
        </ConfigProvider>
      </StyledComponentsRegistry>
    </>
    );
};
