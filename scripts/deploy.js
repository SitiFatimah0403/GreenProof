const hre = require("hardhat");

async function main() {
  const Contract = await hre.ethers.getContractFactory("GreenProofNFT"); // Get the contract factory for GreenProofNFT
  const contract = await Contract.deploy(); 
  await contract.deployed();

  console.log(" ✅ GreenProofNFT deployed to:", contract.address);  // Log the deployed contract address
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
