"use client"

import { useState } from "react";

export default function ConnectButton() {
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        setIsConnected(true);
        console.log("Connected to wallet.");
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <button onClick={connectWallet}>
      {isConnected ? "Connected" : "Connect Wallet"}
    </button>
  );
}
