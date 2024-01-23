import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import Login from "./Login"; 
import TextEditor from "./TextEditor";

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={authenticated ? <Navigate to={`/documents/${uuidV4()}`} /> : <Login setAuthenticated={setAuthenticated} />}
        />
        <Route path="/documents/:id" element={authenticated ? <TextEditor /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
