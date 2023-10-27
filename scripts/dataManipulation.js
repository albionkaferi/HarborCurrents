// Convert data into usable format


// get average value of an input array, if empty array then default to -999
function arrayAverage(array, def=-999.0) {
    const sum = array.reduce((acc, currVal) => acc + currVal, 0);
    return array.length == 0 ? def : sum / array.length;
}

// get average of array of data points
function averagePoints(pointsArray) {
    const filteredPoints = filterPoints(pointsArray);

    const lat_arr = filteredPoints.map((item) => item[0]);
    const lon_arr = filteredPoints.map((item) => item[1]);
    const u1_arr = filteredPoints.map((item) => item[2]);
    const v1_arr = filteredPoints.map((item) => item[3]);

    if (filteredPoints.length == 0) {
        return [0, 0, -999.0, -999.0];
    }
    return [
        arrayAverage(lat_arr),
        arrayAverage(lon_arr),
        arrayAverage(u1_arr),
        arrayAverage(v1_arr)
    ];
}

// filter points by if they're on land
function filterPoints(pointsArray) {
    return pointsArray.filter((point) => point[2] > -900);
}

// convert point array to point struct
function arrayToMap(array) {
    return {
        'point': {
            'latitude': array[0],
            'longitude': array[1]
        },
        'direction': array[2] != 0 ? Math.atan(array[3] / array[2]) * (180/Math.PI) : 0,
        'magnitude': Math.sqrt(array[2] * array[2] + array[3] * array[3])
    }
}

// reduce data by certain factor
export function averageData(idata, average) {
    if (average == 1) {
        return filterPoints(idata.flat()).map(arrayToMap);
    }

    const rows = Math.ceil(idata.length / average);
    const columns = Math.ceil(idata[0].length / average);

    let out_data = [];
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < columns; j++) {

            let items = idata.slice(i * average, (i+1) * average).map((i_row) => i_row.slice(j * average, (j+1) * average)).flat();
            row[j] = averagePoints(items);
        }
        out_data[i] = row;
    }

    return filterPoints(out_data.flat()).map(arrayToMap);
}