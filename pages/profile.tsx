import type { NextPage } from 'next'
import { BaseLayout } from '@ui'
import { useOwnedNft } from '@hooks/web3';
import { Nft, NftMeta } from '@_types/nft';
import { useEffect, useState } from 'react';

const tabs = [
  { name: 'Your Collection', href: '#', current: true },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const Profile: NextPage = () => {
  const { nft }  = useOwnedNft();
  const [activeNft,setActiveNft] = useState<Nft>();

  useEffect(()=>{
    if(nft.data){
      setActiveNft(nft.data[0]);
    }
    return () => setActiveNft(undefined)
  },[nft.data])


  return (
    <BaseLayout>
      <div className="h-full flex">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex items-stretch overflow-hidden">
            <main className="flex-1 overflow-y-auto">
              <div className="pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex">
                  <h1 className="flex-1 text-2xl font-bold text-gray-900">Your NFTs</h1>
                </div>
                <div className="mt-3 sm:mt-2">
                  <div className="hidden sm:block">
                    <div className="flex items-center border-b border-gray-200">
                      <nav className="flex-1 -mb-px flex space-x-6 xl:space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                          <a
                            key={tab.name}
                            href={tab.href}
                            aria-current={tab.current ? 'page' : undefined}
                            className={classNames(
                              tab.current
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                            )}
                          >
                            {tab.name}
                          </a>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>

                <section className="mt-8 pb-16" aria-labelledby="gallery-heading">
                  <ul
                    role="list"
                    className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
                  >
                    {(nft.data as unknown as Nft[]).map((nft) => (
                      <li
                        onClick={()=>{setActiveNft(nft)}}
                        key={nft.meta.image}
                        className="relative">
                        <div>
                          <img
                            src={nft.meta.image}
                            alt=""
                            className={classNames(
                             'group-hover:opacity-75',
                              'object-cover pointer-events-none'
                            )}
                          />
                          <button onClick={()=>{}} type="button" className="absolute inset-0 focus:outline-none">
                            <span className="sr-only">View details for {nft.meta.name}</span>
                          </button>
                        </div>
                        <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">
                          {nft.meta.name}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </main>

            {/* Details sidebar */}
            <aside className="hidden w-96 bg-white p-8 border-l border-gray-200 overflow-y-auto lg:block">
            { activeNft&&
              <div className="pb-16 space-y-6">
                <div>
                        <div className="block w-full aspect-w-10 aspect-h-7 rounded-lg overflow-hidden">
                            <img src={activeNft.meta.image} alt="" className="object-cover" />
                        </div>
                        <div className="mt-4 flex items-start justify-between">
                            <div>
                                <h2 className="text-lg font-medium text-gray-900">
                                    <span className="sr-only">Details for </span>
                                </h2>
                                <p className="text-sm font-medium text-gray-500">{activeNft.meta.description}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Information</h3>
                  </div>
                

                <div className="flex">
                  <button
                    onClick={()=>{
                      const NFTname = activeNft.meta.name;
                      const DownloadLink = activeNft.meta.image;
                      window.open(DownloadLink,NFTname);
                    }}
                    type="button"
                    className="flex-1 bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Download Image
                  </button>
                  <button
                    onClick={()=>{
                      nft.listNFT(
                      activeNft.tokenId,
                      activeNft.price
                      )
                    }}
                    disabled = {activeNft.isListed}
                    type="button"
                    className="disabled:text-gray-400 disabled:cursor-not-allowed flex-1 ml-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {activeNft.isListed ? "Nft is on sale": "Make Nft on sale"}
                  </button>
                </div>
              </div>
            }
            </aside>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}

export default Profile