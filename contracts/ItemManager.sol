// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./Enumerable.sol";
contract ItemManager is ERC721URIStorage,Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter  _items;
    Counters.Counter  _tokenIds;
    mapping(uint => Item)  _idToNftItem;
    mapping(string => bool)  _usedTokenURIs;


    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    struct Item {
        uint tokenId;
        uint price;
        address creator;
        address owner;
        bool isListed;
    }

    event NFTCreation(
        uint tokenId,
        uint price,
        address creator,
        bool isListed
    );
    
    function _mintToken(address to, string memory tokenURI) internal returns (uint) {
        _tokenIds.increment();
        _items.increment();
        uint _tokenId = _tokenIds.current();

        _safeMint(to, _tokenId);
        _setTokenURI(_tokenId, tokenURI);

        return _tokenId;
    }

    function _buyNFT(uint tokenId, address buyer, uint value) internal {
        uint price = _idToNftItem[tokenId].price;
        address owner = ERC721.ownerOf(tokenId);

        require(value == price, "Please submit the price");
        require(buyer != owner, "You already own this NFT");

        _idToNftItem[tokenId].isListed = false;
        _items.decrement();

        _transfer(owner, buyer, tokenId);
        payable(owner).transfer(value);
        _idToNftItem[tokenId].owner = buyer; 
    }

    function _createItem(uint tokenId, uint price,string memory tokenURI) internal {
        require(price > 0, "Price must be at least 1 wei");
        require(!_usedTokenURIs[tokenURI], "token URI is existed");
        _idToNftItem[tokenId] = Item(tokenId, price, msg.sender,msg.sender,true);
        _usedTokenURIs[tokenURI] = true;
        emit NFTCreation(tokenId, price, msg.sender, true);
    }

    function _placeNftOnSale(uint tokenId, address caller, uint price) internal {
        require(ERC721.ownerOf(tokenId) == caller, "You are not the NFT owner!");
        require(_idToNftItem[tokenId].isListed == false, "NFT is on sale!");

        _idToNftItem[tokenId].isListed = true;
        _idToNftItem[tokenId].price = price;
        _items.increment();
    }

    function _placeNftOffSale(uint tokenId, address caller) internal {
        require(ERC721.ownerOf(tokenId) == caller, "You are not the NFT owner!");
        require(_idToNftItem[tokenId].isListed == true, "NFT is off sale!");

        _idToNftItem[tokenId].isListed = false;
        _items.decrement();
    }

    function getNftItem(uint tokenId) public view returns (Item memory) {
        return _idToNftItem[tokenId];
    }

    function getAllNFTOnSale() public view returns (Item[] memory){
        uint allItemsCounts = totalSupply();
        uint CurrentIndex = 0;
        
        Item[] memory items = new Item[](_items.current());

        for (uint i = 0; i < allItemsCounts;i++){
            uint tokenId = tokenByIndex(i);
            Item storage item = _idToNftItem[tokenId];

            if(item.isListed == true){
                items[CurrentIndex] = item;
                CurrentIndex++;
            }
        }
        return items;
    }

    function getOwnedNfts() public view returns(Item[] memory){
        uint ownedItemsCount = ERC721.balanceOf(msg.sender);
        Item[] memory items = new Item[](ownedItemsCount);

        for(uint i=0;i<ownedItemsCount;i++){
            uint tokenId = tokenByOwnedIndex(msg.sender,i);
            Item storage item = _idToNftItem[tokenId];
            items[i] = item;
        }

        return items;
    }

    function _beforeTokenTransfer(address from,address to, uint256 tokenId,uint256 batchSize)internal virtual override{
        super._beforeTokenTransfer(from,to,tokenId,batchSize);

        if(from == address(0)){         
            _addTokenToAllTokensEnum(tokenId);
        }
        else if(from!=to){
            _removeTokenFromOwnerEnum(from, tokenId);
        }

        if(to == address(0)){
            _removeTokenFromAllTokensEnum(tokenId);
        }
        else if(to!=from){
            _addTokenToOwnerEnum(to,tokenId);
        }
    }
}