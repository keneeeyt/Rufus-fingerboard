import React from "react";
import Hero from "./_components/hero";
import CategorySelection from "./_components/category-selection";
import FeaturedProducts from "./_components/featured-products";


function IndexPage() {
  return (
    <div>
     <Hero />
     <CategorySelection />
     <FeaturedProducts />
    </div>
  );
}

export default IndexPage;
