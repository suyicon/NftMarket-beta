import { CrytoHookFactory } from "@_types/hooks";
import { Nft } from "@_types/nft";
import { ethers } from "ethers";
import { useCallback } from "react";
import { toast } from "react-toastify";
import useSWR from "swr"

type useOwnedNftRes = {
    listNFT:(tokenId:number,price:number) => Promise<void>
}

type UseOwnedNftHookFactory = CrytoHookFactory<Nft[],useOwnedNftRes>
export type useOwnedNftHook = ReturnType<UseOwnedNftHookFactory>

export const hookFactory:UseOwnedNftHookFactory = ({contract})=>()=>{
    const {data,...swr} = useSWR(contract ? "web3/useOwnedNft":null,
    async ()=>{
        const nfts = [] as Nft[];
        const coreNft = await contract!.getOwnedNfts();
        
        for(let i = 0;i<coreNft.length;i++){
            const item = coreNft[i];
            const tokenURI = await contract!.tokenURI(item.tokenId);
            const meta = await (await fetch(tokenURI)).json();
            nfts.push ({
                price: parseFloat(ethers.utils.formatEther(item.price)),
                creator:item.creator,
                tokenId:item.tokenId.toNumber(),
                isListed:item.isListed,
                meta
            })
        }
        return nfts;
    }
)
const _contract = contract;
const listNFT = useCallback(async (tokenId:number,price:number) => {
    try{
        const result = await _contract?.placeNftOnSale(
            tokenId,
            ethers.utils.parseEther(price.toString()),
            {
                value:ethers.utils.parseEther(0.1.toString())
            }
        )
        alert("Nft is on sale");
        await toast.promise(
            result!.wait(), {
              pending: "NFT is going to market",
              success: "nft is on sale",
              error: "nft is failed to on sale"
            }
          );
    } catch (e:any){
        console.error(e.messsage);
    }
},[_contract])

    return {
        ...swr,
        listNFT,
        data: data || [],
    };
}