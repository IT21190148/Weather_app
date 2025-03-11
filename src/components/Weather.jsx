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
    const [searchName, setSearchName] = useState(""); // ✅ Initialize as an empty string

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

    const search = async (city) => {
        if (!city) return; // Prevents empty API calls
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=9989719e915aedf01d6c85602d56ae71`;

            const response = await fetch(url);
            const data = await response.json();
            console.log("Weather Data:", data);

            if (data.cod !== 200) {
                console.error("Error fetching weather:", data.message);
                return;
            }

            const icon = allIcons[data.weather[0].icon] || clear_icon;

            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon,
            });
        } catch (error) {
            console.error("Failed to fetch weather data:", error);
        }
    };

    // ✅ Updates the state when user types in input field
    const searchfunction = (e) => {
        setSearchName(e.target.value);
    };

    useEffect(() => {
        search("Colombo"); // ✅ Load default city on mount
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
                    onClick={() => search(searchName)} // ✅ Click to fetch weather
                    style={{ cursor: "pointer" }}
                />
            </div>

            <img src={weatherData.icon || clear_icon} alt="Weather" className="weather-icon" />
            <p className="temp">{weatherData?.temperature ?? "--"}°C</p>
            <p className="location">{weatherData?.location ?? "Loading..."}</p>

            <div className="weather-data">
                <div className="col">
                    <img src={humidity_icon} alt="Humidity" />
                    <div>
                        <p>{weatherData?.humidity ?? "--"} %</p>
                        <span>Humidity</span>
                    </div>
                </div>
            </div>

            <div className="weather-data">
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
