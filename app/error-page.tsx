import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button"; // Ensure this path is correct

const ErrorPage = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong.</h2>
      <p className="text-muted-foreground">
        We&#39;re sorry for the inconvenience. Please try refreshing the page or
        come back later.
      </p>
      <Image
        src="/movie.png"
        className="object-contain dark:invert dark:mix-blend-lighten contrast-150"
        alt="Box"
        height={200}
        width={200}
      />
      <Button onClick={handleReload} size="sm" className="mt-5 w-full">
        Refresh Page
      </Button>
    </div>
  );
};

export default ErrorPage;
