import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";

function Login() {
  const { instance } = useMsal();

  const handleLogin = async () => {
    try {
      const response = await instance.loginPopup(loginRequest);
      const token = response.accessToken;
      localStorage.setItem("token", token);
      window.location.href = "/todo";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login with Microsoft</h2>
      <button onClick={handleLogin}>Sign In</button>
    </div>
  );
}

export default Login;
