let metrosContainer = document.querySelector('.metro_list')
let linesContainer = document.querySelector('.lines_list')
let schedulesContainer = document.querySelector('.schedules')
let metrosList = []
let linesList = []

async function fetchData() {
    const response = await fetch('https://api-ratp.pierre-grimaud.fr/v4/lines/metros')
    return await response.json()
}

async function fetchLinesData(code) {
    const response = await fetch('https://api-ratp.pierre-grimaud.fr/v4/stations/metros/' + code)
    return await response.json()
}

async function fetchSchedules(type, line, station) {
    const response = await fetch('https://api-ratp.pierre-grimaud.fr/v4/schedules/' + type + '/' + line + '/' + station + '/A+R')
    return await response.json()
}

fetchData().then(response => {
    metrosList = response
    metrosList.result.metros.map(metro => 
            metrosContainer.innerHTML += '<option value="' + metro.code + '">' + metro.name + '</option>'
    )
})

metrosContainer.addEventListener('change', function () {
    let selectedValue = metrosContainer.value
    linesContainer.innerHTML = ""
    fetchLinesData(selectedValue).then(response => {
        linesList = response.result.stations
        linesList.map(line => 
            linesContainer.innerHTML += '<option value="' + line.slug + '">' + line.name + '</option>'
        )
    })
});

linesContainer.addEventListener('change', function() {
    let selectedLine = metrosContainer.value
    let selectedStation = linesContainer.value
    schedulesContainer.innerHTML = ''
    fetchSchedules('metros', selectedLine, selectedStation).then(
        response => {
            let schedulesList = response.result.schedules
            schedulesContainer.innerHTML += '<ul>'
            schedulesList.map(line => 
                schedulesContainer.innerHTML += '<li>'+ line.message + ' Destination :' + line.destination + "</li>"
            )
            schedulesContainer.innerHTML += '</ul>'
        }
    )
})

setInterval(function(){
    if(metrosContainer.value && linesContainer.value){
        let selectedLine = metrosContainer.value
        let selectedStation = linesContainer.value
        schedulesContainer.innerHTML = ''
        fetchSchedules('metros', selectedLine, selectedStation).then(
            response => {
                let schedulesList = response.result.schedules
                schedulesContainer.innerHTML += '<ul>'
                schedulesList.map(line => 
                    schedulesContainer.innerHTML += '<li>'+ line.message + ' Destination :' + line.destination + "</li>"
                )
                schedulesContainer.innerHTML += '</ul>'
            }
        )
    }
},30000)
