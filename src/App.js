import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Attendance from "./components/Attendance";
import Dashboard from "./components/dashboard";
import Adds from "./components/dashboard/adds";
import Das from "./components/dashboard/das";
import Deletes from "./components/dashboard/dels";
import LogIn from "./components/LogIn";
import Signup from "./components/Signup";
import ErrorPage from "./pages/Error";
import HomePage from "./pages/Home";
import RootLayout from "./pages/Root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        // path: "/",path:'',
        element: <HomePage />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "login",
        element: <LogIn />,
      },
      {
        path: "attendance",
        element: <Attendance />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "dashboard/addStudent",
        element: <Adds />,
      },
      {
        path: "dashboard/download",
        element: <Das />,
      },
      {
        path: "dashboard/deleteStudent",
        element: <Deletes />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
