/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useEffect } from "react";
import "./index.css";

import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "antd";
const LOGIN_URL = "/auth/signin";

export const Login = () => {
  const { setUserToken = () => {} } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || { pathname: "/" };

  const userRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const setToken = (token: string) => {
    localStorage.setItem("token", token);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const accessToken: string = response?.data?.access_token;
      setUserToken(accessToken);
      setEmail("");
      setPassword("");
      setToken(accessToken);
      navigate(from, { replace: true });
    } catch (err: any) {
      if (!err.response) {
        setErrMsg("Network error");
      } else if (err.response.status === 400) {
        setErrMsg("Invalid email or password");
      } else if (err.response.status === 403) {
        setErrMsg("Account not verified");
      } else {
        setErrMsg(err.response.data.message);
      }

      errRef.current?.focus();
    }
  };

  return (
    <section>
      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
        role="alert"
      >
        {errMsg}
      </p>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          ref={userRef}
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button>Sign in</button>
      </form>
      Need an account?
      <span className="line">
        <Button
          onClick={() => {
            navigate("/register");
          }}
        >
          Register now
        </Button>
      </span>
    </section>
  );
};
