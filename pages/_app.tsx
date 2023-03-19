import { WagmiConfig, createClient, configureChains, mainnet,useSigner } from 'wagmi'
 
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
 
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { ChainId, ThirdwebSDKProvider } from "@thirdweb-dev/react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";

export default function App({ Component, pageProps }: AppProps) {

  // Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(
  [mainnet],
  [alchemyProvider({ apiKey: 'Qndk-B57nZhXni2qZNVeVy9YwwdCGyzL' }), publicProvider()],
)
 
// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: '...',
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
})
 
 function ThirdwebProvider({
  wagmiClient,
  children,
}: {
  wagmiClient: any;
  children: React.ReactNode;
}) {
  const { data: signer } = useSigner();

  return (
    <ThirdwebSDKProvider
      activeChain="mumbai"
      signer={signer as any}
      queryClient={wagmiClient.queryClient as any}
    >
      {children}
    </ThirdwebSDKProvider>
  );
}
 
  return (
    <ChakraProvider>
       <WagmiConfig client={client}>
        <ThirdwebProvider  wagmiClient={client} >
        <Component {...pageProps} />
        </ThirdwebProvider>
        </WagmiConfig>
    </ChakraProvider>
  );
}
