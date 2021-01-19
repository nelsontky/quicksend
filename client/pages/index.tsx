// import ProductCategories from './modules/views/ProductCategories';
// import ProductSmokingHero from './modules/views/ProductSmokingHero';
// import AppFooter from './modules/views/AppFooter';
import ProductHero from "../components/ProductHero";
// import ProductValues from './modules/views/ProductValues';
// import ProductHowItWorks from './modules/views/ProductHowItWorks';
// import ProductCTA from './modules/views/ProductCTA';
import AppAppBar from "../components/AppAppBar";

export default function Index() {
  return (
    <>
      <AppAppBar />
      <ProductHero />
      {/* <ProductValues /> */}
      {/* <ProductCategories />
      <ProductHowItWorks />
      <ProductCTA />
      <ProductSmokingHero />
      <AppFooter /> */}
    </>
  );
}
