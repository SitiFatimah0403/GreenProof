// UploadImage.jsx
import React, { useState } from "react";
import axios from "axios";

const UploadImage = () => {
  const [file, setFile] = useState(null);
  const [ipfsUrl, setIpfsUrl] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadToPinata = async () => {
    if (!file) return alert("Please select a file first.");

    const formData = new FormData();
    formData.append("file", file);

    const metadata = JSON.stringify({
      name: file.name,
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    try {
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: "Infinity", // allow large files
        headers: {
          "Content-Type": `multipart/form-data`,
          pinata_api_key: "bcb622214e072abc876d", //My Pinata API key
          pinata_secret_api_key: "bc95cfa2ad83402e8cea718d1236d9b4e956c66920cab9ec044d2a25d5bcc03e",
        },
      });

      const cid = res.data.IpfsHash; // Get the IPFS hash from the response
      const url = `https://gateway.pinata.cloud/ipfs/${cid}`; // Construct the IPFS URL
      setIpfsUrl(url);
      alert("Upload successful! IPFS URL: " + url);
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }
  };

  return (
    <div>
      <h2>Upload Image to IPFS</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={uploadToPinata}>Upload to IPFS</button>

      {ipfsUrl && (
        <div>
          <p>Image uploaded to:</p>
          <a href={ipfsUrl} target="_blank" rel="noopener noreferrer">
            {ipfsUrl}
          </a>
          <br />
          <img src={ipfsUrl} alt="Uploaded to IPFS" width="300" />
        </div>
      )}
    </div>
  );
};

export default UploadImage;
