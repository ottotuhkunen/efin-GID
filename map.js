var map;
let geojsonLayer; 

// EFJY CTA
const now = new Date();
const dayOfWeek = now.getUTCDay(); // 0 (Sunday) to 6 (Saturday)
const utcHours = now.getUTCHours();
const excludeStyleIds = ['RAS', 'airfield', 'aerodrome', 'heliport', 'Other'];
const isVisibleEFJYCTA = ((dayOfWeek >= 1 && dayOfWeek <= 4 && utcHours >= 6 && utcHours < 14) || (dayOfWeek === 5 && utcHours >= 6 && utcHours < 12)); 
// MON-THU 0600-1400 UTC 
// FRI 0600-1200 UTC

// Function to fetch KML, convert it to GeoJSON, and add it to the map
async function addKMLToMap(map) {
    try {
        // Await the fetching and processing of VATSIM data to ensure activeKmlNames is ready
        const vatsimResponse = await fetch('https://data.vatsim.net/v3/vatsim-data.json');
        const vatsimData = await vatsimResponse.json();
        const activeAtcCodes = vatsimData.controllers.map(controller => controller.callsign);
        

        activeKmlNames = [];
        
        atcToKmlMapping.forEach(mapping => {
            const [atcCodes, kmlNames] = mapping;
            // Check if any ATC code in this entry is active
            const isActive = atcCodes.some(atcCode => 
                activeAtcCodes.some(activeCode => activeCode.startsWith(atcCode))
            );

            if (isActive) {
                // If any ATC code is active, mark all corresponding KML names as active
                activeKmlNames.push(...kmlNames);
            }
        });

        // Now fetch and process the KML data
        const kmlResponse = await fetch('https://flyk.com/api/finland.kml');
        const kmlText = await kmlResponse.text();
        const parser = new DOMParser();
        const kml = parser.parseFromString(kmlText, 'text/xml');
        const convertedGeoJSON = toGeoJSON.kml(kml);

        // Filter and add GeoJSON as before
        const filteredGeoJSON = {
            ...convertedGeoJSON,
            features: convertedGeoJSON.features.filter(feature => {
                var styleId = feature.properties.styleUrl ? feature.properties.styleUrl.replace('#', '') : null;
                return !excludeStyleIds.includes(styleId) && !(feature.properties.name === "EFJY CTA" && !isVisibleEFJYCTA);
            })
        };

        // Add the GeoJSON layer with adjusted styling for active KML names
        geojsonLayer = L.geoJson(filteredGeoJSON, {
            style: function(feature) {
                var styleId = feature.properties.styleUrl ? feature.properties.styleUrl.replace('#', '') : null;
                var baseStyle = styleId && kmlStyles[styleId] ? {
                    ...kmlStyles[styleId]
                } : { color: "white", weight: 0, opacity: 0, fillOpacity: 0 };

                // If the feature's name is in the activeKmlNames list, adjust the style
                if (feature.properties.name && activeKmlNames.includes(feature.properties.name)) {
                    baseStyle.weight = 2.5; // Adjust the weight for highlighted features
                }

                return baseStyle;
            }
        }).addTo(map);

    } catch (error) {
        console.error('Error fetching or processing data:', error);
    }

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
                radius: 4,
                fillColor: "coral",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(map);
        
            circle.bindTooltip(airport.icao, {
                permanent: false,
                className: 'custom-tooltip',
                direction: 'top',
                offset: L.point(10, 5)
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

    var aircraftMarkers = L.layerGroup().addTo(map);

    // Step 2: Define the function to fetch and update aircraft positions
    function fetchAndUpdateAircraftPositions() {
        // Clear existing markers from the map
        aircraftMarkers.clearLayers();
        console.log("Aircraft positions updated");

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
                            ${pilot.flight_plan ? (pilot.flight_plan.aircraft_short ? pilot.flight_plan.aircraft_short : 'XXXX') : 'XXXX'}<br>
                            ${afl} ${spd} ${pilot.flight_plan ? (pilot.flight_plan.arrival ? pilot.flight_plan.arrival : 'XXXX') : 'XXXX'}
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

                    L.marker([pilot.latitude, pilot.longitude], { icon: marker }).addTo(aircraftMarkers); // Corrected line

                }
            });
        })
        .catch(error => console.error('Error fetching VATSIM data:', error));
    }

    fetchAndUpdateAircraftPositions();
    setInterval(fetchAndUpdateAircraftPositions, 30000); 
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

// FIXES

document.addEventListener('DOMContentLoaded', function() {
    var accSectorLayer = L.layerGroup();

    // Triangle icon
    var triangleIconUrl = 'data:image/svg+xml;base64,' + btoa(`
        <svg width="10" height="10" viewbox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
            <path d="M 5 0 L 10 10 L 0 10 Z" fill="black" />
        </svg>
    `);

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

    var vfrLayer = L.layerGroup(vfrPoints.map(createTriangleMarker));

    // toggle functionality
    var vfrFixButton = document.getElementById('vfrFixButton');
    vfrFixButton.addEventListener('click', function() {
        if (map.hasLayer(vfrLayer)) {
            map.removeLayer(vfrLayer);
        } else {
            map.addLayer(vfrLayer);
        }
    });

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
    
    // WEATHER
    // https://en.ilmatieteenlaitos.fi/open-data-manual-fmi-wms-services
    var radarLayer = L.tileLayer.wms('https://openwms.fmi.fi/geoserver/wms', {
        layers: 'Radar:suomi_rr_eureffin',
        format: 'image/png',
        transparent: true,
        attribution: '© Finnish Meteorological Institute',
        _uniqueTime: new Date().getTime()
    }).addTo(map);


    // BUTTON MAPPING
    document.getElementById('wxButton').addEventListener('click', function() {
        if (map.hasLayer(radarLayer)) {
            map.removeLayer(radarLayer);
        } else {
            map.addLayer(radarLayer);
        }
    });

     // add FIR to map
     firCoordinates.forEach(sector => {
        const polyline = L.polyline(sector, {
            color: "black",
            weight: 1
        });
        map.addLayer(polyline);
    });

    // add ACC Sectors to map
    sectorCoordinates.forEach(sector => {
        const polyline = L.polyline(sector, {
            color: '#476c00',
            dashArray: '10 5 5 5',
            weight: 1
        });
        accSectorLayer.addLayer(polyline);
    });

    // ACC Sectors button
    document.getElementById('loadAccSectors').addEventListener('click', () => {
        if (map.hasLayer(accSectorLayer)) {
            map.removeLayer(accSectorLayer);
        } else {
            map.addLayer(accSectorLayer);
        }
    });


    // other airspaces (CTR, TMA and FIZ) toggle button
    function toggleAirspace() {
        if (map.hasLayer(geojsonLayer)) {
            map.removeLayer(geojsonLayer);
        } else {
            geojsonLayer.addTo(map);
        }
    }
    document.getElementById('airspaceButton').addEventListener('click', toggleAirspace);

        
    




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
