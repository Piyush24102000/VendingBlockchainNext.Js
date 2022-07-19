// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
contract vending{
    address public owner;
    mapping(address => uint) public donutBalances;

constructor(){
    owner = msg.sender;
    donutBalances[address(this)] = 100;    
}
function getVendingBalance() public view returns(uint){
    return donutBalances[address(this)];
}

function restock(uint quantity) public {
    require(msg.sender == owner,"You need to be owner");
    donutBalances[address(this)]+= quantity;
}

function purchase(uint quantity) public payable{
    require(msg.value >= quantity * 2 ether,"please pay at least 2 ether");
    require(donutBalances[address(this)] >= quantity,"Not enough donuts");
    donutBalances[address(this)] -= quantity;
    donutBalances[msg.sender] += quantity;
}
}