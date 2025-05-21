import React, { useState } from "react";
import './App.css';
import Map from "./components/Map";
import Dropdown from "./components/Dropdown";

function App() {
  const [currentCountry, setCurrentCountry] = useState("poland");

  const handleCountryChange = (country) => {
    console.log("Country changed to:", country);
    setCurrentCountry(country);
  };

  const availableCountries = [
    {'value': "france", 'label': "France"},
    {'value': "germany", 'label': "Germany"},
    {'value': "italy", 'label': "Italy"},
    {'value': "netherlands", 'label': "The Netherlands"},
    {'value': "poland", "label": "Poland"},
    {'value': "sweden", 'label': "Sweden"},
    {'value': "turkey", 'label': "Turkey"}
  ]

  return (
    <div className="App">
      <p style={{display: "inline"}}>Country:</p>
      <Dropdown options={availableCountries} onSelect={handleCountryChange} />
      <Map country={currentCountry} key={`map-${currentCountry}`} />
    </div>
  );
}

export default App;
