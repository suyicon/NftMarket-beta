import { BaseLayout , NftList } from '@ui'
import { Inter } from 'next/font/google'
import nfts from "../content/meta.json"
import { Nft, NftMeta } from '@_types/nft'
import { useWeb3 } from '@providers/web3'
import { useListedNft } from '@hooks/web3'


const inter = Inter({ subsets: ['latin'] })



export default function Home() {
  const { nft } = useListedNft();
  console.log("nftdata:",nft.data);



  const {provider,contract} = useWeb3();
  console.log(provider);
  console.log(contract);

  const getAccounts = async () =>{
    const accounts = await provider!.listAccounts();
    console.log(accounts[0]);
  }

  if(provider){
    getAccounts();
  }

  const getNFT = async () => {
    console.log(await contract!.name());
    console.log(await contract!.symbol());
  }

 if(contract){
    getNFT();
 }

  return (
    <BaseLayout>
    <div className="relative bg-gray-50 pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
      <div className="absolute inset-0">
        <div className="bg-white h-1/3 sm:h-2/3" />
      </div>
      <div className="relative">
        <div className="text-center">
          <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">Persona</h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
           夺取专属于你的人格面具吧！
          </p>
        </div>
          <NftList
            nfts={nft.data as unknown as Nft[]}
          />
      </div>
    </div>
  </BaseLayout>
  )
}
