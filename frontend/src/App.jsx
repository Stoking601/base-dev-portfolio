import { useState } from "react";
import { BrowserProvider, Contract, formatUnits, parseUnits } from "ethers";
import MyToken from "./abi/MyToken.json";
import { CONTRACT_ADDRESS } from "./config";

function App() {
  const [account, setAccount] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [balance, setBalance] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  // =========================
  // Load contract data
  // =========================
  async function loadContractData(provider) {
    const contract = new Contract(
      CONTRACT_ADDRESS,
      MyToken.abi,
      provider
    );

    const tokenName = await contract.name();
    const tokenSymbol = await contract.symbol();
    const supply = await contract.totalSupply();

    setName(tokenName);
    setSymbol(tokenSymbol);
    setTotalSupply(formatUnits(supply, 18));
  }

  // =========================
  // Load balance
  // =========================
  async function loadBalance(provider, userAddress) {
    const contract = new Contract(
      CONTRACT_ADDRESS,
      MyToken.abi,
      provider
    );

    const bal = await contract.balanceOf(userAddress);

    setBalance(formatUnits(bal, 18));
  }

  // =========================
  // Connect wallet
  // =========================
  async function connectWallet() {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    const provider = new BrowserProvider(window.ethereum);

    const accounts = await provider.send("eth_requestAccounts", []);

    setAccount(accounts[0]);

    await loadContractData(provider);
    await loadBalance(provider, accounts[0]);
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

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new Contract(
        CONTRACT_ADDRESS,
        MyToken.abi,
        signer
      );

      const tx = await contract.transfer(
        to,
        parseUnits(amount, 18)
      );

      await tx.wait();

      // refresh balance after transfer
      await loadBalance(provider, account);

      alert("Transfer successful!");
    } catch (err) {
      console.error(err);
      alert("Transfer failed");
    }
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="App">
      <h1>Base Dev Portfolio</h1>

      <button onClick={connectWallet}>
        Connect MetaMask
      </button>

      {account && (
        <>
          <h3>Connected Wallet</h3>
          <p>{account}</p>

          <h3>Token Info</h3>
          <p>Name: {name}</p>
          <p>Symbol: {symbol}</p>
          <p>Total Supply: {totalSupply}</p>

          <h3>My Balance</h3>
          <p>{balance}</p>

          <h3>Transfer Token</h3>

          <input
            placeholder="To address"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />

          <input
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button onClick={transferToken}>
            Send Token
          </button>
        </>
      )}
    </div>
  );
}

export default App;