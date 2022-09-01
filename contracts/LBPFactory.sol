// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

interface IERC20
{

}

interface ILiquidityBootstrappingPoolFactory {
    function create(
        string memory name,
        string memory symbol,
        IERC20[] memory tokens,
        uint256[] memory weights,
        uint256 swapFeePercentage,
        address owner,
        bool swapEnabledOnStart
    ) external returns (address);
}