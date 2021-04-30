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

contract SwapGHST{

address quickSwapRouter= 0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff;
address constant GHST= 0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7;


event GHSTSwapComplete(uint256 _amountIn,uint256 amountOut, address indexed tokenOut);


function swapGhstToTokens(uint256 _GhstAmountIn,
        uint tokenAmountOutMin,
        address[] calldata path,
        address _recipient,
        uint deadline) external {
        require(path[0]==GHST,"SwapFacet: Can only swap from GHST");
        require(IGHSTDiamond(path[0]).allowance(_recipient,address(this))>=tokenAmountOutMin,"SwapFacet: Allowance not enough for swap");
        console.log((IGHSTDiamond(path[0]).allowance(_recipient,address(this))));
        IUniswapV2Router01 quickSwap= IUniswapV2Router01(quickSwapRouter);
        uint[] memory amountsOut= quickSwap.swapExactTokensForTokens(_GhstAmountIn,tokenAmountOutMin,path,_recipient,deadline);
        emit GHSTSwapComplete(_GhstAmountIn,amountsOut[0],path[path.length-1]);
    
}




}