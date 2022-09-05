// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  [deployer, user1, user2] = await ethers.getSigners();
  const blockNumBefore = await ethers.provider.getBlockNumber();
  const blockBefore = await ethers.provider.getBlock(blockNumBefore);
  timestamp = blockBefore.timestamp;

  const DummyToken = await hre.ethers.getContractFactory("DummyToken");
  const PresaleFactory = await hre.ethers.getContractFactory("PresaleFactory");

  const lbpFactory = await hre.ethers.getContractAt(
    "ILiquidityBootstrappingPoolFactory", "0x751A0bC0e3f75b38e01Cf25bFCE7fF36DE1C87DE"
  );

  const vault = await hre.ethers.getContractAt(
    "IVault", "0xBA12222222228d8Ba445958a75a0704d566BF2C8"
  );

  const presaleFactory = await PresaleFactory.deploy();

  const tokenA = await DummyToken.deploy("Token A", "TKNA");
  const tokenB = await DummyToken.deploy("Token B", "TKNB");

  console.log("Let's create the LBP contract")
  tokens = [tokenA.address, tokenB.address]
  if(tokenB.address < tokenA.address)
    tokens = [tokenB.address, tokenA.address]
  await presaleFactory.create(
    "My LBP",
    "MLBP",
    tokens/*tokens*/,
    [ethers.utils.parseEther("0.5"), ethers.utils.parseEther("0.5")] /*weights*/,
    ethers.utils.parseEther("0.1") /*swapFeePercentage*/,
    deployer.address/*owner*/,
    true /*swapEnabledOnStart*/
  )
  const lbp = await hre.ethers.getContractAt(
    "ILiquidityBootstrappingPool", await presaleFactory.lbpPoolAddress()
  );
  console.log("LBP created at: " + lbp.address)
  console.log()

  console.log("Now we add liquidity by joining the pool")
  await tokenA.approve(vault.address, ethers.utils.parseEther("100"))
  await tokenB.approve(vault.address, ethers.utils.parseEther("100"))

  const JOIN_KIND_INIT = 0;
  const initialBalances = [ethers.utils.parseEther("10"),ethers.utils.parseEther("10")]
  const initUserData =
      ethers.utils.defaultAbiCoder.encode(['uint256', 'uint256[]'], 
                                          [JOIN_KIND_INIT, initialBalances]);

  var joinPoolRequest = [
    tokens /*assets*/,
    initialBalances /*maxAmountsIn*/,
    initUserData /*userData*/,
    false /*fromInternalBalance*/
  ]
  await vault.joinPool(
    await lbp.getPoolId(),
    deployer.address,
    deployer.address,
    joinPoolRequest
  )
  console.log()

  console.log("Now we setup the release time")
  lbp.updateWeightsGradually(
    timestamp + 0 /*startTime*/,
    timestamp + 100 /*endTime*/,
    [ethers.utils.parseEther("0.4"), ethers.utils.parseEther("0.6")] /*endWeights*/
  )
  console.log()

  console.log("Let's test some swaps")
  const swap_kind = 0;
  const swap_struct = {
      poolId: await lbp.getPoolId(),
      kind: swap_kind,
      assetIn: tokenA.address,
      assetOut: tokenB.address,
      amount: ethers.utils.parseEther("1.0"),
      userData: '0x'
  };

  const fund_struct = {
      sender: deployer.address,
      fromInternalBalance: false,
      recipient: deployer.address,
      toInternalBalance: false
  };

  await vault.swap(
    swap_struct /*singleSwap*/,
    fund_struct /*funds*/,
    ethers.utils.parseEther("0.1") /*limit*/,
    timestamp + 100 /*deadline*/);

  console.log("A pool balance: " + ethers.utils.formatEther(await tokenA.balanceOf(vault.address)))
  console.log("B pool balance: " + ethers.utils.formatEther(await tokenB.balanceOf(vault.address)))
  console.log("LPB: " + ethers.utils.formatEther(await lbp.balanceOf(deployer.address)))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
