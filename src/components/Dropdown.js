import React, { useEffect, useRef, useState } from "react";
import './Dropdown.css'

function Dropdown({ options, onSelect }) {
  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
    onSelect(value); // Call the onSelect function with the selected value
  };

  return (
    <select value={selectedValue} onChange={handleChange}>
      <optgroup style={{fontSize: "40"}}>
        <option value="" disabled>Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </optgroup>
    </select>
  );
}

export default Dropdown;