"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var wagmi_1 = require("wagmi");
var alchemy_1 = require("wagmi/providers/alchemy");
var public_1 = require("wagmi/providers/public");
var coinbaseWallet_1 = require("wagmi/connectors/coinbaseWallet");
var injected_1 = require("wagmi/connectors/injected");
var metaMask_1 = require("wagmi/connectors/metaMask");
var walletConnect_1 = require("wagmi/connectors/walletConnect");
var react_1 = require("@thirdweb-dev/react");
require("@/styles/globals.css");
var react_2 = require("@chakra-ui/react");
function App(_a) {
    var Component = _a.Component, pageProps = _a.pageProps;
    // Configure chains & providers with the Alchemy provider.
    // Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
    var _b = wagmi_1.configureChains([wagmi_1.mainnet], [alchemy_1.alchemyProvider({ apiKey: 'Qndk-B57nZhXni2qZNVeVy9YwwdCGyzL' }), public_1.publicProvider()]), chains = _b.chains, provider = _b.provider, webSocketProvider = _b.webSocketProvider;
    // Set up client
    var client = wagmi_1.createClient({
        autoConnect: true,
        connectors: [
            new metaMask_1.MetaMaskConnector({ chains: chains }),
            new coinbaseWallet_1.CoinbaseWalletConnector({
                chains: chains,
                options: {
                    appName: 'wagmi'
                }
            }),
            new walletConnect_1.WalletConnectConnector({
                chains: chains,
                options: {
                    projectId: '...'
                }
            }),
            new injected_1.InjectedConnector({
                chains: chains,
                options: {
                    name: 'Injected',
                    shimDisconnect: true
                }
            }),
        ],
        provider: provider,
        webSocketProvider: webSocketProvider
    });
    function ThirdwebProvider(_a) {
        var wagmiClient = _a.wagmiClient, children = _a.children;
        var signer = wagmi_1.useSigner().data;
        return (React.createElement(react_1.ThirdwebSDKProvider, { activeChain: "mumbai", signer: signer, queryClient: wagmiClient.queryClient }, children));
    }
    return (React.createElement(react_2.ChakraProvider, null,
        React.createElement(wagmi_1.WagmiConfig, { client: client },
            React.createElement(ThirdwebProvider, { wagmiClient: client },
                React.createElement(Component, __assign({}, pageProps))))));
}
exports["default"] = App;
