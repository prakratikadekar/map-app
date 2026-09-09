// app.json holds the static config. This file only exists to inject the Google Maps API
// key from an env var at config-evaluation time, so the real key never sits in a tracked
// file — see .env.example for where to put it locally.
module.exports = ({ config }) => ({
  ...config,
  android: {
    ...config.android,
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
  },
});
