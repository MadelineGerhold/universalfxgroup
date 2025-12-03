// SmartsuppChat.js
"use client";
import { useEffect } from "react";

const SmartsuppChat = () => {
  useEffect(() => {
    // Dynamically add the Smartsupp chat script
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = "https://www.smartsuppchat.com/loader.js?";
    document.body.appendChild(script);

    // Set the Smartsupp key
    script.onload = () => {
      window._smartsupp = window._smartsupp || {};
      window._smartsupp.key = "d4958d16b7bf6711d40f099669af8fd0cb5741f7";
    };

    // Clean up the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []); // Empty dependency array to run once on mount

  return null; // This component doesn't need to render anything
};

export default SmartsuppChat;
