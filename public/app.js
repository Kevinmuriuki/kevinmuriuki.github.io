// get input element in the header by class name
const input = document.querySelector(".cities");
const msg = document.querySelector(".erro-msg");
let todayDateTime = new Date();
let searchinput;

// initiate a window event trigerd after the browser loads
window.addEventListener("load", () => {
  let x;
  let y;

  // get the users location
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      x = position.coords.longitude;
      y = position.coords.latitude;

      let api = `https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=341f3a5ad73fcf20c2dee19a9f0b6b90&coords=${x},${y}&units=metric`;

      fetchData(api);
    })
  }
});

document.addEventListener('DOMContentLoaded', getWeatherData);

// add an event that in order to get users input to display weather data according to their search input
input.addEventListener('keypress', e => {
  if(e.keyCode == 13) {
    searchinput = input.value;
    getInputValue(searchinput);
  }
});
 
function getInputValue(query) {
  const api = `https://api.openweathermap.org/data/2.5/weather?q=${query}&APPID=341f3a5ad73fcf20c2dee19a9f0b6b90&units=metric`;

  fetchData(api);
}

// fetch data function to enter the returned wether data in the DOM
function fetchData(url) {
  fetch(url) 
    .then(response => {
    return response.json();
    })
    .then(data => {
      const { main, name, weather } = data; 
      const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]}@4x.png`;
      const div = document.querySelector(".dynamic-content");
      const divContent = `<div class="weather-data">
        <div class="location">
          <h2>${name}</h2>
          <p>${timeManage(todayDateTime)}</p>
        </div>
        <div class="temperature-data">
          <p class="date">${dateManage(todayDateTime)}</p>
          <div class="temperature">
            <p><span class="temp">${Math.floor(main.temp)}</span>&#8451;</p>
            <span><img src="${icon}"></span>
          </div>
          <p class="temperature-description">${weather[0].description}</p>
        </div>
      </div>`;

      div.innerHTML = divContent;

      let searchHistory = JSON.parse(localStorage.getItem(searchinput)) || [];
      searchHistory.push({ main, name, weather });
  
    
      localStorage.setItem(searchinput, JSON.stringify(searchHistory)); 

    })
    .catch(() => {
      msg.textContent = "Please enter a valid city or check whether you are online";
    });
}

function getWeatherData() {
  let searchHistory = JSON.parse(localStorage.getItem(searchinput)) || [];

  searchHistory.forEach((searchinput) => {
    const icon = `https://openweathermap.org/img/wn/${searchinput.weather[0]["icon"]}@4x.png`;
      const div = document.querySelector(".dynamic-content");
      const divContent = `<div class="weather-data">
        <div class="location">
          <h2>${searchinput.name}</h2>
          <p>${timeManage(todayDateTime)}</p>
        </div>
        <div class="temperature-data">
          <p class="date">${dateManage(todayDateTime)}</p>
          <div class="temperature">
            <p><span class="temp">${Math.floor(searchinput.main.temp)}</span>&#8451;</p>
            <span><img src="${icon}"></span>
          </div>
          <p class="temperature-description">${searchinput.weather[0].description}</p>
        </div>
      </div>`;

      div.innerHTML = divContent;
  });
}


// add date in the DOM acording to the format month,date,year
function dateManage(arg) {
  let months = [ "January", "February", "March", "April","May", "June", "July", "August", "September", "Octomber", "November", "December" ];
  let year = arg.getFullYear();
  let month = months[arg.getMonth()];
  let date = arg.getDate();

  return `${month} ${date} ${year}`;
}

// add time in the DOM according to the format 12.00
function timeManage(arg) {
  let hr = arg.getHours();
  let min = arg.getMinutes();

  return `${hr}:${min}`;
}

// registering service worker
if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then((reg) => console.log('service worker registerd', reg))
    .catch((err) => console.log('service worker not registerd', err))
}