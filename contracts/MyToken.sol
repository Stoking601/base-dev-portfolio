// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MyToken {

    string public message;
    string public name;
    string public symbol;

    mapping(address => uint256) public balanceOf;

    event MessageUpdated(string oldMessage, string newMessage);
    event Transfer(address indexed from, address indexed to, uint256 amount);

    constructor(
        string memory _name,
        string memory _symbol
    ) {
        message = "Hello Base";
        name = _name;
        symbol = _symbol;

        balanceOf[msg.sender] = 1000;
    }

    function setMessage(string memory _message) public {
        string memory old = message;
        message = _message;
        emit MessageUpdated(old, _message);
    }

    function resetMessage() public {
        string memory old = message;
        message = "Hello Base";
        emit MessageUpdated(old, "Hello Base");
    }

    function getInfo() public view returns (
        string memory,
        string memory,
        string memory
    ) {
        return (message, name, symbol);
    }

    // 🔥 CORE FUNCTION (ERC-20 STYLE)
    function transfer(address to, uint256 amount) public {
        require(balanceOf[msg.sender] >= amount, "Not enough balance");

        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;

        emit Transfer(msg.sender, to, amount);
    }
}