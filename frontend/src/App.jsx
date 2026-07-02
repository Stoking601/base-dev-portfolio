import { useState } from "react";
import { BrowserProvider } from "ethers";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    const provider = new BrowserProvider(window.ethereum);

    const accounts = await provider.send("eth_requestAccounts", []);

    setAccount(accounts[0]);
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
        </>
      )}
    </div>
  );
}

export default App;