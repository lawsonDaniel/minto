/* eslint-disable jsx-a11y/alt-text */
import Head from "next/head";
import Image from "next/image";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Profile } from "@/components/Button";
import {
  MediaRenderer,
  useActiveClaimConditionForWallet,
  useAddress,
  useClaimConditions,
  useClaimerProofs,
  useClaimIneligibilityReasons,
  useContract,
  useContractMetadata,
  useTotalCirculatingSupply,
  useClaimNFT
} from "@thirdweb-dev/react";
import { useAccount } from "wagmi";
import { useMemo, useState } from "react";
import { Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import { BigNumber, utils } from "ethers";
import { parseIneligibility } from "@/utils/parseIneligibility";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
const myEditionDropContractAddress =
  "0x6540D7c31d30554b1f31eF7F0882c3b13be762A1";

export default function Home() {
  const { contract: editionDrop } = useContract(myEditionDropContractAddress);
  const { data: contractMetadata } = useContractMetadata(editionDrop);
  const tokenId = 0;
  const [quantity, setQuantity] = useState(0);
const { mutate: claimNft,isLoading, error } = useClaimNFT(editionDrop)
console.log(error,'error')
  //get address of conected wallet
  const { address, connector, isConnected } = useAccount();
  const claimConditions = useClaimConditions(editionDrop);
  const activeClaimCondition = useActiveClaimConditionForWallet(
    editionDrop,
    address,
    tokenId
  );
  const claimerProofs = useClaimerProofs(editionDrop, address || "", tokenId);
  const claimIneligibilityReasons = useClaimIneligibilityReasons(
    editionDrop,
    {
      quantity,
      walletAddress: address || "",
    },
    tokenId
  );

  const claimedSupply = useTotalCirculatingSupply(editionDrop, tokenId);

  const totalAvailableSupply = useMemo(() => {
    try {
      return BigNumber.from(activeClaimCondition.data?.availableSupply || 0);
    } catch {
      return BigNumber.from(1_000_000);
    }
  }, [activeClaimCondition.data?.availableSupply]);

  const numberClaimed = useMemo(() => {
    return BigNumber.from(claimedSupply.data || 0).toString();
  }, [claimedSupply]);

  const numberTotal = useMemo(() => {
    const n = totalAvailableSupply.add(BigNumber.from(claimedSupply.data || 0));
    if (n.gte(1_000_000)) {
      return "";
    }
    return n.toString();
  }, [totalAvailableSupply, claimedSupply]);

  const priceToMint = useMemo(() => {
    const bnPrice = BigNumber.from(
      activeClaimCondition.data?.currencyMetadata.value || 0
    );
    return `${utils.formatUnits(
      bnPrice.mul(quantity).toString(),
      activeClaimCondition.data?.currencyMetadata.decimals || 18
    )} ${activeClaimCondition.data?.currencyMetadata.symbol}`;
  }, [
    activeClaimCondition.data?.currencyMetadata.decimals,
    activeClaimCondition.data?.currencyMetadata.symbol,
    activeClaimCondition.data?.currencyMetadata.value,
    quantity,
  ]);

  const maxClaimable = useMemo(() => {
    let bnMaxClaimable;
    try {
      bnMaxClaimable = BigNumber.from(
        activeClaimCondition.data?.maxClaimableSupply || 0
      );
    } catch (e) {
      bnMaxClaimable = BigNumber.from(1_000_000);
    }

    let perTransactionClaimable;
    try {
      perTransactionClaimable = BigNumber.from(
        activeClaimCondition.data?.maxClaimablePerWallet || 0
      );
    } catch (e) {
      perTransactionClaimable = BigNumber.from(1_000_000);
    }

    if (perTransactionClaimable.lte(bnMaxClaimable)) {
      bnMaxClaimable = perTransactionClaimable;
    }

    const snapshotClaimable = claimerProofs.data?.maxClaimable;

    if (snapshotClaimable) {
      if (snapshotClaimable === "0") {
        // allowed unlimited for the snapshot
        bnMaxClaimable = BigNumber.from(1_000_000);
      } else {
        try {
          bnMaxClaimable = BigNumber.from(snapshotClaimable);
        } catch (e) {
          // fall back to default case
        }
      }
    }

     let max;
    if (totalAvailableSupply.lt(bnMaxClaimable)) {
      max = totalAvailableSupply;
    } else {
      max = bnMaxClaimable;
    }

    if (max.gte(1_000_000)) {
      return 1_000_000;
    }
    return max.toNumber();
  }, [
    claimerProofs.data?.maxClaimable,
    totalAvailableSupply,
    activeClaimCondition.data?.maxClaimableSupply,
    activeClaimCondition.data?.maxClaimablePerWallet,
  ]);

  const isSoldOut = useMemo(() => {
    try {
      return (
        (activeClaimCondition.isSuccess &&
          BigNumber.from(activeClaimCondition.data?.availableSupply || 0).lte(
            0
          )) ||
        numberClaimed === numberTotal
      );
    } catch (e) {
      return false;
    }
  }, [
    activeClaimCondition.data?.availableSupply,
    activeClaimCondition.isSuccess,
    numberClaimed,
    numberTotal,
  ]);

  const canClaim = useMemo(() => {
    return (
      activeClaimCondition.isSuccess &&
      claimIneligibilityReasons.isSuccess &&
      claimIneligibilityReasons.data?.length === 0 &&
      !isSoldOut
    );
  }, [
    activeClaimCondition.isSuccess,
    claimIneligibilityReasons.data?.length,
    claimIneligibilityReasons.isSuccess,
    isSoldOut,
  ]);

  const buttonLoading = useMemo(
    () => isLoading || claimIneligibilityReasons.isLoading,
    [claimIneligibilityReasons.isLoading, isLoading]
  );
  const buttonText = useMemo(() => {
    if (isSoldOut) {
      return "Sold Out";
    }

    if (canClaim) {
      const pricePerToken = BigNumber.from(
        activeClaimCondition.data?.currencyMetadata.value || 0
      );
      if (pricePerToken.eq(0)) {
        return "Mint (Free)";
      }
      return `Mint (${priceToMint})`;
    }
    if (claimIneligibilityReasons.data?.length) {
      return parseIneligibility(claimIneligibilityReasons.data, quantity);
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
    activeClaimCondition.data?.currencyMetadata.value,
    priceToMint,
    quantity,
  ]);

 
  return (
    <>
      <Head>
        <title>minto</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="p-[20px]  h-full w-full">
        <header className="w-full">
          <h5
            className="font-[700] tracking-[1.5px] text-4xl text-red-600 mb-5 italic"
            style={{
              fontFamily: "'Libre Baskerville', serif",
            }}
          >
            Minto
          </h5>
        </header>
        <section className=" md:grid-cols-2 grid grid-cols-1 lg:grid-cols-2   h-[700px] w-[100vw] ">
          <div>
            <div className="flex flex-col gap-2">
              <h2
                className="text-5xl tracking-[1.5px]"
                style={{
                  fontFamily: "'Libre Baskerville', serif",
                }}
              >
                <span className="font-[700] tracking-[1.5px]">Mint</span>And
                <span className="font-[700] tracking-[1.5px]">Sell</span>{" "}
              </h2>

              <div className="flex items-center">
                <h2
                  className="text-5xl font-[700] tracking-[1.5px]"
                  style={{
                    fontFamily: "'Libre Baskerville', serif",
                  }}
                >
                  Web3
                </h2>
                <Image
                  width={64}
                  height={64}
                  src="https://img.icons8.com/wired/64/null/stormtrooper.png"
                  alt={""}
                />
              </div>
              <h2
                className="text-4xl tracking-[1.5px] bg-red-600 text-white w-[200px] p-2"
                style={{
                  fontFamily: "'Libre Baskerville', serif",
                }}
              >
                DigitalArt
              </h2>
              <p
                className="mt-10 text-xl md:text-2xl"
                style={{
                  fontFamily: "'Raleway', sans-serif",
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod
                quasi porro iure esse rerum. Nam incidunt nihil aliquam libero
                veritatis?
              </p>

              <Profile />
             
              <div className="bg-white w-[40%] h-full flex items-center justify-center "></div>
            </div>
          </div>
          <div>
            <div className="h-full w-[100%] md:w-[80%] lg:w-[70%] mx-auto mt-[20px] md:mt-0 ">
              {contractMetadata ? (
                <div className=" flex flex-col  w-[90%] h-full  p-[10px] align-center gap-2 border-[2px] border-black">
                  <p
                    className="font-[600] text-center mt-10 tracking-[1.5px] text-xl uppercase"
                    style={{
                      fontFamily: "'Raleway', sans-serif",
                    }}
                  >
                    {contractMetadata?.name}
                  </p>
                  {/* Image Preview of NFTs */}
                  <MediaRenderer
                    className="w-full h-[300px] mx-auto rounded-[10px] border-black border-[2px]"
                    src={contractMetadata?.image}
                    alt={`${contractMetadata?.name} preview image`}
                  />
                  <p
                    className="font-[200] text-center mt-10 tracking-[1.5px] text-xl"
                    style={{
                      fontFamily: "'Raleway', sans-serif",
                    }}
                  >
                    {contractMetadata?.description}
                  </p>
                  <p
                    className="font-[500] text-center mt-2 tracking-[1.5px] text-xl"
                    style={{
                      fontFamily: "'Raleway', sans-serif",
                    }}
                  >
                    Quantity
                  </p>
                  <div className="flex items-center justify-center gap-[20px] mb-2">
                    <button
                      onClick={() => setQuantity((_) => _ + 1)}
                       disabled={quantity >= maxClaimable}
                      className="text-[20px] font-bold bg-slate-300 rounded-full h-[50px] w-[50px] "
                    >
                      +
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={() => setQuantity((_) => _ - 1)}
                      disabled={quantity <= 1}
                      className="text-[20px] font-bold bg-slate-300 rounded-full h-[50px] w-[50px]"
                    >
                      -
                    </button>
                  </div>                 
                      {
                        isConnected &&  <button  className="bg-black text-xl text-[100] h-[60px] w-[200px] mx-auto text-white mt-2"  disabled={isLoading}
                       onClick={()=> claimNft({to: address,
                      tokenId:0,
                      quantity:quantity
                      })}
       >{isLoading ? 'Minting' : "Mint"}</button>
                      }
                </div>
              ) : (
                <div className=" flex flex-col  w-[90%] h-full mx-auto  p-[10px] align-center gap-2 border-[2px] border-gray-300">
                  <SkeletonText
                    mt="4"
                    noOfLines={1}
                    spacing="4"
                    skeletonHeight="50px"
                  />
                  <Skeleton
                    height="300px"
                    width="100%"
                    mx="auto"
                    rounded="10px"
                    
                  />
                  <Skeleton  height="250px" mt="5" />
                  
                </div>
              )}
            </div>
          </div>
        </section>
       
      </main>
    </>
  );
}
