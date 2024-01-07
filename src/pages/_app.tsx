import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { NextUIProvider } from '@nextui-org/react'
import Head from 'next/head';
export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <Head><title>cpbr ntwrk - checker</title></Head>
  <Component {...pageProps} />
  </NextUIProvider>
  );
}
