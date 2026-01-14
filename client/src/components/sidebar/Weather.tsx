import {
  WiCloud,
  WiCloudy,
  WiDayCloudy,
  WiDaySunny,
  WiFog,
  WiNightClear,
  WiNightCloudy,
  WiRain,
  WiShowers,
  WiSnow,
  WiSunrise,
  WiSunset,
  WiThunderstorm
} from "react-icons/wi";
import type { WeatherData } from '../../../../shared/types/weather';

interface WeatherProps {
  weather: WeatherData;
}

const Weather = ({ weather }: WeatherProps) => {
  console.log(weather);

  const sunIsUp = () => {
    const parseTime = (timeStr: string) => {
      const [hours, minutes, seconds] = timeStr.split('.').map(Number);
      return hours * 3600 + minutes * 60 + seconds;
    };

    const now = new Date();
    const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    const sunriseSeconds = parseTime(weather.sunrise);
    const sunsetSeconds = parseTime(weather.sunset);

    return currentSeconds >= sunriseSeconds && currentSeconds <= sunsetSeconds;
  };

  const getWeatherIcon = (id: number | undefined) => {
    if (!id) {
      return null;
    } else if (id >= 200 && id < 300) {
      return <WiThunderstorm size={48} />;
    } else if (id >= 300 && id < 400) {
      return <WiShowers size={48} />;
    } else if (id >= 500 && id < 600) {
      return <WiRain size={48} />;
    } else if (id >= 600 && id < 700) {
      return <WiSnow size={48} />;
    } else if (id >= 700 && id < 800) {
      return <WiFog size={60} />;
    } else if (id === 800 && sunIsUp()) {
      return <WiDaySunny size={48} />;
    } else if (id === 800 && !sunIsUp()) {
      return <WiNightClear size={48} />;
    } else if (id === 801 && sunIsUp()) {
      return <WiDayCloudy size={48} />;
    } else if (id === 801 && !sunIsUp()) {
      return <WiNightCloudy size={48} />;
    } else if (id === 802) {
      return <WiCloudy size={60} />;
    } else if (id === 803 || id === 804) {
      return <WiCloud size={80} />;
    }
    return null;
  };

  return (
  <div className="flex flex-col text-white">
    <div className="flex gap-5 items-center">
      <div className="flex flex-col">
        <p className='text-2xl font-bold'>{weather.city}</p>
        <p className="font-bold">{weather.temperature}°C</p>
      </div>
      {getWeatherIcon(weather.id)}
    </div>
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <WiSunrise size={24} />
        <p>{weather.sunrise}</p>
      </div>
      <div className="flex items-center gap-1">
        <WiSunset size={24} />
        <p>{weather.sunset}</p>
      </div>
    </div>
  </div>
);
};

export default Weather;
