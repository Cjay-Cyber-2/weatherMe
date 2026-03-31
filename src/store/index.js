import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "./weatherSlice";

const WEATHER_STORAGE_KEY = "weatherme.weather";

function normalizeHistory(history) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history.map((item, index) => ({
    ...item,
    id: item.id || `${item.name || "weather"}-${item.timestamp || index}`,
  }));
}

function loadWeatherState() {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    const storedWeather = window.localStorage.getItem(WEATHER_STORAGE_KEY);

    if (!storedWeather) {
      return undefined;
    }

    const parsedWeather = JSON.parse(storedWeather);

    return {
      weather: {
        currentWeather: parsedWeather.currentWeather
          ? {
              ...parsedWeather.currentWeather,
              id:
                parsedWeather.currentWeather.id ||
                `${parsedWeather.currentWeather.name || "weather"}-${
                  parsedWeather.currentWeather.timestamp || "current"
                }`,
            }
          : null,
        history: normalizeHistory(parsedWeather.history),
        loading: false,
        error: null,
      },
    };
  } catch {
    return undefined;
  }
}

function saveWeatherState(state) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    WEATHER_STORAGE_KEY,
    JSON.stringify({
      currentWeather: state.weather.currentWeather,
      history: state.weather.history,
    })
  );
}

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
  },
  preloadedState: loadWeatherState(),
});

if (typeof window !== "undefined") {
  store.subscribe(() => {
    saveWeatherState(store.getState());
  });
}

export { WEATHER_STORAGE_KEY };
