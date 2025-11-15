import Grid from '@mui/material/Grid';
import { createTheme } from '@mui/material/styles';
import SunnyIcon from '@mui/icons-material/Sunny';
import AirIcon from '@mui/icons-material/Air';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CloudIcon from '@mui/icons-material/Cloud';
import { WiCloud, WiRain } from "react-icons/wi";
import BoltIcon from "@mui/icons-material/Bolt";
import FoggyIcon from '@mui/icons-material/Foggy';
import CloudySnowingIcon from '@mui/icons-material/CloudySnowing';
import { useState, useEffect } from "react";
import AppHeader from './AppHeader';
import "./AppMain.css"

const theme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 500,
            md: 800,
            lg: 1200,
            xl: 1536,
        },
    },
});

const mainHeading = {
    color: "#fff",
    fontSize: "40px",
    fontWeight: 400,
}

const headerIcon = {
    fontSize: 140
}

const degree = {
    fontSize: "60px",
    color: "#fff",
    marginBottom: 10,
    position: "relative"
}

const icon = {
    position: "absolute",
    left: "-30px",
    fontSize: 20,
    color: "#fff",
}

export default function AppMain() {
    const [weather, setWeather] = useState(null);
    const [city, setCity] = useState("Баку");
    const [forecast, setForecast] = useState([]);
    const API_KEY = import.meta.env.VITE_API_KEY;

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ru&appid=${API_KEY}`;

    useEffect(() => {
        fetch(currentWeatherUrl)
            .then((res) => {
                if (!res.ok) {
                    return Promise.reject("City not found!");
                }
                return res.json()
            })
            .then((data) => setWeather(data))
            .catch((err) => console.log(err))
    }, [city])

    useEffect(() => {
        if (!weather) return;
        const lat = weather.coord.lat;
        const lon = weather.coord.lon;
        if (!lat || !lon) return;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${API_KEY}`

        fetch(forecastUrl)
            .then(res => res.json())
            .then((data) => {
                if (!data.list) return;
                const list = data.list;
                const dailyForecast = [];

                for (let i = 0; i < list.length; i += 8) {
                    const daySlice = list.slice(i, i + 8);
                    const temps = daySlice.map(item => item.main.temp);
                    const days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"]
                    const date = daySlice[0].dt_txt.split(" ")[0];
                    const weekDay = (new Date(date).getDay() + 6) % 7;

                    dailyForecast.push({
                        date: days[weekDay],
                        min: Math.min(...temps),
                        max: Math.max(...temps),
                        weather: daySlice[0].weather[0].main
                    });
                }
                setForecast(dailyForecast);
            })
            .catch((err) => console.log(err))
    }, [weather])
    console.log(forecast);

    if (!weather) return;

    function handleCitySubmit(cityName) {
        setCity(cityName);
    }

    function formatSunTime(unixTime) {
        const date = new Date(unixTime * 1000);
        const hours = date.getHours().toString().padStart(2, "0")
        const minutes = date.getMinutes().toString().padStart(2, "0")
        return `${hours}:${minutes}`;
    }
    const sunriseTime = weather.sys.sunrise;
    const sunsetTime = weather.sys.sunset;

    const sunrise = formatSunTime(sunriseTime)
    const sunset = formatSunTime(sunsetTime)

    const timezoneOffsetSeconds = weather.timezone;
    const timezoneHours = timezoneOffsetSeconds / 3600;
    const timezoneResult = `UTC${timezoneHours >= 0 ? "+" : ""}${timezoneHours}`

    const visibilityMeters = weather.visibility;
    const visibilityKm = visibilityMeters / 1000;
    const visibilityResult = `${visibilityKm} км`;

    function getWeatherIcon(weather) {
        switch (weather) {
            case "Clear":
                return <SunnyIcon style={headerIcon} sx={{ color: "#fac22aff", filter: 'drop-shadow(0px 0px 5px #fac22aff)', }} />;
            case "Clouds":
                return <CloudIcon style={headerIcon} sx={{ color: "#f0f0f0ff", filter: 'drop-shadow(0px 0px 5px #f0f0f0ff)', }} />
            case "Rain":
            case "Drizzle":
                return <WiRain size={160} color="#ebebebff" sx={{ filter: 'drop-shadow(0px 0px 5px #ebebebff)' }} />
            case "Thunderstorm":
                return <div style={{ position: "relative", width: 170, height: 170 }}>
                    <WiCloud size={170} color="#ccccccff" sx={{ filter: 'drop-shadow(0px 0px 5px #ccccccff)' }} />
                    <BoltIcon
                        sx={{
                            fontSize: 70,
                            color: "#ddce00ff",
                            position: "absolute",
                            bottom: 10,
                            left: 55,
                            filter: 'drop-shadow(0px 0px 2px #ddce00ff)'
                        }}
                    />
                </div>
            case "Snow":
                return <CloudySnowingIcon style={headerIcon} sx={{ color: "#e2e2e2ff", filter: 'drop-shadow(0px 0px 5px #e2e2e2ff)' }} />;
            case "Mist":
            case "Fog":
            case "Haze":
            case "Smoke":
                return <FoggyIcon style={headerIcon} sx={{ color: "#dbdbdbff", filter: 'drop-shadow(0px 0px 5px #dbdbdbff)' }} />;
            case "Squall":
            case "Tornado":
                return <AirIcon style={headerIcon} sx={{ color: "#e2e2e2ff", filter: 'drop-shadow(0px 0px 5px #e2e2e2ff)' }} />;
            default:
                return <CloudIcon style={headerIcon} sx={{ color: "#f0f0f0ff", filter: 'drop-shadow(0px 0px 5px #f0f0f0ff)' }} />;
        }
    }

    function getWeatherIconSider(weather) {
        switch (weather) {
            case "Clear":
                return <SunnyIcon style={{ fontSize: 40 }} sx={{ color: "#fac22aff" }} />;
            case "Clouds":
                return <CloudIcon style={{ fontSize: 40 }} sx={{ color: "#f0f0f0ff" }} />
            case "Rain":
            case "Drizzle":
                return <WiRain size={40} color="#ebebebff" />
            case "Thunderstorm":
                return <div style={{ position: "relative", width: 40, height: 40 }}>
                    <WiCloud size={45} color="#ccccccff" />
                    <BoltIcon
                        sx={{
                            fontSize: 22,
                            color: "#ddce00ff",
                            position: "absolute",
                            bottom: -4,
                            right: 5,
                        }}
                    />
                </div>
            case "Snow":
                return <CloudySnowingIcon style={{ fontSize: 40 }} sx={{ color: "#e2e2e2ff" }} />;
            case "Mist":
            case "Fog":
            case "Haze":
            case "Smoke":
                return <FoggyIcon style={{ fontSize: 40 }} sx={{ color: "#dbdbdbff" }} />;
            case "Squall":
            case "Tornado":
                return <AirIcon style={{ fontSize: 40 }} sx={{ color: "#e2e2e2ff" }} />;
            default:
                return <CloudIcon style={{ fontSize: 40 }} sx={{ color: "#f0f0f0ff" }} />;
        }
    }

    const weatherIcon = getWeatherIcon(weather.weather[0].main);
    const siderIcon1 = getWeatherIconSider(forecast[0]?.weather);
    const siderIcon2 = getWeatherIconSider(forecast[1]?.weather);
    const siderIcon3 = getWeatherIconSider(forecast[2]?.weather);
    const siderIcon4 = getWeatherIconSider(forecast[3]?.weather);
    const siderIcon5 = getWeatherIconSider(forecast[4]?.weather);

    return (
        <>
            <AppHeader onSubmitCity={handleCitySubmit} />
            <Grid theme={theme} size={{ xs: 12, md: 8 }}>
                <div className="header-container">
                    <div>
                        <div style={{ marginBottom: 20 }}>
                            <h2 style={mainHeading}>{weather.name}</h2>
                            <p style={{ color: "#fff" }}>{weather.sys.country}</p>
                        </div>
                        <div style={degree}>
                            <span>{Math.round(weather.main.temp)}</span>
                            <span style={{ position: "absolute", fontSize: 30, marginLeft: 5 }}>&deg;C</span>
                        </div>
                        <div style={{ color: "#777777ff" }}>
                            <p style={{ color: "#fff", marginBottom: 5, fontSize: 25 }}>{
                                weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1)
                            }</p>
                            <span>Ощущается как {Math.round(weather.main.feels_like)}</span>
                            <span>&deg;C</span>
                        </div>
                    </div>
                    {weatherIcon}
                </div>
                <Grid className="footer-container">
                    <Grid className="info-container" theme={theme} size={{ xs: 12, sm: 4, md: 4 }}>
                        <Grid className="info">
                            <AirIcon style={icon} />
                            <span style={{ color: "#aaaaaaff", whiteSpace: "nowrap", marginBottom: 5 }}>Ветер</span>
                            <span style={{ fontSize: 25, whiteSpace: "nowrap" }}>{(weather.wind.speed * 3.6).toFixed(1)} км/ч</span>
                        </Grid>
                        <Grid className="info">
                            <WbTwilightIcon style={icon} />
                            <span style={{ color: "#aaaaaaff", whiteSpace: "nowrap", marginBottom: 5 }}>Восход</span>
                            <span style={{ fontSize: 25 }}>{sunrise}</span>
                        </Grid>
                    </Grid>
                    <Grid className="info-container" theme={theme} size={{ xs: 12, sm: 4, md: 4 }}>
                        <Grid className="info">
                            <WaterDropIcon style={icon} />
                            <span style={{ color: "#aaaaaaff", whiteSpace: "nowrap", marginBottom: 5 }}>Влажность</span>
                            <span style={{ fontSize: 25 }}>{weather.main.humidity}%</span>
                        </Grid>
                        <Grid className="info">
                            <WbTwilightIcon style={icon} />
                            <span style={{ color: "#aaaaaaff", whiteSpace: "nowrap", marginBottom: 5 }}>Закат</span>
                            <span style={{ fontSize: 25 }}>{sunset}</span>
                        </Grid>
                    </Grid>
                    <Grid className="info-container" theme={theme} size={{ xs: 12, sm: 4, md: 4 }}>
                        <Grid className="info">
                            <AccessTimeOutlinedIcon style={icon} />
                            <span style={{ color: "#aaaaaaff", whiteSpace: "nowrap", marginBottom: 5 }}>Часовой пояс</span>
                            <span style={{ fontSize: 25 }}>{timezoneResult}</span>
                        </Grid>
                        <Grid className="info">
                            <VisibilityOutlinedIcon style={icon} />
                            <span style={{ color: "#aaaaaaff", whiteSpace: "nowrap", marginBottom: 5 }}>Видимость</span>
                            <span style={{ fontSize: 25 }}>{visibilityResult}</span>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid theme={theme} size={{ xs: 12, md: 4 }} className="sider">
                <span
                    style={{ fontSize: 14, color: "#aaaaaaff", fontWeight: 600 }}
                >
                    ПРОГНОЗ НА 5 ДНЕЙ
                </span>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0px" }}>
                    <span style={{ color: "#aaaaaaff", fontSize: 18, width: 100,  }}>Сегодня</span>
                    {siderIcon1}
                    <div>
                        <span style={{ color: "#dfdfdfff", fontWeight: 600, fontSize: 18 }}>{Math.round(forecast[0]?.max)}</span>
                        <span style={{ color: "#aaaaaaff", fontSize: 18 }}>/{Math.round(forecast[0]?.min)}</span>
                    </div>
                </div>
                <div style={{ height: "1px", backgroundColor: "#6b6b6bff" }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0px" }}>
                    <span style={{ color: "#aaaaaaff", fontSize: 18, width: 100,  }}>{forecast[1]?.date}</span>
                    {siderIcon2}
                    <div>
                        <span style={{ color: "#dfdfdfff", fontWeight: 600, fontSize: 18 }}>{Math.round(forecast[1]?.max)}</span>
                        <span style={{ color: "#aaaaaaff", fontSize: 18 }}>/{Math.round(forecast[1]?.min)}</span>
                    </div>
                </div>
                <div style={{ height: "1px", backgroundColor: "#6b6b6bff" }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0px" }}>
                    <span style={{ color: "#aaaaaaff", fontSize: 18, width: 100,  }}>{forecast[2]?.date}</span>
                    {siderIcon3}
                    <div>
                        <span style={{ color: "#dfdfdfff", fontWeight: 600, fontSize: 18 }}>{Math.round(forecast[2]?.max)}</span>
                        <span style={{ color: "#aaaaaaff", fontSize: 18 }}>/{Math.round(forecast[2]?.min)}</span>
                    </div>
                </div>
                <div style={{ height: "1px", backgroundColor: "#6b6b6bff" }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0px" }}>
                    <span style={{ color: "#aaaaaaff", fontSize: 18, width: 100,  }}>{forecast[3]?.date}</span>
                    {siderIcon4}
                    <div>
                        <span style={{ color: "#dfdfdfff", fontWeight: 600, fontSize: 18 }}>{Math.round(forecast[3]?.max)}</span>
                        <span style={{ color: "#aaaaaaff", fontSize: 18 }}>/{Math.round(forecast[3]?.min)}</span>
                    </div>
                </div>
                <div style={{ height: "1px", backgroundColor: "#6b6b6bff" }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0px" }}>
                    <span style={{ color: "#aaaaaaff", fontSize: 18, width: 100,  }}>{forecast[4]?.date}</span>
                    {siderIcon5}
                    <div>
                        <span style={{ color: "#dfdfdfff", fontWeight: 600, fontSize: 18 }}>{Math.round(forecast[4]?.max)}</span>
                        <span style={{ color: "#aaaaaaff", fontSize: 18 }}>/{Math.round(forecast[4]?.min)}</span>
                    </div>
                </div>
            </Grid>
        </>
    )
}