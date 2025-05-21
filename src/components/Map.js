import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import List from "./List";
import "./Map.css";

function cleanStringGenerator(country) {
    if (country === "Germany") {
        return function (str) {
            return str
                .toLowerCase()
                .replace(/\(/g, "")
                .replace(/\)/g, "")
                .replace(/ü/g, "u")
                .replace(/ö/g, "o")
                .replace(/ß/g, "ss")
                .replace(/ä/g, "a")
                .replace(/-/g, " ")
                .replace(/v\. d\./g, "vor der")
                .replace(/v\.d\./g, "vor der")
                .replace(/b\./g, "bei")
                .replace(/b\. d\./g, "bei der")
                .replace(/a\. d\./g, "an der")
                .replace(/i\.d\./g, "in der")
                .replace(/i\. d\./g, "in der")
                .replace(/i\.Bay\./g, "in Bayern")
                .replace(/\s*/g, "");
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
    } else if (country==='Sweden'){
        return function (str) {
            return str
                .toLowerCase()
                .replace(/å/g, "a")
                .replace(/ä/g, "a")
                .replace(/ö/g, "o")
                .replace(/\s*/g, "");
        }
    } else if (country==="Netherlands") {
        return function (str) {
            return str
                .toLowerCase()
                .replace(/'/g, "")
                .replace(/-/g, " ")
                .replace(/ú/g, "u")
                .replace(/â/g, "a")
                .replace(/\s*/g, "");
        }
    } else if (country==="Italy") {
        return function (str) {
            return str
                .toLowerCase()
                .replace(/\(/g, "")
                .replace(/\)/g, "")
                .replace(/ü/g, "u")
                .replace(/ö/g, "o")
                .replace(/ß/g, "ss")
                .replace(/ä/g, "a")
                .replace(/é/g, "e")
                .replace(/ê/g, "e")
                .replace(/á/g, "a")
                .replace(/ó/g, "o")
                .replace(/à/g, "a")
                .replace(/è/g, "e")
                .replace(/ì/g, "i")
                .replace(/ò/g, "o")
                .replace(/ù/g, "u")
                .replace(/î/g, "i")
                .replace(/\s*/g, "");
        }
    } else if (country==="Turkey") {
        return function (str) {
            return str
                .toLowerCase()
                .replace(/ü/g, "u")
                .replace(/ö/g, "o")
                .replace(/ş/g, "s")
                .replace(/ğ/g, "g")
                .replace(/ı/g, "i")
                .replace(/ç/g, "c")
                .replace(/i̇/g, "i")
                .replace(/\s*/g, "");
        }
    } else if (country==="Poland") {
        return function (str) {
            return str
                .toLowerCase()
                .replace(/ł/g, "l")
                .replace(/ó/g, "o")
                .replace(/ę/g, "e")
                .replace(/ą/g, "a")
                .replace(/ś/g, "s")
                .replace(/ć/g, "c")
                .replace(/ź/g, "z")
                .replace(/ż/g, "z")
                .replace(/ń/g, "n")
                .replace(/-/g,' ')
                .replace(/\s*/g, "");
        }
    }
}

const fmt = d3.format(",d");

const buildIndex = (data, keyGen) => {
    const indexedData = {};
    const altNames = {};
    data.forEach((d) => {
        const key = keyGen(d.City);
        if (!indexedData[key]) {
            indexedData[key] = [d];
        } else {
            indexedData[key].push(d);
        }
        if (indexedData[key][0].altNames.length > 0){
            indexedData[key][0].altNames.forEach((name) => {
                altNames[keyGen(name)] = d;
            })
        }
    });
    console.log(altNames)
    for (const key in altNames) {
        if (key in indexedData) {
            indexedData[key].push(altNames[key]);
        } else {
            indexedData[key] = [altNames[key]];
        }
    }
    return indexedData;
}

const parseCitiesData = (d) => {
    console.log(d.Population.replace(',',''));
    let altNames;
    if (d.AlternateNames.includes(",")) {
        altNames = d.AlternateNames.split(",").map((name) => name.trim());
    } else if (d.AlternateNames.length > 0) {
        altNames = [d.AlternateNames.trim()];
    }
    else {
        altNames = [];
    }

    const obj = {
        City: d.City,
        Population: +d.Population.replace(',',''),
        Longitude: +d.Longitude,
        Latitude: +d.Latitude,
        "city-state": d["city-state"],
        index: d.index,
        altNames: altNames,
        isStateCapital: d.isStateCapital
    };
    return obj;
}

const adminName = (country) => {
    if (country==='France'){
        return 'regional';
    } else if (country==='Germany'){
        return 'state';
    } else if (country==='Netherlands'){
        return 'provincial';
    } else if (country==='Sweden'){
        return 'county';
    } else if (country==="Italy") {
        return 'regional';
    } else if (country==="Turkey") {
        return 'provincial';
    } else if (country==="Poland") {
        return 'voivodeship';
    }
}

const loadCitiesData = (country) => {
    const cleanString = cleanStringGenerator(country);
    if (country === "Germany") {
        return d3.dsv(";", "cities-DE.csv", parseCitiesData).then((data)=>{return buildIndex(data, cleanString)});
    } else if (country === "France") {
        const data = d3.dsv(";", "cities-FR.csv", parseCitiesData).then((data)=>{return buildIndex(data, cleanString)});
        return data;
    } else if (country === "Netherlands") {
        return d3.dsv(";", "cities-NL.csv", parseCitiesData).then((data)=>{return buildIndex(data, cleanString)});
    } else if (country === "Sweden") {
        return d3.dsv(";", "cities-SE.csv", parseCitiesData).then((data)=>{return buildIndex(data, cleanString)});
    } else if (country === "Italy") {
        return d3.dsv(";", "cities-IT.csv", parseCitiesData).then((data)=>{return buildIndex(data, cleanString)});
    } else if (country==="Turkey") {
        return d3.dsv(";", "cities-TR.csv", parseCitiesData).then((data)=>{return buildIndex(data, cleanString)});
    } else if (country==="Poland") {
        return d3.dsv(";", "cities-PL.csv", parseCitiesData).then((data)=>{return buildIndex(data, cleanString)});
    }
    throw new Error(`Unsupported country: ${country}`);
};

const findTotalOver = (data, n) => {
    let total = 0;
    // because each alternate name is a separate entry, we need to check for duplicates
    const seen = new Set();
     for (const key in data){
        const dl = data[key];
        dl.forEach((d) => {
            if (+d.Population > n && !seen.has(d.index)) {
                total += 1;
                seen.add(d.index);
            }
        });
    };
    console.log(`Total over ${n}: `, total);
    return total;
}

function countCapitals(data) {
    let total = 0;
    const seen = new Set();
     for (const key in data) {
        const dl = data[key];
        dl.forEach((d) => {
            if (d.isStateCapital==='True' && !seen.has(d.index)) {
                total += 1;
                seen.add(d.index);
            }
        });
    };
    console.log(`Total capitals: `, total);
    return total;
}

const Map = ({ country }) => {
    const cleanString = cleanStringGenerator(country);
    let ctr, sc;

    // citiesData is a dictionary with the cleaned city name as key and an array of cities with that cleaned name as the value
    // each city is an object with the following structure:
    // {
    //      City: "'s-Gravenhage",
    //      Population: 500000,
    //      Longitude: 4.3,
    //      Latitude: 52.1,
    //      "city-state": "Den Haag",
    //      index: 280,
    //      altNames: ["Den Haag", "The Hague"]
    // }
    // most of the time, altNames will be equal to [], but some cities are not known by their official, native-language name
    // for example, The Hague is officially 's-Gravenhage, and Munich is officially München
    // for each entry in altNames, we will add a new entry with the same object as the value, but with the cleaned alternate name as key
    // because indices are unique to each individual city, this will not cause the city to be counted twice if the offical name is input

    const [citiesData, setCitiesData] = useState();

    if (country === "Germany") {
        ctr = [10.5, 51.3];
        sc = 3000;
    } else if (country === "France") {
        ctr = [2.5, 46.5];
        sc = 2500;
    } else if (country === "Netherlands") {
        ctr = [5.3, 52.1];
        sc = 7000;
    } else if (country === "Sweden") {
        ctr = [18.64, 62.8];
        sc = 1200;
    } else if (country === "Italy") {
        ctr = [12.57, 41.87];
        sc = 2500;
    } else if (country==="Turkey") {
        ctr = [35.0, 39.0];
        sc = 2000;
    } else if (country==="Poland") {
        ctr = [19.0, 52.0];
        sc = 3000;
    }

    const mapRef = useRef();
    const width = 800;
    const height = 700;
    const projection = d3
            .geoMercator()
            .translate([width / 2, height / 2])
            .center(ctr)
            .scale(sc);
    const [namedCities, _] = useState(new Set());
    const [nNamed, setNNamed] = useState(0);
    const [cities, setCities] = useState([]);
    const [totalPop, setTotalPop] = useState(0);
    const [nOver100k, setNOver100k] = useState(0);
    const [nOver500k, setNOver500k] = useState(0);
    const [nOver1m, setNOver1m] = useState(0);
    const [nCapitals, setNCapitals] = useState(0);
    const [totalOver100k, setTotalOver100k] = useState(0);
    const [totalOver500k, setTotalOver500k] = useState(0);
    const [totalOver1m, setTotalOver1m] = useState(0);
    const [totalCapitals, setTotalCapitals] = useState(0);

    function handleChange(e) {
        const val = e.target.value;
        console.log(cleanString("İstanbul"));
        if (cleanString(val) in citiesData) {
            const citiesNamed = citiesData[cleanString(val)];
            citiesNamed.forEach((d) => {
                if (!namedCities.has(d.index)) {
                    e.target.value = "";
                    handleCityNamed(d);
                    namedCities.add(d.index);
                    setTotalPop((prevTotal) => prevTotal + +d.Population);
                    setNNamed(namedCities.size);
                    if(+d.Population > 100000) {
                        setNOver100k((prevN) => prevN + 1);
                    }
                    if(+d.Population > 500000) {
                        setNOver500k((prevN) => prevN + 1);
                    }
                    if(+d.Population > 1000000) {
                        setNOver1m((prevN) => prevN + 1);
                    }
                    if (d.isStateCapital==='True') {
                        setNCapitals((prevN) => prevN + 1);
                    }
                    setCities((prevCities) => {
                        return [{
                            city: d.City,
                            pop: +d.Population,
                            lon: +d.Longitude,
                            lat: +d.Latitude,
                            citystate: d["city-state"],
                            id: d.index
                        }, ...prevCities];
                    });
                }
            });
        }
    }

    const handleCityNamed = (d) => {
        const svg = d3
            .select(mapRef.current)
            .select("svg");
        const circleScale = d3.scaleSqrt()
            .domain([1, 2e7])
            .range([1, 50]);
        
        const tooltip = d3
            .select(mapRef.current)
            .select("#tooltip");

        var coords = projection([+d.Longitude, +d.Latitude]);
        svg.append("circle")
            .attr("cx", coords[0])
            .attr("cy", coords[1])
            .attr("r", circleScale(+d.Population))
            .attr("fill", "blue")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("opacity", 0.5)
            .on("mouseover", function (event, o) {
                tooltip
                    .style("opacity", 1)
                    .html(`${d["city-state"]}${d.isStateCapital==='True'?" 🔴":""}<br>Population: `+fmt(+d.Population));
                })
                .on("mouseout", () => {
                tooltip.style("opacity", 0);
            });            
    }

    useEffect(() => {
        loadCitiesData(country).then((data) => {
            setCitiesData(data);
            setTotalOver100k(findTotalOver(data, 100000));
            setTotalOver500k(findTotalOver(data, 500000));
            setTotalOver1m(findTotalOver(data, 1000000));
            setTotalCapitals(countCapitals(data));
            console.log("Cities data loaded for country:", country);
        }
        ).catch((error) => {
            console.error("Error loading the cities data:", error);
        });
        
        let mapData;
        if (country === "Germany") {
            mapData = "germany.geojson";
        } else if (country === "France") {
            mapData = "france.geojson";
        } else if (country === "Netherlands") {
            mapData = "netherlands.geojson";
        } else if (country === "Sweden") {
            mapData = "sweden.geojson";
        } else if (country === "Italy") {
            mapData = "italy.geojson";
        } else if (country === "Turkey") {
            mapData = "turkey.geojson";
        } else if (country === "Poland") {
            mapData = "poland.geojson";
        } else {
            console.error("Unsupported country:", country);
            return;
        }
        console.log("Map data loaded for country:", country);

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
    }, [country]);

    return <div className="App">
          <h1>How many cities can you name?</h1>
          <input type="text" className="main-input" onChange={handleChange}/>
          {/* <input type="text" value={inputValue} onChange={(e)=>{setInputValue(e.target.value);}}/> */}
          {/* <input type="button" value="Submit" onClick={handleChange} /> */}
          <div ref={mapRef}></div>
          <div style={{ width:`${width*1.1}px`, margin:"auto" }}>
            <p>You have named {nNamed} cit{nNamed===1?"y":"ies"} with a total population of {fmt(totalPop)}.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', textAlign: 'left', fontSize: '20px' }}>
                <div>
                You have named: 
                    <ul>
                        <li>{nOver100k} out of {totalOver100k} over 100,000</li>
                       {totalOver500k>0 && <li>{nOver500k} out of {totalOver500k} over 500,000</li>}
                       {totalOver1m>0 && <li>{nOver1m} out of {totalOver1m} over 1 million</li>}
                       {totalCapitals>0 && <li>{nCapitals} out of {totalCapitals} {adminName(country)} capitals</li>}
                    </ul>
                </div>
                <div className="cities-list-container"><List items={cities} /></div>
            </div>
          </div>
        </div>
};

export default Map;