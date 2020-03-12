import moment from 'moment';

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

export {getDurationInFormat, getReleaseString, getCommentDate};
