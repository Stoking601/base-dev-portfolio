function Toast({ message, type }) {
  if (!message) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        padding: "12px 16px",
        borderRadius: "8px",
        color: "white",
        background:
          type === "error" ? "#e74c3c" :
          type === "success" ? "#2ecc71" :
          "#3498db",
        zIndex: 9999,
      }}
    >
      {message}
    </div>
  );
}

export default Toast;