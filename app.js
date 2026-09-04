const weatherReading = document.querySelector("#weather-reading");
const weatherCondition = document.querySelector("#weather-condition");
const weatherIcon = document.querySelector("#weather-icon");
const hero = document.querySelector(".hero");

const weatherCodes = {
	0: ["☀️", "Clear sky"], 1: ["🌤️", "Mainly clear"], 2: ["⛅", "Partly cloudy"], 3: ["☁️", "Overcast"],
	45: ["🌫️", "Foggy"], 48: ["🌫️", "Rime fog"], 51: ["🌦️", "Light drizzle"], 53: ["🌦️", "Drizzle"], 55: ["🌧️", "Heavy drizzle"],
	56: ["🌧️", "Freezing drizzle"], 57: ["🌧️", "Heavy freezing drizzle"], 61: ["🌦️", "Light rain"], 63: ["🌧️", "Rain"], 65: ["🌧️", "Heavy rain"],
	66: ["🌧️", "Freezing rain"], 67: ["🌧️", "Heavy freezing rain"], 71: ["🌨️", "Light snow"], 73: ["🌨️", "Snow"], 75: ["❄️", "Heavy snow"],
	77: ["❄️", "Snow grains"], 80: ["🌦️", "Rain showers"], 81: ["🌧️", "Rain showers"], 82: ["⛈️", "Heavy rain showers"], 85: ["🌨️", "Snow showers"],
	86: ["🌨️", "Heavy snow showers"], 95: ["⛈️", "Thunderstorm"], 96: ["⛈️", "Thunderstorm with hail"], 99: ["⛈️", "Thunderstorm with heavy hail"]
};

function showWeatherError(message) {
	weatherReading.textContent = "Weather unavailable";
	weatherCondition.textContent = message;
	weatherIcon.textContent = "—";
}

function setWeatherArtwork(code) {
	const weatherType = code >= 71 && code <= 86 ? "snow" : code >= 51 && code <= 67 || code >= 80 ? "rain" : code >= 3 && code <= 48 ? "cloud" : "sunny";
	hero.className = `hero hero-weather-${weatherType}`;
}

function isNightTime(localTime) {
	const hour = Number(localTime.slice(11, 13));
	return hour >= 20 || hour < 5;
}

async function loadWeather(position) {
	const { latitude, longitude } = position.coords;
	const params = new URLSearchParams({ latitude, longitude, current: "temperature_2m,weather_code", temperature_unit: "fahrenheit", timezone: "auto" });

	try {
		const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
		if (!response.ok) throw new Error("Weather request failed");
		const data = await response.json();
		const weatherCode = data.current.weather_code;
		const [dayIcon, condition] = weatherCodes[weatherCode] || ["🌡️", "Current conditions"];
		const night = isNightTime(data.current.time);
		const nightIcons = { 0: "🌙", 1: "🌙", 2: "🌙☁️", 3: "☁️" };
		const icon = night ? (nightIcons[weatherCode] || dayIcon) : dayIcon;
		setWeatherArtwork(weatherCode);
		weatherIcon.textContent = icon;
		weatherReading.textContent = `${Math.round(data.current.temperature_2m)}°F`;
		weatherCondition.textContent = condition;
	} catch (error) {
		showWeatherError("Please try again later");
	}
}

if ("geolocation" in navigator) {
	navigator.geolocation.getCurrentPosition(loadWeather, () => showWeatherError("Enable location to see your weather."));
} else {
	showWeatherError("Location is not supported");
}
