import { CrytoHookFactory } from "@_types/hooks";
import useSWR from "swr"


const Networks:{ [k:string]:string} = {
    1:"Ethereum main network",
    3:"Ropsten test network",
    4:"Rinkeby test network",
    5:"Goerli test network",
    42:"Kovan test network",
    56:"Binance smart chain",
    1337:"Ganache",
}

type useNetworkRes = {  
    isLoading:boolean;
    isSupported:boolean;
    targetNetwork:string;
}

type NetworkHookFactory = CrytoHookFactory<string,useNetworkRes>
export type useNetworkHook = ReturnType<NetworkHookFactory>


const targetId = process.env.NEXT_PUBLIC_TARGET_CHAIN_ID as string;
const targetNetwork = Networks[targetId];

export const hookFactory:NetworkHookFactory = ({provider,isLoading})=>()=>{
    const {data,isValidating,...swr} = useSWR(provider ? "web3/useNetwork":null,
    async ()=>{
        const chainId = (await provider!.getNetwork())?.chainId;
        if(!chainId){
            throw "can not get network!";
        }
        return Networks[chainId];
     })

    
    return {
        ...swr,
        data,
        targetNetwork,
        isLoading:isLoading || isValidating
    };
}

