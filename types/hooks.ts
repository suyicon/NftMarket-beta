import { ethers,Contract } from "ethers"
import { MetaMaskInpageProvider} from "@metamask/providers"
import { type } from "os";
import { SWRResponse } from "swr"

export type Web3Dependencies= {
    provider:ethers.providers.Web3Provider;
    contract:Contract;
    ethereum:MetaMaskInpageProvider;

}

export type CrytoSWRResponse<D = any,R = any> = SWRResponse<D> & R;

export type CrytoHandlerHook<D = any,R=any,P = any> = (params:P)=>CrytoSWRResponse<D,R>

export type CrytoHookFactory<D = any,R=any,P = any> = {
    (deps:Partial<Web3Dependencies>):CrytoHandlerHook<D,R,P>
}