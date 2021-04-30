
/* global ethers hre */
/* eslint prefer-const: "off" */

//const { ethers } = require("ethers");

//const { LedgerSigner } = require('@ethersproject/hardware-wallets')

async function main () {
 

  let sampleAmountIn= 1000000000000000000
  let path= [0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7, 0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270, 0x7ceb23fd6bc0add59e62ac25578270cff1b9f619, 0xc2132d05d31c914a87c6611c10748aeb04b58e8f]
  let sampleAmountOut= 1091513
  let deadline= 1622367961

    //Deploying the swap contract
    const Swap = await ethers.getContractFactory("SwapGHST");
    const swap = await Swap.deploy();
    console.log("Swap contract deployed to:", swap.address);

    const ghstOwner= '0x740b74e09Ab2eF3Ae1785096C9586e9537cA1429'
                      
    const erc20Token= '0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7'
    let ghstHolder=await ethers.getSigner(ghstOwner)
   // console.log(ghstHolder)
    const erc20 = await ethers.getContractAt("IERC20",erc20Token, ghstHolder);
    let signer
    const testing = ['hardhat', 'localhost'].includes(hre.network.name)

    if (testing) {
      await hre.network.provider.request({
        method: 'hardhat_impersonateAccount',
        params: [ghstOwner]
      })

     // signer = await ethers.getSigner(ghstOwner)

    } else {
      throw Error('Incorrect network selected')
    }

   const swapContract = (await ethers.getContractAt('SwapGHST', swap.address,ghstHolder))
   console.log(swapContract)
    //approve the swap contract
    const tx = await erc20.approve(swap.address, ethers.constants.MaxUint256);
    //console.log(tx)
    const swapTx=await swap.swapGhstToTokens(sampleAmountIn,sampleAmountOut,path,'0x740b74e09Ab2eF3Ae1785096C9586e9537cA1429',deadline)
   // console.log(swapTx)

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
