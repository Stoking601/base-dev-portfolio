// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MyToken {

    string public message;
    string public name;
    string public symbol;

    constructor() {
        message = "Hello Base";
        name = "Base Learning Token";
        symbol = "BLT";
    }

}