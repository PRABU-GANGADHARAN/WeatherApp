$(function() {
    let data;
    let lon, lat;
    let cityName;

    function updateDay(data) {
        let { avgtemp_c, maxtemp_c, mintemp_c, avghumidity, uv, maxwind_kph, avgvis_km } = data.day
        let { sunset, sunrise } = data.astro
        let { icon, text } = data.day.condition

        $('#temp').text(Math.round(avgtemp_c) + '°C')
        $('#max-temp').text(Math.round(maxtemp_c) + '°C')
        $('#min-temp').text(Math.round(mintemp_c) + '°C')
        $("#temp-icon").attr("src", "https:"+icon)
        $('#description').text(text)
        $('#humidity').text(avghumidity + '%')
        $('#uv').text(uv)
        $('#wind').text(maxwind_kph + 'km/h')
        $('#vis').text(avgvis_km + 'km')
        $('#sunrise').text(sunrise)
        $('#sunset').text(sunset)
        updateHour(data.hour)
    }

    function updateHour(data) {
        $('#hourly').html('')

        data.forEach((hdata) => {
            let { chance_of_rain, time, temp_c } = hdata
            time = time.split(' ')[1]
            let icon = "https:"+ hdata.condition.icon
            let html = `
            <div class="card p-0  mb-4 w-auto border-0 bg-transparent text-center ">
                <div class=" card-body p-2 border-start border-end ">
                <h1 class="card-title m-0">${time}</h1>
                <img src="${icon}"> 
                <p class="card-text fs-3 m-0">${temp_c}</p>
                <p class="card-text fs-6">💧${chance_of_rain}%</p>
                </div>
            </div> 
            `
            $('#hourly').append(html)
        })
    }

    function myMap(lt,lg){
  // The location of Uluru
  const cl = { lat:lt , lng: lg};
  // The map, centered at Uluru
  const map = new google.maps.Map(document.getElementById("googleMap"), {
    zoom: 4,
    center: cl,
  });
  // The marker, positioned at Uluru
  const marker = new google.maps.Marker({
    position: cl,
    map: map,
  });
}

    function update(day) {
        let location = $('#search').val()

        fetch(`https://api.weatherapi.com/v1/forecast.json?key=fdf14e7fe020476f8b832800221604&q=${location}&days=4&aqi=no&alerts=no`)
            .then(res => res.json())
            .then(d => {
                let cityName = d.location.name + ', ' + d.location.country
                $('#locat').text(cityName)
                updateDay(d.forecast.forecastday[day])
                myMap(d.location.lat,d.location.lon)
            })
    }


    update(0);
    $('#search-btn').click(() => update(0));
    $('#day1').click(() => update(0));
    $('#day2').click(() => update(1));
    $('#day3').click(() => update(2));
});
