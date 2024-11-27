// Replace with your actual API key from AirVisual API
const API_KEY = "YOUR_API_KEY";

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

    // Display data dynamically
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
      <h2>Air Quality in ${city}, ${state}, ${country}</h2>
      <p><strong>AQI (US):</strong> ${aqi}</p>
      <p><strong>Main Pollutant:</strong> ${mainPollutant}</p>
      <p><strong>Temperature:</strong> ${temperature}°C</p>
    `;
    resultDiv.style.display = "block"; // Show the result section

  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});
