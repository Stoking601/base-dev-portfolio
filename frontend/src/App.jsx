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
        alert("Please fill address and amount");
        return;
      }

      if (!isAddress(to)) {
        alert("Invalid wallet address");
        return;
      }

      if (Number(amount) <= 0) {
        alert("Amount must be greater than 0");
        return;
      }

      setLoading(true);
      setTxStatus("Waiting for MetaMask confirmation...");

      const provider = await sendToken(
        to,
        amount
      );

      setTxStatus("Transaction Success!");

      // รีเฟรช Balance หลัง Transfer
      const balance = await loadBalance(
        provider,
        account
      );

      setBalance(formatUnits(balance, 18));

      const history = await loadTransfers(provider);

      setTransfers(history);

      setTo("");
      setAmount("");

      

    } catch (err) {
      console.error(err);

      setTxStatus(
        err.shortMessage ||
        err.reason ||
        err.message ||
        "Transaction Failed"
      );

    } finally {
      setLoading(false);
    }
  }

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