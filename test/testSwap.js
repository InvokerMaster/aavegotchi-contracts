const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('Test one click swaps from GHST', async function () {
  

  
  const sampleAmountIn= "10000000000000000000"

  //best route i could find
  const path= [
    "0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7",
    "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
    "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"
  ]
  const erc20Token= path[0]
  const testing = ['hardhat', 'localhost'].includes(hre.network.name)
  const ghstOwner= '0x740b74e09Ab2eF3Ae1785096C9586e9537cA1429'
  const outputToken= path[path.length-1]

  before(async function () {
    const Swap = await ethers.getContractFactory("Swap");
    global.swap = await Swap.deploy();
    console.log("Swap contract deployed to:", swap.address);
    let ghstHolder=await ethers.getSigner(ghstOwner)
    global.erc20 = await ethers.getContractAt("IERC20",erc20Token, ghstHolder)
    global.swapContract =(await ethers.getContractAt('Swap', swap.address)).connect(ghstHolder)
    global.tokenQuery= await ethers.getContractAt("IERC20",outputToken);
    const tokenQuery= await ethers.getContractAt("IERC20",outputToken);
    global.currentBal= await tokenQuery.balanceOf(ghstOwner);
    currentBal=Number(currentBal.toString())
    let swapTxData
   
    if (testing) {
      await hre.network.provider.request({
        method: 'hardhat_impersonateAccount',
        params: [ghstOwner]
      })
    } else {
      throw Error('Incorrect network selected')
    }
  })

  it('swaps GHST to corresponding token', async function () {
    await erc20.approve(swap.address, ethers.constants.MaxUint256)
    const swapTx=await swapContract.swapGhstToTokens(sampleAmountIn,path,ghstOwner)
    swapTxData=await swapTx.wait()
    const events= swapTxData.events
    let outputTokenAmount=(((events[events.length-1]).args).amountOut)
    const outputToken=Number(outputTokenAmount.toString())
   // console.log(outputToken)
    let newBal= await tokenQuery.balanceOf(ghstOwner);
   newBal=Number(newBal.toString())
   //console.log(newBal)
  // console.log(currentBal)
    expect(newBal).to.equal((currentBal+outputToken))
    
     
  })

})