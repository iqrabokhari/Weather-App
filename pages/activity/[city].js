import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';


const ITEMS_PER_PAGE = 6;

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
    <div className="p-6 max-w-3xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">Weather Forecast (Next 24 Hours)</h1>
      <Link href="/" className="text-blue-600 underline mb-6 block">← Back to Home</Link>

      {loading ? (
        <p>Loading forecast data...</p>
      ) : !data?.fullData?.hourly ? (
        <p>No data available.</p>
      ) : (
        <>
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 justify-items-center">
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
          className="w-full max-w-sm border p-4 rounded-xl shadow-md bg-gradient-to-br from-white to-gray-100 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="text-gray-800 mb-1">
            <strong>Time:</strong> {new Date(time).toLocaleString()}
          </div>
          <div className="text-blue-800">
            <strong>Temperature:</strong> {temp}°C
          </div>
          <div className="text-purple-800">
            <strong>Precipitation Chance:</strong> {precip}%
          </div>
          <div className="text-teal-800">
            <strong>Wind Speed:</strong> {wind} km/h
          </div>
          <div
            className={`font-semibold mt-2 ${
              isGood ? 'text-green-600' : 'text-red-600'
            }`}
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



          <div className="flex justify-between items-center">
            <button
              onClick={() => handlePageChange('prev')}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange('next')}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
