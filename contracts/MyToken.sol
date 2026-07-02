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

}