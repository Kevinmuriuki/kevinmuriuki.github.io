const input = document.querySelector(".cities");
let time = document.querySelector(".location > p");
let date = document.querySelector(".date");

window.addEventListener("load", () => {
  let x;
  let y;

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      x = position.coords.longitude;
      y = position.coords.latitude;

      const api = `http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=341f3a5ad73fcf20c2dee19a9f0b6b90&${x},${y}&units=metric`;

      fetchData(api);
    })
  }
});

input.addEventListener('keypress', e => {
  if(e.keyCode == 13) {
    getInputValue(input.value);
  }
});
 
function getInputValue(query) {
  const api = `http://api.openweathermap.org/data/2.5/weather?q=${query}&APPID=341f3a5ad73fcf20c2dee19a9f0b6b90&units=metric`;

  fetchData(api);
}

function fetchData(url) {
  let city = document.querySelector("h2");
  let temp = document.querySelector(".temp");
  let icon = document.querySelector(".temperature > span img");
  let description =document.querySelector(".temperature-description");

  fetch(url) 
    .then(response => {
      return response.json();
    })
    .then(data => {
      city.textContent = data.name;
      temp.textContent = Math.floor(data.main.temp);
      description.textContent = data.weather[0].description;
      icon.setAttribute("src", `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
      icon
    })
}

