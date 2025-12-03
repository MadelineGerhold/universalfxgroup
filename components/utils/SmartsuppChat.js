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
      window._smartsupp.key = "3c1ba0b5a1680db249e94ed71132831ef0fbd06c";
    };

    // Clean up the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []); // Empty dependency array to run once on mount

  return null; // This component doesn't need to render anything
};

export default SmartsuppChat;
