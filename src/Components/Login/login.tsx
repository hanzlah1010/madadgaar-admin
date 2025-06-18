import { useState } from "react";
import { auth, Provider } from "../../Firestore/firestore";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FirebaseError } from "firebase/app";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // ❌ State for error message
  const navigate = useNavigate();

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const Signin = async () => {
    if (!isValidEmail(email)) {
      setError("Invalid email format! Please enter a valid email."); 
      return;
    }
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/app");
    } catch (err) {
      const error = err as FirebaseError;
      if (error.code === "auth/email-already-in-use") {
        setError("Email Already Registered! Please use a different email.");
      } else if (error.code === "auth/weak-password") {
        setError("Password should be at least 6 characters long.");
      } else {
        setError(error.message);
      }
    }
  };

  

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <div className="container w-50 text-center">
        <h2 className="text-light">Login</h2>
        &nbsp;
        <input
          placeholder="Email"
          className="form-control my-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          className="form-control my-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-danger">{error}</p>}
        <button onClick={Signin} className="btn btn-primary  d-block mx-auto">
          Sign in
        </button>
        <br />
        
      </div>
    </div>
  );
};

export default Auth;
