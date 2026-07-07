function ApproveForm({
  spender,
  amount,
  setSpender,
  setAmount,
  approveToken,
  loading,
}) {
  return (
    <>
      <h3>Approve Token</h3>

      <input
        type="text"
        placeholder="Spender Address"
        value={spender}
        onChange={(e) => setSpender(e.target.value)}
      />

      <br />
      <br />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <br />
      <br />

      <button
        onClick={approveToken}
        disabled={loading}
      >
        {loading ? "Approving..." : "Approve"}
      </button>
    </>
  );
}

export default ApproveForm;