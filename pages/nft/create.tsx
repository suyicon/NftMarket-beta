import type { NextPage } from 'next'
import { ChangeEvent, useState } from 'react';
import { BaseLayout } from '@ui'
import { Switch } from '@headlessui/react'
import Link from 'next/link'
import { NftMeta, ipfsRes } from '@_types/nft';
import axios from 'axios';
import { useWeb3 } from '@providers/web3';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

const ATTRIBUTES = ["health", "attack", "speed"];
const ALLOWED_FIELDS = ["name", "description", "image"];

const NftCreate: NextPage = () => {
  const {ethereum,contract} = useWeb3();
  const [nftURI, setNftURI] = useState("");
  const [hasURI, setHasURI] = useState(false);
  const [nftMeta, setNftMeta] = useState<NftMeta>({
    name: "",
    description: "",
    image: "",
  });
  const[price,setPrice] = useState("");

  /* Here is the explanation for the code above:
1. We create a function called GetSignatureData. This function will be called when the user clicks the button
2. We make a call to the server to get the message to sign.
3. We send a request to the user to sign the message
4. We return the account and the signature to the server to verify */
  const GetSignatureData = async()=>{
    console.log("create NFT:",nftMeta);
      const accounts = await ethereum?.request({method:"eth_requestAccounts"}) as string[];
      const account = accounts[0];
      const message = await axios.get("/api/verify");

      const data = await ethereum?.request({
        method:"personal_sign",
        params:[JSON.stringify(message.data),account,message.data.id]
      });
      console.log("signature message:",message.data);
      return {account,data};
}
  const uploadMetaToIpfs = async() =>{
    try{
    if(!nftMeta.image||nftMeta.image.length === 0) {
      alert("please upload your nft image!");
      throw new Error("Invalid data!");
    }
    const {account,data}= await GetSignatureData()
    const promise =  axios.post("/api/verify",{
        address:account,
        signature:data,
        nft:nftMeta
     });
     const res = await toast.promise(
      promise, {
        pending: "Uploading MetaData",
        success: "MetaData uploaded",
        error: "MetaData upload error"
      }
    )
     const IPFSdata = res.data as ipfsRes;
     setNftURI(`${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${IPFSdata.IpfsHash}`);
    }catch(e:any){
      console.error(e.messsage);
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNftMeta({...nftMeta, [name]: value});
  }

  const createNft = async () => {
    try {
      alert(price);
      //const nftRes = await axios.get(nftURI);
      //const content = nftRes.data;

     /* Object.keys(content).forEach(key => {
        if (!ALLOWED_FIELDS.includes(key)) {
          alert("Wrong operation!the nft has been created.");
          throw new Error("Invalid Json structure");
        }
      })*/
      const transaction = await contract?.mintToken(
        nftURI,
        ethers.utils.parseEther(price),{
          value:ethers.utils.parseEther(price.toString())
        }
      );
      await toast.promise(
        transaction!.wait(), {
          pending: "Uploading nft",
          success: "nft uploaded",
          error: "nft upload error"
        }
      );
      alert("Cong!nft is created!");
      window.location.replace("/");
    } catch(e: any) {
      console.error(e.message);
    }
  }

  const handleImageAndUploadToIpfs = async(e:ChangeEvent<HTMLInputElement>)=>{
    if(!e.target.files||e.target.files.length === 0){
      console.error("please select a file");
      return;
    }
    const file = e.target.files[0];
    console.log("uploaded image file data:",file); 
    const buffer = await file.arrayBuffer(); 
    const bytes = new Uint8Array(buffer);
    console.log("image bytes:",bytes);

    try {
      const {account, data} = await GetSignatureData();
      const promise = axios.post("/api/verify-image", {
        address: account,
        signature: data,
        bytes,
        contentType: file.type,
        fileName: file.name.replace(/\.[^/.]+$/, "")
      });
      //console.log(promise.data);
      const res = await toast.promise(
        promise, {
          pending: "Uploading image",
          success: "Image uploaded",
          error: "Image upload error"
        }
      )
      console.log("upload image data:",res.data);
      const IPFSdata = res.data as ipfsRes;

      setNftMeta({
        ...nftMeta,
        image:`${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${IPFSdata.IpfsHash}`
      });
      


    }catch(e:any){
        console.error(e.messsage);
      }
  }


  return (
    <BaseLayout>
      <div>
        <div className="py-4">
          { !nftURI &&
            <div className="flex">
              <div className="mr-2 font-bold underline">选择NFT上传至IPFS的方式</div>
              <Switch
                checked={hasURI}
                onChange={() => setHasURI(!hasURI)}
                className={`${hasURI ? 'bg-green-500' : 'bg-yellow-300'}
                  relative inline-flex flex-shrink-0 h-[28px] w-[64px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`${hasURI ? 'translate-x-9' : 'translate-x-0'}
                    pointer-events-none inline-block h-[24px] w-[24px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                />
              </Switch>
            </div>
          }
        </div>
        { (nftURI || hasURI) ?
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">上传人格面具</h3>
                <p className="mt-1 text-sm text-gray-600">
                  您可以在这里把自己已拥有的人格面具加入到IPFS中!让他们帮助您偷走恶人们的心吧！
                </p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form>
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  { hasURI &&
                    <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                      <div>
                        <label htmlFor="uri" className="block text-sm font-medium text-gray-700">
                          URI
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            onChange={(e) => setNftURI(e.target.value)}
                            type="text"
                            name="uri"
                            id="uri"
                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                            placeholder="http://link.com/data.json"
                          />
                        </div>
                      </div>
                    </div>
                  }
                  { nftURI &&
                    <div className='mb-4 p-4'>
                      <div className="font-bold">Your metadata: </div>
                      <div>
                        <Link href={nftURI}>
                          <a className="underline text-indigo-600">
                            {nftURI}
                          </a>
                        </Link>
                      </div>
                    </div>
                  }
                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        价格 (ETH)
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          onChange={(e)=>setPrice(e.target.value)}
                          type="number"
                          name="price"
                          id="price"
                          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                          placeholder="0.8"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      onClick={createNft}
                      type="button"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-500"
                    >
                      上传
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        :
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">创建您的人格面具</h3>
              <p className="mt-1 text-sm text-gray-600">
                在这里,您可以自由定制专属于您本人的人格面具!
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      名字
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        onChange={handleChange}
                        value = {nftMeta.name}
                        type="text"
                        name="name"
                        id="name"
                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                        placeholder="Izanagi"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      描述
                    </label>
                    <div className="mt-1">
                      <textarea
                        onChange={handleChange}
                        value = {nftMeta.description}
                        id="description"
                        name="description"
                        rows={3}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                        placeholder="with some secret powers"
                      />
                    </div>
                  </div>
                  {/* Has Image? */}
                  { nftMeta.image ?
                    <img src={nftMeta.image} alt="" className="h-40" /> :
                    <div>
                    <label className="block text-sm font-medium text-gray-700">图片</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-green-400 hover:text-green-300 "
                          >
                            <span>上传图片</span>
                            <input
                              onChange={handleImageAndUploadToIpfs}
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">或拖拽图片至此处</p>
                        </div>
                        <p className="text-xs text-gray-500">支持PNG, JPG, GIF格式,最大10MB</p>
                      </div>
                    </div>
                  </div>
                  }
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    onClick = {uploadMetaToIpfs}
                    type="button"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-500 "
                  >
                    铸造
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        }
      </div>
    </BaseLayout>
  )
}

export default NftCreate