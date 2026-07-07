export function getErrorMessage(error) {
  return (
    error?.shortMessage ||
    error?.reason ||
    error?.message ||
    "Unknown error"
  );
}