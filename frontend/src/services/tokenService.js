// =========================================
// tokenService.js
// รวมฟังก์ชันที่ใช้ติดต่อ Smart Contract
// =========================================

import { Contract } from "ethers";
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