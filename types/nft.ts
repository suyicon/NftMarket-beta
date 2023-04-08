import { type } from "os";


export type NftMeta = {
    name :string;
    description:string;
    image:string;
}

export type NftCore = {
    tokenId : number;
    price : number;
    creator : string;
    isListed : boolean 
}

export type Nft = {
    meta :NftMeta
} & NftCore

export type FileReq = {
    contentType:string,
    fileName:string,
    bytes:Uint8Array
}
export type ipfsRes = {
    IpfsHash: string;
    PinSize: number;
    Timestamp: string;
    isDuplicate: boolean;
  }