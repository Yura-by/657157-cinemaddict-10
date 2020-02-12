const TITLES = [`A Man Who Stole The Storm`, `Raiders Who Sold Us`, `A Tale Of A Little Bird In The Void`, `A Tale Of A Little Bird On The Void`, `Laziness Within The Wall`, `Laziness Who Sold The Carpet`, `Guest Who Stole The Carpet`, `A Shark Who Sold The Void`, `A Tale Of A Little Bird Within The Wall`, `Guest Who Stole Him`, `Friends In The Storm`, `Country Who Sold Us`, `Country Who Bought Us`, `A Lion Who Saw The Wall`, `Country In The Room`, `Raiders Who Sold Himself`, `A Tale Of A Little Bird Within Themselves`, `Pioneers Without The Void`, `A Little Pony With The Room`, `A Little Pony With The Storm`];
const ALTERNATIVE_TITLES = [`Guest Who Saw Him`, `A Lion Who Sold The Void`, `A Tale Of A Little Bird On The Storm`, `Country In The Void`, `A Little Pony With Him`, `Pioneers Who Sold Himself`, `Country Who Sold Themselves`, `Friends On Themselves`, `Friends Who Stole Him`, `Country Who Sold The Wall`, `Laziness Of The Wall`, `Happiness Who Sold The Room`, `A Tale Of A Little Bird Of Him`, `A Man Who Sold Himself`, `A Little Pony Within The Floor`, `A Lion Who Sold Us`, `Friends Of The Wall`, `A Little Pony With The Darkness`, `Country With The Wall`, `A Shark Without Himself`];
const POSTERS = [`images/posters/made-for-each-other.png`, `images/posters/popeye-meets-sinbad.png`, `images/posters/santa-claus-conquers-the-martians.jpg`, `images/posters/the-man-with-the-golden-arm.jpg`, `images/posters/the-man-with-the-golden-arm.jpg`, `images/posters/santa-claus-conquers-the-martians.jpg`, `images/posters/popeye-meets-sinbad.png`, `images/posters/sagebrush-trail.jpg`, `images/posters/made-for-each-other.png`, `images/posters/sagebrush-trail.jpg`, `images/posters/made-for-each-other.png`, `images/posters/the-man-with-the-golden-arm.jpg`, `images/posters/the-great-flamarion.jpg`, `images/posters/the-man-with-the-golden-arm.jpg`, `images/posters/the-man-with-the-golden-arm.jpg`, `images/posters/the-man-with-the-golden-arm.jpg`, `images/posters/sagebrush-trail.jpg`, `images/posters/the-dance-of-life.jpg`, `images/posters/santa-claus-conquers-the-martians.jpg`, `images/posters/santa-claus-conquers-the-martians.jpg`];
const DIRECTORS = [`Akira Kurosawa`, `Tom Ford`, `Akira Kurosawa`, `Clint Eastwood`, `Quentin Tarantino`, `Brad Bird`, `James Cameron`, `Brad Bird`, `Quentin Tarantino`, `Clint Eastwood`, `Chrostopher Nolan`, `Quentin Tarantino`, `Clint Eastwood`, `Akira Kurosawa`, `James Cameron`, `James Cameron`, `Tom Ford`, `Akira Kurosawa`, `Brad Bird`, `Clint Eastwood`];

const getRandomNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomElementFromArray = (array) => {
  return array[getRandomNumber(0, (array.length - 1))]
};

const generateMovie = () => {
  return {
    filmInfo: {
      title: getRandomElementFromArray(TITLES),
      alternativeTitle: getRandomElementFromArray(ALTERNATIVE_TITLES),
      total_rating: `${getRandomNumber(1, 10).getRandomNumber(0, 9)}`,
      poster:getRandomElementFromArray(POSTERS),
      ageRating: getRandomNumber(6, 18),
      director: getRandomElementFromArray(DIRECTORS)
    },
    userDetails: {
      personal_rating: 9
    }
  }
}

/*film_info: {title: `A Man Who Stole The Storm`, alternative_title: `Guest Who Saw Him`, total_rating: 6.7,…}
title: `A Man Who Stole The Storm`
alternative_title: `Guest Who Saw Him`
total_rating: 6.7
poster: `images/posters/made-for-each-other.png`
age_rating: 6
director: `Akira Kurosawa`
writers: [`Martin Scorsese`, `Hayao Miazaki`]
0: `Martin Scorsese`
1: `Hayao Miazaki`
actors: [`Morgan Freeman `, `Tom Hanks`, `Christian Bale`, `Gary Oldman`, `Edward Norton`, `Cillian Murphy`]
0: `Morgan Freeman `
1: `Tom Hanks`
2: `Christian Bale`
3: `Gary Oldman`
4: `Edward Norton`
5: `Cillian Murphy`
release: {date: `2016-03-08T00:17:37.633Z`, release_country: `China`}
date: `2016-03-08T00:17:37.633Z`
release_country: `China`
runtime: 85
genre: [`Comedy`, `Horror`, `Thriller`]
0: `Comedy`
1: `Horror`
2: `Thriller`
description: `Oscar-winning film, a war drama about two young people, true masterpiece where love and death are closer to heroes than their family, from the creators of timeless classic `Nu, Pogodi!` and `Alice in Wonderland`, with the best fight scenes since Bruce Lee.`
user_details: {personal_rating: 9, watchlist: true, already_watched: true, watching_date: `2019-09-11T19:22:39.962Z`,…}
comments: [`90`, `91`, `92`]
1: {id: `1`,…}
2: {id: `2`, film_info: {title: `A Tale Of A Little Bird In The Void`,…},…}
3: {id: `3`,…}
4: {id: `4`,…}
5: {id: `5`,…}
6: {id: `6`,…}
7: {id: `7`,…}
8: {id: `8`,…}
9: {id: `9`,…}
10: {id: `10`,…}
11: {id: `11`,…}
12: {id: `12`,…}
13: {id: `13`,…}
14: {id: `14`,…}
15: {id: `15`,…}
16: {id: `16`,…}
17: {id: `17`,…}
18: {id: `18`,…}
19: {id: `19`,…}*/
