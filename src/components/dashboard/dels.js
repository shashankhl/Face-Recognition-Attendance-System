import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showAlert } from "../Alert";
import classes from "./../ref.module.css";

function Deletes() {
  const sid = useRef("");
  const sname = useRef("");
  const navigate = useNavigate();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  function deleteHandler(event) {
    event.preventDefault();
    setIsFormSubmitted(true);

    const student = {
      sid: sid.current.value,
      sname: sid.current.value,
    };

    const proceed = window.confirm("Are you sure?");

    if (proceed) {
      deleteStudent(student);
    }
  }

  async function deleteStudent(stud) {
    try {
      var deleteId = null;
      //check data
      const res = await fetch("https://firebaseio.com/students.json");
      if (!res.ok) {
        showAlert(
          "error",
          "could not fetch student details or database is empty"
        );
        throw new Error("in dels something went wrong");
      }

      const datta = await res.json();

      let check = true;

      if (datta != null) {
        for (const key in datta) {
          if (datta[key].sid === stud.sid) {
            deleteId = key;
            check = false;
            break;
          }
          check = true;
        }
      }

      if (check) {
        setTimeout(() => {
          showAlert("error", "data not found");
        }, 2000);
        throw new Error("data not found");
      }

      // end

      const response = await fetch(
        `https://firebaseio.com/students/${deleteId}.json`,
        {
          method: "DELETE",
        }
      );
      if (!response) {
        throw new Error("In delete student something went wrong");
      }

      ///////////////////////////////////////////////////////////////
      //py-script
      const presponse = await fetch("http://localhost:5000/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input_value1: stud.sid,
          input_value2: stud.sname,
        }),
      });

      if (!presponse.ok) {
        throw new Error("In add student to python something went wrong");
      }
      ///////////////////////////////////////////////////////////////

      showAlert("success", "Student deleted successfully");
      setTimeout(() => {
        navigate("/login/dashboard");
      }, 2000);
    } catch (error) {
      console.error(error);
      showAlert("error", "Student not deleted");
      setIsFormSubmitted(false);
    }
  }

  return (
    <main className={classes["login-form"]}>
      <h2 className={classes["heading-secondary"]}>Enter the details</h2>
      <form className={classes["form__group"]} onSubmit={deleteHandler}>
        <label className={classes["form__label"]}>
          Enter student Id
          <input
            type="text"
            pattern="^1da\d{2}[a-zA-Z]{2}\d{3}$"
            required
            className={classes["form__input"]}
            ref={sid}
          />
        </label>

        <label className={classes["form__label"]}>
          Student Name
          <input
            type="text"
            minLength="4"
            required
            className={classes["form__input"]}
            ref={sname}
          />
        </label>

        <div>
          <button
            className={` ${
              isFormSubmitted ? classes["disabled-button"] : classes.button
            }`}
            disabled={isFormSubmitted}
          >
            Submit
          </button>
        </div>
      </form>
    </main>
  );
}

export default Deletes;
