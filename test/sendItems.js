
  /* global describe it before ethers */
const { expect } = require('chai')
const truffleAssert = require('truffle-assertions')

//This is a simple version of the deploy script without any of the Wearable Sets or SVGs. If you need to do SVG tests, you'll need to use /scripts/deploy.js instead of /deplyLight.js!

const { deployProject } = require('../scripts/deployLight.js')

describe('Deploying Contracts, SVG and Minting Items', async function () {
  before(async function () {
    this.timeout(10000000)
    const deployVars = await deployProject('deployTest')
    global.set = true
    global.account = deployVars.account
    global.aavegotchiDiamond = deployVars.aavegotchiDiamond
    global.aavegotchiFacet = deployVars.aavegotchiFacet
    global.itemsFacet = deployVars.itemsFacet
    global.itemsTransferFacet = deployVars.itemsTransferFacet
    global.collateralFacet = deployVars.collateralFacet
    global.shopFacet = deployVars.shopFacet
    global.daoFacet = deployVars.daoFacet
    global.ghstTokenContract = deployVars.ghstTokenContract
    global.vrfFacet = deployVars.vrfFacet
    global.svgFacet = deployVars.svgFacet
    global.linkAddress = deployVars.linkAddress
    global.linkContract = deployVars.linkContract
    global.vouchersContract = deployVars.vouchersContract
    global.diamondLoupeFacet = deployVars.diamondLoupeFacet
    global.metaTransactionsFacet = deployVars.metaTransactionsFacet
    global.erc1155MarketplaceFacet = deployVars.erc1155MarketplaceFacet
  })

  const totalUnequip=[
    0, 0, 0, 0, 0, 0,
    0, 0, 0,  0, 0, 0,
    0, 0, 0,  0
  ]

  let blueEquip=[
    114, 0, 0, 0, 0, 0,
    0, 0, 0,  0, 0, 0,
    0, 0, 0,  0
  ]

  let redEquip=[
    115, 0, 0, 0, 0, 0,
    0, 0, 0,  0, 0, 0,
    0, 0, 0,  0
  ]

  let staff1= [
    0, 0, 0, 0, 0, 64,
    0, 0, 0,  0, 0, 0,
    0, 0, 0,  0
  ]
  let staff2= [
    0, 0, 0, 0, 64, 64,
    0, 0, 0,  0, 0, 0,
    0, 0, 0,  0
  ]

  it('Should mint 10,000,000 GHST tokens', async function () {
    await global.ghstTokenContract.mint()
    const balance = await global.ghstTokenContract.balanceOf(global.account)
    const oneMillion = ethers.utils.parseEther('10000000')
    expect(balance).to.equal(oneMillion)
  })
  it('Should purchase items using GHST', async function () {
    const balance = await ghstTokenContract.balanceOf(account)
    await ghstTokenContract.approve(aavegotchiDiamond.address, balance)

    let balances = await global.itemsFacet.itemBalances(account)

  //  console.log('balances:',balances)
    // Start at 1 because 0 is always empty
    expect(balances.length).to.equal(0)

    // Hawaiian Shirt and SantaHat
    await global.shopFacet.purchaseItemsWithGhst(account, ['114', '115', '116', '126', '127', '128', '129','64'], ['10', '10', '10', '100', '10', '10', '10','2'])
    balances = await global.itemsFacet.itemBalances(account)

   // console.log('balances:',balances)

    const item114 = balances.find((item) => {
      return item.itemId.toString() === "114"
    })

    expect(item114.balance).to.equal(10)
   // console.log('balances:', balances[129].toString())
   // expect(balances[129]).to.equal(10)
  })

  it('Should purchase portal', async function () {
    const balance = await ghstTokenContract.balanceOf(account)
    await ghstTokenContract.approve(aavegotchiDiamond.address, balance)
    const buyAmount = ethers.utils.parseEther('500') // 1 portals
    const tx = await global.shopFacet.buyPortals(account, buyAmount)
    const receipt = await tx.wait()
    const myGotchis = await global.aavegotchiFacet.allAavegotchisOfOwner(account)
    //console.log(myGotchis)
   // const currentWearables=await (global.itemsFacet.equippedWearables(1))
   // console.log(currentWearables)
    expect(myGotchis.length).to.equal(5)
  })

  it('should reduce balance to 9 while equipping', async function(){
    
    await global.itemsFacet.equipWearables(1,redEquip)
    const currentWearables = await global.itemsFacet.equippedWearables(1)
    console.log('current:',currentWearables)

    expect(currentWearables[0]).to.equal(115)
    
    let currentItemBal = await(global.itemsFacet.balanceOf(global.account,115))
    console.log('balance:',currentItemBal.toString())
    expect(currentItemBal.toString()).to.equal('9')
   // console.log(currentWearables)

  
  })
  it('should increase balance back to item after unequipping', async function(){
    
    await global.itemsFacet.equipWearables(1,totalUnequip)
    const currentWearables=await (global.itemsFacet.equippedWearables(1))
    console.log(currentWearables)
    expect(currentWearables[0]).to.equal(0)
    let currentItemBal = await(global.itemsFacet.balanceOf(global.account,115))
    console.log('balance:',currentItemBal.toString())
    expect(currentItemBal.toString()).to.equal('10')
  })

  it('should equip a new item', async function(){
    
    await global.itemsFacet.equipWearables(1,blueEquip)
    const currentWearables=await (global.itemsFacet.equippedWearables(1))
    //console.log(currentWearables)
    expect(currentWearables[0].toString()).to.equal('114')
  })
  it('should unequip a new item and equip a new item', async function(){
    
    await global.itemsFacet.equipWearables(1,redEquip)
    const currentWearables=await (global.itemsFacet.equippedWearables(1))
    //console.log(currentWearables)
    expect(currentWearables[0].toString()).to.equal('115')
  })

  it('should have sent the previous item back while unequipping', async function() {
    let item114balance = await(global.itemsFacet.balanceOf(global.account,114))
    let item115balance = await(global.itemsFacet.balanceOf(global.account,115))
    expect(item114balance.toString()).to.equal('10')
    expect(item115balance.toString()).to.equal('9')
  })

  //unecessary tests
  /**
  it('should equip just one hand wearable item', async function(){
    
    await global.itemsFacet.equipWearables(1,staff1)
    const currentWearables=await (global.itemsFacet.equippedWearables(1))
    console.log(currentWearables)
    expect(currentWearables[5].toString()).to.equal('64')
  })
  it('should equip same hand wearable item in the other slot', async function(){
    
    await global.itemsFacet.equipWearables(1,staff2)
    const currentWearables=await (global.itemsFacet.equippedWearables(1))
   // console.log(currentWearables)
    expect(currentWearables[4].toString()).to.equal('64')
  })
*/
})