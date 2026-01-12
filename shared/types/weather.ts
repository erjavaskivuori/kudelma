export type Coordinates = {
  lon: number;
  lat: number;
}

export interface WeatherData {
  city: string;
  id: number | undefined;
  main: string | undefined;
  temperature: number;
  cloudiness: number;
  sunrise: string;
  sunset: string;
}
