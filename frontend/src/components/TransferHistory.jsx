// ==========================================
// Component : TransferHistory
// หน้าที่ : แสดงประวัติการโอน Token
// ==========================================

function TransferHistory({ transfers }) {
  return (
    <>
      <hr />

      {/* ========================= */}
      {/* Transfer History */}
      {/* ========================= */}
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
            {transfers.map((tx) => (
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
  );
}

export default TransferHistory;