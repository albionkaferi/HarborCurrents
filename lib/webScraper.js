async function formatPredicted() {
  let response = await fetch("https://api.harborcurrents.com/series");
  let jsonData = await response.json();
  let { start, end, data } = jsonData;
  start = new Date(start);
  end = new Date(end);
  const step = (end - start) / (data.length - 1);

  const data_points = [];
  for (let i = 0; i < data.length; i++) {
    const point = data[i];
    const date = new Date(start.getTime() + step * i);
    data_points.push([point, date]);
  }
  return data_points;
}

async function formatActual() {
  let response = await fetch(
    "https://cdn.tidesandcurrents.noaa.gov/ports/plots/n06010_cu_pred_24.html"
  );
  let data = await response.text();
  data = data.match(/[^\r\n]+/g);
  data = data.slice(23, -1);

  const data_points = [];
  for (let i = 0; i < data.length; i++) {
    const [pdate, ptime, ptz, pamount] = data[i].replace("  ", " ").split(" ");
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

export async function formatBoth() {
  const predicted = await formatPredicted();
  const actual = await formatActual();

  // trim left
  if (actual[0][1] < predicted[0][1]) {
    while (actual[0][1] < predicted[0][1]) {
      actual.shift();
    }
  } else if (actual[0][1] > predicted[0][1]) {
    while (actual[0][1] > predicted[0][1]) {
      predicted.shift();
    }
  }

  // trim right
  if (actual[actual.length - 1][1] > predicted[predicted.length - 1][1]) {
    while (actual[actual.length - 1][1] > predicted[predicted.length - 1][1]) {
      actual.pop();
    }
  } else if (
    actual[actual.length - 1][1] < predicted[predicted.length - 1][1]
  ) {
    while (actual[actual.length - 1][1] < predicted[predicted.length - 1][1]) {
      predicted.pop();
    }
  }

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
    if (diff > current_diff) {
      labels.push(`${diff}`);
      current_diff = diff;
    } else labels.push("");
  }

  return { actual, predicted, labels, originalDate };
}
