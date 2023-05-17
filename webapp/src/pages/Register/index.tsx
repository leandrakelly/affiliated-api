import { useRef, useState, useEffect } from "react";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Button, Input } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.css";

import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,}$/;
const REGISTER_URL = "/auth/signup";

export const Register = () => {
  const navigate = useNavigate();

  const userRef = useRef(null);
  const errRef = useRef(null);

  const [email, setEmail] = useState("");
  const [emailFocus, setEmailFocus] = useState(false);

  const [firstName, setFirstName] = useState("");

  const [lastName, setLastName] = useState("");

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (userRef.current) {
      (userRef.current as HTMLInputElement).focus();
    }
  }, []);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [pwd, matchPwd]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v2 = PWD_REGEX.test(pwd);
    if (!v2) {
      setErrMsg("Please fix the errors bellow.");
      return;
    }
    try {
      await axios.post(
        REGISTER_URL,
        JSON.stringify({
          email,
          password: pwd,
          firstName: firstName,
          lastName: lastName,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (!err?.response) {
        setErrMsg("No response from server. Please try again later.");
      } else if (err.response.status === 403) {
        setErrMsg("Email already exists. Please try again.");
      } else {
        setErrMsg("Something went wrong. Please try again later.");
      }

      (errRef.current as HTMLParagraphElement | null)?.focus();
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>Success! You are now registered.</h1>
          <Button
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </Button>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <Input
              type="email"
              id="email"
              autoComplete="off"
              required
              aria-invalid="false"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
              className={
                emailFocus && email
                  ? "valid-input"
                  : emailFocus
                  ? "invalid-input"
                  : ""
              }
            />
            <p className="instructions">
              <FontAwesomeIcon icon={faInfoCircle} />
              We&apos;ll never share your email with anyone else.
            </p>

            <label htmlFor="firstName">First Name</label>
            <Input
              type="text"
              id="firstName"
              autoComplete="off"
              aria-invalid="false"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <label htmlFor="lastName">Last Name</label>
            <Input
              type="text"
              id="lastName"
              autoComplete="off"
              aria-invalid="false"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

            <label htmlFor="password">Password</label>
            <Input
              type="password"
              id="password"
              required
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="password-err"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
              className={
                pwdFocus
                  ? validPwd && validMatch
                    ? "valid-input"
                    : "invalid-input"
                  : ""
              }
            />

            <p
              id="password-err"
              className={
                pwdFocus && pwd && !validPwd ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />8 characters or more. At
              least one uppercase letter, one lowercase letter, one number, and
              one special character. Allowed special characters:{" "}
              <span aria-label="exclamation mark">!</span>
              <span aria-label="at sign">@</span>{" "}
              <span aria-label="hash">#</span>
              <span aria-label="dollar sign">$</span>{" "}
              <span aria-label="percent sign">%</span>
            </p>

            <label htmlFor="match-password">Confirm Password</label>

            <Input
              type="password"
              id="match-password"
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="match-password-err"
              value={matchPwd}
              onChange={(e) => setMatchPwd(e.target.value)}
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
              className={
                matchFocus
                  ? validPwd && validMatch
                    ? "valid-input"
                    : "invalid-input"
                  : ""
              }
            />

            <p
              id="match-password-err"
              className={
                matchFocus && !validMatch ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must match password above.
            </p>

            {validPwd && validMatch && !success && (
              <div className="great-msg">Looks good!</div>
            )}

            <button disabled={!validPwd || !validMatch}>Register</button>
          </form>

          <p className="register-link">
            Already registered?
            <span className="line">
              <Button
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login
              </Button>
            </span>
          </p>
        </section>
      )}
    </>
  );
};
