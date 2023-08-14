import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showAlert } from "../Alert";
import classes from "./../ref.module.css";

function Adds() {
  const [selectedGender, setSelectedGender] = useState(null);
  const navigate = useNavigate();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const firebaseConfig = {
    authDomain: "",
    projectId: "",
    storageBucket: "",
  };

  firebase.initializeApp(firebaseConfig);

  const handleRadioChange = (event) => {
    setSelectedGender(event.target.value);
  };

  const sid = useRef("");
  const sname = useRef("");
  const semail = useRef("");
  const sdob = useRef("");

  function submitHandler(event) {
    event.preventDefault();
    setIsFormSubmitted(true);

    const students = {
      sid: sid.current.value,
      sname: sname.current.value,
      semail: semail.current.value,
      sdob: sdob.current.value,
      ssex: selectedGender,
      sattd: 0,
      fid: Math.floor(Math.random() * 90000) + 10000,
    };

    addStudentHandler(students);
  }

  async function addStudentHandler(students) {
    try {
      //check duplicate
      // const res = await fetch(
      //   `https://firebaseio.com/students.json`
      // );
      // if (!res.ok) {
      //   showAlert(
      //     "error",
      //     "could not fetch student details or database is empty"
      //   );
      //   throw new Error("in adds something went wrong");
      // }

      // const datta = await res.json();

      // if (datta != null) {
      //   for (const key in datta) {
      //     if (datta[key].sid === students.sid) {
      //       setTimeout(() => {
      //         showAlert("error", "Duplicate value entered");
      //       }, 2000);
      //       throw new Error("Duplicate value entered");
      //     }
      //   }
      // }

      // end

      const response = await fetch("https://firebaseio.com/students.json", {
        method: "POST",
        body: JSON.stringify(students),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("In add student something went wrong");
      }
      // const data = await response.json();
      ////////////////////////////////////////////////////////////////////
      // firebase image
      const fileInput = document.getElementById("fileInput");
      const file = fileInput.files[0];
      const storageRef = firebase.storage().ref();

      // Set the path where you want to store the file in the storage bucket
      const newFileName = `${students.sid}.jpeg`;
      const filePath = "Images/" + newFileName;

      const uploadTask = storageRef.child(filePath).put(file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // You can monitor the upload progress here
        },
        (error) => {
          console.error("Error uploading file:", error);
        },
        () => {
          // Upload completed successfully
          console.log("File uploaded successfully");
        }
      );

      //firebase end
      //////////////////////////////////////////////////////////////////
      //python script
      const presponse = await fetch("http://localhost:5000/capture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input_value1: students.sid,
          input_value2: students.sname,
          input_value3: students.fid,
        }),
      });

      if (!presponse.ok) {
        throw new Error("In add student to python something went wrong");
      }

      //////////////////////////////////////////////////////////////////
      showAlert("success", "data added to the database Successfully");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error(error);
      showAlert("error", "Something went wrong data not added to the database");
      setIsFormSubmitted(false);
    }
  }

  return (
    <main className={classes["login-form"]}>
      <h2 className={classes["heading-secondary"]}>Enter the details</h2>
      <form onSubmit={submitHandler} className={classes["form__group"]}>
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

        <label className={classes["form__label"]}>
          Email address
          <input
            type="email"
            pattern="^.+@drait\.edu\.in$"
            required
            placeholder="you@drait.edu.in"
            className={classes["form__input"]}
            ref={semail}
          />
        </label>

        <label className={classes["form__label"]}>
          DOB
          <input
            type="date"
            required
            className={classes["form__input"]}
            ref={sdob}
          />
        </label>

        <label className={classes["form__label"]}>
          Gender
          <div className={classes["form__radio-group"]}>
            <label className={classes["form__radio-label"]}>
              <input
                type="radio"
                className={classes["form__radio-input"]}
                name="gender"
                value="M"
                required
                onChange={handleRadioChange}
              />
              Male
            </label>
            <label className={classes["form__radio-label"]}>
              <input
                type="radio"
                className={classes["form__radio-input"]}
                name="gender"
                value="F"
                required
                onChange={handleRadioChange}
              />
              Female
            </label>
          </div>
        </label>

        <label className={classes["form__label"]}>
          Photo
          <input
            type="file"
            id="fileInput"
            accept="image/*"
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
            Add
          </button>
        </div>
      </form>
    </main>
  );
}

export default Adds;
