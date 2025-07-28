import React, { useState } from 'react';
import { ethers } from 'ethers';
import GreenProofNFT from './abi/GreenProofNFT.json';

const CONTRACT_ADDRESS = '0xEA12ff45281316e5Dc102ac1b59E68340716852F';

function App() {
  const [account, setAccount] = useState(null); // User's connected wallet address
  const [image, setImage] = useState(null); // Image file to upload
  const [status, setStatus] = useState(''); // Status message for minting
  const [userAction, setUserAction] = useState(''); // User input for NFA
  const [nfaReply, setNfaReply] = useState(''); // Reply from NFA

  // Function to connect to MetaMask wallet
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

  // Function to handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  // Function to upload file to IPFS using Pinata
  const uploadToIPFS = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const metadata = JSON.stringify({ name: file.name });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({ cidVersion: 0 });
    formData.append('pinataOptions', options);

    const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      body: formData,
      headers: {
        pinata_api_key: 'bcb622214e072abc876d',
        pinata_secret_api_key: 'bc95cfa2ad83402e8cea718d1236d9b4e956c66920cab9ec044d2a25d5bcc03e',
      },
    });

    if (!res.ok) throw new Error('IPFS upload failed');

    const data = await res.json();
    return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
  };

  // Function to mint NFT on the blockchain
  const mintNFT = async () => {
    if (!image) {
      alert('Please upload an image!');
      return;
    }

    try {
      setStatus('Uploading image to IPFS...');
      const ipfsUrl = await uploadToIPFS(image);
      console.log('Image uploaded to IPFS:', ipfsUrl);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, GreenProofNFT.abi, signer);

      setStatus('Minting NFT on blockchain...');
      const tx = await contract.mintNFT(account, ipfsUrl);
      await tx.wait();

      setStatus('✅ NFT Minted Successfully!');
    } catch (err) {
      console.error(err);
      setStatus('❌ Minting failed');
    }
  };

  // Function to handle NFA reply
  const handleAskNFA = async () => {
    try {
      const res = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=AIzaSyC26NvQ19KbzojC6gIL7iUOX2w5cYWRxAA', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: userAction }),
      });

      const data = await res.json();
      setNfaReply(data.reply);
    } catch (err) {
      console.error(err);
      setNfaReply('⚠️ Failed to get suggestion from NFA.');
    }
  };

  // Render the main application UI
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

          <hr style={{ margin: '2rem 0' }} />

          <h2>🤖 Ask GreenProof NFA</h2>
          <input
            type="text"
            value={userAction}
            onChange={(e) => setUserAction(e.target.value)}
            placeholder="Describe your eco-action"
            style={{ padding: '0.5rem', width: '60%' }}
          />
          <br /><br />
          <button onClick={handleAskNFA}>Get NFA Suggestion</button>
          <p style={{ marginTop: '1rem' }}>{nfaReply}</p>
        </>
      )}
    </div>
  );
}

export default App;
