import { weatherEvents } from "../data/weather";

export const generateForecast = () => {
  const forecast = [];
  for (let i = 0; i < 5; i++) {
    forecast.push(weatherEvents[Math.floor(Math.random() * weatherEvents.length)]);
  }
  return forecast;
};
