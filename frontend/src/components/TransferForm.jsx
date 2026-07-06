// ==========================================
// Component : TransferForm
// หน้าที่ : ฟอร์มสำหรับส่ง Token
// ==========================================

function TransferForm({
  to,
  amount,
  setTo,
  setAmount,
  loading,
  txStatus,
  transferToken,
}) {
  return (
    <>
      <hr />

      {/* ========================= */}
      {/* Transfer Form */}
      {/* ========================= */}
      <h3>Transfer Token</h3>

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

      {/* Send Button */}
      <button onClick={transferToken} disabled={loading}>
        {loading ? "Processing..." : "Send Token"}
      </button>

      {/* Transaction Status */}
      {txStatus && (
        <p>
          <strong>Status:</strong> {txStatus}
        </p>
      )}
    </>
  );
}

export default TransferForm;