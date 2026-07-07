function TransactionReceipt({ receipt }) {
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