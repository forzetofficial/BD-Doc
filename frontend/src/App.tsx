import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Home from "./pages/Home";
import CookieDebug from "./components/CookieDebug";
import ActivateAccount from "./pages/ActivateAccount";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Registration />} />
        <Route path="/auth/activate_account/:url" element={<ActivateAccount />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
      <CookieDebug />
    </>
  );
}

export default App;