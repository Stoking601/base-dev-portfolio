const hre = require("hardhat");

async function main() {

  const Token = await hre.ethers.getContractFactory("MyToken");

  const token = await Token.deploy("Base Token", "BTK");

  await token.waitForDeployment();

  console.log("Contract deployed to:", await token.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});