import { CrytoHookFactory } from "@_types/hooks";
import { Nft } from "@_types/nft";
import { ethers } from "ethers";
import useSWR from "swr";
import { useCallback } from "react";
import { toast } from "react-toastify";

type useListedNftRes = {
    BuyNFT:(tokenId:number,value:number)=>Promise<void>
}

type UseListedNftHookFactory = CrytoHookFactory<Nft[],useListedNftRes>
export type useListedNftHook = ReturnType<UseListedNftHookFactory>

export const hookFactory:UseListedNftHookFactory = ({contract})=>()=>{
    const {data,...swr} = useSWR(contract ? "web3/useListedNft":null,
    async ()=>{
        const nfts = [] as Nft[];
        const coreNft = await contract!.getAllNFTOnSale();
        
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
    const BuyNFT = useCallback(async (tokenId:number,value:number) => {
        try{
           const res = await _contract?.BuyNFT(
                tokenId,{
                    value:ethers.utils.parseEther(value.toString())
                }
            )
            alert("Purchase success");
            await toast.promise(
                res!.wait(), {
                  pending: "Purchasing nft",
                  success: "nft transaction is success!Now the nft is yours",
                  error: "nft transaction fails "
                }
              );
        } catch (e:any){
            console.error(e.messsage);
        }
    },[_contract])
    return {
        ...swr,
        data: data || [],
        BuyNFT,
    };
}