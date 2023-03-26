import { createContext, FunctionComponent, useContext, useEffect, useState } from "react";
import {CreateDefaultState, CreateWeb3State, loadContract, Web3Params} from "./utils";
import { Web3Provider as Provider } from '@ethersproject/providers';
import {ethers} from 'ethers';
import { setupHooks } from "components/hook/web3/setupHooks";


const Web3Context =createContext<Web3Params>(CreateDefaultState());

const Web3Provider:FunctionComponent = ({children})=>{
    
    const [web3Api,setWeb3Api] = useState<Web3Params>(CreateDefaultState)


    useEffect(()=>{
       async function initWeb3(){

            const w3provider = new ethers.providers.Web3Provider(window.ethereum as any);
            const contract = await loadContract("5777","NftMarket",w3provider);
            setWeb3Api(CreateWeb3State({
                ethereum:window.ethereum,
                provider:w3provider,
                contract,
                isLoading:false,
                hooks:setupHooks({ethereum:window.ethereum,provider:w3provider,contract})
            }))
        }
        initWeb3();
    },[])
    
    return(<Web3Context.Provider value={web3Api}>
        {children}
    </Web3Context.Provider>)
}

export function useWeb3(){
    return useContext(Web3Context);
}

export default Web3Provider;