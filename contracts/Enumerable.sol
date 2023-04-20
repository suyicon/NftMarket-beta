// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;


import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

abstract contract Enumerable is ERC721URIStorage {
    using Counters for Counters.Counter;

    uint256[] _allNfts;
    mapping(uint => uint)  _idToNftIndex;
    mapping(address => mapping(uint => uint))  _ownedTokens;
    mapping(uint => uint)  _idToOwnedIndex;

    
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

    function _addTokenToAllTokensEnum(uint tokenId) internal {
        _idToNftIndex[tokenId] = _allNfts.length;
        _allNfts.push(tokenId);
    }

    function _addTokenToOwnerEnum(address to, uint tokenId) internal {
        uint tokenCount = ERC721.balanceOf(to);
        _ownedTokens[to][tokenCount] = tokenId;
        _idToOwnedIndex[tokenId] = tokenCount;
    }

    function _removeTokenFromOwnerEnum(address from, uint tokenId) internal {
        uint lastTokenIndex = ERC721.balanceOf(from) - 1;
        uint tokenIndex = _idToOwnedIndex[tokenId];

        if (tokenIndex != lastTokenIndex) {
            uint lastTokenId = _ownedTokens[from][lastTokenIndex];

            _ownedTokens[from][tokenIndex] = lastTokenId;
            _idToOwnedIndex[lastTokenId] = tokenIndex;
        }

        delete _idToOwnedIndex[tokenId];
        delete _ownedTokens[from][lastTokenIndex];
    }

    function _removeTokenFromAllTokensEnum(uint tokenId) internal {
        uint lastTokenIndex = _allNfts.length - 1;
        uint tokenIndex = _idToNftIndex[tokenId];
        uint lastTokenId = _allNfts[lastTokenIndex];

        _allNfts[tokenIndex] = lastTokenId;
        _idToNftIndex[lastTokenId] = tokenIndex;

        delete _idToNftIndex[tokenId];
        _allNfts.pop();
    }
}