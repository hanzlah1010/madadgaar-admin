import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Auth from "./Components/Users/login";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { auth } from "./Firestore/firestore"; // ✅ Import Firebase auth

const RootComponent = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user); 
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <BrowserRouter>
      {user ? <App /> : <Auth />} 
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>
);
