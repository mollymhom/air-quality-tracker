// Actual API key from AirVisual API
const API_KEY = "c0036d36-b809-4435-ab73-08e8ea5c92cf";

// Fetch data from an API endpoint
async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch data.");
  const data = await response.json();
  if (data.status !== "success") throw new Error(data.data.message || "API error.");
  return data;
}

// Get health recommendation based on AQI
function getHealthRecommendation(aqi) {
  if (aqi <= 50) {
    return "Good: Air quality is considered satisfactory, and air pollution poses little or no risk.";
  } else if (aqi <= 100) {
    return "Moderate: Air quality is acceptable. However, there may be a risk for some people who are unusually sensitive to air pollution.";
  } else if (aqi <= 150) {
    return "Unhealthy for Sensitive Groups: Members of sensitive groups may experience health effects. The general public is less likely to be affected.";
  } else if (aqi <= 200) {
    return "Unhealthy: Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.";
  } else if (aqi <= 300) {
    return "Very Unhealthy: Health alert: everyone may experience more serious health effects.";
  } else {
    return "Hazardous: Health warning of emergency conditions: everyone is more likely to be affected.";
  }
}

// Get AQI icon based on value
function getAqiIcon(aqi) {
  if (aqi <= 50) return "🟢"; // Green
  if (aqi <= 100) return "🟡"; // Yellow
  if (aqi <= 150) return "🟠"; // Orange
  if (aqi <= 200) return "🔴"; // Red
  if (aqi <= 300) return "🟣"; // Purple
  return "⚫"; // Black
}

// Update the DOM with results
function updateResult({
  city, state, country, aqi, aqiIcon, mainPollutant, temperature, recommendation, states,
}) {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `
    <h2>Air Quality in ${city}, ${state}, ${country}</h2>
    <p><strong>AQI (US):</strong> ${aqi} ${aqiIcon}</p>
    <p><strong>Main Pollutant:</strong> ${mainPollutant}</p>
    <p><strong>Temperature:</strong> ${temperature}°C</p>
    <p><strong>Health Recommendation:</strong> ${recommendation}</p>
    <p><strong>Available States in ${country}:</strong> ${states}</p>
  `;
  resultDiv.style.display = "block";
}

// Main event listener for form submission
document.getElementById("location-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = document.getElementById("city").value.trim();
  const state = document.getElementById("state").value.trim();
  const country = document.getElementById("country").value.trim();

  if (!city || !state || !country) {
    alert("Please fill in all fields.");
    return;
  }

  const cityUrl = `https://api.airvisual.com/v2/city?city=${city}&state=${state}&country=${country}&key=${API_KEY}`;
  const statesUrl = `https://api.airvisual.com/v2/states?country=${country}&key=${API_KEY}`;

  try {
    // Fetch air quality data
    const cityData = await fetchData(cityUrl);
    const { aqius: aqi, mainus: mainPollutant } = cityData.data.current.pollution;
    const { tp: temperature } = cityData.data.current.weather;

    // Fetch states data
    const statesData = await fetchData(statesUrl);
    const states = statesData.data.map((state) => state.state).join(", ");

    // Generate recommendation and icon
    const recommendation = getHealthRecommendation(aqi);
    const aqiIcon = getAqiIcon(aqi);

    // Update the DOM
    updateResult({
      city, state, country, aqi, aqiIcon, mainPollutant, temperature, recommendation, states,
    });
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});
