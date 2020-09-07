// get input element in the header by class name
const input = document.querySelector(".cities");

// initiate a window event trigerd after the browser loads
window.addEventListener("load", () => {
  let x;
  let y;

  // DOM load event
  document.addEventListener('DOMContentLoad', getCities())

  // get the users location
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      x = position.coords.longitude;
      y = position.coords.latitude;

      const api = `http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=341f3a5ad73fcf20c2dee19a9f0b6b90&units${x},${y}&units=metric`;

      // fetch users current wether data according to their location
      fetchData(api);
    })
  }
});

// add an event that in order to get users input to display weather data according to their search input
input.addEventListener('keypress', e => {
  if(e.keyCode == 13) {
    getInputValue(input.value);
    storeInputInLocalStorage(input.value);
  }
});
 
function getInputValue(query) {
  const api = `http://api.openweathermap.org/data/2.5/weather?q=${query}&APPID=341f3a5ad73fcf20c2dee19a9f0b6b90&units=metric`;

  fetchData(api);
  storeInputInLocalStorage(api);
}

// fetch data function to enter the returned wether data in the DOM
function fetchData(url) {
  let time = document.querySelector(".location > p");
  let date = document.querySelector(".date");
  let todayDateTime = new Date();
  let city = document.querySelector("h2");
  let temp = document.querySelector(".temp");
  let icon = document.querySelector(".temperature > span img");
  let description =document.querySelector(".temperature-description");

  fetch(url) 
    .then(response => {
      return response.json();
    })
    .then(data => {
      time.textContent = timeManage(todayDateTime);
      date.textContent = dateManage(todayDateTime);
      city.textContent = data.name;
      temp.textContent = Math.floor(data.main.temp);
      description.textContent = data.weather[0].description;
      icon.setAttribute("src", `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
      icon
    })
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

// store user search input in the local storage
function storeInputInLocalStorage(data) {
  let weatherData;
  if(localStorage.getItem('weatherData') === null) {
    weatherData = [];
  } else {
    weatherData = JSON.parse(localStorage.getItem('weatherData'));
  }

  weatherData.push(data);

  localStorage.setItem('weatherData', JSON.stringify(weatherData));
}

// get loca storage items
function getWeatherData() {
  let weatherData;
  if(localStorage.getItem('weatherData') === null) {
    weatherData = [];
  } else {
    weatherData = JSON.parse(localStorage.getItem('weatherData'));
  }

  weatherData.forEach(function(data) {
    getInputValue(data);
  });
}