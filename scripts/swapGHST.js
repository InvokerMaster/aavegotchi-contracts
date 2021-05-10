
/* global ethers hre */
/* eslint prefer-const: "off" */

//const { ethers } = require("ethers")




//const { LedgerSigner } = require('@ethersproject/hardware-wallets')

async function main () {
 

  let sampleAmountIn= "10000000000000000000" //10 tokens(if decimal is 18)
  let sampleAmountIn2='250000000' //2.5 tokens if decimal is 8
  //GHST--->USDT
  let path1= [
    "0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7",
    "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
    "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"
  ]

  //MATIC--->GHST
  let path2= ['0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', 
  '0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7']

  //GREEN---->GHST
  let path3= ['0x8A4001fD666BE272605c56BB956d11A46200Db81','0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619','0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270','0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7']
  const deadline = Math.floor(Date.now() / 1000 ) + 60*20//20 mins

  //let deadline= 1622367961
  const testing = ['hardhat', 'localhost'].includes(hre.network.name)
  const ghstOwner= '0x740b74e09Ab2eF3Ae1785096C9586e9537cA1429'
  const outputToken= path1[path1.length-1]
                      
  const erc20Token= path1[0]
  const erc20Token2=path3[0]
  if (testing) {
    await hre.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [ghstOwner]
    })


  } else {
    throw Error('Incorrect network selected')
  }

  let overrides={

    value: ethers.utils.parseEther('100')
  };


    //Deploying the swap contract
    const Swap = await ethers.getContractFactory("Swap");
    const swap = await Swap.deploy();
    console.log("Swap contract deployed to:", swap.address);

//defining vars
    let ghstHolder=await ethers.getSigner(ghstOwner)
    let outputTokenName
    let outputTokenAmount
    let outputTokenDec

   // console.log(ghstHolder)
    const erc20 = await ethers.getContractAt("contracts/shared/interfaces/IERC20.sol:IERC20",erc20Token, ghstHolder);
    const secondErc20= await ethers.getContractAt("contracts/shared/interfaces/IERC20.sol:IERC20",erc20Token2, ghstHolder);
    const tokenQuery= await ethers.getContractAt("contracts/shared/interfaces/IERC20.sol:IERC20",outputToken);
    let GHSTtoTokenData
    let MATICtoTokenData
    let tokenToGhstData
    let tokenInName
  
 
   const swapContract =(await ethers.getContractAt('Swap', swap.address)).connect(ghstHolder)
   const currentBal= await erc20.balanceOf(ghstOwner);
  // console.log(currentBal.toString())
    //approve the swap contract
  
    await erc20.approve(swap.address, ethers.constants.MaxUint256)
    await secondErc20.approve(swap.address, ethers.constants.MaxUint256)
   const swapTx=await swapContract.swapGhstToTokens(sampleAmountIn,path1,ghstOwner,deadline)
    const swapTx2= await swapContract.swapEthToGhst(path2,deadline,ghstOwner,overrides)
    const swapTx3= await swapContract.swapTokensToGhst(sampleAmountIn2,path3,ghstOwner,deadline)
    
   GHSTtoTokenData=await swapTx.wait()
    MATICtoTokenData=await swapTx2.wait()
      tokenToGhstData=await swapTx3.wait()
    const MATICtoTokenDataEvents= MATICtoTokenData.events
      const tokenToGhstDataEvents= tokenToGhstData.events
      tokenInName=await secondErc20.name()
      const ghstReceived=((((tokenToGhstDataEvents[tokenToGhstDataEvents.length-1]).args).ghstAmountOut).toString()/10**18)
      tokenIn=(((tokenToGhstDataEvents[tokenToGhstDataEvents.length-1]).args).tokenAmountIn)/10**8
      console.log('successfully swapped',tokenIn,tokenInName,'for', ghstReceived,'GHST')
    let maticIn=((MATICtoTokenDataEvents[MATICtoTokenDataEvents.length-1]).args).EthInWei
    let GhstOut= ((MATICtoTokenDataEvents[MATICtoTokenDataEvents.length-1]).args).amountOut
    console.log('successfully swapped', maticIn/10**18,'MATIC for', GhstOut/10**18,'GHST')
    //console.log(GHSTtoTokenData)
    const events= GHSTtoTokenData.events
    inputTokenName=await erc20.name()
    outputTokenName=await tokenQuery.symbol()
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
