"use strict";
exports.__esModule = true;
exports.Profile = void 0;
var wagmi_1 = require("wagmi");
var react_1 = require("@chakra-ui/react");
var vsc_1 = require("react-icons/vsc");
function Profile() {
    var _a = wagmi_1.useAccount(), address = _a.address, connector = _a.connector, isConnected = _a.isConnected;
    var _b = wagmi_1.useConnect(), connect = _b.connect, connectors = _b.connectors, error = _b.error, isLoading = _b.isLoading, pendingConnector = _b.pendingConnector;
    var disconnect = wagmi_1.useDisconnect().disconnect;
    return (React.createElement("div", { className: "mt-10 flex flex-col gap-[10px]" },
        isConnected ? React.createElement("button", { className: "bg-black text-xl text-[100] h-[60px] w-[200px] text-white", onClick: function () { return disconnect(); } }, "Disconnect") : React.createElement(react_1.Menu, null,
            React.createElement(react_1.MenuButton, { as: react_1.Button, w: "200px", rounded: "0", h: "60px", style: {
                    color: "#fff",
                    background: "#000"
                }, rightIcon: React.createElement(vsc_1.VscChevronDown, null) }, "Connect Wallet"),
            React.createElement(react_1.MenuList, null, connectors
                .filter(function (connector) { return connector.ready; })
                .map(function (connector) { return (React.createElement(react_1.MenuItem, { key: connector === null || connector === void 0 ? void 0 : connector.id, className: "bg-black text-xl text-[100] h-[60px] w-[200px] text-white", onClick: function () { return connect({ connector: connector }); } },
                connector.name,
                isLoading &&
                    (connector === null || connector === void 0 ? void 0 : connector.id) === (pendingConnector === null || pendingConnector === void 0 ? void 0 : pendingConnector.id) &&
                    " (connecting)")); }))),
        error && React.createElement("div", { className: "text-red-500" }, error.message)));
}
exports.Profile = Profile;
