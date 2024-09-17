"use client"
import React, { useState, useEffect } from "react";

const FlagBanner: React.FC = () => {
  const messages: string[] = [
    "TAKE AN ADDITIONAL 30% OFF SALE",
    "Free Shipping and Returns",
    // Add more messages as needed
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000);

    return () => {
      clearInterval(timer);
    };
  }, [messages.length]);

  return (
    <div>
      <div className="w-full h-[40px] bg-[#0E0E0D] flex justify-center items-center px-4 text-gray-300 mx-auto">
        <span className="text-xs font-poppins" style={{ display: 'initial' }}>
          {messages[currentMessageIndex]}
          {/* <a className='underline underline-offset-1'>SHOP NOW</a> */}
        </span>
      </div>
    </div>
  );
};

export default FlagBanner;
