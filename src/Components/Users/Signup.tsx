import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../Firestore/firestore";
import { Navigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const SignUp = async () => {
    if (!email || !password || !confirmPassword) {
      setError("All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Navigate({ to: "/auth" });
      setError("Signup successful! ✅");
    } catch (err) {
      setError((err as Error)?.message);
    }
  };

  return (
    <div className="container-fluid">
      <input
        placeholder="Email"
        className="form-control my-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Enter Password"
        type="password"
        className="form-control my-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        placeholder="Enter Password again"
        type="password"
        className="form-control my-2"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {error && <p className="text-danger">{error}</p>}
      <button onClick={SignUp} className="btn btn-primary d-block mx-auto">
        Sign Up
      </button>
    </div>
  );
};

export default Signup;
