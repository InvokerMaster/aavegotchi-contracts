
/* global ethers hre */
/* eslint prefer-const: "off" */




//const { LedgerSigner } = require('@ethersproject/hardware-wallets')

async function main () {
 

  let sampleAmountIn= "10000000000000000000"

  //best route i could find
  let path= [
    "0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7",
    "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
    "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"
  ]

  //let deadline= 1622367961
  const testing = ['hardhat', 'localhost'].includes(hre.network.name)
  const ghstOwner= '0x740b74e09Ab2eF3Ae1785096C9586e9537cA1429'
  const outputToken= path[path.length-1]
                      
  const erc20Token= path[0]
  if (testing) {
    await hre.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [ghstOwner]
    })


  } else {
    throw Error('Incorrect network selected')
  }


    //Deploying the swap contract
    const Swap = await ethers.getContractFactory("Swap");
    const swap = await Swap.deploy();
    console.log("Swap contract deployed to:", swap.address);


    let ghstHolder=await ethers.getSigner(ghstOwner)
    let outputTokenName
    let outputTokenAmount
    let outputTokenDec

   // console.log(ghstHolder)
    const erc20 = await ethers.getContractAt("IERC20",erc20Token, ghstHolder);
    const tokenQuery= await ethers.getContractAt("IERC20",outputToken);
    let swapTxData
  
 
   const swapContract =(await ethers.getContractAt('Swap', swap.address)).connect(ghstHolder)
   const currentBal= await erc20.balanceOf(ghstOwner);
  // console.log(currentBal.toString())
    //approve the swap contract
  
    await erc20.approve(swap.address, ethers.constants.MaxUint256)
    const swapTx=await swapContract.swapGhstToTokens(sampleAmountIn,path,ghstOwner)
    swapTxData=await swapTx.wait()
    //console.log(swapTxData)
    const events= swapTxData.events
    inputTokenName=await erc20.name()
    outputTokenName=await tokenQuery.name()
    outputTokenDec=await tokenQuery.decimals()
    outputTokenAmount= ((((events[events.length-1]).args).amountOut).toString()/10**outputTokenDec)
    //console.log(outputTokenAmount)
    console.log('successfully swapped',(sampleAmountIn/10**18),inputTokenName ,'for', outputTokenAmount,outputTokenName)
    
 //console.log((events[events.length-2]).decode)//.toString())
 // console.log((((events[events.length-1]).args).amountOut).toString())
/** 

 //





  let tx

  receipt = await tx.wait()
  if (!receipt.status) {
    throw Error(`Not Sent: ${tx.hash}`)
  }

*/
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
