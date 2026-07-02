const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {

  let token;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("MyToken");
    token = await Token.deploy("Base Token", "BTK");
    await token.waitForDeployment();
  });

  // =========================
  // 1. Deployment Test
  // =========================
  it("should set correct initial supply to owner", async function () {
    const balance = await token.balanceOf(owner.address);
    const totalSupply = await token.totalSupply();

    expect(balance).to.equal(totalSupply);
  });

  // =========================
  // 2. Transfer Test
  // =========================
  it("should transfer tokens correctly", async function () {
    await token.transfer(user1.address, 100);

    const balance = await token.balanceOf(user1.address);

    expect(balance).to.equal(100);
  });

  // =========================
  // 3. Fail Transfer Test
  // =========================
  it("should fail if balance is insufficient", async function () {
    await expect(
      token.connect(user1).transfer(owner.address, 1000)
    ).to.be.revertedWith("Insufficient balance");
  });

  // =========================
  // 4. Approve Test
  // =========================
  it("should approve allowance correctly", async function () {
    await token.approve(user1.address, 200);

    const allowance = await token.allowance(owner.address, user1.address);

    expect(allowance).to.equal(200);
  });

  // =========================
  // 5. TransferFrom Test
  // =========================
  it("should allow transferFrom with allowance", async function () {
    await token.approve(user1.address, 200);

    await token.connect(user1).transferFrom(owner.address, user2.address, 150);

    const balance = await token.balanceOf(user2.address);

    expect(balance).to.equal(150);
  });

});