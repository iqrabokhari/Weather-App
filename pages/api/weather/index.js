// pages/api/weather/index.js

export default async function handler(req, res) {
  const lat = 52.52;
  const lon = 13.41;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&hourly=temperature_2m,precipitation_probability,wind_speed_10m`;

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
