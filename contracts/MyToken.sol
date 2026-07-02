// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MyToken {

    string public message;
    string public name;
    string public symbol;

    constructor(
        string memory _name,
        string memory _symbol
    ) {
        message = "Hello Base";
        name = _name;
        symbol = _symbol;
    }

    // 🔥 write function
    function setMessage(string memory _message) public {
        message = _message;
    }

    function resetMessage() public {
        message = "Hello Base";
    }

    // 👀 READ ONLY FUNCTION (NEW)
    function getInfo() public view returns (
        string memory,
        string memory,
        string memory
    ) {
        return (message, name, symbol);
    }

}