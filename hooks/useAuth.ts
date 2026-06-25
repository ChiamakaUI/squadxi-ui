
// "use client";

// import { usePrivy, useWallets } from "@privy-io/react-auth";

// export function useAuth() {
//   const { user, authenticated, ready, login, logout, getAccessToken } = usePrivy();
//   const { wallets } = useWallets();

//   // Privy v3: Solana embedded wallets have type "solana" and
//   // walletClientType "privy". Fall back to checking address format
//   // (Solana addresses are base58, never start with "0x").
//   const solanaWallet = wallets.find(
//     (w) =>
//       (w as any).chainType === "solana" ||
//       (w as any).type === "solana" ||
//       ((w as any).walletClientType === "privy" &&
//         w.address &&
//         !w.address.startsWith("0x"))
//   );

//   const getToken = async (): Promise<string> => {
//     const token = await getAccessToken();
//     if (!token) throw new Error("Not authenticated");
//     return token;
//   };

//   return {
//     user,
//     authenticated,
//     ready,
//     login,
//     logout,
//     getToken,
//     walletAddress: solanaWallet?.address,
//     solanaWallet,
//   };
// }

"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useWallets } from "@privy-io/react-auth/solana";

export function useAuth() {
  const { user, authenticated, ready, login, logout, getAccessToken } =
    usePrivy();

  // useWallets from the /solana sub-path returns Solana-specific wallet
  // objects that include signAndSendTransaction — the correct Privy v3 API.
  const { wallets } = useWallets();

  // With walletChainType: "solana-only" and createOnLogin: "all-users",
  // the first wallet in the list is always our embedded Solana wallet.
  const solanaWallet = wallets[0] ?? null;

  const getToken = async (): Promise<string> => {
    const token = await getAccessToken();
    if (!token) throw new Error("Not authenticated");
    return token;
  };

  return {
    user,
    authenticated,
    ready,
    login,
    logout,
    getToken,
    walletAddress: solanaWallet?.address ?? null,
    solanaWallet,
  };
}