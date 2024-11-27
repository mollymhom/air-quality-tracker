// Actual API key from AirVisual API
const API_KEY = "c0036d36-b809-4435-ab73-08e8ea5c92cf";

document.getElementById("location-form").addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent form submission

  // Get user input
  const city = document.getElementById("city").value.trim();
  const state = document.getElementById("state").value.trim();
  const country = document.getElementById("country").value.trim();

  // Validate inputs
  if (!city || !state || !country) {
    alert("Please fill in all fields.");
    return;
  }

  // API URL
  const url = `https://api.airvisual.com/v2/city?city=${city}&state=${state}&country=${country}&key=${API_KEY}`;

  try {
    // Fetch data from the API
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error fetching data");

    const data = await response.json();

    if (data.status !== "success") {
      throw new Error(data.data.message || "Invalid response from API");
    }

    // Extract relevant data
    const aqi = data.data.current.pollution.aqius;
    const mainPollutant = data.data.current.pollution.mainus;
    const temperature = data.data.current.weather.tp;

    // Add health recommendation based on AQI
    let recommendation;
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

    // Display data dynamically
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
      <h2>Air Quality in ${city}, ${state}, ${country}</h2>
      <p><strong>AQI (US):</strong> ${aqi}</p>
      <p><strong>Main Pollutant:</strong> ${mainPollutant}</p>
      <p><strong>Temperature:</strong> ${temperature}°C</p>
      <p><strong>Health Recommendation:</strong> ${recommendation}</p>
    `;
    resultDiv.style.display = "block"; // Ensure the result is visible

  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});
