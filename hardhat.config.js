require("@nomiclabs/hardhat-ethers");
require("dotenv").config(); // Make sure this line exists

const { SEPOLIA_RPC_URL, PRIVATE_KEY } = process.env; // Ensure these environment variables are set

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
  solidity: "0.8.18",
};
