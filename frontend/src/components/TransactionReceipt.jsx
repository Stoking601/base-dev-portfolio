function TransactionReceipt({
  receipt,
  copyTxHash,
  copyHashStatus,
}) {
  if (!receipt) return null;

  return (
    <>
      <hr />

      <h3>Transaction Receipt</h3>

      <p>
        <strong>Block :</strong>{" "}
        {receipt.blockNumber}
      </p>

      <p>
        <strong>Gas Used :</strong>{" "}
        {receipt.gasUsed.toString()}
      </p>

      <p>
        <strong>Hash :</strong>
      </p>
      
      <p
        style={{
            wordBreak: "break-all",
        }}
      >
        {receipt.hash}
      </p>

      <button
        onClick={() =>
            copyTxHash(receipt.hash)
        }
      >
        Copy Hash
      </button>

      {copyHashStatus && (
        <p>{copyHashStatus}</p>
      )}

      <a
        href={`https://sepolia.basescan.org/tx/${receipt.hash}`}
        target="_blank"
        rel="noreferrer"
      >
        View on BaseScan
      </a>
    </>
  );
}

export default TransactionReceipt;