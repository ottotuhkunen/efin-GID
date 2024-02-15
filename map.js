var map;

// Function to fetch KML, convert it to GeoJSON, and add it to the map
function addKMLToMap(map) {
    fetch('https://flyk.com/api/finland.kml')
        .then(response => response.text())
        .then(kmlText => {
            var parser = new DOMParser();
            var kml = parser.parseFromString(kmlText, 'text/xml');
            var convertedGeoJSON = toGeoJSON.kml(kml);

            // Define an array of style IDs to exclude
            const excludeStyleIds = ['RAS', 'airfield', 'aerodrome', 'heliport', 'Other'];

            // Filter GeoJSON features based on their styleUrl
            var filteredGeoJSON = {
                ...convertedGeoJSON,
                features: convertedGeoJSON.features.filter(feature => {
                    // Extract style ID from feature's properties, assuming it's stored as 'styleUrl'
                    var styleId = feature.properties.styleUrl ? feature.properties.styleUrl.replace('#', '') : null;
                    // Include the feature if its style ID is not in the exclude list
                    return !excludeStyleIds.includes(styleId);
                })
            };

            // Add the filtered GeoJSON to the map with dynamic styling
            L.geoJson(filteredGeoJSON, {
                style: function(feature) {
                    var styleId = feature.properties.styleUrl ? feature.properties.styleUrl.replace('#', '') : null;
                    if (styleId && kmlStyles[styleId]) {
                        return {
                            color: kmlStyles[styleId].color,
                            fillColor: kmlStyles[styleId].fillColor,
                            weight: kmlStyles[styleId].weight,
                            fillOpacity: kmlStyles[styleId].fillOpacity
                        };
                    }
                    // Default style if no matching styleId found
                    return { color: "white", weight: 0, opacity: 0, fillOpacity: 0 };
                }
            }).addTo(map);
        })
        .catch(error => console.error('Error fetching or converting KML:', error));

        var airports = [
            { name: "Enontekiö", icao: "EFET", coords: [68.3625, 23.4244] },
            { name: "Halli", icao: "EFHA", coords: [61.8560, 24.7867] },
            { name: "Helsinki-Vantaa", icao: "EFHK", coords: [60.317222, 24.963333] },
            { name: "Ivalo", icao: "EFIV", coords: [68.6073, 27.4053] },
            { name: "Joensuu", icao: "EFJO", coords: [62.6629, 29.6075] },
            { name: "Jyväskylä", icao: "EFJY", coords: [62.3995, 25.6783] },
            { name: "Kajaani", icao: "EFKI", coords: [64.2855, 27.6924] },
            { name: "Kemi-Tornio", icao: "EFKE", coords: [65.7819, 24.5991] },
            { name: "Kittilä", icao: "EFKT", coords: [67.7008, 24.8468] },
            { name: "Kokkola-Pietarsaari", icao: "EFKK", coords: [63.7212, 23.1431] },
            { name: "Kuopio", icao: "EFKU", coords: [63.0071, 27.7978] },
            { name: "Kuusamo", icao: "EFKS", coords: [65.9876, 29.2394] },
            { name: "Lappeenranta", icao: "EFLP", coords: [61.0446, 28.1447] },
            { name: "Mariehamn", icao: "EFMA", coords: [60.1222, 19.8982] },
            { name: "Mikkeli", icao: "EFMI", coords: [61.6866, 27.2018] },
            { name: "Oulu", icao: "EFOU", coords: [64.9301, 25.3546] },
            { name: "Pori", icao: "EFPO", coords: [61.4617, 21.7999] },
            { name: "Rovaniemi", icao: "EFRO", coords: [66.5648, 25.8304] },
            { name: "Savonlinna", icao: "EFSA", coords: [61.9431, 28.9450] },
            { name: "Seinäjoki", icao: "EFSI", coords: [62.6921, 22.8323] },
            { name: "Tampere-Pirkkala", icao: "EFTP", coords: [61.4141, 23.6044] },
            { name: "Turku", icao: "EFTU", coords: [60.5141, 22.2628] },
            { name: "Utti", icao: "EFUT", coords: [60.8964, 26.9384] },
            { name: "Vaasa", icao: "EFVA", coords: [63.0507, 21.7622] }
        ];
        
        
        airports.forEach(function(airport) {
            var circle = L.circleMarker(airport.coords, {
                radius: 3,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(map);
        
            circle.bindTooltip(airport.icao, {
                permanent: false,
                className: 'custom-tooltip',
                direction: 'bottom',
                offset: L.point(10, -10)
            });
        });
}

document.addEventListener('DOMContentLoaded', (event) => {
    // Initialize the map
    map = L.map('map', {
        zoomControl: false // This disables the zoom control buttons
    }).setView([63, 25], 6);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                     '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                     'Imagery © <a href="https://carto.com/attributions">CartoDB</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    // Call the function to add the KML to the map
    addKMLToMap(map);

    // Finland's approximate bounding box coordinates
    const finlandBounds = {
        north: 70.09,
        south: 59.81,
        west: 20.58,
        east: 31.59
    };

    // Fetch VATSIM data
    fetch('https://data.vatsim.net/v3/vatsim-data.json')
    .then(response => response.json())
    .then(data => {
        data.pilots.forEach(pilot => {
            const isInFinland = pilot.latitude <= finlandBounds.north && pilot.latitude >= finlandBounds.south &&
                    pilot.longitude >= finlandBounds.west && pilot.longitude <= finlandBounds.east;
        
            // show all aircraft arriving in Finland no matter where they are
            const isArrivingInFinland = pilot.flight_plan && pilot.flight_plan.arrival.startsWith("EF");

            if (isInFinland || isArrivingInFinland) {

                var afl = pilot.altitude;
                var spd = pilot.groundspeed;

                if (afl <= 5000 && afl > 300) afl = 'A' + Math.floor(afl / 100).toString().padStart(2, '0');
                else if (afl < 300) afl = '';
                else if (afl > 5000) afl = 'F' + Math.floor(afl / 100).toString().padStart(2, '0');

                if (spd < 30) spd = '';

                var htmlContent = `
                    <div class="custom-marker">
                    <div class="heading-line" style="transform: rotate(${pilot.heading - 90}deg);"></div>
                    <div class="marker-square"></div>
                    <div class="marker-text">
                        <span class="always-visible">${pilot.callsign}</span>
                        <span class="on-hover-content">
                            ${pilot.flight_plan ? pilot.flight_plan.aircraft_short : ''}<br>
                            ${afl} ${spd} ${pilot.flight_plan.arrival}
                        </span>
                    </div>
                    </div>
                `;

                var marker = L.divIcon({
                    className: 'custom-div-icon',
                    html: htmlContent,
                    iconSize: [60, 30], // Adjust based on your content
                    iconAnchor: [2, 2], // Adjust to properly position the icon
                });

                L.marker([pilot.latitude, pilot.longitude], { icon: marker }).addTo(map);
            }
        });
    })
    .catch(error => console.error('Error fetching VATSIM data:', error));
});

const kmlStyles = {
    "G": { color: "rgba(69, 130, 181, 0.6)", fillOpacity: 0, weight: 1 },
    "C": { color: "rgba(56, 52, 148, 0.6)", fillOpacity: 0, weight: 1 },
    "D": { color: "rgba(104, 45, 134, 0.6)", fillOpacity: 0, weight: 1 },
    "Danger": { color: "darkorange", fillColor: "darkorange", fillOpacity: "40%", weight: 1 },
    "TEMPO_D": { color: "darkorange", fillColor: "darkorange", fillOpacity: "40%",weight: 1 },
    "Restricted": { color: "rgba(239, 8, 16, 0.6)", fillColor: "rgba(239, 8, 16, 0.4)", fillOpacity: "50%", weight: 1 },
    "TEMPO_R": { color: "rgba(239, 8, 16, 0.6)", fillColor: "rgba(239, 8, 16, 0.4)", fillOpacity: "50%", weight: 1 },
    "Prohibited": { color: "rgba(255, 0, 0, 0.6)", fillColor: "rgba(255, 0, 0, 0.4)", fillOpacity: "50%", weight: 1 },
    "TEMPO_P": { color: "rgba(255, 0, 0, 0.6)", fillColor: "rgba(255, 0, 0, 0.4)", fillOpacity: "50%", weight: 1 },
    "TSA": { color: "rgba(0, 85, 255, 0.6)", fillColor: "rgba(0, 85, 255, 0.4)", fillOpacity: "50%", weight: 1 },
    "TRA": { color: "rgba(0, 85, 255, 0.6)", fillColor: "rgba(0, 85, 255, 0.4)", fillOpacity: "50%", weight: 1 },
    "TEMPO_TSA": { color: "rgba(0, 85, 255, 0.6)", fillColor: "rgba(0, 85, 255, 0.4)", fillOpacity: "50%", weight: 1 },
    "TEMPO_TRA": { color: "rgba(0, 85, 255, 0.6)", fillColor: "rgba(0, 85, 255, 0.4)", fillOpacity: "50%", weight: 1 },
    "TEMPO_FBZ": { color: "rgba(128, 128, 128, 0.6)", fillColor: "rgba(128, 128, 128, 0.4)", weight: 1 },
    "Other": { color: "rgba(159, 128, 96, 0.6)", fillColor: "rgba(159, 128, 96, 0.4)", weight: 1 },
    "acc": { color: "rgba(159, 128, 96, 0.6)", fillColor: "rgba(159, 128, 96, 0.4)", weight: 1 },
    "FBZ": {
        color: "gray",
        fillOpacity: 0,
        weight: 0.5,
    }
};


/*
var southWestLat = 59.0;
var southWestLng = 20.0;
var northEastLat = 70.0;
var northEastLng = 31.0;

// Specify the geographical bounds of the SVG overlay
var bounds = L.latLngBounds([[southWestLat, southWestLng], [northEastLat, northEastLng]]);

// Create the SVG overlay but don't add it to the map yet
var svgOverlay = L.imageOverlay('src/eftp.svg', bounds);

// Listen for zoom events on the map to control the visibility of the SVG overlay
map.on('zoomend', function() {
    var currentZoom = map.getZoom();
    
    // Adjust '10' to the minimum zoom level you want the SVG to be visible at
    if (currentZoom >= 10) {
        if (!map.hasLayer(svgOverlay)) {
            svgOverlay.addTo(map);
        }
    } else {
        if (map.hasLayer(svgOverlay)) {
            map.removeLayer(svgOverlay);
        }
    }
});
*/

// fixes

document.addEventListener('DOMContentLoaded', function() {

    var vfrPoints = [
        // EFHK
        { name: "HAGIP", dmsCoords: ["601231N", "0245400E"], direction: "bottom-left" },
        { name: "LILJA", dmsCoords: ["601926N", "0251231E"], direction: "top-right" },
        { name: "LINTU", dmsCoords: ["602247N", "0244104E"], direction: "top-left" },
        { name: "OGELI", dmsCoords: ["601351N", "0245916E"], direction: "bottom-right" },
        { name: "OLBIB", dmsCoords: ["602704N", "0250107E"], direction: "top-right" },
        // EFTU
        { name: "EVEKE", dmsCoords: ["602356N", "0223023E"], direction: "bottom-right" },
        { name: "JUTKI", dmsCoords: ["602254N", "0220707E"], direction: "bottom-right" },
        { name: "NOUSU", dmsCoords: ["603745N", "0220317E"], direction: "top-right" },
        { name: "OJANE", dmsCoords: ["603905N", "0223309E"], direction: "top-right" },
        // EFMA
        { name: "BROON", dmsCoords: ["601307N", "0194236E"], direction: "top-left" },
        { name: "PRAST", dmsCoords: ["601235N", "0201450E"], direction: "bottom-right" },
        { name: "WINHA", dmsCoords: ["600420N", "0200737E"], direction: "bottom-right" },
        // EFPO
        { name: "MALOP", dmsCoords: ["611458N", "0215806E"], direction: "bottom-left" },
        { name: "MORHI", dmsCoords: ["612836N", "0221158E"], direction: "top-right" },
        { name: "OMULE", dmsCoords: ["613719N", "0214643E"], direction: "top-right" },
        { name: "RAUTU", dmsCoords: ["612134N", "0213859E"], direction: "bottom-left" },
        // EFTP
        { name: "LIMPU", dmsCoords: ["611303N", "0232104E"], direction: "bottom-right" },
        { name: "PUPPA", dmsCoords: ["613509N", "0234511E"], direction: "top-left" },
        { name: "PURSO", dmsCoords: ["612917N", "0231934E"], direction: "top-left" },
        { name: "ROINE", dmsCoords: ["612225N", "0240200E"], direction: "bottom-right" },
        { name: "VIILA", dmsCoords: ["611805N", "0234303E"], direction: "bottom-right" },
    ];    
    

    // Triangle SVG icon as a Data URL
    var triangleIconUrl = 'data:image/svg+xml;base64,' + btoa(`
        <svg width="10" height="10" viewbox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
            <path d="M 5 0 L 10 10 L 0 10 Z" fill="black" />
        </svg>
    `);

    // Function to create a triangle marker
    function createTriangleMarker(point) {
        // Convert DMS coordinates to decimal
        var coords = convertToLatLng(point.dmsCoords[0], point.dmsCoords[1]);

        var marker = L.marker(coords, {
            icon: L.icon({
                iconUrl: triangleIconUrl,
                iconSize: [8, 8], // Size of the icon
                iconAnchor: [4, 4] // Center of the triangle
            })
        });
    
        // Define the offset based on the direction
        var offsets = {
            "top-right": [24, 10],
            "top-left": [-24, 10],
            "bottom-left": [-24, -8],
            "bottom-right": [24, -8],
            // Add other directions as needed
        };
    
        // Default to top-right if no direction specified or if it's not found in the offsets object
        var offset = offsets[point.direction] || offsets["top-right"];
    
        marker.bindTooltip(point.name, {
            permanent: true, // Show on hover
            className: 'custom-tooltip',
            direction: point.direction.includes('top') ? 'top' : 'bottom', // Use 'top' or 'bottom' as Leaflet does not support diagonal directions directly
            offset: L.point(offset[0], offset[1]) // Set the offset for the tooltip
        });
    
        return marker;
    }
    

    // Layer group to hold the triangle markers
    var vfrLayer = L.layerGroup(vfrPoints.map(createTriangleMarker));

    // Add toggle functionality
    var vfrFixButton = document.getElementById('vfrFixButton');
    vfrFixButton.addEventListener('click', function() {
        if (map.hasLayer(vfrLayer)) {
            map.removeLayer(vfrLayer);
        } else {
            map.addLayer(vfrLayer);
        }
    });

    // Ensure the layer is not displayed by default
    vfrLayer.removeFrom(map);

    var minimumZoomForLabels = 8;

    // Function to set tooltip opacity based on the zoom level
    function setTooltipVisibility(zoomLevel) {
        vfrLayer.eachLayer(function(layer) {
            if (zoomLevel >= minimumZoomForLabels) {
                layer.getTooltip().setOpacity(1);
            } else {
                layer.getTooltip().setOpacity(0);
            }
        });
    }

    map.on('zoomend', function() {
        setTooltipVisibility(map.getZoom());
    });
    
    setTooltipVisibility(map.getZoom());
    
    // testing weather layer
    // https://en.ilmatieteenlaitos.fi/open-data-manual-fmi-wms-services
    
    var radarLayer = L.tileLayer.wms('https://openwms.fmi.fi/geoserver/wms', {
        layers: 'Radar:suomi_rr_eureffin',
        format: 'image/png',
        transparent: true,
        attribution: '© Finnish Meteorological Institute',
        _uniqueTime: new Date().getTime()
    }).addTo(map);

    document.getElementById('wxButton').addEventListener('click', function() {
        if (map.hasLayer(radarLayer)) {
            map.removeLayer(radarLayer);
        } else {
            map.addLayer(radarLayer);
        }
    });

});


function dmsToDecimal(degrees, minutes, seconds, direction) {
    var decimal = parseInt(degrees, 10) + parseInt(minutes, 10) / 60 + parseInt(seconds, 10) / 3600;
    if (direction === 'S' || direction === 'W') {
        decimal *= -1;
    }
    return decimal;
}

function convertToLatLng(dmsLat, dmsLng) {
    // Extract parts of the DMS coordinates
    var latParts = dmsLat.match(/(\d{2})(\d{2})(\d{2})([NS])/);
    var lngParts = dmsLng.match(/(\d{3})(\d{2})(\d{2})([EW])/);

    // Convert DMS to decimal
    var lat = dmsToDecimal(latParts[1], latParts[2], latParts[3], latParts[4]);
    var lng = dmsToDecimal(lngParts[1], lngParts[2], lngParts[3], lngParts[4]);

    return [lat, lng];
}

