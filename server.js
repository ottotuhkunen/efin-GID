const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });

app.get('/api/finland.kml', async (req, res) => {
    try {
        const kmlResponse = await fetch('https://flyk.com/api/finland.kml');
        const kmlText = await kmlResponse.text();
        res.send(kmlText);
    } catch (error) {
        console.error('Error fetching KML:', error);
        res.status(500).send('Error fetching KML');
    }
});

// load SIGMETs
app.get('/sigmet', async (req, res) => {
    try {
      const response = await fetch('https://aviationweather.gov/api/data/isigmet?format=json');
      const data = await response.text();
      res.send(data);
    } catch (error) {
      console.error('Error fetching SIGMET data:', error);
      res.status(500).send('Internal server error');
    }
});

// load Flow Measures
app.get('/flow', async (req, res) => {
    try {
      const response = await fetch('https://ecfmp.vatsim.net/api/v1/flow-measure?active=1&notified=1');
      const data = await response.text();
      res.send(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Internal server error');
    }
});

// METAR and ATIS fetching
app.get('/airport/:icao', async (req, res) => {
    const icao = req.params.icao.toUpperCase();
    // URLs for METAR and VATSIM data
    const metarUrl = `https://aviationweather.gov/api/data/metar?ids=${icao}&format=json`;
    const vatsimUrl = `https://data.vatsim.net/v3/vatsim-data.json`;

    try {
        // Fetch METAR and VATSIM data
        const [metarResponse, vatsimResponse] = await Promise.all([
            fetch(metarUrl),
            fetch(vatsimUrl)
        ]);
        
        const metarData = await metarResponse.json();
        const vatsimData = await vatsimResponse.json();

        let metar = null, qnh = null, textAtis = null, atisCode = null;

        if (metarData.length > 0) {
            metar = metarData[0].rawOb;
            qnh = metarData[0].altim;
        }

        // Find the ATIS data for the ICAO
        const atis = vatsimData.atis.find(item => item.callsign === `${icao}_ATIS`);
        if (atis) {
            textAtis = atis.text_atis.join(" ");
            atisCode = atis.atis_code;
        }

        // Send combined METAR and ATIS data
        res.json({ metar, qnh, textAtis, atisCode });
    } catch (error) {
        console.error("Error fetching airport data:", error);
        res.status(500).send('Error fetching airport data');
    }
});

// aircraft fetching
app.get('/traffic', async (req, res) => {
  try {
      const response = await fetch('https://data.vatsim.net/v3/vatsim-data.json');
      const data = await response.json();

      const finlandBounds = {
          north: 70.09,
          south: 59.81,
          west: 20.58,
          east: 31.59
      };

      const aircraftInFinland = data.pilots.filter(pilot => {
          const isInFinland = pilot.latitude <= finlandBounds.north && pilot.latitude >= finlandBounds.south &&
                              pilot.longitude >= finlandBounds.west && pilot.longitude <= finlandBounds.east;
          const isArrivingInFinland = pilot.flight_plan && pilot.flight_plan.arrival.startsWith("EF");
          return isInFinland || isArrivingInFinland;
      }).map(pilot => ({
          callsign: pilot.callsign,
          latitude: pilot.latitude,
          longitude: pilot.longitude,
          altitude: pilot.altitude,
          groundspeed: pilot.groundspeed,
          heading: pilot.heading,
          pic: pilot.name,
          flight_plan: pilot.flight_plan ? {
              aircraft_short: pilot.flight_plan.aircraft_short || 'XXXX',
              arrival: pilot.flight_plan.arrival || 'XXXX',
              departure: pilot.flight_plan.departure || 'XXXX',
              frules: pilot.flight_plan.flight_rules || 'FRUL',
              fplAcft: pilot.flight_plan.aircraft || 'ATYP/EQUIP',
              depTime: pilot.flight_plan.deptime || 'EOBT',
              speed: pilot.flight_plan.cruise_tas || 'TAS',
              rfl: pilot.flight_plan.altitude || 'RFL',
              speed: pilot.flight_plan.cruise_tas || 'TAS',
              route: pilot.flight_plan.route || 'ROUTE',
              eet: pilot.flight_plan.enroute_time || 'EET',
              altn: pilot.flight_plan.alternate || '',
              rmk: pilot.flight_plan.remarks || 'FPL18',
          } : { aircraft_short: 'XXXX', arrival: 'XXXX' }
      }));

      res.json(aircraftInFinland);
  } catch (error) {
      console.error('Error fetching VATSIM data:', error);
      res.status(500).send('Error fetching VATSIM data');
  }
});