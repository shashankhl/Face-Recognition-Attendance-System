import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../store/auth-context";
import { showAlert } from "./Alert";
import classes from "./ref.module.css";

function LogIn() {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const email = useRef("");
  const pass = useRef("");

  const teacherDataHandler = (event) => {
    event.preventDefault();
    setIsFormSubmitted(true);
    checkTeacher();
  };

  const checkTeacher = async () => {
    const temail = email.current.value;
    const tpass = pass.current.value;

    try {
      const response = await fetch("https://firebaseio.com/teachers.json");
      if (!response.ok) {
        showAlert(
          "error",
          "could not fetch teacher details or database is empty"
        );
        throw new Error("in login something went wrong");
      }

      const data = await response.json();

      let checklogin = null;
      for (const key in data) {
        if (data[key].temail === temail && data[key].tpass === tpass) {
          checklogin = true;
        } else {
          checklogin = false;
        }
      }

      if (!checklogin) {
        throw new Error("Login unsuccessful");
      }

      authCtx.onLogin(temail, tpass);

      showAlert("success", "Logged in successfully");

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      showAlert("error", "Login unsuccessful check the details entered");
      console.log(error);
      setIsFormSubmitted(false);
    }
  };

  return (
    <main className={classes["login-form"]}>
      <h2 className={classes["heading-secondary"]}>Login to view dashboard</h2>
      <form className={classes["form__group"]} onSubmit={teacherDataHandler}>
        <label className={classes["form__label"]}>
          Email address
          <input
            type="email"
            pattern="^.+@drait\.edu\.in$"
            required
            placeholder="you@drait.edu.in"
            className={classes["form__input"]}
            ref={email}
          />
        </label>

        <label className={classes["form__label"]}>
          Password
          <input
            type="password"
            placeholder="••••••••"
            minLength="8"
            required
            className={classes["form__input"]}
            ref={pass}
          />
        </label>

        <div>
          <button
            className={` ${
              isFormSubmitted ? classes["disabled-button"] : classes.button
            }`}
            disabled={isFormSubmitted}
          >
            Login
          </button>
        </div>
      </form>
    </main>
  );
}

export default LogIn;
