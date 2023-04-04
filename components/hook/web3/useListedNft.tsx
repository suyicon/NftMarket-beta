import { CrytoHookFactory } from "@_types/hooks";
import useSWR from "swr"

type useListedNftRes = {
}

type UseListedNftHookFactory = CrytoHookFactory<string,useListedNftRes>
export type useListedNftHook = ReturnType<UseListedNftHookFactory>

export const hookFactory:UseListedNftHookFactory = ({contract})=>(params:any)=>{
    const {data,mutate,isValidating,...swr} = useSWR(contract ? "web3/useListedNft":null,
    async ()=>{
        const nft = [] as any;
        return nft;
    }
)
    return {
        ...swr,
        data: data || [],
    };
}