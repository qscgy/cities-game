import React, { useState } from "react";
import './App.css';
import Map from "./components/Map";

function App() {
  const [value, setValue] = useState("");
  function handleChange(e) {
      setValue(e.target.value);
  }
  return (
    <div className="App">
      
      <Map />
    </div>
  );
}

export default App;
