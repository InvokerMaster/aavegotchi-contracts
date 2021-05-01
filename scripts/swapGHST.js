
/* global ethers hre */
/* eslint prefer-const: "off" */

//const { ethers } = require("ethers");

//const { LedgerSigner } = require('@ethersproject/hardware-wallets')

async function main () {
 

  let sampleAmountIn= "1000000000000000000"
  let path= ["0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7", "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"]
  let sampleAmountOut= 1235456
  let deadline= 1622367961
  const testing = ['hardhat', 'localhost'].includes(hre.network.name)
  const ghstOwner= '0x740b74e09Ab2eF3Ae1785096C9586e9537cA1429'
                      
  const erc20Token= '0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7'
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
   // console.log(ghstHolder)
    const erc20 = await ethers.getContractAt("IERC20",erc20Token, ghstHolder);
    let signer
  

 
   const swapContract = (await ethers.getContractAt('Swap', swap.address)).connect(ghstHolder)
   const currentBal= await erc20.balanceOf(ghstOwner);
   console.log(currentBal.toString())
    //approve the swap contract
    const tx = await erc20.approve(swapContract.address, ethers.constants.MaxUint256);
    //console.log(tx)
    const swapTx=await swapContract.swapGhstToTokens(sampleAmountIn,sampleAmountOut,path,ghstOwner,deadline)
    console.log(swapTx)

/** 

 





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
