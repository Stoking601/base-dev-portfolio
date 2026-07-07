import { useEffect, useState } from "react";
import { BrowserProvider } from "ethers";
import {
  checkNetwork,
  switchNetwork,
} from "../utils/network";

export default function useWallet() {
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);

  async function connectWallet() {
    const eth = window.ethereum;
    if (!eth) return;

    const provider = new BrowserProvider(eth);

    const correctNetwork =
      await checkNetwork();

    if (!correctNetwork) {
      await switchNetwork();
    }

    const accounts = await provider.send("eth_requestAccounts", []);

    setAccount(accounts[0]);
    setProvider(provider);

    return { provider, account: accounts[0] };
  }

  // 🔥 AUTO RECONNECT
  useEffect(() => {
    async function auto() {
      if (!window.ethereum) return;

      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_accounts", []);

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setProvider(provider);
      }
    }

    auto();
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        setAccount("");
        setProvider(null);
        return;
      }

      setAccount(accounts[0]);
    };

    window.ethereum.on(
      "accountsChanged",
      handleAccountsChanged
    );

    return () => {
      window.ethereum.removeListener(
        "accountsChanged",
        handleAccountsChanged
      );
    };
  }, []);

  return {
    account,
    provider,
    connectWallet,
  };
}