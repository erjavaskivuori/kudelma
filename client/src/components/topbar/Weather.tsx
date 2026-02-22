import { useState } from 'react';
import {
  WiCloud, WiCloudy, WiDayCloudy, WiDaySunny,
  WiFog, WiNightClear, WiNightCloudy,
  WiRain, WiShowers, WiSnow, WiSunrise, WiSunset, WiThunderstorm
} from "react-icons/wi";
import type { WeatherData } from '../../../../shared/types/weather';

type WeatherCompactProps = {
  weather: WeatherData;
};

const WeatherCompact = ({ weather }: WeatherCompactProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const sunIsUp = () => {
    const parseTime = (timeStr: string) => {
      const [hours, minutes, seconds] = timeStr.split('.').map(Number);
      return hours * 3600 + minutes * 60 + seconds;
    };
    const now = new Date();
    const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    return currentSeconds >= parseTime(weather.sunrise)
      && currentSeconds <= parseTime(weather.sunset);
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split('.');
    return `${hours}:${minutes}`;
  };

  const getIcon = (id: number | undefined, size: number) => {
    if (!id) return null;
    if (id >= 200 && id < 300) return <WiThunderstorm size={size} />;
    if (id >= 300 && id < 400) return <WiShowers size={size} />;
    if (id >= 500 && id < 600) return <WiRain size={size} />;
    if (id >= 600 && id < 700) return <WiSnow size={size} />;
    if (id >= 700 && id < 800) return <WiFog size={size} />;
    if (id === 800) return sunIsUp() ? <WiDaySunny size={size} /> : <WiNightClear size={size} />;
    if (id === 801) return sunIsUp() ? <WiDayCloudy size={size} /> : <WiNightCloudy size={size} />;
    if (id === 802) return <WiCloudy size={size} />;
    if (id === 803 || id === 804) return <WiCloud size={size} />;
    return null;
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      {/* Compact — always visible */}
      <div className="flex items-center gap-2 text-white cursor-default">
        {getIcon(weather.id, 24)}
        <span className="text-sm font-medium">{weather.temperature}°C</span>
        <span className="text-xs text-gray-200">{weather.city}</span>
      </div>

      {/* Expanded — overlays the compact info */}
      {showDetails && (
        <div className="absolute -top-3 -left-3 p-4 rounded-xl shadow-xl z-50 min-w-72
          animate-weather-in bg-[var(--color-popup)] border border-[var(--color-popup-border)]"
        >
          {/* Top row: header + icon/temp side by side */}
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-sm text-white/60">
                {weather.city}
              </p>
              <p className="text-white font-medium mt-0.5">
                {weather.main}
              </p>
            </div>
            <div className="flex items-center gap-2 text-white">
              {getIcon(weather.id, 48)}
              <span className="text-2xl font-bold">{weather.temperature}°C</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[var(--color-popup-border)] my-3" />

          {/* Bottom row: sunrise & sunset horizontal */}
          <div className="flex justify-around text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <WiSunrise size={22} />
              <div>
                <span className="text-white/50">Sunrise </span>
                <span>{formatTime(weather.sunrise)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <WiSunset size={22} />
              <div>
                <span className="text-white/50">Sunset </span>
                <span>{formatTime(weather.sunset)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCompact;
