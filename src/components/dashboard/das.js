import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showAlert } from "../Alert";
import classes from "./../ref.module.css";

function Das() {
  const navigate = useNavigate();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const firebaseConfig = {
    authDomain: "",
    projectId: "",
    storageBucket: "",
  };

  firebase.initializeApp(firebaseConfig);
  const storage = firebase.storage();

  const submitDateHandler = (event) => {
    event.preventDefault();
    setIsFormSubmitted(true);

    const fdate = document.getElementById("Sdate").value;
    const fsub = document.getElementById("SubCode").value;

    const storageRef = storage.ref().child("Attendance");
    storageRef
      .listAll()
      .then(function (result) {
        const regexPattern = new RegExp(
          `^Attendance_${fsub}_${fdate}_\\d{2}-\\d{2}-\\d{2}\\.csv$`
        );
        let fileFound = false;

        result.items.forEach(function (item) {
          const filename = item.name;
          if (regexPattern.test(filename)) {
            fileFound = true;
            item
              .getDownloadURL()
              .then((url) => {
                const downloadLink = document.createElement("a");
                downloadLink.href = url;
                downloadLink.download = filename;
                downloadLink.click();
                showAlert("success", "File downloaded successfully");
                setTimeout(() => {
                  navigate("/dashboard");
                }, 2000);
              })
              .catch((error) => {
                showAlert("error", "no data to download");
                console.error("Error getting download URL:", error);
                setIsFormSubmitted(false);
              });
          }
        });

        if (!fileFound) {
          showAlert("error", "No matching file found");
          setIsFormSubmitted(false);
        }
      })
      .catch(function (error) {
        console.error(error);
        setIsFormSubmitted(false);
      });
  };

  return (
    <main className={classes["login-form"]}>
      <h2 className={classes["heading-secondary"]}>Enter the date</h2>
      <form className={classes["form__group"]} onSubmit={submitDateHandler}>
        <label className={classes["form__label"]}>
          Subject Code
          <input
            id="SubCode"
            type="text"
            pattern="^\d{2}[a-zA-Z]{2}\d{2}$"
            required
            className={classes["form__input"]}
          />
        </label>

        <label className={classes["form__label"]}>
          Date
          <input
            id="Sdate"
            type="date"
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
            Download
          </button>
        </div>
      </form>
    </main>
  );
}

export default Das;
