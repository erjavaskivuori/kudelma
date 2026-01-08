export type Coordinates = {
  lon: number;
  lat: number;
}

export interface WeatherData {
  city: string;
  main: string | undefined;
  temperature: number;
  cloudiness: number;
  sunrise: string;
  sunset: string;
}
