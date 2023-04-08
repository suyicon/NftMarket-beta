import '../styles/globals.css'
import { Web3Provider } from '@providers'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import 'p5-ui/dist/style.css'



export default function App({ Component, pageProps }: AppProps) {
  return(
  <>
    <Web3Provider>
      <ToastContainer /> 
      <Component {...pageProps} />
    </Web3Provider>
  </>
  )
}
