// Function to fetch API Key securely (optional, if server is set up for this)
async function fetchApiKey() {
  try {
    const response = await fetch('/get-api-key');
    if (!response.ok) throw new Error("Unable to fetch data from API. Please check your input.");
    const data = await response.json();
    return data.apiKey;
  } catch (error) {
    console.error("Error fetching API key:", error);
    throw error;
  }
}

// Fetch data from a specified API endpoint
async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to fetch data from API. Please check your input.");
  const data = await response.json();
  if (data.status !== "success") throw new Error(data.data.message || "API error.");
  return data;
}

// Get health recommendation based on AQI
function getHealthRecommendation(aqi) {
  if (aqi <= 50) return "Good: Air quality is satisfactory, with little or no risk.";
  if (aqi <= 100) return "Moderate: Air quality is acceptable but may affect sensitive individuals.";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups: Potential health effects for sensitive individuals.";
  if (aqi <= 200) return "Unhealthy: Everyone may experience health effects.";
  if (aqi <= 300) return "Very Unhealthy: Health alert for serious health effects.";
  return "Hazardous: Emergency conditions affecting everyone.";
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
function updateResult({ city, state, country, aqi, aqiIcon, mainPollutant, temperature, recommendation, states }) {
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

// Event listener for form submission
document.getElementById("location-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = document.getElementById("city").value.trim();
  const state = document.getElementById("state").value.trim();
  const country = document.getElementById("country").value.trim();

  if (!city || !state || !country) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    // Fetch API key (replace this with your hardcoded key if not using a server)
    const API_KEY = await fetchApiKey();

    // API URLs
    const cityUrl = `https://api.airvisual.com/v2/city?city=${city}&state=${state}&country=${country}&key=${API_KEY}`;
    const statesUrl = `https://api.airvisual.com/v2/states?country=${country}&key=${API_KEY}`;

    // Fetch data
    const cityData = await fetchData(cityUrl);
    const { aqius: aqi, mainus: mainPollutant } = cityData.data.current.pollution;
    const { tp: temperature } = cityData.data.current.weather;

    const statesData = await fetchData(statesUrl);
    const states = statesData.data.map((state) => state.state).join(", ");

    // Generate recommendation and icon
    const recommendation = getHealthRecommendation(aqi);
    const aqiIcon = getAqiIcon(aqi);

    // Update the DOM
    updateResult({ city, state, country, aqi, aqiIcon, mainPollutant, temperature, recommendation, states });
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});
