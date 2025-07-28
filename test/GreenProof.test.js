const { expect } = require("chai");

describe("GreenProof", function () {
  it("should submit and verify a proof", async function () {
    const [owner, user1] = await ethers.getSigners();
    const GreenProof = await ethers.getContractFactory("GreenProof");
    const contract = await GreenProof.deploy();
    await contract.deployed();

    await contract.connect(user1).submitProof("Planting a tree", "Qm123...abc");

    const proofs = await contract.getProofs(user1.address);
    expect(proofs.length).to.equal(1);
    expect(proofs[0].description).to.equal("Planting a tree");

    await contract.verifyProof(user1.address, 0);
    const updatedProofs = await contract.getProofs(user1.address);
    expect(updatedProofs[0].verified).to.equal(true);
  });
});
