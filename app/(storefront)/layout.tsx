import React from "react";
import Navbar from "./_components/navbar";
import Footer from "./_components/footer";
import FlagBanner from "./_components/flag-banner";

function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FlagBanner />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</main>
      <Footer />
    </>
  );
}

export default StoreLayout;
