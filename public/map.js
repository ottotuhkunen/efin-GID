var map;
let geojsonLayer; 
let sigmetLayers = [];
let aircraftMarkers;

// EFJY CTA
const now = new Date();
const dayOfWeek = now.getUTCDay(); // 0 (Sunday) to 6 (Saturday)
const utcHours = now.getUTCHours();
const excludeStyleIds = ['RAS', 'airfield', 'aerodrome', 'heliport', 'Other'];
const isVisibleEFJYCTA = ((dayOfWeek >= 1 && dayOfWeek <= 4 && utcHours >= 6 && utcHours < 14) || (dayOfWeek === 5 && utcHours >= 6 && utcHours < 12)); 
// MON-THU 0600-1400 UTC 
// FRI 0600-1200 UTC

async function addKMLToMap(map) {
    document.getElementById('airspaceButton').disabled = true;
    if (geojsonLayer) {
        map.removeLayer(geojsonLayer);
    }

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
                activeKmlNames.push(...kmlNames);
            }
        });

        const kmlResponse = await fetch('/api/finland.kml');
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

        var airacIcon = L.divIcon({
            className: 'airacLabel',
            html: "DPR_20240125"
        });  
        L.marker([67, 30.45], {icon: airacIcon}).addTo(map);
          
    } catch (error) {
        console.error('Error fetching or processing data:', error);
    } finally {
        document.getElementById('airspaceButton').disabled = false;
    }

    // make airports
    airports.forEach(function(airport) {
        var circle = L.circleMarker(airport.coords, {
            radius: 4.5,
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

        circle.on('click', function() {
            loadAirportData(airport.icao);
        });

    });

    console.log("Airspace and ATC activity loaded");    
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

    // load airspaces and ATC activity
    addKMLToMap(map);
    setInterval(() => {
        addKMLToMap(map);
    }, 120000);

    // Finland's approximate bounding box coordinates
    const finlandBounds = {
        north: 70.09,
        south: 59.81,
        west: 20.58,
        east: 31.59
    };

    aircraftMarkers = L.layerGroup().addTo(map);

    function updateAircraftPositions() {
        fetch('/traffic')
            .then(response => response.json())
            .then(data => {
                aircraftMarkers.clearLayers();
                data.forEach(pilot => {
                    // Formatting altitude and speed
                    const formattedAltitude = formatAltitude(pilot.altitude);
                    const formattedSpeed = formatSpeed(pilot.groundspeed);
                    const aircraftShort = pilot.flight_plan.aircraft_short || 'XXXX';
                    const arrival = pilot.flight_plan.arrival || 'XXXX';
    
                    var htmlContent = `
                        <div class="custom-marker">
                            <div class="heading-line" style="transform: rotate(${pilot.heading - 90}deg);"></div>
                            <div class="marker-square"></div>
                            <div class="marker-text">
                                <span class="always-visible">${pilot.callsign}</span>
                                <span class="on-hover-content">
                                    ${aircraftShort}<br>
                                    ${formattedAltitude} ${formattedSpeed} ${arrival}
                                </span>
                            </div>
                        </div>
                    `;
    
                    var marker = L.divIcon({
                        className: 'custom-div-icon',
                        html: htmlContent,
                        iconSize: [5, 5],
                        iconAnchor: [5, 5]
                    });
    
                    L.marker([pilot.latitude, pilot.longitude], { icon: marker })
                        .on('click', function() {
                            aircraftData(pilot.callsign);
                        })
                        .addTo(aircraftMarkers);
                });
            })
            .catch(error => console.error('Error fetching aircraft positions:', error));
    }

    updateAircraftPositions();
    setInterval(updateAircraftPositions, 30000);
    

    // Close data window
    var closeButton = document.getElementById("closeContentWindow");
    if (closeButton) {
        closeButton.addEventListener("click", function() {
            document.getElementById("content").style.display = "none";
            document.getElementById("map").style.width = "100%";
            document.getElementById("header").style.right = "0%";
            document.getElementById("airportDataContainer").style.display = "none";
        });
    }

    
    fetch('/flow')
    .then(response => response.json())
    .then(data => {
        const filteredData = data.filter(entry => entry.notified_flight_information_regions.includes(20));
        let textContent = '';

        filteredData.forEach(entry => {
            const ident = entry.ident;
        
            const startTime = new Date(entry.starttime);
            const endTime = new Date(entry.endtime);

            const validityTime = `${startTime.getUTCDate()} ${startTime.toLocaleString('en-US', { month: 'short' }).toUpperCase()} ${('0' + startTime.getUTCHours()).slice(-2)}${('0' + startTime.getUTCMinutes()).slice(-2)}z - ${endTime.getUTCDate()} ${endTime.toLocaleString('en-US', { month: 'short' }).toUpperCase()} ${('0' + endTime.getUTCHours()).slice(-2)}${('0' + endTime.getUTCMinutes()).slice(-2)}z`;

            const measureType = entry.measure.type.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
            let measureValue = entry.measure.value;
            if (Array.isArray(measureValue)) {
                measureValue = measureValue.join(', ');
            }
            const filters = entry.filters.map(filter => `${filter.type}: ${filter.value.join(', ')}`).join('<br>');

            let reason = entry.reason;

            // Accumulate text content for each entry
            textContent += 
            `⚠️ <b>${ident} | ${validityTime}</b><br>
            ${measureType}: 
            ${measureValue}<br>${filters}<br>
            Reason: ${reason}<br><br>`; // Add <br> for spacing between entries
        });

        // Create marker with accumulated text content
        L.marker([59, 29.4122], { icon: L.divIcon({ className: 'flowLabel', html: textContent }) }).addTo(map);
    })
    .catch(error => console.error('Error fetching data:', error));

});


// Helper function for formatting altitude
function formatAltitude(altitude) {
    if (altitude <= 5000 && altitude > 300) return 'A' + Math.floor(altitude / 100).toString().padStart(2, '0');
    else if (altitude > 5000) return 'F' + Math.floor(altitude / 100).toString().padStart(2, '0');
    return '';
}

// Helper function for formatting speed
function formatSpeed(speed) {
    return speed < 30 ? '' : speed.toString();
}

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

document.addEventListener('DOMContentLoaded', function() {
    var accSectorLayer = L.layerGroup();

    // load FIR borders
    fetch('src/efin.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJson(data, {
            style: {
                color: 'black',
                weight: 1,
                fillColor: 'transparent',
                fillOpacity: 0
            },
            interactive: false
        }).addTo(map).bringToBack();
    })
    .catch(error => console.error('Error loading the GeoJSON file:', error));

    // Waypoint icons
    var vfrIcon = 'data:image/svg+xml;base64,' + btoa(`
        <svg width="10" height="10" viewbox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
        <path d="M 5 0 L 6.5 2 L 8.5 4 L 10 10 L 0 10 L 1.5 4 L 3.5 2 Z" fill="none" stroke="black" stroke-width="1.5" />
        </svg>
    `);
    var ifrIcon = 'data:image/svg+xml;base64,' + btoa(`
        <svg width="30" height="30" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
        <path d="M 0 0 L 10 0 L 8.5 6 L 5 10 L 1.5 6 L 0 0 Z" fill="none" stroke="black" stroke-width="1.5" />
        </svg>
    `);

    function createVfrMarker(point) {
        // Convert DMS coordinates to decimal
        var coords = convertToLatLng(point.dmsCoords[0], point.dmsCoords[1]);

        var marker = L.marker(coords, {
            icon: L.icon({
                iconUrl: vfrIcon,
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
            "top": [0, 8],
            "left": [-30, -18]
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

    function createIfrMarker(point) {
        // Convert DMS coordinates to decimal
        var coords = convertToLatLng(point.dmsCoords[0], point.dmsCoords[1]);

        var marker = L.marker(coords, {
            icon: L.icon({
                iconUrl: ifrIcon,
                iconSize: [8, 8],
                iconAnchor: [4, 4]
            })
        });
    
        // Fix text position
        var offsets = {
            "top-right": [24, 10],
            "top-left": [-24, 10],
            "bottom-left": [-24, -8],
            "bottom-right": [24, -8],
            "top": [0, 8],
            "left": [-30, -18]
        };
    
        // default text position
        var offset = offsets[point.direction] || offsets["top-right"];
    

        marker.bindTooltip(point.name, {
            permanent: true, // Show on hover
            className: 'custom-tooltip',
            direction: point.direction.includes('top') ? 'top' : 'bottom',
            offset: L.point(offset[0], offset[1])
        });
    
        return marker;
    }

    var vfrLayer = L.layerGroup(vfrPoints.map(createVfrMarker));
    var ifrLayer = L.layerGroup(tmaPoints.map(createIfrMarker));

    // toggle functionality
    var vfrFixButton = document.getElementById('vfrFixButton');
    vfrFixButton.addEventListener('click', function() {
        if (map.hasLayer(vfrLayer)) {
            map.removeLayer(vfrLayer);
            document.getElementById('vfrFixButton').style.backgroundColor = "#484b4c";
        } else {
            map.addLayer(vfrLayer);
            document.getElementById('vfrFixButton').style.backgroundColor = "#41826e";
        }
    });

    vfrLayer.removeFrom(map);

    var tmaFixButton = document.getElementById('tmaFixButton');
    tmaFixButton.addEventListener('click', function() {
        if (map.hasLayer(ifrLayer)) {
            map.removeLayer(ifrLayer);
            document.getElementById('tmaFixButton').style.backgroundColor = "#484b4c";
        } else {
            map.addLayer(ifrLayer);
            document.getElementById('tmaFixButton').style.backgroundColor = "#41826e";
        }
    });

    ifrLayer.removeFrom(map);

    function setTooltipVisibility(zoomLevel) {
        vfrLayer.eachLayer(function(layer) {
            if (zoomLevel >= 8) {
                layer.getTooltip().setOpacity(1);
            } else {
                layer.getTooltip().setOpacity(0);
            }
        });
        ifrLayer.eachLayer(function(layer) {
            if (zoomLevel >= 7) {
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
        _uniqueTime: new Date().getTime(),
        opacity: 0.5,
        maxZoom: 9,
    }).addTo(map);


    // BUTTON MAPPING
    document.getElementById('wxButton').addEventListener('click', function() {
        if (map.hasLayer(radarLayer)) {
            map.removeLayer(radarLayer);
            document.getElementById('wxButton').style.backgroundColor = "#484b4c";
        } else {
            map.addLayer(radarLayer);
            document.getElementById('wxButton').style.backgroundColor = "#41826e";
        }
    });

    document.getElementById('trafficButton').addEventListener('click', function() {
        if (map.hasLayer(aircraftMarkers)) {
            map.removeLayer(aircraftMarkers);
            document.getElementById('trafficButton').style.backgroundColor = "#484b4c";
        } else {
            map.addLayer(aircraftMarkers);
            document.getElementById('trafficButton').style.backgroundColor = "#41826e";
        }
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
            document.getElementById('loadAccSectors').style.backgroundColor = "#484b4c";
        } else {
            map.addLayer(accSectorLayer);
            document.getElementById('loadAccSectors').style.backgroundColor = "#41826e";
        }
    });

    // other airspaces (CTR, TMA and FIZ) toggle button
    function toggleAirspace() {
        if (map.hasLayer(geojsonLayer)) {
            map.removeLayer(geojsonLayer);
            document.getElementById('airspaceButton').style.backgroundColor = "#484b4c";

        } else {
            geojsonLayer.addTo(map).bringToBack();
            document.getElementById('airspaceButton').style.backgroundColor = "#41826e";
        }
    }

    document.getElementById('airspaceButton').addEventListener('click', toggleAirspace);

    // SIGMET
    function fetchSigmets() {
        fetch('/sigmet')
        .then(response => response.json())
        .then(sigmets => {
            const firIds = ['EFIN', 'ULLL', 'ESAA', 'EETT'];
            drawSigmetsForFIRs(sigmets, firIds);
        })
        .catch(error => console.error('Error fetching SIGMET data:', error));
    }
      
    function toggleSigmets() {
        sigmetLayers.forEach(layer => {
            if (map.hasLayer(layer)) {
                map.removeLayer(layer);
                document.getElementById('sigmetButton').style.backgroundColor = "#484b4c";
            } else {
                layer.addTo(map).bringToBack();
                document.getElementById('sigmetButton').style.backgroundColor = "#41826e";
            }
        });
    }

    document.getElementById('sigmetButton').addEventListener('click', () => {
        toggleSigmets();
    });
      
    fetchSigmets();
    setInterval(fetchSigmets, 10 * 60 * 1000);

    // set time window
    var timeWindow = document.getElementById("timeWindow");

    function updateTime() {
        var now = new Date();

        // Convert to Finland time (EET/EEST, UTC+2/3)
        var finlandTime = now.toLocaleString('fi-FI', { timeZone: 'Europe/Helsinki', day: '2-digit', month: 'long', year: 'numeric' });
        var timePart = now.toLocaleTimeString('fi-FI', { timeZone: 'Europe/Helsinki', hour12: false });

        // Get UTC time
        var utcTime = now.toISOString().slice(11,19);

        // Update the content of the time window
        timeWindow.innerHTML = finlandTime + "<br><h3>" + timePart + " SA <br>" + utcTime + " UTC</h3>";
    }
    
    updateTime();
    setInterval(updateTime, 1000);

    // make runway extended centerlines

    //EFTP
    drawExtendedCenterline(convertCoordinatesToDecimal("612432.12N 0233453.71E"), 64.44, 15, map);
    drawExtendedCenterline(convertCoordinatesToDecimal("612509.73N 0233737.95E"), 244.48, 15, map)
    // EFPO
    drawExtendedCenterline(convertCoordinatesToDecimal("612803.41N 0214658.04E"), 125.77, 15, map)
    drawExtendedCenterline(convertCoordinatesToDecimal("612727.31N 0214842.74E"), 305.80, 15, map)
    // EFTU
    drawExtendedCenterline(convertCoordinatesToDecimal("603047.19N 0221424.53E"), 084.83, 15, map)
    drawExtendedCenterline(convertCoordinatesToDecimal("603054.44N 0221707.72E"), 264.87, 15, map)
    // EFHK
    drawExtendedCenterline(convertCoordinatesToDecimal("601846.61N 0245413.93E"), 47.47, 25, map)
    drawExtendedCenterline(convertCoordinatesToDecimal("601840.65N 0245610.94E"), 47.50, 25, map)
    drawExtendedCenterline(convertCoordinatesToDecimal("601952.11N 0245638.01E"), 227.51, 25, map)
    drawExtendedCenterline(convertCoordinatesToDecimal("601950.49N 0245844.73E"), 227.54, 18, map)
    drawExtendedCenterline(convertCoordinatesToDecimal("601948.99N 0245752.19E"), 153.04, 25, map)
    drawExtendedCenterline(convertCoordinatesToDecimal("601825.44N 0245917.83E"), 333.06, 25, map)
    // EFMA
    drawExtendedCenterline(convertCoordinatesToDecimal("600651.71N 0195328.92E"), 23.37, 15, map)
    drawExtendedCenterline(convertCoordinatesToDecimal("600748.15N 0195417.81E"), 203.38, 15, map)

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

  function drawSigmetsForFIRs(sigmets, firIds) {
    sigmetLayers = [];
    sigmets.forEach(sigmet => {
      if (!firIds.includes(sigmet.firId)) return;
      const coordinates = sigmet.coords.map(coord => [coord.lat, coord.lon]);
      const polygon = L.polygon(coordinates, {
        color: 'rgb(0, 128, 255)',
        fillColor: 'rgb(0, 128, 255)',
        fillOpacity: 0.1,
        weight: 2,
      }).bindPopup(sigmet.rawSigmet);
      sigmetLayers.push(polygon.addTo(map));
      const center = polygon.getBounds().getCenter();
      const hazardMarker = L.marker(center, {
        icon: L.divIcon({
          className: 'hazard-marker',
          html: `<div>${sigmet.hazard}</div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        })
      }).addTo(map);
    });
}

// Function to convert coordinates from format "612432.12N 0233453.71E" to decimal degrees
function convertCoordinatesToDecimal(coord) {
    // Parse latitude and longitude parts
    const [lat, lon] = coord.split(' ');

    // Convert latitude from format "612432.12N" to decimal degrees
    const latDeg = parseFloat(lat.substring(0, 2)) + parseFloat(lat.substring(2, 4)) / 60 + parseFloat(lat.substring(4)) / 3600;

    // Convert longitude from format "0233453.71E" to decimal degrees
    const lonDeg = parseFloat(lon.substring(0, 3)) + parseFloat(lon.substring(3, 5)) / 60 + parseFloat(lon.substring(5)) / 3600;

    // Check if latitude is North or South
    if (lat.endsWith('N')) {
        return [latDeg, lonDeg];
    } else {
        return [-latDeg, lonDeg];
    }
}

// Function to calculate the endpoint of the extended centerline
function calculateEndPoint(startCoord, heading, distanceNM) {
    const R = 3440.065; // Radius of the Earth in nautical miles
    const lat1 = startCoord[0] * Math.PI / 180; // Convert latitude to radians
    const lon1 = startCoord[1] * Math.PI / 180; // Convert longitude to radians
    const brng = (heading + 180) * Math.PI / 180; // Convert bearing to radians

    const lat2 = Math.asin(Math.sin(lat1) * Math.cos(distanceNM / R) + Math.cos(lat1) * Math.sin(distanceNM / R) * Math.cos(brng));
    const lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(distanceNM / R) * Math.cos(lat1), Math.cos(distanceNM / R) - Math.sin(lat1) * Math.sin(lat2));

    return [lat2 * 180 / Math.PI, lon2 * 180 / Math.PI]; // Convert back to degrees
}

// Function to draw the extended centerline on the map
function drawExtendedCenterline(startCoord, heading, distanceNM, map) {
    const startPoint = L.latLng(startCoord);
    const endPoint = L.latLng(calculateEndPoint(startCoord, heading, distanceNM)); // Reverse heading

    // Draw main line
    const mainLine = L.polyline([startPoint, endPoint], { color: '#8a8a8a', weight: 1 }).addTo(map);

    // Draw cross lines at each mile
    for (let i = 0.5; i < distanceNM; i++) {
        const crossLineLength = ((i + 0.5) % 5 === 0) ? 40 : 15; // Longer cross line at every 5th mile
        const milePoint = calculateEndPoint(startCoord, heading, i); // Mile point along the main line
        const nextMilePoint = calculateEndPoint(startCoord, heading, i + 1); // Next mile point along the main line
        const midPoint = [(milePoint[0] + nextMilePoint[0]) / 2, (milePoint[1] + nextMilePoint[1]) / 2]; // Midpoint between two consecutive miles
        const crossLineStart = calculateEndPoint(midPoint, heading + 90, crossLineLength / 60); // Perpendicular to main line
        const crossLineEnd = calculateEndPoint(midPoint, heading + 90, -crossLineLength / 60); // Perpendicular to main line
        L.polyline([crossLineStart, crossLineEnd], { color: '#8a8a8a', weight: 1 }).addTo(map);
    }   
}