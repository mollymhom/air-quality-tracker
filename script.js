// Actual API key from AirVisual API
const API_KEY = "c0036d36-b809-4435-ab73-08e8ea5c92cf";

// Arrow function for event listener
document.getElementById("location-form").addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent form submission

  // Get user input using const/let
  const city = document.getElementById("city").value.trim();
  const state = document.getElementById("state").value.trim();
  const country = document.getElementById("country").value.trim();

  // Validate inputs
  if (!city || !state || !country) {
    alert("Please fill in all fields.");
    return;
  }

  // API URLs
  const cityUrl = `https://api.airvisual.com/v2/city?city=${city}&state=${state}&country=${country}&key=${API_KEY}`;
  const statesUrl = `https://api.airvisual.com/v2/states?country=${country}&key=${API_KEY}`;

  try {
    // Fetch data from city endpoint
    const cityResponse = await fetch(cityUrl);
    if (!cityResponse.ok) throw new Error("Error fetching air quality data");

    const cityData = await cityResponse.json();
    if (cityData.status !== "success") {
      throw new Error(cityData.data.message || "Invalid response from city API");
    }

    // Extract relevant data from city API
    const { aqius: aqi, mainus: mainPollutant } = cityData.data.current.pollution;
    const { tp: temperature } = cityData.data.current.weather;

    // Fetch data from states endpoint
    const statesResponse = await fetch(statesUrl);
    if (!statesResponse.ok) throw new Error("Error fetching states data");

    const statesData = await statesResponse.json();
    if (statesData.status !== "success") {
      throw new Error(statesData.data.message || "Invalid response from states API");
    }

    // Extract states information using map and template literals
    const states = statesData.data.map((state) => state.state).join(", ");

    // Add health recommendation based on AQI
    let recommendation = "";
    if (aqi <= 50) {
      recommendation = "Good: Air quality is considered satisfactory, and air pollution poses little or no risk.";
    } else if (aqi <= 100) {
      recommendation = "Moderate: Air quality is acceptable. However, there may be a risk for some people who are unusually sensitive to air pollution.";
    } else if (aqi <= 150) {
      recommendation = "Unhealthy for Sensitive Groups: Members of sensitive groups may experience health effects. The general public is less likely to be affected.";
    } else if (aqi <= 200) {
      recommendation = "Unhealthy: Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.";
    } else if (aqi <= 300) {
      recommendation = "Very Unhealthy: Health alert: everyone may experience more serious health effects.";
    } else {
      recommendation = "Hazardous: Health warning of emergency conditions: everyone is more likely to be affected.";
    }

    // Determine AQI icon using let
    let aqiIcon = "";
    if (aqi <= 50) {
      aqiIcon = "🟢"; // Green
    } else if (aqi <= 100) {
      aqiIcon = "🟡"; // Yellow
    } else if (aqi <= 150) {
      aqiIcon = "🟠"; // Orange
    } else if (aqi <= 200) {
      aqiIcon = "🔴"; // Red
    } else if (aqi <= 300) {
      aqiIcon = "🟣"; // Purple
    } else {
      aqiIcon = "⚫"; // Black
    }

    // Display data dynamically with template literals
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
      <h2>Air Quality in ${city}, ${state}, ${country}</h2>
      <p><strong>AQI (US):</strong> ${aqi} ${aqiIcon}</p>
      <p><strong>Main Pollutant:</strong> ${mainPollutant}</p>
      <p><strong>Temperature:</strong> ${temperature}°C</p>
      <p><strong>Health Recommendation:</strong> ${recommendation}</p>
      <p><strong>Available States in ${country}:</strong> ${states}</p>
    `;
    resultDiv.style.display = "block"; // Ensure the result is visible
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});
