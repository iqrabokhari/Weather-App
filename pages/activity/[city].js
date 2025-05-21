import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const ITEMS_PER_PAGE = 5;

export default function ActivityRecommendations() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchForecast = async () => {
      const { city } = router.query;
      if (!city) return;

      try {
        const res = await fetch(`/api/weather/${encodeURIComponent(city)}`);
        if (!res.ok) throw new Error('Failed to fetch forecast data');
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('Error fetching forecast:', error);
      } finally {
        setLoading(false);
      }
    };

    if (router.isReady) {
      fetchForecast();
    }
  }, [router.isReady, router.query.city]);

  const totalItems = 24;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => {
      if (direction === 'next' && prev < totalPages) return prev + 1;
      if (direction === 'prev' && prev > 1) return prev - 1;
      return prev;
    });
  };

  return (
    <div
      style={{
        padding: '24px',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: 'sans-serif',
      }}
    >
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
        Weather Forecast (Next 24 Hours)
      </h1>
      <Link
        href="/"
        style={{
          color: '#2563eb',
          textDecoration: 'underline',
          display: 'block',
          marginBottom: '24px',
        }}
      >
        ← Back to Home
      </Link>

      {loading ? (
        <p>Loading forecast data...</p>
      ) : !data?.fullData?.hourly ? (
        <p>No data available.</p>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '24px' }}>
            {Array.from({ length: totalItems }).slice(startIndex, endIndex).map((_, i) => {
              const index = startIndex + i;
              const time = data.fullData.hourly.time?.[index];
              const temp = data.fullData.hourly.temperature_2m?.[index];
              const precip = data.fullData.hourly.precipitation_probability?.[index];
              const wind = data.fullData.hourly.wind_speed_10m?.[index];

              if (time && temp !== undefined && precip !== undefined) {
                const isGood = temp >= 15 && temp <= 25 && precip < 20 && wind < 15;

                return (
                  <div
                    key={index}
                    style={{
                      width: '100%',
                      maxWidth: '500px',
                      border: '1px solid #ccc',
                      padding: '16px',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      background: 'linear-gradient(to bottom right, #fff, #f3f4f6)',
                      transition: 'box-shadow 0.3s ease',
                    }}
                  >
                    <div style={{ color: '#374151', marginBottom: '8px' }}>
                      <strong>Time:</strong> {new Date(time).toLocaleString()}
                    </div>
                    <div style={{ color: '#1e3a8a' }}>
                      <strong>Temperature:</strong> {temp}°C
                    </div>
                    <div style={{ color: '#6b21a8' }}>
                      <strong>Precipitation Chance:</strong> {precip}%
                    </div>
                    <div style={{ color: '#0f766e' }}>
                      <strong>Wind Speed:</strong> {wind} km/h
                    </div>
                    <div
                      style={{
                        fontWeight: '600',
                        marginTop: '8px',
                        color: isGood ? '#16a34a' : '#dc2626',
                      }}
                    >
                      {isGood
                        ? 'This time is good for outdoor activity'
                        : 'Not a good time for outdoor activities'}
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '16px',
            }}
          >
            <button
              onClick={() => handlePageChange('prev')}
              disabled={currentPage === 1}
              style={{
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: '#fff',
                borderRadius: '6px',
                border: 'none',
                opacity: currentPage === 1 ? 0.5 : 1,
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              Previous
            </button>
            <span style={{ color: '#374151', fontWeight: '500' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange('next')}
              disabled={currentPage === totalPages}
              style={{
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: '#fff',
                borderRadius: '6px',
                border: 'none',
                opacity: currentPage === totalPages ? 0.5 : 1,
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
