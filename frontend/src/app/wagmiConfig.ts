import {cookieStorage, createConfig, createStorage, http} from "wagmi";
import {sepolia,mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    lineaSepolia} from "wagmi/chains";

const httpSepolia = process.env.NEXT_PUBLIC_INFURA_LINEA_SEPOLIA as string
export const wagmiConfig = createConfig({
    chains: [sepolia,mainnet, polygon, optimism, arbitrum, base,lineaSepolia],
    ssr: true,
    storage: createStorage({
        key:"nft-market",
        storage: cookieStorage,
    }),
    transports:{
        [lineaSepolia.id]: http(httpSepolia),
        [sepolia.id]: http(),
        [mainnet.id]: http(),
        [polygon.id]: http(),
        [optimism.id]: http(),
        [arbitrum.id]: http(),
        [base.id]: http(),
    },
})


import { nftAbi } from "@/constants/ContactMe.abi"

const addr = process.env.NEXT_PUBLIC_CONTRACT_ADDR as string
export const wagmiContractConfig = {
    address:addr as `0x${string}`,
    abi:nftAbi
}

