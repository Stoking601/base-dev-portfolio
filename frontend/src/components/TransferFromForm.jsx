function TransferFromForm({
  from,
  to,
  amount,
  setFrom,
  setTo,
  setAmount,
  transferFromToken,
  loading,
}) {
  return (
    <>
      <hr />

      <h3>Transfer From</h3>

      {/* Owner Address */}
      <input
        type="text"
        placeholder="Owner Address"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        style={{
          width: "420px",
          marginBottom: "10px",
        }}
      />

      <br />

      {/* Recipient Address */}
      <input
        type="text"
        placeholder="Recipient Address"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        style={{
          width: "420px",
          marginBottom: "10px",
        }}
      />

      <br />

      {/* Amount */}
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{
          width: "200px",
          marginBottom: "10px",
        }}
      />

      <br />

      <button
        onClick={transferFromToken}
        disabled={loading}
      >
        {loading
          ? "Processing..."
          : "Transfer From"}
      </button>
    </>
  );
}

export default TransferFromForm;