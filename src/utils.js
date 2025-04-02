// src/utils.js
export const formatDate = (dateString, options) => {
  const [year, month, dayOfMonth] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, dayOfMonth);
  return date.toLocaleDateString("en-US", options);
};

export const formatTime = (timeString, date) => {
  const [hours, minutes] = timeString.split(/[:\s]/).map(Number);
  const timeDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes
  );
  return timeDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

const adjustHourData = (hourData) => {
  // Extract year, month, day, hours, and minutes from hourData.time
  const [hourDatePart, hourTimePart] = hourData.time.split(" ");
  const [hourYear, hourMonth, hourDay] = hourDatePart.split("-").map(Number);
  const [hourHours, hourMinutes] = hourTimePart.split(":").map(Number);

  // Create a Date object using the extracted components
  const hourTime = new Date(
    hourYear,
    hourMonth - 1,
    hourDay,
    hourHours,
    hourMinutes
  );
  const adjustedHour = hourTime.getHours();
  const formattedHour = adjustedHour % 12 || 12; // Convert to 12-hour format
  const ampm = adjustedHour < 12 ? "AM" : "PM";
  const adjustedDay = hourTime.getDate();

  return {
    ...hourData,
    adjustedTime: `${formattedHour} ${ampm}`,
    adjustedHour: adjustedHour,
    adjustedDay: adjustedDay,
  };
};

export const processHourlyForecast = (forecast, localDate, hoursToShow) => {
  let currentHour = localDate.getHours();
  const currentDay = localDate.getDate();

  currentHour = (currentHour + 1) % 24;
  let adjustedForecast = forecast.forecastday[0].hour
    .map((hour) => adjustHourData(hour))
    .filter((hour) => {
      return (
        hour.adjustedDay === currentDay && hour.adjustedHour >= currentHour
      );
    });

  if (
    adjustedForecast.length < hoursToShow &&
    forecast.forecastday.length > 1
  ) {
    const nextDayForecast = forecast.forecastday[1].hour
      .map((hour) => adjustHourData(hour))
      .filter((hour) => hour.adjustedDay !== currentDay)
      .slice(0, hoursToShow - adjustedForecast.length);
    adjustedForecast.push(...nextDayForecast);
  }
  return adjustedForecast.slice(0, hoursToShow);
};
