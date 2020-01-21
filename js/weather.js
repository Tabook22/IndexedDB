window.addEventListener("load",()=>{
    let long;
    let lat;

    let temperatureDescription=document.querySelector(".temprature-description");
    let temperatureDegree=document.querySelector(".temperature-degree");
    let locationTimezone=document.querySelector(".location-timezone");
    let temperatureSection =document.querySelector(".temperature");
    let temperatureSpan =document.querySelector(".temperature span");

    //check to see of the geolocation is enabled in the user browser
    if(navigator.geolocation){
        //if it is enabled we need to get the current position of the user
        navigator.geolocation.getCurrentPosition(myPosition =>{
        long=myPosition.coords.longitude;
        lat=myPosition.coords.latitude;

        const proxy="https://cors-anywhere.herokuapp.com/"; //this to prevent corss-origin issues
        const api=`${proxy}https://api.darksky.net/forecast/0db93474ead71c8820e4a981e5de67ce/${lat},${long}`;
        
        fetch(api)
            .then(response=>{
                return response.json();
            })
            .then(data =>{
                const {
                    temperature, summary, icon } =data.currently;
                // Set DOM Elements From  the API
                
                temperatureDegree.textContent=temperature;
                temperatureDescription.textContent=summary;
                locationTimezone.textContent=data.timezone;

                //formula for celsius
                let celsius=(temperature-32)*(5/9);
                //Set Icon
                setIcons(icon, document.querySelector(".icon"));


            //Change the degree from F to C
            temperatureSection.addEventListener('click', ()=>{
                if(temperatureSpan.textContent==="F"){
                    temperatureSpan.textContent="C";
                    temperatureDegree.textContent=Math.floor(celsius);
                }else{
                    temperatureSpan.textContent="F";
                    temperatureDegree.textContent=temperature;
                }
            });
            });
        });
    }else{
        alert("Your Browser Does't Support GeoLocation");
    }

    function setIcons(icon, iconID){
        const skycons=new Skycons({color:"blue"});
        const currentIcon=icon.replace(/-/g,"_").toUpperCase();
        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon]);

    }
});