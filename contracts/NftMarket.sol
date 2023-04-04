// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";




contract NftMarket is ERC721URIStorage,Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _Items;
    Counters.Counter private _TokenIds ;

    uint public _ListedPrice = 0.25 ether;

    //all tokenid in nft
    uint256[] private _allNfts;

    mapping(string => bool) private _usedTokenURIs;
    mapping(uint => Item) private _idToNftItem;

    //the No.n token that user has
    mapping(address => mapping(uint=>uint))private _ownedTokens;
    mapping(uint=>uint)private _idToOwnedIndex;


    mapping(uint=>uint) private _idToNftIndex;

    struct Item{
        uint tokenId;
        uint price;
        address creator;
        bool isListed;
    }

    event NFTCreation(
        uint tokenId,
        uint price,
        address creator,
        bool isListed
    );

    constructor() ERC721 ("CreaturesNfts","CNFT"){
        
    }
    function mintToken(string memory tokenURI,uint price) public payable returns(uint){
        require(!tokenURIExists(tokenURI),"token URI is existed");
        require(msg.value == _ListedPrice,"payment is not equal to price listed");
        _TokenIds.increment();
        _Items.increment();

    
        uint _TokenId = _TokenIds._value;

        _safeMint(msg.sender, _TokenId);
        _setTokenURI(_TokenId,tokenURI);
        _createItem(_TokenId,price);
        _usedTokenURIs[tokenURI] = true;

        return _TokenId;
    }
    function _createItem(
        uint tokenId,
        uint price)private
        {
            require(price>0,"Price must be ar least 1 wei");
            _idToNftItem[tokenId] = Item(tokenId,price,msg.sender,true);
            emit NFTCreation(tokenId,price,msg.sender,true);
        }

    function getNftItem(uint tokenId) public view returns(Item memory){
        return _idToNftItem[tokenId];
    }

    function listedItemsCount() public view returns(uint){
        uint _Item = _Items._value;

        return _Item;
    }

    function BuyNFT(uint tokenId)public payable{
        uint price = _idToNftItem[tokenId].price;
        address owner = ERC721.ownerOf(tokenId);

        require(msg.value == price,"Please submit the price");
        require(msg.sender!= owner,"You already own this NFT");

        _idToNftItem[tokenId].isListed = false;
        _Items.decrement();

        _transfer(owner, msg.sender, tokenId);
        payable(owner).transfer(msg.value);


    }

    function totalSupply() public view returns(uint){
        return _allNfts.length;
    }

    function tokenByIndex(uint index)public view returns(uint){
        require(index<totalSupply(),"index is out of bound");
        return _allNfts[index];
    }

    function tokenByOwnedIndex(address owner,uint index)public view returns(uint){
        require(index<ERC721.balanceOf(owner),"index is out of bound");
        return _ownedTokens[owner][index];
    }

    function tokenURIExists(string memory tokenURI) public view returns(bool){
        return _usedTokenURIs[tokenURI] == true;
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
            
            _addToeknToAllTokensEnum(tokenId);
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
    //accord token to nft
    function _addToeknToAllTokensEnum(uint tokenId)private{
        _idToNftIndex[tokenId] = _allNfts.length;
        _allNfts.push(tokenId);
    }
    //token that user prosess
    function _addTokenToOwnerEnum(address to,uint tokenId)private{
        uint tokenCount = ERC721.balanceOf(to);
        _ownedTokens[to][tokenCount] = tokenId;
        _idToOwnedIndex[tokenId] = tokenCount;
    }



    function getAllNFTOnSale() public view returns (Item[] memory){
        uint allItemsCounts = totalSupply();
        uint CurrentIndex = 0;
        
        Item[] memory items = new Item[](_Items.current());

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

    function _removeTokenFromOwnerEnum(address from,uint tokenId)private{
        uint lastTokenIndex = ERC721.balanceOf(from)-1;
        uint tokenIndex = _idToOwnedIndex[tokenId];

        if(tokenIndex != lastTokenIndex){
            uint lastTokenId = _ownedTokens[from][lastTokenIndex];

            _ownedTokens[from][tokenIndex] = lastTokenId;
            _idToOwnedIndex[lastTokenId] = tokenIndex;
        }

        delete _idToOwnedIndex[tokenId];
        delete _ownedTokens[from][lastTokenIndex];
    }



    //put the last element of the array to the position whose element should be delete,
    //then delete the last element
    function _removeTokenFromAllTokensEnum(uint tokenId)private{
        uint lastTokenIndex = _allNfts.length-1;
        uint tokenIndex = _idToNftIndex[tokenId];
        uint lastTokenId = _allNfts[lastTokenIndex];


        _allNfts[tokenIndex] = lastTokenId;
        _idToNftIndex[lastTokenId] = tokenIndex; 

        delete _idToNftIndex[tokenId];
        _allNfts.pop();
    }

    function burnToken(uint tokenId) public{
        _burn(tokenId);
    }

    function setListedPrice(uint price)external onlyOwner{
        require(price>0,"Price must be > 0");
        _ListedPrice = price;
    }

    function placeNftOnSale(uint tokenId,uint price) public payable{
        require(ERC721.ownerOf(tokenId) == msg.sender,"You are not the NFT owner!");
        require(_idToNftItem[tokenId].isListed == false,"NFT is on sale!");
        require(msg.value == _ListedPrice,"price should be equal to listed price!");

        _idToNftItem[tokenId].isListed = true;
        _idToNftItem[tokenId].price = price;
        _Items.increment();
    }
}