import { Layout } from '@/components/Layout';

const Weather = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.9 5.002 5.002 0 00-9.8 0A4.001 4.001 0 003 15z"/>
            </svg>
            Weather Intelligence
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">Weather Details</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Real-time weather monitoring and agricultural insights</p>
        </div>

        {/* Current Weather */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-2xl font-bold">Current Weather</h2>
                  <p className="text-muted-foreground">Delhi, India</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-primary">28°C</div>
                  <p className="text-sm text-muted-foreground">Feels like 32°C</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <svg className="h-16 w-16 text-yellow-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                  </svg>
                  <p className="font-medium">Sunny</p>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Humidity</p>
                    <p className="text-lg font-semibold">65%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Wind Speed</p>
                    <p className="text-lg font-semibold">12 km/h</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Pressure</p>
                    <p className="text-lg font-semibold">1013 hPa</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Visibility</p>
                    <p className="text-lg font-semibold">10 km</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Air Quality */}
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Air Quality
              </h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">42</div>
                <p className="text-sm text-green-700">Good</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>PM2.5</span>
                    <span>15 µg/m³</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>PM10</span>
                    <span>25 µg/m³</span>
                  </div>
                </div>
              </div>
            </div>

            {/* UV Index */}
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <svg className="h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
                UV Index
              </h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">7</div>
                <p className="text-sm text-yellow-700">High</p>
                <p className="text-xs text-muted-foreground mt-2">Use sunscreen</p>
              </div>
            </div>
          </div>
        </div>

        {/* 7-Day Forecast */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-8 mb-12">
          <h2 className="font-display text-2xl font-bold mb-6">7-Day Forecast</h2>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {[
              { day: 'Today', temp: '28°C', condition: 'Sunny', icon: 'sun' },
              { day: 'Tomorrow', temp: '30°C', condition: 'Sunny', icon: 'sun' },
              { day: 'Wed', temp: '27°C', condition: 'Partly Cloudy', icon: 'cloud-sun' },
              { day: 'Thu', temp: '26°C', condition: 'Rainy', icon: 'cloud-rain' },
              { day: 'Fri', temp: '29°C', condition: 'Sunny', icon: 'sun' },
              { day: 'Sat', temp: '31°C', condition: 'Sunny', icon: 'sun' },
              { day: 'Sun', temp: '28°C', condition: 'Cloudy', icon: 'cloud' },
            ].map((forecast, index) => (
              <div key={index} className="text-center p-4 rounded-lg bg-gray-50">
                <p className="font-medium text-sm mb-2">{forecast.day}</p>
                <svg className="h-8 w-8 mx-auto mb-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {forecast.icon === 'sun' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>}
                  {forecast.icon === 'cloud-sun' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0zM3 15a4 4 0 004 4h9a5 5 0 10-.1-9.9 5.002 5.002 0 00-9.8 0A4.001 4.001 0 003 15z"/>}
                  {forecast.icon === 'cloud-rain' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.9 5.002 5.002 0 00-9.8 0A4.001 4.001 0 003 15zM12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>}
                  {forecast.icon === 'cloud' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.9 5.002 5.002 0 00-9.8 0A4.001 4.001 0 003 15z"/>}
                </svg>
                <p className="text-lg font-bold mb-1">{forecast.temp}</p>
                <p className="text-xs text-muted-foreground">{forecast.condition}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Agricultural Insights */}
        <div className="bg-gradient-to-br from-primary to-green-400 rounded-2xl p-8 text-white">
          <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-3">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
            Agricultural Weather Insights
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <h3 className="font-semibold mb-3">🌱 Crop Recommendations</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li>• Ideal conditions for wheat sowing</li>
                <li>• Monitor soil moisture levels</li>
                <li>• Prepare for upcoming rainfall</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <h3 className="font-semibold mb-3">⚠️ Weather Alerts</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li>• Light rain expected in 3 days</li>
                <li>• Temperature suitable for pest control</li>
                <li>• Good window for fertilizer application</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Weather;