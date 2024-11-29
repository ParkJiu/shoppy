import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { LoginApiProvider } from "./context/LoginContext";

function App() {
  return (
    <div>
      <LoginApiProvider>
        <Header />
        <Outlet />
      </LoginApiProvider>
    </div>
  );
}

export default App;
