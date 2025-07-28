import React, { useState } from 'react';
import { ethers } from 'ethers';
import GreenProofNFT from './abi/GreenProofNFT.json';


const CONTRACT_ADDRESS = '0xEA12ff45281316e5Dc102ac1b59E68340716852F';

function App() {
  const [account, setAccount] = useState(null);
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAccount(accounts[0]);
    } else {
      alert('MetaMask not detected!');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  // Function to upload file to IPFS using Pinata
  const uploadToIPFS = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const metadata = JSON.stringify({
    name: file.name,
  });
  formData.append("pinataMetadata", metadata);  // Add metadata

  const options = JSON.stringify({ 
    cidVersion: 0,
  });
  formData.append("pinataOptions", options);

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    body: formData,
    headers: {
      pinata_api_key: "bcb622214e072abc876d", // your actual Pinata key
      pinata_secret_api_key: "bc95cfa2ad83402e8cea718d1236d9b4e956c66920cab9ec044d2a25d5bcc03e",
    },
  });

  if (!res.ok) {
    throw new Error("IPFS upload failed");
  }

  const data = await res.json();
  const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
  return ipfsUrl;
};

// Function to mint NFT
const mintNFT = async () => {
  if (!image) {
    alert("Please upload an image!");
    return;
  }

  try {
  setStatus("Uploading image to IPFS...");

  const ipfsUrl = await uploadToIPFS(image); // ✅ This returns something like "https://gateway.pinata.cloud/ipfs/..."

  console.log("Image uploaded to IPFS:", ipfsUrl);

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const account = await signer.getAddress(); // ✅ get wallet address

  console.log("Minting to address:", account);

  const contract = new ethers.Contract(CONTRACT_ADDRESS, GreenProofNFT.abi, signer);

  setStatus("Minting NFT on blockchain...");
  
  // ✅ Correct: mintNFT(address, tokenURI)
  const tx = await contract.mintNFT(account, ipfsUrl); 
  await tx.wait();

  setStatus("✅ NFT Minted Successfully!");
} catch (err) {
  console.error(err);
  setStatus("❌ Minting failed");
}

};


  return (
    <div style={{ textAlign: 'center', padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🌱 GreenProof NFT Minting</h1>
      {!account ? (
        <button onClick={connectWallet}>Connect MetaMask</button>
      ) : (
        <>
          <p>Connected as: {account}</p>
          <input type="file" onChange={handleFileChange} accept="image/*" />
          <br /><br />
          <button onClick={mintNFT}>Mint NFT</button>
          <p>{status}</p>
        </>
      )}
    </div>
  );
}

export default App;
