async function fetchWeather() {
    const url = 'https://open-weather13.p.rapidapi.com/city/melbourne';
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'f6faa0e2e8msh79ea813c1474bf8p1fadf8jsnf621bf2564d9',
        'X-RapidAPI-Host': 'open-weather13.p.rapidapi.com'
      }
    };
  
    try {
      const response = await fetch(url, options);
      const result = await response.text();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
  
  // Call the async function to initiate the fetching process
  fetchWeather();
  