import React, { useEffect, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';

const Weather = () => {
    const [weatherData, setWeatherData] = useState({});
    const [searchName, setSearchName] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Track screen size

    // Update screen size on window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": drizzle_icon,
        "04n": drizzle_icon,
        "08d": rain_icon,
        "08n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon,
    };

    const fetchWeatherData = async () => {
        try {
            const response = await fetch("http://localhost:5000/weather");
            const data = await response.json();
            console.log("Fetched from DB:", data);

            if (data.length > 0) {
                const latestWeather = data[0];
                setWeatherData({
                    humidity: latestWeather.humidity,
                    windSpeed: latestWeather.windSpeed,
                    temperature: latestWeather.temperature,
                    location: latestWeather.city,
                    icon: allIcons[latestWeather.icon] || clear_icon,
                });
            }
        } catch (error) {
            console.error("Error fetching weather from DB:", error);
        }
    };

    const search = async (city) => {
        if (!city) return;
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=9989719e915aedf01d6c85602d56ae71`;

            const response = await fetch(url);
            const data = await response.json();
            console.log("Weather Data:", data);

            if (data.cod !== 200) {
                console.error("Error fetching weather:", data.message);
                return;
            }



            const newWeather = {
                city: data.name,
                temperature: Math.floor(data.main.temp),
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                icon: data.weather[0].icon, // Store icon ID correctly
            };

            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: allIcons[data.weather[0].icon] || clear_icon, // fixed
            });
            await fetch("http://localhost:5000/weather", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newWeather),
            });
            console.log("Weather data saved to DB");
        } catch (error) {
            console.error("Failed to fetch weather data:", error);
        }
    };

    const searchfunction = (e) => {
        setSearchName(e.target.value);
    };

    useEffect(() => {
        fetchWeatherData(); // Load latest weather from DB on startup
    }, []);

    return (
        <div className="weather">
            <div className="search-bar">
                <input
                    type="text"
                    value={searchName}
                    onChange={searchfunction}
                    placeholder="Search city..."
                />
                <img
                    src={search_icon}
                    alt="Search"
                    onClick={() => search(searchName)}
                />
            </div>

            <img src={weatherData.icon || clear_icon} alt="Weather" className="weather-icon" />
            <p className="temp" style={{ fontSize: window.innerWidth < 768 ? "60px" : "80px" }}>
                {weatherData?.temperature ?? "--"}°C
            </p>

            <p className="location" style={{ fontSize: window.innerWidth < 768 ? "28px" : "35px" }}>
                {weatherData?.location ?? "Loading..."}
            </p>


            <div className="weather-data" style={{ flexDirection: isMobile ? "column" : "row" }}>
                <div className="col">
                    <img src={humidity_icon} alt="Humidity" />
                    <div>
                        <p>{weatherData?.humidity ?? "--"} %</p>
                        <span>Humidity</span>
                    </div>
                </div>

                <div className="col">
                    <img src={wind_icon} alt="Wind Speed" />
                    <div>
                        <p>{weatherData?.windSpeed ?? "--"} km/h</p>
                        <span>Wind Speed</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Weather;
