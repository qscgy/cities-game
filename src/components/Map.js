import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import List from "./List";
import "./Map.css";

function cleanStringGenerator(country) {
    if (country === "Germany") {
        return function (str) {
            return str
                .toLowerCase()
                .replace(/ü/g, "u")
                .replace(/ö/g, "o")
                .replace(/ß/g, "ss")
                .replace(/v. d./g, "vor der")
                .replace(/v.d./g, "vor der")
                .replace(/\s*/g, "")
                .replace(/ä/g, "a");
        };
    } else if (country === "France") {
        return function (str) {
            return str
                .toLowerCase()
                .replace(/é/g, "e")
                .replace(/è/g, "e")
                .replace(/ê/g, "e")
                .replace(/á/g, "a")
                .replace(/à/g, "a")
                .replace(/â/g, "a")
                .replace(/î/g, "i")
                .replace(/ô/g, "o")
                .replace(/û/g, "u")
                .replace(/ç/g, "c")
                .replace(/ë/g, "e")
                .replace(/ï/g, "i")
                .replace(/œ/g, "oe")
                .replace(/æ/g, "ae")
                .replace(/\s+/g, " ")
                .replace(/'/g, "")
                .replace(/saint-/g, "st-")
                .replace(/sainte-/g, "st-")
                .replace(/-/g, " ")
                .replace(/\s*/g, "");
        };
    }
}

const fmt = d3.format(",d");

const Map = ({ country }) => {

    const cleanString = cleanStringGenerator(country);
    let mapData, citiesData, ctr, sc;
    if (country === "Germany") {
        mapData = require("../germany.geojson");
        citiesData = require("../cities.csv");
        ctr = [10.5, 51.3];
        sc = 3000;
    } else if (country === "France") {
        mapData = require("../fr.geojson");
        citiesData = require("../cities-FR.csv");
        ctr = [2.5, 46.5];
        sc = 2500;
    }

    const mapRef = useRef();
    const width = 800;
    const height = 700;
    const projection = d3
            .geoMercator()
            .translate([width / 2, 0.5 * height])
            .center(ctr)
            .scale(sc);
    const [namedCities, _] = useState(new Set());
    const [nNamed, setNNamed] = useState(0);
    const [cities, setCities] = useState([]);
    const [totalPop, setTotalPop] = useState(0);
    const [inputValue, setInputValue] = useState('');

    function handleChange(e) {
        const val = e.target.value;
        d3.dsv(";", citiesData).then(function (data) {
            data.forEach((d) => {
                if(cleanString(val) === cleanString(d.City) && !namedCities.has(+d.index)) {
                    e.target.value = "";
                    handleCityNamed(d["city-state"], d.Population, +d.Longitude, +d.Latitude);
                    namedCities.add(+d.index);
                    setTotalPop((prevTotal) => prevTotal + +d.Population);
                    setNNamed(namedCities.size);
                    setCities((prevCities) => {
                        return [{
                            city: d.City,
                            pop: +d.Population,
                            lon: +d.Longitude,
                            lat: +d.Latitude,
                            citystate: d["city-state"],
                            id: +d.index
                        }, ...prevCities];
                    }
                    );
                }
            });
        });
        // setTotalPop(cities.reduce((acc, city) => acc + city.pop, 0));
    }

    const handleCityNamed = (citystate, pop, lon, lat) => {
        console.log("City named:", citystate, pop, lon, lat);
        const svg = d3
            .select(mapRef.current)
            .select("svg");
        const circleScale = d3.scaleSqrt()
            .domain([1, 5e6])
            .range([1, 40]);
        
        const tooltip = d3
            .select(mapRef.current)
            .select("#tooltip");

        var coords = projection([lon, lat]);
        svg
            .append("circle")
            .attr("cx", coords[0])
            .attr("cy", coords[1])
            .attr("r", circleScale(pop))
            .attr("fill", "blue")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("opacity", 0.5)
            .on("mouseover", function (event, d) {
                tooltip
                    .style("opacity", 1)
                    .html(`${citystate}<br>Population: `+fmt(pop));
                })
                .on("mouseout", () => {
                tooltip.style("opacity", 0);
            });            
    }

    useEffect(() => {
        const svg = d3
            .select(mapRef.current)
            .append("svg")
            .attr("id", "map")
            .attr("width", width)
            .attr("height", height);

        const tooltip = d3
            .select(mapRef.current)
            .append("div")
            .attr("id", "tooltip")
            .style("position", "absolute")
            .style("background", "white")
            .style("border", "1px solid black")
            .style("padding", "5px")
            .style("border-radius", "5px")
            .style("pointer-events", "none")
            .style("text-align", "left")
            .style("opacity", 0);

        svg.on("mousemove", (event) => {
            const [x, y] = d3.pointer(event, svg);
            tooltip
            .style("left", `${x + 10}px`)
            .style("top", `${y + 10}px`);
        });

        svg.on("mouseleave", () => {
            tooltip.style("opacity", 0);
        });

        const pathGenerator = d3.geoPath().projection(projection);
        d3.json(mapData).then((geojson) => {
            svg
                .append("g")
                .selectAll("path")
                .data(geojson.features)
                .enter()
                .append("path")
                .attr("d", pathGenerator)
                .attr("fill", "#ffffff")
                .attr("stroke", "#000");
        }).catch((error) => {
            console.error("Error loading the GeoJSON file:", error);
        });
    }, []);

    return <div className="App">
          <h1>City Test</h1>
          <input type="text" className="main-input" onChange={handleChange}/>
          {/* <input type="text" value={inputValue} onChange={(e)=>{setInputValue(e.target.value);}}/> */}
          {/* <input type="button" value="Submit" onClick={handleChange} /> */}
          <div ref={mapRef}></div>
          <p>You have named {nNamed} municipalities with a total population of {fmt(totalPop)}.</p>
          <div className="cities-list-container">
            <List items={cities} />
          </div>
        </div>
};

export default Map;