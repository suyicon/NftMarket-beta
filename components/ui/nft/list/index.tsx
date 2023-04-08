import { Nft, NftMeta } from "@_types/nft";
import { FunctionComponent } from "react";
import NftItem from "../item";
import { useListedNft } from "@hooks/web3";

export type NftListProps = {
    nfts:Nft[];
}

const NftList:FunctionComponent<NftListProps> = () => {
      const { nft }  = useListedNft();
    return(
        <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
            {
                nft.data?.map((listedNft: Nft)=>
            <div key={listedNft.meta.image} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                <NftItem
                    item={listedNft} 
                    BuyNFT={ nft.BuyNFT }
                />
            </div>
                    )
            }
        </div>
    )
}

export default NftList;