
const cities = {
  berlin: { lat: 52.52, lon: 13.41 },
  london: { lat: 51.51, lon: -0.13 },
  paris: { lat: 48.85, lon: 2.35 },
  newyork: { lat: 40.71, lon: -74.01 },
  tokyo: { lat: 35.68, lon: 139.69 },
};



export default async function handler(req, res) {
  const { city } = req.query;
  const location = cities[city.toLowerCase()];

  if (!location) {
    return res.status(400).json({ error: "Invalid city" });
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&hourly=temperature_2m&forecast_days=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json({
      city,
      hourly: data.hourly,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch forecast" });
  }
}
