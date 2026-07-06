// =========================================
// tokenService.js
// รวมฟังก์ชันที่ใช้ติดต่อ Smart Contract
// =========================================

import {
  Contract,
  BrowserProvider,
  parseUnits,
  formatUnits,
} from "ethers";
import MyToken from "../abi/MyToken.json";
import { CONTRACT_ADDRESS } from "../config";

// =========================================
// สร้าง Read Contract
// ใช้อ่านข้อมูลจาก Blockchain
// =========================================
export function getReadContract(provider) {
  return new Contract(
    CONTRACT_ADDRESS,
    MyToken.abi,
    provider
  );
}

// =========================================
// Load Token Information
// อ่านข้อมูลพื้นฐานของ Token
//
// Return
// {
//    name,
//    symbol,
//    totalSupply
// }
// =========================================
export async function loadContractData(provider) {

  // สร้าง Contract
  const contract = getReadContract(provider);

  // อ่านข้อมูลจาก Blockchain
  const tokenName = await contract.name();
  const tokenSymbol = await contract.symbol();
  const supply = await contract.totalSupply();

  // คืนค่ากลับไปให้ App.jsx
  return {
    name: tokenName,
    symbol: tokenSymbol,
    totalSupply: supply,
  };
}

// =========================================
// Load Wallet Balance
// อ่านจำนวน Token ของ Wallet
//
// Parameter
// provider
// userAddress
//
// Return
// balance
// =========================================
export async function loadBalance(provider, userAddress) {

  // ใช้ Read Contract
  const contract = getReadContract(provider);

  // อ่าน Balance
  const balance = await contract.balanceOf(userAddress);

  // คืนค่า
  return balance;
}

// =========================================
// Load Transfer History
// อ่านประวัติการโอนย้อนหลัง
//
// Parameter
// provider
//
// Return
// Array ของ Transfer History
// =========================================
export async function loadTransfers(provider) {

  // ใช้ Read Contract
  const contract = getReadContract(provider);

  // Block ล่าสุด
  const latestBlock = await provider.getBlockNumber();

  // Query Event ย้อนหลัง 1000 Block
  const events = await contract.queryFilter(
    contract.filters.Transfer(),
    Math.max(0, latestBlock - 1000),
    latestBlock
  );

  // แปลงข้อมูลให้อ่านง่าย
  return events.reverse().map((event) => ({
    from: event.args[0],
    to: event.args[1],
    amount: formatUnits(event.args[2], 18),
    txHash: event.transactionHash,
  }));
}

// =========================================
// Transfer Token
// ส่ง Token ไปยัง Wallet ปลายทาง
//
// Return
// Transaction Receipt
// =========================================
export async function sendToken(to, amount) {
  if (!window.ethereum) {
    throw new Error("MetaMask not found");
  }
  try {
    const provider = new BrowserProvider(window.ethereum);

    // สำคัญ: ขอ signer ใหม่ให้ชัวร์
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();

    const contract = new Contract(
      CONTRACT_ADDRESS,
      MyToken.abi,
      signer
    );

    // แปลงค่า
    const parsedAmount = parseUnits(amount.toString(), 18);

    // =========================
    // DEBUG SECTION (สำคัญ)
    // =========================
    const sender = await signer.getAddress();
    const balance = await contract.balanceOf(sender);

    console.log("Sender:", sender);
    console.log("Balance:", formatUnits(balance, 18));
    console.log("To:", to);
    console.log("Amount:", amount);

    // =========================
    // PRE-CHECK (กัน revert)
    // =========================
    if (balance < parsedAmount) {
      throw new Error("Insufficient balance (frontend check)");
    }

    if (to.toLowerCase() === sender.toLowerCase()) {
      throw new Error("Cannot send to yourself");
    }

    // =========================
    // TRY CALL (decode error ได้ชัดขึ้น)
    // =========================
    try {
      await contract.transfer.staticCall(to, parsedAmount);
    } catch (err) {
      console.error("STATICCALL ERROR:", err);
      throw new Error(
        err?.reason || "Contract will revert (pre-check failed)"
      );
    }

    // =========================
    // SEND TX
    // =========================
    const tx = await contract.transfer(to, parsedAmount);

    await tx.wait();

    return provider;

  } catch (err) {
    console.error("SEND TOKEN ERROR:", err);
    throw err;
  }
}


export function listenTransfers(provider, callback) {
  const contract = getReadContract(provider);

  contract.on("Transfer", (from, to, amount, event) => {
    callback({
      from,
      to,
      amount: formatUnits(amount, 18),
      txHash: event.log.transactionHash,
    });
  });

  return () => {
    contract.removeAllListeners("Transfer");
  };
}