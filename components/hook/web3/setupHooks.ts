import { Web3Dependencies } from "@_types/hooks";
import { hookFactory as createAccountHook,useAccountHook  } from "./useAccount";
import { hookFactory as createNetworkHook,useNetworkHook  } from "./useNetwork";
import { hookFactory as createListedNftHook,useListedNftHook} from "./useListedNft";
import { hookFactory as createOwnedNftHook,useOwnedNftHook  } from "./useOwnedNft";

export type Web3Hooks = {
    useAccount:useAccountHook;
    useNetwork:useNetworkHook;
    useListedNft:useListedNftHook;
    useOwnedNft:useOwnedNftHook;
}

export type SetupHooks = {
    (d:Web3Dependencies):Web3Hooks
}

export const setupHooks:SetupHooks = (deps) =>{
    return{
        useAccount:createAccountHook(deps),
        useNetwork:createNetworkHook(deps),
        useListedNft:createListedNftHook(deps),
        useOwnedNft:createOwnedNftHook(deps)
    }
}