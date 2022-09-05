// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

interface ILiquidityBootstrappingPool
{
    function updateWeightsGradually(
        uint256 startTime,
        uint256 endTime,
        uint256[] memory endWeights
    ) external;
}