import { useState } from 'react'


function App() {
const [search , setSearch] = useState("");
const [information , setInformation] = useState([]);
const[suggestion,setSuggestion] =useState('');



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

const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`);

const weatherData = await weatherRes.json();
console.log(weatherData)

const info = [{
  city: name,                    
  timezone: timezone,             
  current: {
    temp: weatherData.current_weather.temperature,  
    windspeed: weatherData.current_weather.windspeed, 
  },
  hourly: weatherData.hourly       
}];

setInformation(info);

  }
  catch(error){
console.error("Error fetching weather:", error);
  }

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
          className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800"
        >
          Search
        </button>
      </div>

      <div className="hidden lg:flex items-center space-x-4">
        <button className="text-gray-700 hover:text-blue-500">Different Weather?</button>
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
        <div key={m.city} className="border p-4 rounded-md shadow my-2">
          <p><strong>City:</strong> {m.city}</p>
          <p><strong>Timezone:</strong> {m.timezone}</p>
          <p><strong>Temperature:</strong> {m.current.temp}°C</p>
          <p><strong>Wind Speed:</strong> {m.current.windspeed} km/h</p>
        </div>
      ))}
    </div>
  </div>
);


}


export default App;
