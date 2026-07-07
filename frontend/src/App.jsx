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
  transferFromToken,
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
import ApproveForm from "./components/ApproveForm";
import TransferFromForm from "./components/TransferFromForm";
import { approveToken } from "./services/tokenService";
import AllowanceCard from "./components/AllowanceCard";
import { getAllowance } from "./services/tokenService";
import TransactionReceipt from "./components/TransactionReceipt";
import Dashboard from "./components/Dashboard";


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
  const [spender, setSpender] = useState("");
  const [approveAmount, setApproveAmount] = useState("");
  const [allowance, setAllowance] =
  useState("0");
  // =========================
  // Transfer From State
  // =========================
  const [fromAddress, setFromAddress] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [copyHashStatus, setCopyHashStatus] = useState("");
  const [totalSent, setTotalSent] = useState(0);
  const [totalReceived, setTotalReceived] = useState(0);
  const [uniqueWallets, setUniqueWallets] = useState(0);


  async function handleApprove() {
    try {
      setLoading(true);

      const result =
        await approveToken(
          spender,
          approveAmount
        );

      setReceipt(result.receipt);

      showToast(
        "Approve Success",
        "success"
      );

      await checkAllowance();

      setSpender("");
      setApproveAmount("");

    } catch (err) {
      showToast(
        getErrorMessage(err),
        "error"
      );

    } finally {
      setLoading(false);
    }
  }

  async function checkAllowance() {
    try {
      if (!provider) return;

      const value =
        await getAllowance(
          provider,
          account,
          spender
        );

      setAllowance(
        formatUnits(value, 18)
      );

    } catch (err) {
      console.error(err);
    }
  }

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

    let wallet;

    try {
      wallet = await connectWallet();

    } catch (err) {

      showToast(
        "Please switch to Base Sepolia",
        "error"
      );

      return;
    }

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

    let sent = 0;
    let received = 0;

    const wallets = new Set();

    history.forEach((tx) => {

      wallets.add(tx.from);

      wallets.add(tx.to);

      if (
        tx.from.toLowerCase() ===
        account.toLowerCase()
      ) {
        sent += Number(tx.amount);
      }

      if (
        tx.to.toLowerCase() ===
        account.toLowerCase()
      ) {
        received += Number(tx.amount);
      }

    });

    setTotalSent(sent);

    setTotalReceived(received);

    setUniqueWallets(wallets.size);

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

      const result = await sendToken(
        to,
        amount
      );

      const provider = result.provider;

      setReceipt(result.receipt);

      showToast("Transaction successful!", "success");

      const bal = await loadBalance(provider, account);
      setBalance(formatUnits(bal, 18));

      const history = await loadTransfers(provider);
      setTransfers(history);

      let sent = 0;
      let received = 0;

      const wallets = new Set();

      history.forEach((tx) => {

        wallets.add(tx.from);

        wallets.add(tx.to);

        if (
          tx.from.toLowerCase() ===
          account.toLowerCase()
        ) {
          sent += Number(tx.amount);
        }

        if (
          tx.to.toLowerCase() ===
          account.toLowerCase()
        ) {
          received += Number(tx.amount);
        }

      });

      setTotalSent(sent);

      setTotalReceived(received);

      setUniqueWallets(wallets.size);

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

        let sent = 0;
        let received = 0;

        const wallets = new Set();

        history.forEach((tx) => {

          wallets.add(tx.from);

          wallets.add(tx.to);

          if (
            tx.from.toLowerCase() ===
            account.toLowerCase()
          ) {
            sent += Number(tx.amount);
          }

          if (
            tx.to.toLowerCase() ===
            account.toLowerCase()
          ) {
            received += Number(tx.amount);
          }

        });

        setTotalSent(sent);

        setTotalReceived(received);

        setUniqueWallets(wallets.size);

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

  // =========================
  // Transfer From
  // =========================
  async function handleTransferFrom() {
    try {
      setLoading(true);

      const result = await transferFromToken(
        fromAddress,
        transferTo,
        transferAmount
      );

      const provider = result.provider;

      setReceipt(result.receipt);

      showToast(
        "Transfer From Success",
        "success"
      );

      // Refresh Balance
      const bal = await loadBalance(
        provider,
        account
      );

      setBalance(formatUnits(bal, 18));

      // Refresh History
      const history = await loadTransfers(provider);

      setTransfers(history);

      let sent = 0;
      let received = 0;

      const wallets = new Set();

      history.forEach((tx) => {

        wallets.add(tx.from);

        wallets.add(tx.to);

        if (
          tx.from.toLowerCase() ===
          account.toLowerCase()
        ) {
          sent += Number(tx.amount);
        }

        if (
          tx.to.toLowerCase() ===
          account.toLowerCase()
        ) {
          received += Number(tx.amount);
        }

      });

      setTotalSent(sent);

      setTotalReceived(received);

      setUniqueWallets(wallets.size);

      // Refresh Allowance
      const value = await getAllowance(
        provider,
        fromAddress,
        account
      );

      setAllowance(
        formatUnits(value, 18)
      );

      // Clear Form
      setFromAddress("");
      setTransferTo("");
      setTransferAmount("");

    } catch (err) {

      showToast(
        getErrorMessage(err),
        "error"
      );

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!provider || !account) return;

    async function refresh() {
      const token = await loadContractData(provider);

      setName(token.name);
      setSymbol(token.symbol);
      setTotalSupply(formatUnits(token.totalSupply, 18));

      const bal = await loadBalance(
        provider,
        account
      );

      setBalance(formatUnits(bal, 18));

      const history =
        await loadTransfers(provider);

      setTransfers(history);
    }

    refresh();

  }, [account]);

  <Toast message={toast} type={toastType} />

  async function copyTxHash(hash) {
    try {

      await navigator.clipboard.writeText(hash);

      setCopyHashStatus("Copied!");

      setTimeout(() => {
        setCopyHashStatus("");
      }, 2000);

    } catch {

      setCopyHashStatus("Copy failed");
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

          <Dashboard
            totalTx={transfers.length}
            totalSent={totalSent}
            totalReceived={totalReceived}
            uniqueWallets={uniqueWallets}
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

          <ApproveForm
            spender={spender}
            amount={approveAmount}
            setSpender={setSpender}
            setAmount={setApproveAmount}
            approveToken={handleApprove}
            loading={loading}
          />

          <AllowanceCard
            allowance={allowance}
          />
          
          <TransferFromForm
            from={fromAddress}
            to={transferTo}
            amount={transferAmount}
            setFrom={setFromAddress}
            setTo={setTransferTo}
            setAmount={setTransferAmount}
            transferFromToken={handleTransferFrom}
            loading={loading}
          />

          <TransactionReceipt
            receipt={receipt}
            copyTxHash={copyTxHash}
            copyHashStatus={copyHashStatus}
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