
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import ActiveLink from '@ui/link'
import { useAccount, useNetwork } from 'components/hook/web3'
import { useWeb3 } from '@providers/web3'
import { showAccountData } from 'components/hook'
import  WalletBar from "./WalletBar"
import { isElementAccessExpression } from 'typescript'

const navigation = [
  { name: 'MarketPlace', href: '/', current: true },
  { name: 'Create', href: '/nft/create', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}



export default function Example() {

  const {data} = showAccountData("TEST JSON");
  const { network }= useNetwork();
  const{ hooks } = useWeb3();
  const{ account } = useAccount();

  console.log(data);
  console.log("network:",network.data);
  console.log(account.data);
  console.log(account.error);
  console.log("isloading:",account.isLoading);
  console.log("isinstalled:",account.isInstalled);
  console.log("targetNetwork:",network.targetNetwork);
  
  const networkColor = () =>{
    if(network.data&&!network.isLoading){
      return "text-green-500";
    }
    else if(network.isLoading){
      return "text-yellow-500"
    }
    else{
      return "text-red-500";
    }
  }
  const ncolor = networkColor();

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
        {account.data}
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="block h-8 w-auto lg:hidden"
                    src="https://github.com/q-mona/p5-ui/raw/main/src/assets/logo.png"
                    alt="Your Company"
                  />
                  <img
                    className="hidden h-8 w-auto lg:block"
                    src="https://github.com/q-mona/p5-ui/raw/main/src/assets/logo.png"
                    alt="Your Company"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <ActiveLink
                        key={item.name}
                        href={item.href}
                        activeClass="bg-gray-900 text-white"
                        >
                      <a
                        className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                      </ActiveLink>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                <div className="text-gray-300 self-center mr-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-purple-100 text-purple-800">
                    <svg className= {`-ml-0.5 mr-1.5 h-2 w-2 ${ncolor}`} fill="currentColor" viewBox="0 0 8 8">
                      <circle cx={4} cy={4} r={3} />
                    </svg>
                    { network.isLoading ?
                      "Loading..." :
                      account.isInstalled ?
                      network.data :
                      "Install Web3 Wallet"
                    }
                  </span>
                </div>
                <WalletBar 
                  isInstalled={account.isInstalled}
                  isLoading = {account.isLoading}
                  connect = {account.connect}
                  account = {account.data}
                />
                {/* Profile dropdown */}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
