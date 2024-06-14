import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import * as dotenv from "dotenv";
import { string } from "hardhat/internal/core/params/argumentTypes";
dotenv.config();
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "ETHERSCAN_API_KEY"
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const LINEASCAN_API_KEY = process.env.LINEASCAN_API_KEY as string;

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  sourcify: {
    enabled: false
  },
  etherscan: {
    apiKey: {
      sepolia:ETHERSCAN_API_KEY,
      "linea-sepolia": LINEASCAN_API_KEY,
      "linea-mainnet": LINEASCAN_API_KEY
    },
    customChains: [
      {
        network: "linea-sepolia",
        chainId: 59141,
        urls: {
          apiURL: "https://api-sepolia.lineascan.build/api",
          browserURL: "https://sepolia.lineascan.build/"
        }
      },
      {
        network: "linea-mainnet",
        chainId: 59144,
        urls: {
          apiURL: "https://api.lineascan.build/api",
          browserURL: "https://lineascan.build/"
        }
      }
    ]
  },
  networks:{
    hardhat:{
      chainId: 31337,
      allowUnlimitedContractSize: true,
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 11155111,
    },
    "linea-sepolia":{
      url: `https://linea-sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 59141,
    },
    "linea-mainnet":{
      url: `https://linea-mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
    }
  }
};

export default config;
