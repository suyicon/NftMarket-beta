const NftMarket = artifacts.require("NftMarket");
const { ethers } = require("ethers");


contract("NftMarket",accounts=>{
    let _contract = null;
    let _actualPrice = ethers.utils.parseEther("0.3").toString();
    let _listedPrice = ethers.utils.parseEther("0.25").toString();
    
    before(async () =>{
        _contract = await NftMarket.deployed();
        //console.log(accounts);

    })

    describe("Mint token",() => {
        const tokenURI = "https://test.com";
        before(async()=>{
            await _contract.mintToken(tokenURI,_actualPrice,{
                from:accounts[0],
                value:_listedPrice
            })
        }) 
    
        it("should have create NFT item",async()=>{
            const nftItem = await _contract.getNftItem(1);
            console.log(nftItem);
            assert.equal(nftItem.tokenId, 1, "Token id is not 1");
            assert.equal(nftItem.price, _actualPrice, "Nft price is not correct");
            assert.equal(nftItem.creator, accounts[0], "Creator is not account[0]");
            assert.equal(nftItem.isListed, true, "Token is not listed");       
        })
        
        it("owner of the first token",async ()=>{
            const owner = await _contract.ownerOf(1);
            console.log(_contract.ownerOf(1));
            assert(owner == accounts[0],"owner is not true");  
            })


        it("tokenURI of the first token",async ()=>{
            const myTokenURI = await _contract.tokenURI(1);
            assert(myTokenURI == tokenURI,"tokenURI is not true");  
            })
    })

    

    describe("Buy NFT",() => {
        before(async()=>{
            await _contract.BuyNFT(1,{
                from:accounts[1],
                value:_actualPrice
            }) 
        }) 
        it("111",()=>{
            assert(true);
        })
        it("item unlisted",async()=>{
            const nftItem = await _contract.getNftItem(1);
            assert(nftItem.isListed==false,"Item is still listed");
        })
        it("decrease listed item",async()=>{
            const listedItemsCount = await _contract.listedItemsCount();
            assert(listedItemsCount == 0,"Item Count has not decrease");
        })
        it("change the owner",async()=>{
            const owner = await _contract.ownerOf(1);
            assert(owner == accounts[1],"Owner hasn't been changed");
        })
    })
    describe("Token transfers",() => {
        const tokenURI = "https://test-json-2.com";
        before(async()=>{
            await _contract.mintToken(tokenURI,_actualPrice,{
                from:accounts[0],
                value:_listedPrice
            })
        }) 
        it("NFTs created is 2",async()=>{
            const totalSupply = await _contract.totalSupply();
;           assert(totalSupply.toNumber()==2,"NFTs created is not 2");
        })

        it("NFT index tgo tokenId",async()=>{
            const nftId1 = await _contract.tokenByIndex(0);
            const nftId2 = await _contract.tokenByIndex(1);

            assert(nftId1 == 1,"NFT index is wrong");
            assert(nftId2 == 2,"NFT index is wrong");

        })

        it("NFT listed is 1",async()=>{
            const allNFTs = await _contract.getAllNFTOnSale();

            console.log(allNFTs);
            assert(allNFTs.length==1, "Invalid length of Nfts");

            assert(allNFTs[0].tokenId == 2,"Nft has a wrong tokenId");
        })

        it("account[1] should have one owned NFT",async()=>{
            const ownedNfts = await _contract.getOwnedNfts({from:accounts[1]});
            
            console.log(ownedNfts);

            assert(ownedNfts[0].tokenId==1,"Nft has a wrong id");
        })

        it("account[0] should have one owned NFT",async()=>{
            const ownedNfts = await _contract.getOwnedNfts({from:accounts[0]});

            assert(ownedNfts[0].tokenId==2,"Nft has a wrong id");
        })
    })

    describe("Token transfer to new owner", () => {
        before(async () => {
          await _contract.transferFrom(
            accounts[0],
            accounts[1],
            2
          )
        })
    
        it("accounts[0] should own 0 tokens", async () => {
          const ownedNfts = await _contract.getOwnedNfts({from: accounts[0]});
          assert.equal(ownedNfts.length, 0, "Invalid length of tokens");
        })
    
        it("accounts[1] should own 2 tokens", async () => {
          const ownedNfts = await _contract.getOwnedNfts({from: accounts[1]});
          assert.equal(ownedNfts.length, 2, "Invalid length of tokens");
        })
      })

    describe("List an Nft", () => {
        before(async () => {
            await _contract.placeNftOnSale(
            1,
            _actualPrice, { from: accounts[1], value: _listedPrice}
            )
        })

        it("should have two listed items", async () => {
            const listedNfts = await _contract.getAllNFTOnSale();

            assert(listedNfts.length==2, "Invalid length of Nfts");
        })

        it("should set new listing price", async () => {
            await _contract
              .setListedPrice(_listedPrice, {from: accounts[0]});
            const listingPrice = await _contract._ListedPrice();
      
            assert.equal(listingPrice.toString(), _listedPrice, "Invalid Price");
          })
      
    })
})
    



