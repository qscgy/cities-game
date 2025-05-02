import React from 'react';
import "./List.css";
import * as d3 from "d3";
const fmt = d3.format(",d");

const List = ({ items }) => {
    return (
        <ul className='cities-list'>
            {items.map((item) => (
                <li key={item.id}>{item.citystate} ({fmt(item.pop)})</li>
            ))}
        </ul>
    );
};

export default List;