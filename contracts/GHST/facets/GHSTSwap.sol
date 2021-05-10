// SPDX-License-Identifier: MIT
pragma solidity >=0.6.6;


//import "../../shared/interfaces/Router.sol";
import "../../GHST/interfaces/IGHSTDiamond.sol";
import "hardhat/console.sol";
// File: contracts/interfaces/IUniswapV2Router01.sol

pragma solidity >=0.6.2;
library TransferHelper {
    function safeApprove(address token, address to, uint value) internal {
        // bytes4(keccak256(bytes('approve(address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0x095ea7b3, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'TransferHelper: APPROVE_FAILED');
    }

    function safeTransfer(address token, address to, uint value) internal {
        // bytes4(keccak256(bytes('transfer(address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0xa9059cbb, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'TransferHelper: TRANSFER_FAILED');
    }

    function safeTransferFrom(address token, address from, address to, uint value) internal {
        // bytes4(keccak256(bytes('transferFrom(address,address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0x23b872dd, from, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'TransferHelper: TRANSFER_FROM_FAILED');
    }

    function safeTransferETH(address to, uint value) internal {
        (bool success,) = to.call{value:value}(new bytes(0));
        require(success, 'TransferHelper: ETH_TRANSFER_FAILED');
    }
}

interface IERC20 {
    event Approval(address indexed owner, address indexed spender, uint value);
    event Transfer(address indexed from, address indexed to, uint value);

    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
    function totalSupply() external view returns (uint);
    function balanceOf(address owner) external view returns (uint);
    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint value) external returns (bool);
    function transfer(address to, uint value) external returns (bool);
    function transferFrom(address from, address to, uint value) external returns (bool);
}

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
address constant WETH= 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619;

event GhstToTokenSwapComplete(uint _amountIn,uint amountOut, address indexed tokenOut);
event EthToGhstSwapComplete(uint EthInWei,uint amountOut,address indexed recipient);
event tokenToGhstSwapComplete(address indexed tokenIn,uint tokenAmountIn,uint ghstAmountOut);

receive() external payable {
        assert(msg.sender == WETH); // only accept ETH via fallback from the WETH contract
    }

function swapGhstToTokens(uint _GhstAmountIn,
        address[] calldata path,
        address _recipient, uint deadline_) external returns(uint[] memory){
        require(path[0]==GHST,"SwapFacet: Can only swap from GHST");
        IUniswapV2Router01 quickSwap= IUniswapV2Router01(quickSwapRouter);
        IGHSTDiamond ghstToken= IGHSTDiamond(GHST);
        uint[] memory amounts=quickSwap.getAmountsOut(_GhstAmountIn, path);
        uint tokenAmountOutMin=amounts[amounts.length-1];//this can also be done via quickswap-sdk
        require(ghstToken.allowance(_recipient,address(this))>=_GhstAmountIn,"SwapFacet: Allowance not enough for transfer");
        ghstToken.approve((quickSwapRouter), _GhstAmountIn);
        require(ghstToken.transferFrom(msg.sender, address(this), _GhstAmountIn), 'SwapFacet: transferFrom failed.');   
        uint[] memory amountsOut= quickSwap.swapExactTokensForTokens(_GhstAmountIn,tokenAmountOutMin,path,_recipient,deadline_);
        emit GhstToTokenSwapComplete(_GhstAmountIn,amountsOut[amountsOut.length-1],path[path.length-1]);
        return amountsOut;
    
}

function swapEthToGhst(address[] calldata path, uint deadline,address recipient) external payable returns (uint[] memory){
    require(path[path.length-1]== GHST,'SwapFacet: can only swap to GHST');
    IUniswapV2Router01 quickSwap= IUniswapV2Router01(quickSwapRouter);
    uint[] memory amounts=quickSwap.getAmountsOut(msg.value, path);
    uint tokenAmountOutMin=amounts[amounts.length-1];//this can also be done via quickswap-sdk
    uint[] memory amountsIn = quickSwap.getAmountsIn(tokenAmountOutMin,path);
    uint[] memory amountsOut = quickSwap.swapExactETHForTokens{value:msg.value}(tokenAmountOutMin,path,recipient,deadline);
    emit EthToGhstSwapComplete(amountsIn[0],amountsOut[amountsOut.length-1],recipient);
    return amountsOut;
}

function swapTokensToGhst(uint _tokenAmountIn,address[] calldata path,address _recipient,uint deadline ) external returns(uint[] memory){
     require(path[path.length-1]==GHST,"SwapFacet: Can only swap to GHST");
        IUniswapV2Router01 quickSwap= IUniswapV2Router01(quickSwapRouter);
        IERC20 Token= IERC20(path[0]);
        uint[] memory amounts=quickSwap.getAmountsOut(_tokenAmountIn, path);
        uint ghstAmountOutMin=amounts[amounts.length-1];//this can also be done via quickswap-sdk
        require(Token.allowance(_recipient,address(this))>=_tokenAmountIn,"SwapFacet: Allowance not enough for transfer");
        Token.approve(quickSwapRouter, _tokenAmountIn);
        require(Token.transferFrom(msg.sender, address(this), _tokenAmountIn), 'SwapFacet: transferFrom failed.');   
        uint[] memory amountsOut= quickSwap.swapExactTokensForTokens(_tokenAmountIn,ghstAmountOutMin,path,_recipient,deadline);
        emit tokenToGhstSwapComplete(path[0],_tokenAmountIn,amountsOut[amountsOut.length-1]);
        return amountsOut;
}





}