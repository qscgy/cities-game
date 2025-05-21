import React from 'react';
import "./List.css";
import * as d3 from "d3";
import countryCodes from "./code_list";

const fmt = d3.format(",d");

function getFlagEmoji(country) {
  const countryCode = countryCodes[country];
  return [...countryCode.toUpperCase()]
    .map(char => String.fromCodePoint(127397 + char.charCodeAt()))
    .join('');
}

const List = ({ items, country }) => {
    return (
        <ul className='cities-list' style={{listStyleType: `"${getFlagEmoji(country)}"`}}>
            {items.map((item) => (
                <li key={item.id} >{item.citystate} ({fmt(item.pop)})</li>
            ))}
        </ul>
    );
};

export default List;