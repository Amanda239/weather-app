async function fetchWeather() {
  let searchInput = document.getElementById("search").value.trim();
  const weatherDataSection = document.getElementById("weather-data");
  weatherDataSection.style.display = "block";
  const apiKey = "970677181623177ae5c6705dabd8a3d7"; //your private API

  if (searchInput === "") {
    weatherDataSection.innerHTML = `
      <div>
        <h2>Empty Input!</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
      </div>`;
    return;
  }

  // ✅ ambil data koordinat (lat & lon)
  async function getLonAndLat() {
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchInput)}&limit=1&appid=${apiKey}`;
    const response = await fetch(geocodeURL);

    if (!response.ok) {
      console.log("Bad response! ", response.status);
      return;
    }

    const data = await response.json();
    if (data.length === 0) {
      weatherDataSection.innerHTML = `
        <div>
          <h2>Invalid Input: "${searchInput}"</h2>
          <p>Please try again with a valid <u>city name</u>.</p>
        </div>`;
      return;
    }

    return data[0]; // hasil pertama
  }

  async function getWeatherData(lon, lat, city, state, country) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await fetch(weatherURL);

    if (!response.ok) {
      console.log("Bad response! ", response.status);
      return;
    }

    const data = await response.json();

    // ambil nama yg lebih jelas: city + state + country
    const fullName = `${city || data.name}${state ? ", " + state : ""}${country ? ", " + country : ""}`;

    weatherDataSection.style.display = "flex";
    weatherDataSection.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" 
           alt="${data.weather[0].description}" width="100" />
      <div>
        <h2>${fullName}</h2>
        <p><strong>Temperature:</strong> ${Math.round(data.main.temp)}°C</p>
        <p><strong>Description:</strong> ${data.weather[0].description}</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
      </div>`;
  }

  document.getElementById("search").value = "";
  const geo = await getLonAndLat();
  if (geo) {
    getWeatherData(geo.lon, geo.lat, geo.name, geo.state, geo.country);
  }
}

// ⬇️ Enter biar jalan
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      fetchWeather();
    }
  });
});
