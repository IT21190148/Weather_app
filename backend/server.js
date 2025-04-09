const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Weather Schema
const WeatherSchema = new mongoose.Schema({
    city: String,
    temperature: Number,
    humidity: Number,
    windSpeed: Number,
    date: { type: Date, default: Date.now }
});

const Weather = mongoose.model("Weather", WeatherSchema);

// Save Weather Data
app.post("/weather", async (req, res) => {
    const { city, temperature, humidity, windSpeed } = req.body;
    const newWeather = new Weather({ city, temperature, humidity, windSpeed });

    try {
        await newWeather.save();
        res.status(201).json({ message: "Weather data saved" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Weather Data
app.get("/weather", async (req, res) => {
    try {
        const data = await Weather.find().sort({ date: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
