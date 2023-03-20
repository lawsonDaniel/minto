
import { ThirdwebProvider } from "@thirdweb-dev/react";
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
