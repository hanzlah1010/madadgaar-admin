import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Auth from "./Components/Users/login";
import App from "./main";
import { BrowserRouter } from "react-router-dom";
import { auth } from "./Firestore/firestore"; // ✅ Import Firebase auth
import { User } from "firebase/auth";

const RootComponent = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return <BrowserRouter>{user ? <App /> : <Auth />}</BrowserRouter>;
};

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <RootComponent />
    </React.StrictMode>
  );
} else {
  console.error("Could not find the 'root' element in the DOM.");
}
