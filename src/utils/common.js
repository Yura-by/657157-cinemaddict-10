import moment from 'moment';

const Status = {
  NOVISE: `Novice`,
  FAN: `Fan`,
  BUFF: `Movie Buff`
};

const getDurationInFormat = (duration) => {
  const hour = Math.floor(duration / 60);
  const minutes = duration % 60;
  const hoursTemplate = hour ? `${hour}h` : ``;
  const minutesTemplate = minutes ? `${minutes}m` : ``;

  return `${hoursTemplate} ${minutesTemplate}`;
};

const getReleaseString = (date) => {
  return moment(date).format(`D MMMM YYYY`);
};

const getCommentDate = (date) => {
  return moment(date).format(`YYYY/MM/DD HH:mm`);
};

const getStatusName = (countWatched) => {
  let status = ``;
  switch (true) {
    case countWatched > 0 && countWatched <= 10 :
      status = Status.NOVISE;
      break;
    case countWatched > 10 && countWatched <= 20 :
      status = Status.FAN;
      break;
    case countWatched > 20:
      status = Status.BUFF;
      break;
  }
  return status;
};

const getAlreadyWatched = (movies) => {
  return movies.filter((movie) => movie.userDetails.alreadyWatched).length;
};

export {getDurationInFormat, getReleaseString, getCommentDate, getStatusName, getAlreadyWatched};
