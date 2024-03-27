import axios from "axios"

function timestampToMinutes(timestamp) {
    const [dateString, timeString] = timestamp.split(" - ");
    const [month, day, year] = dateString.split("/");
    const [hours, minutes] = timeString.split(":");
    const timestampDate = new Date(year, month - 1, day, hours, minutes); // Months are 0-indexed in JavaScript Date constructor
    return timestampDate.getTime() / (1000 * 60); // Convert milliseconds to minutes
}

async function formatObserved (istr) {
    // let {data} = await axios.get("https://cdn.tidesandcurrents.noaa.gov/ports/plots/n06010_cu_obs_72.html")
    let {data} = await axios.get(istr)
    data = data.match(/[^\r\n]+/g);
    data = data.slice(26, -1);
    const parsedData = []
    for (let i = 0; i < data.length; i++) {
        let rawTimestamp = ((data[i]).slice(0, 16)).split(" ")
        rawTimestamp[0] = rawTimestamp[0].split("/")
        const parsedTimestamp = rawTimestamp[0][1] + "/" + rawTimestamp[0][2] + "/" + rawTimestamp[0][0] + " - " + rawTimestamp[1]
        parsedData.push([parsedTimestamp , Number((data[i].slice(30,-5)).trim())])
    }
    console.log(parsedData)
    return parsedData
}

async function formatPredicted (istr, timestamp) {
     let {data} = await axios.get("https://cdn.tidesandcurrents.noaa.gov/ports/plots/n06010_cu_pred_24.html")
    //let {data} = await axios.get(istr)
    data = data.match(/[^\r\n]+/g);
    data = data.slice(23, -1);
    const parsedData = []
    for (let i = 0; i < data.length; i++) {
        // data[i] = Number((data[i].slice(20)).trim());
        // data[i] = ((data[i]).slice(0, 16));
        let rawTimestamp = ((data[i]).slice(0, 16)).split(" ")
        rawTimestamp[0] = rawTimestamp[0].split("/")
        const parsedTimestamp = rawTimestamp[0][1] + "/" + rawTimestamp[0][2] + "/" + rawTimestamp[0][0] + " - " + rawTimestamp[1]
        parsedData.push([parsedTimestamp , Number((data[i].slice(20)).trim())])
    }
    
    const timeDelta = timestampToMinutes(parsedData[0][0]);
    for (let i = 0; i < parsedData.length; i++) {
        console.log(timestampToMinutes(parsedData[i][0]))
        parsedData[i][0] = timestampToMinutes(parsedData[i][0]) - timeDelta;
    }
    console.log(parsedData);
    return parsedData;
    // return parsedData
}
// formatObserved();
module.exports = { formatObserved, formatPredicted };
formatPredicted("https://cdn.tidesandcurrents.noaa.gov/ports/plots/n06010_cu_pred_24.html");