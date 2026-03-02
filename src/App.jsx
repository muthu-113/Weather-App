import { useEffect, useState } from 'react'
import './App.css'
import Humidiy from "./images/Humidiy.jpg";
import search from "./images/search.jpg";
import sun from "./images/sun.jpg";
import Wind from "./images/Wind.jpg";
import snow from "./images/snow.jpg";

const WeatherDetails = ({icon, temp, city, country, lat, log, humidity, wind}) => {
  return(
    <>
    <div className="image">
      <img src={icon} alt="image" />
    </div>
    <div className="temp">{temp}°C</div>
    <div className="location">{city}</div>
    <div className="country">{country}</div>
    <div className="cord">
      <div>
        <span className="lat">latitude</span>
        <span>{lat}</span>
      </div>
      <div>
        <span className="log">longitude</span>
        <span>{log}</span>
      </div>
    </div>
    <div className="data-container">
      <div className="element">
        <img src={Humidiy} alt="humidity" className='icon'/>
        <div className="data">
          <div className="humidity-percent">{humidity}%</div>
          <div className="text">Humidity</div>
        </div>
      </div>

      <div className="element">
        <img src={Wind} alt="wind" className='icon'/>
        <div className="data">
          <div className="wind-percent">{wind}km/h</div>
          <div className="text">Wind Speed</div>
        </div>
      </div>
    </div>
    </>
  );
};
  
function App() {
  
  const API_key ="08b2075defec0dc3421825f0d3544100";
  const [text, setText] = useState("Coimbatore");
  const [icon, setIcon] = useState(snow); 
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [CityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
  "01d": sun,
  "01n": sun,
  "02d": sun,
  "02n": sun,
  "03d": snow,
  "03n": snow,
  "04d": snow,
  "04n": sun,
  "09d": snow,
  "09n": snow,
  "10d": snow,
  "10n": snow,
  "13d": sun,
  "13n": sun,
};

  const fetchWeather = async () => {
    setLoading(true);

      let Url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${API_key}&units=metric`;

      try {
        let response = await fetch(Url);
        let data = await response.json();
        
       if(data.cod === "404"){
        console.error("City not found");
        setCityNotFound(true);
        setLoading(false)
        return;
       }
       
       setHumidity(data.main.humidity);
       setWind(data.wind.speed);
       setLat(data.coord.lat);
       setLog(data.coord.lon);
       setCity(data.name);
       setCountry(data.sys.country);
       setTemp(Math.floor(data.main.temp));

        const weatherIconCode = data.weather[0].icon;
        setIcon(weatherIconMap[weatherIconCode] || snow);
        setCityNotFound(false);

       } catch (error) {
        console.error("An error occurred:", error.message);
        setError("An error occurred while fetching weather data. Please try again later.");
      } finally {
        setLoading(false);
      }
 };

  const handlecity = (e) => {
    setText(e.target.value);
  };

  const handlekeydown = (e) => {
    if(e.key === "Enter"){
      fetchWeather();
    }
  };

  useEffect(function ()  {
    fetchWeather();
  }, []);

  return (
    <>
      <div className='container'>
        <div className="input-container">
          <input type="text" 
          className='cityinput'
          placeholder='search city' 
          onChange={handlecity}
          value={text} onKeyDown={handlekeydown}/>
          <div className="search-icon" onClick={ () => fetchWeather()}>
            <img src={search} alt="search" />
          </div>
                  
        </div>
        
        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {CityNotFound && <div className="city-not-found">City not found</div>}
        
        {!loading && !CityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity} wind={wind} />}
      
        <p className='copyright'>
          Designed By <span>Muthu</span>
        </p>
      </div>
    </>
  )
}

export default App;
