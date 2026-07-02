const hre = require("hardhat");

async function main() {

  const [owner, user1] = await hre.ethers.getSigners();

  const tokenAddress = "0xYOUR_CONTRACT_ADDRESS";

  // ✅ ใช้แบบนี้แทน attach
  const token = await hre.ethers.getContractAt("MyToken", tokenAddress);

  console.log("Owner:", owner.address);

  const balance = await token.balanceOf(owner.address);
  console.log("Balance:", balance.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});