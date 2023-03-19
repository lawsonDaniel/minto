"use strict";
exports.__esModule = true;
/* eslint-disable jsx-a11y/alt-text */
var head_1 = require("next/head");
var image_1 = require("next/image");
var Button_1 = require("@/components/Button");
var Account_1 = require("@/components/Account");
var react_1 = require("@thirdweb-dev/react");
var wagmi_1 = require("wagmi");
var react_2 = require("react");
var react_3 = require("@chakra-ui/react");
var ethers_1 = require("ethers");
var parseIneligibility_1 = require("@/utils/parseIneligibility");
require("@rainbow-me/rainbowkit/styles.css");
var myEditionDropContractAddress = "0xa0B1De7eaC31f9ea2625e2fc7917af8F7905bA27";
function Home() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var editionDrop = react_1.useContract(myEditionDropContractAddress).contract;
    var contractMetadata = react_1.useContractMetadata(editionDrop).data;
    var tokenId = 0;
    var _l = react_2.useState(0), quantity = _l[0], setQuantity = _l[1];
    var _m = react_1.useClaimNFT(editionDrop), claimNft = _m.mutate, isLoading = _m.isLoading, error = _m.error;
    console.log(error, 'error');
    //get address of conected wallet
    var _o = wagmi_1.useAccount(), address = _o.address, connector = _o.connector, isConnected = _o.isConnected;
    var claimConditions = react_1.useClaimConditions(editionDrop);
    var activeClaimCondition = react_1.useActiveClaimConditionForWallet(editionDrop, address, tokenId);
    var claimerProofs = react_1.useClaimerProofs(editionDrop, address || "", tokenId);
    var claimIneligibilityReasons = react_1.useClaimIneligibilityReasons(editionDrop, {
        quantity: quantity,
        walletAddress: address || ""
    }, tokenId);
    var claimedSupply = react_1.useTotalCirculatingSupply(editionDrop, tokenId);
    var totalAvailableSupply = react_2.useMemo(function () {
        var _a;
        try {
            return ethers_1.BigNumber.from(((_a = activeClaimCondition.data) === null || _a === void 0 ? void 0 : _a.availableSupply) || 0);
        }
        catch (_b) {
            return ethers_1.BigNumber.from(1000000);
        }
    }, [(_a = activeClaimCondition.data) === null || _a === void 0 ? void 0 : _a.availableSupply]);
    var numberClaimed = react_2.useMemo(function () {
        return ethers_1.BigNumber.from(claimedSupply.data || 0).toString();
    }, [claimedSupply]);
    var numberTotal = react_2.useMemo(function () {
        var n = totalAvailableSupply.add(ethers_1.BigNumber.from(claimedSupply.data || 0));
        if (n.gte(1000000)) {
            return "";
        }
        return n.toString();
    }, [totalAvailableSupply, claimedSupply]);
    var priceToMint = react_2.useMemo(function () {
        var _a, _b, _c;
        var bnPrice = ethers_1.BigNumber.from(((_a = activeClaimCondition.data) === null || _a === void 0 ? void 0 : _a.currencyMetadata.value) || 0);
        return ethers_1.utils.formatUnits(bnPrice.mul(quantity).toString(), ((_b = activeClaimCondition.data) === null || _b === void 0 ? void 0 : _b.currencyMetadata.decimals) || 18) + " " + ((_c = activeClaimCondition.data) === null || _c === void 0 ? void 0 : _c.currencyMetadata.symbol);
    }, [
        (_b = activeClaimCondition.data) === null || _b === void 0 ? void 0 : _b.currencyMetadata.decimals,
        (_c = activeClaimCondition.data) === null || _c === void 0 ? void 0 : _c.currencyMetadata.symbol,
        (_d = activeClaimCondition.data) === null || _d === void 0 ? void 0 : _d.currencyMetadata.value,
        quantity,
    ]);
    var maxClaimable = react_2.useMemo(function () {
        var _a, _b, _c;
        var bnMaxClaimable;
        try {
            bnMaxClaimable = ethers_1.BigNumber.from(((_a = activeClaimCondition.data) === null || _a === void 0 ? void 0 : _a.maxClaimableSupply) || 0);
        }
        catch (e) {
            bnMaxClaimable = ethers_1.BigNumber.from(1000000);
        }
        var perTransactionClaimable;
        try {
            perTransactionClaimable = ethers_1.BigNumber.from(((_b = activeClaimCondition.data) === null || _b === void 0 ? void 0 : _b.maxClaimablePerWallet) || 0);
        }
        catch (e) {
            perTransactionClaimable = ethers_1.BigNumber.from(1000000);
        }
        if (perTransactionClaimable.lte(bnMaxClaimable)) {
            bnMaxClaimable = perTransactionClaimable;
        }
        var snapshotClaimable = (_c = claimerProofs.data) === null || _c === void 0 ? void 0 : _c.maxClaimable;
        if (snapshotClaimable) {
            if (snapshotClaimable === "0") {
                // allowed unlimited for the snapshot
                bnMaxClaimable = ethers_1.BigNumber.from(1000000);
            }
            else {
                try {
                    bnMaxClaimable = ethers_1.BigNumber.from(snapshotClaimable);
                }
                catch (e) {
                    // fall back to default case
                }
            }
        }
        var max;
        if (totalAvailableSupply.lt(bnMaxClaimable)) {
            max = totalAvailableSupply;
        }
        else {
            max = bnMaxClaimable;
        }
        if (max.gte(1000000)) {
            return 1000000;
        }
        return max.toNumber();
    }, [
        (_e = claimerProofs.data) === null || _e === void 0 ? void 0 : _e.maxClaimable,
        totalAvailableSupply,
        (_f = activeClaimCondition.data) === null || _f === void 0 ? void 0 : _f.maxClaimableSupply,
        (_g = activeClaimCondition.data) === null || _g === void 0 ? void 0 : _g.maxClaimablePerWallet,
    ]);
    var isSoldOut = react_2.useMemo(function () {
        var _a;
        try {
            return ((activeClaimCondition.isSuccess &&
                ethers_1.BigNumber.from(((_a = activeClaimCondition.data) === null || _a === void 0 ? void 0 : _a.availableSupply) || 0).lte(0)) ||
                numberClaimed === numberTotal);
        }
        catch (e) {
            return false;
        }
    }, [
        (_h = activeClaimCondition.data) === null || _h === void 0 ? void 0 : _h.availableSupply,
        activeClaimCondition.isSuccess,
        numberClaimed,
        numberTotal,
    ]);
    var canClaim = react_2.useMemo(function () {
        var _a;
        return (activeClaimCondition.isSuccess &&
            claimIneligibilityReasons.isSuccess &&
            ((_a = claimIneligibilityReasons.data) === null || _a === void 0 ? void 0 : _a.length) === 0 &&
            !isSoldOut);
    }, [
        activeClaimCondition.isSuccess,
        (_j = claimIneligibilityReasons.data) === null || _j === void 0 ? void 0 : _j.length,
        claimIneligibilityReasons.isSuccess,
        isSoldOut,
    ]);
    var buttonLoading = react_2.useMemo(function () { return isLoading || claimIneligibilityReasons.isLoading; }, [claimIneligibilityReasons.isLoading, isLoading]);
    var buttonText = react_2.useMemo(function () {
        var _a, _b;
        if (isSoldOut) {
            return "Sold Out";
        }
        if (canClaim) {
            var pricePerToken = ethers_1.BigNumber.from(((_a = activeClaimCondition.data) === null || _a === void 0 ? void 0 : _a.currencyMetadata.value) || 0);
            if (pricePerToken.eq(0)) {
                return "Mint (Free)";
            }
            return "Mint (" + priceToMint + ")";
        }
        if ((_b = claimIneligibilityReasons.data) === null || _b === void 0 ? void 0 : _b.length) {
            return parseIneligibility_1.parseIneligibility(claimIneligibilityReasons.data, quantity);
        }
        if (buttonLoading) {
            return "Checking eligibility...";
        }
        return "Claiming not available";
    }, [
        isSoldOut,
        canClaim,
        claimIneligibilityReasons.data,
        buttonLoading,
        (_k = activeClaimCondition.data) === null || _k === void 0 ? void 0 : _k.currencyMetadata.value,
        priceToMint,
        quantity,
    ]);
    return (React.createElement(React.Fragment, null,
        React.createElement(head_1["default"], null,
            React.createElement("title", null, "minto"),
            React.createElement("meta", { name: "description", content: "Generated by create next app" }),
            React.createElement("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
            React.createElement("link", { rel: "icon", href: "/favicon.ico" })),
        React.createElement("main", { className: "p-[20px]  h-full w-full" },
            React.createElement("header", { className: "w-full" },
                React.createElement("h5", { className: "font-[700] tracking-[1.5px] text-4xl text-red-600 mb-5 italic", style: {
                        fontFamily: "'Libre Baskerville', serif"
                    } }, "Minto")),
            React.createElement("section", { className: " md:grid-cols-2 grid grid-cols-1 lg:grid-cols-2   h-[700px] w-[100vw] " },
                React.createElement("div", null,
                    React.createElement("div", { className: "flex flex-col gap-2" },
                        React.createElement("h2", { className: "text-5xl tracking-[1.5px]", style: {
                                fontFamily: "'Libre Baskerville', serif"
                            } },
                            React.createElement("span", { className: "font-[700] tracking-[1.5px]" }, "Mint"),
                            "And",
                            React.createElement("span", { className: "font-[700] tracking-[1.5px]" }, "Sell"),
                            " "),
                        React.createElement("div", { className: "flex items-center" },
                            React.createElement("h2", { className: "text-5xl font-[700] tracking-[1.5px]", style: {
                                    fontFamily: "'Libre Baskerville', serif"
                                } }, "Web3"),
                            React.createElement(image_1["default"], { width: 64, height: 64, src: "https://img.icons8.com/wired/64/null/stormtrooper.png", alt: "" })),
                        React.createElement("h2", { className: "text-4xl tracking-[1.5px] bg-red-600 text-white w-[200px] p-2", style: {
                                fontFamily: "'Libre Baskerville', serif"
                            } }, "DigitalArt"),
                        React.createElement("p", { className: "mt-10 text-xl md:text-2xl", style: {
                                fontFamily: "'Raleway', sans-serif"
                            } }, "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod quasi porro iure esse rerum. Nam incidunt nihil aliquam libero veritatis?"),
                        React.createElement(Button_1.Profile, null),
                        React.createElement("div", { className: "bg-white w-[40%] h-full flex items-center justify-center " }))),
                React.createElement("div", null,
                    React.createElement("div", { className: "h-full w-[100%] md:w-[80%] lg:w-[70%] mx-auto mt-[20px] md:mt-0 " }, contractMetadata ? (React.createElement("div", { className: " flex flex-col  w-[90%] h-full  p-[10px] align-center gap-2 border-[2px] border-black" },
                        React.createElement("p", { className: "font-[600] text-center mt-10 tracking-[1.5px] text-xl uppercase", style: {
                                fontFamily: "'Raleway', sans-serif"
                            } }, contractMetadata === null || contractMetadata === void 0 ? void 0 : contractMetadata.name),
                        React.createElement(react_1.MediaRenderer, { className: "w-full h-[300px] mx-auto rounded-[10px] border-black border-[2px]", src: contractMetadata === null || contractMetadata === void 0 ? void 0 : contractMetadata.image, alt: (contractMetadata === null || contractMetadata === void 0 ? void 0 : contractMetadata.name) + " preview image" }),
                        React.createElement("p", { className: "font-[200] text-center mt-10 tracking-[1.5px] text-xl", style: {
                                fontFamily: "'Raleway', sans-serif"
                            } }, contractMetadata === null || contractMetadata === void 0 ? void 0 : contractMetadata.description),
                        React.createElement("p", { className: "font-[400] text-center my-5 tracking-[1.5px] text-xl", style: {
                                fontFamily: "'Raleway', sans-serif"
                            } }, "Quantity"),
                        React.createElement("div", { className: "flex items-center justify-center gap-[20px]" },
                            React.createElement("button", { onClick: function () { return setQuantity(function (_) { return _ + 1; }); }, disabled: quantity >= maxClaimable, className: "text-[20px] font-bold bg-slate-300 rounded-full h-[50px] w-[50px]" }, "+"),
                            React.createElement("span", null, quantity),
                            React.createElement("button", { onClick: function () { return setQuantity(function (_) { return _ - 1; }); }, disabled: quantity <= 1, className: "text-[20px] font-bold bg-slate-300 rounded-full h-[50px] w-[50px]" }, "-")),
                        React.createElement("p", { className: "font-[600] text-center mt-10 tracking-[1.5px] text-xl uppercase", style: {
                                fontFamily: "'Raleway', sans-serif"
                            } }, "Minting..."),
                        React.createElement("button", { disabled: isLoading, onClick: function () { return claimNft({ to: address,
                                tokenId: 0,
                                quantity: quantity
                            }); } }, isLoading ? 'loading' : "mint"))) : (React.createElement("div", { className: " flex flex-col  w-[90%] h-full  p-[10px] align-center gap-2 border-[2px] border-gray-300" },
                        React.createElement(react_3.SkeletonText, { mt: "4", noOfLines: 1, spacing: "4", skeletonHeight: "50px" }),
                        React.createElement(react_3.Skeleton, { height: "300px", width: "300px", mx: "auto", rounded: "10px" }),
                        React.createElement(react_3.Skeleton, { height: "250px", mt: "5" })))))),
            React.createElement("section", null,
                React.createElement(Account_1.Account, null)))));
}
exports["default"] = Home;
