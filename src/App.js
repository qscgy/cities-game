import React, { useState } from "react";
import './App.css';
import Map from "./components/Map";
import Dropdown from "./components/Dropdown";

function App() {
  const [currentCountry, setCurrentCountry] = useState("Turkey");

  const handleCountryChange = (country) => {
    console.log("Country changed to:", country);
    setCurrentCountry(country);
  };

  const availableCountries = [
    {'value': "France", 'label': "France"},
    {'value': "Germany", 'label': "Germany"},
    {'value': "Italy", 'label': "Italy"},
    {'value': "Netherlands", 'label': "The Netherlands"},
    {'value': "Sweden", 'label': "Sweden"},
    {'value': "Turkey", 'label': "Turkey"},
    {'value': "Poland", "label": "Poland"}
  ]

  return (
    <div className="App">
      {/* <span style={{'fontSize': '20px'}}>Select country:</span>
      <button onClick={() => (handleCountryChange("France"))}>France</button>
      <button onClick={() => (handleCountryChange("Germany"))}>Germany</button>
      <button onClick={() => (handleCountryChange("Italy"))}>Italy</button>
      <button onClick={() => (handleCountryChange("Netherlands"))}>Netherlands</button>
      <button onClick={() => (handleCountryChange("Sweden"))}>Sweden</button>
      <br/> */}
      <Dropdown options={availableCountries} onSelect={handleCountryChange} />
      <Map country={currentCountry} key={`map-${currentCountry}`} />
    </div>
  );
}

export default App;
