import { MetaMaskInpageProvider } from "@metamask/providers";
import { setupHooks, Web3Hooks } from "components/hook/web3/setupHooks";
import { Contract, ethers} from "ethers";



declare global{
    interface Window{
        ethereum:MetaMaskInpageProvider;
    }
}


export type Web3Params = {
    ethereum :MetaMaskInpageProvider | null ;
    provider :ethers.providers.Web3Provider | null;
    contract :Contract | null;
    isLoading:boolean;
    hooks:Web3Hooks;
}

export type Web3State = {
    provider:ethers.providers.Web3Provider;
    contract:Contract;
    ethereum:MetaMaskInpageProvider;
    isLoading:boolean;
    hooks:Web3Hooks;
}


export const CreateDefaultState = () =>{
    return {
        ethereum:null,
        provider:null,
        contract:null,
        isLoading:true,
        hooks:setupHooks({} as any)
    }
}

export const CreateWeb3State = ({
    ethereum,provider,contract,isLoading
}:Web3State) =>{
    return {
        ethereum,
        provider,
        contract,
        isLoading,
        hooks:setupHooks({
            ethereum,
            provider,
            contract,
            isLoading
        })
    }
}


export const loadContract = async (
    id:string,
    name:string,
    provider:ethers.providers.Web3Provider
    ):Promise<Contract> => {
       /* if(id){
            return Promise.reject("Network id is not defined");
        }*/

        const res = await fetch(`/contracts/${name}.json`);
        const ContractJSON = await res.json();
        if(ContractJSON.networks[id].address){
            const contract = new ethers.Contract(
                ContractJSON.networks[id].address,
                ContractJSON.abi,
                provider
            )
            return contract;
        }
        else {
            return Promise.reject(`../../../build/contracts/${name}.json can not be loaded!`)
        }
}