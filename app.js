const input = document.querySelector(".cities");

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
  let time = document.querySelector(".location > p");
  let date = document.querySelector(".date");
  let todayTime = new Date();
  let todayDate = new Date();
  let city = document.querySelector("h2");
  let temp = document.querySelector(".temp");
  let icon = document.querySelector(".temperature > span img");
  let description =document.querySelector(".temperature-description");

  fetch(url) 
    .then(response => {
      return response.json();
    })
    .then(data => {
      time.textContent = timeManage(todayTime);
      date.textContent = dateManage(todayDate);
      city.textContent = data.name;
      temp.textContent = Math.floor(data.main.temp);
      description.textContent = data.weather[0].description;
      icon.setAttribute("src", `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
      icon
    })
}

function dateManage(arg) {
  let months = [ "January", "February", "March", "April","May", "June", "July", "August", "September","Octomber", "November", "December" ];
  let year = arg.getFullYear();
  let month = months[arg.getMonth()];
  let date = arg.getDate();

  return `${month} ${date} ${year}`;
}

function timeManage(arg) {
  let hr = arg.getHours();
  let min = arg.getMinutes();

  return `${hr}:${min}`;
}

