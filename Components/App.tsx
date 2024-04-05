import "../styles/globals.css";
import type { AppProps } from "next/app";
import Footer from "../Components/General/Footer/Footer";
import { SessionProvider } from "next-auth/react";
import Header from "../Components/General/Header/Header";
import { useEffect } from "react";

const hotjarId = process.env.NEXT_PUBLIC_HOTJAR_ID;

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.innerHTML = `(function(h,o,t,j,a,r){
      h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
      h._hjSettings={hjid:${hotjarId},hjsv:6};
      a=o.getElementsByTagName('head')[0];
      r=o.createElement('script');r.async=1;
      r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
      a.appendChild(r);
  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <SessionProvider>
        <Header />
        <div className="main">
          <Component {...pageProps} />
        </div>
        <Footer />
      </SessionProvider>
    </>
  );
}
