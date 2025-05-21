import { useEffect, useState } from "react";
import Head from "next/head";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";



const cities = ["berlin", "london", "paris", "newyork", "tokyo"];

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [hourlyData, setHourlyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("berlin");
  const [unit, setUnit] = useState("C");

  const fetchWeather = async (city) => {
    setLoading(true);
    const res = await fetch(`/api/weather/${city}`);
    const data = await res.json();
    setWeather(data);
    setLoading(false);
  };

  const fetchWeatherdata = async (city) => {
    setLoading(true);
    const res = await fetch(`/api/forecast/${city}`);
    const data2 = await res.json();
    setHourlyData(data2);
    setLoading(false);
  };

  useEffect(() => {
    fetchWeather(selectedCity);
    fetchWeatherdata(selectedCity);
  }, [selectedCity]);

  const convertTemp = (tempC) => (unit === "C" ? tempC : (tempC * 9) / 5 + 32);

  const getDailyPrecipitationAverages = (hourlyArray) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const dayData = hourlyArray.slice(i * 24, (i + 1) * 24);
      const avg = dayData.reduce((sum, val) => sum + val, 0) / dayData.length || 0;
      days.push({ day: `Day ${i + 1}`, precipitation: Math.round(avg) });
    }
    return days;
  };

  return (
    <div>
      <Head>
        <title>Weather App</title>
        <meta name="description" content="Weather data from Open-Meteo API" />
      </Head>

      <main style={styles.main}>
        <h1 style={styles.title}>Weather Dashboard</h1>

        <div style={{ marginBottom: "1rem" }}>
          <label>Select City: </label>
          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city.charAt(0).toUpperCase() + city.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <button
            onClick={() => setUnit(unit === "C" ? "F" : "C")}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Show in {unit === "C" ? "Fahrenheit" : "Celsius"}
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : weather && hourlyData ? (
          <>
            <div style={styles.card}>
              <h1>Current Weather</h1>
              <p>🌡 Temperature: {convertTemp(weather.temperature).toFixed(1)}°{unit}</p>
              <p>
                🕒 Time:{" "}
                {new Date(weather.fullData.current.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p>🌧 Precipitation Probability: {weather.fullData.hourly.precipitation_probability[0]}%</p>
            </div>

            <h3 style={{ marginTop: "2rem" }}>Next 24-hour Forecast</h3>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyData.hourly.time.slice(0, 24).map((time, i) => ({
                time: new Date(time).getHours() + ":00",
                temp: convertTemp(hourlyData.hourly.temperature_2m[i]),
              }))}>
                <XAxis dataKey="time" />
                <YAxis unit={`°${unit}`} />
                <Tooltip />
                <Line type="monotone" dataKey="temp" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>

            <h3 style={{ marginTop: "2rem" }}>7-Day Avg Precipitation Probability</h3>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getDailyPrecipitationAverages(weather.fullData.hourly.precipitation_probability)}>
                <XAxis dataKey="day" />
                <YAxis unit="%" />
                <Tooltip />
                <Line type="monotone" dataKey="precipitation" stroke="#00b894" />
              </LineChart>
            </ResponsiveContainer>


            <div style={{ marginTop: "2rem" }}>
  <a
    href={`/activity/${selectedCity}`}
    style={{
      padding: "0.5rem 1rem",
      backgroundColor: "#00b894",
      color: "#fff",
      borderRadius: "6px",
      textDecoration: "none",
    }}
  >
    Show Outdoor Activity Recommendations
  </a>
</div>

          </>
        ) : (
          <p>Failed to load weather data.</p>
        )}
      </main>
    </div>
  );
}

const styles = {
  main: {
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#ffffff",
    color: "#000000",
    minHeight: "100vh",
    width: "100%",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "1rem",
  },
  card: {
    border: "1px solid #ddd",
    padding: "1.5rem",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    color: "#000000",
    width: "300px",
    textAlign: "center",
    boxShadow: "0 0 10px rgba(0,0,0,0.05)",
  },
};
