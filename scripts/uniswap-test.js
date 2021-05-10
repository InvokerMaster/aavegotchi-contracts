/**const { Fetcher,Route,Token,ChainId, } = require('quickswap-sdk')
//const UNISWAP= require('quickswap-sdk')
async function main(){
let GHSTTOKEN='0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7'
let USDTTOKEN= '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'

const GHST= new Token(ChainId.MATIC,GHSTTOKEN,18)
const USDT= new Token(ChainId.MATIC,USDTTOKEN,6)

const pair= await Fetcher.fetchPairData(GHST,USDT[GHST.chainId])
const route = new Route([pair],USDT[GHST.chainId])
console.log(route)
}
*


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
*/

  const { Fetcher, ChainId, Token,Route, Pair, TokenAmount, Trade, TradeType } = require('quickswap-sdk');
const ethers = require('ethers');
const prov = ethers.getDefaultProvider(
  'https://rpc-aavegotchi-mainnet.maticvigil.com/v1/1cfd7598e5ba6dcf0b4db58e8be484badc6ea08e'
);

async function main() {

  const ghst = await Fetcher.fetchTokenData(
    ChainId.MATIC,
    '0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7',
    prov,
    "Aavegotchi GHST",
    "GHST"
  );

  const usdc = await Fetcher.fetchTokenData(
    ChainId.MATIC,
    '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    prov,
    "USD Coin",
    "USDC"
  );
  let pair = await Fetcher.fetchPairData(
    ghst,
    usdc,
    prov
  );
  //console.log(ghst, usdc, pair);
 let pairData1= pair.reserveOf(usdc)
 let pairData2= pair.reserveOf(ghst)
let route= new Route([pair],ghst)

 console.log(route.path,(route.midPrice.toSignificant(6)))


  const trade1=new Trade(route,new TokenAmount(ghst,'10000000000000000000'), TradeType.EXACT_INPUT)
  const trade2=new Trade(route,new TokenAmount(ghst,'10000000000000000000'), TradeType.EXACT_INPUT)
  console.log(trade1.executionPrice.toSignificant(6))
  console.log(trade2.executionPrice.toSignificant(6))
  const deadline = Math.floor(Date.now() / 1000 ) + 60*20//20 mins
  console.log(deadline)
  }


main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error)
  process.exit(1)
})

//1000000
//232830643