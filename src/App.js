import React, { useState } from "react";

function getWeatherIcon(wmoCode) {
  const icons = new Map([
    [[0], "☀️"],
    [[1], "🌤"],
    [[2], "⛅️"],
    [[3], "☁️"],
    [[45, 48], "🌫"],
    [[51, 56, 61, 66, 80], "🌦"],
    [[53, 55, 63, 65, 57, 67, 81, 82], "🌧"],
    [[71, 73, 75, 77, 85, 86], "🌨"],
    [[95], "🌩"],
    [[96, 99], "⛈"],
  ]);
  const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
  if (!arr) return "NOT FOUND";
  return icons.get(arr);
}

function convertToFlag(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function formatDay(dateStr) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
  }).format(new Date(dateStr));
}

export default function App() {
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayLocation, setDisplayLocation] = useState("");
  const [weatherDataDaily, setWeatherDataDaily] = useState({});
  function dataCall() {
    async function fetchData() {
      try {
        // 1) Getting location (geocoding)
        setLoading(true);
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${location}`
        );
        const geoData = await geoRes.json();
        // console.log(geoData);

        if (!geoData.results) throw new Error("Location not found");

        const { latitude, longitude, timezone, name, country_code } =
          geoData.results.at(0);

        setDisplayLocation(`${name} ${convertToFlag(country_code)}`);
        // 2) Getting actual weather
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
        );
        const weatherData = await weatherRes.json();
        //   console.log(weatherData.daily);

        setWeatherDataDaily(weatherData.daily);
        // console.log(weatherData.daily);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    return fetchData();
  }

  return (
    <div className="app">
      <h1>Classy Weather</h1>
      {/* Controlled Input */}
      <input
        type="text"
        placeholder="Search Weather...."
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button
        onClick={dataCall}
        style={{
          padding: " 1rem 2rem",
          border: "none",
          backgroundColor: "white",
          fontFamily: "inherit",
          cursor: "pointer",
          fontWeight: "bold",
          borderRadius: "5px",
        }}
      >
        Get Weather
      </button>
      {loading && <p>Loading ....</p>}

      {weatherDataDaily.weathercode && (
        <Weather
          weatherDataDaily={weatherDataDaily}
          displayLocation={displayLocation}
        />
      )}
    </div>
  );
}

function Weather({ weatherDataDaily, displayLocation }) {
  const {
    temperature_2m_max: max, //[]
    temperature_2m_min: min, // []
    time: dates, // []
    weathercode: codes, // []
  } = weatherDataDaily; // ====>  {}

  return (
    <div>
      <h4>Weather {displayLocation}</h4>
      <ul className="weather">
        {dates.map(
          (
            date,
            i // ======> looping over one of array
          ) => (
            <Day
              date={date}
              max={max.at(i)} // ====> max temperature at i place
              min={min.at(i)} // ====> same for it
              codes={codes.at(i)} // =====> same for it
              key={date}
              isToday={i === 0}
            />
          )
        )}
      </ul>
    </div>
  );
}

function Day({ date, min, max, codes, isToday }) {
  return (
    <li className="day">
      <span>{getWeatherIcon(codes)}</span>
      <p>{isToday ? "Today" : formatDay(date)}</p>
      <p>
        {Math.floor(min)}&deg; &mdash; {Math.ceil(max)}
      </p>
    </li>
  );
}

// import React, { Component } from "react";

// function getWeatherIcon(wmoCode) {
//   const icons = new Map([
//     [[0], "☀️"],
//     [[1], "🌤"],
//     [[2], "⛅️"],
//     [[3], "☁️"],
//     [[45, 48], "🌫"],
//     [[51, 56, 61, 66, 80], "🌦"],
//     [[53, 55, 63, 65, 57, 67, 81, 82], "🌧"],
//     [[71, 73, 75, 77, 85, 86], "🌨"],
//     [[95], "🌩"],
//     [[96, 99], "⛈"],
//   ]);
//   const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
//   if (!arr) return "NOT FOUND";
//   return icons.get(arr);
// }

// function convertToFlag(countryCode) {
//   const codePoints = countryCode
//     .toUpperCase()
//     .split("")
//     .map((char) => 127397 + char.charCodeAt());
//   return String.fromCodePoint(...codePoints);
// }

// function formatDay(dateStr) {
//   return new Intl.DateTimeFormat("en", {
//     weekday: "short",
//   }).format(new Date(dateStr));
// }

// export default class App extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       location: "",
//       weatherDataDaily: {},
//       displayLocation: "",
//       isLoading: false,
//     };
//     this.fetchData = this.fetchData.bind(this);
//   }

//   async fetchData() {
//     try {
//       // 1) Getting location (geocoding)
//       this.setState({ isLoading: true });
//       const geoRes = await fetch(
//         `https://geocoding-api.open-meteo.com/v1/search?name=${this.state.location}`
//       );
//       const geoData = await geoRes.json();
//       console.log(geoData);

//       if (!geoData.results) throw new Error("Location not found");

//       const { latitude, longitude, timezone, name, country_code } =
//         geoData.results.at(0);

//       this.setState({
//         displayLocation: `${name} ${convertToFlag(country_code)}`,
//       });

//       // 2) Getting actual weather
//       const weatherRes = await fetch(
//         `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
//       );
//       const weatherData = await weatherRes.json();
//       //   console.log(weatherData.daily);
//       this.setState({ weatherDataDaily: weatherData.daily });
//     } catch (err) {
//       console.err(err);
//     } finally {
//       this.setState({ isLoading: false });
//     }
//   }

//   render() {
//     return (
//       <div className="app">
//         <h1>Classy Weather</h1>
//         {/* Controlled Input */}
//         <input
//           type="text"
//           placeholder="Search Weather...."
//           value={this.state.location}
//           onChange={(e) => this.setState({ location: e.target.value })}
//         />
//         <button onClick={this.fetchData}>Get Weather</button>
//         {this.state.isLoading && <p>Loading ....</p>}
//       </div>
//     );
//   }
// }
