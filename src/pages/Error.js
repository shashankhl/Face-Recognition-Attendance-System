import MainNavigation from "../components/MainNavigation";

function ErrorPage() {
  const mystyle = {
    color: "red",
    backgroundColor: "black",
    padding: "10px",
    fontFamily: "Arial",
  };

  return (
    <>
      <MainNavigation />
      <main style={mystyle}>
        <h1 >An error occured!🤯</h1>
        <p >Something went wrong</p>
      </main>
    </>
  );
}

export default ErrorPage;
