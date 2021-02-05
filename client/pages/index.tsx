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
