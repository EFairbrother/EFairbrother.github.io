

const weatherApiUrl = "https://api.open-meteo.com/v1/forecast";
const lat = 42.3314;
const lon = -83.0458;

// Weather code to description mapping
const weatherDescriptions = {
    0: "clear sky",
    1: "mainly clear",
    2: "partly cloudy",
    3: "overcast",
};

// Function to get and format the current date and time
function getCurrentDateTime() {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { timeZone: "America/New_York", hour12: true });
    const date = now.toLocaleDateString("en-US", { timeZone: "America/New_York" });
    return { time, date };
}

// Function to determine the appropriate greeting based on time of day
function getGreeting(hours) {
    if (hours < 12) {
        return "Good morning";
    } else if (hours < 18) {
        return "Good afternoon";
    } else {
        return "Good evening";
    }
}

// Function to fetch the weather
async function fetchWeather() {
    try {
        const response = await fetch(`${weatherApiUrl}?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await response.json();
        const weatherCode = data.current_weather?.weathercode;
        return weatherDescriptions[weatherCode] || "unknown weather";
    } catch (error) {
        console.error("Failed to fetch weather data:", error);
        return "unknown weather";
    }
}

// Function to update the personalized greeting
async function updateGreeting() {
    const userName = localStorage.getItem("userName") || "Guest";
    const lastVisit = localStorage.getItem("lastVisit");
    const { time, date } = getCurrentDateTime();
    const hours = new Date().getHours(); // Get current hour in 24-hour format
    const weather = await fetchWeather();
    const greeting = getGreeting(hours);

    // Update greeting
    document.getElementById("greeting").textContent = `${greeting} ${userName}! It's ${time} EST on ${date}, and it's ${weather} right now.`;

    // Update last visit info if available
    if (lastVisit) {
        const lastVisitDate = new Date(lastVisit).toLocaleString("en-US", {
            timeZone: "America/New_York",
            hour12: true,
        });
        document.getElementById("lastVisit").textContent = `Btw, you last visited on ${lastVisitDate}.`;
    }

    // Update last visit timestamp in localStorage
    localStorage.setItem("lastVisit", new Date());
}

// Handle form submission
document.getElementById("nameForm").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent traditional form submission
    const nameInput = document.getElementById("nameInput").value;
    localStorage.setItem("userName", nameInput); // Save name in localStorage
    updateGreeting(); // Update the greeting immediately
});

// Periodically update the greeting (every second for dynamic updates)
setInterval(updateGreeting, 1000);
updateGreeting(); // Initial call to display the greeting immediately