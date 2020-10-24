// get input element in the header by class name
const input = document.querySelector(".cities");
const form = document.querySelector(".form-inline");
const ul = document.querySelector(".panel");
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

function getWeatherData() {
  let searchHistory = JSON.parse(localStorage.getItem('key')) || [];

  searchHistory.forEach((key) => {
    const icon = `https://openweathermap.org/img/wn/${key.weather[0]["icon"]}@4x.png`;
      
    const li = document.createElement("li");
      li.className = "panel-body";
      li.innerHTML = `
      <div class="row">    
        <br>
        <div class="col-md-2 col-sm-3 text-center">
          <a class="story-title" href="#"><img alt="" src="${icon}" style="width:100px;height:100px" class="img-circle"></a>
        </div>
        <div class="col-md-10 col-sm-9">
          <h3>${key.name}</h3>
          <div class="row">
            <div class="col-xs-9">
              <h4><span class="label label-default">${dateManage(todayDateTime)}</span><span class="label label-default">${timeManage(todayDateTime)}</span></h4>
              <h4><span class="label label-default">${key.weather[0].description}</span> <span class="label label-default">${Math.floor(key.main.temp)}&#176;C</span></h4>
            </div>
            <div class="col-xs-3"></div>
          </div>
          <br><br>
        </div>
      </div>
      <hr>`;
    ul.appendChild(li);
  });
}

// add an event that in order to get users input to display weather data according to their search input
form.addEventListener('submit', e => {
  if(input.value === '') {
    alert("input a name of a city");
  }
    searchinput = input.value;
    getInputValue(searchinput);

  input.value = '';
  e.preventDefault();
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
      const li = document.createElement("li");
      li.className = "panel-body";
      li.innerHTML = `
      <div class="row">    
        <br>
        <div class="col-md-2 col-sm-3 text-center">
          <a class="story-title" href="#"><img alt="" src="${icon}" style="width:100px;height:100px" class="img-circle"></a>
        </div>
        <div class="col-md-10 col-sm-9">
          <h3>${name}</h3>
          <div class="row">
            <div class="col-xs-9">
              <h4><span class="label label-default">${dateManage(todayDateTime)}</span><span class="label label-default">${timeManage(todayDateTime)}</span></h4>
              <h4><span class="label label-default">${weather[0].description}</span> <span class="label label-default">${Math.floor(main.temp)}&#176;C</span></h4>
            </div>
            <div class="col-xs-3"></div>
          </div>
          <br><br>
        </div>
      </div>
      <hr>`;
      ul.appendChild(li);

      storeHistoryLocalStorage({ main, name, weather });

    })
    .catch((err) => {
      console.log(err);
    });
}

function storeHistoryLocalStorage({ main, name, weather }) {
  let searchHistory = JSON.parse(localStorage.getItem('key')) || [];
      searchHistory.push({ main, name, weather });
  
    
      localStorage.setItem('key', JSON.stringify(searchHistory)); 
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