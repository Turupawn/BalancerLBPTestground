// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

interface ILiquidityBootstrappingPool
{
    function updateWeightsGradually(
        uint256 startTime,
        uint256 endTime,
        uint256[] memory endWeights
    ) external;

    function getPoolId() external view returns (bytes32);

    function balanceOf(address account) external view returns (uint256);
}