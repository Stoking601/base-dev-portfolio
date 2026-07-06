import { useState } from "react";
import { BrowserProvider } from "ethers";

export default function useWallet() {
  // =========================
  // Wallet State
  // =========================
  const [account, setAccount] = useState("");

  const [provider, setProvider] = useState(null);

  // =========================
  // Connect MetaMask
  // =========================
  async function connectWallet() {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    const provider = new BrowserProvider(window.ethereum);

    const accounts = await provider.send(
      "eth_requestAccounts",
      []
    );

    setProvider(provider);

    setAccount(accounts[0]);

    return {
      provider,
      account: accounts[0],
    };
  }

  return {
    account,
    provider,
    connectWallet,
  };
}