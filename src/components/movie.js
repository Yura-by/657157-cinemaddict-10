const getDurationInFormat = (duration) => {
  const hour = Math.floor(duration / 60);
  const minutes = duration % 60;
  const hoursTemplate = hour ? `${hour}h` : ``;
  const minutesTemplate = minutes ? `${minutes}m` : ``;

  return `${hoursTemplate}${minutesTemplate}`;
};

export const createMovieTemplate = (movie) => {
  console.log(movie)
  const {filmInfo: {poster}, filmInfo: {title}, filmInfo: {totalRating}, filmInfo: {release: {date}}, filmInfo: {runtime}, filmInfo: {genre}, filmInfo: {description}, filmInfo: {comments}} = movie;
  const duration = getDurationInFormat(runtime);
  const year = date.getFullYear();
  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">Musical</span>
      </p>
      <img src="./images/posters/the-dance-of-life.jpg" alt="" class="film-card__poster">
      <p class="film-card__description">Burlesque comic Ralph "Skid" Johnson (Skelly), and specialty dancer Bonny Lee King (Carroll), end up together on a cold, rainy night at a tr…</p>
      <a class="film-card__comments">5 comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
      </form>
    </article>`
  );
};
