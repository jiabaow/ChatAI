import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './Login';
import Chat from './Chat';

function App() {
  const [token, setToken] = useState("");

  return (
    <Router>
      <Routes>
        <Route path="/chat" element={<Chat token={token} />} />
        <Route path="/" element={<Login setToken={setToken} />} />
      </Routes>
    </Router>
  );
}

export default App;
