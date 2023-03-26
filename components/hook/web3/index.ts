import { useWeb3 } from "@providers/web3"

export const useAccount =() =>{
    const {hooks} = useWeb3();
    const Response = hooks.useAccount("");
    return{
        account:Response
    }
}