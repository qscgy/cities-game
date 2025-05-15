import React, { useState } from "react";
import './App.css';
import Map from "./components/Map";

function App() {
  const [currentCountry, setCurrentCountry] = useState("Sweden");

  const handleCountryChange = (country) => {
    console.log("Country changed to:", country);
    setCurrentCountry(country);
  };

  return (
    <div className="App">
      <span style={{'fontSize': '20px'}}>Select country:</span>
      <button onClick={() => (handleCountryChange("France"))}>France</button>
      <button onClick={() => (handleCountryChange("Germany"))}>Germany</button>
      <button onClick={() => (handleCountryChange("Netherlands"))}>Netherlands</button>
      <button onClick={() => (handleCountryChange("Sweden"))}>Sweden</button>
      <Map country={currentCountry} key={`map-${currentCountry}`} />
    </div>
  );
}

export default App;
