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

  // สร้าง Provider
  const provider = new BrowserProvider(window.ethereum);

  // ใช้ Wallet ของ MetaMask
  const signer = await provider.getSigner();

  // Contract สำหรับเขียนข้อมูล
  const contract = new Contract(
    CONTRACT_ADDRESS,
    MyToken.abi,
    signer
  );

  // ส่ง Transaction
  const tx = await contract.transfer(
    to,
    parseUnits(amount, 18)
  );

  // รอ Confirm
  await tx.wait();

  // คืน Provider กลับไปใช้ Refresh Balance
  return provider;
}