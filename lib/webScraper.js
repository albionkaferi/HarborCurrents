async function formatPredicted(token) {
  let response = await fetch("https://api.harborcurrents.com/series", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  let jsonData = await response.json();
  let { start, end, data } = jsonData;
  start = new Date(start);
  end = new Date(end);
  const step = (end - start) / (data.length - 1);

  const data_points = [];
  for (let i = 0; i < data.length; i++) {
    const point = data[i] * 1.94384;
    const date = new Date(start.getTime() + step * i);
    data_points.push([point, date]);
  }
  return data_points;
}

async function formatActual() {
  let response = await fetch(
    "https://cdn.tidesandcurrents.noaa.gov/ports/plots/n06010_cu_obs_72.html"
  );
  let data = await response.text();
  data = data.match(/[^\r\n]+/g);
  data = data.slice(26, -1);

  const data_points = [];
  for (let i = 0; i < data.length; i++) {
    const [pdate, ptime, ptz, _cs, _dr, pamount, _ev] = data[i]
      .replace(/\s+/g, " ")
      .split(" ");
    const [pyear, pmonth, pday] = pdate.split("/");
    const [phour, pminute] = ptime.split(":");
    const date_string = `${pyear}-${pmonth}-${pday}T${phour}:${pminute}:00.000${
      ptz === "EDT" ? "-04:00" : "-05:00"
    }`;
    const date_obj = new Date(Date.parse(date_string));
    data_points.push([Number(pamount), date_obj]);
  }
  return data_points;
}

export const expandData = (sourceData, targetLength) => {
  const expanded = [];
  const factor = (sourceData.length - 1) / (targetLength - 1);
  for (let i = 0; i < targetLength; i++) {
    const index = i * factor;
    const lowerIndex = Math.floor(index);
    const upperIndex = Math.ceil(index);
    const t = index - lowerIndex;
    if (lowerIndex === upperIndex) {
      expanded.push(sourceData[lowerIndex]);
    } else {
      const interpolatedValue =
        (1 - t) * sourceData[lowerIndex] + t * sourceData[upperIndex];
      expanded.push(interpolatedValue);
    }
  }
  return expanded;
};

export const shrinkData = (sourceData, targetLength) => {
  const shrunk = [];
  const factor = sourceData.length / targetLength;
  for (let i = 0; i < targetLength; i++) {
    const start = Math.floor(i * factor);
    const end = Math.floor((i + 1) * factor);
    const segment = sourceData.slice(start, end);
    const average =
      segment.reduce((sum, value) => sum + value, 0) / segment.length;
    shrunk.push(average);
  }
  return shrunk;
};

export async function formatBoth(token) {
  let predicted = await formatPredicted(token);
  let actual = await formatActual();

  // error if no data found
  if (!predicted.length || !actual.length) {
    throw !actual.length ? "NOAA data unavailable" : "Prediction model data unavailable";
  }

  const startTime = predicted[0][1];
  let i = 0;
  for (; i < actual.length; i++) {
    if (actual[i][1] >= startTime) break;
  }

  const endTime = actual[actual.length - 1][1];
  let j = predicted.length - 1;
  for (; j > 0; j--) {
    if (predicted[j][1] <= endTime) break;
  }

  // error if no data found
  if (startTime >= endTime) {
    throw "Server Error, incompatible data found";
  }

  actual = actual.slice(i);
  predicted = predicted.slice(0, j + 1);

  // get start date label
  const dateObj = actual[0][1];
  const options = {
    day: "2-digit",
    year: "numeric",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  const originalDate = dateObj.toLocaleDateString("en-US", options);

  // get label list
  const diff_hours = (d1, d2) => Math.floor((d2 - d1) / 3600000);
  let start_time = actual[0][1];
  let current_diff = 0;
  const labels = ["0"];
  for (const point of actual) {
    const diff = diff_hours(start_time, point[1]);
    if (diff > current_diff && diff % 5 === 0) {
      labels.push(`${diff}`);
      current_diff = diff;
    } else labels.push("");
  }

  actual = actual.map((it) => {
    if (typeof it[0] === "number") return it[0];
  });
  predicted = predicted.map((it) => {
    if (typeof it[0] === "number") return it[0];
  });
  predicted = expandData(predicted, actual.length);

  return { actual, predicted, labels, originalDate };
}
