import { CrytoHookFactory } from "@_types/hooks";
import { useEffect } from "react";
import useSWR, { mutate } from "swr"

type useAccountRes = {
    connect:() =>{}
    isLoading:boolean;
    isInstalled:boolean;
}

type AccountHookFactory = CrytoHookFactory<string,useAccountRes>
export type useAccountHook = ReturnType<AccountHookFactory>

export const hookFactory:AccountHookFactory = ({provider,ethereum,isLoading})=>(params:any)=>{
    const {data,mutate,isValidating,...swr} = useSWR(provider ? "web3/useAccount":null,
    async ()=>{
        console.log(provider);
        console.log(params);
        const accounts = await provider!.listAccounts();
        const account = accounts[0];

        if(!account){
            throw"Can not get account from Fox Wallet!"
        }

        return account;
     },{revalidateOnFocus:false})

    useEffect(() =>{
        ethereum?.on("accountsChanged",handleAccountsChanged);
        return ()=>{
            ethereum?.removeListener("accountsChanged",handleAccountsChanged)
        }
    })
    const handleAccountsChanged = (...args:unknown[])=>{
        const accounts =args[0] as string[];
        if(accounts.length == 0){
            console.error("please connect to Fox Wallet");
        }
        else if(accounts[0] !== data){
            mutate(accounts[0]);
            console.log("account has changed!");
            console.log("account:",accounts[0]);
        }
    }

    
    const connect = async()=>{
        try{
            ethereum?.request({method:"eth_requestAccounts"});
        }catch(e){
            console.error(e);
        }
    }
    return {
        ...swr,
        data,
        isLoading:isLoading||isValidating,
        isInstalled:ethereum?.isMetaMask||false,
        mutate,
        connect
    };
}



export const showAccountData = hookFactory({ethereum:undefined,provider:undefined})