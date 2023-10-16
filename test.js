async function getData() {
    const date = new Date()
    
    const hour = date.getHours()

    const today = date.getDate()
    const tomorrow = date.getDate() + 1

    const month = date.getMonth() + 1

    const year = date.getFullYear()

    console.log(`Data set from: ${year} ${today}-${month} / ${tomorrow}-${month}`)

    const todaysDataSet = await fetch(`https://www.elprisenligenu.dk/api/v1/prices/${year}/${month}-${today}_DK1.json`)
    const tomorrowsDataSet = await fetch(`https://www.elprisenligenu.dk/api/v1/prices/${year}/${month}-${tomorrow}_DK1.json`)

    const todaysData = await todaysDataSet.json()
    const tomrrowsData = await tomorrowsDataSet.json()

    const data = todaysData.concat(tomrrowsData)

    return data.map(d => { return { start: d["time_start"], end: d["time_end"], price: d["DKK_per_kWh"] } } )
        .filter(d => {
            const startDate = new Date(d.start)
            const startHour = startDate.getHours()
            const startDay = startDate.getDate() + 1

            if (startDay >= today && startHour >=  hour) {
                return d
            }
        })
}

async function findCheapest() {
    const data = await getData()

    // data.forEach(d => {
    //     const curr = new Date(d.start).getHours() + 1
    //     console.log(curr)
    // })
    console.log(data)
    return data.sort((a, b) => a.price - b.price)[0]
}

findCheapest().then(c => console.log(c)) 
