const getDurationInFormat = (duration) => {
  const hour = Math.floor(duration / 60);
  const minutes = duration % 60;
  const hoursTemplate = hour ? `${hour}h` : ``;
  const minutesTemplate = minutes ? `${minutes}m` : ``;

  return `${hoursTemplate} ${minutesTemplate}`;
};

export {getDurationInFormat};
