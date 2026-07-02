// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MyToken {

    // =========================
    // Token Metadata
    // =========================
    string public name;
    string public symbol;
    uint8 public decimals = 18;

    // =========================
    // Supply
    // =========================
    uint256 public totalSupply;

    // =========================
    // Balances
    // =========================
    mapping(address => uint256) public balanceOf;

    mapping(address => mapping(address => uint256)) public allowance;

    // =========================
    // Events
    // =========================
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    // =========================
    // Constructor
    // =========================
    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;

        // mint initial supply
        totalSupply = 1000 * (10 ** decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    // =========================
    // Transfer
    // =========================
    function transfer(address to, uint256 value) public returns (bool) {
        require(balanceOf[msg.sender] >= value, "Insufficient balance");

        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;

        emit Transfer(msg.sender, to, value);
        return true;
    }

    // =========================
    // Approve
    // =========================
    function approve(address spender, uint256 value) public returns (bool) {
        allowance[msg.sender][spender] = value;

        emit Approval(msg.sender, spender, value);
        return true;
    }

    // =========================
    // TransferFrom
    // =========================
    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Not allowed");

        allowance[from][msg.sender] -= value;
        balanceOf[from] -= value;
        balanceOf[to] += value;

        emit Transfer(from, to, value);
        return true;
    }
}