import classes from "./MainNavigation.module.css";
import Navigation from "./Navigation";

const MainNavigation = (props) => {
  return (
    <header className={classes["main-header"]}>
      <h1>Face Recognition Attendance System</h1>
      <Navigation />
    </header>
  );
};

export default MainNavigation;
