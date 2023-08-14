import Student from "./Student";
import classes from "./StudentList.module.css";

const StudentList = (props) => {
  return (
    <ul className={classes["students-list"]}>
      {props.students
        .slice()
        .sort((a, b) => a.sid.localeCompare(b.sid))
        .map((student) => (
          <Student
            key={student.id}
            sid={student.sid}
            name={student.sname}
            attd={student.sattd}
            gender={student.ssex}
          />
        ))}
    </ul>
  );
};

export default StudentList;
