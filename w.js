

 const userTab= document.querySelector("[data-userWeather]")
  const searchTab= document.querySelector("[data-searchWeather]")
  const userContainer=document.querySelector(".weather-container")
   const grantaccesscontainer = document.querySelector(".grant-location-container")
   const searchform = document.querySelector("[data-searchForm]")
   const loadingScreen = document.querySelector(".loading-container")
   const useinfocontainer= document.querySelector(".user-info-container")
    // initially variables need 
      let currentTab= userTab;
      const API_KEY = "818db2f8f3d27398512222e7579bb3d9";
       currentTab.classList.add("current-tab")  
       getfromsessionstorage();
        //   swithing function 
         function switchTab(clickedTab)
         { 
            if(clickedTab != currentTab)
            {
                currentTab.classList.remove("current-tab")
                currentTab= clickedTab;
                currentTab.classList.add("current-tab") 
                 if(!searchform.classList.contains("active"))
                 {
                    useinfocontainer.classList.remove("active")
                    grantaccesscontainer.classList.remove("active")
                    searchform.classList.add("active")
                      

                 }
                 else{
                    searchform.classList.remove("active")
                    useinfocontainer.classList.remove("active")
                    getfromsessionstorage();
                 }


            }

         }
          
        userTab.addEventListener("click", ()=>{
            //  pass clicked tab 
            switchTab(userTab);
        });
        searchTab.addEventListener("click", ()=>{
            //  pass clicked tsab 
            switchTab(searchTab);
        });
         function getfromsessionstorage(){
            const localcoordinates =sessionStorage.getItem("user-coodinaates")
             if(!localcoordinates)
             {
                grantaccesscontainer.classList.add("active")
             }
             else 
             {
                const coordinates = JSON.parse(localcoordinates);
                fetchuserweatherinfo(coordinates);
             }
         }
async  function  fetchuserweatherinfo(coordinates)
{
    const { lat , lon}= coordinates;
     grantaccesscontainer.classList.remove("active")
     loadingScreen.classList.add("active");
     try{
         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
         
          const data = await  response.json();
           loadingScreen.classList.remove("active")
           useinfocontainer.classList.add("active");
            renderweatherinfo(data);


     }
     catch(err)
     {
       loadingScreen.classList.remove("active")
     }

}
function renderweatherinfo(weatherInfo)
{
    // firstly we have to fetch the elements

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    console.log(weatherInfo);

    // fetch values from weatherINFO object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else
    {
        //hw - show an elert for no ge
        
        alert(" undefined position")
        

    }
}

function showPosition(position)
{
    const userCoordinates = 
    {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchuserweatherinfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchform.addEventListener("submit", (e) => 
{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName ==="")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city)
{
    loadingScreen.classList.add("active");
    useinfocontainer.classList.remove("active");
    grantaccesscontainer.classList.remove("active");

    try
    {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data = await response.json();
        loadingScreen.classList.remove("active");
        useinfocontainer.classList.add("active");
        renderweatherinfo(data);
    }
    catch(err)
    {
        loadingScreen.classList.remove("active");
        useinfocontainer.innerHTML = `download.jpeg`
        console.error("Error fetching user weather information:", err);
    
        
    }
}