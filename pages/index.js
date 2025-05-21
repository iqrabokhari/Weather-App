import { useEffect, useState } from "react";
import Head from "next/head";

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/weather")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        console.log(data.fullData);
        setWeather(data);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Head>
        <title>Weather App</title>
        <meta name="description" content="Weather data from Open-Meteo API" />
      </Head>

      <main style={styles.main}>
        <h1 style={styles.title}>Current Weather</h1>

        {loading ? (
          <p>Loading...</p>
        ) : weather ? (
          <div style={styles.card}>
            <p>🌡 Temperature: {weather.temperature}°C</p>
            <p>
              🕒 Time:{" "}
              {new Date(weather.fulldata).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
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
    backgroundColor: "#ffffff", // white background
    color: "#000000", // black text
    minHeight: "100vh", // full screen height
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
    backgroundColor: "#ffffff", // white card background
    color: "#000000", // black text in card
    width: "300px",
    textAlign: "center",
    boxShadow: "0 0 10px rgba(0,0,0,0.05)",
  },
};
