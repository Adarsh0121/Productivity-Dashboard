function openFeatures() {
  let allElems = document.querySelectorAll(".elem");
  let fullElemPage = document.querySelectorAll(".fullElem");
  let fullElemPageBackBtn = document.querySelectorAll(".fullElem .back");

  allElems.forEach(function (elem) {
    elem.addEventListener("click", function () {
      // console.log(elem.id);
      fullElemPage[elem.id].style.display = "block";
    });
  });

  fullElemPageBackBtn.forEach(function (back) {
    back.addEventListener("click", function () {
      fullElemPage[back.id].style.display = "none";
    });
  });
}
openFeatures();

//---------------------TODO LIST---------------------
function todoList() {
  var currentTask = [];
  if (localStorage.getItem("currentTask")) {
    currentTask = JSON.parse(localStorage.getItem("currentTask"));
  } else {
    console.log("Task list is empty");
  }

  function renderTask() {
    let allTask = document.querySelector(".allTask");

    let sum = "";

    currentTask.forEach(function (elem, idx) {
      sum += `
                <div class="task">
                            <h5>${elem.task} <span class=${elem.imp}>imp</span></h5>
                            <button id=${idx}>Mark as Completed </button>
                </div>
            `;
    });
    allTask.innerHTML = sum;

    localStorage.setItem("currentTask", JSON.stringify(currentTask));
    document.querySelectorAll(".task button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        currentTask.splice(btn.id, 1);
        renderTask();
      });
    });
  }
  renderTask();

  let form = document.querySelector(".addTask form");
  let taskInput = document.querySelector(".addTask form #task-input");
  let taskDetailsInput = document.querySelector(".addTask form textarea");
  let taskCheckbox = document.querySelector(".addTask form #check");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // console.log(taskInput.value);
    // console.log(taskDetailsInput.value);
    // console.log(taskCheckbox.checked);
    currentTask.push({
      task: taskInput.value,
      details: taskDetailsInput.value,
      imp: taskCheckbox.checked,
    });
    renderTask();

    taskInput.value = "";
    taskDetailsInput.value = "";
    taskCheckbox.checked = false;
  });
}
todoList();

//---------------------DAILY PLANNER---------------------
function dailyPlanner() {
  var dayPlanData = JSON.parse(localStorage.getItem("dayPlanData")) || {};

  var dayPlanner = document.querySelector(".day-planner");

  var hours = Array.from({ length: 18 }, (elem, idx) => {
    return `${6 + idx}:00 - ${7 + idx}:00`;
  });

  var wholeDaySum = "";
  hours.forEach(function (elem, idx) {
    var savedData = dayPlanData[idx] || "";
    wholeDaySum =
      wholeDaySum +
      `
                                <div class="day-planner-time">
                                      <p>${elem}</p>
                                      <input id=${idx} type="text" placeholder="..." value="${savedData}">
                                </div>
                              `;
  });

  dayPlanner.innerHTML = wholeDaySum;

  var dayPlannerInput = document.querySelectorAll(".day-planner input");

  dayPlannerInput.forEach(function (elem, idx) {
    elem.addEventListener("input", function () {
      dayPlanData[elem.id] = elem.value;

      localStorage.setItem("dayPlanData", JSON.stringify(dayPlanData));
    });
  });
}
dailyPlanner();

//---------------------MOTIVATIONAL QUOTE---------------------
function motivationalQuote() {
  var motivationQuoteContent = document.querySelector(".motivation-2 h1");
  var motivationAuthor = document.querySelector(".motivation-3 h2");

  async function fetchQuote() {
    let response = await fetch("https://dummyjson.com/quotes/random");
    let data = await response.json();
    motivationQuoteContent.innerHTML = data.quote;
    motivationAuthor.innerHTML = data.author;
  }
  fetchQuote();
}
motivationalQuote();

//---------------------POMODORO TIMER---------------------
function pomodoroTimer() {
  let timer = document.querySelector(".pomo-timer h1");
  var startBtn = document.querySelector(".pomo-timer .start-timer");
  var pauseBtn = document.querySelector(".pomo-timer .pause-timer");
  var resetBtn = document.querySelector(".pomo-timer .reset-timer");
  var session = document.querySelector(".pomodoro-fullpage .session");
  var isWorkSession = true;

  let timerInterval = null;

  let totalSeconds = 25*60;

  function updateTimer() {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    timer.innerHTML = `${String(minutes).padStart("2", "0")}:${String(seconds).padStart("2", "0")}`;
  }

  function startTimer() {
    clearInterval(timerInterval);

    if (isWorkSession) {
      timerInterval = setInterval(function () {
        if (totalSeconds > 0) {
          totalSeconds--;
          updateTimer();
        } else {
          isWorkSession = false;
          clearInterval(timerInterval);
          timer.innerHTML = "05:00";
          session.innerHTML = "Take a Break";
          session.style.backgroundColor = "var(--blue)";
          totalSeconds = 5 * 60;
        }
      }, 1000);
    } else {
      timerInterval = setInterval(function () {
        if (totalSeconds > 0) {
          totalSeconds--;
          updateTimer();
        } else {
          isWorkSession = true;
          clearInterval(timerInterval);
          timer.innerHTML = "25:00";
          session.innerHTML = "Work Session";
          session.style.backgroundColor = "var(--green)";
          totalSeconds = 25 * 60;
        }
      }, 1000);
    }
  }
  function pauseTimer() {
    clearInterval(timerInterval);
  }
  function resetTimer() {
    totalSeconds = 25 * 60;
    clearInterval(timerInterval);
    updateTimer();
  }

  startBtn.addEventListener("click", startTimer);
  pauseBtn.addEventListener("click", pauseTimer);
  resetBtn.addEventListener("click", resetTimer);
}
pomodoroTimer();

//---------------------WEATHER FUNCTIONALITY---------------------
function weatherFunctionality() {
  var latitude = 29.47;
  var longitude = 77.70;

  var header1Time = document.querySelector(".header1 h1");
  var header1Date = document.querySelector(".header1 h2");
  var header2Temp = document.querySelector(".header2 h2");
  var header2Condition = document.querySelector(".header2 h4");
  var precipitation = document.querySelector(".header2 .precipitation");
  var humidity = document.querySelector(".header2 .humidity");
  var wind = document.querySelector(".header2 .wind");

  function weatherText(code) {
    if (code === 0) return "Clear";
    if (code <= 3) return "Cloudy";
    if (code <= 48) return "Fog";
    if (code <= 67) return "Rain";
    if (code <= 77) return "Snow";
    if (code <= 82) return "Showers";
    return "Thunderstorm";
  }

  async function weatherAPICall() {
    var response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code`,
    );
    var data = await response.json();

    header2Temp.innerHTML = `${data.current.temperature_2m}°C`;
    header2Condition.innerHTML = weatherText(data.current.weather_code);
    precipitation.innerHTML = `Feels like: ${data.current.apparent_temperature}°C`;
    humidity.innerHTML = `Humidity: ${data.current.relative_humidity_2m}%`;
    wind.innerHTML = `Wind: ${data.current.wind_speed_10m} km/h`;
  }
  weatherAPICall();

  function timeDate() {
    let totalDaysOfWeek = [
      "Sunday",
      "Monday",
      "tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let totalMonths = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    var date = new Date();
    var dayOfWeek = totalDaysOfWeek[date.getDay()];
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var tarik = date.getDate();
    var month = totalMonths[date.getMonth()];
    var year = date.getFullYear();

    header1Date.innerHTML = `${tarik} ${month}, ${year}`;

    if (hours > 12) {
      header1Time.innerHTML = `${dayOfWeek},${String(hours - 12).padStart("2", "0")}:${String(minutes).padStart("2", "0")}:${String(seconds).padStart("2", "0")} pm`;
    } else {
      header1Time.innerHTML = `${dayOfWeek},${String(hours).padStart("2", "0")}:${String(minutes).padStart("2", "0")}:${String(seconds).padStart("2", "0")} am`;
    }
  }
  setInterval(() => {
    timeDate();
  }, 1000);
}
weatherFunctionality();

//---------------------CHANGE THEME---------------------
function changeTheme() {
  var theme = document.querySelector(".theme");
  var rootElement = document.documentElement;

  var flag = 0;
  theme.addEventListener("click", function () {
    if (flag == 0) {
      rootElement.style.setProperty("--pri", "#F8F4E1");
      rootElement.style.setProperty("--sec", "#222831");
      rootElement.style.setProperty("--tri1", "#948979");
      rootElement.style.setProperty("--tri2", "#393E46");
      flag = 1;
    } else if (flag == 1) {
      rootElement.style.setProperty("--pri", "#F1EFEC");
      rootElement.style.setProperty("--sec", "#030303");
      rootElement.style.setProperty("--tri1", "#D4C9BE");
      rootElement.style.setProperty("--tri2", "#123458");
      flag = 2;
    } else if (flag == 2) {
      rootElement.style.setProperty("--pri", "#F8F4E1");
      rootElement.style.setProperty("--sec", "#381c0a");
      rootElement.style.setProperty("--tri1", "#FEBA17");
      rootElement.style.setProperty("--tri2", "#74512D");
      flag = 0;
    }
  });
}

changeTheme();
