import Head from "next/head";

// import ProductCategories from './modules/views/ProductCategories';
// import ProductSmokingHero from './modules/views/ProductSmokingHero';
import ProductHero from "../components/ProductHero";
// import ProductValues from './modules/views/ProductValues';
// import ProductHowItWorks from './modules/views/ProductHowItWorks';
// import ProductCTA from './modules/views/ProductCTA';

export default function Index() {
  return (
    <>
      <Head>
        <title>Quick Send</title>
        <meta name="title" content="Quick Send" />
        <meta
          name="description"
          content="Send your files quickly! Upload up to 20GB per file for free on the fastest file hosting today!"
        />
        {/* <!-- Open Graph / Facebook --> */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://quicksend.io/" />
        <meta property="og:title" content="Quick Send" />
        <meta
          property="og:description"
          content="Send your files quickly! Upload up to 20GB per file for free on the fastest file hosting today!"
        />
        {/* <!-- Twitter --> */}
        <meta property="twitter:url" content="https://quicksend.io/" />
        <meta property="twitter:title" content="Quick Send" />
        <meta
          property="twitter:description"
          content="Send your files quickly! Upload up to 20GB per file for free on the fastest file hosting today!"
        />
      </Head>
      <ProductHero />
      {/* <ProductValues /> */}
      {/* <ProductCategories />
      <ProductHowItWorks />
      <ProductCTA />
      <ProductSmokingHero /> */}
    </>
  );
}
