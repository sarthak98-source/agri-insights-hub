import { Layout } from '@/components/Layout';
import { useEffect, useState } from 'react';
import {
  getCurrentWeather,
  get7DayForecast,
} from '@/services/weatherService';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const cities = [
  "Ahmednagar",
  "Akola",
  "Amravati",
  "Aurangabad",
  "Beed",
  "Bhandara",
  "Buldhana",
  "Chandrapur",
  "Dhule",
  "Gadchiroli",
  "Gondia",
  "Hingoli",
  "Jalgaon",
  "Jalna",
  "Kolhapur",
  "Latur",
  "Mumbai City",
  "Mumbai Suburban",
  "Nagpur",
  "Nanded",
  "Nandurbar",
  "Nashik",
  "Osmanabad",
  "Palghar",
  "Parbhani",
  "Pune",
  "Raigad",
  "Ratnagiri",
  "Sangli",
  "Satara",
  "Sindhudurg",
  "Solapur",
  "Thane",
  "Wardha",
  "Washim",
  "Yavatmal"

];

const Weather = () => {
  const [city, setCity] = useState('Amravati');
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError('');

      // 🌤 Current weather
      const weatherData = await getCurrentWeather(city);
      setWeather(weatherData);

      // 📅 5-day forecast (free API)
      const forecastList = await get7DayForecast(city);
      setForecast(forecastList.slice(0, 5));
    } catch (err) {
      console.error(err);
      setError('Failed to load weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [city]);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-20">Loading weather data...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-20 text-red-500">{error}</div>
      </Layout>
    );
  }

  // 📈 Chart Data
  const chartData = forecast.map((day) => ({
    day: new Date(day.dt * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
    }),
    temp: Math.round(day.main.temp),
  }));

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Weather Details</h1>
          <p className="text-muted-foreground mb-6">
            Real-time weather monitoring and 5-day analysis
          </p>

          {/* Centered Dropdown */}
          {/* <div className="flex justify-center ">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border rounded px-6 py-2 text-lg"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div> */}

<div className="flex justify-center">
  <div className="relative transition-transform duration-300 ease-out focus-within:scale-[1.03]">
    <select
      value={city}
      onChange={(e) => setCity(e.target.value)}
      className="
        appearance-none
        px-9 py-3
        text-lg font-semibold
        rounded-2xl
        bg-gradient-to-br from-white to-gray-100
        border border-gray-300/50
        shadow-lg
        transition-all duration-300 ease-out
        hover:shadow-xl
        focus:outline-none focus:ring-4 focus:ring-primary/30
        focus:border-primary
        cursor-pointer
      "
    >
      {cities.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>

    {/* Arrow */}
    <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-gray-600">
      ⌄
    </div>
  </div>
</div>




        </div>

        {/* Current Weather */}
        <div className="bg-white rounded-2xl shadow border p-8 mb-12">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Current Weather</h2>
              <p className="text-muted-foreground">
                {weather.name}, {weather.sys.country}
              </p>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold text-primary">
                {Math.round(weather.main.temp)}°C
              </div>
              <p className="text-sm">
                Feels like {Math.round(weather.main.feels_like)}°C
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="icon"
            />

            <div className="grid grid-cols-2 gap-4 flex-1">
              <div>
                <p className="text-sm text-muted-foreground">Humidity</p>
                <p className="font-semibold">{weather.main.humidity}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Wind</p>
                <p className="font-semibold">{weather.wind.speed} km/h</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pressure</p>
                <p className="font-semibold">{weather.main.pressure} hPa</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Visibility</p>
                <p className="font-semibold">
                  {(weather.visibility / 1000).toFixed(1)} km
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div className="bg-white rounded-2xl shadow border p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">5-Day Forecast</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {forecast.map((day, index) => (
              <div
                key={index}
                className="text-center p-4 rounded-lg bg-gray-50"
              >
                <p className="font-medium text-sm mb-1">
                  {new Date(day.dt * 1000).toLocaleDateString('en-US', {
                    weekday: 'short',
                  })}
                </p>

                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt="icon"
                  className="mx-auto"
                />

                <p className="text-lg font-bold">
                  {Math.round(day.main.temp)}°C
                </p>

                <p className="text-xs text-muted-foreground capitalize">
                  {day.weather[0].description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 📈 Temperature Line Chart */}
        <div className="bg-white rounded-2xl shadow border p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">
            Temperature Analysis
          </h2>

          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis
                  domain={['dataMin - 2', 'dataMax + 2']}
                  tickFormatter={(v) => `${v}°`}
                />
                <Tooltip formatter={(v) => `${v}°C`} />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agricultural Insights */}
        <div className="bg-gradient-to-br from-primary to-green-400 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6">
            Agricultural Weather Insights
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="font-semibold mb-3">🌱 Crop Recommendations</h3>
              <ul className="space-y-2 text-sm">
                <li>• Suitable temperature for farming</li>
                <li>• Monitor soil moisture</li>
                <li>• Plan irrigation accordingly</li>
              </ul>
            </div>

            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="font-semibold mb-3">⚠️ Weather Alerts</h3>
              <ul className="space-y-2 text-sm">
                <li>• Check rainfall before spraying</li>
                <li>• Wind speed safe for operations</li>
                <li>• Stable weather window</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Weather;
