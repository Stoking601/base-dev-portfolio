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