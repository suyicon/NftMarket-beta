import { createContext, FunctionComponent, useContext, useEffect, useState } from "react";
import {CreateDefaultState, CreateWeb3State, loadContract, Web3Params} from "./utils";
import { Web3Provider as Provider } from '@ethersproject/providers';
import {ethers} from 'ethers';
import { setupHooks } from "components/hook/web3/setupHooks";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { NftMarketContract } from "@_types/nftMarketContract";

function pageReload(){
    window.location.reload();
}

const Web3Context =createContext<Web3Params>(CreateDefaultState());

const Web3Provider:FunctionComponent = ({children})=>{
    
    const [web3Api,setWeb3Api] = useState<Web3Params>(CreateDefaultState)


    useEffect(()=>{
       async function initWeb3(){

            try{
            const w3provider = new ethers.providers.Web3Provider(window.ethereum as any);
            const contract = await loadContract("5777","NftMarket",w3provider);
            
            const signer = w3provider.getSigner();
            const signedContract = contract.connect(signer);

            setTimeout(()=>{setGlobalListeners(window.ethereum)},300);
            setWeb3Api(CreateWeb3State({
                ethereum:window.ethereum,
                provider:w3provider,
                contract:signedContract as unknown as NftMarketContract,
                isLoading:false,
                hooks:setupHooks({
                    ethereum:window.ethereum,
                    provider:w3provider,
                    contract,
                    isLoading:false
                })
            }))
            } catch(e:any){
                console.error("Please install Metamask!");
                setWeb3Api((api)=>CreateWeb3State({
                    ...api as any,
                    isLoading:false,
                })
                )
            }
        }
        initWeb3();
        return ()=>removeGlobalListeners(window.ethereum);
    },[])
    
    return(<Web3Context.Provider value={web3Api}>
        {children}
    </Web3Context.Provider>)
}

const setGlobalListeners = (ethereum:MetaMaskInpageProvider)=>{
    ethereum.on("chainChanged",pageReload);
    ethereum.on("accountsChanged",pageReload)
}

const removeGlobalListeners = (ethereum:MetaMaskInpageProvider)=>{
    ethereum.removeListener("chainChanged",pageReload);
    ethereum.removeListener("v",pageReload);
}


export function useWeb3(){
    return useContext(Web3Context);
}

export default Web3Provider;