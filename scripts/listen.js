const { ethers } = require("ethers");

async function main() {

  const rpc = "http://127.0.0.1:8545";

  const provider = new ethers.JsonRpcProvider(rpc);

  const tokenAddress = "0xYOUR_CONTRACT_ADDRESS";

  const abi = [
    "event Transfer(address indexed from, address indexed to, uint256 value)"
  ];

  const token = new ethers.Contract(tokenAddress, abi, provider);

  console.log("👂 Listening for Transfer events...");

  token.on("Transfer", (from, to, value) => {
    console.log("🔔 Transfer detected");
    console.log("From:", from);
    console.log("To:", to);
    console.log("Value:", value.toString());
  });
}

main();