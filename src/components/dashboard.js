import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { showAlert } from "./Alert";
import classes from "./dashboard.module.css";
import StudentList from "./students/StudentList";

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const studentDataHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://firebaseio.com/students.json");
      if (!response.ok) {
        showAlert(
          "error",
          "could not fetch student details or database is empty"
        );
        throw new Error("in dashboard something went wrong");
      }

      const data = await response.json();

      const loadedStudents = [];

      for (const key in data) {
        loadedStudents.push({
          id: key,
          sname: data[key].sname,
          sid: data[key].sid,
          ssex: data[key].ssex,
          sattd: data[key].sattd,
        });
      }

      setStudents(loadedStudents);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []); //incomplete 214

  useEffect(() => {
    studentDataHandler();
  }, [studentDataHandler]);

  let content = <p style={{ color: "black" }}>Found no students.</p>;

  if (students.length > 0) {
    content = <StudentList students={students} />;
  }

  if (error) {
    content = <p style={{ color: "black" }}>{error}</p>;
  }

  if (isLoading) {
    content = <p style={{ color: "black" }}>Loading...</p>;
  }

  return (
    <>
      <div className={classes["body--db"]}>
        <Link to="/dashboard/addStudent" className={classes["show-modal"]}>
          Add Student
        </Link>
        <Link to="/dashboard/download" className={classes["show-modal"]}>
          download Attendance sheet
        </Link>
        <Link to="/dashboard/deleteStudent" className={classes["show-modal"]}>
          Delete Student
        </Link>
      </div>
      <div>
        <section>
          <button onClick={studentDataHandler}>Fetch Students</button>
        </section>
        <section>{content}</section>
      </div>
    </>
  );
}

export default Dashboard;
