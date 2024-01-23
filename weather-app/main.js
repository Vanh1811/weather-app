document.addEventListener('DOMContentLoaded', function (){
    const weatherForm = document.getElementById('weatherForm')
    const locationInput = document.getElementById('locationInput')
    const loadingElement = document.getElementById('loading')
    const weatherInfo = document.getElementById('weatherInfo')

    weatherForm.addEventListener('submit', function (event){
        event.preventDefault()
        const location = locationInput.value

        if (location) {
            loadingElement.style.display = 'block'
            getWeather(location)
                .then(processWeatherData)
                .then(displayWeatherInfo)
                .catch(handleError)
                .finally(() => {
                    loadingElement.style.display ='none'
                })
        }
    })

    async function getWeather(location){

        const apiUrl = `http://api.weatherapi.com/v1/current.json?key=21d1391b68404bba99f124618241601&q=${location}&aqi=yes`

        try{
            const response = await fetch(apiUrl, {mode: 'cors'})
            const weatherData = await response.json();
            return weatherData
        }
        catch (error){
            console.error('Error fetching data', error)
            throw error
        }
    }

    function processWeatherData(JsonData) {
        console.log('Raw weather data:', JsonData);

        if (JsonData.current && JsonData.current.temp_c && JsonData.location && JsonData.location.name) {
            const processedData = {
                temperature: JsonData.current.temp_c,
                description: JsonData.current.condition.text,
                location: JsonData.location.name
            };
            return processedData;
        } else {
            throw new Error('Invalid weather data structure');
        }
    }

    function displayWeatherInfo(processedData) {
        weatherInfo.innerHTML = `
            <h2>Weather Information</h2>
            <p>Temperature: ${processedData.temperature}°C<br>
            Description: ${processedData.description}</p>
            <p>Location: ${processedData.location}</p>
        `;
    }


    function handleError (error){
        console.log('Error:', error)
        weatherInfo.innerHTML = '<p>Error fetching weather data. Please try again.</p>'
    }
})