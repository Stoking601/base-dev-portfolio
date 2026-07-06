function WalletCard({
  account,
  copyAddress,
  copyStatus,
}) {
  return (
    <>
      <h3>Connected Wallet</h3>

      <p>{account}</p>

      <button onClick={copyAddress}>
        Copy Address
      </button>

      {copyStatus && (
        <p>{copyStatus}</p>
      )}
    </>
  );
}

export default WalletCard;