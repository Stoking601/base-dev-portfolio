function Dashboard({
  totalTx,
  totalSent,
  totalReceived,
  uniqueWallets,
}) {
  return (
    <>
      <hr />

      <h3>📊 Dashboard</h3>

      <p>
        <strong>Total Transactions :</strong>{" "}
        {totalTx}
      </p>

      <p>
        <strong>Total Sent :</strong>{" "}
        {totalSent} BTK
      </p>

      <p>
        <strong>Total Received :</strong>{" "}
        {totalReceived} BTK
      </p>

      <p>
        <strong>Unique Wallets :</strong>{" "}
        {uniqueWallets}
      </p>
    </>
  );
}

export default Dashboard;