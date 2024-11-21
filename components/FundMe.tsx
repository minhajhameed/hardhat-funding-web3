"use client"

import { useState } from "react";
import { abi, contractAddress } from "@/constants";
import { ethers } from "../ethers-5.6.esm.min.js";

export default function FundMe() {
  const [ethAmount, setEthAmount] = useState("");
  const [balance, setBalance] = useState("");

  const getBalance = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      try {
        const contractBalance = await provider.getBalance(contractAddress);
        setBalance(ethers.utils.formatEther(contractBalance));
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const fund = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      try {
        const transactionResponse = await contract.fund({
          value: ethers.utils.parseEther(ethAmount),
        });
        await listenForTransactionMine(transactionResponse, provider);
        alert("Funding successful!");
      } catch (error) {
        console.error("Error funding:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const withdraw = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      try {
        const transactionResponse = await contract.withdraw();
        await listenForTransactionMine(transactionResponse, provider);
        alert("Withdrawal successful!");
      } catch (error) {
        console.error("Error withdrawing:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const listenForTransactionMine = (transactionResponse: any, provider: any) => {
    console.log(`Mining: ${transactionResponse.hash}`);
    return new Promise<void>((resolve, reject) => {
      provider.once(transactionResponse.hash, (transactionReceipt: any) => {
        console.log(`Mined with ${transactionReceipt.confirmations} confirmations.`);
        resolve();
      });
    });
  };

  return (
    <div>
      <button onClick={getBalance}>Get Balance</button>
      <p>Balance: {balance} ETH</p>
      <input
        type="number"
        placeholder="ETH Amount"
        value={ethAmount}
        onChange={(e) => setEthAmount(e.target.value)}
      />
      <button onClick={fund}>Fund</button>
      <button onClick={withdraw}>Withdraw</button>
    </div>
  );
}
