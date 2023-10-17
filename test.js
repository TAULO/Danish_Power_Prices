async function getPowerPrices() {
    const date = new Date()

    const currDay = date.getDate()
    const currTomorrow = new Date(date.setDate(currDay + 1)).getDate()
    const currMonth = date.getMonth() + 1

    const hour = date.getHours()
    const today = currDay < 10 ? "0" + currDay : currDay
    const tomorrow = currTomorrow < 10 ? "0" + currTomorrow : currTomorrow
    const month = currMonth < 10 ? "0" + currMonth : currMonth
    const year = date.getFullYear()

    console.log(`Today: ${today}\nTomorrow: ${tomorrow}\nMonth: ${month}`)
    console.log(`Data set from: ${year} ${today}-${month} / ${tomorrow}-${month} ${hour}-`)

    const [todaysDataSet, tomorrowsDataSet] = await Promise.all([
        fetch(`https://www.elprisenligenu.dk/api/v1/prices/${year}/${month}-${today}_DK1.json`),
        fetch(`https://www.elprisenligenu.dk/api/v1/prices/${year}/${month}-${tomorrow}_DK1.json`)
    ]);

    const [todaysData, tomorrowsData] = await Promise.all([
        todaysDataSet.json(),
        tomorrowsDataSet.json()
    ]);

    return todaysData
    .concat(tomorrowsData)
    .reduce((acc, d) => {
        const start = new Date(d["time_start"]);
        if (
            (today === start.getDate() && hour < start.getHours()) ||
            today !== start.getDate()
        ) {
            acc.push({
                start: d["time_start"],
                end: d["time_end"],
                price: d["DKK_per_kWh"]
            });
        }
        return acc;
    }, []);
}

async function logPowerPrices() {
    console.log(await getPowerPrices())
}

async function cheapest() {
    return getPowerPrices().then(data => data.sort((a, b) => a.price - b.price)[0])
}

async function mostExpensive() {
    return getPowerPrices().then(data => data.sort((a, b) => b.price - a.price)[0])
}
// logPowerPrices()
cheapest().then(d => {
    const VAT = d.price * 0.25 // danish VAT = 25%
    console.log((d.price + VAT) * 100) // øre
})
mostExpensive().then(d => {
    const VAT = d.price * 0.25 // danish VAT = 25%
    console.log((d.price + VAT) * 100) // øre
})