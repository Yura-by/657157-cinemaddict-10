const getRatingMovies = (movies) => {
  let topsRating = movies.slice()
    .sort((left, right) => right.filmInfo.totalRating - left.filmInfo.totalRating)
    .slice(0, 2);
  if (topsRating.length > 0 && topsRating[0].totalRating === 0) {
    topsRating = [];
  }
  return topsRating;
};

const getCommentsMovies = (movies) => {
  let topsComments = movies.slice()
    .sort((left, right) => right.comments.length - left.comments.length)
    .slice(0, 2);
  if (topsComments.length > 0 && topsComments[0].comments.length === 0) {
    topsComments = [];
  }
  return topsComments;
};

export {getRatingMovies, getCommentsMovies};
