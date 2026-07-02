import { useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import MyToken from "./abi/MyToken.json";
import { CONTRACT_ADDRESS } from "./config";
import { formatUnits } from "ethers";

function App() {
  const [account, setAccount] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [balance, setBalance] = useState("");

  // ⭐ ต้องอยู่นอก connectWallet
  async function loadContractData() {
    const provider = new BrowserProvider(window.ethereum);

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

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    const provider = new BrowserProvider(window.ethereum);

    const accounts = await provider.send("eth_requestAccounts", []);

    setAccount(accounts[0]);

    await loadContractData(); // ✅ ถูกแล้ว
    await loadBalance(accounts[0]); // ⭐ เพิ่มตรงนี้
  }

  async function loadBalance(userAddress) {
    const provider = new BrowserProvider(window.ethereum);

    const contract = new Contract(
      CONTRACT_ADDRESS,
      MyToken.abi,
      provider
    );

    const bal = await contract.balanceOf(userAddress);

    setBalance(formatUnits(bal, 18));
  }

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
          <h3>Token Info</h3>
          <p>Name: {name}</p>
          <p>Symbol: {symbol}</p>
          <p>Total Supply: {totalSupply}</p>

          <h3>My Balance</h3>
          <p>{balance}</p>
        </>
      )}
    </div>
  );
}

export default App;