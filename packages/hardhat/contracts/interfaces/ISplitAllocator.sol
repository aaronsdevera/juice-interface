// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

interface ISplitAllocator {
    event Allocate(
        uint256 indexed projectId,
        uint256 indexed forProjectId,
        address indexed beneficiary,
        uint256 amount,
        address caller
    );

    function allocate(
        uint256 _amount,
        uint256 _projectId,
        uint256 _forProjectId,
        address _beneficiary,
        bool _preferUnstaked
    ) external payable;
}