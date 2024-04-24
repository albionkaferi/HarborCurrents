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
        parsedData.push([parsedTimestamp , Number((data[i].slice(30,-5)).trim())]);
    }
    return parsedData
}

async function formatPredicted (istr, timestamp) {
    let {data} = await axios.get("https://cdn.tidesandcurrents.noaa.gov/ports/plots/n06010_cu_pred_24.html");
    //let {data} = await axios.get(istr)
    data = data.match(/[^\r\n]+/g);
    data = data.slice(23, -1);
    const parsedData = []
    for (let i = 0; i < data.length; i++) {
        // data[i] = Number((data[i].slice(20)).trim());
        // data[i] = ((data[i]).slice(0, 16));
        let rawTimestamp = ((data[i]).slice(0, 16)).split(" ");
        rawTimestamp[0] = rawTimestamp[0].split("/");
        const parsedTimestamp = rawTimestamp[0][1] + "/" + rawTimestamp[0][2] + "/" + rawTimestamp[0][0] + " - " + rawTimestamp[1];
        parsedData.push([parsedTimestamp , Number((data[i].slice(20)).trim())]);
    }
    
    const originalTime = parsedData[0][0];
    const timeDelta = timestampToMinutes(originalTime);
    for (let i = 0; i < parsedData.length; i++) {
        parsedData[i][0] = timestampToMinutes(parsedData[i][0]) - timeDelta;
    }
    return {
        data:parsedData,
        originalTime:originalTime
    };
    // return parsedData
}

async function formatSeries() {
    let response = await axios.get("http://ec2-54-234-213-6.compute-1.amazonaws.com:8080/series");
    let {start, end, data} = response.data;
    start = new Date(start);
    end = new Date(end);
    console.log(start, end);
    return data;
}

async function formatSeries2() {
    let response = await axios.get("http://ec2-54-234-213-6.compute-1.amazonaws.com:8080/series");
    let {start, end, data} = response.data;
    start = new Date(start);
    end = new Date(end);
    const step = (end - start) / (data.length-1);

    const data_points = [];
    for (let i = 0; i < data.length; i++) {
        const point = data[i];
        const date = new Date(start.getTime() + step * i);
        data_points.push([point, date]);
    }
    return data_points;
}

async function formatPredicted2 () {
    let {data} = await axios.get("https://cdn.tidesandcurrents.noaa.gov/ports/plots/n06010_cu_pred_24.html");
    data = data.match(/[^\r\n]+/g);
    data = data.slice(23, -1);
    
    const data_points = [];
    for (let i = 0; i < data.length; i++) {
        const [pdate, ptime, ptz, pamount] = data[i].replace("  ", " ").split(" ");
        const [pyear, pmonth, pday] = pdate.split("/");
        const [phour, pminute] = ptime.split(":");
        const date_string = `${pyear}-${pmonth}-${pday}T${phour}:${pminute}:00.000${ptz === "EDT" ? "-04:00" : "-05:00"}`;
        const date_obj = new Date(Date.parse(date_string));
        data_points.push([Number(pamount), date_obj]);
    }
    
    return data_points;
}

async function formatBoth() {
    const series = await formatSeries2();
    const predicted = await formatPredicted2();
    const date1 = series[0][1];
    const date2 = predicted[0][1];

    // trim left
    if (series[0][1] < predicted[0][1]) {
        while (series[0][1] < predicted[0][1]) {
            series.shift();
        }
    }
    else if (series[0][1] > predicted[0][1]) {
        while (series[0][1] > predicted[0][1]) {
            predicted.shift();
        }
    }
    
    // trim right
    if (series[series.length-1][1] > predicted[predicted.length-1][1]) {
        while (series[series.length-1][1] > predicted[predicted.length-1][1]) {
            series.pop();
        }
    }
    else if (series[series.length-1][1] < predicted[predicted.length-1][1]) {
        while (series[series.length-1][1] < predicted[predicted.length-1][1]) {
            predicted.pop();
        }
    }

    // get start date label
    const dateObj = series[0][1];
    const numToDig = (num) => ("0" + `${num}`).slice(-2);

    const options = { day:"2-digit", year:"numeric", month:"2-digit", hour:"2-digit", minute:"2-digit", hour12:false };
    const originalDate = dateObj.toLocaleDateString("en-US", options);

    // get label list
    const diff_hours = (d1, d2) => Math.floor((d2-d1) / 3600000);

    let start_time = series[0][1];
    let current_diff = 0;
    const labels = ["0"];
    for (const point of series) {
        const diff = diff_hours(start_time, point[1]);
        if (diff > current_diff) {
            labels.push(`${diff}`);
            current_diff = diff;
        }
        else labels.push("");
    }

    // return the values
    return {series, predicted, labels, originalDate};
}


// formatObserved();
module.exports = { formatObserved, formatPredicted, formatSeries, formatBoth };