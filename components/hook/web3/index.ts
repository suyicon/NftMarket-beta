import { useWeb3 } from "@providers/web3"

export const useAccount =() =>{
    const {hooks} = useWeb3();
    const accountResponse = hooks.useAccount("");
    return{
        account:accountResponse
    }
}

export const useNetwork =() =>{
    const {hooks} = useWeb3();
    const networkResponse = hooks.useNetwork("");
    return{
        network:networkResponse
    }
}

export const useListedNft =() =>{
    const {hooks} = useWeb3();
    const nftResponse = hooks.useListedNft("");
    return{
        nft:nftResponse
    }
}