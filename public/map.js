var map;
let geojsonLayer; 
let atcNamesLayer = [];
let sigmetLayers = [];
let aircraftMarkers;
let mainLines = [];
let crossLines = [];
var airwaysVisible = false;
activeKmlNames = [];

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

    if (!geojsonLayer) {
        document.getElementById('loadingScreen').style.display = "inline-flex";
    }
    
    try {
        const vatsimResponse = await fetch('https://data.vatsim.net/v3/vatsim-data.json');
        const vatsimData = await vatsimResponse.json();
        const activeAtcCodes = vatsimData.controllers.map(controller => controller.callsign);

        let activeKmlNames = [];
        let activeKmlTexts = new Map(); // Map to hold KML names to their texts
        let displayedTexts = new Set(); // Set to track which ATC texts have been displayed

        atcToKmlMapping.forEach(mapping => {
            const [atcCodes, kmlNames, atcText] = mapping;
            const isActive = atcCodes.some(atcCode =>
                activeAtcCodes.includes(atcCode) // Use includes for exact match
            );

            if (isActive) {
                kmlNames.forEach(kmlName => {
                    if (!activeKmlNames.includes(kmlName)) {
                        activeKmlNames.push(kmlName);
                        if (!displayedTexts.has(atcText)) { // Only map text if not already displayed
                            activeKmlTexts.set(kmlName, atcText);
                        }
                    }
                });
            }
        });

        const fetchKML = async (url) => {
            const response = await fetch(url);
            const text = await response.text();
            const parser = new DOMParser();
            const kml = parser.parseFromString(text, 'text/xml');
            return toGeoJSON.kml(kml);
        };

        const finlandPromise = fetchKML('/api/finland.kml');
        const estoniaPromise = fetchKML('/api/estonia.kml');

        const [finlandGeoJSON, estoniaGeoJSON] = await Promise.all([finlandPromise, estoniaPromise]);
        const mergedFeatures = finlandGeoJSON.features.concat(estoniaGeoJSON.features);

        const filteredGeoJSON = {
            type: "FeatureCollection",
            features: mergedFeatures.filter(feature => {
                if (feature.properties && feature.properties.visibility === "false") {
                    return false;
                }
                var styleId = feature.properties?.styleUrl ? feature.properties.styleUrl.replace('#', '') : null;
                return !excludeStyleIds.includes(styleId) && !(feature.properties?.name === "EFJY CTA" && !isVisibleEFJYCTA);
            })
        };

        if (geojsonLayer) map.removeLayer(geojsonLayer);
        if (atcNamesLayer) map.removeLayer(atcNamesLayer);
        atcNamesLayer.forEach(function(marker) {
            map.removeLayer(marker);
        });
        atcNamesLayer = [];

        geojsonLayer = L.geoJson(filteredGeoJSON, {
            style: function(feature) {
                var styleId = feature.properties.styleUrl ? feature.properties.styleUrl.replace('#', '') : null;
                var baseStyle = styleId && kmlStyles[styleId] ? { ...kmlStyles[styleId] } : { 
                    color: "white", 
                    weight: 0, 
                    opacity: 0, 
                    fillOpacity: 0,
                    interactive: false
                };
                if (feature.properties.name && activeKmlNames.includes(feature.properties.name)) {
                    baseStyle.weight = 2.5;
                }
                return baseStyle;
            },
            onEachFeature: function(feature, layer) {
                if (feature.properties.name && activeKmlNames.includes(feature.properties.name)) {
                    const correspondingATCText = activeKmlTexts.get(feature.properties.name);
                    if (correspondingATCText && !displayedTexts.has(correspondingATCText)) {
                        const bounds = L.geoJson(feature).getBounds();
                        const southLatLng = bounds.getSouth(); // Get the latitude of the southern boundary
                        const centerLng = bounds.getCenter().lng; // Get the longitude of the center
                        const textLatLng = [southLatLng, centerLng];
                        
                        const textOptions = {
                            className: 'atc-text-marker', // Add a custom class for styling
                            html: `<div>${correspondingATCText}</div>`,
                            iconAnchor: [0, 0],
                            iconSize: [0, 0],
                        };
                        var marker = L.marker(textLatLng, { icon: L.divIcon({ html: `<div>${correspondingATCText}</div>`, ...textOptions }) }).addTo(map);

                        atcNamesLayer.push(marker);

                        displayedTexts.add(correspondingATCText); // Mark this text as displayed
                    }
                }
                layer.bindPopup(feature.properties.name);
            }
        }).addTo(map).bringToBack();          
    } catch (error) {
        console.error('Error fetching or processing data:', error);
    } finally {
        document.getElementById('loadingScreen').style.display = "none";
        document.getElementById('airspaceButton').disabled = false;
    }
    console.log("Airspace and ATC activity loaded");    
}


document.addEventListener('DOMContentLoaded', (event) => {
    // Initialize the map
    map = L.map('map', {
        zoomControl: false
    }).setView([63, 25], 6);

    var airacIcon = L.divIcon({
        className: 'airacLabel',
        html: "DPR_20240125"
    });  
    L.marker([67, 30.45], {icon: airacIcon}).addTo(map);

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
    setInterval(updateAircraftPositions, 20000);
    
    // Close data window
    var closeButton = document.getElementById("closeContentWindow");
    if (closeButton) {
        closeButton.addEventListener("click", function() {
            document.getElementById("content").style.display = "none";
            document.getElementById("airportDataContainer").style.display = "none";
        });
    }

    // add ground maps (ADC - aerodrome charts)
    addPdfOverlays();
    
    fetch('/flow')
    .then(response => response.json())
    .then(data => {
        const filteredData = data.filter(entry => entry.notified_flight_information_regions.includes(14));
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
            if (measureType === "Minimum Departure Interval") {
                measureValue = Math.round(measureValue / 60) + " Minutes";
            }
            const filters = entry.filters.map(filter => `${filter.type}: ${filter.value.join(', ')}`).join('<br>');

            let reason = entry.reason;

            textContent += 
            `⚠️ <b>${ident} | ${validityTime}</b><br>
            ${measureType}: 
            ${measureValue}<br>${filters}<br>
            Reason: ${reason}<br><br>`;
        });

        L.marker([59, 29.4122], { icon: L.divIcon({ className: 'flowLabel', html: textContent }) }).addTo(map);
    })
    .catch(error => console.error('Error fetching data:', error));

});

function formatAltitude(altitude) {
    if (altitude <= 5000 && altitude > 300) return 'A' + Math.floor(altitude / 100).toString().padStart(2, '0');
    else if (altitude > 5000) return 'F' + Math.floor(altitude / 100).toString().padStart(2, '0');
    return '';
}

function formatSpeed(speed) {
    return speed < 30 ? '' : speed.toString();
}

const kmlStyles = {
    "G": { color: "rgba(69, 130, 181, 0.6)", fillOpacity: 0, weight: 1, interactive: false },
    "C": { color: "rgba(56, 52, 148, 0.6)", fillOpacity: 0, weight: 1, interactive: false },
    "D": { color: "rgba(104, 45, 134, 0.6)", fillOpacity: 0, weight: 1, interactive: false },
    "Danger": { color: "darkorange", fillColor: "darkorange", fillOpacity: "40%", weight: 1 },
    "TEMPO_D": { color: "darkorange", fillColor: "darkorange", fillOpacity: "20%", weight: 1, dashArray: "4 4" },
    "Restricted": { color: "rgba(239, 8, 16, 0.6)", fillColor: "rgba(239, 8, 16, 0.4)", fillOpacity: "50%", weight: 1 },
    "TEMPO_R": { color: "rgba(239, 8, 16, 0.6)", fillColor: "rgba(239, 8, 16, 0.4)", fillOpacity: "50%", weight: 1 },
    "Prohibited": { color: "rgba(255, 0, 0, 0.6)", fillColor: "rgba(255, 0, 0, 0.4)", fillOpacity: "50%", weight: 1 },
    "TEMPO_P": { color: "rgba(255, 0, 0, 0.6)", fillColor: "rgba(255, 0, 0, 0.4)", fillOpacity: "50%", weight: 1 },
    "TSA": { color: "rgba(0, 85, 255, 0.4)", fillColor: "rgba(0, 85, 255, 0.4)", fillOpacity: "20%", weight: 1, dashArray: "4 4"},
    "TRA": { color: "rgba(0, 85, 255, 0.4)", fillColor: "rgba(0, 85, 255, 0.4)", fillOpacity: "20%", weight: 1, dashArray: "4 4"},
    "TEMPO_TSA": { color: "rgba(0, 85, 255, 0.4)", fillColor: "rgba(0, 85, 255, 0.4)", fillOpacity: "20%", weight: 1, dashArray: "4 4"},
    "TEMPO_TRA": { color: "rgba(0, 85, 255, 0.4)", fillColor: "rgba(0, 85, 255, 0.4)", fillOpacity: "20%", weight: 1, dashArray: "4 4"},
    "TEMPO_FBZ": { color: "rgba(128, 128, 128, 0.6)", fillColor: "rgba(128, 128, 128, 0.4)", weight: 1 },
    "Other": { color: "rgba(159, 128, 96, 0.6)", fillColor: "rgba(159, 128, 96, 0.4)", weight: 1 },
    "acc": { color: "rgba(159, 128, 96, 0.6)", fillColor: "rgba(159, 128, 96, 0.4)", weight: 1 },
    "FBZ": { color: "gray", fillOpacity: 0,  weight: 0.5 },
    "ACTIVE_FBZ": { color: "gray", fillOpacity: 0,  weight: 0.5 },
    "ACTIVE_AREA": { color: "rgba(0, 85, 255, 0.6)", fillColor: "rgba(0, 85, 255, 0.4)", fillOpacity: "0", weight: 1 }
};

document.addEventListener('DOMContentLoaded', function() {
    var accSectorLayer = L.layerGroup();

    // load FIR borders
    fetch('src/firs.json')
    .then(response => response.json())
    .then(data => {
        L.geoJson(data, {
            style: {
                color: 'darkGreen',
                weight: 1,
                fillColor: 'transparent',
                fillOpacity: 0
            },
            interactive: false
        }).addTo(map).bringToBack();
    })
    .catch(error => console.error('Error loading the JSON file:', error));


    // Neighbouring TMAs
    fetch('src/swedenAndTallinn.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJson(data, {
            style: {
                color: "rgba(56, 52, 148, 1)",
                weight: 1,
                fillOpacity: 0,
                fillColor: "black",
                interactive: true,
                fillOpacity: 1
            },
            onEachFeature: function(feature, layer) {
                layer.bindPopup(
                    `${feature.properties.name}<br>` +
                    `${feature.properties.Base} - ${feature.properties.Top}`
                );
            }
        }).addTo(map);
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
                iconSize: [8, 8],
                iconAnchor: [4, 4]
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

    // load airways
    document.getElementById("airwaysButton").addEventListener("click", function() {
        if (airwaysVisible) {
            airways.forEach(function(airway) {
                if (airway.layer) {
                    map.removeLayer(airway.layer);
                }
                airway.points.forEach(function(point) {
                    if (point.layer) {
                        map.removeLayer(point.layer);
                    }
                });
            });
            airwaysVisible = false;
            document.getElementById('airwaysButton').style.backgroundColor = "#484b4c";
        } else {
            airways.forEach(function(airway) {
                var waypoints = airway.points.map(function(point) {
                    var coords = convertToLatLng(point.dmsCoords[0], point.dmsCoords[1]);
                    var marker = L.marker(coords, {
                        icon: L.icon({
                            iconUrl: ifrIcon,
                            iconSize: [8, 8],
                            iconAnchor: [4, 4]
                        })
                    }).bindPopup(point.name);
                    point.layer = marker; // Store reference to marker
                    return marker;
                });
        
                waypoints.forEach(function(marker) {
                    marker.addTo(map); // Add marker to map
                });
        
                var color, dashArray;
                if (airway.type === "EFHK DEP | PERM") {
                    color = "#298cff";
                    weight = 2;
                    dashArray = null;
                } else if (airway.type === "EFHK ARR | PERM") {
                    color = "orange";
                    weight = 2;
                    dashArray = null;
                } else if (airway.type === "CDR 1 H24") {
                    color = "black";
                    weight = 1;
                    dashArray = "4, 4";
                } else {
                    color = "black";
                    weight = 1;
                    dashArray = null;
                }
                
                var polyline = L.polyline(waypoints.map(function(waypoint) { return waypoint.getLatLng(); }), {
                    color: color,
                    weight: weight,
                    dashArray: dashArray
                }).bindPopup("RTE ID: <b>" + airway.name + "</b><br>Type: " + airway.type)
                .addTo(map);

                airway.layer = polyline;
            });
            airwaysVisible = true;
            document.getElementById('airwaysButton').style.backgroundColor = "#41826e";
        }
    });
    
    

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

    function updateRadarLayer() {
        var uniqueTime = new Date().getTime();
        radarLayer.setParams({ _uniqueTime: uniqueTime });
        console.log("Weather radar updated");
    }

    // updating weather radar every 5 minutes
    setInterval(updateRadarLayer, 300000);


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

    document.getElementById('rwyButton').addEventListener('click', function() {
        if (map.hasLayer(mainLines[0])) {
            crossLines.forEach(crossLine => {
                map.removeLayer(crossLine);
            });
            mainLines.forEach(mainLine => {
                map.removeLayer(mainLine);
            });
            document.getElementById('rwyButton').style.backgroundColor = "#484b4c";
        } else {
            crossLines.forEach(crossLine => {
                map.addLayer(crossLine);
            });
            mainLines.forEach(mainLine => {
                map.addLayer(mainLine);
            });
            document.getElementById('rwyButton').style.backgroundColor = "#41826e";
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
            document.getElementById('airspaceButton').style.backgroundColor = "#484b4c";
            map.removeLayer(geojsonLayer);
            atcNamesLayer.forEach(function(marker) {
                map.removeLayer(marker);
            });
        } else {
            document.getElementById('airspaceButton').style.backgroundColor = "#41826e";
            map.addLayer(geojsonLayer);
            atcNamesLayer.forEach(function(marker) {
                marker.addTo(map); // add marker to map
            });
        }
    }

    document.getElementById('airspaceButton').addEventListener('click', toggleAirspace);

    // SIGMET
    function fetchSigmets() {
        fetch('/sigmet')
        .then(response => response.json())
        .then(sigmets => {
            const firIds = ['EFIN', 'ULLL', 'ESAA', 'EETT', 'ENOR'];
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

    // make airports
    airports.forEach(function(airport) {
        var customIcon = L.icon({
            iconUrl: '/src/airport.png',
            iconSize: [16, 16], // Adjust the size as needed
            iconAnchor: [8, 8], // Adjust the anchor point if necessary
            popupAnchor: [0, -10] // Adjust the popup anchor if necessary
        });
    
        // Create marker with custom icon
        var marker = L.marker(airport.coords, {
            icon: customIcon
        }).addTo(map);
    
        marker.bindTooltip(airport.icao, {
            permanent: false,
            className: 'custom-tooltip',
            direction: 'top',
            offset: L.point(10, 5)
        });
    
        marker.on('click', function() {
            loadAirportData(airport.icao);
        });
    
        // Fetch pilot data from the /traffic endpoint
        fetch('/traffic')
        .then(response => response.json())
        .then(data => {
            // Check if any pilot is flying to or from this airport
            var isAirportActive = data.some(pilot => pilot.flight_plan.departure === airport.icao || pilot.flight_plan.arrival === airport.icao);
            
            // If active, set the icon URL to activeAirport.png, otherwise set it back to airport.png
            if (isAirportActive) {
                customIcon.options.iconUrl = '/src/activeAirport.png';
                marker.setIcon(customIcon);
            } else {
                customIcon.options.iconUrl = '/src/airport.png';
                marker.setIcon(customIcon);
            }
        });
    });
    

    // make runway extended centerlines

    //EFTP
    drawExtendedCenterline(convertCoordinatesToDecimal("612432.12N 0233453.71E"), 64.44, 15, map);
    drawExtendedCenterline(convertCoordinatesToDecimal("612509.73N 0233737.95E"), 244.48, 15, map)
    // EFPO
    drawExtendedCenterline(convertCoordinatesToDecimal("612803.41N 0214658.04E"), 125.77, 15, map)
    drawExtendedCenterline(convertCoordinatesToDecimal("612727.31N 0214842.74E"), 305.80, 15, map)
    // EFTU
    drawExtendedCenterline(convertCoordinatesToDecimal("603047.19N 0221424.53E"), 84.83, 15, map)
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
    // EFLP
    drawExtendedCenterline(convertCoordinatesToDecimal("610224.43N 0280723.32E"), 66.72, 15, map)
    drawExtendedCenterline(convertCoordinatesToDecimal("610256.33N 0280956.36E"), 246.76, 15, map)
    // EFUT
    drawExtendedCenterline(convertCoordinatesToDecimal("605340.32N 0265513.19E"), 78.03, 15, map)
    drawExtendedCenterline(convertCoordinatesToDecimal("605353.71N 0265722.96E"), 258.06, 15, map)
    // EFMI
    drawExtendedCenterline(convertCoordinatesToDecimal("614119.78N 0271128.28E"), 112.59, 15, map)
    drawExtendedCenterline(convertCoordinatesToDecimal("614102.98N 0271253.26E"), 292.61, 15, map)
    // EFSA
    drawExtendedCenterline(convertCoordinatesToDecimal("615656.69N 0285538.42E"), 125.66, 15, map)
    drawExtendedCenterline(convertCoordinatesToDecimal("615613.36N 0285746.54E"), 305.69, 15, map)
    // EFJO
    drawExtendedCenterline(convertCoordinatesToDecimal("623952.52N 0293551.59E"), 110.30, 15, map)
    drawExtendedCenterline(convertCoordinatesToDecimal("623924.48N 0293836.22E"), 290.34, 15, map)
    // EFKU
    drawExtendedCenterline(convertCoordinatesToDecimal("630105.09N 0274715.52E"), 157.17, 15, map)
    drawExtendedCenterline(convertCoordinatesToDecimal("625941.74N 0274832.67E"), 337.19, 15, map)
    // EFJY
    drawExtendedCenterline(convertCoordinatesToDecimal("622427.18N 0253936.50E"), 133.93, 20, map)
    drawExtendedCenterline(convertCoordinatesToDecimal("622328.87N 0254146.90E"), 313.96, 20, map)
    // EFHA
    drawExtendedCenterline(convertCoordinatesToDecimal("615118.92N 0244543.07E"), 86.08, 15, map)
    drawExtendedCenterline(convertCoordinatesToDecimal("615124.63N 0244840.54E"), 266.13, 15, map)
    // EFSI
    drawExtendedCenterline(convertCoordinatesToDecimal("624149.61N 0224918.82E"), 136.18, 15, map)
    drawExtendedCenterline(convertCoordinatesToDecimal("624103.01N 0225056.13E"), 316.20, 15, map)
    // EFVA
    drawExtendedCenterline(convertCoordinatesToDecimal("630343.42N 0214516.16E"), 163.16, 15, map)
    drawExtendedCenterline(convertCoordinatesToDecimal("630226.15N 0214607.67E"), 343.17, 15, map)
    // EFKK
    drawExtendedCenterline(convertCoordinatesToDecimal("634228.25N 0230817.37E"), 10.64, 15, map)
    drawExtendedCenterline(convertCoordinatesToDecimal("634347.59N 0230851.00E"), 190.65, 15, map)
    // EFKI
    drawExtendedCenterline(convertCoordinatesToDecimal("641700.41N 0274001.33E"), 79.58, 15, map)
    drawExtendedCenterline(convertCoordinatesToDecimal("641714.98N 0274304.07E"), 259.63, 15, map)
    // EFOU
    drawExtendedCenterline(convertCoordinatesToDecimal("645609.01N 0251954.82E"), 120.98, 15, map)
    drawExtendedCenterline(convertCoordinatesToDecimal("645527.41N 0252238.01E"), 301.02, 15, map)
    // EFKE
    drawExtendedCenterline(convertCoordinatesToDecimal("654734.86N 0243509.64E"), 187.52, 15, map)
    drawExtendedCenterline(convertCoordinatesToDecimal("654614.74N 0243443.90E"), 7.51, 15, map)
    // EFKS
    drawExtendedCenterline(convertCoordinatesToDecimal("655941.33N 0291311.05E"), 132.18, 15, map)
    drawExtendedCenterline(convertCoordinatesToDecimal("655847.99N 0291535.48E"), 312.21, 15, map)
    // EFRO
    drawExtendedCenterline(convertCoordinatesToDecimal("663314.76N 0254835.95E"), 37.17, 15, map)
    drawExtendedCenterline(convertCoordinatesToDecimal("663431.96N 0255103.07E"), 217.21, 15, map)
    // EFKT
    drawExtendedCenterline(convertCoordinatesToDecimal("674242.85N 0245023.15E"), 166.10, 15, map)
    drawExtendedCenterline(convertCoordinatesToDecimal("674124.51N 0245114.16E"), 346.12, 15, map)
    // EFET
    drawExtendedCenterline(convertCoordinatesToDecimal("682118.76N 0232437.79E"), 34.68, 15, map)
    drawExtendedCenterline(convertCoordinatesToDecimal("682211.86N 0232617.37E"), 214.70, 15, map)
    // EFIV
    drawExtendedCenterline(convertCoordinatesToDecimal("683558.66N 0272258.40E"), 46.99, 15, map)
    drawExtendedCenterline(convertCoordinatesToDecimal("683653.66N 0272540.02E"), 227.03, 15, map)
    // EETN
    drawExtendedCenterline(convertCoordinatesToDecimal("592447.97N 0244836.55E"), 90.27, 20, map)
    drawExtendedCenterline(convertCoordinatesToDecimal("592447.42N 0245201.95E"), 270.32, 20, map)
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
    mainLines.push(mainLine);

    // Draw cross lines at each mile
    for (let i = 0.5; i < distanceNM; i++) {
        const crossLineLength = ((i + 0.5) % 5 === 0) ? 40 : 15; // Longer cross line at every 5th mile
        const milePoint = calculateEndPoint(startCoord, heading, i); // Mile point along the main line
        const nextMilePoint = calculateEndPoint(startCoord, heading, i + 1); // Next mile point along the main line
        const midPoint = [(milePoint[0] + nextMilePoint[0]) / 2, (milePoint[1] + nextMilePoint[1]) / 2]; // Midpoint between two consecutive miles
        const crossLineStart = calculateEndPoint(midPoint, heading + 90, crossLineLength / 60); // Perpendicular to main line
        const crossLineEnd = calculateEndPoint(midPoint, heading + 90, -crossLineLength / 60); // Perpendicular to main line
        const crossLine = L.polyline([crossLineStart, crossLineEnd], { color: '#8a8a8a', weight: 1 }).addTo(map);

        crossLines.push(crossLine);
    }   
}