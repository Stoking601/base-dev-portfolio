import { useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import MyToken from "./abi/MyToken.json";
import { CONTRACT_ADDRESS } from "./config";

function App() {
  const [account, setAccount] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");

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

    setName(tokenName);
    setSymbol(tokenSymbol);
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
        </>
      )}
    </div>
  );
}

export default App;