// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MyToken {

    // =========================
    // 1. STATE VARIABLES
    // =========================
    string public name;
    string public symbol;
    uint8 public decimals = 18;

    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // =========================
    // 2. EVENTS
    // =========================
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    // =========================
    // 3. CONSTRUCTOR
    // =========================
    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;

        totalSupply = 1000 * (10 ** decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    // =========================
    // 4. EXTERNAL FUNCTIONS
    // =========================

    function transfer(address to, uint256 value) public returns (bool) {

        require(to != address(0), "Invalid address");
        require(to != msg.sender, "Cannot transfer to yourself");
        require(value > 0, "Amount must be greater than 0");
        require(balanceOf[msg.sender] >= value, "Insufficient balance");

        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;

        emit Transfer(msg.sender, to, value);

        return true;
    }

    function approve(address spender, uint256 value) public returns (bool) {

        require(spender != address(0), "Invalid spender");

        allowance[msg.sender][spender] = value;

        emit Approval(msg.sender, spender, value);

        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool) {

        require(from != address(0), "Invalid from");
        require(to != address(0), "Invalid to");
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Not allowed");

        allowance[from][msg.sender] -= value;
        balanceOf[from] -= value;
        balanceOf[to] += value;

        emit Transfer(from, to, value);

        return true;
    }
}