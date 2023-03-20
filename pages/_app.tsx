import {
  WagmiConfig,
  createClient,
  configureChains,
  mainnet,
  useSigner,
} from "wagmi";

import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { ThirdwebSDKProvider, ThirdwebProvider } from "@thirdweb-dev/react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <ThirdwebProvider activeChain="mumbai">
        <Component {...pageProps} />
      </ThirdwebProvider>
    </ChakraProvider>
  );
}
