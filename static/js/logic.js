// Script to load previous day earthquake data and create leaflet map to visualize information by location and magnitude of earthquake

// Creating map object
let myMap = L.map("map",{
    center: [38.9, -97.8],
    zoom: 3
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(myMap);

// GET request to the query URL and load geojson data
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// Load in data with d3
d3.json(queryUrl, function(earthquakeData) {

    // Create circle markers features
    function circleMarker(feature, latlng) {
        let options = {
            radius: feature.properties.mag * 5,
            fillColor: chooseColor(feature.properties.mag),
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.6
        };
        
        return L.circleMarker(latlng, options); 
    }

    // Create geoJSON layer
    let earthquakes = L.geoJSON(earthquakeData, {

        // Create marker points
        pointToLayer: circleMarker,

        onEachFeature: function(feature, layer) {
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p>`);
        }
    }).addTo(myMap);


    // Set up legend
    let legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        grades = [0,1,2,3,4,5]
        labels = [];

        let legendTitle = "<h3>Magnitude</h3>";
        
        div.innerHTML = legendTitle;

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;  
    }

    // Adding legend to map
    legend.addTo(myMap);
});

function chooseColor(mag) {
    return mag > 5 ? "#bd0026" :
           mag > 4 ? "#f03b20" :
           mag > 3 ? "#fd8d3c" :
           mag > 2 ? "#feb24c" :
           mag > 1 ? "#fed976" :
                     "#ffffb2";
}