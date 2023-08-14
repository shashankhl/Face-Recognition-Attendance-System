import { Link } from "react-router-dom";

import classes from "./Home.module.css";

function HomePage() {
  return (
    <>
      <div className={classes["hero-image"]}>
        <Link to="/attendance">
          <button className={classes["show-modal"]}>Mark Attendance</button>
        </Link>
      </div>
    </>
  );
}

export default HomePage;
