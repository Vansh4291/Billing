import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BillingUseState from "./pages/BillingUseState";
import BillingRedux from "./pages/Redux/BillingRedux";
import Invoice from "./pages/Invoice";
// import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <nav style={{ padding: "1rem", background: "#eee" }}>
        <Link to="/state" style={{ marginRight: "1rem" }}>
          Use State
        </Link>
        <hr />
        <Link to="/redux" style={{ marginRight: "1rem" }}>
          Redux
        </Link>
        <hr />
        <Link to="/invoice">Invoices</Link>
      </nav>

      <Routes>
        {/* Home Page => User Table */}
        <Route path="/state" element={<BillingUseState />} />

        {/* Register or Edit User */}
        <Route path="/redux" element={<BillingRedux />} />
        <Route path="/invoice" element={<Invoice />} />
      </Routes>
    </Router>
  );
}
export default App;
