import { useState } from "react";
import {
  BrowserProvider,
  Contract,
  formatUnits,
  parseUnits,
  isAddress,
} from "ethers";
import MyToken from "./abi/MyToken.json";
import { CONTRACT_ADDRESS } from "./config";
import { getReadContract } from "./services/tokenService";

function App() {
  const [account, setAccount] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [balance, setBalance] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState("");
  

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
  // Load transfer history
  // =========================
  async function loadTransfers(provider) {
    const contract = getReadContract(provider);

    const latestBlock = await provider.getBlockNumber();

    const events = await contract.queryFilter(
      contract.filters.Transfer(),
      Math.max(0, latestBlock - 1000),
      latestBlock
    );

    const history = events
      .reverse()
      .map((event) => ({
        from: event.args[0],
        to: event.args[1],
        amount: formatUnits(event.args[2], 18),
        txHash: event.transactionHash,
      }));

    setTransfers(history);
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

    await Promise.all([
      loadContractData(provider),
      loadBalance(provider, accounts[0]),
      loadTransfers(provider),
    ]);
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

      setTxStatus("Transaction Pending...");

      await tx.wait();

      await Promise.all([
        loadBalance(provider, account),
        loadTransfers(provider),
      ]);

      setTo("");
      setAmount("");

      setTxStatus("Transaction Success!");

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
          <p>{balance} {symbol}</p>

          <hr />

          <h3>Transfer Token</h3>

          <input
            type="text"
            placeholder="Recipient Address"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            style={{ width: "420px", marginBottom: "10px" }}
          />

          <br />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ width: "200px", marginBottom: "10px" }}
          />

          <br />

          <button
            onClick={transferToken}
            disabled={loading}
          >
            {loading ? "Processing..." : "Send Token"}
            {txStatus && (
              <p>
                <strong>Status:</strong> {txStatus}
              </p>
            )}
          </button>

          <hr />

          <h3>Recent Transfers</h3>

          {transfers.length === 0 ? (
            <p>No transfers found.</p>
          ) : (
            <table
              border="1"
              cellPadding="8"
              style={{
                margin: "auto",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                  <th>Amount</th>
                  <th>Tx</th>
                </tr>
              </thead>

              <tbody>
                {transfers.map((tx, index) => (
                  <tr key={tx.txHash}>
                    <td>
                      {tx.from.slice(0, 6)}...
                      {tx.from.slice(-4)}
                    </td>

                    <td>
                      {tx.to.slice(0, 6)}...
                      {tx.to.slice(-4)}
                    </td>

                    <td>{tx.amount}</td>

                    <td>
                      <a
                        href={`https://sepolia.basescan.org/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

export default App;