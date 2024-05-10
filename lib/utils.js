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

function pad(number) {
  return number < 10 ? "0" + number : number;
}

export function toLocalISOString(date) {
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    " " +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes())
  );
}

export const getRoundedDate = () => {
  const now = new Date();
  const minutes = now.getMinutes();
  const roundedMinutes = Math.round(minutes / 20) * 20;
  now.setMinutes(roundedMinutes);
  now.setSeconds(0);
  now.setMilliseconds(0);
  return now;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

function hslToHex(h, s, l) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function magnitudeToColor(magnitude) {
  const h = magnitude * 100;
  return hslToHex(80 - h, 100, 50);
}
