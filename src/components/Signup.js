import { useRef, useState } from "react";
import { redirect } from "react-router-dom";
import { showAlert } from "./Alert";
import classes from "./ref.module.css";

function Signup() {
  function checkPasswordMatch() {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    if (!(password === confirmPassword)) {
      document.getElementById("confirmPassword").value = "";
      showAlert("error", "passwords mismatch");
      throw new Error("Password Mismatch");
    }
  }

  const tid = useRef("");
  const tname = useRef("");
  const temail = useRef("");
  const tpass = useRef("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  function submitHandler(event) {
    try {
      event.preventDefault();
      setIsFormSubmitted(true);

      checkPasswordMatch();

      const teachers = {
        tid: tid.current.value,
        tname: tname.current.value,
        temail: temail.current.value,
        tpass: tpass.current.value,
      };

      addTeacherHandler(teachers);
    } catch (error) {
      console.error(error);
      setIsFormSubmitted(false);
    }
  }

  async function addTeacherHandler(teachers) {
    try {
      //check duplicate
      const res = await fetch(
        "https://firebaseio.com/teachers.json"
      );
      if (!res.ok) {
        showAlert(
          "error",
          "could not fetch teachers details or database is empty"
        );
        throw new Error("in adds something went wrong");
      }

      const datta = await res.json();

      for (const key in datta) {
        if (datta[key].tid === teachers.tid) {
          setTimeout(() => {
            showAlert("error", "Duplicate value entered");
          }, 2000);
          throw new Error("Duplicate value entered");
        }
      }

      // end

      const response = await fetch(
        "https://firebaseio.com/teachers.json",
        {
          method: "POST",
          body: JSON.stringify(teachers),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response) {
        throw new Error("In add teachers something went wrong");
      }
      // const data = await response.json();
      // console.log(data);
      showAlert("success", "data added to the database successfully");

      setTimeout(() => {
        redirect("/login");
      }, 2000);
    } catch (error) {
      console.error(error);
      showAlert("error", "something went wrong data not added to the database");
      setIsFormSubmitted(false);
    }
  }

  return (
    <main className={classes["login-form"]}>
      <h2 className={classes["heading-secondary"]}>
        Create your Teacher account
      </h2>
      <form className={classes["form__group"]} onSubmit={submitHandler}>
        <label className={classes["form__label"]}>
          Your Id
          <input
            type="text"
            pattern="^[a-zA-Z]{2}\d{2}$"
            required
            className={classes["form__input"]}
            ref={tid}
          />
        </label>

        <label className={classes["form__label"]}>
          Your Name
          <input
            type="text"
            minLength="4"
            required
            className={classes["form__input"]}
            ref={tname}
          />
        </label>

        <label className={classes["form__label"]}>
          Email address
          <input
            type="email"
            pattern="^.+@drait\.edu\.in$"
            required
            placeholder="you@drait.edu.in"
            className={classes["form__input"]}
            ref={temail}
          />
        </label>

        <label className={classes["form__label"]}>
          Password
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            minLength="8"
            pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*()-=_+[\]{}|;:,.<>?])(?=.*[0-9])([a-zA-Z0-9!@#$%^&*()-=_+[\]{}|;:,.<>?]){8,}$"
            required
            className={classes["form__input"]}
            ref={tpass}
          />
        </label>

        <label className={classes["form__label"]}>
          Confirm Password
          <input
            type="password"
            id="confirmPassword"
            placeholder="••••••••"
            minLength="8"
            required
            className={classes["form__input"]}
          />
        </label>
        <div>
          <button
            className={` ${
              isFormSubmitted ? classes["disabled-button"] : classes.button
            }`}
            disabled={isFormSubmitted}
          >
            Sign up
          </button>
        </div>
      </form>
    </main>
  );
}

export default Signup;
