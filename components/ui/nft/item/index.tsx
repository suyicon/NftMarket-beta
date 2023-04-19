/* eslint-disable @next/next/no-img-element */
import { Nft, NftMeta } from "@_types/nft";
import { FunctionComponent } from "react";

type NftItemProps = {
  item:Nft;
  BuyNFT:(tokenId:number,value:number)=>Promise<void>;
}

const NftItem:FunctionComponent<NftItemProps> =({item,BuyNFT}) =>{
    return(
      <>
      <div className="flex-shrink-0">
        <img
          className={`h-full w-full object-cover`}
          src={item.meta.image}
          alt="New NFT"
        />
      </div>
      <div className="flex-1 bg-white p-6 flex flex-col justify-between">
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-red-600">
              Persona
            </p>
          </div>
          <div className="block mt-2">
            <p className="text-xl font-semibold text-gray-900">{item.meta.name}</p>
            <p className="mt-3 mb-3 text-base text-gray-500">{item.meta.description}</p>
          </div>
        </div>
        <div className="overflow-hidden mb-4">
          <dl className="-mx-4 -mt-4 flex flex-wrap">
            <div className="flex flex-col px-4 pt-4">
              <dd className="order-1 text-xl font-extrabold text-orange-400">
                <div className="items-center">
                <text className="order-1 text-xl font-extrabold text-blue-400">价格:</text>
                  {item.price}
                  Ether
                </div>
              </dd>
            </div>
          </dl>
        </div>
        <div className="right:0">
          <button
            onClick={()=>{BuyNFT(item.tokenId,item.price)}}
            type="button"
            className=" disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:cursor-not-allowed mr-2 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-500 hover:bg-green-300"
          >
            购买
          </button>
        </div>
      </div>
    </>
    
    
    )
}

export default NftItem;