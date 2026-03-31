import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_KEY =
  process.env.NEXT_PUBLIC_WEATHER_API_KEY || "79c0b168a8555db7efa2899c05b22d7f";

export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async (city, { rejectWithValue }) => {
    try {
      const searchedAt = new Date().toISOString();
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch weather data. Check your API key or city name."
        );
      }

      const data = await response.json();

      return {
        id: `${city.toLowerCase()}-${Date.now()}`,
        name: data.name,
        temp: data.main.temp,
        condition: data.weather[0].description,
        icon: data.weather[0].icon,
        timestamp: searchedAt,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  currentWeather: null,
  history: [],
  loading: false,
  error: null,
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    clearHistory: (state) => {
      state.history = [];
    },
    removeHistoryItem: (state, action) => {
      state.history = state.history.filter((item) => item.id !== action.payload);

      if (state.currentWeather?.id === action.payload) {
        state.currentWeather = null;
      }
    },
    resetWeatherState: () => initialState,
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWeather = action.payload;
        state.history.unshift(action.payload);
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      });
  },
});

export const {
  clearHistory,
  removeHistoryItem,
  resetWeatherState,
  clearError,
} = weatherSlice.actions;

export default weatherSlice.reducer;
