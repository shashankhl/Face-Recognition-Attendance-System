import classes from "./Student.module.css";

const Student = (props) => {
  let styl = `${classes["student"]}`;
  if (props.gender === "M") {
    styl = `${classes["student"]} ${classes["student-m"]}`;
  } else {
    styl = `${classes["student"]} ${classes["student-f"]}`;
  }

  return (
    <li className={styl}>
      <h2>{props.sid}</h2>
      <h3>{props.name}</h3>
      <div className={classes["gen-mf"]}>
        <button>{props.attd}</button>
      </div>
    </li>
  );
};

export default Student;
