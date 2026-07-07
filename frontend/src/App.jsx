import { useState } from "react";
import {
  formatUnits,
  isAddress,
} from "ethers";
import MyToken from "./abi/MyToken.json";
import { CONTRACT_ADDRESS } from "./config";
import {
  loadContractData,
  loadBalance,
  loadTransfers,
  sendToken,
} from "./services/tokenService";
import WalletCard from "./components/WalletCard";
import TokenInfo from "./components/TokenInfo";
import TransferForm from "./components/TransferForm";
import TransferHistory from "./components/TransferHistory";
import useWallet from "./hooks/useWallet";
import { useEffect } from "react";
import Toast from "./components/Toast";
import { listenTransfers } from "./services/tokenService";
import { getErrorMessage } from "./utils/errorHandler";

function App() {
  const {
    account,
    provider,
    connectWallet,
  } = useWallet();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [balance, setBalance] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("info");

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(account);

      setCopyStatus("Address copied!");

      setTimeout(() => {
        setCopyStatus("");
      }, 2000);
    } catch (err) {
      console.error(err);
      setCopyStatus("Copy failed");
    }
  }
  // =========================
  // Connect walletgit
  // =========================
  async function handleConnectWallet() {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    const wallet = await connectWallet();

    if (!wallet) return;

    const provider = wallet.provider;
    const account = wallet.account;

    // โหลดข้อมูล Token
    const token = await loadContractData(provider);

    setName(token.name);
    setSymbol(token.symbol);
    setTotalSupply(formatUnits(token.totalSupply, 18));

    // โหลด Balance
    const balance = await loadBalance(
      provider,
      account
    );

    setBalance(formatUnits(balance, 18));

    // โหลด History
    const history = await loadTransfers(provider);

    setTransfers(history);
  }
  
  // =========================
  // Copy Wallet Address
  // =========================
  function copyAddress() {
    navigator.clipboard.writeText(account);

    setCopyStatus("Address copied!");

    setTimeout(() => {
      setCopyStatus("");
    }, 2000);
  }

  // =========================
  // Transfer token
  // =========================
  async function transferToken() {
    try {
      if (!to || !amount) {
        showToast("Please fill all fields", "error");
        return;
      }

      if (!isAddress(to)) {
        showToast("Invalid address", "error");
        return;
      }

      setLoading(true);
      showToast("Confirm transaction in MetaMask...", "info");

      const provider = await sendToken(to, amount);

      showToast("Transaction successful!", "success");

      const bal = await loadBalance(provider, account);
      setBalance(formatUnits(bal, 18));

      const history = await loadTransfers(provider);
      setTransfers(history);

      setTo("");
      setAmount("");

    } catch (err) {
      console.error(err);

      showToast(
        getErrorMessage(err),
        "error"
      );

    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    if (!account || !provider) return;

    async function refreshData() {
      try {
        // ===== Token Info =====
        const token = await loadContractData(provider);

        setName(token.name);
        setSymbol(token.symbol);
        setTotalSupply(formatUnits(token.totalSupply, 18));

        // ===== Balance =====
        const bal = await loadBalance(provider, account);
        setBalance(formatUnits(bal, 18));

        // ===== History =====
        const history = await loadTransfers(provider);
        setTransfers(history);

      } catch (err) {
        console.error("Refresh error:", err);
      }
    }

    refreshData();
  }, [account, provider]);


  useEffect(() => {
    if (!provider) return;

    const unsubscribe = listenTransfers(provider, (tx) => {
      setTransfers((prev) => [tx, ...prev]);

      showToast("New transfer detected", "info");
    });

    return () => unsubscribe();
  }, [provider]);


  function showToast(message, type = "info") {
    setToast(message);
    setToastType(type);

    setTimeout(() => {
      setToast("");
    }, 2500);
  }

  <Toast message={toast} type={toastType} />

  return (
    <div className="App">
      <h1>Base Dev Portfolio</h1>

      <button onClick={handleConnectWallet}>
        Connect MetaMask
      </button>

      {account && (
        <>
          <WalletCard
            account={account}
            copyAddress={copyAddress}
            copyStatus={copyStatus}
          />

          <TokenInfo
            name={name}
            symbol={symbol}
            totalSupply={totalSupply}
            balance={balance}
          />

          <TransferForm
            to={to}
            amount={amount}
            setTo={setTo}
            setAmount={setAmount}
            loading={loading}
            txStatus={txStatus}
            transferToken={transferToken}
          />
          

          <TransferHistory
            transfers={transfers}
          />
        </>
      )}
    </div>
  );
}

export default App;