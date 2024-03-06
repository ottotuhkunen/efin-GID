var stands = [
    // EFOU
    { name: "5", coords: [dmsToDecimal(64, 55, 48.06, "N"), dmsToDecimal(25, 22, 4.81, "E")] },
    { name: "6", coords: [dmsToDecimal(64, 55, 47.31, "N"), dmsToDecimal(25, 22, 2.39, "E")] },
    { name: "6B", coords: [dmsToDecimal(64, 55, 45.91, "N"), dmsToDecimal(25, 22, 1.25, "E")] },
    { name: "7", coords: [dmsToDecimal(64, 55, 46.51, "N"), dmsToDecimal(25, 21, 59.85, "E")] },
    { name: "8", coords: [dmsToDecimal(64, 55, 46.01, "N"), dmsToDecimal(25, 22, 2.94, "E")] },
    { name: "9", coords: [dmsToDecimal(64, 55, 44.72, "N"), dmsToDecimal(25, 22, 9.63, "E")] },
    { name: "10", coords: [dmsToDecimal(64, 55, 43.66, "N"), dmsToDecimal(25, 22, 13.8, "E")] },
    { name: "11", coords: [dmsToDecimal(64, 55, 42.59, "N"), dmsToDecimal(25, 22, 17.96, "E")] },
    { name: "12A", coords: [dmsToDecimal(64, 55, 41.36, "N"), dmsToDecimal(25, 22, 21.43, "E")] },
    { name: "12B", coords: [dmsToDecimal(64, 55, 41.50, "N"), dmsToDecimal(25, 22, 22.02, "E")] },
    { name: "13", coords: [dmsToDecimal(64, 55, 41.03, "N"), dmsToDecimal(25, 22, 25.06, "E")] },
    { name: "13B", coords: [dmsToDecimal(64, 55, 40.51, "N"), dmsToDecimal(25, 22, 24.80, "E")] },
    { name: "14", coords: [dmsToDecimal(64, 55, 40.35, "N"), dmsToDecimal(25, 22, 28.81, "E")] },
    { name: "15", coords: [dmsToDecimal(64, 55, 39.52, "N"), dmsToDecimal(25, 22, 31.96, "E")] },
    { name: "15B", coords: [dmsToDecimal(64, 55, 38.98, "N"), dmsToDecimal(25, 22, 31.44, "E")] },
    { name: "16", coords: [dmsToDecimal(64, 55, 38.80, "N"), dmsToDecimal(25, 22, 36.55, "E")] },
    // EFTU
    { name: "1", coords: [dmsToDecimal(60, 30, 46.43, "N"), dmsToDecimal(22, 16, 33.09, "E")] },
    { name: "2", coords: [dmsToDecimal(60, 30, 46.07, "N"), dmsToDecimal(22, 16, 30.71, "E")] },
    { name: "3", coords: [dmsToDecimal(60, 30, 45.51, "N"), dmsToDecimal(22, 16, 27.54, "E")] },
    { name: "3B", coords: [dmsToDecimal(60, 30, 43.91, "N"), dmsToDecimal(22, 16, 25.04, "E")] },
    { name: "4", coords: [dmsToDecimal(60, 30, 43.79, "N"), dmsToDecimal(22, 16, 26.55, "E")] },
    { name: "5", coords: [dmsToDecimal(60, 30, 42.12, "N"), dmsToDecimal(22, 16, 24.50, "E")] },
    { name: "6", coords: [dmsToDecimal(60, 30, 40.38, "N"), dmsToDecimal(22, 16, 22.54, "E")] },
    { name: "7", coords: [dmsToDecimal(60, 30, 38.59, "N"), dmsToDecimal(22, 16, 20.51, "E")] },
    { name: "8", coords: [dmsToDecimal(60, 30, 44.82, "N"), dmsToDecimal(22, 16, 17.62, "E")] },
    { name: "8A", coords: [dmsToDecimal(60, 30, 45.47, "N"), dmsToDecimal(22, 16, 1.38, "E")] },
    { name: "9", coords: [dmsToDecimal(60, 30, 44.51, "N"), dmsToDecimal(22, 15, 58.66, "E")] },
    { name: "10", coords: [dmsToDecimal(60, 30, 42.22, "N"), dmsToDecimal(22, 15, 58.35, "E")] },
    { name: "11", coords: [dmsToDecimal(60, 30, 39.92, "N"), dmsToDecimal(22, 15, 58.87, "E")] },
    { name: "12", coords: [dmsToDecimal(60, 30, 39.49, "N"), dmsToDecimal(22, 15, 52.35, "E")] }
];

var taxiways = [
    // EFOU
    { name: "A", coords: [dmsToDecimal(64, 56, 13.73, "N"), dmsToDecimal(25, 20, 3.83, "E")] },
    { name: "APRON 3", coords: [dmsToDecimal(64, 55, 56.14, "N"), dmsToDecimal(25, 22, 9.24, "E")] },
    { name: "MIL APRON", coords: [dmsToDecimal(64, 55, 51.18, "N"), dmsToDecimal(25, 20, 11.27, "E")] },
    { name: "TERMINAL", coords: [dmsToDecimal(64, 55, 43.63, "N"), dmsToDecimal(25, 22, 29.90, "E")] }
];

var standIcon = L.divIcon({
    className: 'stand-icon',
    html: '<div class="stand-label"></div>',
    iconSize: [20, 14],
    iconAnchor: [10, 7]
});

var taxiwayIcon = L.divIcon({
    className: 'taxiway-icon',
    html: '<div class="taxiway-label"></div>',
    iconSize: [20, 14],
    iconAnchor: [10, 7]
});

function addStandsToMap() {
    stands.forEach(stand => {
        const standMarker = L.marker(stand.coords, {
            icon: standIcon
        }).addTo(map);
        
        standMarker.getElement().getElementsByClassName('stand-label')[0].innerHTML = stand.name;

        map.on('zoomend', function() {
            if (map.getZoom() > 14) {
                standMarker.getElement().style.display = 'block';
            } else {
                standMarker.getElement().style.display = 'none';
            }
        });
    });
    var labelsLayer = omnivore.kml('src/Labels.kml', null, L.geoJSON(null, {
        onEachFeature: function(feature, layer) {
            var labelName = feature.properties.name || "";
            var labelCoords = layer.getLatLng();
    
            var labelMarker = L.marker(labelCoords, { icon: taxiwayIcon }).addTo(map);
            labelMarker.getElement().getElementsByClassName('taxiway-label')[0].innerHTML = labelName;
    
            map.on('zoomend', function() {
                if (map.getZoom() > 13) {
                    labelMarker.getElement().style.display = 'block';
                } else {
                    labelMarker.getElement().style.display = 'none';
                }
            });
        }
    }));
}

function addGroundMaps() {

    var taxiwayLayer = omnivore.kml('src/Taxiways.kml');
    var taxiwayStyle = {
        "color": "#464C5B",
        "weight": 10,
        "opacity": 1
    };

    var runwayLayer = omnivore.kml('src/Runways.kml', null, L.geoJSON(null, {
        onEachFeature: function(feature, layer) {
            // Access description property to extract runway numbers
            var description = feature.properties.description || "";
            
            // Use regular expressions to extract runway numbers
            var startRunway = (description.match(/StartRunway: (\d+)/) || [])[1] || "";
            var endRunway = (description.match(/EndRunway: (\d+)/) || [])[1] || "";
    
            // Get the start and end coordinates of the runway line
            var coords = layer.getLatLngs();
            var startCoord = coords[0];
            var endCoord = coords[coords.length - 1];
    
            // Create custom div icons for the start and end runways
            var startIcon = L.divIcon({
                className: 'runway-label-icon',
                html: '<div class="runway-label">' + startRunway + '</div>',
                iconSize: [30, 30], // Adjust icon size as needed
                iconAnchor: [15, 15] // Adjust icon anchor to center the icon
            });
    
            var endIcon = L.divIcon({
                className: 'runway-label-icon',
                html: '<div class="runway-label">' + endRunway + '</div>',
                iconSize: [30, 30], // Adjust icon size as needed
                iconAnchor: [15, 15] // Adjust icon anchor to center the icon
            });
    
            // Create markers with custom icons
            var startMarker = L.marker(startCoord, { icon: startIcon });
            var endMarker = L.marker(endCoord, { icon: endIcon });
    
            // Add markers to the map
            startMarker.addTo(map);
            endMarker.addTo(map);
        }
    }));

    var runwayStyle = {
        "color": "#000000",
        "weight": 20,
        "opacity": 1
    };

    var apronLayer = omnivore.kml('src/Aprons.kml');
    var apronStyle = {
        "color": "#31363F",
        "fillColor": "#31363F",
        "fillOpacity": 1,
        "weight": 2,
        "opacity": 1
    };

    var buildingLayer = omnivore.kml('src/Buildings.kml');
    var buildingStyle = {
        "color": "black",
        "fillColor": "black",
        "fillOpacity": 1,
        "weight": 2,
        "opacity": 1
    };

    let finlandOverlay;

    // Add event listener for zoomend event
    map.on('zoomend', function() {
        // Check the current zoom level
        if (map.getZoom() > 13) {
            // Show the rectangle overlay
            if (!finlandOverlay) {
                finlandOverlay = L.rectangle([
                    [finlandBounds.south, finlandBounds.west],
                    [finlandBounds.north, finlandBounds.east]
                ], 
                { color: 'rgba(34, 39, 48, 1)', fillOpacity: 1 }).addTo(map).bringToBack();
            } else {
                finlandOverlay.setStyle({ color: 'rgba(34, 39, 48, 1)', fillOpacity: 1 });
            }
            // Show runways and aprons
            map.addLayer(taxiwayLayer);
            map.addLayer(runwayLayer);
            map.addLayer(apronLayer);
            map.addLayer(buildingLayer);
            apronLayer.bringToBack();
            finlandOverlay.bringToBack();
        } else {
            // Hide the rectangle overlay
            if (finlandOverlay) {
                finlandOverlay.setStyle({ color: 'rgba(34, 39, 48, 0)', fillOpacity: 0 });
            }
            // Hide runways and aprons
            map.removeLayer(taxiwayLayer);
            map.removeLayer(runwayLayer);
            map.removeLayer(apronLayer);
            map.removeLayer(buildingLayer);
        }

        taxiwayLayer.setStyle(taxiwayStyle);
        runwayLayer.setStyle(runwayStyle);
        apronLayer.setStyle(apronStyle);
        buildingLayer.setStyle(buildingStyle);
    });
}

const finlandBounds = {
    north: 71,
    south: 58,
    west: 18,
    east: 32
};
