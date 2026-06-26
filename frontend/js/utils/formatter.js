export function convertPaceToReadablePace(pace) {
    let minutes = Math.floor(pace);
    let seconds = Math.round((pace - minutes) * 60);

    if (seconds === 60) {
        seconds = 0;
        minutes += 1;
    }
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function convertMinutesToReadableHours(minutes) {
    let hours = Math.floor(minutes / 60);
    let remainingMinutes = Math.round(minutes % 60);

    if (remainingMinutes === 60) {
        hours += 1;
        remainingMinutes = 0;
    }

    return `${hours}:${remainingMinutes.toString().padStart(2, "0")} h`;
}

export function roundToTwoDecimals(num) {
    return num.toFixed(2);
}

export function metersPerSecondToKmPerHour(meterPerSecond) {
    const meterPerHour = meterPerSecond * 60 * 60;
    const kmPerHour = meterPerHour / 1000;
    return roundToTwoDecimals(kmPerHour);
}