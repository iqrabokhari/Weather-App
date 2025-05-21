

const cityCoordinates = {
  berlin: { lat: 52.52, lon: 13.41 },
  london: { lat: 51.51, lon: -0.13 },
  paris: { lat: 48.85, lon: 2.35 },
  newyork: { lat: 40.71, lon: -74.01 },
  tokyo: { lat: 35.68, lon: 139.69 },
};

export default async function handler(req, res) {
  const { city } = req.query;
  const coords = cityCoordinates[city?.toLowerCase()];

  if (!coords) {
    return res.status(400).json({ error: "City not supported" });
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weather_code&hourly=temperature_2m,precipitation_probability,wind_speed_10m&timezone=auto`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json({
      temperature: data.current?.temperature_2m,
      weatherCode: data.current?.weather_code,
      fullData: data,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
}
