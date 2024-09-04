import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { GoogleOAuthProvider } from '@react-oauth/google';
const inter = Inter({ subsets: ["latin"] });
export default function App({ Component, pageProps }: AppProps) {
  return <div className={inter.className}>
    <GoogleOAuthProvider clientId="10509446635-82avtqojfbrk7c64f8a06oas4cur03bf.apps.googleusercontent.com">
    <Component{...pageProps}/>
    </GoogleOAuthProvider>
    </div>;
}
