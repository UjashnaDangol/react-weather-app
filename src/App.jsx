import { useState } from 'react'
import { getWindDirection } from './wind';

function App() {
const [search , setSearch] = useState("");
const [information , setInformation] = useState([]);
const[suggestion,setSuggestion] =useState('');


{/*api fetch*/}
const fetchWeather = async(city) =>{

  try{
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
  const geoData = await geoRes.json();
console.log(geoData);


 if (!geoData.results || geoData.results.length === 0) {
        alert("City not found");
        return;
      }

const {latitude,longitude,name ,timezone} = geoData.results[0];

const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m&timezone=auto`);


const weatherData = await weatherRes.json();
console.log(weatherData)

const apiTime = weatherData.current_weather.time;
const currentTime = new Date(apiTime);

const formattedTime = currentTime.toLocaleString("en-Us",{
  month:"short",
  day:"numeric",
  hour:"numeric",
  minute:"numeric",
  hour12:true

});

const currentTimeISO = weatherData.current_weather.time; // e.g., "2025-09-18T08:45"

// Find the closest index in hourly.time
const index = weatherData.hourly.time.findIndex(t => t === currentTimeISO);

// Get feels like from hourly.apparent_temperature
const feel_like = index !== -1 ? weatherData.hourly.apparent_temperature[index] : weatherData.current_weather.temperature;
const Humidity = index !== -1 ? weatherData.hourly.relative_humidity_2m[index] : null;

const info = [{
  Latitude : latitude,
  Longitude : longitude,
  city: name,                    
  timezone: timezone,  
  time:formattedTime, 
  feels_like: feel_like,    
  humidity : Humidity, 

  current: {
    temp: weatherData.current_weather.temperature,  
    windspeed: weatherData.current_weather.windspeed, 
    winddirection: weatherData.current_weather.winddirection,

    
  },
  hourly: weatherData.hourly       
}];


setInformation(info);

  }
  catch(error){
console.error("Error fetching weather:", error);
  }

}

function WeatherMap({ latitude, longitude }) {
  const windyUrl = `https://embed.windy.com/embed2.html?lat=${latitude}&lon=${longitude}&detailLat=${latitude}&detailLon=${longitude}&width=650&height=450&zoom=8&level=surface&overlay=wind&product=ecmwf`;
return (
    <iframe
      width="100%"
      height="450"
      src={windyUrl}
      frameBorder="0"
      title="Weather Map"
      className="rounded-md"
    ></iframe>
  );

}




return (
  <div>
    <nav className="w-full bg-gray-100 shadow px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-2 w-full md:w-auto">
        <input 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text" 
          placeholder="Search city"
          className="px-3 py-2 border rounded-md w-full md:w-64 focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          onClick={() => fetchWeather(search)}
          className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        >
          Search
        </button>
      </div>

      <div className="hidden lg:flex items-center space-x-4">
       
        <button className="px-3 py-1 border rounded-md text-sm text-gray-700 bg-white shadow-sm hover:bg-gray-50">
          Metric: °C, m/s
        </button>
        <button className="px-3 py-1 border rounded-md text-sm text-gray-700 bg-white shadow-sm hover:bg-gray-50">
          Imperial: °F, mph
        </button>
      </div>
    </nav>

    <div className="p-4">
      {information.map((m) => (
        <div key={m.city} className=" p-4 rounded-md shadow my-2 ">
         <div className="w-full max-w-4xl mx-auto bg-white shadow rounded-lg overflow-hidden justify-between md:h-[300px]">
      {/* Main container with flex direction */}
      <div className="flex flex-col md:flex-row justify-between ">
        
        {/* Left section - Weather Info */}
        <div className="p-4 md:w-1/2 flex flex-col gap-3">
       
          {/* Date and Time */}
          <p className="text-blue-900 text-sm">{m.time}</p>

          {/* Location */}
          <h2 className="text-2xl font-semibold">{m.timezone}</h2>

          {/* Temperature */}
          <div className="flex items-center gap-2">
            <span className="text-3xl font-semibold">{m.current.temp}°C</span>
            <span className="text-gray-500">☁️</span>
          </div>

          {/* Feels like */}
          <p className="text-gray-700 text-1xl">
            Feels like {m.feels_like}°C. 
          </p>

          {/* Weather details */}
          <div className="grid  gap-2 text-sm text-gray-700  text-1xl">
            <div> {m.current.windspeed} km/hr <span>
              { getWindDirection(m.current.winddirection)}</span></div>
            <div>Humidity: {m.humidity}%</div>
            
          </div>
        </div>

        {/* Right section - Map & forecast */}
        <div className="relative md:w-1/2 ">
          <WeatherMap latitude={m.Latitude} longitude={m.Longitude}/>

         
        </div>
      </div>
    </div>
        </div>
      ))}
    </div>
  </div>
);


}


export default App;
