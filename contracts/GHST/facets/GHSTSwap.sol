// SPDX-License-Identifier: MIT
pragma solidity >=0.6.6;


//import "../../shared/interfaces/Router.sol";
import "../../GHST/interfaces/IGHSTDiamond.sol";
import "hardhat/console.sol";
// File: contracts/interfaces/IUniswapV2Router01.sol

pragma solidity >=0.6.2;

interface IUniswapV2Router01 {
    function factory() external pure returns (address);
    function WETH() external pure returns (address);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB);
    function removeLiquidityETH(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountToken, uint amountETH);
    function removeLiquidityWithPermit(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountA, uint amountB);
    function removeLiquidityETHWithPermit(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountToken, uint amountETH);
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapTokensForExactTokens(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        payable
        returns (uint[] memory amounts);
    function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
        external
        returns (uint[] memory amounts);
    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        returns (uint[] memory amounts);
    function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)
        external
        payable
        returns (uint[] memory amounts);

    function quote(uint amountA, uint reserveA, uint reserveB) external pure returns (uint amountB);
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns (uint amountOut);
    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) external pure returns (uint amountIn);
    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);
    function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts);
}

contract Swap{
    

address quickSwapRouter= 0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff;
address constant GHST= 0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7;


event GHSTSwapComplete(uint _amountIn,uint amountOut, address indexed tokenOut);


function swapGhstToTokens(uint _GhstAmountIn,
        address[] calldata path,
        address _recipient) external returns(uint[] memory){
        require(path[0]==GHST,"SwapFacet: Can only swap from GHST");
        IUniswapV2Router01 quickSwap= IUniswapV2Router01(quickSwapRouter);
        IGHSTDiamond ghstToken= IGHSTDiamond(GHST);
        uint[] memory amounts=quickSwap.getAmountsOut(_GhstAmountIn, path);
        uint tokenAmountOutMin=amounts[amounts.length-1];
        require(ghstToken.allowance(_recipient,address(this))>=tokenAmountOutMin,"SwapFacet: Allowance not enough for transfer");
        ghstToken.approve((quickSwapRouter), _GhstAmountIn);
        require(ghstToken.transferFrom(msg.sender, address(this), _GhstAmountIn), 'SwapFacet: transferFrom failed.');
        require(ghstToken.allowance(_recipient,quickSwapRouter)>=tokenAmountOutMin,"UniswapRouter: Allowance not enough for swap");    
        uint[] memory amountsOut= quickSwap.swapExactTokensForTokens(_GhstAmountIn,tokenAmountOutMin,path,_recipient,block.timestamp);
        emit GHSTSwapComplete(_GhstAmountIn,amountsOut[amountsOut.length-1],path[path.length-1]);
        console.log(amountsOut[0]);
        console.log(amountsOut[1]);
        console.log(amountsOut[2]);
        console.log(amountsOut[3]);
        return amountsOut;
    
}





}