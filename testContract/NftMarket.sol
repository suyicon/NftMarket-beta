// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;


import "./ItemManager.sol";
import "./Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NftMarket is ItemManager, Ownable {
    constructor() ItemManager("Persona", "NFT") {}

    function mintToken(string memory tokenURI, uint price) public payable returns (uint) {
        uint _tokenId = _mintToken(msg.sender, tokenURI);
        _createItem(_tokenId, price,tokenURI);
        return _tokenId;
    }

    function BuyNFT(uint tokenId) public payable onlyOwner  {
        _buyNFT(tokenId, msg.sender, msg.value);
    }

    function burnToken(uint tokenId) public {
        _burn(tokenId);
    }

    function placeNftOnSale(uint tokenId, uint price) public payable onlyOwner  {
        _placeNftOnSale(tokenId, msg.sender, price);
    }

    function placeNftOffSale(uint tokenId) public payable onlyOwner {
        _placeNftOffSale(tokenId, msg.sender);
    }
}