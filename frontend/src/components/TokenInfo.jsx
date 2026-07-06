// ==========================================
// Component : TokenInfo
// หน้าที่ : แสดงข้อมูลของ Token
// ==========================================

function TokenInfo({
  name,
  symbol,
  totalSupply,
  balance,
}) {
  return (
    <>
      {/* ========================= */}
      {/* Token Information */}
      {/* ========================= */}
      <h3>Token Info</h3>

      <p>
        <strong>Name:</strong> {name}
      </p>

      <p>
        <strong>Symbol:</strong> {symbol}
      </p>

      <p>
        <strong>Total Supply:</strong> {totalSupply}
      </p>

      <hr />

      {/* ========================= */}
      {/* Wallet Balance */}
      {/* ========================= */}
      <h3>My Balance</h3>

      <p>
        {balance} {symbol}
      </p>
    </>
  );
}

export default TokenInfo;