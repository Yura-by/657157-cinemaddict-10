import {Emotion} from '../const.js';

const TITLES = [`A Man Who Stole The Storm`, `Raiders Who Sold Us`, `A Tale Of A Little Bird In The Void`, `A Tale Of A Little Bird On The Void`, `Laziness Within The Wall`, `Laziness Who Sold The Carpet`, `Guest Who Stole The Carpet`, `A Shark Who Sold The Void`, `A Tale Of A Little Bird Within The Wall`, `Guest Who Stole Him`, `Friends In The Storm`, `Country Who Sold Us`, `Country Who Bought Us`, `A Lion Who Saw The Wall`, `Country In The Room`, `Raiders Who Sold Himself`, `A Tale Of A Little Bird Within Themselves`, `Pioneers Without The Void`, `A Little Pony With The Room`, `A Little Pony With The Storm`];
const ALTERNATIVE_TITLES = [`Guest Who Saw Him`, `A Lion Who Sold The Void`, `A Tale Of A Little Bird On The Storm`, `Country In The Void`, `A Little Pony With Him`, `Pioneers Who Sold Himself`, `Country Who Sold Themselves`, `Friends On Themselves`, `Friends Who Stole Him`, `Country Who Sold The Wall`, `Laziness Of The Wall`, `Happiness Who Sold The Room`, `A Tale Of A Little Bird Of Him`, `A Man Who Sold Himself`, `A Little Pony Within The Floor`, `A Lion Who Sold Us`, `Friends Of The Wall`, `A Little Pony With The Darkness`, `Country With The Wall`, `A Shark Without Himself`];
const POSTERS = [`images/posters/made-for-each-other.png`, `images/posters/popeye-meets-sinbad.png`, `images/posters/santa-claus-conquers-the-martians.jpg`, `images/posters/the-man-with-the-golden-arm.jpg`, `images/posters/the-man-with-the-golden-arm.jpg`, `images/posters/santa-claus-conquers-the-martians.jpg`, `images/posters/popeye-meets-sinbad.png`, `images/posters/sagebrush-trail.jpg`, `images/posters/made-for-each-other.png`, `images/posters/sagebrush-trail.jpg`, `images/posters/made-for-each-other.png`, `images/posters/the-man-with-the-golden-arm.jpg`, `images/posters/the-great-flamarion.jpg`, `images/posters/the-man-with-the-golden-arm.jpg`, `images/posters/the-man-with-the-golden-arm.jpg`, `images/posters/the-man-with-the-golden-arm.jpg`, `images/posters/sagebrush-trail.jpg`, `images/posters/the-dance-of-life.jpg`, `images/posters/santa-claus-conquers-the-martians.jpg`, `images/posters/santa-claus-conquers-the-martians.jpg`];
const DIRECTORS = [`Akira Kurosawa`, `Tom Ford`, `Akira Kurosawa`, `Clint Eastwood`, `Quentin Tarantino`, `Brad Bird`, `James Cameron`, `Brad Bird`, `Quentin Tarantino`, `Clint Eastwood`, `Chrostopher Nolan`, `Quentin Tarantino`, `Clint Eastwood`, `Akira Kurosawa`, `James Cameron`, `James Cameron`, `Tom Ford`, `Akira Kurosawa`, `Brad Bird`, `Clint Eastwood`];
const WRITERS = [`Robert Rodrigues`, `Takeshi Kitano`, `Quentin Tarantino`, `Takeshi Kitano`, `Hayao Miazaki`, `Robert Zemeckis`, `Robert Rodrigues`, `Stephen King`];
const COUNTRIES = [`Russia`, `Italy`, `Germany`, `Russia`, `Spain`, `Japan`, `Japan`, `Russia`, `Finland`, `France`, `Germany`, `Japan`, `Italy`, `Japan`, `Japan`, `USA`, `Germany`, `Spain`, `Finland`, `Spain`];
const GENRES = [`Sci-Fi`, `Adventure`, `Family`, `Thriller`, `Animation`, `Drama`, `Horror`, `Thriller`, `Action`, `Comedy`, `Horror`, `Sci-Fi`];
const SENTENCES_DESCRIPTION = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`, `Cras aliquet varius magna, non porta ligula feugiat eget.`, `Fusce tristique felis at fermentum pharetra.`, `Aliquam id orci ut lectus varius viverra.`, `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`, `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`, `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`, `Sed sed nisi sed augue convallis suscipit in sed felis.`, `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.`, `In rutrum ac purus sit amet tempus.`];

const getRandomNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomElementFromArray = (array) => {
  return array[getRandomNumber(0, (array.length - 1))];
};

const getRandomArray = (array, length = 3, minValue = 0) => {
  return Array(getRandomNumber(minValue, length)).fill(``)
    .map(() => getRandomElementFromArray(array));
};

const getRandomDate = () => {
  return new Date(getRandomNumber(631138520, Date.now()));
};

const getDescription = (sentenses) => {
  return getRandomArray(sentenses, getRandomNumber(1, 5), 1).join(``);
};

const getDateWatching = (isWaiting) => {
  return isWaiting ? new Date(getRandomNumber(1567382400000, Date.now())) : null;
};

const createComment = (id) => {
  return {
    id,
    author: String(getRandomElementFromArray(DIRECTORS)),
    emotion: String(getRandomElementFromArray(Emotion)),
    comment: String(getDescription(SENTENCES_DESCRIPTION)),
    date: String(getDateWatching(true).toISOString())
  };
};

const getComments = (commentIds) => {
  return commentIds.map((commentId) => {
    return createComment(commentId);
  });
};

let count = 0;
const maxCommentNumber = 200;

const createArrayComments = () => {
  const result = [];
  for (let i = count + 1; i < maxCommentNumber; i++) {
    result.push(String(i));
    count = i;
    if (result.length >= getRandomNumber(2, 6)) {
      return result;
    }
  }
};

const generateMovie = () => {
  const alreadyWatched = Math.random() > 0.5;
  return {
    id: Math.floor(new Date().getTime() + Math.random() * 1000000),
    filmInfo: {
      title: getRandomElementFromArray(TITLES),
      alternativeTitle: getRandomElementFromArray(ALTERNATIVE_TITLES),
      totalRating: `${getRandomNumber(1, 9)}.${getRandomNumber(0, 9)}`,
      poster: getRandomElementFromArray(POSTERS),
      ageRating: getRandomNumber(6, 18),
      director: getRandomElementFromArray(DIRECTORS),
      writers: getRandomArray(WRITERS, 2, 1),
      actors: getRandomArray(WRITERS, 4, 1),
      release: {
        date: getRandomDate(),
        releaseCountry: getRandomElementFromArray(COUNTRIES)
      },
      runtime: getRandomNumber(0, 230),
      genre: getRandomArray(GENRES, 3, 1),
      description: getDescription(SENTENCES_DESCRIPTION)
    },
    userDetails: {
      personalRating: alreadyWatched ? getRandomNumber(1, 9) : 0,
      watchlist: Math.random() > 0.5,
      alreadyWatched,
      watchingDate: getDateWatching(alreadyWatched),
      favorite: Math.random() > 0.5
    },
    comments: createArrayComments()
  };
};

const generateMovies = (howMatch) => {
  return Array(howMatch).fill(``)
    .map(() => generateMovie());
};

export {generateMovie, generateMovies, getRandomNumber, getRandomElementFromArray, DIRECTORS, getDescription, SENTENCES_DESCRIPTION, getDateWatching, getComments};
