import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showAlert } from "./Alert";
import classes from "./ref.module.css";

function Attendance() {
  const subCode = useRef("");
  const tId = useRef("");
  const tPass = useRef("");
  const navigate = useNavigate();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  function submitHandler(event) {
    event.preventDefault();
    setIsFormSubmitted(true);

    const teacher = {
      tId: tId.current.value,
      tPass: tPass.current.value,
      subCode: subCode.current.value,
    };

    checkTeacher(teacher);
  }

  async function checkTeacher(teacher) {
    try {
      const res = await fetch(`https://firebaseio.com/teachers.json`);
      if (!res.ok) {
        showAlert(
          "error",
          "could not fetch student details or database is empty"
        );
        throw new Error("in Attendance.js something went wrong");
      }

      const data = await res.json();

      if (data != null) {
        let authenticated = false;

        for (const key in data) {
          if (
            data[key].tid === teacher.tId &&
            data[key].tpass === teacher.tPass
          ) {
            authenticated = true;
            try {
              await takeAttendance(teacher.subCode);
              showAlert("success", "Authentication successful");
            } catch (error) {
              showAlert("error", "Error while taking attendance");
            }
            break;
          }
        }

        if (!authenticated) {
          showAlert("error", "Authentication unsuccessful");
          throw new Error("Authentication unsuccessful");
        }
      }

      try {
        showAlert("success", "Taken Attendance Successfully");
      } catch (error) {
        console.error("Show alert error:", error);
      }
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error(error);
      showAlert("error", "Authentication unsuccessful");
      setIsFormSubmitted(false);
    }
  }

  const takeAttendance = async (subc) => {
    const response = await fetch("http://localhost:5000/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input_value1: subc,
      }),
    });

    if (!response.ok) {
      throw new Error("In attendance student to python something went wrong");
    }

    const data = await response.json();
    console.log(data["message"]);
  };

  return (
    <main className={classes["login-form"]}>
      <h2 className={classes["heading-secondary"]}>Fill to take attendance</h2>
      <form className={classes["form__group"]} onSubmit={submitHandler}>
        <label className={classes["form__label"]}>
          Subject Code
          <input
            type="text"
            pattern="^\d{2}[a-zA-Z]{2}\d{2}$"
            required
            className={classes["form__input"]}
            ref={subCode}
          />
        </label>

        <label className={classes["form__label"]}>
          Teacher Id
          <input
            type="text"
            pattern="^[a-zA-Z]{2}\d{2}$"
            required
            className={classes["form__input"]}
            ref={tId}
          />
        </label>

        <label className={classes["form__label"]}>
          Password
          <input
            type="password"
            placeholder="••••••••"
            minLength="6"
            required
            className={classes["form__input"]}
            ref={tPass}
          />
        </label>

        <div>
          <button
            className={` ${
              isFormSubmitted ? classes["disabled-button"] : classes.button
            }`}
            disabled={isFormSubmitted}
          >
            Mark Attendance
          </button>
        </div>
      </form>
    </main>
  );
}

export default Attendance;
