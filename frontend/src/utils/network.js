// =========================================
// Base Sepolia Network Configuration
// =========================================

export const BASE_SEPOLIA = {
  chainId: "0x14a34",
  chainName: "Base Sepolia",

  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },

  rpcUrls: [
    "https://sepolia.base.org",
  ],

  blockExplorerUrls: [
    "https://sepolia.basescan.org",
  ],
};

// =========================================
// Check Current Network
// =========================================
export async function checkNetwork() {
  const chainId =
    await window.ethereum.request({
      method: "eth_chainId",
    });

  return chainId === BASE_SEPOLIA.chainId;
}

// =========================================
// Switch Network
// =========================================
export async function switchNetwork() {
  await window.ethereum.request({
    method: "wallet_switchEthereumChain",

    params: [
      {
        chainId:
          BASE_SEPOLIA.chainId,
      },
    ],
  });
}