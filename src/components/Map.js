import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
let mapData = require("../germany.geojson");
let citiesData = require("../cities.csv");

function cleanString(str) {
    return str
        .replace(/ü/g, "u")
        .replace(/ö/g, "o")
        .toLowerCase();
}

const fmt = d3.format(",d");

const Map = () => {
    const mapRef = useRef();
    const width = 800;
    const height = 700;
    const projection = d3
            .geoMercator()
            .translate([width / 2, 0.5 * height])
            .center([10.5, 51.3]) // Centering on Germany
            .scale(3000);
    const [namedCities, setNamedCities] = useState(new Set());
    const [nNamed, setNNamed] = useState(0);

    function handleChange(e) {
        const val = e.target.value;
        d3.dsv(";",citiesData, function (d) {
            if(cleanString(val) === cleanString(d.City) && !namedCities.has(+d.index)) {
                e.target.value = "";
                handleCityNamed(d["city-state"], d.Population, +d.Longitude, +d.Latitude);
                namedCities.add(+d.index);
                setNNamed(nNamed + 1);
            }
            setNNamed(namedCities.size);
            return {
                city: d.City,
                pop: +d.Population,
                lon: +d.Longitue,
                lat: +d.Latitude
            };
        });
    }

    const handleCityNamed = (citystate, pop, lon, lat) => {
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
          <input type="text" onChange={handleChange} />
          <div ref={mapRef}></div>
          <p>You have named {nNamed} municipalities.</p>
        </div>
};

export default Map;