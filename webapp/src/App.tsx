import { Register } from "./pages/Register";
import "./index.css";
import { Login } from "./pages/Login";
import { Routes, Route, Navigate } from "react-router-dom";
import { Transactions } from "./pages/Transactions";
import { RequireAuth } from "./components/RequireAuth";
import Layout from "./components/Layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />

        <Route element={<RequireAuth />}>
          <Route path="/" element={<Transactions />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Route>
    </Routes>
  );
}

export default App;
