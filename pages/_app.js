import '@/styles/globals.css'
import { AuthProvider } from '../context/authContext';
import { QueryClient, QueryClientProvider, Hydrate } from 'react-query'

const queryclient = new QueryClient();


export default function App({ Component, pageProps }) {
  return(
    <AuthProvider>
    <QueryClientProvider client={queryclient}>
      <Hydrate state={pageProps.dehydratedState}>
      <Component {...pageProps}/>
      </Hydrate>
    
    </QueryClientProvider>
    </AuthProvider>
  )
 
}
