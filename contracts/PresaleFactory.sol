// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "./LBPFactory.sol";

contract PresaleFactory {
    address public lbpPoolAddress;
    address public lbpFactoryAddress = 0x751A0bC0e3f75b38e01Cf25bFCE7fF36DE1C87DE;

    function create(
        string memory name,
        string memory symbol,
        IERC20[] memory tokens,
        uint256[] memory weights,
        uint256 swapFeePercentage,
        address owner,
        bool swapEnabledOnStart
    ) public
    {
        lbpPoolAddress = ILiquidityBootstrappingPoolFactory(lbpFactoryAddress).create(
            name,
            symbol,
            tokens,
            weights,
            swapFeePercentage,
            owner,
            swapEnabledOnStart
        );
    }
}