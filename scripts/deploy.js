// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  [deployer, user1, user2] = await ethers.getSigners();
  const DummyToken = await hre.ethers.getContractFactory("DummyToken");
  const PresaleFactory = await hre.ethers.getContractFactory("PresaleFactory");

  const lbpFactory = await hre.ethers.getContractAt(
    "ILiquidityBootstrappingPoolFactory", "0x751A0bC0e3f75b38e01Cf25bFCE7fF36DE1C87DE"
  );;

  const presaleFactory = await PresaleFactory.deploy();
  
  const tokenA = await DummyToken.deploy("Token A", "TKNA");
  const tokenB = await DummyToken.deploy("Token B", "TKNB");
  
  //await tokenA.approve(lbpFactory.address, ethers.utils.parseEther("100"))
  //await tokenB.approve(lbpFactory.address, ethers.utils.parseEther("100"))
  await presaleFactory.create(
    "My LBP",
    "MLBP",
    [tokenA.address, tokenB.address]/*tokens*/,
    [ethers.utils.parseEther("0.5"), ethers.utils.parseEther("0.5")] /*weights*/,
    ethers.utils.parseEther("0.1") /*swapFeePercentage*/,
    deployer.address/*owner*/,
    true /*swapEnabledOnStart*/
  )
  console.log(await presaleFactory.lbpPoolAddress())

  const lbp = await hre.ethers.getContractAt(
    "contracts/DummyToken.sol:IERC20", await presaleFactory.lbpPoolAddress()
  );

  console.log(await lbp.balanceOf(deployer.address))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
